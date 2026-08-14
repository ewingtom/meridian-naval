import * as THREE from 'three';
import { Projectile } from './Projectile.js';
import { Explosion } from './Explosion.js';
import { LaunchEffect } from './LaunchEffect.js';
import { getWeaponFx } from './FxParticles.js';
import { CiwsMountManager } from './CiwsMount.js';
import { tickAllDamage } from '../systems/DamageModel.js';

const _v = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _v3 = new THREE.Vector3();
const CIWS_ROUND_SPEED = 1120;
const CIWS_KILL_RADIUS = 9;

/** Closest distance from point `p` to the swept segment a→b. Used so a 1100 m/s CIWS
 * round can't tunnel straight past its target between two frames. */
function segmentPointDistance(a, b, p) {
  _v.subVectors(b, a);
  const len2 = _v.lengthSq();
  if (len2 < 1e-6) return a.distanceTo(p);
  const t = THREE.MathUtils.clamp(_v2.subVectors(p, a).dot(_v) / len2, 0, 1);
  return _v3.copy(a).addScaledVector(_v, t).distanceTo(p);
}

// --- Saturation-based point-defense intercept probability ------------------------
// A single Phalanx-class mount (ciwsRangeM=900, CIWS_KILL_RADIUS=9 above) is a very
// reliable last-ditch shot against ONE inbound missile — real-world Pk figures for a
// lone subsonic-ish ASM run high. But CiwsMountManager (CiwsMount.js) only ever trains
// each mount on the single nearest threat at a time, so a raid that puts several
// missiles into the envelope simultaneously divides the mount's attention: some
// threats simply don't get engaged in time. Model that as Pk falling off with
// saturation, not as a flat per-shot coin-flip — a lone shot should almost always
// work, a heavy raid should sometimes leak one through, and that should read as an
// emergent consequence of raid size rather than random noise on every single round.
const CIWS_LONE_PK = 0.93; // one threat in the envelope: near-certain kill
const CIWS_SATURATED_PK = 0.38; // Pk floor once the envelope is saturated
const CIWS_SATURATION_COUNT = 5; // simultaneous threats at which Pk bottoms out

function ciwsInterceptPk(saturationCount) {
  const t = THREE.MathUtils.clamp((saturationCount - 1) / (CIWS_SATURATION_COUNT - 1), 0, 1);
  return THREE.MathUtils.lerp(CIWS_LONE_PK, CIWS_SATURATED_PK, t);
}

const PLAYER_WEAPONS = {
  gun: { label: '130mm Deck Gun', ammoKey: null, cooldown: 0.7, projType: 'playerShell' },
  missile: { label: 'Anti-Ship Missile', ammoKey: 'missile', maxAmmo: 12, cooldown: 1.6, projType: 'playerMissile' },
  sam: { label: 'Air Defense Missile', ammoKey: 'sam', maxAmmo: 24, cooldown: 1.1, projType: 'playerSam' },
  lacm: { label: 'Land Attack Cruise', ammoKey: 'lacm', maxAmmo: 8, cooldown: 2.8, projType: 'playerLacm' },
  torpedo: { label: 'ASROC Torpedo', ammoKey: 'torpedo', maxAmmo: 8, cooldown: 2.4, projType: 'playerTorpedo' },
  drone: { label: 'Recon Drone', ammoKey: 'drone', maxAmmo: 2, cooldown: 3, projType: 'drone' },
};

const LAUNCH_FX = {
  playerShell: { scale: 0.45, color: 0xffe08a },
  playerMissile: { scale: 2.1, color: 0xffc070 },
  playerSam: { scale: 1.85, color: 0x9ad8ff },
  playerLacm: { scale: 2.35, color: 0xd2c48a },
  playerTorpedo: { scale: 1.15, color: 0xa8d8e8 },
  enemyShell: { scale: 0.4, color: 0xff8a5a },
  enemyMissile: { scale: 1.9, color: 0xff7040 },
  airMissile: { scale: 1.45, color: 0xff7040 },
  torpedo: { scale: 0.9, color: 0x88c0c8, underwater: true },
  ciwsRound: { scale: 0.25, color: 0xffe98a },
};

export class WeaponsSystem {
  constructor(scene, callbacks = {}) {
    this.scene = scene;
    this.projectiles = [];
    this.explosions = [];
    this.launchFx = [];
    this.cb = callbacks; // { onFire, onExplosion, onHit(entity,dmg), onShipHit(ship,dmg) }

    this.ammo = { missile: 12, sam: 24, lacm: 8, torpedo: 8, drone: 2 };
    this.selectedWeapon = 'gun';
    this._cooldowns = { gun: 0, missile: 0, sam: 0, lacm: 0, torpedo: 0, drone: 0 };

    this.ciwsRangeM = 900;
    // EW soft-kill range is well outside CIWS's hard-kill range — a missile gets an
    // early EW pass (chaff/decoy, cheaper, doesn't require the threat to be nearly on
    // top of you) before it ever reaches CIWS range for a last-ditch shoot-down.
    this.chaffRangeM = 3000;

    this.selectedTargetId = null;

    // --- VFX ---------------------------------------------------------------
    // Three pooled draw calls (smoke, fire/sparks, tracers) shared by every weapon,
    // plus the visible, slewing CIWS mounts.
    this.fx = getWeaponFx(scene);
    this.ciwsMounts = new CiwsMountManager(scene);
    this._elapsed = 0;
    this._ocean = null;
    this._waveY = null;
  }

  /** Let the host app hand us the ocean so sea-skimming missiles can hold altitude
   * over the real wave surface. Falls back to auto-discovery via window.GAME.ocean
   * so this works without touching the bootstrap. */
  setOcean(ocean) {
    this._ocean = ocean;
    this._waveY = ocean?.getHeightAt
      ? (x, z) => this._ocean.getHeightAt(x, z, this._elapsed)
      : null;
  }

  _waveSampler() {
    if (this._waveY) return this._waveY;
    const ocean = typeof window !== 'undefined' ? window.GAME?.ocean : null;
    if (ocean?.getHeightAt) this.setOcean(ocean);
    return this._waveY;
  }

  /** Soft-kill defense: spoof the nearest inbound missile threatening `ship` with
   * chaff/decoys. Distinct mechanic from CIWS (which shoots the missile down at much
   * closer range) — this just needs the missile to believe the decoy is the real
   * target, so no ammo is "fired" at the missile's actual position. Returns true if a
   * threat was found and chaff was expended (independent of whether the spoof rolls
   * successful — trying and missing is still a valid, informative outcome). */
  deployChaff(ship) {
    if (!ship?.alive || ship.chaffAmmo <= 0 || ship._chaffCooldown > 0) return false;
    const shipPos = ship.group.position;
    const threat = this.projectiles.find(
      (p) => !p.dead && ['enemyMissile', 'airMissile'].includes(p.type) &&
        p.position.distanceTo(shipPos) < this.chaffRangeM
    );
    if (!threat) return false;
    ship.chaffAmmo -= 1;
    ship._chaffCooldown = 4;
    const spoofed = Math.random() < 0.65;
    if (spoofed) {
      threat.dead = true;
      this.explode(threat.position.clone(), { scale: 0.45, decoy: true });
      // Burst of decoy blooms along the break track
      const dir = threat.velocity?.clone?.() || new THREE.Vector3(0, 1, 0);
      if (dir.lengthSq() < 0.01) dir.set(0, 1, 0);
      dir.normalize();
      for (let i = 0; i < 3; i++) {
        const pos = threat.position.clone().addScaledVector(dir, -4 - i * 5)
          .add(new THREE.Vector3((Math.random() - 0.5) * 6, Math.random() * 4, (Math.random() - 0.5) * 6));
        this.launchFx.push(new LaunchEffect(this.scene, pos, {
          scale: 0.7 + Math.random() * 0.4,
          color: 0xffe0a0,
        }));
      }
    }
    this.cb.onChaff?.(ship, spoofed);
    return true;
  }

  selectWeapon(key) {
    if (PLAYER_WEAPONS[key]) this.selectedWeapon = key;
  }

  canFireSelected() {
    const w = PLAYER_WEAPONS[this.selectedWeapon];
    if (this._cooldowns[this.selectedWeapon] > 0) return false;
    if (w.ammoKey && this.ammo[w.ammoKey] <= 0) return false;
    return true;
  }

  /** Fire the currently-selected weapon from `fromPos` toward `targetPos`/`targetEntity`. */
  firePlayerWeapon(fromPos, targetPos, targetEntity = null) {
    const key = this.selectedWeapon;
    const w = PLAYER_WEAPONS[key];
    if (!this.canFireSelected()) return false;

    this._cooldowns[key] = w.cooldown;
    if (w.ammoKey) this.ammo[w.ammoKey]--;

    // Return the spawned projectile (truthy — existing callers only test it for
    // truthiness) so the caller can, e.g., snap the missile-follow camera onto it.
    const p = this.spawn(w.projType, fromPos, targetPos, { targetEntity });
    this.cb.onFire?.(key);
    return p;
  }

  spawn(type, fromPos, targetPos, opts = {}) {
    const p = new Projectile(type, fromPos, targetPos, { ...opts, scene: this.scene });
    this.projectiles.push(p);

    // CIWS rounds get no launch bloom of their own — the mount's muzzle flash and the
    // tracer stream are the visual, and one bloom per round at 8/s would white out.
    const fx = type === 'ciwsRound' ? null : LAUNCH_FX[type];
    if (fx) {
      // The round's own initial attitude drives the effect, so a vertical VLS shot
      // blows its efflux straight up off the deck while a canister shot blows it aft.
      const loft = p.velocity.lengthSq() > 0.01
        ? p.velocity.clone().normalize()
        : new THREE.Vector3().subVectors(targetPos, fromPos);
      if (loft.lengthSq() < 0.01) loft.set(0, 1, 0);
      loft.normalize();
      this.launchFx.push(new LaunchEffect(this.scene, fromPos.clone(), { ...fx, loft }));

      // Big, lingering deflected-exhaust cloud at the tube. This is the part that
      // makes a launch unmistakable from any station or camera angle.
      if (p.cfg.asm || p.cfg.asroc) {
        this.fx.launchCloud(fromPos, loft, {
          scale: fx.scale * (p.cfg.asm?.vls ? 1.15 : 0.95),
          color: fx.underwater ? 0xcfeeff : 0x9fa3a8,
          hot: fx.color,
        });
      }
    }
    return p;
  }

  explode(position, opts) {
    this.explosions.push(new Explosion(this.scene, position, opts));
    this.cb.onExplosion?.(position, opts);
  }

  /** `ships`: every crewed ship in play (Meridian + task-force escorts) — hostile
   * ordnance can hit any of them and each defends itself with its own CIWS mount,
   * instead of everything but one hardcoded ship being invulnerable set-dressing. */
  update(dt, { ships, enemies, elapsed, camera }) {
    for (const k in this._cooldowns) this._cooldowns[k] = Math.max(0, this._cooldowns[k] - dt);

    // Every pooled VFX system runs off one shared clock so particles spawned by any
    // weapon this frame age consistently.
    this._elapsed = elapsed;
    this.fx.update(elapsed);
    const waveY = this._waveSampler();
    const flightCtx = { now: elapsed, waveY };

    // --- damage progression for every hull in play (fires spreading, flooding
    // building, damage-control parties winning or losing). Driven from here
    // because this is the one system guaranteed to run exactly once per
    // simulated frame with the whole cast in scope. See systems/DamageModel.js.
    tickAllDamage(dt);
    // A ship can now be lost to fire or flooding with no new round landing;
    // reuse the existing onShipHit channel so the local player's loss/impact
    // feedback (and the game-over check hanging off it) still fires.
    for (const ship of ships) {
      if (ship.damage?.lost && !ship._lossNotified) {
        ship._lossNotified = true;
        this.cb.onShipHit?.(ship, ship.maxHealth * 0.25);
      }
    }

    // --- CIWS mounts: keep them stuck to their ships and tracking the nearest
    // airborne threat, so a mount is already laid on the bearing before it opens up.
    const airThreats = this.projectiles.filter(
      (p) => !p.dead && (p.type === 'enemyMissile' || p.type === 'airMissile')
    );
    this.ciwsMounts.update(dt, elapsed, ships, airThreats);

    // --- CIWS auto-defense: each ship intercepts incoming ordnance aimed near it ---
    for (const ship of ships) {
      if (!ship.alive) continue;
      ship._ciwsCooldown = Math.max(0, ship._ciwsCooldown - dt);
      if (ship._ciwsCooldown > 0 || ship.ciwsAmmo <= 0) continue;
      const shipPos = ship.group.position;
      const threat = this.projectiles.find(
        (p) => !p.dead && ['enemyMissile', 'torpedo', 'airMissile'].includes(p.type) &&
          p.position.distanceTo(shipPos) < this.ciwsRangeM
      );
      if (threat && threat.type !== 'torpedo') {
        // Resolve this threat-vs-defender engagement's intercept odds exactly once —
        // the first time THIS ship takes it under fire — instead of rolling again on
        // every 0.12s cooldown tick. Re-rolling every tick would make a sub-100% Pk
        // meaningless (a handful of rolls per second all but guarantees an eventual
        // "hit") and would flicker the outcome frame to frame. Cached on the threat
        // itself, keyed by which ship resolved it, so subsequent rounds this ship
        // fires at the same threat honor the original roll.
        if (threat._pdRoll?.shipId !== ship.id) {
          let saturation = 0;
          for (const t of this.projectiles) {
            if (!t.dead && (t.type === 'enemyMissile' || t.type === 'airMissile') &&
              t.position.distanceTo(shipPos) < this.ciwsRangeM) saturation++;
          }
          const pk = ciwsInterceptPk(saturation);
          threat._pdRoll = { shipId: ship.id, pk, willIntercept: Math.random() < pk };
        }

        ship._ciwsCooldown = 0.12;
        ship.ciwsAmmo -= 1;

        // Fire from the mount that's actually pointing at the threat, and lead the
        // target by the round's time of flight the way a real fire-control loop does.
        const mount = this.ciwsMounts.best(ship, threat.position);
        const from = mount
          ? mount.muzzleWorld(new THREE.Vector3())
          : shipPos.clone().add(new THREE.Vector3(0, 14, 0));
        const tof = from.distanceTo(threat.position) / CIWS_ROUND_SPEED;
        const aim = threat.position.clone().addScaledVector(threat.velocity, tof);

        this.spawn('ciwsRound', from, aim, { targetEntity: threat });

        // The visual: a dense stream of tracers, not one slow bullet. Phalanx runs
        // ~4500 rpm, so each 0.12s trigger pull is a handful of rounds in the air.
        const dir = aim.clone().sub(from).normalize();
        this.fx.ciwsBurst(from, dir, from.distanceTo(aim), {
          rounds: 18,
          color: 0xfff6c0,
          spread: 0.028,
        });
        mount?.onFire(elapsed);
        this.cb.onFire?.('ciws');
      }
    }

    // Burning hulls — continuous fire/smoke so damage reads on the water, not only in logs.
    for (const ship of ships) {
      const intensity = ship.damage?.fire ?? ship.fireIntensity ?? 0;
      if (intensity > 0.04) this.fx.hullFire(ship.group.position, intensity);
    }
    for (const e of enemies) {
      const intensity = e.damage?.fire ?? 0;
      if (intensity > 0.04) {
        const p = e.getAimPoint?.(_v) || e.group?.position || e.position;
        this.fx.hullFire(p, intensity);
      }
    }

    // --- EW early warning: fires once per missile per ship the instant it comes
    // within chaff range, well before CIWS would ever see it, so there's a real
    // window to react with deployChaff() instead of it just being CIWS's job alone ---
    for (const ship of ships) {
      if (!ship.alive) continue;
      ship._chaffCooldown = Math.max(0, ship._chaffCooldown - dt);
      const shipPos = ship.group.position;
      for (const p of this.projectiles) {
        if (p.dead || !['enemyMissile', 'airMissile'].includes(p.type)) continue;
        if (ship._ewWarned.has(p.id)) continue;
        if (p.position.distanceTo(shipPos) < this.chaffRangeM) {
          ship._ewWarned.add(p.id);
          this.cb.onEwWarning?.(ship, p);
        }
      }
    }

    // --- update projectiles, collide vs entities / ships ---
    for (const p of this.projectiles) {
      if (p.dead) continue;
      p.update(dt, camera, flightCtx);

      // ASROC / torpedo water entry splash
      if (p.didSplash && p.splashPos) {
        this.explode(p.splashPos.clone(), { scale: 0.85, underwater: true });
        this.launchFx.push(new LaunchEffect(this.scene, p.splashPos.clone(), {
          scale: 1.1,
          color: 0xc8f4ff,
          underwater: true,
          loft: new THREE.Vector3(0, 1, 0),
        }));
        p.didSplash = false;
        p.splashPos = null;
      }

      // CIWS rounds intercept the projectile they were fired at. Tested against the
      // swept path, not the instantaneous position — at 1100 m/s a round covers ~18 m
      // per frame and would otherwise flick straight through the target.
      if (p.type === 'ciwsRound' && p.targetEntity && !p.targetEntity.dead) {
        const threatPos = p.targetEntity.position;
        if (segmentPointDistance(p.prevPosition, p.position, threatPos) < CIWS_KILL_RADIUS) {
          // Whether this threat dies was already decided when its defender first
          // engaged it (see the CIWS auto-defense loop above) — geometry alone no
          // longer guarantees a kill. The round is expended either way (real ammo,
          // real tracer burst); under saturation it can simply miss and the threat
          // leaks through to the deterministic ship-hit check below.
          const willIntercept = p.targetEntity._pdRoll?.willIntercept !== false;
          p.dead = true;
          if (willIntercept) {
            const killPos = threatPos.clone();
            p.targetEntity.dead = true;
            // Frag airburst — white flash + shrapnel star; distinct from a hull hit.
            this.explode(killPos, { scale: 1.35, airburst: true });
            this.fx.airburst(killPos, { scale: 2.1 });
          }
        }
        continue;
      }

      if (p.dead) {
        if (p.exploded) this.explode(p.position.clone(), { scale: 0.6, underwater: p.cfg.underwater });
        continue;
      }

      // LACM proximity fuse against a land aimpoint (no living entity to collide with).
      if (p.type === 'playerLacm' && p.targetPos && (!p.targetEntity || p.targetEntity.isLandTarget)) {
        const aimY = p.targetPos.y ?? 8;
        if (p.position.distanceTo(p.targetPos) < (p.cfg.radius || 36)
          || (p.position.y <= aimY + 2 && p.position.distanceToSquared(p.targetPos) < 90 * 90)) {
          this.explode(p.position.clone(), { scale: 2.6 });
          this.cb.onLandStrike?.(p.targetPos.clone(), p);
          p.dead = true;
          continue;
        }
      }

      const isFriendlyWeapon = ['playerShell', 'playerMissile', 'playerSam', 'playerLacm', 'playerTorpedo', 'ciwsRound'].includes(p.type);
      if (isFriendlyWeapon) {
        for (const e of enemies) {
          if (!e.alive || e.destroyed) continue;
          if (e.domain === 'SUBSURFACE' && p.type !== 'playerTorpedo') continue;
          if (e.domain === 'AIR' && (p.type === 'playerTorpedo' || p.type === 'playerLacm')) continue;
          if (e.domain === 'SURFACE' && p.type === 'playerSam') continue;
          if (e.domain !== 'AIR' && p.type === 'playerSam') continue;
          const aim = e.getAimPoint ? e.getAimPoint(_v) : e.position;
          const hitR = (e.hitRadius || 28) + (p.cfg.radius || 12) * 0.35;
          // SAMs get a slightly generous proximity fuse — the warhead is a frag burst.
          const fuse = p.type === 'playerSam' ? hitR * 1.35 : hitR;
          if (p.position.distanceTo(aim) < fuse) {
            const impact = p.position.clone();
            const res = e.takeDamage(0, { munition: p.type, impactWorld: impact });
            const applied = res?.applied ?? 0;
            this.cb.onHit?.(e, applied, res);
            this.explode(impact, {
              scale: res?.catastrophic ? 2.4 : p.type === 'playerSam' ? 1.1 : applied > 25 ? 1.6 : 1.0,
              underwater: e.domain === 'SUBSURFACE',
              airburst: p.type === 'playerSam',
            });
            if (p.type === 'playerSam') this.fx.airburst(impact, { scale: 1.3 });
            p.dead = true;
            break;
          }
        }
      } else {
        for (const ship of ships) {
          if (!ship.alive) continue;
          const shipHitR = Math.max(p.cfg.radius, (ship.length || ship.physics?.length || 140) * 0.22);
          if (p.position.distanceTo(ship.group.position) < shipHitR) {
            // Anti-radiation missile: it homes on the ship's RADAR EMISSION. If the
            // ship went EMCON-silent before terminal, the ARM has lost its source and
            // goes stupid — it splashes harmlessly instead of hitting. This is what
            // makes the "blink" (radiate briefly, then go dark) tactic pay off.
            if (p.isArm && ship._radiating === false) {
              this.explode(p.position.clone(), { scale: 0.7, underwater: false });
              p.dead = true;
              break;
            }
            const impact = p.position.clone();
            const res = ship.takeDamage(0, { munition: p.type, impactWorld: impact });
            const applied = res?.applied ?? 0;
            if (ship.damage?.lost) ship._lossNotified = true;
            this.cb.onShipHit?.(ship, applied, res);
            this.explode(impact, { scale: res?.catastrophic ? 3.2 : 1.7 });
            p.dead = true;
            break;
          }
        }
      }
    }

    this.projectiles = this.projectiles.filter((p) => {
      if (p.dead) { p.dispose(); return false; }
      return true;
    });

    for (const ex of this.explosions) ex.update(dt);
    this.explosions = this.explosions.filter((ex) => {
      if (ex.dead) { ex.dispose(); return false; }
      return true;
    });

    for (const fx of this.launchFx) fx.update(dt);
    this.launchFx = this.launchFx.filter((fx) => {
      if (fx.dead) { fx.dispose(); return false; }
      return true;
    });
  }

  getWeaponInfo(key = this.selectedWeapon) {
    const w = PLAYER_WEAPONS[key];
    return {
      name: w.label,
      ammo: w.ammoKey ? this.ammo[w.ammoKey] : Infinity,
      maxAmmo: w.ammoKey ? w.maxAmmo : Infinity,
      ready: this._cooldowns[key] <= 0 && (!w.ammoKey || this.ammo[w.ammoKey] > 0),
    };
  }
}

export { PLAYER_WEAPONS };

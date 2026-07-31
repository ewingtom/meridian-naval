import * as THREE from 'three';
import { Projectile } from './Projectile.js';
import { Explosion } from './Explosion.js';
import { LaunchEffect } from './LaunchEffect.js';

const PLAYER_WEAPONS = {
  gun: { label: '130mm Deck Gun', ammoKey: null, cooldown: 0.7, projType: 'playerShell' },
  missile: { label: 'Guided Missile', ammoKey: 'missile', maxAmmo: 16, cooldown: 1.6, projType: 'playerMissile' },
  torpedo: { label: 'ASROC Torpedo', ammoKey: 'torpedo', maxAmmo: 8, cooldown: 2.4, projType: 'playerTorpedo' },
  drone: { label: 'Recon Drone', ammoKey: 'drone', maxAmmo: 2, cooldown: 3, projType: 'drone' },
};

const LAUNCH_FX = {
  playerShell: { scale: 0.45, color: 0xffe08a },
  playerMissile: { scale: 1.35, color: 0xffc070 },
  playerTorpedo: { scale: 1.15, color: 0xa8d8e8 },
  enemyShell: { scale: 0.4, color: 0xff8a5a },
  enemyMissile: { scale: 1.25, color: 0xff7040 },
  airMissile: { scale: 1.05, color: 0xff7040 },
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

    this.ammo = { missile: 16, torpedo: 8, drone: 2 };
    this.selectedWeapon = 'gun';
    this._cooldowns = { gun: 0, missile: 0, torpedo: 0, drone: 0 };

    this.ciwsRangeM = 900;
    // EW soft-kill range is well outside CIWS's hard-kill range — a missile gets an
    // early EW pass (chaff/decoy, cheaper, doesn't require the threat to be nearly on
    // top of you) before it ever reaches CIWS range for a last-ditch shoot-down.
    this.chaffRangeM = 3000;

    this.selectedTargetId = null;
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

    this.spawn(w.projType, fromPos, targetPos, { targetEntity });
    this.cb.onFire?.(key);
    return true;
  }

  spawn(type, fromPos, targetPos, opts = {}) {
    const p = new Projectile(type, fromPos, targetPos, { ...opts, scene: this.scene });
    this.projectiles.push(p);

    const fx = LAUNCH_FX[type];
    if (fx) {
      const loft = new THREE.Vector3().subVectors(targetPos, fromPos);
      if (loft.lengthSq() < 0.01) loft.set(0, 1, 0);
      this.launchFx.push(new LaunchEffect(this.scene, fromPos.clone(), {
        ...fx,
        loft,
      }));
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
        ship._ciwsCooldown = 0.12;
        ship.ciwsAmmo -= 1;
        const from = shipPos.clone().add(new THREE.Vector3(0, 14, 0));
        this.spawn('ciwsRound', from, threat.position.clone(), { targetEntity: threat });
        this.cb.onFire?.('ciws');
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
      p.update(dt, camera);

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

      // CIWS rounds intercept the projectile they were fired at
      if (p.type === 'ciwsRound' && p.targetEntity && !p.targetEntity.dead) {
        if (p.position.distanceTo(p.targetEntity.position) < 6) {
          p.targetEntity.dead = true;
          this.explode(p.targetEntity.position.clone(), { scale: 0.5 });
          p.dead = true;
        }
        continue;
      }

      if (p.dead) {
        if (p.exploded) this.explode(p.position.clone(), { scale: 0.6, underwater: p.cfg.underwater });
        continue;
      }

      const isFriendlyWeapon = ['playerShell', 'playerMissile', 'playerTorpedo', 'ciwsRound'].includes(p.type);
      if (isFriendlyWeapon) {
        for (const e of enemies) {
          if (!e.alive || e.destroyed) continue;
          if (e.domain === 'SUBSURFACE' && p.type !== 'playerTorpedo') continue;
          // Missiles/shells shouldn't strike subs; air targets OK for missile/gun
          if (e.domain === 'AIR' && p.type === 'playerTorpedo') continue;
          if (p.position.distanceTo(e.position) < p.cfg.radius) {
            e.takeDamage(p.cfg.damage);
            this.cb.onHit?.(e, p.cfg.damage);
            this.explode(p.position.clone(), { scale: p.cfg.damage > 40 ? 1.4 : 0.8, underwater: e.domain === 'SUBSURFACE' });
            p.dead = true;
            break;
          }
        }
      } else {
        // hostile ordnance vs whichever crewed ship it's actually closest to
        for (const ship of ships) {
          if (!ship.alive) continue;
          if (p.position.distanceTo(ship.group.position) < p.cfg.radius) {
            ship.takeDamage(p.cfg.damage);
            this.cb.onShipHit?.(ship, p.cfg.damage);
            this.explode(p.position.clone(), { scale: 1.2 });
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

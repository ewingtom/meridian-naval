import * as THREE from 'three';
import { TrailRibbon } from '../utils/TrailRibbon.js';
import { getSharedDotTexture, getSharedFoamTexture } from '../utils/ProceduralTextures.js';
import { AsmGuidance, ASM_PHASE } from './AsmFlight.js';
import { SamGuidance } from './SamFlight.js';
import { getWeaponFx } from './FxParticles.js';

const _tmp = new THREE.Vector3();
const _tmp2 = new THREE.Vector3();
const _tmp3 = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);
const _q = new THREE.Quaternion();

/**
 * `asm` on a type turns on the multi-phase anti-ship-missile flight profile in
 * AsmFlight.js (boost → pitchover → cruise → descent → sea-skim → terminal).
 *   vls        vertical (Mk41-style cell) launch vs. inclined canister/rail launch
 *   skimAlt    metres held above the ACTUAL wave surface during the terminal run
 *   popup      allow a Harpoon-Block-1C-style terminal pop-up on longer shots
 */
const TYPE_CONFIG = {
  playerShell: {
    // 130mm naval gun — a ~13 km ballistic last-ditch weapon (see ShipBrain
    // ENVELOPE.gunMax). Higher muzzle velocity + longer life so the arc actually
    // carries to that range instead of the old ~2.7 km lob.
    speed: 420, homing: 0, gravity: 9.8, life: 46, damage: 18, radius: 12,
    color: 0xfff2b0, size: 0.4, trail: true, mesh: 'shell',
  },
  ciwsRound: {
    // Visual is the pooled tracer stream (see WeaponsSystem/FxParticles); this
    // projectile is just the invisible ballistic carrier that resolves the intercept.
    speed: 1120, homing: 0, gravity: 0, life: 2.5, damage: 6, radius: 8,
    color: 0xffe98a, size: 0.15, trail: false, mesh: 'shell', invisible: true,
  },
  // Harpoon-class anti-ship missile. Subsonic sea-skimmer (~Mach 0.85); the long
  // `life` is what makes it an over-the-horizon weapon — a shot to ENVELOPE.asmMax
  // (~45 km) now flies for ~2.7 minutes, so launching a salvo and then waiting out
  // its flight while you defend against the counter-salvo is the core rhythm,
  // exactly as in Sea Power. Was speed 260 / life 26 (~6.8 km, ~20 s).
  playerMissile: {
    speed: 285, homing: 2.4, gravity: 0, life: 185, damage: 65, radius: 28,
    color: 0xdfe8ee, size: 2.4, trail: true, smoke: true, mesh: 'missile',
    boost: true, seaSkim: 9,
    asm: { vls: true, skimAlt: 9, popup: true, booster: true },
  },
  // SM-2-class area air defense — Mach 3+, high loft, hard-turning intercept, no
  // sea-skim. Reaches ENVELOPE.samMax (~40 km) in ~40 s, so it can kill inbound
  // raids far out on the plot before they reach terminal defense.
  playerSam: {
    speed: 1000, homing: 3.6, gravity: 0, life: 55, damage: 40, radius: 18,
    color: 0xb8e8ff, size: 2.0, trail: true, smoke: true, mesh: 'missile',
    boost: true,
    sam: { vls: true, booster: true },
  },
  // Tomahawk-class land-attack cruise missile — long-endurance cruise, steep
  // terminal dive. Life scaled for a genuinely deep-strike reach (~65 km here).
  playerLacm: {
    speed: 240, homing: 1.6, gravity: 0, life: 300, damage: 90, radius: 36,
    color: 0xc8d0b8, size: 2.6, trail: true, smoke: true, mesh: 'missile',
    boost: true,
    asm: { vls: true, landAttack: true, skimAlt: 90, popup: false, booster: true, terminalRange: 380 },
  },
  // ASROC — rocket lofts the lightweight torpedo out to ~10 km, then it swims.
  // Long life so the swim phase can actually close a distant submerged contact.
  playerTorpedo: {
    speed: 55, homing: 1.6, gravity: 0, life: 190, damage: 90, radius: 18,
    color: 0x88b8c0, size: 0.7, trail: true, underwater: true, smoke: true,
    mesh: 'torpedo', boost: true, asroc: true, loftBoost: 55,
  },
  drone: {
    speed: 40, homing: 3, gravity: 0, life: 320, damage: 0, radius: 30,
    color: 0x9fd8ff, size: 0.5, trail: false, mesh: 'drone', isDrone: true,
  },
  enemyShell: {
    speed: 300, homing: 0, gravity: 9.8, life: 8, damage: 14, radius: 12,
    color: 0xff8a5a, size: 0.4, trail: true, mesh: 'shell',
  },
  // Inbound enemy anti-ship missile — the vampire. Long life so a hostile SAG can
  // salvo from over the horizon (~40 km) and the missiles cross the gap over
  // minutes, giving the player the "inbound, time to intercept" defense window.
  enemyMissile: {
    speed: 255, homing: 2.0, gravity: 0, life: 190, damage: 55, radius: 28,
    color: 0xff5a3c, size: 2.2, trail: true, smoke: true, mesh: 'missile',
    boost: true, seaSkim: 8, inbound: true,
    asm: { vls: false, skimAlt: 8, popup: false, booster: true, launchElevation: 0.30 },
  },
  torpedo: {
    speed: 45, homing: 1.4, gravity: 0, life: 200, damage: 80, radius: 18,
    color: 0xff5a3c, size: 0.7, trail: true, underwater: true, smoke: true,
    mesh: 'torpedo', inbound: true,
  },
  // Air-launched anti-ship missile from a hostile strike aircraft, fired from
  // stand-off range. Long life to cross the stand-off gap.
  airMissile: {
    speed: 240, homing: 2.6, gravity: 0, life: 160, damage: 50, radius: 24,
    color: 0xff5a3c, size: 1.8, trail: true, smoke: true, mesh: 'missile',
    boost: true, seaSkim: 14, inbound: true,
    asm: { vls: false, skimAlt: 14, popup: false, booster: false, launchElevation: -0.12 },
  },
};

let _id = 1;
let _missileGeo = null;
let _torpedoGeo = null;
let _shellGeo = null;
let _droneGeo = null;
let _finGeo = null;
let _boosterGeo = null;
let _plumeGeo = null;

function getMissileGeometry() {
  if (_missileGeo) return _missileGeo;
  const body = new THREE.CylinderGeometry(0.18, 0.22, 2.4, 8, 1);
  const nose = new THREE.ConeGeometry(0.18, 0.7, 8);
  _missileGeo = mergeGeometriesSimple([
    { geo: body, matrix: new THREE.Matrix4() },
    { geo: nose, matrix: new THREE.Matrix4().makeTranslation(0, 1.55, 0) },
  ]);
  body.dispose();
  nose.dispose();
  return _missileGeo;
}

function mergeGeometriesSimple(parts) {
  let totalVerts = 0;
  let totalIdx = 0;
  const prepared = parts.map(({ geo, matrix }) => {
    const pos = geo.attributes.position;
    const idx = geo.index;
    const count = pos.count;
    const positions = new Float32Array(count * 3);
    const v = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      v.fromBufferAttribute(pos, i).applyMatrix4(matrix);
      positions[i * 3] = v.x;
      positions[i * 3 + 1] = v.y;
      positions[i * 3 + 2] = v.z;
    }
    let indices;
    if (idx) {
      indices = Array.from(idx.array);
    } else {
      indices = [];
      for (let i = 0; i < count; i++) indices.push(i);
    }
    const start = totalVerts;
    totalVerts += count;
    totalIdx += indices.length;
    return { positions, indices, start };
  });
  const allPos = new Float32Array(totalVerts * 3);
  const allIdx = [];
  let cursor = 0;
  for (const p of prepared) {
    allPos.set(p.positions, cursor * 3);
    for (const i of p.indices) allIdx.push(i + p.start);
    cursor += p.positions.length / 3;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(allPos, 3));
  out.setIndex(allIdx);
  out.computeVertexNormals();
  return out;
}

function getTorpedoGeometry() {
  if (_torpedoGeo) return _torpedoGeo;
  const body = new THREE.CylinderGeometry(0.2, 0.22, 2.8, 8, 1);
  const nose = new THREE.ConeGeometry(0.2, 0.55, 8);
  _torpedoGeo = mergeGeometriesSimple([
    { geo: body, matrix: new THREE.Matrix4() },
    { geo: nose, matrix: new THREE.Matrix4().makeTranslation(0, 1.65, 0) },
  ]);
  body.dispose();
  nose.dispose();
  return _torpedoGeo;
}

function getShellGeometry() {
  if (_shellGeo) return _shellGeo;
  _shellGeo = new THREE.CapsuleGeometry(0.16, 0.9, 2, 6);
  return _shellGeo;
}

function getDroneGeometry() {
  if (_droneGeo) return _droneGeo;
  _droneGeo = new THREE.BoxGeometry(0.6, 0.25, 1.1);
  return _droneGeo;
}

function getFinGeometry() {
  if (_finGeo) return _finGeo;
  _finGeo = new THREE.BoxGeometry(0.06, 0.35, 0.55);
  return _finGeo;
}

function getBoosterGeometry() {
  if (_boosterGeo) return _boosterGeo;
  const body = new THREE.CylinderGeometry(0.23, 0.25, 1.5, 8, 1);
  const skirt = new THREE.ConeGeometry(0.3, 0.4, 8);
  _boosterGeo = mergeGeometriesSimple([
    { geo: body, matrix: new THREE.Matrix4() },
    { geo: skirt, matrix: new THREE.Matrix4().makeTranslation(0, -0.85, 0).multiply(new THREE.Matrix4().makeRotationX(Math.PI)) },
  ]);
  body.dispose();
  skirt.dispose();
  return _boosterGeo;
}

/** Exhaust cone with its wide end at the nozzle (y=0) tapering to an apex at y=-3. */
function getPlumeGeometry() {
  if (_plumeGeo) return _plumeGeo;
  const g = new THREE.ConeGeometry(1, 3, 10, 1, true);
  g.rotateX(Math.PI);    // apex now points -y
  g.translate(0, -1.5, 0); // base sits at the nozzle
  _plumeGeo = g;
  return _plumeGeo;
}

function buildOrdnanceMesh(cfg) {
  const group = new THREE.Group();
  const kind = cfg.mesh || 'shell';
  let geo;
  if (kind === 'missile') geo = getMissileGeometry();
  else if (kind === 'torpedo') geo = getTorpedoGeometry();
  else if (kind === 'drone') geo = getDroneGeometry();
  else geo = getShellGeometry();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: cfg.inbound ? 0x3a3030 : 0xb8c0c6,
    metalness: 0.72,
    roughness: 0.38,
    emissive: cfg.inbound ? new THREE.Color(0x401008) : new THREE.Color(0x101418),
    emissiveIntensity: cfg.inbound ? 0.45 : 0.15,
  });
  const body = new THREE.Mesh(geo, bodyMat);
  const s = cfg.size;
  body.scale.setScalar(s);
  group.add(body);

  if (kind === 'missile' || kind === 'torpedo') {
    const finMat = new THREE.MeshStandardMaterial({
      color: cfg.inbound ? 0x2a2020 : 0x8a9298,
      metalness: 0.55,
      roughness: 0.45,
    });
    const finGeo = getFinGeometry();
    for (let i = 0; i < 4; i++) {
      const fin = new THREE.Mesh(finGeo, finMat);
      const ang = (i / 4) * Math.PI * 2;
      fin.position.set(Math.cos(ang) * 0.22 * s, -0.85 * s, Math.sin(ang) * 0.22 * s);
      fin.rotation.y = ang;
      fin.scale.set(s, s, s);
      group.add(fin);
    }
  }

  return group;
}

export class Projectile {
  constructor(type, fromPos, targetPos, { sourceEntity = null, targetEntity = null, scene }) {
    this.id = _id++;
    this.type = type;
    this.cfg = TYPE_CONFIG[type];
    this.sourceEntity = sourceEntity;
    this.targetEntity = targetEntity;
    this.position = fromPos.clone();
    this.prevPosition = fromPos.clone();
    this.targetPos = targetPos.clone();
    this.velocity = new THREE.Vector3().subVectors(targetPos, fromPos).normalize().multiplyScalar(this.cfg.speed);
    this.age = 0;
    this.dead = false;
    this.exploded = false;
    this.scene = scene;
    this.phase = 'boost'; // boost | cruise | (asroc) splash → run
    this._splashDone = false;
    this.fx = getWeaponFx(scene);

    // --- guided missile profiles (ASM / LACM / SAM) -----------------------
    if (this.cfg.sam) {
      this.guidance = new SamGuidance(fromPos, targetPos, {
        ...this.cfg.sam,
        cruiseSpeed: this.cfg.speed,
      });
      this.guidance.initialVelocity(this.velocity);
      this.phase = this.guidance.phase;
      this.boostUntil = 0;
    } else if (this.cfg.asm) {
      this.guidance = new AsmGuidance(fromPos, targetPos, {
        ...this.cfg.asm,
        cruiseSpeed: this.cfg.speed,
      });
      this.guidance.initialVelocity(this.velocity);
      this.phase = this.guidance.phase;
      this.boostUntil = 0;
    } else if (this.cfg.boost) {
      // Legacy loft (ASROC): pitch up then accelerate toward the target.
      const toTarget = _tmp.subVectors(targetPos, fromPos);
      const horiz = Math.hypot(toTarget.x, toTarget.z) || 1;
      const loft = this.cfg.loftBoost || 30;
      this.velocity.set(
        (toTarget.x / horiz) * this.cfg.speed * 0.55,
        loft,
        (toTarget.z / horiz) * this.cfg.speed * 0.55
      );
      this.boostUntil = 0.55 + Math.random() * 0.25;
    } else {
      this.boostUntil = 0;
    }

    // ASROC: start above water; enter run phase after splash.
    if (this.cfg.asroc) {
      this.position.y = Math.max(this.position.y, 4);
      this.cfg = { ...this.cfg, underwater: false }; // until splash
      this._asrocUnderwater = true; // will become underwater after splash
      this.phase = 'boost';
    }

    // An "invisible" round (CIWS) is a bare transform: the tracer stream in
    // FxParticles is its visual, so it allocates no mesh, material, glow or trail —
    // which matters when the mount is putting 8 of them into the air every second.
    this.mesh = this.cfg.invisible ? new THREE.Group() : buildOrdnanceMesh(this.cfg);
    this.mesh.position.copy(this.position);
    scene.add(this.mesh);
    if (this.cfg.invisible) return;

    // Bright additive glow — HDR core for bloom; inbound threats glow hotter/redder.
    const glowMul = this.cfg.inbound ? 3.2 : (this.cfg.trail ? 2.4 : 1.8);
    this.glowColor = new THREE.Color(this.cfg.color).multiplyScalar(glowMul);
    this.glowMat = new THREE.SpriteMaterial({
      map: getSharedDotTexture(),
      color: this.glowColor,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.95,
    });
    this.glowSprite = new THREE.Sprite(this.glowMat);
    const glowSize = Math.max(1.4, this.cfg.size * (this.cfg.inbound ? 5.2 : 3.6));
    this.glowSprite.scale.set(glowSize, glowSize, 1);
    this.glowSprite.position.copy(this.position);
    scene.add(this.glowSprite);

    // --- rocket motor: a hot additive plume cone rigidly attached to the airframe,
    // plus a burning-bright nozzle sprite so the round stays visible at range. ---
    if (this.cfg.asm || this.cfg.sam || this.cfg.smoke || this.cfg.boost) {
      this.plumeMat = new THREE.MeshBasicMaterial({
        color: this.cfg.underwater ? 0x9fe4ff : 0xffb257,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });
      this.plume = new THREE.Mesh(getPlumeGeometry(), this.plumeMat);
      this.plume.position.set(0, -1.3 * this.cfg.size, 0);
      this.plume.frustumCulled = false;
      this.mesh.add(this.plume);

      this.flameMat = new THREE.SpriteMaterial({
        map: getSharedDotTexture(),
        color: new THREE.Color(this.cfg.underwater ? 0xa8e8ff : 0xffcf8a).multiplyScalar(3.2),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0.9,
      });
      this.flameSprite = new THREE.Sprite(this.flameMat);
      this.flameSprite.scale.set(1.6, 1.6, 1);
      scene.add(this.flameSprite);
    }

    // --- jettisonable booster stage ---
    if (this.cfg.asm?.booster || this.cfg.sam?.booster) {
      this.boosterMat = new THREE.MeshStandardMaterial({
        color: this.cfg.inbound ? 0x2b2320 : 0x6f7276,
        metalness: 0.6, roughness: 0.5,
      });
      this.booster = new THREE.Mesh(getBoosterGeometry(), this.boosterMat);
      this.booster.scale.setScalar(this.cfg.size);
      this.booster.position.set(0, -1.9 * this.cfg.size, 0);
      this.mesh.add(this.booster);
      this._boosterFalling = false;
    }

    if (this.cfg.trail) {
      this.tracer = new TrailRibbon(scene, {
        capacity: this.cfg.inbound ? 28 : 20,
        life: this.cfg.inbound ? 0.55 : 0.35,
        color: this.glowColor,
        map: getSharedDotTexture(),
        additive: true,
        orientation: 'billboard',
        renderOrder: 3,
        widthFn: (age, life) => this.cfg.size * (this.cfg.inbound ? 2.4 : 1.7) * (1 - age / life),
        alphaFn: (age, life) => Math.max(0, 1 - age / life) * (this.cfg.inbound ? 1 : 0.9),
      });
      this.tracer.addSample(this.position, this.age);
    }

    // Torpedoes/ASROC keep the ribbon wake (it reads correctly underwater); airborne
    // missiles use the particle exhaust instead, which is far denser and lingers.
    if (this.cfg.smoke && !this.cfg.asm && !this.cfg.sam) {
      this.smokeTrail = new TrailRibbon(scene, {
        capacity: 48,
        life: 2.8,
        color: this.cfg.underwater || this._asrocUnderwater ? 0xdff7ff : 0xcfd2d6,
        map: getSharedFoamTexture(),
        additive: false,
        orientation: 'billboard',
        renderOrder: 2,
        uvRepeat: 3,
        widthFn: (age) => THREE.MathUtils.lerp(0.55, this.cfg.size * 4.2, Math.min(1, age / 1.1)),
        alphaFn: (age, life) => Math.max(0, 1 - age / life) * (this.cfg.underwater ? 0.65 : 0.52),
      });
      this.smokeTrail.addSample(this.position, this.age);
      this._sinceSmokeSample = 0;
    }

    this._sinceExhaust = 0;
    this._sinceSpray = 0;
  }

  /** True once the ASM guidance has taken the round below sea-skim handoff. */
  get asmPhase() { return this.guidance ? this.guidance.phase : null; }

  update(dt, camera, ctx = null) {
    this.age += dt;
    if (this.age > this.cfg.life) {
      this.dead = true;
      return;
    }
    this.prevPosition.copy(this.position);
    const now = ctx?.now ?? this.age;
    const waveAt = ctx?.waveY;

    if (this.cfg.homing > 0 && this.targetEntity && this.targetEntity.alive !== false && !this.targetEntity.dead) {
      if (typeof this.targetEntity.getAimPoint === 'function') {
        this.targetEntity.getAimPoint(this.targetPos);
      } else {
        let tp = this.targetEntity.group?.position || this.targetEntity.position;
        if (tp?.isVector3) this.targetPos.copy(tp);
        else if (typeof tp?.x === 'number') this.targetPos.set(tp.x, tp.y ?? 0, tp.z);
      }
    }

    if (this.guidance) {
      this._updateAsm(dt, now, waveAt);
    } else {
      this._updateLegacy(dt);
    }

    this.position.addScaledVector(this.velocity, dt);
    if (this.cfg.underwater && this.position.y > -0.3) this.position.y = -0.3;

    this.mesh.position.copy(this.position);
    if (this.velocity.lengthSq() > 0.01) {
      _tmp.copy(this.velocity).normalize();
      this.mesh.quaternion.setFromUnitVectors(_up, _tmp);
      if (this.guidance?.roll) {
        _q.setFromAxisAngle(_tmp, this.guidance.roll);
        this.mesh.quaternion.premultiply(_q);
      }
    }

    if (this.cfg.invisible) return;

    this.glowSprite.position.copy(this.position);
    // Pulse inbound glow so threats read at distance
    if (this.cfg.inbound) {
      const pulse = 0.75 + 0.25 * Math.sin(this.age * 9);
      this.glowMat.opacity = pulse;
      const g = Math.max(1.4, this.cfg.size * 5.2) * (0.9 + 0.2 * pulse);
      this.glowSprite.scale.set(g, g, 1);
    }

    this._updateMotorVisuals(dt, now, waveAt);
    this._updateFallingBooster(dt, now, waveAt);

    if (this.tracer) {
      this.tracer.addSample(this.position, this.age);
      this.tracer.update(this.age, camera);
    }
    if (this.smokeTrail) {
      this._sinceSmokeSample += dt;
      if (this._sinceSmokeSample >= 0.045) {
        this._sinceSmokeSample = 0;
        this.smokeTrail.addSample(this.position, this.age);
      }
      this.smokeTrail.update(this.age, camera);
    }

    // sea-level / ground impact for ballistic shells
    if (!this.cfg.underwater && !this.cfg.asroc && this.position.y <= 0 && this.cfg.gravity > 0) {
      this.dead = true;
      this.exploded = true;
    }
  }

  // ---------------------------------------------------------------- ASM / SAM flight
  _updateAsm(dt, now, waveAt) {
    const waveY = waveAt ? waveAt(this.position.x, this.position.z) : 0;
    const g = this.guidance;
    let targetVel = null;
    if (this.cfg.sam && this.targetEntity) {
      // Prefer physics/velocity if present; aircraft use heading*speed as a stand-in.
      if (this.targetEntity.velocity?.isVector3) targetVel = this.targetEntity.velocity;
      else if (this.targetEntity.forward && this.targetEntity.speedMs) {
        targetVel = _tmp3.copy(this.targetEntity.forward).multiplyScalar(this.targetEntity.speedMs);
      }
    }
    g.update(dt, this.position, this.velocity, this.targetPos, waveY, targetVel);
    this.phase = g.phase;

    const hasBooster = !!(this.cfg.asm?.booster || this.cfg.sam?.booster);
    if (g.justSeparated && hasBooster) {
      // Booster burnout — flare, unburnt-propellant puff, and drop the empty stage.
      _tmp.copy(this.velocity).normalize().multiplyScalar(-1);
      _tmp2.copy(this.position).addScaledVector(_tmp, 2 * this.cfg.size);
      this.fx.boosterSeparation(_tmp2, _tmp, { scale: this.cfg.size * 1.4 });
      this._dropBooster();
    }

    // Never let the round fly through a wave crest (SAMs keep a higher floor).
    const floorPad = this.cfg.sam ? 8 : Math.min(2.5, (g.skimAlt || 8) * 0.35);
    const floor = waveY + floorPad;
    if (this.position.y < floor && !this.cfg.asm?.landAttack) {
      this.position.y = floor;
      if (this.velocity.y < 0) this.velocity.y *= -0.15;
    }
  }

  _updateLegacy(dt) {
    if (this.phase === 'boost' && this.age >= this.boostUntil) {
      this.phase = this.cfg.asroc ? 'ballistic' : 'cruise';
    }

    if (this.cfg.asroc && !this._splashDone) {
      if (this.phase === 'ballistic' || this.phase === 'boost') {
        const aim = _tmp2.copy(this.targetPos);
        aim.y = Math.max(12, aim.y + 14);
        const desired = _tmp.subVectors(aim, this.position).normalize().multiplyScalar(this.cfg.speed * 1.8);
        this.velocity.lerp(desired, Math.min(1, 2.2 * dt));
        this.velocity.y -= 18 * dt;
      }
      if (this.position.y <= 0.4) {
        this._splashDone = true;
        this.didSplash = true;
        this.splashPos = this.position.clone();
        this.splashPos.y = 0.05;
        this.position.y = -0.6;
        this.cfg = { ...this.cfg, underwater: true, speed: 55, homing: 1.8 };
        this.phase = 'run';
        this.velocity.set(this.velocity.x, -2, this.velocity.z).normalize().multiplyScalar(this.cfg.speed);
        if (this.smokeTrail) {
          this.smokeTrail.material.uniforms.uColor.value.setHex(0xdff7ff);
        }
      }
    } else if (this.cfg.homing > 0) {
      const desired = _tmp.subVectors(this.targetPos, this.position).normalize().multiplyScalar(this.cfg.speed);
      if (this.cfg.seaSkim != null && this.phase === 'cruise' && !this.cfg.underwater) {
        desired.y = (this.cfg.seaSkim - this.position.y) * 0.85;
      }
      const home = this.phase === 'boost' ? this.cfg.homing * 0.35 : this.cfg.homing;
      this.velocity.lerp(desired, Math.min(1, home * dt));
      if (this.cfg.seaSkim != null && this.phase === 'cruise' && !this.cfg.underwater) {
        this.position.y = THREE.MathUtils.lerp(this.position.y, this.cfg.seaSkim, Math.min(1, 2.5 * dt));
      }
    }

    if (this.cfg.gravity) this.velocity.y -= this.cfg.gravity * dt;
  }

  // -------------------------------------------------------------- motor visuals
  _updateMotorVisuals(dt, now, waveAt) {
    const thrust = this.guidance ? this.guidance.thrust : (this.phase === 'boost' ? 1 : 0.45);
    _tmp.copy(this.velocity);
    if (_tmp.lengthSq() < 1e-6) _tmp.set(0, 1, 0);
    _tmp.normalize();
    const back = _tmp2.copy(_tmp).multiplyScalar(-1);

    if (this.plume) {
      const flick = 0.86 + 0.14 * Math.sin(now * 47 + this.id);
      const len = (this.cfg.underwater ? 0.35 : 1) * (0.5 + 2.4 * thrust) * flick;
      this.plume.scale.set(this.cfg.size * (0.55 + 0.5 * thrust), this.cfg.size * len, this.cfg.size * (0.55 + 0.5 * thrust));
      this.plumeMat.opacity = (this.cfg.underwater ? 0.22 : 0.55) * (0.35 + 0.75 * thrust);
      this.plume.visible = thrust > 0.05;
    }
    if (this.flameSprite) {
      this.flameSprite.position.copy(this.position).addScaledVector(back, this.cfg.size * 1.5);
      const flicker = 0.85 + 0.15 * Math.sin(now * 31 + this.id * 2.3);
      this.flameSprite.scale.setScalar(this.cfg.size * (1.6 + 3.4 * thrust) * flicker);
      this.flameMat.opacity = this.cfg.underwater ? 0.3 : (0.4 + 0.55 * thrust);
    }

    // --- exhaust smoke: dense and hot on the booster, a thin persistent contrail
    // through cruise so the whole flight path stays readable from any station. ---
    if (!this.cfg.smoke && !this.cfg.asm && !this.cfg.sam) return;
    this._sinceExhaust += dt;
    const boosting = thrust > 0.75;
    const interval = boosting ? 0.012 : 0.032;
    if (this._sinceExhaust >= interval) {
      const steps = Math.min(4, Math.floor(this._sinceExhaust / interval));
      this._sinceExhaust -= steps * interval;
      for (let i = 0; i < steps; i++) {
        // Spread the catch-up puffs back along the path travelled this frame so a
        // long frame leaves a continuous trail instead of a clump.
        _tmp3.lerpVectors(this.prevPosition, this.position, (i + 1) / steps)
          .addScaledVector(back, this.cfg.size * 1.8);
        this.fx.motorPuff(_tmp3, back, {
          hot: boosting ? 1 : thrust * 0.6,
          size: this.cfg.size * (boosting ? 1.35 : 1),
          tint: this.cfg.inbound ? 0xa89a94 : 0xc2c6ca,
          underwater: !!this.cfg.underwater,
        });
      }
    }

    // --- sea-skim spray: tear water off the crests when running in low ---
    if (waveAt && !this.cfg.underwater && this.guidance) {
      const waveY = waveAt(this.position.x, this.position.z);
      const agl = this.position.y - waveY;
      if (agl < 16 && agl > -2) {
        this._sinceSpray += dt;
        if (this._sinceSpray >= 0.045) {
          this._sinceSpray = 0;
          _tmp3.set(this.position.x, waveY + 0.4, this.position.z);
          this.fx.seaSpray(_tmp3, _tmp, { scale: 1 + (1 - agl / 16) });
        }
      }
    }
  }

  _dropBooster() {
    if (!this.booster || this._boosterFalling) return;
    this._boosterFalling = true;
    this.booster.getWorldPosition(_tmp3);
    this.booster.getWorldQuaternion(_q);
    this.mesh.remove(this.booster);
    this.scene.add(this.booster);
    this.booster.position.copy(_tmp3);
    this.booster.quaternion.copy(_q);
    this._boosterVel = this.velocity.clone().multiplyScalar(0.55)
      .add(new THREE.Vector3((Math.random() - 0.5) * 12, -4, (Math.random() - 0.5) * 12));
    this._boosterSpin = new THREE.Vector3(
      (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 6
    );
    this._boosterAge = 0;
  }

  _updateFallingBooster(dt, now, waveAt) {
    if (!this._boosterFalling || !this.booster) return;
    this._boosterAge += dt;
    this._boosterVel.y -= 22 * dt;
    this._boosterVel.multiplyScalar(1 - 0.35 * dt);
    this.booster.position.addScaledVector(this._boosterVel, dt);
    this.booster.rotateX(this._boosterSpin.x * dt);
    this.booster.rotateY(this._boosterSpin.y * dt);
    this.booster.rotateZ(this._boosterSpin.z * dt);
    // Trailing wisp of residual smoke off the spent stage.
    if (this._boosterAge < 1.6 && Math.random() < 0.5) {
      _tmp.set((Math.random() - 0.5) * 3, 1 + Math.random() * 3, (Math.random() - 0.5) * 3);
      this.fx.smoke.spawn(this.booster.position, _tmp, {
        life: 1.6 + Math.random(), size0: 1.2, size1: 8,
        color: 0xa5a8ac, opacity: 0.22, drag: 1.4, gravity: -0.6,
      });
    }
    const seaY = waveAt ? waveAt(this.booster.position.x, this.booster.position.z) : 0;
    if (this.booster.position.y <= seaY) {
      _tmp.set(0, 6, 0);
      for (let i = 0; i < 5; i++) {
        _tmp.set((Math.random() - 0.5) * 8, 4 + Math.random() * 6, (Math.random() - 0.5) * 8);
        this.fx.smoke.spawn(this.booster.position, _tmp, {
          life: 0.9, size0: 1.5, size1: 8, color: 0xe6f6ff, opacity: 0.5, drag: 2, gravity: 9,
        });
      }
      this.scene.remove(this.booster);
      this.booster = null;
      this._boosterFalling = false;
    }
  }

  dispose() {
    this.scene.remove(this.mesh);
    this.mesh.traverse((o) => {
      if (o.isMesh) {
        // Shared geos — don't dispose geometry; dispose unique materials
        if (o.material && !o.material._shared) o.material.dispose();
      }
    });
    if (this.booster) {
      this.scene.remove(this.booster);
      this.boosterMat?.dispose();
      this.booster = null;
    }
    if (this.glowSprite) {
      this.scene.remove(this.glowSprite);
      this.glowMat.dispose();
    }
    if (this.flameSprite) {
      this.scene.remove(this.flameSprite);
      this.flameMat.dispose();
    }
    if (this.tracer) this.tracer.dispose();
    if (this.smokeTrail) this.smokeTrail.dispose();
  }
}

export { TYPE_CONFIG, ASM_PHASE };

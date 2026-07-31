import * as THREE from 'three';
import { TrailRibbon } from '../utils/TrailRibbon.js';
import { getSharedDotTexture, getSharedFoamTexture } from '../utils/ProceduralTextures.js';

const _tmp = new THREE.Vector3();
const _tmp2 = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);

const TYPE_CONFIG = {
  playerShell: {
    speed: 340, homing: 0, gravity: 9.8, life: 8, damage: 18, radius: 12,
    color: 0xfff2b0, size: 0.4, trail: true, mesh: 'shell',
  },
  ciwsRound: {
    speed: 620, homing: 0, gravity: 3, life: 3, damage: 6, radius: 8,
    color: 0xffe98a, size: 0.15, trail: false, mesh: 'shell',
  },
  playerMissile: {
    speed: 260, homing: 2.4, gravity: 0, life: 14, damage: 65, radius: 22,
    color: 0xdfe8ee, size: 0.85, trail: true, smoke: true, mesh: 'missile',
    boost: true, seaSkim: 9, loftBoost: 38,
  },
  playerTorpedo: {
    speed: 55, homing: 1.6, gravity: 0, life: 25, damage: 90, radius: 18,
    color: 0x88b8c0, size: 0.7, trail: true, underwater: true, smoke: true,
    mesh: 'torpedo', boost: true, asroc: true, loftBoost: 55,
  },
  drone: {
    speed: 40, homing: 3, gravity: 0, life: 60, damage: 0, radius: 30,
    color: 0x9fd8ff, size: 0.5, trail: false, mesh: 'drone', isDrone: true,
  },
  enemyShell: {
    speed: 300, homing: 0, gravity: 9.8, life: 8, damage: 14, radius: 12,
    color: 0xff8a5a, size: 0.4, trail: true, mesh: 'shell',
  },
  enemyMissile: {
    speed: 230, homing: 2.0, gravity: 0, life: 16, damage: 55, radius: 22,
    color: 0xff5a3c, size: 0.85, trail: true, smoke: true, mesh: 'missile',
    boost: true, seaSkim: 8, loftBoost: 32, inbound: true,
  },
  torpedo: {
    speed: 45, homing: 1.4, gravity: 0, life: 30, damage: 80, radius: 18,
    color: 0xff5a3c, size: 0.7, trail: true, underwater: true, smoke: true,
    mesh: 'torpedo', inbound: true,
  },
  airMissile: {
    speed: 200, homing: 2.6, gravity: 0, life: 12, damage: 50, radius: 20,
    color: 0xff5a3c, size: 0.65, trail: true, smoke: true, mesh: 'missile',
    boost: true, seaSkim: 18, loftBoost: 20, inbound: true,
  },
};

let _id = 1;
let _missileGeo = null;
let _torpedoGeo = null;
let _shellGeo = null;
let _droneGeo = null;
let _finGeo = null;

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
    this.targetPos = targetPos.clone();
    this.velocity = new THREE.Vector3().subVectors(targetPos, fromPos).normalize().multiplyScalar(this.cfg.speed);
    this.age = 0;
    this.dead = false;
    this.exploded = false;
    this.scene = scene;
    this.phase = 'boost'; // boost | cruise | (asroc) splash → run
    this._splashDone = false;

    // Boost: loft then accelerate toward target for a readable launch arc.
    if (this.cfg.boost) {
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

    this.mesh = buildOrdnanceMesh(this.cfg);
    this.mesh.position.copy(this.position);
    scene.add(this.mesh);

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

    // Engine / exhaust flame behind the weapon during boost + cruise for missiles.
    if (this.cfg.smoke || this.cfg.boost) {
      this.flameMat = new THREE.SpriteMaterial({
        map: getSharedDotTexture(),
        color: new THREE.Color(this.cfg.underwater ? 0xa8e8ff : 0xffaa55).multiplyScalar(2.5),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0.9,
      });
      this.flameSprite = new THREE.Sprite(this.flameMat);
      this.flameSprite.scale.set(1.6, 1.6, 1);
      scene.add(this.flameSprite);
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

    if (this.cfg.smoke) {
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

    // Inbound threat: thin warning contrail that stays longer for chase readability.
    if (this.cfg.inbound && this.cfg.mesh === 'missile') {
      this.warnTrail = new TrailRibbon(scene, {
        capacity: 36,
        life: 3.5,
        color: 0xff6644,
        map: getSharedFoamTexture(),
        additive: false,
        orientation: 'billboard',
        renderOrder: 1,
        widthFn: (age, life) => THREE.MathUtils.lerp(0.8, 3.5, age / life),
        alphaFn: (age, life) => Math.max(0, 1 - age / life) * 0.35,
      });
      this.warnTrail.addSample(this.position, this.age);
      this._sinceWarnSample = 0;
    }
  }

  update(dt, camera) {
    this.age += dt;
    if (this.age > this.cfg.life) {
      this.dead = true;
      return;
    }

    if (this.cfg.homing > 0 && this.targetEntity && this.targetEntity.alive !== false && !this.targetEntity.dead) {
      let tp = this.targetEntity.position;
      if (!tp?.isVector3 && this.targetEntity.group?.position) tp = this.targetEntity.group.position;
      if (tp?.isVector3) this.targetPos.copy(tp);
      else if (typeof tp?.x === 'number') this.targetPos.set(tp.x, tp.y ?? 0, tp.z);
    }

    // --- flight phases ---
    if (this.phase === 'boost' && this.age >= this.boostUntil) {
      this.phase = this.cfg.asroc ? 'ballistic' : 'cruise';
    }

    if (this.cfg.asroc && !this._splashDone) {
      // Ballistic toward a point above the target, then splash.
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
          // Retint wake to bubble-white after water entry
          this.smokeTrail.material.uniforms.uColor.value.setHex(0xdff7ff);
        }
      }
    } else if (this.cfg.homing > 0) {
      const desired = _tmp.subVectors(this.targetPos, this.position).normalize().multiplyScalar(this.cfg.speed);
      // Sea-skim: pull altitude toward cruise height once past boost.
      if (this.cfg.seaSkim != null && this.phase === 'cruise' && !this.cfg.underwater) {
        desired.y = (this.cfg.seaSkim - this.position.y) * 0.85;
      }
      const home = this.phase === 'boost' ? this.cfg.homing * 0.35 : this.cfg.homing;
      this.velocity.lerp(desired, Math.min(1, home * dt));
      if (this.cfg.seaSkim != null && this.phase === 'cruise' && !this.cfg.underwater) {
        this.position.y = THREE.MathUtils.lerp(this.position.y, this.cfg.seaSkim, Math.min(1, 2.5 * dt));
      }
    }

    if (this.cfg.gravity) {
      this.velocity.y -= this.cfg.gravity * dt;
    }

    this.position.addScaledVector(this.velocity, dt);
    if (this.cfg.underwater && this.position.y > -0.3) this.position.y = -0.3;

    this.mesh.position.copy(this.position);
    if (this.velocity.lengthSq() > 0.01) {
      const dir = _tmp.copy(this.velocity).normalize();
      this.mesh.quaternion.setFromUnitVectors(_up, dir);
    }

    this.glowSprite.position.copy(this.position);
    // Pulse inbound glow so threats read at distance
    if (this.cfg.inbound) {
      const pulse = 0.75 + 0.25 * Math.sin(this.age * 9);
      this.glowMat.opacity = pulse;
      const g = Math.max(1.4, this.cfg.size * 5.2) * (0.9 + 0.2 * pulse);
      this.glowSprite.scale.set(g, g, 1);
    }

    if (this.flameSprite) {
      const back = _tmp2.copy(this.velocity).normalize().multiplyScalar(-this.cfg.size * 1.4);
      this.flameSprite.position.copy(this.position).add(back);
      const boostHot = this.phase === 'boost' ? 1.6 : (this.phase === 'run' ? 0.7 : 1);
      const flicker = boostHot * (0.85 + 0.15 * Math.sin(this.age * 28));
      this.flameSprite.scale.setScalar(this.cfg.size * 2.2 * flicker);
      this.flameMat.opacity = this.cfg.underwater ? 0.35 : 0.55 + 0.35 * (this.phase === 'boost' ? 1 : 0.5);
    }

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
    if (this.warnTrail) {
      this._sinceWarnSample += dt;
      if (this._sinceWarnSample >= 0.08) {
        this._sinceWarnSample = 0;
        this.warnTrail.addSample(this.position, this.age);
      }
      this.warnTrail.update(this.age, camera);
    }

    // sea-level / ground impact for ballistic shells
    if (!this.cfg.underwater && !this.cfg.asroc && this.position.y <= 0 && this.cfg.gravity > 0) {
      this.dead = true;
      this.exploded = true;
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
    this.scene.remove(this.glowSprite);
    this.glowMat.dispose();
    if (this.flameSprite) {
      this.scene.remove(this.flameSprite);
      this.flameMat.dispose();
    }
    if (this.tracer) this.tracer.dispose();
    if (this.smokeTrail) this.smokeTrail.dispose();
    if (this.warnTrail) this.warnTrail.dispose();
  }
}

export { TYPE_CONFIG };

import * as THREE from 'three';
import { TrailRibbon } from '../utils/TrailRibbon.js';
import { getSharedDotTexture, getSharedFoamTexture } from '../utils/ProceduralTextures.js';

const _tmp = new THREE.Vector3();

const TYPE_CONFIG = {
  playerShell: { speed: 340, homing: 0, gravity: 9.8, life: 8, damage: 18, radius: 12, color: 0xfff2b0, size: 0.4, trail: true },
  ciwsRound: { speed: 620, homing: 0, gravity: 3, life: 3, damage: 6, radius: 8, color: 0xffe98a, size: 0.15, trail: false },
  playerMissile: { speed: 260, homing: 2.4, gravity: 0, life: 14, damage: 65, radius: 22, color: 0xdfe8ee, size: 0.7, trail: true, smoke: true },
  playerTorpedo: { speed: 55, homing: 1.6, gravity: 0, life: 25, damage: 90, radius: 18, color: 0x88b8c0, size: 0.6, trail: true, underwater: true, smoke: true },
  drone: { speed: 40, homing: 3, gravity: 0, life: 60, damage: 0, radius: 30, color: 0x9fd8ff, size: 0.5, trail: false, isDrone: true },
  enemyShell: { speed: 300, homing: 0, gravity: 9.8, life: 8, damage: 14, radius: 12, color: 0xff8a5a, size: 0.4, trail: true },
  enemyMissile: { speed: 230, homing: 2.0, gravity: 0, life: 16, damage: 55, radius: 22, color: 0xff5a3c, size: 0.7, trail: true, smoke: true },
  torpedo: { speed: 45, homing: 1.4, gravity: 0, life: 30, damage: 80, radius: 18, color: 0xff5a3c, size: 0.6, trail: true, underwater: true, smoke: true },
  airMissile: { speed: 200, homing: 2.6, gravity: 0, life: 12, damage: 50, radius: 20, color: 0xff5a3c, size: 0.55, trail: true, smoke: true },
};

let _id = 1;

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

    const geo = this.cfg.trail
      ? new THREE.CapsuleGeometry(this.cfg.size * 0.4, this.cfg.size * 2.2, 2, 6)
      : new THREE.SphereGeometry(this.cfg.size * 0.5, 6, 6);
    const mat = new THREE.MeshBasicMaterial({ color: this.cfg.color });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.rotation.x = Math.PI / 2;
    scene.add(this.mesh);

    // Bright additive glow riding on the projectile itself — the bare mesh is only tens
    // of centimetres across and reads as a near-invisible speck beyond a couple hundred
    // metres, especially against a bright sky/sea; this sells "hot round in flight" at
    // any distance and gives the bloom pass an HDR-bright core to catch (color pushed
    // above 1.0 — see renderer.js, bloom now runs at Medium quality too).
    this.glowColor = new THREE.Color(this.cfg.color).multiplyScalar(this.cfg.trail ? 2.4 : 1.8);
    this.glowMat = new THREE.SpriteMaterial({
      map: getSharedDotTexture(),
      color: this.glowColor,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.95,
    });
    this.glowSprite = new THREE.Sprite(this.glowMat);
    const glowSize = Math.max(1.4, this.cfg.size * 3.6);
    this.glowSprite.scale.set(glowSize, glowSize, 1);
    this.glowSprite.position.copy(this.position);
    scene.add(this.glowSprite);

    // Short, bright, camera-facing tracer ribbon replacing the old bare debug Line —
    // reads as a proper streak of light instead of a thin wire, tapering to nothing a
    // few tenths of a second behind the round.
    if (this.cfg.trail) {
      this.tracer = new TrailRibbon(scene, {
        capacity: 20,
        life: 0.35,
        color: this.glowColor,
        map: getSharedDotTexture(),
        additive: true,
        orientation: 'billboard',
        renderOrder: 3,
        widthFn: (age, life) => this.cfg.size * 1.7 * (1 - age / life),
        alphaFn: (age, life) => Math.max(0, 1 - age / life) * 0.9,
      });
      this.tracer.addSample(this.position, this.age);
    }

    // Smoke/exhaust trail for missiles and torpedoes (cfg.smoke) — previously a defined
    // but completely unused flag. Camera-facing ribbon that lingers well behind the
    // tracer (life ~2.6s vs ~0.35s) and widens as it ages, tinted bubble-white
    // underwater (torpedo wake) or grey exhaust smoke in air.
    if (this.cfg.smoke) {
      this.smokeTrail = new TrailRibbon(scene, {
        capacity: 44,
        life: 2.6,
        color: this.cfg.underwater ? 0xdff7ff : 0xcfd2d6,
        map: getSharedFoamTexture(),
        additive: false,
        orientation: 'billboard',
        renderOrder: 2,
        uvRepeat: 3,
        widthFn: (age) => THREE.MathUtils.lerp(0.5, this.cfg.size * 3.5, Math.min(1, age / 1.2)),
        alphaFn: (age, life) => Math.max(0, 1 - age / life) * (this.cfg.underwater ? 0.6 : 0.5),
      });
      this.smokeTrail.addSample(this.position, this.age);
      this._sinceSmokeSample = 0;
    }
  }

  update(dt, camera) {
    this.age += dt;
    if (this.age > this.cfg.life) {
      this.dead = true;
      return;
    }

    if (this.cfg.homing > 0 && this.targetEntity && this.targetEntity.alive !== false) {
      this.targetPos.copy(this.targetEntity.position ?? this.targetEntity);
    }

    if (this.cfg.homing > 0) {
      const desired = _tmp.subVectors(this.targetPos, this.position).normalize().multiplyScalar(this.cfg.speed);
      this.velocity.lerp(desired, Math.min(1, this.cfg.homing * dt));
    }

    if (this.cfg.gravity) {
      this.velocity.y -= this.cfg.gravity * dt;
    }

    this.position.addScaledVector(this.velocity, dt);
    if (this.cfg.underwater && this.position.y > -0.3) this.position.y = -0.3;

    this.mesh.position.copy(this.position);
    if (this.velocity.lengthSq() > 0.01) {
      const dir = _tmp.copy(this.velocity).normalize();
      this.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    }

    this.glowSprite.position.copy(this.position);

    if (this.tracer) {
      this.tracer.addSample(this.position, this.age);
      this.tracer.update(this.age, camera);
    }
    if (this.smokeTrail) {
      this._sinceSmokeSample += dt;
      if (this._sinceSmokeSample >= 0.05) {
        this._sinceSmokeSample = 0;
        this.smokeTrail.addSample(this.position, this.age);
      }
      this.smokeTrail.update(this.age, camera);
    }

    // sea-level / ground impact for ballistic shells
    if (!this.cfg.underwater && this.position.y <= 0 && this.cfg.gravity > 0) {
      this.dead = true;
      this.exploded = true;
    }
  }

  dispose() {
    this.scene.remove(this.mesh);
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.scene.remove(this.glowSprite);
    this.glowMat.dispose();
    if (this.tracer) this.tracer.dispose();
    if (this.smokeTrail) this.smokeTrail.dispose();
  }
}

export { TYPE_CONFIG };

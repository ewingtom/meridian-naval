import * as THREE from 'three';

const _tmp = new THREE.Vector3();

const TYPE_CONFIG = {
  playerShell: { speed: 340, homing: 0, gravity: 9.8, life: 8, damage: 18, radius: 12, color: 0xfff2b0, size: 0.4, trail: true },
  ciwsRound: { speed: 620, homing: 0, gravity: 3, life: 3, damage: 6, radius: 8, color: 0xffe98a, size: 0.15, trail: false },
  playerMissile: { speed: 260, homing: 2.4, gravity: 0, life: 14, damage: 65, radius: 22, color: 0xdfe8ee, size: 0.7, trail: true, smoke: true },
  playerTorpedo: { speed: 55, homing: 1.6, gravity: 0, life: 25, damage: 90, radius: 18, color: 0x88b8c0, size: 0.6, trail: true, underwater: true },
  drone: { speed: 40, homing: 3, gravity: 0, life: 60, damage: 0, radius: 30, color: 0x9fd8ff, size: 0.5, trail: false, isDrone: true },
  enemyShell: { speed: 300, homing: 0, gravity: 9.8, life: 8, damage: 14, radius: 12, color: 0xff8a5a, size: 0.4, trail: true },
  enemyMissile: { speed: 230, homing: 2.0, gravity: 0, life: 16, damage: 55, radius: 22, color: 0xff5a3c, size: 0.7, trail: true, smoke: true },
  torpedo: { speed: 45, homing: 1.4, gravity: 0, life: 30, damage: 80, radius: 18, color: 0xff5a3c, size: 0.6, trail: true, underwater: true },
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

    const geo = this.cfg.trail
      ? new THREE.CapsuleGeometry(this.cfg.size * 0.4, this.cfg.size * 2.2, 2, 6)
      : new THREE.SphereGeometry(this.cfg.size * 0.5, 6, 6);
    const mat = new THREE.MeshBasicMaterial({ color: this.cfg.color });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.rotation.x = Math.PI / 2;
    scene.add(this.mesh);

    if (this.cfg.trail) {
      const trailGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(2 * 3);
      trailGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const trailMat = new THREE.LineBasicMaterial({ color: this.cfg.color, transparent: true, opacity: 0.55 });
      this.trailLine = new THREE.Line(trailGeo, trailMat);
      scene.add(this.trailLine);
      this._trailHistory = [fromPos.clone(), fromPos.clone()];
    }

    this.scene = scene;
  }

  update(dt) {
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

    if (this.trailLine) {
      this._trailHistory[0].copy(this._trailHistory[1]);
      this._trailHistory[1].copy(this.position);
      const arr = this.trailLine.geometry.attributes.position.array;
      arr[0] = this._trailHistory[0].x; arr[1] = this._trailHistory[0].y; arr[2] = this._trailHistory[0].z;
      arr[3] = this._trailHistory[1].x; arr[4] = this._trailHistory[1].y; arr[5] = this._trailHistory[1].z;
      this.trailLine.geometry.attributes.position.needsUpdate = true;
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
    if (this.trailLine) {
      this.scene.remove(this.trailLine);
      this.trailLine.geometry.dispose();
      this.trailLine.material.dispose();
    }
  }
}

export { TYPE_CONFIG };

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Entity, Domain, IFF } from './Entity.js';
import { buildAircraftMesh } from './geometryKits.js';

const State = { INBOUND: 'INBOUND', ATTACK_RUN: 'ATTACK_RUN', EGRESS: 'EGRESS', SHOT_DOWN: 'SHOT_DOWN' };
const AIR_MODEL_URL = `${import.meta.env.BASE_URL || '/'}assets/models/enemy_aircraft.glb`;

export class Aircraft extends Entity {
  constructor({ name = 'Bandit', position, scene }) {
    super({ name, domain: Domain.AIR, iff: IFF.HOSTILE, maxHealth: 35, position });
    const { group } = buildAircraftMesh();
    this.group = group;
    this.altitude = 180 + Math.random() * 60;
    this.speedMs = 95;
    this.heading = 0;
    this.state = State.INBOUND;
    this._fireCooldown = 0;
    this._egressTimer = 0;
    this._fallVel = 0;
    scene.add(this.group);
    this._tryLoadBlenderHull();
  }

  async _tryLoadBlenderHull() {
    try {
      const gltf = await new GLTFLoader().loadAsync(AIR_MODEL_URL);
      const inst = gltf.scene.clone(true);
      const box = new THREE.Box3().setFromObject(inst);
      const size = new THREE.Vector3();
      box.getSize(size);
      const targetSpan = 16; // ~wingspan meters
      const s = targetSpan / Math.max(size.x, size.z, 1);
      inst.scale.setScalar(s);
      inst.traverse((o) => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
        }
      });
      while (this.group.children.length) this.group.remove(this.group.children[0]);
      this.group.add(inst);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[Aircraft] Blender hull unavailable, keeping procedural mesh.', err?.message || err);
    }
  }

  onDestroyed() {
    this.state = State.SHOT_DOWN;
    this._fallVel = 2;
  }

  update(dt, ctx) {
    const { playerPos, fireWeapon } = ctx;

    if (this.state === State.SHOT_DOWN) {
      this._fallVel += dt * 22;
      this.altitude -= this._fallVel * dt;
      this.group.rotation.z += dt * 3.2;
      this.group.rotation.x += dt * 1.6;
      if (this.altitude <= 0) this.destroyed = true;
      this._applyTransform();
      return;
    }

    const toPlayer = new THREE.Vector3().subVectors(playerPos, this.position);
    const distFlat = Math.hypot(toPlayer.x, toPlayer.z);
    const desiredHeading = Math.atan2(-toPlayer.x, -toPlayer.z);
    let diff = desiredHeading - this.heading;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;

    if (this.state === State.INBOUND) {
      this.heading += THREE.MathUtils.clamp(diff, -1, 1) * dt * 1.2;
      if (distFlat < 900) this.state = State.ATTACK_RUN;
    } else if (this.state === State.ATTACK_RUN) {
      this.heading += THREE.MathUtils.clamp(diff, -1, 1) * dt * 0.6;
      this.altitude = THREE.MathUtils.lerp(this.altitude, 70, dt * 0.4);
      this._fireCooldown -= dt;
      if (distFlat < 500 && this._fireCooldown <= 0) {
        fireWeapon('airMissile', this.position.clone().setY(this.altitude), playerPos.clone(), this);
        this._fireCooldown = 999; // one pass, then egress
        this._egressTimer = 2.5;
      }
      if (this._egressTimer > 0) {
        this._egressTimer -= dt;
        if (this._egressTimer <= 0) this.state = State.EGRESS;
      }
    } else if (this.state === State.EGRESS) {
      this.heading += dt * 0.15;
      this.altitude = THREE.MathUtils.lerp(this.altitude, 220, dt * 0.3);
      if (distFlat > 2400) this.destroyed = true; // despawn once clear
    }

    this.position.addScaledVector(this.forward, this.speedMs * dt);
    this._applyTransform();
  }

  _applyTransform() {
    this.group.position.set(this.position.x, this.altitude, this.position.z);
    this.group.rotation.y = this.heading;
  }
}

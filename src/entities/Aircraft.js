import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Entity, Domain, IFF } from './Entity.js';
import { buildAircraftMesh } from './geometryKits.js';

const State = { INBOUND: 'INBOUND', ATTACK_RUN: 'ATTACK_RUN', EGRESS: 'EGRESS', SHOT_DOWN: 'SHOT_DOWN' };
const AIR_MODEL_URL = `${import.meta.env.BASE_URL || '/'}assets/models/enemy_aircraft.glb`;

export class Aircraft extends Entity {
  /**
   * `benign` opts an aircraft entirely out of the attack-run/fire-weapon state
   * machine below — it flies a steady transit profile and never turns hostile
   * regardless of how it reads on a sensor (closing, descending, whatever).
   * Used for the "ambiguous inbound" TAO training contact (see
   * WorldManager.spawnWave('ambiguous_inbound')): its ground-truth `iff` is
   * NEUTRAL and it must never actually behave like a threat, no matter how
   * threatening it looks — the whole point is that the cues are misleading,
   * not that the game is lying about what the aircraft actually does.
   */
  constructor({ name = 'Bandit', position, scene, iff = IFF.HOSTILE, benign = false }) {
    super({ name, domain: Domain.AIR, iff, maxHealth: 35, position });
    const { group } = buildAircraftMesh();
    this.group = group;
    this.altitude = 180 + Math.random() * 60;
    this.speedMs = 95;
    this.heading = 0;
    this.state = State.INBOUND;
    this._fireCooldown = 0;
    this._egressTimer = 0;
    this._fallVel = 0;
    this.benign = benign;
    /** Stamped each frame by HostileFleetDirector — { targetShip, targetPos }. Lets an
     * inbound bandit go after an escort instead of always Meridian, same as EnemyShip. */
    this._fleet = null;
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

    if (this.benign) {
      // Civilian/commercial transit profile — holds its own course rather than
      // homing on the player, never enters ATTACK_RUN, never fires. It can still
      // be shot down (no invulnerability — that would make the "wrong" outcome
      // unreachable), but it will never itself act like a threat. Reads as
      // "closing" while its corridor happens to pass near the task force, then
      // opens back up and clears — exactly the shape that made the real case
      // this scenario is grounded in look like an attack profile when it wasn't.
      // Deliberately measured against the player specifically (not task-force-wide
      // targeting below) — this profile is a fixed TAO training scenario, not a
      // hostile with a target to pick.
      const toPlayer = new THREE.Vector3().subVectors(playerPos, this.position);
      const distFlatPlayer = Math.hypot(toPlayer.x, toPlayer.z);
      if (distFlatPlayer < 1400) this._passedClose = true;
      this.position.addScaledVector(this.forward, this.speedMs * dt);
      this._applyTransform();
      if (this._passedClose && distFlatPlayer > 3200) this.destroyed = true; // clear of the area, transit complete
      return;
    }

    // Task-force-wide targeting: HostileFleetDirector may assign an escort instead of
    // Meridian (same doctrine EnemyShip.js already uses for surface threats), so a
    // bandit sometimes runs its attack on an escort rather than always the player.
    const focusPos = this._fleet?.targetPos || this._fleet?.targetShip?.group?.position || playerPos;
    const toFocus = new THREE.Vector3().subVectors(focusPos, this.position);
    const distFlat = Math.hypot(toFocus.x, toFocus.z);
    const desiredHeading = Math.atan2(-toFocus.x, -toFocus.z);
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
        fireWeapon('airMissile', this.position.clone().setY(this.altitude), focusPos.clone(), this);
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
    // Keep position.y in sync so weapons/homing that read `entity.position` still work.
    this.position.y = this.altitude;
    this.group.position.set(this.position.x, this.altitude, this.position.z);
    this.group.rotation.y = this.heading;
  }
}

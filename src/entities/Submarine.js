import * as THREE from 'three';
import { Entity, Domain, IFF } from './Entity.js';
import { buildSubmarineMesh } from './geometryKits.js';

const State = { PATROL: 'PATROL', STALK: 'STALK', SURFACE_ATTACK: 'SURFACE_ATTACK', SINKING: 'SINKING' };
const PERISCOPE_DEPTH = -0.4;
const SUBMERGED_DEPTH = -14;

export class Submarine extends Entity {
  constructor({ name = 'Sonar Contact', position, scene }) {
    super({ name, domain: Domain.SUBSURFACE, iff: IFF.HOSTILE, maxHealth: 90, position });
    const { group } = buildSubmarineMesh();
    this.group = group;
    this.depth = SUBMERGED_DEPTH;
    this.state = State.PATROL;
    this.heading = Math.random() * Math.PI * 2;
    this.speedMs = 4;
    this.torpedoRangeM = 1400;
    this._attackTimer = 0;
    this._torpedoCooldown = 20;
    this._sinkT = 0;
    /** revealed briefly when at periscope depth, or always if player pings sonar nearby */
    this.sonarRevealed = false;
    scene.add(this.group);
  }

  onDestroyed() {
    this.state = State.SINKING;
    this._sinkT = 0;
  }

  update(dt, ctx) {
    const { playerPos, elapsed, fireWeapon, sonarPingActive, sonarPingOrigin, sonarPingRadius } = ctx;

    if (this.state === State.SINKING) {
      this._sinkT += dt;
      this.depth -= dt * 2.2;
      this.group.rotation.x += dt * 0.3;
      if (this._sinkT > 6) this.destroyed = true;
      this._applyTransform();
      return;
    }

    const distToPlayer = this.position.distanceTo(playerPos);

    // sonar reveal: active ping sweeping past reveals for a few seconds
    if (sonarPingActive && sonarPingOrigin) {
      const dPing = this.position.distanceTo(sonarPingOrigin);
      if (dPing < sonarPingRadius) this.sonarRevealed = 4.5;
    }
    if (this.sonarRevealed > 0) this.sonarRevealed -= dt;

    if (this.state === State.PATROL) {
      this.depth = THREE.MathUtils.lerp(this.depth, SUBMERGED_DEPTH, dt * 0.3);
      if (distToPlayer < 2600) this.state = State.STALK;
      this._wander(dt);
    } else if (this.state === State.STALK) {
      this.depth = THREE.MathUtils.lerp(this.depth, SUBMERGED_DEPTH, dt * 0.3);
      this._steerToward(playerPos, dt);
      this._torpedoCooldown -= dt;
      if (distToPlayer < this.torpedoRangeM && this._torpedoCooldown <= 0) {
        this.state = State.SURFACE_ATTACK;
        this._attackTimer = 3.5;
      }
      if (distToPlayer > 3200) this.state = State.PATROL;
    } else if (this.state === State.SURFACE_ATTACK) {
      this._attackTimer -= dt;
      this.depth = THREE.MathUtils.lerp(this.depth, PERISCOPE_DEPTH, dt * 0.8);
      this._steerToward(playerPos, dt, 0.3);
      if (this._attackTimer <= 0) {
        fireWeapon('torpedo', this.position.clone(), playerPos.clone(), this);
        this._torpedoCooldown = 22 + Math.random() * 10;
        this.state = State.STALK;
      }
    }

    this.position.addScaledVector(this.forward, this.speedMs * dt);
    this._applyTransform();
  }

  _wander(dt) {
    this.heading += (Math.sin(performance.now() * 0.00013 + this.id) * 0.15) * dt;
  }

  _steerToward(targetPos, dt, speedMul = 1) {
    const toTarget = new THREE.Vector3().subVectors(targetPos, this.position);
    const desiredHeading = Math.atan2(-toTarget.x, -toTarget.z);
    let diff = desiredHeading - this.heading;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    this.heading += THREE.MathUtils.clamp(diff, -0.4 * dt, 0.4 * dt) * 3;
    this.speedMs = 4.2 * speedMul;
  }

  _applyTransform() {
    this.group.position.set(this.position.x, this.depth, this.position.z);
    this.group.rotation.y = this.heading;
  }

  /** visible on radar/visually only near-surface or sonar-revealed */
  get isVisible() {
    return this.depth > -2.5 || this.sonarRevealed > 0;
  }
}

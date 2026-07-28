import * as THREE from 'three';
import { Entity, Domain, IFF } from './Entity.js';
import { buildEnemyShipMesh } from './geometryKits.js';
import { ShipPhysics } from '../ship/ShipPhysics.js';

const State = { PATROL: 'PATROL', ENGAGE: 'ENGAGE', SINKING: 'SINKING' };

export class EnemyShip extends Entity {
  constructor({ name = 'Contact', position, patrolPoints = [], scene }) {
    super({ name, domain: Domain.SURFACE, iff: IFF.HOSTILE, maxHealth: 140, position });
    const { group, length, beam, deckY } = buildEnemyShipMesh();
    this.group = group;
    this.deckY = deckY;
    this.physics = new ShipPhysics({ length, beam, maxSpeedKn: 24, accel: 1.1, turnRate: 0.22 });
    this.physics.position.copy(position);
    this.patrolPoints = patrolPoints;
    this._patrolIdx = 0;
    this.state = State.PATROL;
    this.engageRangeM = 3200;
    this.gunRangeM = 2600;
    this.missileRangeM = 4200;
    this._gunCooldown = 0;
    this._missileCooldown = Math.random() * 8 + 6;
    this._sinkT = 0;
    scene.add(this.group);
  }

  onDestroyed() {
    this.state = State.SINKING;
    this._sinkT = 0;
  }

  update(dt, ctx) {
    const { playerPos, elapsed, fireWeapon, getWaveHeight } = ctx;

    if (this.state === State.SINKING) {
      this._sinkT += dt;
      this.group.rotation.z += dt * 0.15;
      this.group.position.y -= dt * 1.4;
      this.group.rotation.x += dt * 0.05;
      if (this._sinkT > 8) this.destroyed = true;
      return;
    }

    const distToPlayer = this.physics.position.distanceTo(playerPos);

    if (this.state === State.PATROL) {
      if (distToPlayer < this.engageRangeM) {
        this.state = State.ENGAGE;
      } else if (this.patrolPoints.length) {
        const target = this.patrolPoints[this._patrolIdx];
        const d = this.physics.position.distanceTo(target);
        if (d < 60) this._patrolIdx = (this._patrolIdx + 1) % this.patrolPoints.length;
        this._steerToward(target, 0.55);
      } else {
        this.physics.setCommand(0.3, 0);
      }
    } else if (this.state === State.ENGAGE) {
      if (distToPlayer > this.engageRangeM * 1.35) {
        this.state = State.PATROL;
      } else {
        // keep a stand-off distance rather than ramming
        const desiredRange = this.gunRangeM * 0.75;
        const throttle = distToPlayer > desiredRange ? 0.85 : distToPlayer < desiredRange * 0.6 ? -0.3 : 0.15;
        this._steerToward(playerPos, throttle);

        this._gunCooldown -= dt;
        if (distToPlayer < this.gunRangeM && this._gunCooldown <= 0) {
          this._gunCooldown = 1.4 + Math.random() * 0.8;
          fireWeapon('enemyShell', this._muzzleWorld(), playerPos.clone(), this);
        }
        this._missileCooldown -= dt;
        if (distToPlayer < this.missileRangeM && this._missileCooldown <= 0) {
          this._missileCooldown = 14 + Math.random() * 10;
          fireWeapon('enemyMissile', this._muzzleWorld(), playerPos.clone(), this);
        }
      }
    }

    this.physics.update(dt, getWaveHeight, elapsed);
    this.physics.applyToObject3D(this.group);
    this.position.copy(this.physics.position);
    this.heading = this.physics.heading;
  }

  _steerToward(targetPos, throttle) {
    const toTarget = new THREE.Vector3().subVectors(targetPos, this.physics.position);
    const desiredHeading = Math.atan2(-toTarget.x, -toTarget.z);
    let diff = desiredHeading - this.physics.heading;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    const rudder = THREE.MathUtils.clamp(diff * 1.4, -1, 1);
    this.physics.setCommand(throttle, rudder);
  }

  _muzzleWorld() {
    return this.group.localToWorld(new THREE.Vector3(0, this.deckY + 1.5, 42));
  }
}

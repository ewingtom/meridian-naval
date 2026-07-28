import * as THREE from 'three';
import { Entity, Domain, IFF } from './Entity.js';
import { buildEnemyShipMesh } from './geometryKits.js';
import { ShipPhysics } from '../ship/ShipPhysics.js';

/**
 * Task-force escort — holds a station offset relative to the player (e.g. "400m off
 * the port beam") rather than patrolling/engaging, so the player always has the sense
 * of sailing as part of a formation rather than alone on an empty ocean.
 */
export class FriendlyShip extends Entity {
  constructor({ name = 'Task Force Unit', position, stationOffset, scene }) {
    super({ name, domain: Domain.SURFACE, iff: IFF.FRIENDLY, maxHealth: 160, position });
    const { group, length, beam, deckY } = buildEnemyShipMesh(0x2f6a8a);
    this.group = group;
    this.deckY = deckY;
    this.physics = new ShipPhysics({ length, beam, maxSpeedKn: 28, accel: 1.3, turnRate: 0.24 });
    this.physics.position.copy(position);
    /** offset from the player ship, in the player's own local frame (x=beam, z=fwd) */
    this.stationOffset = stationOffset;
    scene.add(this.group);
  }

  update(dt, ctx) {
    const { playerShip, elapsed, getWaveHeight } = ctx;
    const desired = this.stationOffset.clone().applyQuaternion(playerShip.group.quaternion).add(playerShip.group.position);

    const toDesired = new THREE.Vector3().subVectors(desired, this.physics.position);
    const dist = toDesired.length();

    let throttle, rudder;
    if (dist > 8) {
      const desiredHeading = Math.atan2(-toDesired.x, -toDesired.z);
      let diff = desiredHeading - this.physics.heading;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      rudder = THREE.MathUtils.clamp(diff * 1.3, -1, 1);
      // match the player's pace, boosted a bit if we're falling behind station
      const playerSpeedFrac = playerShip.physics.speed / playerShip.physics.maxSpeedMs;
      throttle = THREE.MathUtils.clamp(playerSpeedFrac + THREE.MathUtils.clamp((dist - 40) / 200, 0, 0.5), -1, 1);
    } else {
      rudder = 0;
      throttle = playerShip.physics.speed / playerShip.physics.maxSpeedMs;
    }
    this.physics.setCommand(throttle, rudder);
    this.physics.update(dt, getWaveHeight, elapsed);
    this.physics.applyToObject3D(this.group);
    this.position.copy(this.physics.position);
    this.heading = this.physics.heading;
  }
}

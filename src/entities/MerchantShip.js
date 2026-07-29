import * as THREE from 'three';
import { Entity, Domain, IFF } from './Entity.js';
import { buildMerchantShipMesh } from './geometryKits.js';
import { ShipPhysics } from '../ship/ShipPhysics.js';

/**
 * Neutral civilian traffic — a merchant/tanker transiting a long straight lane
 * back and forth across the patrol area. Unarmed and non-aggressive: it never
 * engages, never evades, just goes about its business, so the ocean reads as a
 * living working sea rather than only player + military units.
 */
export class MerchantShip extends Entity {
  constructor({ name = 'MV Contact', position, waypoints, scene }) {
    super({ name, domain: Domain.SURFACE, iff: IFF.NEUTRAL, maxHealth: 260, position });
    const { group, length, beam, deckY } = buildMerchantShipMesh();
    this.group = group;
    this.deckY = deckY;
    this.physics = new ShipPhysics({ length, beam, maxSpeedKn: 14, accel: 0.4, turnRate: 0.12 });
    this.physics.position.copy(position);
    /** long back-and-forth transit lane — two or more points a few km apart */
    this.waypoints = waypoints;
    this._wpIdx = 1;
    const toFirst = new THREE.Vector3().subVectors(waypoints[1], waypoints[0]);
    this.physics.heading = Math.atan2(-toFirst.x, -toFirst.z);
    scene.add(this.group);
  }

  update(dt, ctx) {
    const { elapsed, getWaveHeight } = ctx;

    const target = this.waypoints[this._wpIdx];
    const toTarget = new THREE.Vector3().subVectors(target, this.physics.position);
    if (Math.hypot(toTarget.x, toTarget.z) < 150) {
      this._wpIdx = (this._wpIdx + 1) % this.waypoints.length;
    }
    const desiredHeading = Math.atan2(-toTarget.x, -toTarget.z);
    let diff = desiredHeading - this.physics.heading;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    const rudder = THREE.MathUtils.clamp(diff * 0.8, -1, 1);
    this.physics.setCommand(0.55, rudder);

    this.physics.update(dt, getWaveHeight, elapsed);
    this.physics.applyToObject3D(this.group);
    this.position.copy(this.physics.position);
    this.heading = this.physics.heading;
  }
}

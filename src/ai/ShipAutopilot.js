import * as THREE from 'three';

/**
 * Drives a CrewedShip's helm and/or weapons when no human is manning that station —
 * both in single-player (the two task-force escorts always sail themselves) and in
 * multiplayer (any ship/station nobody has claimed). Two independent pieces so a ship
 * can have e.g. a human on Weapons while the autopilot still steers the helm.
 */
export class ShipAutopilot {
  constructor(ship, { role = 'escort', stationOffset = null } = {}) {
    this.ship = ship;
    this.role = role; // 'escort' (formation-hold on the anchor ship) | 'lead' (heading/speed hold toward a waypoint)
    this.stationOffset = stationOffset; // Vector3, ship-local frame of the anchor, for 'escort' role
    this.helmEnabled = true;
    this.weaponsEnabled = true;
    this._fireCooldown = Math.random() * 4;
  }

  updateHelm(dt, { anchorShip, waypoint }) {
    if (!this.helmEnabled) return;
    const phys = this.ship.physics;
    let throttle = 0, rudder = 0;

    if (this.role === 'escort' && anchorShip) {
      const desired = this.stationOffset.clone()
        .applyQuaternion(anchorShip.group.quaternion)
        .add(anchorShip.group.position);
      const toDesired = new THREE.Vector3().subVectors(desired, phys.position);
      const dist = toDesired.length();
      if (dist > 8) {
        const desiredHeading = Math.atan2(-toDesired.x, -toDesired.z);
        let diff = desiredHeading - phys.heading;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        rudder = THREE.MathUtils.clamp(diff * 1.3, -1, 1);
        const anchorSpeedFrac = anchorShip.physics.speed / anchorShip.physics.maxSpeedMs;
        throttle = THREE.MathUtils.clamp(anchorSpeedFrac + THREE.MathUtils.clamp((dist - 40) / 200, 0, 0.5), -1, 1);
      } else {
        rudder = 0;
        throttle = anchorShip.physics.speed / anchorShip.physics.maxSpeedMs;
      }
    } else {
      // 'lead' role — steer toward the mission waypoint, hold a cruising speed. Used
      // when the Meridian herself has no human aboard at all (AI takes the whole ship).
      const target = waypoint || phys.position.clone().addScaledVector(phys.forward, 100);
      const toTarget = new THREE.Vector3().subVectors(target, phys.position);
      if (toTarget.lengthSq() > 400) {
        const desiredHeading = Math.atan2(toTarget.x, toTarget.z);
        let diff = desiredHeading - phys.heading;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        rudder = THREE.MathUtils.clamp(diff * 1.1, -1, 1);
        throttle = 0.55;
      } else {
        throttle = 0.15; rudder = 0;
      }
    }
    this.ship.setCommand(throttle, rudder);
  }

  /** Periodically engage the nearest in-range hostile with the deck gun, mirroring the
   * player's own gun-fire path through the same generic `fireWeapon` callback the
   * hostile AI already uses, so no separate ammo/effects system is needed. */
  updateWeapons(dt, { hostiles, fireWeapon }) {
    if (!this.weaponsEnabled) return;
    this._fireCooldown -= dt;
    if (this._fireCooldown > 0 || !hostiles?.length) return;
    const mp = this.ship.mountPoints;
    if (!mp?.gunBarrelTip) return;
    const shipPos = this.ship.group.position;
    let nearest = null, nearestD = 3200;
    for (const h of hostiles) {
      if (!h.alive) continue;
      const d = h.position.distanceTo(shipPos);
      if (d < nearestD) { nearestD = d; nearest = h; }
    }
    if (!nearest) return;
    const from = this.ship.getMountWorld(mp.gunBarrelTip, new THREE.Vector3());
    fireWeapon('playerShell', from, nearest.position.clone(), this.ship, nearest);
    this._fireCooldown = 2.2 + Math.random() * 1.5;
  }
}

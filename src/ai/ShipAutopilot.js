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
    this.breakFormation = false; // when true, chase engage target instead of station-keeping
    this._engageTargetId = null;
    this._fireCooldown = Math.random() * 4;
    // Tracks whether this crew is currently "in a fight" so onEngage/onDisengage fire
    // once per episode rather than spamming a line every 2-second gun cycle.
    this._engaged = false;
  }

  setEngageTarget(id) {
    this._engageTargetId = id || null;
  }

  updateHelm(dt, { anchorShip, waypoint, engageWorldPos = null }) {
    if (!this.helmEnabled) return;
    const phys = this.ship.physics;
    let throttle = 0, rudder = 0;

    // Prosecute a shared track: leave station and close the contact.
    if (this.breakFormation && engageWorldPos) {
      const toDesired = new THREE.Vector3().subVectors(engageWorldPos, phys.position);
      const dist = toDesired.length();
      if (dist > 120) {
        const desiredHeading = this.role === 'lead'
          ? Math.atan2(toDesired.x, toDesired.z)
          : Math.atan2(-toDesired.x, -toDesired.z);
        let diff = desiredHeading - phys.heading;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        rudder = THREE.MathUtils.clamp(diff * 1.35, -1, 1);
        throttle = dist > 800 ? 0.95 : 0.55;
      } else {
        throttle = 0.25;
        rudder = 0;
      }
      this.ship.setCommand(throttle, rudder);
      return;
    }

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
      // when the Meridian herself has no human at the HELM seat (player on weapons/radar/
      // walk, or an empty Meridian in multiplayer).
      const target = waypoint || phys.position.clone().addScaledVector(phys.forward, 100);
      const toTarget = new THREE.Vector3().subVectors(target, phys.position);
      if (toTarget.lengthSq() > 400) {
        const desiredHeading = Math.atan2(toTarget.x, toTarget.z);
        let diff = desiredHeading - phys.heading;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        rudder = THREE.MathUtils.clamp(diff * 1.1, -1, 1);
        throttle = 0.7;
      } else {
        throttle = 0.2; rudder = 0;
      }
    }
    this.ship.setCommand(throttle, rudder);
  }

  /** Periodically engage the nearest in-range hostile with the deck gun, mirroring the
   * player's own gun-fire path through the same generic `fireWeapon` callback the
   * hostile AI already uses, so no separate ammo/effects system is needed. `onEngage`/
   * `onDisengage` fire once per fight (not once per shot) so the AI crew's radio calls
   * — "Weapons reports a contact, engaging" — read as real reports, not spam, and give
   * the player something concrete to react to (check the plot, help finish it off, etc).
   */
  updateWeapons(dt, { hostiles, fireWeapon, onEngage, onDisengage, weaponsPolicy = 'free', sharedTargetId = null }) {
    if (!this.weaponsEnabled) return;
    this._fireCooldown -= dt;
    const mp = this.ship.mountPoints;
    const shipPos = this.ship.group.position;

    let candidates = (hostiles || []).filter((h) => h.alive);
    // Task-force doctrine: under WEAPONS HOLD, escorts only fire the shared designation
    // (or their explicit engage target). Under FREE without a share, nearest hostile.
    if (this._engageTargetId) {
      candidates = candidates.filter((h) => h.id === this._engageTargetId);
    } else if (weaponsPolicy === 'hold') {
      candidates = [];
    } else if (sharedTargetId) {
      candidates = candidates.filter((h) => h.id === sharedTargetId);
    }

    let nearest = null, nearestD = 3200;
    for (const h of candidates) {
      const d = h.position.distanceTo(shipPos);
      if (d < nearestD) { nearestD = d; nearest = h; }
    }
    if (nearest && !this._engaged) {
      this._engaged = true;
      onEngage?.(this.ship, nearest);
    } else if (!nearest && this._engaged) {
      this._engaged = false;
      onDisengage?.(this.ship);
    }
    if (this._fireCooldown > 0 || !nearest || !mp?.gunBarrelTip) return;
    const from = this.ship.getMountWorld(mp.gunBarrelTip, new THREE.Vector3());
    // Domain-aware doctrine: shells don't kill subs; missiles prefer air/surface.
    let munition = 'playerShell';
    let cool = 2.2 + Math.random() * 1.5;
    const domain = String(nearest.domain || '').toUpperCase();
    if (domain === 'SUBSURFACE') {
      munition = 'playerTorpedo';
      cool = 5.5 + Math.random() * 2.5;
    } else if (domain === 'AIR') {
      munition = 'playerMissile';
      cool = 3.8 + Math.random() * 1.8;
    }
    fireWeapon(munition, from, nearest.position.clone(), this.ship, nearest);
    this._fireCooldown = cool;
  }
}

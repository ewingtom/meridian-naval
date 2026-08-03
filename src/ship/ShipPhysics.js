import * as THREE from 'three';

/**
 * Buoyancy + surface-vessel movement. Samples ocean height at bow/stern/port/starboard
 * probe points to derive pitch/roll/heave, and integrates throttle/rudder into a simple
 * drag-limited forward-speed model. Reusable for the player ship and AI ships alike.
 */
export class ShipPhysics {
  constructor({ length = 180, beam = 21, maxSpeedKn = 32, accel = 2.2, turnRate = 0.35 } = {}) {
    this.length = length;
    this.beam = beam;
    this.maxSpeedMs = maxSpeedKn * 0.5144;
    this.accel = accel;
    this.turnRate = turnRate;

    this.position = new THREE.Vector3();
    this.heading = 0; // radians, 0 = +Z
    this.speed = 0; // m/s, signed (negative = reverse)
    this.throttle = 0; // -1..1 commanded
    this.rudder = 0; // -1..1 commanded

    this.roll = 0;
    this.pitch = 0;
    this.heave = 0;
    this._rollVel = 0;
    this._pitchVel = 0;

    this.quaternion = new THREE.Quaternion();

    this._probeLocal = {
      bow: new THREE.Vector3(0, 0, length * 0.46),
      stern: new THREE.Vector3(0, 0, -length * 0.46),
      port: new THREE.Vector3(-beam * 0.48, 0, 0),
      starboard: new THREE.Vector3(beam * 0.48, 0, 0),
    };
    this._probeWorld = {
      bow: new THREE.Vector3(),
      stern: new THREE.Vector3(),
      port: new THREE.Vector3(),
      starboard: new THREE.Vector3(),
    };
  }

  get speedKnots() {
    return this.speed / 0.5144;
  }

  get forward() {
    return new THREE.Vector3(Math.sin(this.heading), 0, Math.cos(this.heading));
  }

  setCommand(throttle, rudder) {
    this.throttle = THREE.MathUtils.clamp(throttle, -1, 1);
    this.rudder = THREE.MathUtils.clamp(rudder, -1, 1);
  }

  update(dt, getWaveHeight, elapsed) {
    // --- longitudinal speed with drag ---
    const targetSpeed = this.throttle * this.maxSpeedMs;
    const rate = this.accel * (Math.sign(targetSpeed - this.speed) === Math.sign(this.speed) || this.speed === 0 ? 1 : 2.2);
    this.speed += THREE.MathUtils.clamp(targetSpeed - this.speed, -rate * dt, rate * dt);

    // --- turning: rate scales with speed (no steerage way when dead in water) ---
    const speedFactor = THREE.MathUtils.clamp(Math.abs(this.speed) / (this.maxSpeedMs * 0.35), 0, 1);
    this.heading += this.rudder * this.turnRate * speedFactor * dt * Math.sign(this.speed || 1);

    // --- integrate position ---
    const fwd = this.forward;
    this.position.addScaledVector(fwd, this.speed * dt);

    // --- buoyancy: sample waves at 4 probe points ---
    this.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.heading);
    for (const key in this._probeLocal) {
      _tmp.copy(this._probeLocal[key]).applyQuaternion(this.quaternion).add(this.position);
      this._probeWorld[key].copy(_tmp);
    }
    const hBow = getWaveHeight(this._probeWorld.bow.x, this._probeWorld.bow.z, elapsed);
    const hStern = getWaveHeight(this._probeWorld.stern.x, this._probeWorld.stern.z, elapsed);
    const hPort = getWaveHeight(this._probeWorld.port.x, this._probeWorld.port.z, elapsed);
    const hStarboard = getWaveHeight(this._probeWorld.starboard.x, this._probeWorld.starboard.z, elapsed);

    const targetHeave = (hBow + hStern + hPort + hStarboard) / 4;
    const targetPitch = Math.atan2(hBow - hStern, this.length * 0.92) * -1;
    const targetRoll = Math.atan2(hPort - hStarboard, this.beam * 0.96);

    // critically-damped-ish spring toward target angles for smooth motion (not teleport-y)
    const springP = 6.0, damp = 3.2;
    this._pitchVel += (targetPitch - this.pitch) * springP * dt;
    this._pitchVel *= 1 - Math.min(1, damp * dt);
    this.pitch += this._pitchVel * dt;

    this._rollVel += (targetRoll - this.roll) * springP * dt;
    this._rollVel *= 1 - Math.min(1, damp * dt);
    this.roll += this._rollVel * dt;

    this.heave += (targetHeave - this.heave) * Math.min(1, 5 * dt);
  }

  /** Full world transform (position with heave applied, quaternion incl. pitch/roll). */
  applyToObject3D(obj) {
    // Light draft for waterline contact without exposing underwater skirt
    obj.position.set(this.position.x, this.heave - 0.34, this.position.z);
    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.heading);
    const qPitch = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.pitch);
    const qRoll = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), this.roll);
    q.multiply(qPitch).multiply(qRoll);
    obj.quaternion.copy(q);
  }
}

const _tmp = new THREE.Vector3();

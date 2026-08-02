import * as THREE from 'three';

/**
 * Surface-to-air missile profile (SM-2 / ESSM-class mock).
 *
 *   BOOST      VLS cell — near-vertical clear of the ship
 *   PITCHOVER  nose onto the air track bearing while still climbing
 *   MIDCOURSE  high-energy loft toward a lead intercept point
 *   TERMINAL   high-G 3-D pursuit into the airframe
 *
 * Visually distinct from a sea-skimming ASM: the round stays high and turns hard
 * onto the aircraft instead of descending to the wave tops.
 */

export const SAM_PHASE = {
  BOOST: 'boost',
  PITCHOVER: 'pitchover',
  MIDCOURSE: 'midcourse',
  TERMINAL: 'terminal',
};

const PHASE_LIMITS = {
  [SAM_PHASE.BOOST]: { turn: 0.35, climb: 420, dive: 30 },
  [SAM_PHASE.PITCHOVER]: { turn: 1.4, climb: 160, dive: 80 },
  [SAM_PHASE.MIDCOURSE]: { turn: 1.1, climb: 90, dive: 90 },
  [SAM_PHASE.TERMINAL]: { turn: 3.2, climb: 220, dive: 220 },
};

const _dir = new THREE.Vector3();
const _desired = new THREE.Vector3();
const _cur = new THREE.Vector3();
const _lead = new THREE.Vector3();
const _qA = new THREE.Quaternion();
const _qB = new THREE.Quaternion();

export class SamGuidance {
  constructor(fromPos, targetPos, o = {}) {
    const dx = targetPos.x - fromPos.x;
    const dz = targetPos.z - fromPos.z;
    const range = Math.hypot(dx, dz) || 1;

    this.cruiseSpeed = o.cruiseSpeed ?? 620;
    this.terminalSpeed = this.cruiseSpeed * 1.18;
    this.accel = o.accel ?? 280;
    this.loftAlt = THREE.MathUtils.clamp(range * 0.22, 180, 920);
    this.terminalRange = o.terminalRange ?? 420;
    this.boostTime = 0.85 * (0.9 + Math.random() * 0.2);
    this.launchSpeed = o.launchSpeed ?? 40;

    this.phase = SAM_PHASE.BOOST;
    this.phaseAge = 0;
    this.age = 0;
    this.roll = 0;
    this.thrust = 1;
    this.boosterAttached = true;
    this.justSeparated = false;
    this.phaseChanged = false;
    this.speed = this.launchSpeed;
    this.skimAlt = 40; // floor only — SAMs never sea-skim

    this.dirOut = new THREE.Vector3(dx / range * 0.12, 1, dz / range * 0.12).normalize();
  }

  initialVelocity(out = new THREE.Vector3()) {
    return out.copy(this.dirOut).multiplyScalar(this.launchSpeed);
  }

  _setPhase(p) {
    if (this.phase === p) return;
    this.phase = p;
    this.phaseAge = 0;
    this.phaseChanged = true;
  }

  update(dt, position, velocity, targetPos, _waveY = 0, targetVel = null) {
    this.age += dt;
    this.phaseAge += dt;
    this.phaseChanged = false;
    this.justSeparated = false;

    // Simple constant-velocity lead for the intercept point.
    _lead.copy(targetPos);
    if (targetVel && targetVel.lengthSq() > 1) {
      const tof = position.distanceTo(targetPos) / Math.max(80, this.speed);
      _lead.addScaledVector(targetVel, Math.min(tof, 4.5));
    }

    const dx = _lead.x - position.x;
    const dy = _lead.y - position.y;
    const dz = _lead.z - position.z;
    const range3 = Math.hypot(dx, dy, dz) || 0.001;
    const horiz = Math.hypot(dx, dz) || 0.001;

    _cur.copy(velocity);
    if (_cur.lengthSq() < 1e-6) _cur.copy(this.dirOut);
    _cur.normalize();

    switch (this.phase) {
      case SAM_PHASE.BOOST:
        if (this.phaseAge >= this.boostTime) {
          this._setPhase(SAM_PHASE.PITCHOVER);
          this.boosterAttached = false;
          this.justSeparated = true;
        }
        break;
      case SAM_PHASE.PITCHOVER:
        if (this.phaseAge > 2.2 || position.y > this.loftAlt * 0.55) this._setPhase(SAM_PHASE.MIDCOURSE);
        break;
      case SAM_PHASE.MIDCOURSE:
        if (range3 < this.terminalRange || horiz < this.terminalRange * 0.7) this._setPhase(SAM_PHASE.TERMINAL);
        break;
      default:
        break;
    }

    const lim = PHASE_LIMITS[this.phase];
    let targetSpeed = this.cruiseSpeed;

    if (this.phase === SAM_PHASE.BOOST) {
      _desired.copy(this.dirOut);
      targetSpeed = this.cruiseSpeed * 0.55;
      this.thrust = 1;
    } else if (this.phase === SAM_PHASE.PITCHOVER) {
      const t = THREE.MathUtils.clamp(this.phaseAge / 2.0, 0, 1);
      const cmdY = THREE.MathUtils.lerp(1.0, Math.max(0.35, dy / range3), t);
      _desired.set(dx / horiz, cmdY, dz / horiz).normalize();
      targetSpeed = this.cruiseSpeed * 0.85;
      this.thrust = 0.85;
    } else if (this.phase === SAM_PHASE.MIDCOURSE) {
      // Hold loft while closing — climb if still below the intercept altitude band.
      const cmdAlt = Math.max(this.loftAlt * 0.7, _lead.y + 80);
      const err = cmdAlt - position.y;
      const climb = THREE.MathUtils.clamp(err * 0.9, -lim.dive, lim.climb);
      const vertFrac = THREE.MathUtils.clamp(climb / Math.max(60, this.speed), -0.85, 0.85);
      _desired.set(dx / horiz, 0, dz / horiz).multiplyScalar(Math.sqrt(Math.max(0.01, 1 - vertFrac * vertFrac)));
      _desired.y = vertFrac;
      _desired.normalize();
      targetSpeed = this.cruiseSpeed;
      this.thrust = 0.55;
    } else {
      _desired.set(dx, dy, dz).normalize();
      targetSpeed = this.terminalSpeed;
      this.thrust = 0.75;
    }

    const angle = _cur.angleTo(_desired);
    if (angle > 1e-5) {
      const f = Math.min(1, (lim.turn * dt) / angle);
      _qA.setFromUnitVectors(_cur, _desired);
      _qB.identity().slerp(_qA, f);
      _dir.copy(_cur).applyQuaternion(_qB).normalize();
      const lateral = (_desired.x * -_cur.z + _desired.z * _cur.x);
      this.roll = THREE.MathUtils.lerp(this.roll, THREE.MathUtils.clamp(-lateral * 1.8, -1.1, 1.1), Math.min(1, 4 * dt));
    } else {
      _dir.copy(_cur);
      this.roll = THREE.MathUtils.lerp(this.roll, 0, Math.min(1, 3 * dt));
    }

    const dv = targetSpeed - this.speed;
    const step = (dv > 0 ? this.accel : this.accel * 0.55) * dt;
    this.speed += THREE.MathUtils.clamp(dv, -step, step);
    velocity.copy(_dir).multiplyScalar(this.speed);
  }
}

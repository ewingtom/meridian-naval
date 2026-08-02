import * as THREE from 'three';

/**
 * Anti-ship-missile flight profile.
 *
 * Models the real multi-phase profile a Harpoon / Exocet-class ASM flies rather than
 * a straight line to the target:
 *
 *   BOOST      solid booster; a VLS round leaves the cell almost vertically, a canister
 *              round leaves on its launch rail elevation. Thrust builds toward cruise
 *              speed; the airframe barely steers (control authority is low and the
 *              round is deliberately clearing the ship).
 *   PITCHOVER  booster burnout/separation, then the missile noses over onto the target
 *              bearing and bleeds pitch off toward level flight.
 *   CRUISE     midcourse leg held at a cruise altitude by the altitude-hold autopilot.
 *   DESCENT    commanded glide slope down to sea-skim height, started at a range that
 *              scales with the shot so the descent is always visible.
 *   SKIM       radar-altimeter sea skim: holds a few metres above the ACTUAL wave
 *              surface (sampled from the ocean, not a fixed y) for the terminal run.
 *   POPUP      optional terminal pop-up manoeuvre (Harpoon Block 1C style) — a hard
 *              climb followed by a dive onto the target from above.
 *   TERMINAL   direct 3-D pursuit into the hull.
 *
 * Everything is driven by a continuous guidance loop — a rate-limited turn toward a
 * commanded direction plus an altitude-hold controller — so phase changes only swap
 * which altitude/heading is being commanded. The state never teleports the missile.
 */

export const ASM_PHASE = {
  BOOST: 'boost',
  PITCHOVER: 'pitchover',
  CRUISE: 'cruise',
  DESCENT: 'descent',
  SKIM: 'skim',
  POPUP: 'popup',
  TERMINAL: 'terminal',
};

// per-phase: max turn rate (rad/s), max climb (m/s), max dive (m/s)
const PHASE_LIMITS = {
  [ASM_PHASE.BOOST]: { turn: 0.30, climb: 400, dive: 20 },
  [ASM_PHASE.PITCHOVER]: { turn: 1.05, climb: 90, dive: 70 },
  [ASM_PHASE.CRUISE]: { turn: 0.65, climb: 40, dive: 40 },
  [ASM_PHASE.DESCENT]: { turn: 0.75, climb: 25, dive: 95 },
  [ASM_PHASE.SKIM]: { turn: 1.0, climb: 30, dive: 30 },
  [ASM_PHASE.POPUP]: { turn: 1.8, climb: 170, dive: 40 },
  [ASM_PHASE.TERMINAL]: { turn: 2.4, climb: 120, dive: 200 },
};

const _dir = new THREE.Vector3();
const _desired = new THREE.Vector3();
const _cur = new THREE.Vector3();
const _qA = new THREE.Quaternion();
const _qB = new THREE.Quaternion();

export class AsmGuidance {
  /**
   * @param {THREE.Vector3} fromPos launch point
   * @param {THREE.Vector3} targetPos initial aimpoint
   * @param {object} o profile tuning (see Projectile TYPE_CONFIG.asm)
   */
  constructor(fromPos, targetPos, o = {}) {
    const dx = targetPos.x - fromPos.x;
    const dz = targetPos.z - fromPos.z;
    const range = Math.hypot(dx, dz) || 1;

    this.vls = o.vls !== false;
    // landAttack = Tomahawk-style LACM: high cruise, no sea-skim, steep terminal dive.
    this.landAttack = !!o.landAttack;
    this.cruiseSpeed = o.cruiseSpeed ?? (this.landAttack ? 220 : 250);
    this.terminalSpeed = this.cruiseSpeed * (o.terminalSpeedMul ?? (this.landAttack ? 1.25 : 1.12));
    this.accel = o.accel ?? 150;
    this.skimAlt = this.landAttack ? (o.skimAlt ?? 90) : (o.skimAlt ?? 8);
    this.launchRange = range;

    // Cruise altitude scales with the shot so a short-range snap shot doesn't spend
    // its whole life climbing, while a long shot gets a properly lofted midcourse.
    // Floor is high enough that the loft → sea-skim profile always reads from deck
    // cameras (chase / weapons / lookout), not just a shallow hop.
    // An air-launched round already starts high and simply cruises where it was
    // dropped before descending. LACMs cruise much higher — a visible high arc.
    const lofted = this.landAttack
      ? THREE.MathUtils.clamp(range * 0.10, 240, 520)
      : THREE.MathUtils.clamp(range * 0.14, 95, 280);
    this.cruiseAlt = Math.max(lofted, fromPos.y > 60 ? fromPos.y : 0);

    // Start the glide slope far enough out that the descent reads as a distinct phase.
    this.descentRange = THREE.MathUtils.clamp(range * (this.landAttack ? 0.38 : 0.48), this.landAttack ? 500 : 320, this.landAttack ? 2000 : 1400);
    // Keep terminal short so DESCENT→SKIM always has a readable sea-skim leg.
    // LACM skips skim and dives from farther out.
    this.terminalRange = o.terminalRange ?? (this.landAttack ? 380 : 85);

    this.popup = !this.landAttack && !!o.popup && range > 650;
    this.popupRange = o.popupRange ?? 320;
    this.popupAlt = o.popupAlt ?? 62;

    this.boostTime = (this.vls ? 1.15 : 0.72) * (0.9 + Math.random() * 0.2);
    this.launchSpeed = o.launchSpeed ?? (this.vls ? 34 : 62);

    this.phase = ASM_PHASE.BOOST;
    this.phaseAge = 0;
    this.age = 0;
    this.roll = 0;
    this.thrust = 1;          // 0..1, drives exhaust brightness
    this.boosterAttached = true;
    this.justSeparated = false;
    this.phaseChanged = false;
    this.speed = this.launchSpeed;

    // Initial attitude.
    this.dirOut = new THREE.Vector3();
    if (this.vls) {
      // Straight up out of the cell with a couple of degrees of lean toward the target.
      this.dirOut.set(dx / range * 0.10, 1, dz / range * 0.10).normalize();
    } else {
      const el = o.launchElevation ?? 0.32; // ~18 deg off the rail
      this.dirOut.set(dx / range, Math.tan(el), dz / range).normalize();
    }
  }

  /** Velocity the projectile should start with. */
  initialVelocity(out = new THREE.Vector3()) {
    return out.copy(this.dirOut).multiplyScalar(this.launchSpeed);
  }

  _setPhase(p) {
    if (this.phase === p) return;
    this.phase = p;
    this.phaseAge = 0;
    this.phaseChanged = true;
  }

  /**
   * Advance guidance one step and write the new velocity into `velocity`.
   * @param {number} dt
   * @param {THREE.Vector3} position current world position
   * @param {THREE.Vector3} velocity mutated in place
   * @param {THREE.Vector3} targetPos current aimpoint
   * @param {number} waveY sea surface height under the missile right now
   */
  update(dt, position, velocity, targetPos, waveY = 0) {
    this.age += dt;
    this.phaseAge += dt;
    this.phaseChanged = false;
    this.justSeparated = false;

    const dx = targetPos.x - position.x;
    const dz = targetPos.z - position.z;
    const horizRange = Math.hypot(dx, dz) || 0.001;
    const hx = dx / horizRange, hz = dz / horizRange;

    _cur.copy(velocity);
    if (_cur.lengthSq() < 1e-6) _cur.copy(this.dirOut);
    _cur.normalize();
    const pitch = Math.asin(THREE.MathUtils.clamp(_cur.y, -1, 1));
    const headingErr = Math.acos(THREE.MathUtils.clamp(_cur.x * hx + _cur.z * hz, -1, 1));

    // ---- phase transitions -------------------------------------------------
    switch (this.phase) {
      case ASM_PHASE.BOOST:
        if (this.phaseAge >= this.boostTime) {
          this._setPhase(ASM_PHASE.PITCHOVER);
          this.boosterAttached = false;
          this.justSeparated = true;
        }
        break;
      case ASM_PHASE.PITCHOVER:
        if ((pitch < 0.16 && headingErr < 0.5) || this.phaseAge > 4.5) this._setPhase(ASM_PHASE.CRUISE);
        else if (horizRange < this.descentRange * 0.7) this._setPhase(ASM_PHASE.DESCENT);
        break;
      case ASM_PHASE.CRUISE:
        if (horizRange < this.descentRange) this._setPhase(ASM_PHASE.DESCENT);
        break;
      case ASM_PHASE.DESCENT:
        if (this.landAttack) {
          // LACM: skip sea-skim — plunge from cruise straight into a steep dive.
          if (horizRange < this.terminalRange) this._setPhase(ASM_PHASE.TERMINAL);
        } else if (position.y - waveY <= this.skimAlt * 1.9) {
          this._setPhase(ASM_PHASE.SKIM);
        } else if (horizRange < this.terminalRange) {
          this._setPhase(ASM_PHASE.TERMINAL);
        }
        break;
      case ASM_PHASE.SKIM:
        if (this.popup && horizRange < this.popupRange) this._setPhase(ASM_PHASE.POPUP);
        else if (horizRange < this.terminalRange) this._setPhase(ASM_PHASE.TERMINAL);
        break;
      case ASM_PHASE.POPUP:
        if (position.y - waveY >= this.popupAlt || horizRange < this.popupRange * 0.45) {
          this._setPhase(ASM_PHASE.TERMINAL);
        }
        break;
      default:
        break;
    }

    // ---- commanded direction ----------------------------------------------
    const lim = PHASE_LIMITS[this.phase];
    let targetSpeed = this.cruiseSpeed;

    if (this.phase === ASM_PHASE.BOOST) {
      // Hold launch attitude; the booster is doing the work, not the fins.
      _desired.copy(this.dirOut);
      targetSpeed = this.cruiseSpeed * 0.72;
      this.thrust = 1;
    } else if (this.phase === ASM_PHASE.PITCHOVER) {
      // Nose over: command the target bearing with a pitch that decays to level.
      const t = THREE.MathUtils.clamp(this.phaseAge / 2.4, 0, 1);
      const cmdPitch = THREE.MathUtils.lerp(Math.max(pitch, 0.1), 0.02, t);
      _desired.set(hx, Math.tan(cmdPitch), hz).normalize();
      targetSpeed = this.cruiseSpeed;
      this.thrust = 0.55;
    } else if (this.phase === ASM_PHASE.TERMINAL) {
      // ASM: chase the waterline. LACM: steep dive onto the land aimpoint.
      const aimY = this.landAttack ? targetPos.y : (targetPos.y + 2);
      _desired.set(dx, aimY - position.y, dz).normalize();
      targetSpeed = this.terminalSpeed;
      this.thrust = this.landAttack ? 0.85 : 0.6;
    } else {
      // Altitude-hold autopilot: horizontal toward target, vertical from alt error.
      let cmdAlt;
      if (this.phase === ASM_PHASE.CRUISE) {
        cmdAlt = this.cruiseAlt;
        this.thrust = 0.4;
      } else if (this.phase === ASM_PHASE.DESCENT) {
        // Commanded glide slope: interpolate the altitude down along the run-in so the
        // missile eases onto the deck instead of pitching over a cliff.
        // LACM holds higher longer, then tips into a steep dive corridor.
        const span = Math.max(1, this.descentRange - this.terminalRange);
        const f = THREE.MathUtils.clamp((horizRange - this.terminalRange) / span, 0, 1);
        const ease = f * f * (3 - 2 * f);
        const floorAlt = this.landAttack ? (waveY + this.skimAlt) : (waveY + this.skimAlt);
        cmdAlt = THREE.MathUtils.lerp(floorAlt, Math.max(position.y, this.cruiseAlt), ease);
        this.thrust = 0.45;
      } else if (this.phase === ASM_PHASE.POPUP) {
        cmdAlt = waveY + this.popupAlt + 10;
        this.thrust = 0.9;
      } else { // SKIM
        cmdAlt = waveY + this.skimAlt;
        this.thrust = 0.5;
      }
      const err = cmdAlt - position.y;
      const climb = THREE.MathUtils.clamp(err * 1.1, -lim.dive, lim.climb);
      const vertFrac = THREE.MathUtils.clamp(climb / Math.max(40, this.speed), -0.92, 0.92);
      _desired.set(hx, 0, hz).multiplyScalar(Math.sqrt(Math.max(0.01, 1 - vertFrac * vertFrac)));
      _desired.y = vertFrac;
      _desired.normalize();
      targetSpeed = this.phase === ASM_PHASE.POPUP ? this.cruiseSpeed * 1.05 : this.cruiseSpeed;
    }

    // ---- rate-limited steering --------------------------------------------
    const angle = _cur.angleTo(_desired);
    if (angle > 1e-5) {
      const maxStep = lim.turn * dt;
      const f = Math.min(1, maxStep / angle);
      _qA.setFromUnitVectors(_cur, _desired);
      _qB.identity().slerp(_qA, f);
      _dir.copy(_cur).applyQuaternion(_qB).normalize();
      // Bank into the turn — purely cosmetic, read by the mesh orientation.
      const lateral = (_desired.x * -_cur.z + _desired.z * _cur.x);
      this.roll = THREE.MathUtils.lerp(this.roll, THREE.MathUtils.clamp(-lateral * 1.5, -0.9, 0.9), Math.min(1, 3 * dt));
    } else {
      _dir.copy(_cur);
      this.roll = THREE.MathUtils.lerp(this.roll, 0, Math.min(1, 3 * dt));
    }

    // ---- speed -------------------------------------------------------------
    const dv = targetSpeed - this.speed;
    const step = (dv > 0 ? this.accel : this.accel * 0.6) * dt;
    this.speed += THREE.MathUtils.clamp(dv, -step, step);

    velocity.copy(_dir).multiplyScalar(this.speed);
  }
}

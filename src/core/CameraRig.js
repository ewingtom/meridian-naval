import * as THREE from 'three';

const _q1 = new THREE.Quaternion();
const _v1 = new THREE.Vector3();

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Every camera move in the game (station swaps, cutscenes, menu <-> gameplay) goes
 * through this rig so nothing ever hard-cuts — it blends position+rotation+FOV over
 * a configurable duration with easing. Free-look (mouse) offsets are layered on top
 * of the blended base pose so a transition can complete while the player is already
 * looking around.
 */
export class CameraRig {
  constructor(camera) {
    this.camera = camera;
    this.position = camera.position.clone();
    this.quaternion = camera.quaternion.clone();
    this.fov = camera.fov;

    this._fromPos = this.position.clone();
    this._fromQuat = this.quaternion.clone();
    this._fromFov = this.fov;
    this._toPos = this.position.clone();
    this._toQuat = this.quaternion.clone();
    this._toFov = this.fov;

    this._t = 1;
    this._duration = 1;
    this._onComplete = null;

    // free-look offset (yaw/pitch) layered on top of the blended base orientation,
    // used while stationed at helm/weapons so the player can still glance around
    this.lookYaw = 0;
    this.lookPitch = 0;
    this.lookEnabled = false;
    this.lookLimits = { yaw: Math.PI, pitchMin: -1.3, pitchMax: 1.3 };
  }

  /** Snap immediately, no blend (use sparingly — only for first-frame init). */
  setImmediate(position, quaternion, fov = this.camera.fov) {
    this.position.copy(position);
    this.quaternion.copy(quaternion);
    this.fov = fov;
    this._fromPos.copy(position);
    this._fromQuat.copy(quaternion);
    this._fromFov = fov;
    this._toPos.copy(position);
    this._toQuat.copy(quaternion);
    this._toFov = fov;
    this._t = 1;
    this._applyToCamera();
  }

  /** Smoothly blend to a new pose over `duration` seconds. */
  transitionTo(position, quaternion, fov = this.camera.fov, duration = 1.1, onComplete = null) {
    this._fromPos.copy(this.position);
    this._fromQuat.copy(this.quaternion);
    this._fromFov = this.fov;
    this._toPos.copy(position);
    this._toQuat.copy(quaternion);
    this._toFov = fov;
    this._duration = Math.max(duration, 0.0001);
    this._t = 0;
    this._onComplete = onComplete;
  }

  /** Update just the destination of an in-flight transition (e.g. the target is a
   * moving ship mount point) without resetting progress or the start pose. */
  retarget(position, quaternion, fov = this._toFov) {
    this._toPos.copy(position);
    this._toQuat.copy(quaternion);
    this._toFov = fov;
  }

  get isTransitioning() {
    return this._t < 1;
  }

  update(dt) {
    if (this._t < 1) {
      this._t = Math.min(1, this._t + dt / this._duration);
      const e = easeInOutCubic(this._t);
      this.position.lerpVectors(this._fromPos, this._toPos, e);
      _q1.copy(this._fromQuat).slerp(this._toQuat, e);
      this.quaternion.copy(_q1);
      this.fov = THREE.MathUtils.lerp(this._fromFov, this._toFov, e);
      if (this._t >= 1 && this._onComplete) {
        const cb = this._onComplete;
        this._onComplete = null;
        cb();
      }
    }
    this._applyToCamera();
  }

  _applyToCamera() {
    this.camera.position.copy(this.position);
    if (this.lookEnabled) {
      // apply free-look as a local-space rotation on top of the base quaternion
      const baseEuler = new THREE.Euler().setFromQuaternion(this.quaternion, 'YXZ');
      const yaw = baseEuler.y + this.lookYaw;
      const pitch = THREE.MathUtils.clamp(
        baseEuler.x + this.lookPitch,
        this.lookLimits.pitchMin,
        this.lookLimits.pitchMax
      );
      this.camera.quaternion.setFromEuler(new THREE.Euler(pitch, yaw, baseEuler.z, 'YXZ'));
    } else {
      this.camera.quaternion.copy(this.quaternion);
    }
    if (Math.abs(this.camera.fov - this.fov) > 0.001) {
      this.camera.fov = this.fov;
      this.camera.updateProjectionMatrix();
    }
  }

  addLook(dYaw, dPitch) {
    this.lookYaw = THREE.MathUtils.clamp(this.lookYaw + dYaw, -this.lookLimits.yaw, this.lookLimits.yaw);
    this.lookPitch = THREE.MathUtils.clamp(this.lookPitch + dPitch, this.lookLimits.pitchMin, this.lookLimits.pitchMax);
  }

  resetLook() {
    this.lookYaw = 0;
    this.lookPitch = 0;
  }
}

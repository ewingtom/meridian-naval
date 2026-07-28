import * as THREE from 'three';

const EYE_HEIGHT = 2.3;
const WALK_SPEED = 4.2;
const SPRINT_SPEED = 7.5;
const MOUSE_SENS = 0.0022;

export const Station = {
  WALK: 'WALK',
  HELM: 'HELM',
  WEAPONS: 'WEAPONS',
  TRANSITION: 'TRANSITION',
};

/**
 * First-person walk controller (ship-local space, so the player stays glued to the
 * deck through pitch/roll) plus station sit-down (helm/weapons) with smooth camera
 * blends via CameraRig. All input is ignored mid-transition so nothing can interrupt
 * a blend halfway.
 */
export class PlayerController {
  constructor({ camera, cameraRig, domElement, playerShip, onInteractPrompt, onStationChange }) {
    this.camera = camera;
    this.rig = cameraRig;
    this.dom = domElement;
    this.ship = playerShip;
    this.onInteractPrompt = onInteractPrompt || (() => {});
    this.onStationChange = onStationChange || (() => {});

    this.state = Station.WALK;
    this.locked = false;

    // ship-local walk position/orientation — start on the open foredeck facing the bow.
    // Forward convention: forward = (0,0,-1).applyEuler(0,yaw,0) => yaw=PI faces +Z (bow).
    this.localPos = new THREE.Vector3(0, 0, 55);
    this.walkYaw = Math.PI;
    this.walkPitch = -0.03;

    this.keys = new Set();
    this._nearbyStation = null;
    this.mouseSensScale = 1; // settings-driven multiplier, 1 = default MOUSE_SENS
    this.invertY = false;

    this._bindEvents();

    this.walkBounds = { minX: -9.5, maxX: 9.5, minZ: -85, maxZ: 88 };
  }

  _bindEvents() {
    this.dom.addEventListener('click', () => {
      if (this.state === Station.WALK && !this.locked) {
        this.dom.requestPointerLock();
      }
    });
    document.addEventListener('pointerlockchange', () => {
      this.locked = document.pointerLockElement === this.dom;
    });
    document.addEventListener('mousemove', (e) => {
      if (!this.locked) return;
      const sens = MOUSE_SENS * this.mouseSensScale;
      const dy = this.invertY ? -e.movementY : e.movementY;
      if (this.state === Station.WALK) {
        this.walkYaw -= e.movementX * sens;
        this.walkPitch -= dy * sens;
        this.walkPitch = THREE.MathUtils.clamp(this.walkPitch, -1.35, 1.35);
      } else if (this.state === Station.HELM || this.state === Station.WEAPONS) {
        this.rig.addLook(-e.movementX * sens, -dy * sens);
      }
    });
    window.addEventListener('keydown', (e) => {
      this.keys.add(e.code);
      if (e.code === 'KeyE') this._tryInteract();
      if (e.code === 'Escape' && this.locked) document.exitPointerLock();
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
  }

  _tryInteract() {
    if (this.state === Station.WALK && this._nearbyStation) {
      this._enterStation(this._nearbyStation);
    } else if (this.state === Station.HELM || this.state === Station.WEAPONS) {
      this._exitStation();
    }
  }

  /** Current world position+orientation for a station, recomputed live from the
   * ship's present transform (not a snapshot) so it tracks movement/roll/pitch. */
  _stationWorldPose(name, out = { pos: new THREE.Vector3(), quat: new THREE.Quaternion() }) {
    const mp = this.ship.mountPoints;
    const local = name === Station.HELM ? mp.helm : mp.weaponsStation;
    const lookTarget = name === Station.HELM
      ? new THREE.Vector3(local.x, local.y, local.z + 20)
      : new THREE.Vector3(local.x, local.y - 2, local.z + 15);

    this.ship.getMountWorld(local, out.pos);
    const worldLook = this.ship.getMountWorld(lookTarget, new THREE.Vector3());
    const m = new THREE.Matrix4().lookAt(out.pos, worldLook, new THREE.Vector3(0, 1, 0));
    out.quat.setFromRotationMatrix(m);
    return out;
  }

  _enterStation(name) {
    this.state = Station.TRANSITION;
    this._transitionTarget = { type: 'station', name };
    this.rig.lookEnabled = false;
    this.rig.resetLook();
    this.onInteractPrompt(null);

    const { pos, quat } = this._stationWorldPose(name);
    const targetFov = name === Station.HELM ? 58 : 50;
    this.rig.transitionTo(pos, quat, targetFov, 1.15, () => {
      this.state = name;
      this.rig.lookEnabled = true;
      this.onStationChange(name);
    });
  }

  _exitStation() {
    const mp = this.ship.mountPoints;
    const stationLocal = this.state === Station.HELM ? mp.helm : mp.weaponsStation;
    this.localPos.set(stationLocal.x, 0, stationLocal.z - 3);
    this.walkYaw = Math.PI; // face aft, back toward the console just left
    this.walkPitch = -0.05;

    this.state = Station.TRANSITION;
    this._transitionTarget = { type: 'walk' };
    this.rig.lookEnabled = false;
    this.onStationChange(null);

    const worldPos = this._walkWorldPosition();
    const worldQuat = this._walkWorldQuaternion();
    this.rig.transitionTo(worldPos, worldQuat, 70, 1.0, () => {
      this.state = Station.WALK;
      this.onStationChange('WALK');
    });
  }

  _walkWorldPosition(out = new THREE.Vector3()) {
    out.set(this.localPos.x, this.ship.mountPoints.deckY + EYE_HEIGHT, this.localPos.z);
    return this.ship.getMountWorld(out, out);
  }

  _walkWorldQuaternion(out = new THREE.Quaternion()) {
    const shipQuat = this.ship.group.quaternion;
    const localLookQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(this.walkPitch, this.walkYaw, 0, 'YXZ'));
    return out.copy(shipQuat).multiply(localLookQuat);
  }

  update(dt) {
    if (this.state === Station.WALK) {
      this._updateWalk(dt);
    } else if (this.state === Station.HELM || this.state === Station.WEAPONS) {
      // rigidly track the ship's current mount-point transform every frame (not just
      // on entry) so the camera stays glued to the console through motion/pitch/roll —
      // free-look offset is layered on top by CameraRig itself via lookYaw/lookPitch.
      const { pos, quat } = this._stationWorldPose(this.state);
      this.rig.position.copy(pos);
      this.rig.quaternion.copy(quat);
    } else if (this.state === Station.TRANSITION && this._transitionTarget?.type === 'station') {
      // the ship keeps moving during the blend — chase the live mount pose so we
      // don't arrive at a stale (already-sailed-past) position.
      const { pos, quat } = this._stationWorldPose(this._transitionTarget.name);
      this.rig.retarget(pos, quat);
    }
  }

  _updateWalk(dt) {
    const speed = this.keys.has('ShiftLeft') || this.keys.has('ShiftRight') ? SPRINT_SPEED : WALK_SPEED;
    // derive movement axes from the same Euler convention used for the look
    // quaternion (THREE's default camera forward is local -Z) so walking
    // direction always matches what the player sees, at any yaw.
    const lookQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, this.walkYaw, 0, 'YXZ'));
    const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(lookQuat);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(lookQuat);
    const move = new THREE.Vector3();
    if (this.keys.has('KeyW')) move.add(fwd);
    if (this.keys.has('KeyS')) move.sub(fwd);
    if (this.keys.has('KeyD')) move.add(right);
    if (this.keys.has('KeyA')) move.sub(right);
    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(speed * dt);
      this.localPos.x = THREE.MathUtils.clamp(this.localPos.x + move.x, this.walkBounds.minX, this.walkBounds.maxX);
      this.localPos.z = THREE.MathUtils.clamp(this.localPos.z + move.z, this.walkBounds.minZ, this.walkBounds.maxZ);
    }

    const worldPos = this._walkWorldPosition();
    const worldQuat = this._walkWorldQuaternion();
    this.rig.setImmediate(worldPos, worldQuat, 70);

    // proximity check for interaction prompt
    const mp = this.ship.mountPoints;
    const dHelm = Math.hypot(this.localPos.x - mp.helm.x, this.localPos.z - mp.helm.z);
    const dWeapons = Math.hypot(this.localPos.x - mp.weaponsStation.x, this.localPos.z - mp.weaponsStation.z);
    let nearby = null;
    if (dHelm < 4.5) nearby = Station.HELM;
    else if (dWeapons < 4.5) nearby = Station.WEAPONS;

    if (nearby !== this._nearbyStation) {
      this._nearbyStation = nearby;
      this.onInteractPrompt(nearby);
    }
  }
}

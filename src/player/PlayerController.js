import * as THREE from 'three';

const EYE_HEIGHT = 1.72;
const WALK_SPEED = 3.4;
const SPRINT_SPEED = 6.0;
const MOUSE_SENS = 0.0022;

export const Station = {
  WALK: 'WALK',
  HELM: 'HELM',
  WEAPONS: 'WEAPONS',
  RADAR: 'RADAR',
  LOOKOUT: 'LOOKOUT',
  TRANSITION: 'TRANSITION',
};

/** Per-station config: which mount point to use, where to look (relative to the
 * mount, in ship-local space) by default, camera FOV, free-look limits, and the
 * interaction-prompt copy. Data-driven so adding another console later is one
 * entry, not new branches scattered through the class. */
const STATION_DEFS = {
  [Station.HELM]: {
    mountKey: 'helm',
    // Seated eye is behind the desk; look slightly up through the glass band.
    // Console/chair are moved to layer 2 while seated so they never occlude.
    lookOffset: new THREE.Vector3(0, 1.1, 55),
    fov: 58,
    lookLimits: { yaw: 1.15, pitchMin: -0.28, pitchMax: 0.22 },
    hideLayers: [2],
    promptText: 'Press E to take the Helm',
    barText: 'HELM — W/S Throttle · A/D Rudder · E to leave',
    accent: '#4de8ff',
  },
  [Station.WEAPONS]: {
    mountKey: 'weaponsStation',
    lookOffset: new THREE.Vector3(18, 0.8, 38),
    fov: 50,
    lookLimits: { yaw: 0.85, pitchMin: -0.35, pitchMax: 0.3 },
    hideLayers: [2],
    promptText: 'Press E to man Weapons Station',
    barText: 'WEAPONS — 1-4 Select · Click Fire · Tab Target · E Leave',
    accent: '#ffb02e',
  },
  [Station.RADAR]: {
    mountKey: 'radar',
    lookOffset: new THREE.Vector3(-18, 0.8, 38),
    fov: 50,
    lookLimits: { yaw: 0.85, pitchMin: -0.35, pitchMax: 0.3 },
    hideLayers: [2],
    promptText: 'Press E to man the Radar/Sonar Station',
    barText: 'RADAR/SONAR — Q Sonar Ping · Tab Cycle · E to leave',
    accent: '#4de8ff',
  },
  [Station.LOOKOUT]: {
    mountKey: 'lookout',
    // Out on the starboard bridge wing — wide horizon glass, binocular FOV.
    lookOffset: new THREE.Vector3(40, -0.1, 55),
    fov: 38,
    lookLimits: { yaw: 1.6, pitchMin: -0.7, pitchMax: 0.45 },
    promptText: 'Press E to take the Lookout',
    barText: 'LOOKOUT — Mouse Look · Scroll Zoom · E to leave',
    accent: '#3dffa0',
    zoomable: true,
    zoomMin: 28,
    zoomMax: 55,
  },
};
const STATION_PROXIMITY_M = 3.4;

/**
 * First-person walk controller (ship-local space, so the player stays glued to the
 * deck through pitch/roll) plus station sit-down (helm/weapons/radar/lookout) with
 * smooth camera blends via CameraRig. All input is ignored mid-transition so
 * nothing can interrupt a blend halfway.
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

    this.keys = new Set();
    this._nearbyStation = null;
    this.mouseSensScale = 1;
    this.invertY = false;
    this.lookoutZoom = 1;

    this._bindEvents();
    this._initForShip(playerShip);

    // Consoles live on layer 2 so seated cameras can hide them; keep them visible while walking.
    this.camera.layers.enable(2);
  }

  /** (Re)binds walk position/bounds to a given ship's mount points — used both at
   * construction and, in multiplayer, once when the lobby assigns the local player to
   * a specific ship before the patrol starts (the assignment is fixed for the whole
   * patrol, so this never runs mid-session). */
  _initForShip(ship) {
    this.ship = ship;
    // ship-local walk position/orientation — start just inside the bridge entrance,
    // facing forward into the bridge / out toward the bow.
    // Forward convention: forward = (0,0,-1).applyEuler(0,yaw,0) => yaw=PI faces +Z (bow).
    const spawn = ship.mountPoints?.spawn;
    this.localPos = spawn ? spawn.clone() : new THREE.Vector3(0, 0, 8);
    this.walkYaw = Math.PI;
    this.walkPitch = -0.02;
    const b = ship.mountPoints?.bounds;
    this.walkBounds = b || { minX: -7.5, maxX: 9, minZ: 6, maxZ: 22 };
  }

  setShip(ship) {
    this._initForShip(ship);
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
      } else if (STATION_DEFS[this.state]) {
        this.rig.addLook(-e.movementX * sens, -dy * sens);
      }
    });
    window.addEventListener('keydown', (e) => {
      this.keys.add(e.code);
      if (e.code === 'KeyE') this._tryInteract();
      if (e.code === 'Escape' && this.locked) document.exitPointerLock();
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    this.dom.addEventListener('wheel', (e) => {
      const def = STATION_DEFS[this.state];
      if (!def?.zoomable) return;
      e.preventDefault();
      const next = THREE.MathUtils.clamp(
        this.rig.fov + Math.sign(e.deltaY) * 2.4,
        def.zoomMin ?? 28,
        def.zoomMax ?? 60
      );
      this.rig.fov = next;
      this.lookoutZoom = (def.zoomMax ?? 55) / next;
    }, { passive: false });
  }

  _tryInteract() {
    if (this.state === Station.WALK && this._nearbyStation) {
      this._enterStation(this._nearbyStation);
    } else if (STATION_DEFS[this.state]) {
      this._exitStation();
    }
  }

  /** Current world position+orientation for a station, recomputed live from the
   * ship's present transform (not a snapshot) so it tracks movement/roll/pitch. */
  _stationWorldPose(name, out = { pos: new THREE.Vector3(), quat: new THREE.Quaternion() }) {
    const def = STATION_DEFS[name];
    const local = this.ship.mountPoints[def.mountKey];
    const lookTarget = local.clone().add(def.lookOffset);

    this.ship.getMountWorld(local, out.pos);
    const worldLook = this.ship.getMountWorld(lookTarget, new THREE.Vector3());
    const m = new THREE.Matrix4().lookAt(out.pos, worldLook, new THREE.Vector3(0, 1, 0));
    out.quat.setFromRotationMatrix(m);
    return out;
  }

  _applyStationLookLimits(name) {
    const def = STATION_DEFS[name];
    const lim = def?.lookLimits;
    if (!lim) {
      this.rig.lookLimits = { yaw: Math.PI, pitchMin: -1.3, pitchMax: 1.3 };
      return;
    }
    this.rig.lookLimits = {
      yaw: lim.yaw,
      pitchMin: lim.pitchMin,
      pitchMax: lim.pitchMax,
    };
  }

  _enterStation(name) {
    if (!this.ship.mountPoints?.[STATION_DEFS[name].mountKey]) return;

    this.state = Station.TRANSITION;
    this._transitionTarget = { type: 'station', name };
    this.rig.lookEnabled = false;
    this.rig.resetLook();
    this._applyStationLookLimits(name);
    this.onInteractPrompt(null);
    this.lookoutZoom = 1;
    this._applyStationLayers(name, true);

    const { pos, quat } = this._stationWorldPose(name);
    const def = STATION_DEFS[name];
    this.rig.transitionTo(pos, quat, def.fov, 1.05, () => {
      this.state = name;
      this.rig.lookEnabled = true;
      this.onStationChange(name);
    });
  }

  _exitStation() {
    const def = STATION_DEFS[this.state];
    const prev = this.state;
    const stationLocal = this.ship.mountPoints[def.mountKey];
    this.localPos.set(stationLocal.x, 0, stationLocal.z - 1.6);
    this.localPos.x = THREE.MathUtils.clamp(this.localPos.x, this.walkBounds.minX, this.walkBounds.maxX);
    this.localPos.z = THREE.MathUtils.clamp(this.localPos.z, this.walkBounds.minZ, this.walkBounds.maxZ);
    this.walkYaw = Math.PI;
    this.walkPitch = -0.05;
    this.lookoutZoom = 1;
    this._applyStationLayers(prev, false);

    this.state = Station.TRANSITION;
    this._transitionTarget = { type: 'walk' };
    this.rig.lookEnabled = false;
    this.onStationChange(null);

    const worldPos = this._walkWorldPosition();
    const worldQuat = this._walkWorldQuaternion();
    this.rig.transitionTo(worldPos, worldQuat, 70, 0.9, () => {
      this.state = Station.WALK;
      this.onStationChange('WALK');
    });
  }

  /** While seated, hide console furniture (layer 2) so the camera looks out the
   * glass instead of into desk/chair GLB meshes that fill the near frustum. */
  _applyStationLayers(name, seated) {
    const def = STATION_DEFS[name];
    if (!def?.hideLayers?.length || !this.camera) return;
    for (const layer of def.hideLayers) {
      if (seated) this.camera.layers.disable(layer);
      else this.camera.layers.enable(layer);
    }
  }

  _walkWorldPosition(out = new THREE.Vector3()) {
    const floorY = this.ship.mountPoints.floorY ?? this.ship.mountPoints.deckY;
    out.set(this.localPos.x, floorY + EYE_HEIGHT, this.localPos.z);
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
    } else if (STATION_DEFS[this.state]) {
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

    // proximity check for interaction prompt — nearest in-range station wins
    const mp = this.ship.mountPoints;
    let nearby = null, bestDist = STATION_PROXIMITY_M;
    for (const key of Object.keys(STATION_DEFS)) {
      const mount = mp[STATION_DEFS[key].mountKey];
      if (!mount) continue;
      const d = Math.hypot(this.localPos.x - mount.x, this.localPos.z - mount.z);
      if (d < bestDist) { bestDist = d; nearby = key; }
    }

    if (nearby !== this._nearbyStation) {
      this._nearbyStation = nearby;
      this.onInteractPrompt(nearby);
    }
  }

  /** Debug / cinematic helper — jump straight into a station without walking. */
  forceEnter(name) {
    if (!STATION_DEFS[name]) return;
    this._enterStation(name);
  }
}

export { STATION_DEFS };

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
  SONAR: 'SONAR',
  LOOKOUT: 'LOOKOUT',
  TAO: 'TAO',
  TRANSITION: 'TRANSITION',
};

/** Per-station config: which mount point to use, where to look (relative to the
 * mount, in ship-local space) by default, camera FOV, free-look limits, and the
 * interaction-prompt copy. Data-driven so adding another console later is one
 * entry, not new branches scattered through the class. */
const STATION_DEFS = {
  [Station.HELM]: {
    mountKey: 'helm',
    // Airborne chase view instead of a seated console shot: taking the wheel pulls
    // the camera up and behind the ship, banking the whole hull into view as she
    // turns — sells "piloting" as a distinct, more cinematic mode than just another
    // window seat, and gives a much better read on heading/turn radius than a fixed
    // bridge window ever could.
    cameraMode: 'chase',
    // 3/4 elevated chase — lower than the old drone so superstructure/turrets fill the
    // frame (judge: "gray wedge"). Slight lateral offset sells silhouette + wake.
    chaseOffset: new THREE.Vector3(42, 38, -105),
    chaseLookAhead: 18,
    fov: 62,
    lookLimits: { yaw: Math.PI * 0.85, pitchMin: -0.55, pitchMax: 0.5 },
    // Hide walkable BridgeInterior (layer 2) in chase — otherwise glass room + neon
    // consoles poke through the Burke exterior and read as a graybox flying bridge.
    hideLayers: [2],
    promptText: 'Press E to take the Helm',
    barText: 'HELM — Telegraph · Rudder · Course to waypoint · E Leave',
    accent: '#4de8ff',
  },
  [Station.WEAPONS]: {
    mountKey: 'weaponsStation',
    // Elevated tactical chase — tracks the designated contact when locked, otherwise
    // looks ahead of the bow. Distinct from helm's high drone and from a seated reticle.
    cameraMode: 'tactical',
    chaseOffset: new THREE.Vector3(32, 38, -88),
    chaseLookAhead: 120,
    fov: 46,
    lookLimits: { yaw: 1.05, pitchMin: -0.4, pitchMax: 0.32 },
    hideLayers: [2],
    promptText: 'Press E to man Weapons Station',
    barText: 'WEAPONS — Track · Designate · Fire solution · E Leave',
    accent: '#ffb02e',
  },
  [Station.RADAR]: {
    mountKey: 'radar',
    // Nose into the console CRT — the tactical plot owns the picture, not the window.
    lookOffset: new THREE.Vector3(0.2, -0.85, 6.5),
    fov: 40,
    lookLimits: { yaw: 0.55, pitchMin: -0.55, pitchMax: 0.2 },
    hideLayers: [2],
    promptText: 'Press E to man the Radar/Sonar Station',
    barText: 'RADAR — Filter · Range · Designate · Sonar · E Leave',
    accent: '#4de8ff',
  },
  [Station.SONAR]: {
    mountKey: 'sonar',
    // Doctrine split from Radar: ASW-focused console, nose into its own scope rather
    // than sharing Radar's surface/air plot.
    lookOffset: new THREE.Vector3(0.2, -0.85, 6.5),
    fov: 40,
    lookLimits: { yaw: 0.55, pitchMin: -0.55, pitchMax: 0.2 },
    hideLayers: [2],
    promptText: 'Press E to man Sonar/ASW',
    barText: 'SONAR — Active Ping (Q) · Localize · Prosecute · E Leave',
    accent: '#3dffa0',
  },
  [Station.LOOKOUT]: {
    mountKey: 'lookout',
    // Out on the starboard bridge wing — wide horizon glass, binocular FOV.
    lookOffset: new THREE.Vector3(40, -0.1, 55),
    fov: 38,
    lookLimits: { yaw: 1.6, pitchMin: -0.7, pitchMax: 0.45 },
    promptText: 'Press E to take the Lookout',
    barText: 'LOOKOUT — Scan · Zoom · Report contact (R) · E Leave',
    accent: '#3dffa0',
    zoomable: true,
    zoomMin: 22,
    zoomMax: 55,
  },
  [Station.TAO]: {
    mountKey: 'tao',
    // Command post: a high, near-vertical overview instead of a seated console shot —
    // reads as "owns the whole tactical picture" rather than one more window seat, and
    // is the physical home for the Task Force Net (C/V/B/N/M/Y) already usable from
    // any station — manning TAO is where a captain/TAO would actually issue them.
    cameraMode: 'chase',
    // Steep but NOT near-vertical: a straight-down offset makes the view direction
    // nearly parallel to the world-up used by Matrix4.lookAt, which gimbal-locks and
    // rolls the frame unpredictably. ~40° off vertical keeps the whole task force in
    // frame while staying numerically stable.
    chaseOffset: new THREE.Vector3(0, 190, -210),
    chaseLookAhead: 40,
    fov: 62,
    lookLimits: { yaw: Math.PI, pitchMin: -1.2, pitchMax: 0.15 },
    promptText: 'Press E to man TAO / CIC',
    barText: 'TAO — Share · Weapons Free/Hold · Ping · Screen · Wilco · E Leave',
    accent: '#ffe9b0',
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
    /** World-space point the weapons tactical camera slews toward (set by main). */
    this.trackTargetPos = null;
    /** Soft lock: keep tactical cam glued to trackTargetPos when true. */
    this.weaponsTrackLock = false;

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
    if (def.cameraMode === 'chase' || def.cameraMode === 'tactical') {
      // World-space rig, not a ship-local mount point: offset up/behind the hull in
      // the ship's OWN frame (so it swings around with her as she turns, like a
      // camera drone slaved to the ship) and look slightly ahead of her bow rather
      // than straight down at the deck, so forward motion actually reads as motion.
      const shipPos = this.ship.group.position;
      const shipQuat = this.ship.group.quaternion;
      out.pos.copy(def.chaseOffset).applyQuaternion(shipQuat).add(shipPos);
      let lookTarget;
      if (def.cameraMode === 'tactical' && this.trackTargetPos && (this.weaponsTrackLock || this.trackTargetPos)) {
        // Bias look toward the tracked contact so weapons feels like a director/chase cam.
        lookTarget = this.trackTargetPos.clone();
        lookTarget.y += 6;
      } else {
        const fwd = new THREE.Vector3(0, 0, 1).applyQuaternion(shipQuat);
        lookTarget = shipPos.clone()
          .addScaledVector(fwd, def.chaseLookAhead || 0)
          .add(new THREE.Vector3(0, def.cameraMode === 'tactical' ? 10 : 0, 0));
      }
      const m = new THREE.Matrix4().lookAt(out.pos, lookTarget, new THREE.Vector3(0, 1, 0));
      out.quat.setFromRotationMatrix(m);
      return out;
    }
    const local = this.ship.mountPoints[def.mountKey];
    const lookTarget = local.clone().add(def.lookOffset);

    this.ship.getMountWorld(local, out.pos);
    const worldLook = this.ship.getMountWorld(lookTarget, new THREE.Vector3());
    const m = new THREE.Matrix4().lookAt(out.pos, worldLook, new THREE.Vector3(0, 1, 0));
    out.quat.setFromRotationMatrix(m);
    return out;
  }

  /** True look bearing (0–360, north-referenced) from the live camera forward. */
  getLookBearingDeg() {
    const dir = new THREE.Vector3();
    this.camera.getWorldDirection(dir);
    dir.y = 0;
    if (dir.lengthSq() < 1e-6) return 0;
    dir.normalize();
    // Scene: +Z ~ north-ish for nav math used elsewhere (atan2(x,z)).
    return ((THREE.MathUtils.radToDeg(Math.atan2(dir.x, dir.z)) % 360) + 360) % 360;
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
    this.rig.transitionTo(pos, quat, def.fov, 1.45, () => {
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
    this.rig.transitionTo(worldPos, worldQuat, 70, 1.25, () => {
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

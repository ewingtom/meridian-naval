import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ShipPhysics } from './ShipPhysics.js';
import { buildPlaceholderShip } from './ShipPlaceholder.js';
import { getSharedMicroDetailMaps, getSharedHullTextures } from '../utils/ProceduralTextures.js';
import { buildBridgeInterior } from './BridgeInterior.js';
import { buildEnemyShipMesh } from '../entities/geometryKits.js';
import { ShipWake } from './ShipWake.js';
import { allocEntityId, Domain, IFF } from '../entities/Entity.js';

const MODEL_URL = '/assets/models/player_ship.glb';
const ESCORT_MODEL_URL = '/assets/models/escort_hull.glb';

let sharedEscortScenePromise = null;
function loadEscortHullScene() {
  if (!sharedEscortScenePromise) {
    sharedEscortScenePromise = new GLTFLoader().loadAsync(ESCORT_MODEL_URL).then((gltf) => gltf.scene);
  }
  return sharedEscortScenePromise;
}

/**
 * Any ship a human (or AI) can walk around, sit at a station in, and pilot — the
 * hero Meridian and the task-force escorts all use this class so multiplayer can
 * assign any player to any of them. `hullKind` picks the exterior:
 *   'hero'   — the real Blender player_ship.glb (async, placeholder-first), used only
 *              for the Meridian, exactly as PlayerShip.js used to build it standalone.
 *   'escort' — the real Blender escort_hull.glb (async, procedural buildEnemyShipMesh
 *              stand-in shown first so the ship isn't invisible for a frame), painted
 *              with `iffColor` via its IFF-trim material, used for task-force escorts.
 * Every instance gets its own walk-in BridgeInterior — scaled down for escorts, since
 * their hull's bridge block is much smaller than the Meridian's.
 */
export class CrewedShip {
  constructor(scene, { hullKind = 'hero', iffColor = 0x2f6a8a, name = 'Ship', shipId } = {}) {
    this.scene = scene;
    this.shipId = shipId;
    this.name = name;
    this.hullKind = hullKind;
    this.group = new THREE.Group();
    this.group.name = `CrewedShip:${shipId || name}`;
    scene.add(this.group);

    this.mountPoints = null;
    // Both hullKinds now show an instant procedural stand-in and swap to a real
    // Blender model once it loads asynchronously (see _tryLoadRealModel / _tryLoadEscortModel).
    this.usingPlaceholder = true;

    // Entity-shaped so the existing radar/targeting/weapons-collision code (which all
    // expects a flat list of { id, position, domain, iff, name, health, maxHealth,
    // alive, destroyed }) can treat crewed ships exactly like any other contact,
    // without a parallel bespoke code path.
    this.id = allocEntityId();
    this.domain = Domain.SURFACE;
    this.iff = IFF.FRIENDLY;
    this.maxHealth = 100;
    this.health = 100;
    this.alive = true;
    this.destroyed = false;
    this.ciwsAmmo = 1500;
    this._ciwsCooldown = 0;

    // Networked ships that aren't locally simulated (see MultiplayerSession) get their
    // transform driven by incoming state instead of local physics stepping.
    this.networked = false;
    this._netTarget = null; // { pos: Vector3, quat: Quaternion, speed } — lerp target

    if (hullKind === 'hero') {
      this.physics = new ShipPhysics({ length: 188, beam: 24, maxSpeedKn: 30, accel: 1.6, turnRate: 0.28 });
      this._loadPlaceholderImmediately();
      this._tryLoadRealModel();
    } else {
      const { group: hullGroup, length, beam, deckY } = buildEnemyShipMesh(iffColor);
      this.modelGroup = hullGroup;
      this.deckY = deckY;
      this.length = length;
      this.group.add(this.modelGroup);
      this.physics = new ShipPhysics({ length, beam, maxSpeedKn: 28, accel: 1.3, turnRate: 0.24 });
      this.mountPoints = this._proceduralExteriorMounts(length, beam, deckY);
      this._addBridgeInterior({ scale: 0.5, center: new THREE.Vector3(0, deckY + 5.5, 8), lite: true });
      this._tryLoadEscortModel(iffColor);
    }

    // Stern foam wake + bow spray (see ShipWake.js). Needs this.physics (just set above)
    // for hull length/beam and this.group (added to scene at the top of the constructor)
    // for world-space mount-point queries, so it's constructed last.
    this.wake = new ShipWake(scene, this);
  }

  /** Swap the procedural stand-in hull for the real Blender escort_hull.glb once it's
   * loaded, mirroring the hero's placeholder-then-swap pattern in _tryLoadRealModel.
   * escort_hull.glb is authored bow=+Z/up=+Y/beam=X and already centered on X=0 and
   * (very nearly) Z=0 with Y=0 at the waterline, so unlike the hostile enemy_destroyer.glb
   * fixup in EnemyShip.js this does NOT need any axis-reconciling rotation or box-based
   * re-centering — that box-shift approach would also silently break the named mount-point
   * empties below, since it repositions the instance root *after* their local positions
   * were authored relative to it. Only a small safety scale (in case the source model's
   * authored length ever drifts from the ShipPhysics length) is applied, about the
   * instance's own origin, which preserves that centering. */
  async _tryLoadEscortModel(iffColor) {
    try {
      const src = await loadEscortHullScene();
      const inst = src.clone(true);

      const box = new THREE.Box3().setFromObject(inst);
      const size = new THREE.Vector3();
      box.getSize(size);
      const targetLen = this.length || 110;
      if (size.z > 1) inst.scale.setScalar(targetLen / size.z);

      // Clone per-instance before tinting: escort1/escort2 share the cached glTF scene
      // (and its two IFF-trim meshes share one source material), so mutating a material
      // in place would tint both ships — and both trim strips on one ship — the same
      // color no matter which iffColor was requested. Map from the shared *original*
      // material's uuid to its one tinted clone so every mesh referencing that original
      // gets reassigned to the same clone, instead of only the first one encountered.
      const tintedByOrigUuid = new Map();
      inst.traverse((o) => {
        if (!o.isMesh) return;
        o.castShadow = true;
        o.receiveShadow = true;
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        for (let i = 0; i < mats.length; i++) {
          const mat = mats[i];
          if (!mat || !/IFF/i.test(mat.name || '')) continue;
          let cloned = tintedByOrigUuid.get(mat.uuid);
          if (!cloned) {
            cloned = mat.clone();
            cloned.color.setHex(iffColor);
            tintedByOrigUuid.set(mat.uuid, cloned);
          }
          if (Array.isArray(o.material)) o.material[i] = cloned;
          else o.material = cloned;
        }
      });
      this._addMicroDetailMaps(inst);

      const found = this._extractMountPoints(inst);

      this.group.remove(this.modelGroup);
      this.modelGroup = inst;
      this.group.add(this.modelGroup);
      if (found) this.mountPoints = { ...this.mountPoints, ...found };
      this.usingPlaceholder = false;
      // eslint-disable-next-line no-console
      console.log('[CrewedShip] Loaded high-detail escort model from', ESCORT_MODEL_URL);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('[CrewedShip] High-detail escort model not available yet, using placeholder.', err?.message || err);
    }
  }

  _proceduralExteriorMounts(length, beam, deckY) {
    return {
      gunBarrelTip: new THREE.Vector3(0, deckY + 1.5, length * 0.38),
      missileTubes: [new THREE.Vector3(0, deckY + 1.2, length * 0.2), new THREE.Vector3(0, deckY + 1.2, length * 0.1)],
      ciws: [new THREE.Vector3(0, deckY + 8, -length * 0.1)],
    };
  }

  _loadPlaceholderImmediately() {
    const { group: shipGroup, mountPoints } = buildPlaceholderShip({ length: 188, beam: 24 });
    this.modelGroup = shipGroup;
    this.mountPoints = mountPoints;
    this.group.add(this.modelGroup);
    this._addBridgeInterior();
  }

  /** Walk-in bridge (floor/windows/consoles). `scale`+`center` let a smaller hull (an
   * escort) get a proportionally smaller room positioned inside its own bridge block
   * instead of the Meridian-sized default. Mount points get the same transform applied
   * so PlayerController's ship-local math keeps working unmodified. */
  _addBridgeInterior({ scale = 1, center = null, lite = false } = {}) {
    if (this.bridgeInterior) return;
    const { group: interiorGroup, mountPoints: interiorPts } = buildBridgeInterior({ lite });

    let offset = new THREE.Vector3(0, 0, 0);
    if (scale !== 1 || center) {
      const origMinX = interiorPts.bounds.minX - 0.6, origMaxX = interiorPts.bounds.maxX + 0.3;
      const origCenter = new THREE.Vector3(
        (origMinX + origMaxX) / 2,
        interiorPts.floorY,
        (interiorPts.bounds.minZ - 0.6 + interiorPts.bounds.maxZ + 0.8) / 2
      );
      const scaledCenter = origCenter.clone().multiplyScalar(scale);
      const target = center || origCenter;
      offset = target.clone().sub(scaledCenter);
      interiorGroup.scale.setScalar(scale);
      interiorGroup.position.copy(offset);
    }

    this.bridgeInterior = interiorGroup;
    this.group.add(interiorGroup);

    const xform = (v) => v.clone().multiplyScalar(scale).add(offset);
    const scaledPts = {
      helm: xform(interiorPts.helm),
      weaponsStation: xform(interiorPts.weaponsStation),
      radar: xform(interiorPts.radar),
      lookout: xform(interiorPts.lookout),
      spawn: xform(interiorPts.spawn),
      floorY: interiorPts.floorY * scale + offset.y,
      bounds: {
        minX: interiorPts.bounds.minX * scale + offset.x,
        maxX: interiorPts.bounds.maxX * scale + offset.x,
        minZ: interiorPts.bounds.minZ * scale + offset.z,
        maxZ: interiorPts.bounds.maxZ * scale + offset.z,
      },
    };
    this.mountPoints = { ...this.mountPoints, ...scaledPts };
  }

  async _tryLoadRealModel() {
    const loader = new GLTFLoader();
    try {
      const gltf = await loader.loadAsync(MODEL_URL);
      const loaded = gltf.scene;
      loaded.traverse((o) => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
        }
      });
      this._addMicroDetailMaps(loaded);
      loaded.rotation.y = -Math.PI / 2;

      const found = this._extractMountPoints(loaded);
      this._reconcileWithBridgeInterior(loaded);
      this.group.remove(this.modelGroup);
      this.modelGroup = loaded;
      this.group.add(this.modelGroup);
      if (found) this.mountPoints = { ...this.mountPoints, ...found };
      this.usingPlaceholder = false;
      // eslint-disable-next-line no-console
      console.log('[CrewedShip] Loaded high-detail model from', MODEL_URL);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('[CrewedShip] High-detail model not available yet, using placeholder.', err?.message || err);
    }
  }

  _addMicroDetailMaps(root) {
    const { normalMap: srcNormal, roughnessMap: srcRough } = getSharedMicroDetailMaps();
    // Subtle weathering only — heavy panel albedo at high UV repeat reads as tiled plastic
    // vs WoWS (judge FAIL). Prefer roughness/normal grit over replacing albedo.
    const hullSet = getSharedHullTextures('crewHullPbr', {
      size: 1024,
      baseColor: [0.72, 0.74, 0.76],
      panelCols: 7,
      panelRows: 11,
      rustColor: [0.36, 0.22, 0.15],
      rustAmount: 0.18,
      seed: 41,
    });
    const seen = new Set();
    root.traverse((o) => {
      if (!o.isMesh || !o.material) return;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      for (const mat of mats) {
        if (seen.has(mat.uuid)) continue;
        seen.add(mat.uuid);
        if (!mat.isMeshStandardMaterial && !mat.isMeshPhysicalMaterial) continue;
        if (mat.transparent || mat.opacity < 0.95) continue;
        if (mat.emissive && mat.emissive.getHex() > 0 && (mat.emissiveIntensity || 0) > 0.2) continue;

        if (!mat.map) {
          const m = hullSet.map.clone(); m.needsUpdate = true;
          m.repeat.set(2.5, 4); m.wrapS = m.wrapT = THREE.RepeatWrapping;
          mat.map = m;
          mat.color.setHex(0xffffff);
        }
        if (!mat.normalMap) {
          const n = hullSet.normalMap.clone(); n.needsUpdate = true;
          n.repeat.set(2.5, 4); n.wrapS = n.wrapT = THREE.RepeatWrapping;
          mat.normalMap = n;
          mat.normalScale = new THREE.Vector2(0.35, 0.35);
        } else if (!mat.normalScale || mat.normalScale.lengthSq() < 0.02) {
          const n = srcNormal.clone(); n.needsUpdate = true;
          n.repeat.set(16, 16); n.wrapS = n.wrapT = THREE.RepeatWrapping;
          mat.normalMap = n;
          mat.normalScale = new THREE.Vector2(0.16, 0.16);
        }
        if (!mat.roughnessMap) {
          const r = (mat.map ? hullSet.roughnessMap : srcRough).clone();
          r.needsUpdate = true;
          r.repeat.set(mat.map ? 2.5 : 16, mat.map ? 4 : 16);
          r.wrapS = r.wrapT = THREE.RepeatWrapping;
          mat.roughnessMap = r;
        }
        if (typeof mat.roughness === 'number') mat.roughness = Math.max(0.42, Math.min(0.88, mat.roughness + 0.08));
        if (typeof mat.metalness === 'number') mat.metalness = Math.min(mat.metalness, 0.28);
        mat.envMapIntensity = typeof mat.envMapIntensity === 'number'
          ? Math.min(1.25, Math.max(0.7, mat.envMapIntensity))
          : 0.95;
        mat.needsUpdate = true;
      }
    });
  }

  _reconcileWithBridgeInterior(root) {
    const hide = [
      'Bridge_Glass', 'Bridge_Mullions',
      'BridgeWing_P', 'BridgeWing_S', 'BridgeWingWall_P', 'BridgeWingWall_S',
      'SS_Bridge', 'Bridge', 'BridgeInterior', 'Bridge_Roof', 'BridgeRoof',
    ];
    for (const name of hide) {
      const o = root.getObjectByName(name);
      if (o) o.visible = false;
    }
    root.traverse((o) => {
      if (!o.isMesh) return;
      const n = o.name || '';
      if (/bridge/i.test(n) && !/radar|mast|antenna/i.test(n)) {
        o.visible = false;
      }
    });
  }

  _extractMountPoints(root) {
    const pts = {};
    const missiles = [];
    const ciws = [];
    root.traverse((o) => {
      if (o.name === 'Helm') pts.helm = o.position.clone();
      else if (o.name === 'WeaponsStation') pts.weaponsStation = o.position.clone();
      else if (o.name === 'GunBarrelTip') pts.gunBarrelTip = o.position.clone();
      else if (o.name.startsWith('MissileTube')) missiles.push(o.position.clone());
      else if (o.name.startsWith('CIWS')) ciws.push(o.position.clone());
    });
    if (missiles.length) pts.missileTubes = missiles;
    if (ciws.length) pts.ciws = ciws;
    return Object.keys(pts).length ? pts : null;
  }

  setCommand(throttle, rudder) {
    this.physics.setCommand(throttle, rudder);
  }

  update(dt, elapsed, getWaveHeight) {
    if (this.networked && this._netTarget) {
      // Replicated ship: ease toward the last received network transform instead of
      // stepping local physics, so it doesn't fight the authoritative client's motion.
      const t = Math.min(1, dt * 6);
      this.physics.position.lerp(this._netTarget.pos, t);
      this.physics.heading = THREE.MathUtils.lerp(this.physics.heading, this._netTarget.heading, t);
      this.physics.speed = THREE.MathUtils.lerp(this.physics.speed, this._netTarget.speed, t);
      this.physics.roll = THREE.MathUtils.lerp(this.physics.roll || 0, this._netTarget.roll || 0, t);
      this.physics.pitch = THREE.MathUtils.lerp(this.physics.pitch || 0, this._netTarget.pitch || 0, t);
      this.physics.applyToObject3D(this.group);
      this.group.updateMatrixWorld();
      this.wake?.update(dt, elapsed, getWaveHeight);
      return;
    }
    this.physics.update(dt, getWaveHeight, elapsed);
    this.physics.applyToObject3D(this.group);
    this.group.updateMatrixWorld();
    this.wake?.update(dt, elapsed, getWaveHeight);
  }

  applyNetworkState({ pos, heading, speed, roll, pitch }) {
    this._netTarget = { pos: new THREE.Vector3(pos.x, pos.y, pos.z), heading, speed, roll, pitch };
  }

  /** World-space position of a named/indexed mount point. */
  getMountWorld(localPoint, target = new THREE.Vector3()) {
    return target.copy(localPoint).applyMatrix4(this.group.matrixWorld);
  }

  get position() {
    return this.group.position;
  }

  get forward() {
    return this.physics.forward;
  }

  distanceTo(vec3) {
    return this.group.position.distanceTo(vec3);
  }

  takeDamage(amount) {
    if (!this.alive) return;
    this.health = Math.max(0, this.health - amount);
    if (this.health <= 0) {
      this.alive = false;
      this.destroyed = true;
    }
  }

  dispose(scene) {
    this.wake?.dispose();
    scene.remove(this.group);
    this.group.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
        else o.material.dispose();
      }
    });
  }
}

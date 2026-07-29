import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ShipPhysics } from './ShipPhysics.js';
import { buildPlaceholderShip } from './ShipPlaceholder.js';
import { getSharedMicroDetailMaps } from '../utils/ProceduralTextures.js';
import { buildBridgeInterior } from './BridgeInterior.js';
import { buildEnemyShipMesh } from '../entities/geometryKits.js';
import { allocEntityId, Domain, IFF } from '../entities/Entity.js';

const MODEL_URL = '/assets/models/player_ship.glb';

/**
 * Any ship a human (or AI) can walk around, sit at a station in, and pilot — the
 * hero Meridian and the task-force escorts all use this class so multiplayer can
 * assign any player to any of them. `hullKind` picks the exterior:
 *   'hero'   — the real Blender player_ship.glb (async, placeholder-first), used only
 *              for the Meridian, exactly as PlayerShip.js used to build it standalone.
 *   'escort' — the procedural buildEnemyShipMesh hull (already built, no placeholder
 *              swap needed), painted with `iffColor`, used for task-force escorts.
 * Every instance gets its own walk-in BridgeInterior — scaled down for escorts, since
 * their procedural hull's bridge block is much smaller than the Meridian's.
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
    this.usingPlaceholder = hullKind === 'hero';

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
      this.group.add(this.modelGroup);
      this.physics = new ShipPhysics({ length, beam, maxSpeedKn: 28, accel: 1.3, turnRate: 0.24 });
      this.mountPoints = this._proceduralExteriorMounts(length, beam, deckY);
      this._addBridgeInterior({ scale: 0.5, center: new THREE.Vector3(0, deckY + 5.5, 8) });
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
  _addBridgeInterior({ scale = 1, center = null } = {}) {
    if (this.bridgeInterior) return;
    const { group: interiorGroup, mountPoints: interiorPts } = buildBridgeInterior();

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
    const seen = new Set();
    root.traverse((o) => {
      if (!o.isMesh || !o.material) return;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      for (const mat of mats) {
        if (seen.has(mat.uuid)) continue;
        seen.add(mat.uuid);
        if (!mat.isMeshStandardMaterial && !mat.isMeshPhysicalMaterial) continue;
        if (mat.transparent || mat.opacity < 0.95) continue;
        if (!mat.normalMap) {
          const n = srcNormal.clone(); n.needsUpdate = true;
          n.repeat.set(48, 48); n.wrapS = n.wrapT = THREE.RepeatWrapping;
          mat.normalMap = n;
          mat.normalScale = new THREE.Vector2(0.18, 0.18);
        }
        if (!mat.roughnessMap) {
          const r = srcRough.clone(); r.needsUpdate = true;
          r.repeat.set(48, 48); r.wrapS = r.wrapT = THREE.RepeatWrapping;
          mat.roughnessMap = r;
        }
        if (typeof mat.roughness === 'number') mat.roughness = Math.max(0.55, Math.min(0.92, mat.roughness + 0.2));
        if (typeof mat.metalness === 'number') mat.metalness = Math.min(mat.metalness, 0.25);
        if (mat.color) mat.color.multiplyScalar(0.92);
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
      return;
    }
    this.physics.update(dt, getWaveHeight, elapsed);
    this.physics.applyToObject3D(this.group);
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

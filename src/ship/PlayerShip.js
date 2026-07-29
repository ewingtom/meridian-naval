import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ShipPhysics } from './ShipPhysics.js';
import { buildPlaceholderShip } from './ShipPlaceholder.js';
import { getSharedMicroDetailMaps } from '../utils/ProceduralTextures.js';

const MODEL_URL = '/src/assets/models/player_ship.glb';

export class PlayerShip {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'PlayerShip';
    scene.add(this.group);

    this.physics = new ShipPhysics({ length: 188, beam: 24, maxSpeedKn: 30, accel: 1.6, turnRate: 0.28 });
    this.mountPoints = null;
    this.usingPlaceholder = true;

    this._loadPlaceholderImmediately();
    this._tryLoadRealModel();
  }

  _loadPlaceholderImmediately() {
    const { group: shipGroup, mountPoints } = buildPlaceholderShip({ length: 188, beam: 24 });
    this.modelGroup = shipGroup;
    this.mountPoints = mountPoints;
    this.group.add(this.modelGroup);
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

      // The Blender export's long axis is local +X (bow), but the whole game
      // (mount points, physics.forward, camera framing) assumes bow = +Z.
      // Rotate -90 deg around Y so local +X (bow) lands on world +Z.
      loaded.rotation.y = -Math.PI / 2;

      // swap in — keep mountPoints from placeholder unless the model defines its own
      // (named empties: Helm, WeaponsStation, GunBarrelTip, MissileTube1..N, CIWS1..N)
      const found = this._extractMountPoints(loaded);
      this.group.remove(this.modelGroup);
      this.modelGroup = loaded;
      this.group.add(this.modelGroup);
      if (found) this.mountPoints = { ...this.mountPoints, ...found };
      this.usingPlaceholder = false;
      // eslint-disable-next-line no-console
      console.log('[PlayerShip] Loaded high-detail model from', MODEL_URL);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('[PlayerShip] High-detail model not available yet, using placeholder.', err?.message || err);
    }
  }

  /** The Blender-baked materials shipped with flat albedo and zero normal maps
   * (they read as a perfectly smooth painted surface even close up). Layer a
   * high-frequency procedural micro-scratch/brushed-metal normal+roughness map
   * on top at a steep repeat so it reads as real surface micro-detail without
   * needing to match the model's actual UV layout. */
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
        // skip glass/transparent surfaces (bridge windows etc.) — scratches on glass read wrong
        if (mat.transparent || mat.opacity < 0.95) continue;
        if (!mat.normalMap) {
          const n = srcNormal.clone(); n.needsUpdate = true;
          n.repeat.set(120, 120); n.wrapS = n.wrapT = THREE.RepeatWrapping;
          mat.normalMap = n;
          mat.normalScale = new THREE.Vector2(0.35, 0.35);
        }
        if (!mat.roughnessMap) {
          const r = srcRough.clone(); r.needsUpdate = true;
          r.repeat.set(120, 120); r.wrapS = r.wrapT = THREE.RepeatWrapping;
          mat.roughnessMap = r;
        }
        mat.needsUpdate = true;
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
    this.physics.update(dt, getWaveHeight, elapsed);
    this.physics.applyToObject3D(this.group);
  }

  /** World-space position of a named/indexed mount point. */
  getMountWorld(localPoint, target = new THREE.Vector3()) {
    return target.copy(localPoint).applyMatrix4(this.group.matrixWorld);
  }
}

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Entity, Domain, IFF } from './Entity.js';
import { buildEnemyShipMesh } from './geometryKits.js';
import { ShipPhysics } from '../ship/ShipPhysics.js';
import { getSharedMicroDetailMaps } from '../utils/ProceduralTextures.js';

const State = { PATROL: 'PATROL', ENGAGE: 'ENGAGE', SINKING: 'SINKING' };
const MODEL_URL = '/assets/models/enemy_destroyer.glb';

let sharedModelPromise = null;
function loadDestroyerScene() {
  if (!sharedModelPromise) {
    sharedModelPromise = new GLTFLoader().loadAsync(MODEL_URL).then((gltf) => gltf.scene);
  }
  return sharedModelPromise;
}

export class EnemyShip extends Entity {
  constructor({ name = 'Contact', position, patrolPoints = [], scene }) {
    super({ name, domain: Domain.SURFACE, iff: IFF.HOSTILE, maxHealth: 140, position });
    // Instant procedural stand-in, then swap for Blender hero mesh when ready.
    const { group, length, beam, deckY } = buildEnemyShipMesh();
    this.group = group;
    this.deckY = deckY;
    this.length = length;
    this.beam = beam;
    this.physics = new ShipPhysics({ length, beam, maxSpeedKn: 24, accel: 1.1, turnRate: 0.22 });
    this.physics.position.copy(position);
    this.patrolPoints = patrolPoints;
    this._patrolIdx = 0;
    this.state = State.PATROL;
    this.engageRangeM = 3200;
    this.gunRangeM = 2600;
    this.missileRangeM = 4200;
    this._gunCooldown = 0;
    this._missileCooldown = Math.random() * 8 + 6;
    this._sinkT = 0;
    scene.add(this.group);
    this._tryUpgradeModel();
  }

  async _tryUpgradeModel() {
    try {
      const src = await loadDestroyerScene();
      const inst = src.clone(true);
      // The Blender export's true length axis is local +Y, not +Z (confirmed via the
      // glTF accessor bounds: Y span ~137m vs X ~16m/Z ~33m) — measuring "length" off
      // the raw Z-extent before reconciling axes read the ship's beam/height as its
      // length, producing a scale factor ~6x too large. That's what caused the ~460m
      // mast-into-the-stratosphere bug: the whole model, mast included, got scaled up
      // by that bogus factor. Rotate -90° about X first so the true length axis lands
      // on Z and "up" lands on Y, matching bow=+Z/up=+Y, *then* measure/scale.
      // (+90°, not -90°: the sign matters here — the wrong one still fixed the scale
      // but left the hull's own mesh taller than the mast/bridge/radome, i.e. right
      // proportions, upside-down stacking. Verified via per-part world-space Box3 Y
      // ranges: Hull must end up lowest, Radome/Mast highest.)
      inst.rotation.x = Math.PI / 2;
      inst.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(inst);
      const size = new THREE.Vector3();
      box.getSize(size);
      const targetLen = this.length || 110;
      if (size.z > 1) inst.scale.setScalar(targetLen / size.z);
      // Center keel on origin XZ; keep deck roughly aligned.
      box.setFromObject(inst);
      const center = new THREE.Vector3();
      box.getCenter(center);
      inst.position.x -= center.x;
      inst.position.z -= center.z;
      inst.position.y -= box.min.y;

      const { normalMap, roughnessMap } = getSharedMicroDetailMaps();
      inst.traverse((o) => {
        if (!o.isMesh) return;
        o.castShadow = true;
        o.receiveShadow = true;
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        for (const mat of mats) {
          if (!mat || mat.transparent) continue;
          if (!mat.normalMap) {
            const n = normalMap.clone(); n.needsUpdate = true;
            n.repeat.set(40, 40); n.wrapS = n.wrapT = THREE.RepeatWrapping;
            mat.normalMap = n;
            mat.normalScale = new THREE.Vector2(0.45, 0.45);
          }
          if (!mat.roughnessMap) {
            const r = roughnessMap.clone(); r.needsUpdate = true;
            r.repeat.set(40, 40); r.wrapS = r.wrapT = THREE.RepeatWrapping;
            mat.roughnessMap = r;
          }
          // Kill plastic chrome: force maritime roughness floor.
          if (typeof mat.roughness === 'number') mat.roughness = Math.max(mat.roughness, 0.45);
          if (typeof mat.metalness === 'number') mat.metalness = Math.min(mat.metalness, 0.35);
          mat.needsUpdate = true;
        }
      });

      // Replace children of placeholder group
      while (this.group.children.length) this.group.remove(this.group.children[0]);
      this.group.add(inst);
      this.deckY = 7.2 * (targetLen / 140);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[EnemyShip] Blender destroyer unavailable, keeping procedural mesh.', err?.message || err);
    }
  }

  onDestroyed() {
    this.state = State.SINKING;
    this._sinkT = 0;
  }

  update(dt, ctx) {
    const { playerPos, elapsed, fireWeapon, getWaveHeight } = ctx;

    if (this.state === State.SINKING) {
      this._sinkT += dt;
      this.group.rotation.z += dt * 0.15;
      this.group.position.y -= dt * 1.4;
      this.group.rotation.x += dt * 0.05;
      if (this._sinkT > 8) this.destroyed = true;
      return;
    }

    const distToPlayer = this.physics.position.distanceTo(playerPos);

    if (this.state === State.PATROL) {
      if (distToPlayer < this.engageRangeM) {
        this.state = State.ENGAGE;
      } else if (this.patrolPoints.length) {
        const target = this.patrolPoints[this._patrolIdx];
        const d = this.physics.position.distanceTo(target);
        if (d < 60) this._patrolIdx = (this._patrolIdx + 1) % this.patrolPoints.length;
        this._steerToward(target, 0.55);
      } else {
        this.physics.setCommand(0.3, 0);
      }
    } else if (this.state === State.ENGAGE) {
      if (distToPlayer > this.engageRangeM * 1.35) {
        this.state = State.PATROL;
      } else {
        const desiredRange = this.gunRangeM * 0.75;
        const throttle = distToPlayer > desiredRange ? 0.85 : distToPlayer < desiredRange * 0.6 ? -0.3 : 0.15;
        this._steerToward(playerPos, throttle);

        this._gunCooldown -= dt;
        if (distToPlayer < this.gunRangeM && this._gunCooldown <= 0) {
          this._gunCooldown = 1.4 + Math.random() * 0.8;
          fireWeapon('enemyShell', this._muzzleWorld(), playerPos.clone(), this);
        }
        this._missileCooldown -= dt;
        if (distToPlayer < this.missileRangeM && this._missileCooldown <= 0) {
          this._missileCooldown = 14 + Math.random() * 10;
          fireWeapon('enemyMissile', this._muzzleWorld(), playerPos.clone(), this);
        }
      }
    }

    this.physics.update(dt, getWaveHeight, elapsed);
    this.physics.applyToObject3D(this.group);
    this.position.copy(this.physics.position);
    this.heading = this.physics.heading;
  }

  _steerToward(targetPos, throttle) {
    const toTarget = new THREE.Vector3().subVectors(targetPos, this.physics.position);
    const desiredHeading = Math.atan2(-toTarget.x, -toTarget.z);
    let diff = desiredHeading - this.physics.heading;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    const rudder = THREE.MathUtils.clamp(diff * 1.4, -1, 1);
    this.physics.setCommand(throttle, rudder);
  }

  _muzzleWorld() {
    return this.group.localToWorld(new THREE.Vector3(0, this.deckY + 1.5, this.length * 0.38));
  }
}

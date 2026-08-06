import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Entity, Domain, IFF } from './Entity.js';
import { buildMerchantShipMesh } from './geometryKits.js';
import { ShipPhysics } from '../ship/ShipPhysics.js';

const MERCHANT_MODEL_URL = `${import.meta.env.BASE_URL || '/'}assets/models/merchant_ship.glb`;

// One fetch/parse shared by every merchant hull on the map — DynamicOps tops up
// civilian traffic over a patrol, and without this each new hull would re-download
// and re-parse the same 2.4MB asset. Each ship still clones the parsed scene so
// per-instance material tweaks can't leak across vessels.
let sharedMerchantPromise = null;
function loadMerchantScene() {
  if (!sharedMerchantPromise) {
    sharedMerchantPromise = new GLTFLoader().loadAsync(MERCHANT_MODEL_URL).then((gltf) => gltf.scene);
  }
  return sharedMerchantPromise;
}

/**
 * Neutral civilian traffic — a merchant/tanker transiting a long straight lane
 * back and forth across the patrol area. Unarmed and non-aggressive: it never
 * engages, never evades, just goes about its business, so the ocean reads as a
 * living working sea rather than only player + military units.
 */
export class MerchantShip extends Entity {
  constructor({ name = 'MV Contact', position, waypoints, scene }) {
    super({ name, domain: Domain.SURFACE, iff: IFF.NEUTRAL, maxHealth: 260, position });
    const { group, length, beam, deckY } = buildMerchantShipMesh();
    this.group = group;
    this.deckY = deckY;
    this.physics = new ShipPhysics({ length, beam, maxSpeedKn: 14, accel: 0.4, turnRate: 0.12 });
    this.physics.position.copy(position);
    /** long back-and-forth transit lane — two or more points a few km apart */
    this.waypoints = waypoints;
    this._wpIdx = 1;
    const toFirst = new THREE.Vector3().subVectors(waypoints[1], waypoints[0]);
    this.physics.heading = Math.atan2(-toFirst.x, -toFirst.z);
    this.length = length;
    scene.add(this.group);
    this._tryUpgradeModel();
  }

  /** Swap the procedural box-and-cylinder placeholder for the Blender hull once it
   *  loads. Same instant-placeholder-then-upgrade pattern as EnemyShip/Submarine —
   *  the ship is always visible and steering correctly from frame one, so a slow
   *  asset fetch can never leave a hole in the picture.
   *
   *  merchant_ship.glb is authored bow=+Z / up=+Y / beam=X, centred on X=0/Z=0 with
   *  Y=0 at the waterline (see scripts/blender/build_merchant_ship.py, which applies
   *  the +90 deg X rotation before export precisely so the runtime needs none). That
   *  matches escort_hull.glb's convention, so — unlike enemy_submarine.glb — this
   *  needs no axis reconciliation, only a safety rescale if the authored LOA ever
   *  drifts from the physics length this hull was built with. */
  async _tryUpgradeModel() {
    try {
      const src = await loadMerchantScene();
      const inst = src.clone(true);
      const box = new THREE.Box3().setFromObject(inst);
      const size = new THREE.Vector3();
      box.getSize(size);
      const targetLen = this.length || 150;
      if (size.z > 1) inst.scale.setScalar(targetLen / size.z);
      inst.traverse((o) => {
        if (!o.isMesh) return;
        o.castShadow = true;
        o.receiveShadow = true;
      });
      while (this.group.children.length) this.group.remove(this.group.children[0]);
      this.group.add(inst);
    } catch (err) {
      // Keep the procedural placeholder — a missing/renamed asset should cost
      // visual quality, never make civilian traffic vanish off the plot.
      console.warn('[MerchantShip] GLB upgrade failed, keeping procedural hull:', err);
    }
  }

  update(dt, ctx) {
    const { elapsed, getWaveHeight } = ctx;

    const target = this.waypoints[this._wpIdx];
    const toTarget = new THREE.Vector3().subVectors(target, this.physics.position);
    if (Math.hypot(toTarget.x, toTarget.z) < 150) {
      this._wpIdx = (this._wpIdx + 1) % this.waypoints.length;
    }
    const desiredHeading = Math.atan2(-toTarget.x, -toTarget.z);
    let diff = desiredHeading - this.physics.heading;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    const rudder = THREE.MathUtils.clamp(diff * 0.8, -1, 1);
    this.physics.setCommand(0.55, rudder);

    this.physics.update(dt, getWaveHeight, elapsed);
    this.physics.applyToObject3D(this.group);
    this.position.copy(this.physics.position);
    this.heading = this.physics.heading;
  }
}

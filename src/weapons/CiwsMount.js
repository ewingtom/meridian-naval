import * as THREE from 'three';
import { getSharedDotTexture } from '../utils/ProceduralTextures.js';

/**
 * Visible Phalanx-style CIWS mounts.
 *
 * The mounts are NOT parented into the ship's object graph — they live in the scene
 * and copy the ship's world transform each frame, so nothing about the ship model or
 * its hierarchy is mutated. Each mount slews (yaw + elevation, rate-limited like the
 * real thing at ~100 deg/s) toward the closest inbound threat while one is in range,
 * spins its barrel cluster while firing, and returns to a stowed bearing when clear.
 *
 * `muzzleWorld()` is the authoritative spawn point for both the tracer stream and the
 * intercept round, so the visual and the mechanic always agree.
 */

const SLEW_RATE = 2.0;      // rad/s in azimuth (~115 deg/s)
const ELEV_RATE = 1.6;      // rad/s in elevation
const ELEV_MIN = -0.20;
const ELEV_MAX = 1.40;

let _mats = null;
function mats() {
  if (_mats) return _mats;
  _mats = {
    base: new THREE.MeshStandardMaterial({ color: 0x6f7378, metalness: 0.6, roughness: 0.55 }),
    dome: new THREE.MeshStandardMaterial({ color: 0xd9d6cf, metalness: 0.25, roughness: 0.65 }),
    barrel: new THREE.MeshStandardMaterial({ color: 0x3a3d40, metalness: 0.8, roughness: 0.35 }),
  };
  return _mats;
}

let _geos = null;
function geos() {
  if (_geos) return _geos;
  _geos = {
    pedestal: new THREE.CylinderGeometry(1.15, 1.45, 1.6, 12),
    ring: new THREE.CylinderGeometry(1.3, 1.3, 0.4, 12),
    dome: new THREE.CapsuleGeometry(1.15, 1.5, 4, 12),
    ammoDrum: new THREE.CylinderGeometry(1.35, 1.35, 1.8, 12),
    barrel: new THREE.CylinderGeometry(0.13, 0.13, 3.2, 6),
    barrelHub: new THREE.CylinderGeometry(0.5, 0.55, 1.2, 8),
  };
  return _geos;
}

const _v = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _q = new THREE.Quaternion();

export class CiwsMount {
  constructor(scene, localPos) {
    this.scene = scene;
    this.localPos = localPos.clone();
    this.yaw = 0;
    this.pitch = 0.25;
    this.spin = 0;
    this.spinRate = 0;
    this.lastFire = -10;

    const m = mats();
    const g = geos();
    this.group = new THREE.Group();
    this.group.name = 'CIWS_FX_Mount';

    const pedestal = new THREE.Mesh(g.pedestal, m.base);
    pedestal.position.y = 0.8;
    this.group.add(pedestal);

    // Everything above the pedestal trains in azimuth.
    this.turret = new THREE.Group();
    this.turret.position.y = 1.6;
    this.group.add(this.turret);

    const drum = new THREE.Mesh(g.ammoDrum, m.base);
    drum.position.y = 0.9;
    this.turret.add(drum);

    // The gun/radome assembly elevates.
    this.cradle = new THREE.Group();
    this.cradle.position.y = 1.9;
    this.turret.add(this.cradle);

    const dome = new THREE.Mesh(g.dome, m.dome);
    dome.rotation.x = Math.PI / 2;
    dome.position.set(0, 0.35, -0.15);
    this.cradle.add(dome);

    // Rotating six-barrel cluster, pointing +Z in cradle space.
    this.barrels = new THREE.Group();
    this.barrels.position.set(0, -0.15, 1.35);
    this.cradle.add(this.barrels);
    const hub = new THREE.Mesh(g.barrelHub, m.barrel);
    hub.rotation.x = Math.PI / 2;
    this.barrels.add(hub);
    for (let i = 0; i < 6; i++) {
      const b = new THREE.Mesh(g.barrel, m.barrel);
      const a = (i / 6) * Math.PI * 2;
      b.position.set(Math.cos(a) * 0.34, Math.sin(a) * 0.34, 1.5);
      b.rotation.x = Math.PI / 2;
      this.barrels.add(b);
    }
    this.muzzleLocal = new THREE.Object3D();
    this.muzzleLocal.position.set(0, 0, 3.2);
    this.barrels.add(this.muzzleLocal);

    this.flashMat = new THREE.SpriteMaterial({
      map: getSharedDotTexture(),
      color: new THREE.Color(0xffe7a8).multiplyScalar(3.4),
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0,
    });
    this.flash = new THREE.Sprite(this.flashMat);
    this.flash.scale.setScalar(3.2);
    this.flash.position.set(0, 0, 3.4);
    this.barrels.add(this.flash);

    scene.add(this.group);
  }

  /** Place the mount on its ship for this frame (world transform copy, no reparenting). */
  syncToShip(ship) {
    ship.group.updateMatrixWorld();
    this.group.position.copy(this.localPos).applyMatrix4(ship.group.matrixWorld);
    this.group.quaternion.copy(ship.group.quaternion);
  }

  /** Rate-limited slew toward a world-space aimpoint. Returns true when laid on. */
  aimAt(worldPos, dt) {
    // Convert the aimpoint into the mount's (ship-aligned) frame.
    _v.copy(worldPos).sub(this.group.position);
    _q.copy(this.group.quaternion).invert();
    _v.applyQuaternion(_q);
    const wantYaw = Math.atan2(_v.x, _v.z);
    const wantPitch = THREE.MathUtils.clamp(Math.atan2(_v.y, Math.hypot(_v.x, _v.z)), ELEV_MIN, ELEV_MAX);
    return this._slewTo(wantYaw, wantPitch, dt);
  }

  stow(dt) {
    return this._slewTo(0, 0.18, dt * 0.4);
  }

  _slewTo(wantYaw, wantPitch, dt) {
    let dy = wantYaw - this.yaw;
    while (dy > Math.PI) dy -= Math.PI * 2;
    while (dy < -Math.PI) dy += Math.PI * 2;
    const maxY = SLEW_RATE * dt;
    const stepY = THREE.MathUtils.clamp(dy, -maxY, maxY);
    this.yaw += stepY;
    const dp = wantPitch - this.pitch;
    const maxP = ELEV_RATE * dt;
    this.pitch += THREE.MathUtils.clamp(dp, -maxP, maxP);
    this.turret.rotation.y = this.yaw;
    this.cradle.rotation.x = -this.pitch;
    return Math.abs(dy) < 0.09 && Math.abs(dp) < 0.09;
  }

  muzzleWorld(out = new THREE.Vector3()) {
    this.group.updateMatrixWorld(true);
    return this.muzzleLocal.getWorldPosition(out);
  }

  /** Direction the barrels are actually pointing (world space). */
  boreDirection(out = new THREE.Vector3()) {
    this.group.updateMatrixWorld(true);
    this.barrels.getWorldPosition(_v2);
    this.muzzleLocal.getWorldPosition(out);
    return out.sub(_v2).normalize();
  }

  onFire(now) {
    this.lastFire = now;
    this.spinRate = 46;               // rad/s barrel rotation while firing
    this.flashMat.opacity = 1;
    this.flash.scale.setScalar(2.6 + Math.random() * 1.6);
  }

  update(dt, now) {
    const firing = now - this.lastFire < 0.16;
    this.spinRate = THREE.MathUtils.lerp(this.spinRate, firing ? 46 : 0, Math.min(1, dt * (firing ? 12 : 1.6)));
    this.spin += this.spinRate * dt;
    this.barrels.rotation.z = this.spin;
    this.flashMat.opacity = Math.max(0, this.flashMat.opacity - dt * 14);
  }

  dispose() {
    this.scene.remove(this.group);
    this.flashMat.dispose();
  }
}

/**
 * Owns one CiwsMount per ship mount point and keeps them tracking. Mounts are created
 * lazily the first time a ship is seen and torn down when it leaves play.
 */
export class CiwsMountManager {
  constructor(scene) {
    this.scene = scene;
    this.byShip = new Map();
  }

  mountsFor(ship) {
    let list = this.byShip.get(ship);
    if (!list) {
      const pts = ship.mountPoints?.ciws?.length
        ? ship.mountPoints.ciws
        : [new THREE.Vector3(0, 14, 0)];
      list = pts.map((p) => new CiwsMount(this.scene, p));
      this.byShip.set(ship, list);
    }
    return list;
  }

  /** The mount with the best line on `worldPos` (closest, and preferring the one
   * already trained near the correct bearing). */
  best(ship, worldPos) {
    const list = this.mountsFor(ship);
    let best = null;
    let bestScore = Infinity;
    for (const m of list) {
      const d = m.group.position.distanceTo(worldPos);
      if (d < bestScore) { bestScore = d; best = m; }
    }
    return best;
  }

  /** Per-frame: keep every mount stuck to its ship and trained on the nearest threat. */
  update(dt, now, ships, threats, trackRange = 2600) {
    const alive = new Set();
    for (const ship of ships) {
      if (!ship?.alive || !ship.group) continue;
      alive.add(ship);
      const list = this.mountsFor(ship);
      let nearest = null;
      let nd = trackRange;
      for (const t of threats) {
        const d = t.position.distanceTo(ship.group.position);
        if (d < nd) { nd = d; nearest = t; }
      }
      for (const m of list) {
        m.syncToShip(ship);
        if (nearest) m.aimAt(nearest.position, dt);
        else m.stow(dt);
        m.update(dt, now);
      }
    }
    for (const [ship, list] of this.byShip) {
      if (alive.has(ship)) continue;
      if (ship?.alive) continue;   // still in play, just not passed this frame
      for (const m of list) m.dispose();
      this.byShip.delete(ship);
    }
  }

  dispose() {
    for (const list of this.byShip.values()) for (const m of list) m.dispose();
    this.byShip.clear();
  }
}

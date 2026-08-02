import * as THREE from 'three';
import { DamageState, inferShipClass, getMunitionSpec } from '../systems/DamageModel.js';

let _nextId = 1;
/** Shared with CrewedShip so escort/player ship ids never collide with entity ids —
 * both live in the same id-keyed lookups (radar contact selection, weapon targeting). */
export function allocEntityId() {
  return _nextId++;
}

export const Domain = { SURFACE: 'SURFACE', SUBSURFACE: 'SUBSURFACE', AIR: 'AIR' };
export const IFF = { FRIENDLY: 'FRIENDLY', HOSTILE: 'HOSTILE', UNKNOWN: 'UNKNOWN', NEUTRAL: 'NEUTRAL' };

/**
 * Base class for anything that can appear on radar / take damage / be destroyed:
 * enemy ships, submarines, aircraft, and (via a thin wrapper) the player ship.
 */
export class Entity {
  /**
   * `maxHealth` is now only a legacy hint — real survivability comes from the
   * ship-class spec in DamageModel (displacement, subdivision, damage-control
   * quality). Subclasses that know what they are pass `shipClass`; everything
   * else is inferred from domain/iff/name so entity files this change doesn't
   * own (Submarine/Aircraft/MerchantShip) still get a correct profile.
   */
  constructor({ name, domain, iff, maxHealth = 100, position = new THREE.Vector3(), shipClass = null, reportable = true }) {
    this.id = allocEntityId();
    /** Immutable identity; `name` gets a live damage tag appended (see DamageState). */
    this.baseName = name;
    this.name = name;
    this.domain = domain;
    this.iff = iff;
    this.damage = new DamageState(this, {
      shipClass: shipClass || inferShipClass({ domain, iff, name, maxHealth }),
      reportable,
    });
    this.position = position.clone();
    this.heading = 0;
    this.speed = 0;
    this.alive = true;
    this.destroyed = false;
    this.group = new THREE.Group();
    this.group.name = name;
    /** true while within player's active detection means (radar/sonar/visual) */
    this.detected = false;
  }

  get forward() {
    return new THREE.Vector3(-Math.sin(this.heading), 0, -Math.cos(this.heading));
  }

  /**
   * World-space aim / collision point. Aircraft keep altitude in a separate field and
   * submarines use depth — homing and hit tests must use this, not bare `position`
   * (which often sits at y≈0).
   */
  getAimPoint(out = new THREE.Vector3()) {
    if (this.group?.position) {
      out.copy(this.group.position);
      return out;
    }
    out.copy(this.position);
    if (typeof this.altitude === 'number') out.y = this.altitude;
    else if (typeof this.depth === 'number') out.y = this.depth;
    return out;
  }

  /** Approximate collision radius for ordnance (metres). */
  get hitRadius() {
    if (this.domain === 'AIR') return 14;
    if (this.domain === 'SUBSURFACE') return 22;
    const len = this.length || this.physics?.length || 110;
    return Math.max(28, len * 0.22);
  }

  // `health` / `maxHealth` stay as the public surface (radar contact readouts,
  // HUD hull %, multiplayer replication, the game-over check) but are now views
  // onto the damage model's structural integrity rather than a standalone number.
  get maxHealth() { return this.damage.capacity; }
  set maxHealth(v) { if (Number.isFinite(v) && v > 0) this.damage.capacity = v; }
  get health() { return this.damage.structure; }
  set health(v) {
    if (!Number.isFinite(v)) return;
    if (v >= this.damage.capacity) this.repairAll();
    else this.damage.structure = Math.max(0, v);
  }

  /** Full restore — used by "New Patrol" / respawn paths that reset health. */
  repairAll() {
    const d = this.damage;
    d.structure = d.capacity;
    d.fire = 0; d.flooding = 0; d.floodRate = 0; d.list = 0;
    d.missionKill = false; d.catastrophic = false; d.lost = false;
    d.hitCount = 0; d.lastHit = null; d._fireReported = false; d._floodReported = false;
    for (const k in d.systems) d.systems[k] = 1;
    d._updateStatusTag();
    this.alive = true;
    this.destroyed = false;
  }

  /**
   * @param {number} amount  legacy raw structural points (only used when no
   *                         munition descriptor is supplied)
   * @param {object} [info]  { munition, impactWorld, warheadKg, kind, label }
   *                         — the real path, used by WeaponsSystem.
   */
  takeDamage(amount, info = null) {
    if (!this.alive) return null;
    let result;
    if (info && (info.munition || info.warheadKg != null)) {
      const spec = info.munition ? getMunitionSpec(info.munition) : info;
      result = this.damage.applyHit({
        warheadKg: info.warheadKg ?? spec.warheadKg,
        frag: info.frag ?? spec.frag ?? 1,
        kind: info.kind ?? spec.kind,
        label: info.label ?? spec.label,
        impactWorld: info.impactWorld || null,
      });
    } else {
      // Legacy/scripted damage: still routed through the model so fires,
      // flooding and subsystem loss behave the same way.
      result = this.damage.applyHit({
        warheadKg: Math.max(1, amount * 3),
        kind: 'generic',
        label: info?.label || 'ordnance',
        impactWorld: info?.impactWorld || null,
      });
    }
    if (this.damage.lost && this.alive) {
      this.alive = false;
      this.onDestroyed?.();
    }
    return result;
  }

  /** Per-frame damage progression hook — subclasses call this from update(). */
  updateDamage(dt) {
    if (this.damage.lost && this.alive) {
      this.alive = false;
      this.onDestroyed?.();
    }
  }

  distanceTo(vec3) {
    return this.position.distanceTo(vec3);
  }

  dispose(scene) {
    this.damage.dispose();
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

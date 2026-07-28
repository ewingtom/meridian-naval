import * as THREE from 'three';

let _nextId = 1;

export const Domain = { SURFACE: 'SURFACE', SUBSURFACE: 'SUBSURFACE', AIR: 'AIR' };
export const IFF = { FRIENDLY: 'FRIENDLY', HOSTILE: 'HOSTILE', UNKNOWN: 'UNKNOWN', NEUTRAL: 'NEUTRAL' };

/**
 * Base class for anything that can appear on radar / take damage / be destroyed:
 * enemy ships, submarines, aircraft, and (via a thin wrapper) the player ship.
 */
export class Entity {
  constructor({ name, domain, iff, maxHealth = 100, position = new THREE.Vector3() }) {
    this.id = _nextId++;
    this.name = name;
    this.domain = domain;
    this.iff = iff;
    this.maxHealth = maxHealth;
    this.health = maxHealth;
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

  takeDamage(amount) {
    if (!this.alive) return;
    this.health = Math.max(0, this.health - amount);
    if (this.health <= 0) {
      this.alive = false;
      this.onDestroyed?.();
    }
  }

  distanceTo(vec3) {
    return this.position.distanceTo(vec3);
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

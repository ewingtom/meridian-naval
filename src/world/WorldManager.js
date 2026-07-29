import * as THREE from 'three';
import { EnemyShip } from '../entities/EnemyShip.js';
import { Submarine } from '../entities/Submarine.js';
import { Aircraft } from '../entities/Aircraft.js';
import { MerchantShip } from '../entities/MerchantShip.js';
import { buildEnemyShipMesh } from '../entities/geometryKits.js';

export class WorldManager {
  constructor(scene, weapons) {
    this.scene = scene;
    this.weapons = weapons;
    this.entities = [];
  }

  spawnWave(name, aroundPos) {
    if (name === 'wave1') {
      const p = aroundPos.clone().add(new THREE.Vector3(400, 0, 200));
      this.entities.push(new EnemyShip({
        name: 'Master 1 (FFG)',
        position: p,
        patrolPoints: [p.clone(), p.clone().add(new THREE.Vector3(600, 0, -300))],
        scene: this.scene,
      }));
    } else if (name === 'sub1') {
      const p = aroundPos.clone().add(new THREE.Vector3(-300, 0, 500));
      this.entities.push(new Submarine({ name: 'Sonar Contact Sierra-1', position: p, scene: this.scene }));
    } else if (name === 'airWave') {
      for (let i = 0; i < 2; i++) {
        const p = aroundPos.clone().add(new THREE.Vector3(-1500 + i * 200, 0, -1800 - i * 150));
        this.entities.push(new Aircraft({ name: `Bandit ${i + 1}`, position: p, scene: this.scene }));
      }
    }
  }

  /** Neutral civilian traffic — a merchant/tanker transiting a long lane across the
   * patrol area, visible on radar (amber "unknown" blip, since it's not a military
   * IFF) and by eye, but unarmed and never engaging. Gives the ocean a sense of a
   * living, working sea rather than only player + military units. */
  spawnMerchantTraffic(aroundPos) {
    const a = aroundPos.clone().add(new THREE.Vector3(-2800, 0, -1200));
    const b = aroundPos.clone().add(new THREE.Vector3(2600, 0, 2400));
    this.entities.push(new MerchantShip({ name: 'MV Kestrel Bay', position: a.clone(), waypoints: [a, b], scene: this.scene }));
  }

  /** Distant task-force silhouettes on the horizon — purely decorative dressing (not
   * Entities: no radar contact, no physics/update cost) that sells the premise that
   * MERIDIAN is one hull within a much larger task force, not sailing alone. Spawned
   * once ever (guarded) since a "New Patrol" after a game-over restart would otherwise
   * pile up duplicate copies on top of each other. */
  spawnHorizonTaskForce(aroundPos) {
    if (this._horizonSpawned) return;
    this._horizonSpawned = true;
    const center = aroundPos.clone().add(new THREE.Vector3(-6400, 0, 5400));
    const offsets = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(340, 0, -220), new THREE.Vector3(-260, 0, 260)];
    for (const off of offsets) {
      const { group } = buildEnemyShipMesh();
      group.position.copy(center).add(off);
      group.rotation.y = Math.PI * 0.15;
      // far enough out that shadows are wasted render cost for zero visible benefit
      group.traverse((o) => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; } });
      this.scene.add(group);
    }
  }

  update(dt, ctx) {
    for (const e of this.entities) {
      if (e.destroyed) continue;
      e.update(dt, ctx);
    }
    const removed = this.entities.filter((e) => e.destroyed);
    for (const e of removed) e.dispose(this.scene);
    this.entities = this.entities.filter((e) => !e.destroyed);
  }

  aliveOfType(ClassOrDomain) {
    return this.entities.filter((e) => e.alive && !e.destroyed && (typeof ClassOrDomain === 'string' ? e.domain === ClassOrDomain : e instanceof ClassOrDomain));
  }

  get hostiles() {
    return this.entities.filter((e) => e.iff === 'HOSTILE' && !e.destroyed);
  }
}

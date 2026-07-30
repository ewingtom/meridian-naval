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
    } else if (name === 'sub1' || name === 'sub_roamer') {
      const off = name === 'sub_roamer'
        ? new THREE.Vector3((Math.random() - 0.5) * 900, 0, 350 + Math.random() * 700)
        : new THREE.Vector3(-300, 0, 500);
      const p = aroundPos.clone().add(off);
      this.entities.push(new Submarine({
        name: `Sierra-${1 + Math.floor(Math.random() * 9)}`,
        position: p,
        scene: this.scene,
      }));
    } else if (name === 'airWave' || name === 'air_probe') {
      const n = name === 'air_probe' ? 2 : 2;
      for (let i = 0; i < n; i++) {
        const p = aroundPos.clone().add(new THREE.Vector3(-1500 + i * 220 + Math.random() * 100, 0, -1600 - i * 160));
        this.entities.push(new Aircraft({ name: `Bandit ${String.fromCharCode(65 + i)}`, position: p, scene: this.scene }));
      }
    } else if (name === 'patrol_pair' || name === 'fleet_probe') {
      for (let i = 0; i < 2; i++) {
        const p = aroundPos.clone().add(new THREE.Vector3(280 + i * 180 + Math.random() * 120, 0, 160 + i * 90));
        this.entities.push(new EnemyShip({
          name: `Master ${2 + this.entities.length} (DDG)`,
          position: p,
          patrolPoints: [p.clone(), p.clone().add(new THREE.Vector3(500, 0, -280 + i * 40))],
          scene: this.scene,
        }));
      }
    }
  }

  /** Distant friendly screen units — radar-visible friendlies that aren't boardable
   * crewed ships, so the plot reads as a real task force beyond Meridian + 2 escorts. */
  spawnFriendlyScreen(aroundPos) {
    if (this._friendlyScreenSpawned) return;
    this._friendlyScreenSpawned = true;
    const offsets = [
      new THREE.Vector3(-900, 0, 700),
      new THREE.Vector3(1100, 0, 500),
    ];
    offsets.forEach((off, i) => {
      const p = aroundPos.clone().add(off);
      const ship = new EnemyShip({
        name: i === 0 ? 'FS Watchfire (FF)' : 'FS Auriga (FF)',
        position: p,
        patrolPoints: [p.clone(), p.clone().add(new THREE.Vector3(200, 0, -150))],
        scene: this.scene,
      });
      ship.iff = 'FRIENDLY';
      this.entities.push(ship);
    });
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

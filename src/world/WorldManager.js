import * as THREE from 'three';
import { EnemyShip } from '../entities/EnemyShip.js';
import { Submarine } from '../entities/Submarine.js';
import { Aircraft } from '../entities/Aircraft.js';
import { FriendlyShip } from '../entities/FriendlyShip.js';

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

  /** Escorts holding station relative to the player so the ocean never feels empty. */
  spawnTaskForce(aroundPos) {
    const stations = [
      { name: 'FS Sentinel (DDG)', offset: new THREE.Vector3(-420, 0, -60) },
      { name: 'FS Vanguard (CG)', offset: new THREE.Vector3(360, 0, -180) },
    ];
    for (const s of stations) {
      const worldPos = s.offset.clone().add(aroundPos);
      this.entities.push(new FriendlyShip({ name: s.name, position: worldPos, stationOffset: s.offset, scene: this.scene }));
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

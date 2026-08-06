import * as THREE from 'three';
import { EnemyShip } from '../entities/EnemyShip.js';
import { Submarine } from '../entities/Submarine.js';
import { Aircraft } from '../entities/Aircraft.js';
import { MerchantShip } from '../entities/MerchantShip.js';
import { buildEnemyShipMesh } from '../entities/geometryKits.js';
import { IFF } from '../entities/Entity.js';

/** Civilian hull-name roster so repeat merchant top-ups read as different vessels. */
const MERCHANT_NAMES = [
  'MV Kestrel Bay', 'MV Andaman Trader', 'MT Corsica Star', 'MV Harbin Maru',
  'MV Ostend Pioneer', 'MT Sable Reach', 'MV Cape Ferrol', 'MV Ninety Fathom',
  'FV Marisol', 'FV Northern Gannet', 'MV Aleutian Dawn', 'MT Kithira Spirit',
];

export class WorldManager {
  constructor(scene, weapons) {
    this.scene = scene;
    this.weapons = weapons;
    this.entities = [];
  }

  spawnWave(name, aroundPos) {
    if (name === 'wave1') {
      // Surface action group: lead DDG + wing FFG, shared patrol axis.
      const base = aroundPos.clone().add(new THREE.Vector3(420, 0, 240));
      const lead = new EnemyShip({
        name: 'Master 1 (DDG)',
        position: base,
        patrolPoints: [base.clone(), base.clone().add(new THREE.Vector3(700, 0, -280))],
        scene: this.scene,
        shipClass: 'destroyer',
      });
      const wing = new EnemyShip({
        name: 'Master 2 (FFG)',
        position: base.clone().add(new THREE.Vector3(180, 0, -120)),
        patrolPoints: [base.clone().add(new THREE.Vector3(180, 0, -120)), base.clone().add(new THREE.Vector3(780, 0, -360))],
        scene: this.scene,
      });
      this.entities.push(lead, wing);
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
      const n = name === 'air_probe' ? 2 : 3;
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
          shipClass: 'destroyer',
        }));
      }
    } else if (name === 'combined_strike') {
      // Coordinated package: surface pair + air raid on staggered axes.
      this.spawnWave('fleet_probe', aroundPos);
      this.spawnWave('air_probe', aroundPos.clone().add(new THREE.Vector3(-400, 0, -200)));
    } else if (name === 'asw_alert') {
      this.spawnWave('sub_roamer', aroundPos);
      // Decoy surface contact so ASW isn't the only plot noise.
      if (Math.random() < 0.45) this.spawnWave('patrol_pair', aroundPos.clone().add(new THREE.Vector3(600, 0, 200)));
    } else if (name === 'ambiguous_inbound') {
      // The one scenario in this game explicitly grounded in a documented real
      // failure mode (see the research brief this was built from: a 1988
      // shootdown of a civilian airliner that was misclassified as an attacking
      // military aircraft under time pressure, with a friendly-coded IFF and a
      // normal flight profile the classification never checked). This is NOT a
      // reenactment — it's an original contact built in the same shape: reads
      // superficially threatening (closing bearing, unresolved IFF) but its
      // actual behavior and ground-truth IFF do not support a hostile call, and
      // it appears alongside a genuinely hostile contact so identifying it
      // correctly costs split attention, not a free pause. See TaoDebrief.js for
      // how the outcome gets scored, and Aircraft's `benign` flag for why this
      // contact can never itself behave like a threat regardless of how it reads.
      const ambigPos = aroundPos.clone().add(new THREE.Vector3(-2600 + Math.random() * 400, 0, -1800 - Math.random() * 400));
      // Aim near, not at, own-ship — a transit corridor that happens to pass
      // close to the task force, not a beeline attack run.
      const aimPoint = aroundPos.clone().add(new THREE.Vector3(700 + Math.random() * 500, 0, 0));
      const toAim = aimPoint.clone().sub(ambigPos);
      const ambig = new Aircraft({
        name: 'Track 4192 (UNVERIFIED)',
        position: ambigPos,
        scene: this.scene,
        iff: IFF.NEUTRAL,
        benign: true,
      });
      ambig.heading = Math.atan2(-toAim.x, -toAim.z);
      ambig.scenarioTag = 'ambiguous_inbound';
      this.entities.push(ambig);

      // Concurrent, genuinely hostile threat on a different bearing — the point
      // of the scenario is split attention under real time pressure, not a quiz
      // question with the rest of the fight paused.
      const bandit = new Aircraft({
        name: 'Bandit Zulu',
        position: aroundPos.clone().add(new THREE.Vector3(2200 + Math.random() * 400, 0, -1200 - Math.random() * 400)),
        scene: this.scene,
      });
      bandit.scenarioTag = 'ambiguous_inbound_pressure';
      this.entities.push(bandit);
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
  spawnMerchantTraffic(aroundPos, opts = {}) {
    // A working sea has more than one hull on it, and they don't all run the same lane.
    // Randomising the name and the transit axis means repeat top-ups from DynamicOps
    // read as different vessels going different places instead of clones of MV Kestrel
    // Bay stacked on one another.
    const name = opts.name || MERCHANT_NAMES[Math.floor(Math.random() * MERCHANT_NAMES.length)];
    const ang = opts.laneAngle != null ? opts.laneAngle : Math.random() * Math.PI * 2;
    const halfLane = 2400 + Math.random() * 1400;
    const off = new THREE.Vector3(Math.cos(ang), 0, Math.sin(ang)).multiplyScalar(halfLane);
    // Push the lane off the player's own position so traffic crosses the area rather
    // than steaming straight down the ship's throat.
    const cross = new THREE.Vector3(-off.z, 0, off.x).normalize()
      .multiplyScalar((Math.random() - 0.5) * 2600);
    const a = aroundPos.clone().add(off).add(cross);
    const b = aroundPos.clone().sub(off).add(cross);
    const ship = new MerchantShip({ name, position: a.clone(), waypoints: [a, b], scene: this.scene });
    this.entities.push(ship);
    return ship;
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

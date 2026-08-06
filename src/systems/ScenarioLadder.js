import * as THREE from 'three';
import { Aircraft } from '../entities/Aircraft.js';
import { EnemyShip } from '../entities/EnemyShip.js';
import { Submarine } from '../entities/Submarine.js';
import { MerchantShip } from '../entities/MerchantShip.js';
import { IFF } from '../entities/Entity.js';

/**
 * ScenarioLadder — the graded drills that follow the TAO schoolhouse
 * (systems/TaoTraining.js). Each rung stress-tests one specific competency the
 * tutorial only introduced, and each is scored against criteria that are
 * checked against live world state rather than scripted triggers, so there is
 * no way to "pass" one by going through the motions.
 *
 * Difficulty escalates along three independent axes rather than just "more
 * enemies": how much of the picture starts UNRESOLVED (identification load),
 * how many distinct bearings demand attention at once (prioritisation load),
 * and how compressed the timeline is (decision load). A drill that only turned
 * up the contact count would test the point-defence model, not the operator.
 *
 * Every drill carries a `neutralsHarmed` fail criterion. That is deliberate and
 * it is the spine of the whole ladder: the fastest way to clear any of these
 * boards is to shoot everything, and the scoring has to make that the losing
 * play at every tier, not just in the one scenario explicitly about it.
 */

const NM_M = 1852;

/** Spawn helpers — kept local rather than added to WorldManager.spawnWave()
 *  because these need per-contact control (identification seeding, benign
 *  profiles, precise bearings) that the campaign's name-keyed waves don't. */
function spawnHostileAir(ctx, offset, name, opts = {}) {
  const p = ctx.ships.player.group.position;
  const pos = p.clone().add(offset);
  const air = new Aircraft({ name, position: pos, scene: ctx.scene, ...opts });
  const toAim = p.clone().sub(pos);
  air.heading = Math.atan2(-toAim.x, -toAim.z);
  air.drillTag = true;
  ctx.world.entities.push(air);
  return air;
}

function spawnHostileSurface(ctx, offset, name) {
  const p = ctx.ships.player.group.position;
  const pos = p.clone().add(offset);
  const ship = new EnemyShip({
    name,
    position: pos,
    patrolPoints: [pos.clone(), pos.clone().add(new THREE.Vector3(700, 0, -400))],
    scene: ctx.scene,
    shipClass: 'destroyer',
  });
  ship.drillTag = true;
  ctx.world.entities.push(ship);
  return ship;
}

function spawnSub(ctx, offset, name) {
  const p = ctx.ships.player.group.position;
  const sub = new Submarine({ name, position: p.clone().add(offset), scene: ctx.scene });
  sub.drillTag = true;
  ctx.world.entities.push(sub);
  return sub;
}

function spawnNeutralTraffic(ctx, offset, name) {
  const p = ctx.ships.player.group.position;
  const a = p.clone().add(offset);
  const b = p.clone().add(offset.clone().multiplyScalar(-1.4));
  const m = new MerchantShip({ name, position: a.clone(), waypoints: [a, b], scene: ctx.scene });
  m.drillTag = true;
  ctx.world.entities.push(m);
  return m;
}

/** Neutral air track that reads as a closing contact but never acts hostile —
 *  the identification-discipline pressure in the upper tiers. */
function spawnNeutralAir(ctx, offset, name) {
  const air = spawnHostileAir(ctx, offset, name, { iff: IFF.NEUTRAL, benign: true });
  air.speedMs = 55;
  return air;
}

export const SCENARIOS = [
  {
    id: 'sector_sweep',
    tier: 1,
    name: 'SECTOR SWEEP',
    tests: 'Identification discipline, designation',
    brief: 'Two surface contacts in sector, plus civilian traffic on the lane. Identify everything before you commit. Nothing here is in a hurry.',
    durationS: 210,
    setup: (ctx) => {
      spawnHostileSurface(ctx, new THREE.Vector3(3400, 0, 2600), 'Master 11 (FFG)');
      spawnHostileSurface(ctx, new THREE.Vector3(-2900, 0, 3300), 'Master 12 (FFG)');
      spawnNeutralTraffic(ctx, new THREE.Vector3(-3800, 0, -1500), 'MV Coral Trader');
    },
  },
  {
    id: 'asw_prosecution',
    tier: 2,
    name: 'SUBSURFACE PROSECUTION',
    tests: 'Cross-station coordination, active sonar tasking',
    brief: 'Submerged contact in the operating area. A submarine is invisible to radar — you will not find it from this console alone. Task an escort to go active (N) and work the SONAR station picture.',
    durationS: 240,
    setup: (ctx) => {
      spawnSub(ctx, new THREE.Vector3(-1800, 0, 2400), 'Sierra-4');
      spawnNeutralTraffic(ctx, new THREE.Vector3(3600, 0, -2200), 'MV Harbour Light');
    },
    requiresPing: true,
  },
  {
    id: 'split_axis',
    tier: 3,
    name: 'SPLIT AXIS RAID',
    tests: 'Threat prioritisation under simultaneous pressure',
    brief: 'Coordinated attack on two bearings — air from the north-west, surface from the south-east. Both are genuine. You cannot service them in the same order and get the same result.',
    durationS: 200,
    setup: (ctx) => {
      spawnHostileAir(ctx, new THREE.Vector3(-3600, 0, -3200), 'Bandit Kilo');
      spawnHostileAir(ctx, new THREE.Vector3(-4100, 0, -2700), 'Bandit Lima');
      spawnHostileSurface(ctx, new THREE.Vector3(3200, 0, 3100), 'Master 15 (DDG)');
    },
  },
  {
    id: 'crowded_littoral',
    tier: 4,
    name: 'CROWDED LITTORAL',
    tests: 'Identification under clutter — the hardest habit to keep',
    brief: 'Congested coastal water. Six tracks, all unresolved, most of them civilian. One is not. Every interrogation costs time you do not obviously have. Shooting the picture clean is a failure, not a solution.',
    durationS: 260,
    setup: (ctx) => {
      spawnNeutralAir(ctx, new THREE.Vector3(-3100, 0, -2900), 'Track 2201');
      spawnNeutralAir(ctx, new THREE.Vector3(-2400, 0, -3400), 'Track 2202');
      spawnNeutralAir(ctx, new THREE.Vector3(-3600, 0, -2100), 'Track 2203');
      spawnHostileAir(ctx, new THREE.Vector3(-2800, 0, -3100), 'Track 2204');
      spawnNeutralTraffic(ctx, new THREE.Vector3(2600, 0, -1800), 'MV Aster Bay');
      spawnNeutralTraffic(ctx, new THREE.Vector3(3300, 0, 900), 'MV Ninefold');
    },
  },
  {
    id: 'saturation',
    tier: 5,
    name: 'SATURATION DEFENCE',
    tests: 'Weapons-control posture under a raid that will get through',
    brief: 'Massed anti-ship raid inbound. Point defence is probabilistic and it saturates — some of this is going to hit. Set the posture that lets the force fight, and accept damage rather than losing the ship.',
    durationS: 180,
    setup: (ctx) => {
      for (let i = 0; i < 5; i++) {
        spawnHostileAir(
          ctx,
          new THREE.Vector3(-3800 + i * 500, 0, -3400 - i * 260),
          `Vampire ${String.fromCharCode(65 + i)}`,
        );
      }
      spawnHostileSurface(ctx, new THREE.Vector3(4200, 0, 2400), 'Master 21 (DDG)');
    },
  },
];

/** Live scoring for one drill attempt. Like ScenarioRun in TaoDebrief.js, this
 *  observes world state rather than trusting scripted callbacks — the score has
 *  to reflect what actually happened in the sim. */
export class DrillRun {
  constructor(scenario) {
    this.scenario = scenario;
    this.startedAt = performance.now() / 1000;
    this.active = true;
    this.facts = {
      neutralsHarmed: 0,
      hostilesRemaining: null,
      hostilesCleared: 0,
      totalHostiles: 0,
      engagedUnresolved: 0,
      pingUsed: false,
      shipLost: false,
      hullPctEnd: 100,
      timedOut: false,
    };
    this._seenNeutral = new Set();
    this._seenHostile = new Set();
  }

  get elapsed() {
    return performance.now() / 1000 - this.startedAt;
  }

  /** Polled each frame while the drill runs. */
  observe(ctx) {
    if (!this.active) return;
    const drill = (ctx.world.entities || []).filter((e) => e.drillTag);
    for (const e of drill) {
      const key = String(e.id);
      if (e.iff === IFF.HOSTILE) this._seenHostile.add(key);
      else this._seenNeutral.add(key);
    }
    this.facts.totalHostiles = this._seenHostile.size;

    // A drill contact that is gone AND was not merely off-map is a kill. Neutral
    // kills are the fail spine of the ladder, so they're counted separately and
    // never forgiven by a good result elsewhere.
    const liveIds = new Set(drill.filter((e) => e.alive && !e.destroyed).map((e) => String(e.id)));
    let neutralsHarmed = 0;
    for (const id of this._seenNeutral) if (!liveIds.has(id)) neutralsHarmed += 1;
    let hostilesCleared = 0;
    for (const id of this._seenHostile) if (!liveIds.has(id)) hostilesCleared += 1;
    this.facts.neutralsHarmed = neutralsHarmed;
    this.facts.hostilesCleared = hostilesCleared;
    this.facts.hostilesRemaining = this._seenHostile.size - hostilesCleared;

    if (ctx.taskForce?.lastPingAt > this.startedAt) this.facts.pingUsed = true;

    const ship = ctx.ships?.player;
    if (ship) {
      this.facts.hullPctEnd = Math.max(0, (ship.health / ship.maxHealth) * 100);
      if (ship.alive === false || ship.health <= 0) this.facts.shipLost = true;
    }
  }

  /** True once the drill has resolved one way or the other. */
  isComplete(ctx) {
    if (!this.active) return true;
    if (this.facts.shipLost) return true;
    if (this.facts.totalHostiles > 0 && this.facts.hostilesRemaining === 0) return true;
    if (this.elapsed > this.scenario.durationS) {
      this.facts.timedOut = true;
      return true;
    }
    return false;
  }

  finish() {
    this.active = false;
    this.finishedAt = performance.now() / 1000;
  }

  /** Named-principle scoring, same shape TaoDebrief/DebriefPanel already render. */
  score() {
    const f = this.facts;
    const out = [];

    out.push({
      id: 'discrimination',
      name: 'Discrimination — No Harm to Non-Combatants',
      describe: 'Civilian and neutral traffic left unharmed.',
      result: f.neutralsHarmed === 0 ? 'pass' : 'fail',
      rationale: f.neutralsHarmed === 0
        ? 'No neutral or civilian contact was engaged. This is the criterion every other one is subordinate to.'
        : `${f.neutralsHarmed} neutral or civilian contact(s) were destroyed. No tactical result offsets this.`,
    });

    const clearedAll = f.totalHostiles > 0 && f.hostilesRemaining === 0;
    out.push({
      id: 'threat_resolution',
      name: 'Threat Resolution',
      describe: 'Genuine hostile contacts were neutralised or driven off.',
      result: clearedAll ? 'pass' : f.hostilesCleared > 0 ? 'partial' : 'fail',
      rationale: clearedAll
        ? `All ${f.totalHostiles} hostile contact(s) were cleared.`
        : `${f.hostilesCleared} of ${f.totalHostiles} hostile contact(s) cleared${f.timedOut ? ' before the drill window expired' : ''}.`,
    });

    out.push({
      id: 'survival',
      name: 'Ship and Force Survival',
      describe: 'MERIDIAN survived the engagement in fighting condition.',
      result: f.shipLost ? 'fail' : f.hullPctEnd >= 60 ? 'pass' : 'partial',
      rationale: f.shipLost
        ? 'MERIDIAN was lost.'
        : `Ended the engagement at ${Math.round(f.hullPctEnd)}% hull integrity.`,
    });

    if (this.scenario.requiresPing) {
      out.push({
        id: 'coordination',
        name: 'Cross-Station Coordination',
        describe: 'Tasked an escort to go active on sonar rather than working the problem alone.',
        result: f.pingUsed ? 'pass' : 'fail',
        rationale: f.pingUsed
          ? 'An escort active-sonar sweep was ordered — the submerged picture is a force problem, not a console problem.'
          : 'No escort sonar sweep was ordered. A submerged contact cannot be resolved from the AEGIS console alone.',
      });
    }

    return out;
  }
}

/** Drives one drill at a time and reports progress/outcome upward. */
export class ScenarioLadder {
  constructor({ onComms, onBrief, onComplete } = {}) {
    this.onComms = onComms || (() => {});
    this.onBrief = onBrief || (() => {});
    this.onComplete = onComplete || (() => {});
    this.run = null;
    this.cleared = new Set();
  }

  get active() {
    return !!this.run?.active;
  }

  /** Start a drill by id, or the next uncleared rung if omitted. */
  start(idOrNull, ctx) {
    const scenario = idOrNull
      ? SCENARIOS.find((s) => s.id === idOrNull)
      : SCENARIOS.find((s) => !this.cleared.has(s.id));
    if (!scenario) {
      this.onComms({ speaker: 'HORIZON ACTUAL', text: 'All graded drills complete. Nothing further on the board.', urgency: 'normal' });
      return null;
    }
    this.cleanup(ctx);
    this.run = new DrillRun(scenario);
    try {
      scenario.setup(ctx);
    } catch (err) {
      console.warn('[ScenarioLadder] setup failed for', scenario.id, err);
    }
    this.onBrief(scenario);
    this.onComms({
      speaker: 'HORIZON ACTUAL',
      text: `Drill ${scenario.tier} — ${scenario.name}. ${scenario.brief}`,
      urgency: 'warning',
    });
    return scenario;
  }

  update(dt, ctx) {
    if (!this.run?.active) return;
    this.run.observe(ctx);
    if (!this.run.isComplete(ctx)) return;

    this.run.finish();
    const scenario = this.run.scenario;
    const principles = this.run.score();
    const passed = principles.every((p) => p.result === 'pass');
    if (passed) this.cleared.add(scenario.id);
    this.onComms({
      speaker: 'HORIZON ACTUAL',
      text: passed
        ? `${scenario.name} — drill complete, all criteria met. Debrief is up (P).`
        : `${scenario.name} — drill complete with findings. Review the debrief (P).`,
      urgency: passed ? 'normal' : 'warning',
    });
    this.onBrief(null);
    this.onComplete({
      scenarioName: `${scenario.name} — DRILL DEBRIEF`,
      principles,
    }, scenario, passed);
  }

  /** Despawn every contact this ladder spawned. Called when starting a new
   *  drill or abandoning one, so a previous rung's leftovers can never bleed
   *  into the next attempt's scoring. */
  cleanup(ctx) {
    for (const e of ctx?.world?.entities || []) {
      if (e.drillTag) e.destroyed = true;
    }
    this.run = null;
  }
}

import * as THREE from 'three';

/**
 * Drives the campaign framing: task-force narrative beats, waypoints, and
 * escalating threat waves tied to progress. Pure state/logic — emits comms
 * lines and objective updates via callbacks for the UI layer to render.
 */
const BEATS = [
  {
    id: 'briefing',
    comms: [
      { speaker: 'TASK FORCE ACTUAL', text: 'MERIDIAN, this is HORIZON ACTUAL. Task Force 21 is proceeding to patrol station VIGIL. Take your station and get underway.', urgency: 'normal' },
    ],
    objective: { text: 'Get underway — take the helm and steer toward VIGIL (marked on tactical)', bearing: null, distanceM: null },
  },
  {
    id: 'transit',
    trigger: 'depart',
    comms: [
      { speaker: 'CIC', text: 'Course laid in for patrol station VIGIL — cyan diamond on your tactical plot. Helm: match course error to zero.', urgency: 'normal' },
    ],
    objective: { text: 'Proceed to patrol station VIGIL', useWaypoint: 0 },
  },
  {
    id: 'first_contact',
    trigger: 'nearWaypoint0',
    comms: [
      { speaker: 'CIC', text: 'New surface contact, bearing correlates with a hostile picket. Recommend weapons free once designated hostile.', urgency: 'warning' },
    ],
    objective: { text: 'Investigate and neutralize the hostile picket', useWaypoint: 0 },
    spawn: 'wave1',
  },
  {
    id: 'sub_threat',
    trigger: 'wave1Cleared',
    comms: [
      { speaker: 'SONAR', text: 'Conn, Sonar — transient contact, possible submerged hostile bearing two-two-zero. Recommend active sonar search.', urgency: 'warning' },
    ],
    objective: { text: 'Localize and prosecute the submerged contact — man Radar, ping SONAR (Q), then Weapons', useWaypoint: 0 },
    spawn: 'sub1',
  },
  {
    id: 'air_raid',
    trigger: 'subCleared',
    comms: [
      { speaker: 'CIC', text: 'Multiple inbound air contacts, angels two, closing fast. All hands, air defense stations.', urgency: 'critical' },
    ],
    objective: { text: 'Defend the task force — intercept inbound aircraft' },
    spawn: 'airWave',
  },
  {
    // Grounded in a real, documented failure mode — see WorldManager's
    // spawnWave('ambiguous_inbound') and TaoDebrief.js for the full framing.
    // This is NOT a hard-fail beat: main.js flags 'ambiguousResolved' whether
    // the player gets it right or wrong, so a wrong call costs a bad debrief,
    // not a stuck campaign. See main.js's scenario-resolution polling.
    id: 'ambiguous_contact',
    trigger: 'airWaveCleared',
    comms: [
      { speaker: 'CIC', text: 'New air contact, unresolved IFF, bearing correlates with a closing/descending profile. Second contact also inbound on a separate bearing — work both, but do not engage the unresolved track without a positive ID.', urgency: 'warning' },
    ],
    objective: { text: 'Two inbound air contacts — identify before you engage either one', useWaypoint: 0 },
    spawn: 'ambiguous_inbound',
  },
  {
    id: 'final',
    trigger: 'ambiguousResolved',
    comms: [
      { speaker: 'TASK FORCE ACTUAL', text: 'Well done, MERIDIAN. Station VIGIL is secure. Return to formation and stand by for further tasking.', urgency: 'normal' },
    ],
    objective: { text: 'Patrol station secure — return to task force formation', useWaypoint: 1 },
  },
];

export class MissionSystem {
  constructor({ onComms, onObjective } = {}) {
    this.onComms = onComms || (() => {});
    this.onObjective = onObjective || (() => {});
    this.started = false;
    this.beatIndex = 0;
    this.waypoints = [
      new THREE.Vector3(2600, 0, 4200),
      new THREE.Vector3(-200, 0, 300),
    ];
    this.flags = new Set();
    this._started = false;
  }

  start() {
    this._started = true;
    this.started = true;
    this._runBeat(0);
  }

  _runBeat(idx) {
    if (idx >= BEATS.length) return;
    this.beatIndex = idx;
    const beat = BEATS[idx];
    for (const line of beat.comms) this.onComms(line);
    if (beat.objective) {
      const o = { ...beat.objective };
      if (o.useWaypoint != null) o.waypoint = this.waypoints[o.useWaypoint];
      this.onObjective(o);
    }
    this._pendingSpawn = beat.spawn || null;
  }

  consumeSpawnRequest() {
    const s = this._pendingSpawn;
    this._pendingSpawn = null;
    return s;
  }

  flag(name) {
    if (this.flags.has(name)) return;
    this.flags.add(name);
    const next = BEATS.findIndex((b) => b.trigger === name);
    if (next >= 0 && next > this.beatIndex) this._runBeat(next);
  }

  /** Multiplayer: jump straight to a beat the host has already reached, replaying its
   * comms/objective locally (so every client's narrative/objective text stays in sync
   * even though each client still evaluates its own world independently). Never moves
   * backward — a client that locally advanced ahead of a stale/in-flight broadcast
   * just ignores it rather than snapping back. */
  syncBeat(idx) {
    if (idx <= this.beatIndex && this.started) return;
    this.started = true;
    this._started = true;
    this._runBeat(idx);
  }

  get currentWaypoint() {
    const beat = BEATS[this.beatIndex];
    if (beat?.objective?.useWaypoint != null) return this.waypoints[beat.objective.useWaypoint];
    return null;
  }
}

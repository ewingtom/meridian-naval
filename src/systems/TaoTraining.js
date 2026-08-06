import * as THREE from 'three';
import { Aircraft } from '../entities/Aircraft.js';
import { EnemyShip } from '../entities/EnemyShip.js';
import { IFF } from '../entities/Entity.js';

/**
 * TaoTraining — the guided "schoolhouse" patrol that walks a new TAO through
 * every basic console function before the campaign ever puts them under time
 * pressure. Deliberately slow: each step has a floor on how fast it can be
 * cleared (`minDwell`) so instructions are actually read rather than mashed
 * through, and the threats it spawns are chosen to be non-lethal on the
 * tutorial's timescale (a benign air track, then a hostile SURFACE contact
 * held at long range — never an inbound missile raid).
 *
 * Design note — this observes state rather than intercepting input. Every
 * `check()` below polls the same public game state the console itself renders
 * from (weapons policy, designated track, identification status, hooked
 * track). That means a step completes identically whether the player used the
 * keyboard shortcut or clicked the console, and the tutorial can never fall
 * out of sync with what the player actually sees — which is exactly the
 * failure mode a keypress-listener tutorial would have.
 *
 * The ordering mirrors the real TAO decision cycle the console is built around
 * (detect -> classify -> identify -> evaluate -> engage -> report), so the
 * tutorial teaches the doctrine sequence, not just the keybindings.
 */

const NM_M = 1852;

/** Step list. Each step: instruction text, an optional one-time `setup`, a
 *  `check` predicate polled every frame, and pacing controls. */
const STEPS = [
  {
    id: 'man_station',
    title: 'MAN THE TAO CONSOLE',
    body: 'Walk to the CIC and take the TAO seat. Press <kbd>E</kbd> at the station to sit down.',
    hint: 'The TAO station is in the Combat Information Center — look for the AEGIS console.',
    hintAfter: 18,
    minDwell: 0,
    comms: [{ speaker: 'HORIZON ACTUAL', text: 'MERIDIAN, this is a schoolhouse evolution. Take the TAO chair — we will walk your console top to bottom, no time pressure.', urgency: 'normal' }],
    check: (ctx) => ctx.playerController.state === 'TAO',
  },
  {
    id: 'read_picture',
    title: 'READ THE PICTURE',
    body: 'This is the AEGIS Display System. The plot is <b>own-ship centred and heading-up</b> — you are the triangle at the middle. Range rings are labelled in nautical miles. To the right, <b>THREAT EVALUATION</b> lists every track the force can see.',
    hint: 'Take a moment — the picture is the job. Track shapes carry affiliation: circle = friendly, diamond = hostile, square = neutral.',
    hintAfter: 10,
    minDwell: 12,
    comms: [{ speaker: 'CIC INSTRUCTOR', text: 'Your escorts are already on the plot as friendly circles. Note the picture is fused — those tracks come from the whole task force\'s sensors, not just our own radar.', urgency: 'normal' }],
    check: () => true,
  },
  {
    id: 'hook_friendly',
    title: 'HOOK A TRACK',
    body: 'Select — "hook" — a track. Click a symbol directly on the plot, or click its row in <b>THREAT EVALUATION</b>. Start with one of our own escorts.',
    hint: 'Any track will do. The hooked track fills the HOOKED TRACK — FIRE CONTROL panel at bottom right.',
    hintAfter: 14,
    minDwell: 3,
    check: (ctx) => ctx.stationOverlay.hookedTrackId != null,
  },
  {
    id: 'read_detail',
    title: 'READ THE FIRE-CONTROL BLOCK',
    body: 'Bottom right now shows the hooked track\'s <b>track number, name, identification, category, bearing/range,</b> and whether it is the designated track. The dashed amber ring on the plot is that track\'s <b>weapon engagement envelope</b>.',
    hint: 'Hover anywhere on the plot — the status bar under it reads out live bearing and range under your cursor. The mouse wheel zooms the range rings.',
    hintAfter: 10,
    minDwell: 10,
    check: () => true,
  },
  {
    id: 'unresolved_appears',
    title: 'NEW CONTACT — UNRESOLVED',
    body: 'A new air track has entered the picture. It is rendering as a <b>pulsing amber SUSPECT</b> — that means the system does <i>not</i> know what it is yet. <b>Hook it.</b>',
    hint: 'It is the pulsing amber track on the plot, or the row marked UNRESOLVED in Threat Evaluation.',
    hintAfter: 14,
    minDwell: 2,
    comms: [{ speaker: 'CIC INSTRUCTOR', text: 'Air contact, unresolved. Note what the console is NOT telling you — it will not guess an affiliation on your behalf. That is your call to make, and it is the whole reason this seat exists.', urgency: 'warning' }],
    setup: (ctx, state) => {
      const p = ctx.ships.player.group.position;
      // Inside the ~6000m radar horizon and closing slowly, on a heading aimed
      // at the task force. Both of those matter: an air contact spawned with
      // Aircraft's default heading transits straight out of sensor range in
      // well under a minute, which would strand the tutorial on a track the
      // player can no longer hook or interrogate.
      const spawn = p.clone().add(new THREE.Vector3(-2600, 0, -3000));
      const air = new Aircraft({
        name: 'Track 7104',
        position: spawn,
        scene: ctx.scene,
        iff: IFF.NEUTRAL,
        benign: true,
      });
      const toAim = p.clone().sub(spawn);
      air.heading = Math.atan2(-toAim.x, -toAim.z);
      air.speedMs = 45; // schoolhouse pace — ~90s of usable time on the plot
      air.trainingTag = 'unresolved';
      ctx.world.entities.push(air);
      state.unresolvedId = air.id;
    },
    check: (ctx, state) =>
      state.unresolvedId != null
      && String(ctx.stationOverlay.hookedTrackId) === String(state.unresolvedId),
  },
  {
    id: 'interrogate',
    title: 'INTERROGATE IFF',
    body: 'With the unresolved track hooked, press <kbd>I</kbd> to run an <b>IFF interrogation</b>. It takes a few seconds — identification is a deliberate act, not a reflex.',
    hint: 'Press I. Watch the ID field in the fire-control block count up while the interrogation runs.',
    hintAfter: 12,
    minDwell: 1,
    check: (ctx, state) => state.unresolvedId != null && ctx.idTracker.isResolved(state.unresolvedId),
  },
  {
    id: 'interrogate_result',
    title: 'THE ANSWER MATTERS',
    body: 'That track resolved <b>NEUTRAL</b> — a civilian transiting the area. It was closing, its bearing looked threatening, and it was <i>not</i> a threat. An unresolved track is not a hostile track; it is an unanswered question.',
    hint: 'This is the single most consequential habit in this seat: identify before you engage.',
    hintAfter: 8,
    minDwell: 12,
    comms: [{ speaker: 'CIC INSTRUCTOR', text: 'Read that back to yourself. Closing bearing, unknown IFF, and completely benign. Ambiguous cues alone are never sufficient — you check.', urgency: 'normal' }],
    check: () => true,
  },
  {
    id: 'hostile_appears',
    title: 'SURFACE CONTACT — HOSTILE',
    body: 'A surface contact has been detected at long range and identified <b>HOSTILE</b>. Hook it, then press <kbd>C</kbd> to <b>share/designate</b> it to the task force.',
    hint: 'Hook the red diamond, then press C. Designating pushes the track to your escorts so the whole force is working the same picture.',
    hintAfter: 16,
    minDwell: 2,
    comms: [{ speaker: 'CIC INSTRUCTOR', text: 'Surface contact, positively hostile, well outside weapons range. Designate it — in a real engagement the force fights off one shared picture, not five private ones.', urgency: 'warning' }],
    setup: (ctx, state) => {
      const p = ctx.ships.player.group.position;
      // ~4.3km — comfortably inside the radar horizon so it actually appears on
      // the plot, but well outside its own weapons envelope, so a schoolhouse
      // evolution never turns into a fight the student didn't ask for.
      const base = p.clone().add(new THREE.Vector3(3100, 0, 3000));
      const ship = new EnemyShip({
        name: 'Master 7 (DDG)',
        position: base,
        patrolPoints: [base.clone(), base.clone().add(new THREE.Vector3(600, 0, -400))],
        scene: ctx.scene,
        shipClass: 'destroyer',
      });
      ship.trainingTag = 'hostile';
      ctx.world.entities.push(ship);
      state.hostileId = ship.id;
      // Pre-resolve its identification: this step is teaching designation and
      // weapons posture, not repeating the ID lesson the player just finished.
      ctx.idTracker.resolve(ship.id, IFF.HOSTILE, 'training');
    },
    check: (ctx, state) =>
      state.hostileId != null
      && String(ctx.taskForce.sharedTargetId) === String(state.hostileId),
  },
  {
    id: 'weapons_tight',
    title: 'WEAPONS CONTROL — TIGHT',
    body: 'Set <b>WEAPONS TIGHT</b> with <kbd>J</kbd>. Tight means the force may engage <i>only</i> the designated track, and only once it is positively identified — nothing else, no matter what wanders into range.',
    hint: 'Press J. Watch the WEAPONS CONTROL STATUS field in the doctrine bar change.',
    hintAfter: 12,
    minDwell: 1,
    check: (ctx) => ctx.taskForce.weaponsPolicy === 'tight',
  },
  {
    id: 'weapons_free',
    title: 'WEAPONS CONTROL — FREE',
    body: 'Now press <kbd>V</kbd> for <b>WEAPONS FREE</b>: escorts may engage any qualifying hostile on their own initiative. This is the most permissive posture — and the one that most needs a deliberate decision behind it.',
    hint: 'Press V. Note the doctrine column in Threat Evaluation updates for every hostile track at once.',
    hintAfter: 12,
    minDwell: 1,
    check: (ctx) => ctx.taskForce.weaponsPolicy === 'free',
  },
  {
    id: 'weapons_hold',
    title: 'WEAPONS CONTROL — HOLD',
    body: 'Press <kbd>B</kbd> to come back to <b>WEAPONS HOLD</b> — check fire, self-defence only. Hold is the default and the safe posture; you leave it on purpose, and you come back to it on purpose.',
    hint: 'Press B.',
    hintAfter: 10,
    minDwell: 1,
    check: (ctx) => ctx.taskForce.weaponsPolicy === 'hold',
  },
  {
    id: 'escort_ping',
    title: 'TASK THE FORCE',
    body: 'The console commands the force, not just the ship. Press <kbd>N</kbd> to order an escort to go active on sonar. <kbd>M</kbd> returns escorts to the screen; <kbd>Y</kbd> acknowledges tasking from higher command.',
    hint: 'Press N. An expanding ring on the plot confirms the sweep went out.',
    hintAfter: 12,
    minDwell: 1,
    check: (ctx, state) => ctx.taskForce.lastPingAt > (state.pingBaseline ?? -999),
    setup: (ctx, state) => { state.pingBaseline = ctx.taskForce.lastPingAt; },
  },
  {
    id: 'graduate',
    title: 'QUALIFIED — BASIC TAO',
    body: 'That is the full basic cycle: <b>detect, classify, identify, evaluate, engage, report</b>. Press <kbd>P</kbd> at any time to reopen an after-action debrief. You are cleared to take a live patrol.',
    hint: null,
    hintAfter: 0,
    minDwell: 6,
    comms: [{ speaker: 'HORIZON ACTUAL', text: 'Good evolution, MERIDIAN. Basic TAO qualification complete. Live tasking follows — it will not wait for you the way this did.', urgency: 'normal' }],
    check: () => true,
  },
];

export class TaoTraining {
  constructor({ onComms, onStep, onComplete } = {}) {
    this.onComms = onComms || (() => {});
    this.onStep = onStep || (() => {});
    this.onComplete = onComplete || (() => {});
    this.active = false;
    this.index = -1;
    this._state = {};
    this._elapsedInStep = 0;
    this._hintShown = false;
  }

  get currentStep() {
    return this.active ? STEPS[this.index] : null;
  }

  get progress() {
    return { index: Math.max(0, this.index), total: STEPS.length };
  }

  start(ctx) {
    this.active = true;
    this.index = -1;
    this._state = {};
    this._advance(ctx);
  }

  abort() {
    this.active = false;
    this.index = -1;
    this.onStep(null);
  }

  _advance(ctx) {
    this.index += 1;
    this._elapsedInStep = 0;
    this._hintShown = false;
    if (this.index >= STEPS.length) {
      this.active = false;
      this.onStep(null);
      this.onComplete(this._state);
      return;
    }
    const step = STEPS[this.index];
    try {
      step.setup?.(ctx, this._state);
    } catch (err) {
      // A failed spawn must not wedge the tutorial — log and let the step's
      // check() decide what to do with the missing state.
      console.warn('[TaoTraining] setup failed for step', step.id, err);
    }
    for (const line of step.comms || []) this.onComms(line);
    this._emitStep();
  }

  _emitStep(showHint = false) {
    const step = STEPS[this.index];
    if (!step) return;
    this.onStep({
      id: step.id,
      title: step.title,
      body: step.body,
      hint: showHint ? step.hint : null,
      index: this.index,
      total: STEPS.length,
    });
  }

  update(dt, ctx) {
    if (!this.active) return;
    const step = STEPS[this.index];
    if (!step) return;
    this._elapsedInStep += dt;

    if (!this._hintShown && step.hint && step.hintAfter > 0 && this._elapsedInStep >= step.hintAfter) {
      this._hintShown = true;
      this._emitStep(true);
    }

    // minDwell is a floor on step duration, not a gate on the player's action —
    // they can complete the task immediately, the step just won't advance until
    // the instruction has been on screen long enough to actually read.
    if (this._elapsedInStep < (step.minDwell || 0)) return;

    let done = false;
    try {
      done = !!step.check(ctx, this._state);
    } catch {
      done = false;
    }
    if (done) this._advance(ctx);
  }

  /** Remove any contacts this tutorial spawned — called when the player
   *  abandons training or graduates into a live patrol, so schoolhouse tracks
   *  never leak into a real engagement. */
  cleanup(ctx) {
    for (const e of ctx.world?.entities || []) {
      if (e.trainingTag) e.destroyed = true;
    }
  }
}

/**
 * IdentificationTracker — the missing half of the TAO decision cycle (see the
 * research brief this was built from: Detect -> Classify -> Identify -> Threat
 * Evaluate -> Engage -> Report). Before this existed, every contact's `iff` on
 * an entity WAS the player's knowledge of it — the instant something spawned,
 * its true affiliation was on every scope. That skips the one decision an
 * actual TAO trainer is supposed to test.
 *
 * This tracks a SEPARATE "what does the player currently know" state per
 * contact id, independent of the entity's real (ground-truth) `iff`. Nothing
 * else in the game reads this — Radar/Sonar/Weapons/Lookout and the autopilot's
 * own targeting all keep using the entity's real `iff`, unmodified. Only the
 * TAO/AEGIS console (which renders the player's actual situational picture)
 * and TaskForceCoop's WEAPONS TIGHT gate (which is doctrinally supposed to
 * refuse an undesignated-or-unidentified track) consult this.
 */

/** Sentinel returned by knownIffFor() for a track that hasn't been positively
 *  identified yet — the AEGIS console renders this as the pulsing "SUSPECT"
 *  affiliation (see TAO_AFFIL.suspect / .aegis-affil.suspect in stations.css),
 *  deliberately indistinguishable on-screen whether the ground truth turns out
 *  to be hostile or not. Showing it any other way would leak the answer.
 */
export const UNRESOLVED = 'UNRESOLVED';

/** Surface/air/subsurface contacts that aren't already known-friendly are the
 *  ones a TAO actually has to work an ID on. Land objectives, nav waypoints,
 *  and inbound ordnance tracks never go through this — there's no real
 *  identification decision to make about a waypoint. Friendly contacts are
 *  cooperatively IFF'd (Link-16/PPLI in the real system) and known instantly,
 *  same as before this tracker existed. */
export function needsIdentification(domain, iff) {
  const d = String(domain || '').toUpperCase();
  const i = String(iff || '').toUpperCase();
  return (d === 'SURFACE' || d === 'AIR' || d === 'SUBSURFACE') && i !== 'FRIENDLY';
}

export class IdentificationTracker {
  constructor() {
    this._known = new Map(); // String(id) -> { resolved, knownIff, method }
    this._interrogation = null; // { id, startedAt, duration, groundTruthIff }
  }

  /** Called once per contact per frame, before anything reads this frame's
   *  state — first sighting of a track either auto-resolves (friendly / land /
   *  nav / ordnance) or starts UNRESOLVED. Safe to call every frame; a no-op
   *  once a track is already known.
   *
   *  Ids are normalized to strings everywhere in this class: entity ids from
   *  `world.entities`/`lastContacts` are numbers, but a track selected by
   *  clicking a console row arrives as a string (DOM `dataset` values are
   *  always strings — see StationOverlay's own `String(id) === String(...)`
   *  workarounds for the same issue). Without normalizing here, a track seeded
   *  under its numeric id could never be found again by its string id, and
   *  vice versa — two silently separate Map entries for the same contact. */
  seed(id, groundTruthIff, domain) {
    const key = String(id);
    if (this._known.has(key)) return;
    if (needsIdentification(domain, groundTruthIff)) {
      this._known.set(key, { resolved: false, knownIff: null, method: null });
    } else {
      this._known.set(key, { resolved: true, knownIff: groundTruthIff, method: 'auto' });
    }
  }

  isResolved(id) {
    return !!this._known.get(String(id))?.resolved;
  }

  knownAffiliation(id) {
    return this._known.get(String(id))?.knownIff ?? null;
  }

  /** What the AEGIS console should render for this track — the resolved
   *  affiliation once known, otherwise the UNRESOLVED sentinel. Falls back to
   *  UNRESOLVED (not the ground truth) for an id that hasn't been seeded yet
   *  this frame, so a race can never accidentally reveal the answer early. */
  knownIffFor(id) {
    const k = this._known.get(String(id));
    if (!k || !k.resolved) return UNRESOLVED;
    return k.knownIff;
  }

  /** Direct resolution from another identification path — e.g. Lookout's
   *  existing Visual ID report (see main.js reportLookoutContact). Feeds the
   *  SAME state this console reads rather than building a parallel system. */
  resolve(id, iffValue, method = 'visual') {
    const key = String(id);
    this._known.set(key, { resolved: true, knownIff: iffValue, method });
    if (this._interrogation && String(this._interrogation.id) === key) this._interrogation = null;
  }

  /** Begin an IFF interrogation on the AEGIS console's hooked track. Takes real
   *  time (default 3.5s) — a snap call under pressure can't substitute for
   *  actually running the check, which is the entire doctrinal point. The
   *  ground truth is captured now and revealed TRUTHFULLY once the timer
   *  completes (this never lies to the player; the lesson is "you have to
   *  check", not "the system is unreliable"). Only one interrogation may run
   *  at a time — matches a single console operator's attention. */
  beginInterrogate(id, groundTruthIff, duration = 3.5) {
    if (this.isResolved(id)) return false;
    if (this._interrogation) return false;
    this._interrogation = { id: String(id), startedAt: performance.now() / 1000, duration, groundTruthIff };
    return true;
  }

  /** Normalized 0..1 progress for the in-flight interrogation on `id`, or null
   *  if nothing is running against that id — lets the console show a live
   *  "INTERROGATING… NN%" readout. */
  interrogationProgress(id) {
    if (!this._interrogation || this._interrogation.id !== String(id)) return null;
    const now = performance.now() / 1000;
    return Math.max(0, Math.min(1, (now - this._interrogation.startedAt) / this._interrogation.duration));
  }

  get activeInterrogationId() {
    return this._interrogation?.id ?? null;
  }

  /** Advance any in-flight interrogation. Called once per sim frame; returns
   *  the just-completed { id, knownIff } exactly once so callers (comms line,
   *  scenario/debrief scoring) can react to it without polling for the edge. */
  update() {
    if (!this._interrogation) return null;
    const now = performance.now() / 1000;
    if (now - this._interrogation.startedAt < this._interrogation.duration) return null;
    const { id, groundTruthIff } = this._interrogation;
    this._interrogation = null;
    this.resolve(id, groundTruthIff, 'iff');
    return { id, knownIff: groundTruthIff };
  }

  /** Drop tracks that have left the picture (destroyed / out of range) so the
   *  map doesn't grow across a whole patrol. `liveIds` may contain a mix of
   *  string/number ids (whatever the current frame's contact list happens to
   *  carry) — normalized the same way as everywhere else in this class. */
  prune(liveIds) {
    const liveKeys = new Set(Array.from(liveIds, (v) => String(v)));
    for (const key of this._known.keys()) {
      if (!liveKeys.has(key)) this._known.delete(key);
    }
    if (this._interrogation && !liveKeys.has(this._interrogation.id)) this._interrogation = null;
  }
}

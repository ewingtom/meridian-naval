/**
 * TaoDebrief — after-action scoring for the "ambiguous inbound" TAO training
 * scenario (see WorldManager.spawnWave('ambiguous_inbound'), MissionSystem's
 * `ambiguous_contact` beat, and the research brief this was grounded in: a
 * real, documented shootdown of a misclassified civilian contact under time
 * pressure — see the class comment on that spawn case for the honest,
 * non-reenactment framing).
 *
 * Scoring shape is modeled on SWOS's own 1990s TAO Intelligent Tutoring
 * System (documented in a co-authored IITSEC paper): a short list of NAMED
 * principles, each scored independently pass/fail/partial with a one-line
 * rationale, rather than one opaque grade. That's the whole reason
 * DebriefPanel renders a list instead of a score number.
 *
 * This does not claim procedure-exact PQS/ROE fidelity (that material isn't
 * public) — it scores the real decision cycle and the real weapons-control
 * vocabulary (FREE/TIGHT/HOLD) against what actually happened in this one
 * scenario.
 */

export const PRINCIPLES = [
  {
    id: 'posid',
    name: 'Positive Identification Before Engagement',
    describe: 'Never fired on the unresolved contact before its ID actually cleared it.',
  },
  {
    id: 'noambiguous',
    name: 'Did Not Act on Ambiguous Cues Alone',
    describe: 'Ran an actual identification check instead of reacting to the closing/descending profile by itself.',
  },
  {
    id: 'posture',
    name: 'Correct Weapons-Control Posture',
    describe: 'Kept the force on TIGHT (designated track only) rather than broad FREE while the contact was still unresolved.',
  },
  {
    id: 'comms',
    name: 'Timely Force Communication',
    describe: 'Shared/designated the genuine hostile track to the force promptly.',
  },
  {
    id: 'priority',
    name: 'Threat Prioritization Under Load',
    describe: 'Kept the real hostile threat handled instead of losing track of it while working the ambiguous contact.',
  },
];

/** Pure scoring function — takes the raw facts a ScenarioRun gathered and
 *  returns each principle's { id, result, rationale }. Kept separate from
 *  ScenarioRun's bookkeeping so the rules are easy to read/audit in one place. */
export function scoreScenario(facts) {
  const {
    engagedUnresolved = false,
    interrogated = false,
    resolvedIff = null,
    freeWhileUnresolved = false,
    sharedRealThreat = false,
    realThreatHandled = false,
  } = facts || {};

  return [
    {
      id: 'posid',
      result: engagedUnresolved ? 'fail' : 'pass',
      rationale: engagedUnresolved
        ? 'Weapons released on the unresolved contact — it was never confirmed hostile before engagement.'
        : 'The unresolved contact was never engaged before its ID cleared (or it transited clear untouched).',
    },
    {
      id: 'noambiguous',
      result: engagedUnresolved ? 'fail' : interrogated ? 'pass' : 'partial',
      rationale: engagedUnresolved
        ? "Acted on the contact's closing/descending profile without ever running an IFF check."
        : interrogated
          ? `IFF interrogation was run and returned ${resolvedIff || 'a result'} before any weapons decision.`
          : 'Fire was held — the right outcome — but the contact was never actually interrogated to confirm it.',
    },
    {
      id: 'posture',
      result: engagedUnresolved && freeWhileUnresolved ? 'fail' : freeWhileUnresolved ? 'partial' : 'pass',
      rationale: engagedUnresolved && freeWhileUnresolved
        ? 'Weapons were broad FREE (any qualifying target) while the contact was unresolved, and it was engaged.'
        : freeWhileUnresolved
          ? 'Weapons went broad FREE at some point while the contact was still unresolved — no mistaken engagement resulted, but the posture left the door open for one.'
          : 'Weapons control stayed at TIGHT (designated track only) or HOLD for the duration the contact was unresolved.',
    },
    {
      id: 'comms',
      result: sharedRealThreat ? 'pass' : 'fail',
      rationale: sharedRealThreat
        ? 'The genuine hostile track was shared/designated to the force.'
        : 'The genuine hostile track was never shared to the force during the scenario.',
    },
    {
      id: 'priority',
      result: realThreatHandled ? 'pass' : 'fail',
      rationale: realThreatHandled
        ? 'The real hostile threat was engaged and cleared during the scenario.'
        : 'The real hostile threat was still live and unaddressed by the end of the scenario.',
    },
  ];
}

/** Stateful bookkeeping for one run of the scenario — main.js calls the
 *  note*() methods as things happen, then score() at the end. Kept as a thin
 *  wrapper around scoreScenario() so the actual pass/fail rules live in one
 *  pure, testable function. */
export class ScenarioRun {
  // Ids are normalized to strings throughout — see IdentificationTracker.js's
  // constructor comment for why: entity ids are numbers, but ids that round
  // trip through a DOM `dataset` (clicking a console row) arrive as strings,
  // and this class gets fed both depending on which path noticed the event.
  constructor({ ambiguousId, realThreatId } = {}) {
    this.ambiguousId = ambiguousId != null ? String(ambiguousId) : null;
    this.realThreatId = realThreatId != null ? String(realThreatId) : null;
    this.active = true;
    this.startedAt = performance.now() / 1000;
    this.finishedAt = null;
    this.facts = {
      engagedUnresolved: false,
      interrogated: false,
      resolvedIff: null,
      freeWhileUnresolved: false,
      sharedRealThreat: false,
      realThreatHandled: false,
    };
  }

  noteInterrogate(id) {
    if (String(id) === this.ambiguousId) this.facts.interrogated = true;
  }

  noteResolved(id, iffValue) {
    if (String(id) === this.ambiguousId) this.facts.resolvedIff = iffValue;
  }

  noteEngagedUnresolved(id) {
    if (String(id) === this.ambiguousId) this.facts.engagedUnresolved = true;
  }

  noteShared(id) {
    if (String(id) === this.realThreatId) this.facts.sharedRealThreat = true;
  }

  noteFreeWhileUnresolved() {
    this.facts.freeWhileUnresolved = true;
  }

  noteRealThreatHandled() {
    this.facts.realThreatHandled = true;
  }

  finish() {
    if (!this.active) return;
    this.active = false;
    this.finishedAt = performance.now() / 1000;
  }

  /** Joins scoreScenario()'s {id, result, rationale} rows against PRINCIPLES'
   *  {name, describe} so DebriefPanel gets one flat, display-ready object per
   *  principle without needing to know how the two are related. */
  score() {
    const byId = new Map(PRINCIPLES.map((p) => [p.id, p]));
    return scoreScenario(this.facts).map((row) => ({ ...byId.get(row.id), ...row }));
  }
}

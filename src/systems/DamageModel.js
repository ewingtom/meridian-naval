import * as THREE from 'three';

/**
 * ============================================================================
 *  NAVAL DAMAGE / SURVIVABILITY MODEL
 * ============================================================================
 *
 * Replaces the old `health -= cfg.damage` flat model with a real
 * susceptibility / vulnerability / recoverability treatment, shared by EVERY
 * hull in play — the player's Meridian, the AI-crewed escorts (CrewedShip) and
 * every hostile/neutral contact (Entity subclasses). One code path, so the
 * player watches their own ship degrade exactly the way the ship they just shot
 * degrades.
 *
 * --------------------------------------------------------------------------
 *  RESEARCH BASIS (what the numbers are anchored to)
 * --------------------------------------------------------------------------
 * Kill taxonomy follows standard naval survivability doctrine (susceptibility /
 * vulnerability / recoverability; M-kill = mobility, F-kill = firepower,
 * mission kill = afloat but combat-ineffective, K-kill = catastrophic):
 *
 *  - HMS SHEFFIELD (Type 42 DDG, ~4,800 t), 1982: ONE Exocet, warhead probably
 *    did not even detonate. The ship was not sunk by the blast — she was killed
 *    by the FIRE it started, which beat the damage-control parties (firemain
 *    severed), forced abandonment after ~5 hours and sank under tow 6 days
 *    later. => a single ASM hit should very often be survivable-at-the-instant
 *    but start a fire that can still lose you the ship if it isn't fought.
 *
 *  - USS STARK (FFG-31, ~4,100 t), 1987: TWO Exocets, 37 dead, heavy fire and
 *    progressive flooding, hull opened 10x15 ft at the waterline — and she
 *    still steamed to Bahrain under her own power. Internal subdivision kept
 *    the blast out of the magazine. => 2 ASM hits on a frigate = severe mission
 *    kill, NOT an automatic sinking, and damage control is the deciding factor.
 *
 *  - INS HANIT (Sa'ar 5 corvette, ~1,270 t), 2006: ONE C-802 into the after
 *    superstructure / flight-deck area. 4 dead, returned to port under own
 *    power. => hit LOCATION dominates outcome: the same warhead into machinery
 *    or a magazine is a different ship.
 *
 *  - USS SAMUEL B. ROBERTS (FFG-58), 1988: mine, keel cracked, main spaces
 *    flooded and afire; the crew literally cabled the hull together and saved
 *    her. => recoverability is a real counterforce, not flavor.
 *
 *  - ROKS CHEONAN (~1,200 t), 2010 and the RAN Mk48 SINKEX vs a Leander-class
 *    frigate: a torpedo detonating UNDER THE KEEL (shock wave + bubble pulse
 *    hogging/sagging the hull girder) broke the ship in half and sank it in
 *    minutes. => under-keel torpedoes are categorically more lethal than a
 *    same-size contact warhead. They get their own damage channel.
 *
 *  - Analyses of historical ASM engagements caution that the sample is almost
 *    entirely small warships and does not extrapolate above ~7,000 t. Bigger
 *    hulls absorb far more: hence capacity scales with displacement here rather
 *    than being an arbitrary hitpoint constant.
 *
 * --------------------------------------------------------------------------
 *  MODEL SUMMARY
 * --------------------------------------------------------------------------
 *  capacity  = STRUCTURE_REF * (displacementT / REF_DISPLACEMENT_T)^0.7
 *              (reference hull = a 4,000 t frigate = 100 points, so all the
 *               historical anchors above read directly as percentages)
 *  rawDamage = ASM_REF_DAMAGE * (warheadKg / REF_WARHEAD_KG)^0.65
 *              (reference warhead = 165 kg Exocet/C-802 = 50 pts = half a
 *               frigate's structure on an average hit)
 *  applied   = rawDamage * locationMultiplier * subdivisionResistance * roll
 *
 * Hit location is derived from the REAL impact geometry: the world-space
 * impact point is transformed into the target's local frame and classified by
 * where it lands fore/aft (z), high/low (y) and inboard (x). Each location
 * feeds different subsystems (propulsion, steering, sensors, fire control,
 * aviation), different fire probability and different flooding probability.
 *
 * Progressive degradation is the point: propulsion damage caps speed, sensor
 * damage shrinks radar range, fire-control damage takes weapons offline, fires
 * keep eating structure until fought, flooding builds list and eventually sinks
 * the ship. A ship that is afloat but can neither move nor shoot is a MISSION
 * KILL — the most common realistic outcome of a single hit.
 */

// ---------------------------------------------------------------------------
// Reference constants (see rationale above)
// ---------------------------------------------------------------------------
const REF_DISPLACEMENT_T = 4000;   // FFG-7 / Type 42 class, the historical anchor
const STRUCTURE_REF = 100;         // structure points for the reference hull
const DISPLACEMENT_EXP = 0.7;      // between area (2/3) and volume (1) scaling
const REF_WARHEAD_KG = 165;        // Exocet MM38 / C-802 warhead
const ASM_REF_DAMAGE = 55;         // one reference ASM = 55% of a frigate's structure
const WARHEAD_EXP = 0.65;          // blast damage grows sub-linearly with charge mass

/** Named hit locations. Derived from actual impact geometry (see classifyHit). */
export const HitLocation = {
  BOW: 'BOW',
  WATERLINE: 'WATERLINE',
  MACHINERY: 'MACHINERY',
  MAGAZINE: 'MAGAZINE',
  SUPERSTRUCTURE: 'SUPERSTRUCTURE',
  BRIDGE: 'BRIDGE',
  FLIGHTDECK: 'FLIGHTDECK',
  KEEL: 'KEEL',
  GLANCING: 'GLANCING',
  AIRFRAME: 'AIRFRAME',
  PRESSURE_HULL: 'PRESSURE_HULL',
};

/**
 * Per-location effects.
 *  struct     — structural damage multiplier
 *  fire       — probability a fire starts (before warhead-size scaling)
 *  flood      — probability progressive flooding starts
 *  systems    — subsystem damage fractions applied on a reference-severity hit
 *  magazine   — chance this hit reaches a magazine and detonates it (K-kill)
 *  label      — what the damage-control report calls it
 */
const LOCATION_EFFECTS = {
  [HitLocation.BOW]: {
    struct: 0.55, fire: 0.15, flood: 0.35, magazine: 0,
    systems: { sensors: 0.15, steering: 0.05 },
    label: 'the bow',
  },
  [HitLocation.WATERLINE]: {
    // Stark's 10x15 ft waterline hole: this is the flooding channel.
    struct: 1.15, fire: 0.35, flood: 0.85, magazine: 0.01,
    systems: { propulsion: 0.15 },
    label: 'the waterline',
  },
  [HitLocation.MACHINERY]: {
    // Main/auxiliary machinery spaces: the classic M-kill.
    struct: 1.0, fire: 0.7, flood: 0.5, magazine: 0.02,
    systems: { propulsion: 0.75, steering: 0.3 },
    label: 'main machinery',
  },
  [HitLocation.MAGAZINE]: {
    struct: 1.25, fire: 0.85, flood: 0.3, magazine: 0.35,
    systems: { fireControl: 0.5, weapons: 0.8 },
    label: 'the forward magazine',
  },
  [HitLocation.SUPERSTRUCTURE]: {
    // Sheffield / Hanit: comparatively low structural damage, high fire risk,
    // wrecks the sensors and fire-control that make the ship a warship.
    struct: 0.7, fire: 0.8, flood: 0.05, magazine: 0.005,
    systems: { sensors: 0.45, fireControl: 0.5, weapons: 0.25 },
    label: 'the superstructure',
  },
  [HitLocation.BRIDGE]: {
    struct: 0.6, fire: 0.6, flood: 0.02, magazine: 0,
    systems: { sensors: 0.6, fireControl: 0.55, steering: 0.4 },
    label: 'the bridge',
  },
  [HitLocation.FLIGHTDECK]: {
    // Hanit took hers here and sailed home.
    struct: 0.6, fire: 0.65, flood: 0.1, magazine: 0.01,
    systems: { aviation: 0.9, steering: 0.15 },
    label: 'the flight deck',
  },
  [HitLocation.KEEL]: {
    // Under-keel detonation: hull-girder whipping. Cheonan / Mk48 SINKEX.
    struct: 2.2, fire: 0.2, flood: 1.0, magazine: 0.05,
    systems: { propulsion: 0.6, steering: 0.5 },
    label: 'under the keel',
  },
  [HitLocation.GLANCING]: {
    struct: 0.3, fire: 0.2, flood: 0.05, magazine: 0,
    systems: {},
    label: 'a glancing blow',
  },
  // Non-ship targets get their own channel so the damage reports read correctly
  // ("the airframe", not "the flight deck") and so aircraft don't flood.
  [HitLocation.AIRFRAME]: {
    struct: 1.5, fire: 0.6, flood: 0, magazine: 0,
    systems: { propulsion: 0.5, sensors: 0.4, weapons: 0.4 },
    label: 'the airframe',
  },
  [HitLocation.PRESSURE_HULL]: {
    // A pressure hull is unforgiving: any real breach ends the boat.
    struct: 1.4, fire: 0.1, flood: 0.9, magazine: 0.04,
    systems: { propulsion: 0.5, sensors: 0.5 },
    label: 'the pressure hull',
  },
};

/**
 * Ship-class survivability specs.
 *  displacementT — drives structural capacity
 *  subdivision   — watertight subdivision / armored box quality. Higher = the
 *                  same blast is contained better (Stark's subdivision keeping
 *                  the fire out of the magazine). Divides incoming damage.
 *  dcQuality     — trained damage-control organisation. Drives fire suppression
 *                  and flooding-control rates. Warships >> merchants.
 *  freeboard     — how much flooding the hull tolerates before she goes.
 */
const CLASS_SPECS = {
  // Arleigh Burke Flight IIA, ~9,700 t full load — the Meridian.
  destroyer: { displacementT: 9700, subdivision: 1.25, dcQuality: 1.0, freeboard: 1.0, label: 'destroyer' },
  // FFG-7 / FREMM-size escort, ~4,000 t.
  frigate: { displacementT: 4000, subdivision: 1.0, dcQuality: 0.9, freeboard: 1.0, label: 'frigate' },
  corvette: { displacementT: 1300, subdivision: 0.85, dcQuality: 0.8, freeboard: 0.85, label: 'corvette' },
  // Big, cheap, undivided, tiny crew — absorbs enormous damage but cannot fight it.
  merchant: { displacementT: 28000, subdivision: 0.55, dcQuality: 0.35, freeboard: 1.4, label: 'merchant' },
  // A pressure hull is unforgiving: any real breach ends the boat.
  submarine: { displacementT: 2700, subdivision: 0.55, dcQuality: 0.55, freeboard: 0.35, label: 'submarine' },
  // Not a ship at all; thin-skinned, no DC, no flooding.
  aircraft: { displacementT: 30, subdivision: 1.0, dcQuality: 0, freeboard: 0, label: 'aircraft' },
};

/**
 * Munition specs. `warheadKg` is the real HE charge; `frag` is a fragmentation
 * effectiveness multiplier — pure blast scaling badly underestimates a gun
 * round against unarmoured steel/aluminium topsides, where the damage is
 * dominated by fragment spray and secondary fires rather than overpressure.
 * `kind` selects the damage channel: torpedoes run under the target and get the
 * under-keel hull-girder channel, sea-skimmers hit where their track puts them.
 */
const MUNITIONS = {
  // 130 mm HE-frag common round: ~3.6 kg burster. One round is not going to
  // sink a warship — historically correct — but the rate of fire is high and
  // every hit is a fire-starter. This is the weapon you finish a cripple with.
  playerShell: { warheadKg: 3.6, frag: 2.4, kind: 'gun', label: '130mm HE' },
  enemyShell: { warheadKg: 3.0, frag: 2.4, kind: 'gun', label: '100mm HE' },
  ciwsRound: { warheadKg: 0.05, frag: 2.4, kind: 'gun', label: '20mm' },
  // Harpoon-class: 221 kg blast-frag, sea-skimming.
  playerMissile: { warheadKg: 221, frag: 1, kind: 'asm', label: 'ASM' },
  // SM-2-class blast-frag — lethal to aircraft, light vs ships (we only allow air tracks).
  playerSam: { warheadKg: 45, frag: 3.2, kind: 'gun', label: 'SAM' },
  // Tomahawk-class unitary warhead — land strike.
  playerLacm: { warheadKg: 450, frag: 1.1, kind: 'asm', label: 'LACM' },
  // Exocet/C-802-class: 165 kg — the historical reference warhead.
  enemyMissile: { warheadKg: 165, frag: 1, kind: 'asm', label: 'ASM' },
  airMissile: { warheadKg: 145, frag: 1, kind: 'asm', label: 'air-launched ASM' },
  // Mk48 ADCAP: 295 kg, under-keel influence fuzing.
  playerTorpedo: { warheadKg: 295, frag: 1, kind: 'torpedo', label: 'heavyweight torpedo' },
  torpedo: { warheadKg: 260, frag: 1, kind: 'torpedo', label: 'heavyweight torpedo' },
  drone: { warheadKg: 0, frag: 1, kind: 'none', label: 'drone' },
};

export function getMunitionSpec(type) {
  return MUNITIONS[type] || { warheadKg: 20, frag: 1, kind: 'generic', label: 'ordnance' };
}

/** Structural capacity in "reference frigate points" for a displacement. */
export function structuralCapacity(displacementT) {
  return STRUCTURE_REF * Math.pow(displacementT / REF_DISPLACEMENT_T, DISPLACEMENT_EXP);
}

/** Raw blast damage in the same points, before location/subdivision/roll. */
export function warheadDamage(warheadKg) {
  if (warheadKg <= 0) return 0;
  return ASM_REF_DAMAGE * Math.pow(warheadKg / REF_WARHEAD_KG, WARHEAD_EXP);
}

// ---------------------------------------------------------------------------
// Event bus — how damage becomes something the player can SEE.
// ---------------------------------------------------------------------------
/**
 * Systems/UI subscribe here rather than the damage model reaching into the UI.
 * Event kinds: 'hit' | 'fire' | 'fireOut' | 'flood' | 'subsystem' | 'missionKill'
 *              | 'catastrophic' | 'sunk' | 'repair'
 * Every event carries { kind, ship, text, speaker, urgency, ... } so a consumer
 * can either render the ready-made damage-control report or use the raw fields.
 */
class Emitter {
  constructor() { this._subs = new Set(); }
  on(fn) { this._subs.add(fn); return () => this._subs.delete(fn); }
  emit(ev) {
    for (const fn of this._subs) {
      try { fn(ev); } catch (err) { console.warn('[DamageModel] listener threw', err); }
    }
  }
}
export const damageEvents = new Emitter();

/**
 * Optional comms sink. main.js/UI is owned by another agent, so rather than
 * editing it we (a) publish everything on `damageEvents` for a proper wiring,
 * and (b) fall back to the CommsLog already hanging off window.GAME so battle
 * damage assessment is legible in-game today with no UI edits. Call
 * setCommsSink() to take over cleanly.
 */
let _commsSink = null;
export function setCommsSink(fn) { _commsSink = fn; }

function pushComms(line) {
  if (_commsSink) { _commsSink(line); return; }
  const log = (typeof window !== 'undefined') && window.GAME && window.GAME.commsLog;
  if (log?.push) log.push(line);
}

// ---------------------------------------------------------------------------
// Hit classification from real impact geometry
// ---------------------------------------------------------------------------
const _local = new THREE.Vector3();

/**
 * Classify where a round landed on `target` using the actual world-space impact
 * point. `target.group` gives us the hull's frame: local +z is the bow, +y is
 * up from the waterline, +/-x is the beam.
 *
 * Falls back to a doctrine-weighted random draw when we have no usable impact
 * point (e.g. a legacy takeDamage(n) call) so the model never silently
 * degenerates to a single location.
 */
/** Box-Muller-ish cheap normal sample, clamped. */
function gauss(sigma) {
  return (Math.random() + Math.random() + Math.random() - 1.5) * 2 * sigma;
}

/**
 * Terminal strike height as a fraction of the target's deck height, by munition
 * type. The collision test upstream is a coarse sphere centred on the hull's
 * waterline origin, so the round's own y at contact is an artifact of that
 * sphere's radius and the flight model — not an aimpoint. The along-hull and
 * across-beam offsets ARE meaningful (they really do say where along the ship
 * you struck), so those come from the real geometry; the vertical comes from
 * the weapon's actual terminal profile:
 *   ASM  — a sea-skimmer arrives low. Sheffield was struck ~8 ft above the
 *          waterline, Stark's first round opened the hull AT the waterline,
 *          Hanit's went into the after superstructure. Weighted accordingly.
 *   gun  — plunging/direct fire lands mostly on the upper works.
 */
function strikeHeightFrac(kind) {
  const r = Math.random();
  if (kind === 'asm') {
    if (r < 0.30) return Math.random() * 0.14;          // at/below the waterline
    if (r < 0.70) return 0.18 + Math.random() * 0.55;   // hull side
    return 0.85 + Math.random() * 0.8;                  // superstructure
  }
  if (kind === 'gun') {
    if (r < 0.14) return Math.random() * 0.14;
    if (r < 0.46) return 0.18 + Math.random() * 0.55;
    return 0.85 + Math.random() * 1.1;
  }
  if (r < 0.25) return Math.random() * 0.14;
  if (r < 0.62) return 0.18 + Math.random() * 0.55;
  return 0.85 + Math.random() * 0.9;
}

export function classifyHit(target, impactWorld, munitionKind) {
  const domain = String(target?.domain || '').toUpperCase();
  if (domain === 'AIR') return HitLocation.AIRFRAME;

  // Torpedoes run beneath the hull and fire on the magnetic influence fuze.
  if (munitionKind === 'torpedo') {
    // A minority of runs are a contact hit on the side rather than a clean
    // under-keel detonation — far less lethal, per historical comparisons.
    return Math.random() < 0.8 ? HitLocation.KEEL : HitLocation.WATERLINE;
  }
  if (domain === 'SUBSURFACE') return HitLocation.PRESSURE_HULL;

  const len = target.length || target.physics?.length || 110;
  const deckY = target.deckY || 6;

  let z = 0, x = 0;
  let haveGeometry = false;
  if (impactWorld && target.group) {
    _local.copy(impactWorld);
    target.group.updateMatrixWorld();
    target.group.worldToLocal(_local);
    x = _local.x; z = _local.z;
    haveGeometry = Number.isFinite(x) && Number.isFinite(z);
  }

  if (!haveGeometry) {
    // Doctrine-weighted fallback distribution.
    const r = Math.random();
    if (r < 0.24) return HitLocation.SUPERSTRUCTURE;
    if (r < 0.44) return HitLocation.WATERLINE;
    if (r < 0.62) return HitLocation.MACHINERY;
    if (r < 0.74) return HitLocation.BOW;
    if (r < 0.84) return HitLocation.FLIGHTDECK;
    if (r < 0.92) return HitLocation.BRIDGE;
    if (r < 0.97) return HitLocation.GLANCING;
    return HitLocation.MAGAZINE;
  }

  // Real along-hull impact position, plus terminal aimpoint dispersion — the
  // collision sphere truncates the spread a real seeker/gunlaying error has, so
  // the measured offset is used as the MEAN and dispersed around it. Hit the
  // stern and you still get stern damage; hit amidships and it wanders.
  const fore = THREE.MathUtils.clamp(z / (len * 0.5) + gauss(0.28), -1, 1); // +1 bow
  const y = deckY * strikeHeightFrac(munitionKind);
  const high = y > deckY * 0.75;   // above the weather deck = superstructure level
  const low = y < deckY * 0.15;    // at or below the waterline

  if (low) {
    // Below the waterline. Machinery spaces sit amidships-to-aft on a warship;
    // the forward magazine is under the gun, well forward.
    if (fore > 0.55) return Math.random() < 0.22 ? HitLocation.MAGAZINE : HitLocation.BOW;
    if (fore > -0.55) return Math.random() < 0.55 ? HitLocation.MACHINERY : HitLocation.WATERLINE;
    return Math.random() < 0.45 ? HitLocation.MACHINERY : HitLocation.WATERLINE;
  }

  if (high) {
    if (fore > 0.15) return HitLocation.BRIDGE;
    if (fore < -0.45) return HitLocation.FLIGHTDECK;
    return HitLocation.SUPERSTRUCTURE;
  }

  // Hull side, between waterline and weather deck.
  const inboard = Math.abs(x) < (target.beam || 14) * 0.28;
  if (!inboard && Math.random() < 0.2) return HitLocation.GLANCING;
  if (fore > 0.6) return Math.random() < 0.15 ? HitLocation.MAGAZINE : HitLocation.BOW;
  if (fore < -0.5) return Math.random() < 0.35 ? HitLocation.FLIGHTDECK : HitLocation.MACHINERY;
  return Math.random() < 0.45 ? HitLocation.MACHINERY : HitLocation.WATERLINE;
}

// ---------------------------------------------------------------------------
// Damage state
// ---------------------------------------------------------------------------
const SUBSYSTEMS = ['propulsion', 'steering', 'sensors', 'fireControl', 'weapons', 'aviation'];

/** Every live DamageState, so one tick site can advance all of them. */
const _registry = new Set();

let _tickToken = 0;

/**
 * Advance fires/flooding/damage-control for every ship in play. Called once per
 * frame from WeaponsSystem.update (the one system guaranteed to run exactly
 * once per simulated frame with the whole cast in scope).
 */
export function tickAllDamage(dt) {
  _tickToken++;
  for (const st of _registry) {
    if (st._disposed) { _registry.delete(st); continue; }
    if (st._lastTick === _tickToken) continue;
    st._lastTick = _tickToken;
    st.tick(dt);
    // A ship can now be lost with no new round landing — fire that beat the DC
    // party (Sheffield) or flooding that beat the pumps. Trip the owner's normal
    // destruction path so the sinking animation / cleanup runs identically.
    const o = st.owner;
    if (st.lost && o && o.alive) {
      o.alive = false;
      if (typeof o.onDestroyed === 'function') o.onDestroyed();
      else if (!o.isCrewedShip) o.destroyed = true;
      if (o.isCrewedShip) o.destroyed = true;
    }
  }
}

export class DamageState {
  /**
   * @param {object} owner  the ship/entity (needs .name, .group, optionally .physics)
   * @param {object} opts   { shipClass, displacementT, dcQuality, subdivision, reportable }
   */
  constructor(owner, { shipClass = 'frigate', displacementT = null, dcQuality = null, subdivision = null, reportable = true } = {}) {
    const spec = CLASS_SPECS[shipClass] || CLASS_SPECS.frigate;
    this.owner = owner;
    this.shipClass = shipClass;
    this.classLabel = spec.label;
    this.displacementT = displacementT ?? spec.displacementT;
    this.subdivision = subdivision ?? spec.subdivision;
    this.dcQuality = dcQuality ?? spec.dcQuality;
    this.freeboard = spec.freeboard;
    this.reportable = reportable; // false = don't spam comms (CIWS-shredded aircraft etc.)

    this.capacity = structuralCapacity(this.displacementT);
    this.structure = this.capacity;

    /** 1 = fully operational, 0 = destroyed. Read by ships/UI for degradation. */
    this.systems = { propulsion: 1, steering: 1, sensors: 1, fireControl: 1, weapons: 1, aviation: 1 };

    this.fire = 0;          // 0..1 fire intensity
    this.flooding = 0;      // 0..1 progressive flooding; 1 = lost
    this.floodRate = 0;     // per-second flooding growth from unrepaired breaches
    this.list = 0;          // radians of induced heel from asymmetric flooding
    this.listSign = Math.random() < 0.5 ? -1 : 1;
    this.dcActive = false;  // a human is actively fighting damage on this hull
    this.dcFatigue = 0;

    this.hitCount = 0;
    this.missionKill = false;
    this.catastrophic = false;
    this.lost = false;
    this.lastHit = null;
    this.statusTag = '';
    this._disposed = false;
    this._lastTick = -1;
    this._fireReported = false;
    this._floodReported = false;
    // Batched small-calibre BDA (see applyHit / _flushMinor).
    this._minor = { count: 0, label: 'rounds', sys: [], due: 0 };

    _registry.add(this);
  }

  dispose() {
    this._disposed = true;
    _registry.delete(this);
  }

  get structurePct() { return this.capacity > 0 ? this.structure / this.capacity : 0; }
  get afloat() { return !this.lost; }

  /** Fraction of max speed still available. Propulsion damage + flooding drag. */
  get speedFactor() {
    const prop = 0.12 + 0.88 * this.systems.propulsion;
    const flood = 1 - this.flooding * 0.55;
    return THREE.MathUtils.clamp(prop * flood, 0, 1);
  }

  get turnFactor() {
    return THREE.MathUtils.clamp(0.25 + 0.75 * this.systems.steering, 0.15, 1);
  }

  /** Multiplier on this ship's own detection range. */
  get sensorFactor() {
    return THREE.MathUtils.clamp(0.2 + 0.8 * this.systems.sensors, 0.2, 1);
  }

  /** Can this ship shoot at all? Fire control below 25% = F-kill. */
  get weaponsOnline() {
    return this.systems.fireControl > 0.25 && this.systems.weapons > 0.2 && !this.lost;
  }

  /** Rate-of-fire penalty from degraded fire control (not a hard offline). */
  get fireControlFactor() {
    return THREE.MathUtils.clamp(0.35 + 0.65 * Math.min(this.systems.fireControl, this.systems.weapons), 0.2, 1);
  }

  /** Afloat but unable to move meaningfully AND unable to fight = mission kill. */
  _evaluateMissionKill() {
    if (this.lost) return;
    const mobilityKill = this.systems.propulsion < 0.35;
    const firepowerKill = !this.weaponsOnline;
    const gutted = this.structurePct < 0.3;
    const kill = (mobilityKill && firepowerKill) || gutted || (firepowerKill && this.flooding > 0.4);
    if (kill && !this.missionKill) {
      this.missionKill = true;
      this._report('missionKill',
        `${this._name()} is combat-ineffective — mission kill. Afloat, but out of the fight.`, 'critical');
    }
  }

  _name() { return this.owner?.baseName || this.owner?.name || 'Contact'; }

  _report(kind, text, urgency = 'warning', extra = {}) {
    const ev = {
      kind,
      ship: this.owner,
      state: this,
      text,
      urgency,
      speaker: this._speaker(kind),
      ...extra,
    };
    damageEvents.emit(ev);
    if (this.reportable) pushComms({ speaker: ev.speaker, text, urgency });
  }

  _speaker(kind) {
    const own = this.owner?.iff === 'FRIENDLY' || this.owner?.isCrewedShip;
    if (own) {
      const call = (this._name().match(/^FS ([A-Za-z]+)/)?.[1] || this._name()).toUpperCase();
      if (kind === 'fire' || kind === 'fireOut' || kind === 'flood' || kind === 'repair') return `${call} DC CENTRAL`;
      return `${call} DAMAGE CONTROL`;
    }
    return 'WEAPONS — BDA';
  }

  _updateStatusTag() {
    let tag = '';
    if (this.lost) tag = '[SINKING]';
    else if (this.catastrophic) tag = '[BREAKING UP]';
    else if (this.flooding > 0.5) tag = '[FLOODING]';
    else if (this.missionKill) tag = '[M-KILL]';
    else if (this.fire > 0.25) tag = '[AFIRE]';
    else if (this.systems.propulsion < 0.5) tag = '[SLOWED]';
    else if (this.structurePct < 0.75 || this.hitCount > 0) tag = '[DMG]';
    if (tag === this.statusTag) return;
    this.statusTag = tag;
    // Contact names flow straight through RadarSystem.buildContacts into the
    // tactical plot, the station contact lists and the weapons target readout,
    // so tagging the name makes battle damage legible with zero UI changes.
    if (this.owner && this.owner.baseName != null) {
      this.owner.name = tag ? `${this.owner.baseName} ${tag}` : this.owner.baseName;
    }
  }

  // -------------------------------------------------------------------------
  // Applying a hit
  // -------------------------------------------------------------------------
  /**
   * @param {object} info
   *   warheadKg    HE charge mass (drives everything)
   *   kind         'gun' | 'asm' | 'torpedo' | 'generic'
   *   impactWorld  THREE.Vector3 world-space impact point (drives hit location)
   *   label        munition name for reports
   * @returns {{applied:number, location:string, fatal:boolean, catastrophic:boolean}}
   */
  applyHit({ warheadKg = 20, frag = 1, kind = 'generic', impactWorld = null, label = 'ordnance' } = {}) {
    if (this.lost) return { applied: 0, location: HitLocation.GLANCING, fatal: false, catastrophic: false };

    const location = classifyHit(this.owner, impactWorld, kind);
    const eff = LOCATION_EFFECTS[location];
    const raw = warheadDamage(warheadKg) * frag;

    // Subdivision/armour contains the blast; spread of real-world outcomes is
    // wide, so a +/-25% roll keeps two identical hits from being identical.
    const roll = 0.75 + Math.random() * 0.5;
    let applied = (raw * eff.struct * roll) / this.subdivision;

    // Severity relative to the hull: a 165 kg warhead is an event on a corvette
    // and an inconvenience on a merchant. Used to scale system/fire/flood odds.
    const severity = THREE.MathUtils.clamp(applied / this.capacity, 0, 1.5);

    this.hitCount++;
    this.structure = Math.max(0, this.structure - applied);
    this.lastHit = { location, applied, label, severity, t: Date.now() };

    // --- catastrophic magazine detonation / hull-girder failure -------------
    // Deliberately uncommon: this is the "you lose a ship in 4 seconds" case
    // and it must stay a shock, not a coin flip.
    const magChance = eff.magazine * THREE.MathUtils.clamp(severity * 1.6, 0, 1);
    const girderChance = location === HitLocation.KEEL
      ? THREE.MathUtils.clamp((severity - 0.55) * 1.1, 0, 0.8)
      : 0;
    if (Math.random() < magChance + girderChance) {
      this.catastrophic = true;
      this.structure = 0;
      this.flooding = 1;
      const why = girderChance > magChance
        ? `${this._name()} — hull girder failed, she's broken her back.`
        : `${this._name()} — magazine detonation. She's gone.`;
      this._report('catastrophic', why, 'critical', { location });
      this._finishLoss();
      this._updateStatusTag();
      return { applied, location, fatal: true, catastrophic: true };
    }

    // --- subsystem damage --------------------------------------------------
    const hurt = [];
    for (const [sys, frac] of Object.entries(eff.systems)) {
      if (!SUBSYSTEMS.includes(sys)) continue;
      // Scale the doctrinal fraction by how big this hit was for this hull, with
      // a floor so even light hits nick something (splinters, shock, cable runs).
      const amount = frac * THREE.MathUtils.clamp(0.35 + severity * 1.5, 0.15, 1.6) * (0.7 + Math.random() * 0.6);
      const before = this.systems[sys];
      this.systems[sys] = THREE.MathUtils.clamp(before - amount, 0, 1);
      if (before - this.systems[sys] > 0.12) hurt.push(sys);
    }

    // --- fires -------------------------------------------------------------
    // Sheffield's lesson: the fire, not the blast, is what kills the ship.
    const fireChance = eff.fire * THREE.MathUtils.clamp(0.3 + severity * 1.8, 0.05, 1);
    if (Math.random() < fireChance) {
      const wasBurning = this.fire > 0.05;
      this.fire = Math.min(1, this.fire + 0.25 + severity * 0.6 + Math.random() * 0.2);
      if (!wasBurning) {
        this._fireReported = true;
        this._report('fire', `Fire in ${eff.label} aboard ${this._name()} — DC party away.`, 'critical', { location });
      }
    }

    // --- flooding ----------------------------------------------------------
    const floodChance = eff.flood * THREE.MathUtils.clamp(0.25 + severity * 1.7, 0.03, 1);
    if (Math.random() < floodChance && this.freeboard > 0) {
      // Tuned so ONE waterline ASM hit on a warship peaks around 30% flooding
      // with a passive damage-control effort (uncomfortable, survivable) and
      // around 10% when someone is actually fighting it — see tick().
      const add = (0.02 + severity * 0.10) / this.freeboard;
      this.floodRate += add;
      if (!this._floodReported) {
        this._floodReported = true;
        this._report('flood', `${this._name()} is taking water at ${eff.label} — pumps and shoring on it.`, 'critical', { location });
      }
    }

    // --- battle damage assessment (this is the "hits are landing" feedback) --
    // Every hit fires a `damageEvents` event so a HUD can react to all of them;
    // the human-readable comms report is throttled so a 130mm mount putting a
    // round on target every 0.7 s reads as a running gunnery report instead of
    // burying the log.
    const pct = Math.round((applied / this.capacity) * 100);
    if (this.structure <= 0) {
      this._flushMinor();
      this._report('hit',
        `Hit on ${this._name()} — ${label} into ${eff.label}. She's going down.`, 'critical',
        { location, applied, pct });
      this._finishLoss();
    } else if (pct >= 8) {
      this._flushMinor();
      const sysText = hurt.length ? ` ${hurt.map(prettySystem).join(' and ')} degraded.` : '';
      const hullText = `${Math.round(this.structurePct * 100)}% structural integrity`;
      this._report('hit',
        `Hit on ${this._name()} — ${label} into ${eff.label}, ${pct}% damage.${sysText} She's at ${hullText}.`,
        'warning', { location, applied, pct });
    } else {
      // Small-calibre hit: emit the raw event now, batch the radio call.
      damageEvents.emit({
        kind: 'hit', ship: this.owner, state: this, location, applied, pct,
        text: '', urgency: 'normal', speaker: this._speaker('hit'), minor: true,
      });
      this._minor.count++;
      this._minor.label = label;
      this._minor.sys.push(...hurt);
      const now = (typeof performance !== 'undefined' ? performance.now() : Date.now()) / 1000;
      if (!this._minor.due) this._minor.due = now + 2.2;
      if (now >= this._minor.due) this._flushMinor();
    }

    this._evaluateMissionKill();
    this._updateStatusTag();
    return { applied, location, fatal: this.lost, catastrophic: false };
  }

  /** Emit the batched "rounds on target" gunnery report and reset the batch. */
  _flushMinor() {
    const m = this._minor;
    if (!m.count) { m.due = 0; return; }
    const sys = [...new Set(m.sys)];
    const sysText = sys.length ? ` ${sys.map(prettySystem).join(' and ')} degraded.` : '';
    const n = m.count;
    this._report('hit',
      `${n} ${m.label} round${n === 1 ? '' : 's'} on target — ${this._name()} at ${Math.round(this.structurePct * 100)}% structural integrity.${sysText}`,
      'warning', { minorBatch: n });
    m.count = 0; m.sys.length = 0; m.due = 0;
  }

  _finishLoss() {
    if (this.lost) return;
    this.lost = true;
    this.missionKill = true;
    // Lost is lost — zero the structure so every `health <= 0` consumer (HUD hull
    // bar, damage vignette, the game-over check) agrees with the damage model,
    // including the case where it was the water and not the blast that won.
    this.structure = 0;
    this.fire = Math.max(this.fire, 0.4);
  }

  // -------------------------------------------------------------------------
  // Per-frame progression + damage control (recoverability)
  // -------------------------------------------------------------------------
  tick(dt) {
    if (this.lost || this._disposed) return;
    if (dt <= 0) return;

    // Flush any pending batched gunnery report once the shooting pauses.
    if (this._minor.due) {
      const now = (typeof performance !== 'undefined' ? performance.now() : Date.now()) / 1000;
      if (now >= this._minor.due) this._flushMinor();
    }

    const dc = this.dcQuality;
    // An actively-fought casualty is dramatically better contained than one the
    // duty section is just coping with. AI/passive crews still work it — real DC
    // organisations exist whether or not the CO is standing over them.
    const effort = this.dcActive ? 1 : 0.28;

    // --- fire: spreads if unfought, eats structure while it burns ------------
    if (this.fire > 0.005) {
      // Ongoing structural damage. Expressed as % of capacity/sec so a big hull
      // isn't disproportionately immune to (or destroyed by) the same fire.
      this.structure = Math.max(0, this.structure - this.fire * this.capacity * 0.018 * dt);
      // Fire spreads when nobody is winning: a fire on an undamaged firemain is
      // controllable, a fire on a ship already broken up is not.
      const spread = 0.055 * this.fire * (1.4 - dc) * (this.systems.propulsion < 0.4 ? 1.5 : 1);
      const suppress = 0.30 * dc * effort * (1 - this.dcFatigue * 0.4);
      this.fire = THREE.MathUtils.clamp(this.fire + (spread - suppress) * dt, 0, 1);
      // Fire also keeps knocking systems down as it works through the ship.
      if (this.fire > 0.4) {
        this.systems.fireControl = Math.max(0, this.systems.fireControl - 0.035 * this.fire * dt);
        this.systems.sensors = Math.max(0, this.systems.sensors - 0.025 * this.fire * dt);
      }
      if (this.fire <= 0.005) {
        this.fire = 0;
        if (this._fireReported) {
          this._fireReported = false;
          this._report('fireOut', `Fire is out aboard ${this._name()}. Reflash watch set.`, 'normal');
        }
      }
    }

    // --- flooding: breaches are slowed then stopped by shoring --------------
    // Flooding control depends less on someone personally standing there than
    // firefighting does (eductors and pumps run either way), so it uses its own
    // gentler effort curve rather than the fire party's.
    const floodEffort = this.dcActive ? 1.6 : 0.55;
    const floodControl = 0.020 * (0.35 + 0.65 * dc) * floodEffort;
    if (this.floodRate > 0.0001) {
      this.floodRate = Math.max(0, this.floodRate - floodControl * dt);
      this.flooding = THREE.MathUtils.clamp(this.flooding + this.floodRate * dt, 0, 1);
      // Counter-flooding / pumping slowly wins back a controlled casualty.
      if (this.floodRate <= 0.0002 && this.flooding > 0) {
        this.flooding = Math.max(0, this.flooding - 0.015 * dc * floodEffort * dt);
      }
    } else if (this.flooding > 0) {
      this.flooding = Math.max(0, this.flooding - 0.015 * dc * floodEffort * dt);
      if (this.flooding <= 0.02 && this._floodReported) {
        this._floodReported = false;
        this._report('repair', `Flooding is under control aboard ${this._name()}. Holding.`, 'normal');
      }
    }

    // Asymmetric flooding = list. Visible heel, read by the ship's renderer.
    this.list = this.listSign * this.flooding * 0.42;

    // --- damage control repairs: jury-rigged capability comes back ----------
    // Real crews restore partial capability at sea (Roberts steamed home on one
    // shaft). Capped below 100% so a hit permanently costs you something.
    if (this.fire < 0.15) {
      const repair = 0.028 * dc * effort * dt;
      const cap = 0.72 * this.structurePct + 0.1;
      let restored = null;
      for (const sys of SUBSYSTEMS) {
        if (this.systems[sys] < cap) {
          const before = this.systems[sys];
          this.systems[sys] = Math.min(cap, this.systems[sys] + repair);
          if (before < 0.25 && this.systems[sys] >= 0.25) restored = sys;
        }
      }
      if (restored) {
        this._report('repair', `${this._name()} reports ${prettySystem(restored)} back on line — partial capability restored.`, 'normal');
        if (this.missionKill && this.weaponsOnline && this.systems.propulsion > 0.35) {
          this.missionKill = false;
        }
      }
    }

    this.dcFatigue = THREE.MathUtils.clamp(
      this.dcFatigue + (this.dcActive ? 0.05 : -0.09) * dt, 0, 1
    );

    // --- loss conditions ----------------------------------------------------
    if (this.flooding >= 0.995) {
      this._report('sunk', `${this._name()} has lost the fight with the water — she's going down.`, 'critical');
      this._finishLoss();
    } else if (this.structure <= 0) {
      this._report('sunk', `${this._name()} is burning out of control and settling. She's lost.`, 'critical');
      this._finishLoss();
    }

    this._evaluateMissionKill();
    this._updateStatusTag();
  }

  /** Compact snapshot for HUD / contact readouts / debugging. */
  report() {
    return {
      name: this._name(),
      shipClass: this.classLabel,
      displacementT: this.displacementT,
      structurePct: Math.round(this.structurePct * 100),
      hits: this.hitCount,
      fire: Math.round(this.fire * 100),
      flooding: Math.round(this.flooding * 100),
      listDeg: Math.round(THREE.MathUtils.radToDeg(this.list)),
      speedFactor: Math.round(this.speedFactor * 100),
      sensorFactor: Math.round(this.sensorFactor * 100),
      weaponsOnline: this.weaponsOnline,
      missionKill: this.missionKill,
      lost: this.lost,
      status: this.statusTag || '[NOMINAL]',
      systems: Object.fromEntries(
        SUBSYSTEMS.map((s) => [s, Math.round(this.systems[s] * 100)])
      ),
      lastHit: this.lastHit
        ? { location: this.lastHit.location, damage: Math.round(this.lastHit.applied) }
        : null,
    };
  }

  /** 'nominal' | 'degraded' | 'offline' — matches the HUD's subsystem row. */
  static grade(v) {
    if (v > 0.7) return 'nominal';
    if (v > 0.3) return 'degraded';
    return 'offline';
  }

  /** HUD-shaped subsystem summary ({ engine, radar, weapons }). */
  hudSubsystems() {
    return {
      engine: DamageState.grade(this.systems.propulsion),
      radar: DamageState.grade(this.systems.sensors),
      weapons: DamageState.grade(Math.min(this.systems.fireControl, this.systems.weapons)),
    };
  }
}

function prettySystem(sys) {
  return {
    propulsion: 'propulsion',
    steering: 'steering',
    sensors: 'sensors',
    fireControl: 'fire control',
    weapons: 'weapons',
    aviation: 'aviation',
  }[sys] || sys;
}

/** Pick a sensible class for an entity that doesn't declare one. */
export function inferShipClass({ domain, iff, name = '', maxHealth = 0 }) {
  const d = String(domain || '').toUpperCase();
  if (d === 'AIR') return 'aircraft';
  if (d === 'SUBSURFACE') return 'submarine';
  if (String(iff).toUpperCase() === 'NEUTRAL') return 'merchant';
  if (/DDG|destroyer/i.test(name)) return 'destroyer';
  if (/corvette|patrol|FAC/i.test(name)) return 'corvette';
  if (maxHealth >= 250) return 'merchant';
  return 'frigate';
}

export { CLASS_SPECS, LOCATION_EFFECTS, SUBSYSTEMS };

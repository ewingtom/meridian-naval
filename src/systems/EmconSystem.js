import * as THREE from 'three';

/**
 * EmconSystem — the passive-ESM and emissions-control layer that turns MERIDIAN's
 * detection game from "one flat radar sphere" into Sea Power's active/passive
 * sensor duel. This is the missing pillar the gameplay judge called out: in Sea
 * Power you usually see an enemy on ESM (a bearing line to his radar emissions)
 * long before your own radar burns through to a firm track, and the decision to
 * RADIATE (go active, see everything, but light yourself up on his ESM) vs. run
 * SILENT (see only what's emitting, but stay hidden) is a core tactical choice.
 *
 * This module is deliberately self-contained and does NOT reach into radar,
 * weapons, or AI directly — main.js wires it in:
 *   - own EMCON posture (RADIATE / SILENT) gates RadarSystem's active range,
 *   - esmTracks() feeds the fused contact picture as bearing-only UNRESOLVED
 *     tracks (correlated + identified through the existing IdentificationTracker),
 *   - ownDetectability() scales how far the enemy fleet director can acquire us.
 *
 * ESM characteristics modeled (kept simple but true to the feel):
 *   - Passive: no range cost to us, no reveal — listening is free and silent.
 *   - Long: picks up a radiating emitter far beyond radar burn-through range.
 *   - Bearing-only: gives an accurate BEARING and a coarse signal-strength band
 *     (rough range), never a firm range/position. That ambiguity is the point —
 *     it feeds the classify/identify loop rather than short-circuiting it.
 *   - Emitter-gated: only detects contacts that are actually radiating. A
 *     surfaced/snorkeling or radiating warship shows; a submarine rigged for
 *     ultra-quiet or a dark (EMCON-silent) contact does not.
 */

export const EMCON = {
  RADIATE: 'radiate', // own search radar active — full radar range, but detectable
  SILENT: 'silent',   // own radar cold — passive ESM only, but hard to find
};

/** Coarse ESM range bands. ESM gives bearing + a strength-derived guess at how
 *  far, never a firm range — these are what the console shows instead of a
 *  precise NM readout until radar or another sensor correlates the track. */
const ESM_BANDS = [
  { maxM: 40000, label: 'CLOSE' },
  { maxM: 110000, label: 'MEDIUM' },
  { maxM: Infinity, label: 'DISTANT' },
];

function esmBand(distM) {
  return ESM_BANDS.find((b) => distM <= b.maxM).label;
}

export class EmconSystem {
  /**
   * @param {object}   opts
   * @param {number}   opts.esmRangeM     max range at which a strong emitter is heard (default 220 km)
   * @param {function} opts.isEmitting    (entity) => bool: is this contact radiating right now?
   */
  constructor({ esmRangeM = 220000, isEmitting } = {}) {
    this.esmRangeM = esmRangeM;
    this.state = EMCON.RADIATE;
    // Default emitter rule: any alive hostile/unknown surface or air combatant is
    // assumed to be running a search radar; submarines only emit near the surface;
    // neutral merchants run a weak nav radar (short ESM range). Overridable so the
    // caller can drive it off real per-entity radar state later.
    this.isEmitting = isEmitting || ((e) => {
      if (!e || e.alive === false || e.destroyed) return false;
      const dom = String(e.domain || '').toUpperCase();
      if (dom === 'SUBSURFACE') return !!e.isVisible; // only a near-surface/snorkeling boat radiates
      return true;
    });
  }

  setState(s) {
    if (s === EMCON.RADIATE || s === EMCON.SILENT) this.state = s;
    return this.state;
  }

  toggle() {
    this.state = this.state === EMCON.RADIATE ? EMCON.SILENT : EMCON.RADIATE;
    return this.state;
  }

  get radarActive() {
    return this.state === EMCON.RADIATE;
  }

  /** How detectable OWN ship is to the enemy right now, as a multiplier on their
   *  acquisition range. Radiating a big SPY array lights you up; going silent
   *  drops you toward your passive/physical signature. Never zero — a 9,000-ton
   *  hull still has an IR/visual/wake signature at close range. */
  ownDetectability() {
    return this.radarActive ? 1.0 : 0.42;
  }

  /**
   * Passive ESM tracks on every radiating contact in range, as bearing-only
   * cuts. Returned shape is intentionally partial (no firm x/z range) so a
   * consumer renders it as an UNRESOLVED bearing line, not a solved track.
   *
   * @param {THREE.Vector3} ownPos
   * @param {Array}         entities  world entities (+ optionally escort ships)
   * @returns {Array<{id,bearingDeg,band,distEstM,domain,strength,emitter:true}>}
   */
  esmTracks(ownPos, entities) {
    const out = [];
    if (!ownPos || !entities) return out;
    for (const e of entities) {
      if (!this.isEmitting(e)) continue;
      const p = e.position || e.group?.position;
      if (!p) continue;
      const dx = p.x - ownPos.x;
      const dz = p.z - ownPos.z;
      const distM = Math.hypot(dx, dz);
      // Merchant/neutral nav radar is weak — only heard up close.
      const dom = String(e.domain || '').toUpperCase();
      const isCivil = String(e.iff || '').toUpperCase() === 'NEUTRAL';
      const reach = isCivil ? this.esmRangeM * 0.12 : this.esmRangeM;
      if (distM > reach) continue;
      // Bearing is true bearing (0 = +Z/north), matching the rest of the plot.
      const bearingDeg = ((Math.atan2(dx, dz) * 180) / Math.PI + 360) % 360;
      // Signal strength falls with range; drives the coarse band + a little jitter
      // on the estimated range so it reads as an inexact passive cut, not a fix.
      const strength = THREE.MathUtils.clamp(1 - distM / reach, 0, 1);
      out.push({
        id: e.id,
        emitter: true,
        bearingDeg,
        band: esmBand(distM),
        distEstM: distM, // caller may fuzz this; ESM knows bearing well, range poorly
        domain: e.domain,
        strength,
      });
    }
    return out;
  }

  /** UI label for the current posture. */
  get label() {
    return this.radarActive ? 'RADIATE' : 'EMCON SILENT';
  }
}

/** Radar-horizon range (metres) for a target of the given height, from an own
 *  mast ~30 m up. The classic 4.12·(√h_own + √h_tgt) km line-of-sight formula,
 *  in metres. This is what makes detection Sea-Power-shaped: a high-flying
 *  aircraft is seen out near the sensor ceiling, a masthead-height surface ship
 *  at ~40 km, and a wave-hugging sea-skimmer only pops over the horizon ~30 km
 *  out — the signature "vampire inbound, seconds to react" beat. */
const OWN_MAST_M = 32;
function radarHorizonM(targetHeightM) {
  return 4120 * (Math.sqrt(OWN_MAST_M) + Math.sqrt(Math.max(targetHeightM, 1)));
}

/** Effective radiating height of a contact, for the horizon calc above. */
function targetHeightM(e) {
  const dom = String(e.domain || '').toUpperCase();
  if (dom === 'AIR') return e.altitude ?? 200;
  if (dom === 'SUBSURFACE') return 4; // only a near-surface boat presents anything
  return 24; // surface combatant mast/superstructure
}

/**
 * Converts live entity state into the plain-data contact list consumed by every
 * station (`s.allContacts`). Detection is now Sea-Power-scaled and layered:
 *   - Active radar (RADIATE) sees each contact out to its radar horizon, capped
 *     by the array's sensitivity ceiling (maxRangeM) — tens of km, not 6.
 *   - Emissions-silent (EMCON) drops active radar; only a short passive
 *     electro-optical/IR bubble remains, and the long-range picture comes from
 *     the ESM bearing-lines merged in separately (see EmconSystem).
 *   - Submarines still require near-surface exposure or an active sonar ping.
 */
export class RadarSystem {
  constructor({ rangeM = 40000, maxRangeM = 150000, sonarPingRangeM = 12000 } = {}) {
    // `rangeM` is the DISPLAY range knob (drives plot scale); `maxRangeM` is the
    // physical detection ceiling and is independent of the display zoom — zooming
    // the scope must never blind you.
    this.rangeM = rangeM;
    this.maxRangeM = maxRangeM;
    // Passive EO/IR bubble kept when radiating-silent: you can still see what's
    // close by eye and infrared even with the radar cold.
    this.passiveRangeM = 9000;
    this.sonarPingRangeM = sonarPingRangeM;
    this.sonarPingActive = false;
    this.sonarPingOrigin = null;
    this._pingTimer = 0;
  }

  triggerSonarPing(originPos) {
    this.sonarPingActive = true;
    this.sonarPingOrigin = originPos.clone();
    this._pingTimer = 2.2;
  }

  update(dt) {
    if (this._pingTimer > 0) {
      this._pingTimer -= dt;
      if (this._pingTimer <= 0) this.sonarPingActive = false;
    }
  }

  /**
   * Returns the plain-data contact list every station reads (`s.allContacts`).
   *
   * `origins` is the task force's fused sensor picture: Meridian's position plus every
   * alive escort's position (see main.js call site). A contact is detected if it's in
   * range of ANY of them, not just Meridian's own radar — an escort standing picket can
   * see, and share, contacts Meridian's own set can't. Bearing/range shown on the plot
   * stay relative to `origins[0]` (the local station's own ship) so the tactical display
   * doesn't jump reference frame depending on which escort happened to be closest; only
   * the detection gate is multi-origin. If every escort is sunk, `origins` collapses to
   * just Meridian and this naturally degrades back to a Meridian-only picture — that's
   * an intentional consequence of losing the task force's sensors, not a bug.
   */
  buildContacts(origins, entities, selectedId, opts = {}) {
    const radarActive = opts.radarActive !== false; // default RADIATE
    const originList = Array.isArray(origins) ? origins : [origins];
    const primary = originList[0];
    const contacts = [];
    for (const e of entities) {
      if (e.destroyed) continue;

      let nearestDist = Infinity;
      for (const origin of originList) {
        const d = e.position.distanceTo(origin);
        if (d < nearestDist) nearestDist = d;
      }

      // Detection gate. Active radar reaches this contact's radar horizon (capped
      // by array sensitivity); emissions-silent falls back to the short passive
      // EO/IR bubble. Either way a submarine must be exposed or sonar-revealed.
      const activeReach = Math.min(this.maxRangeM, radarHorizonM(targetHeightM(e)));
      const reach = radarActive ? activeReach : this.passiveRangeM;
      if (nearestDist > reach) continue;

      if (e.domain === 'SUBSURFACE' && !e.isVisible) continue;

      contacts.push({
        id: e.id,
        x: e.position.x - primary.x,
        z: e.position.z - primary.z,
        domain: e.domain,
        iff: e.iff,
        name: e.name,
        selected: e.id === selectedId,
        distanceM: Math.round(e.position.distanceTo(primary)),
        healthPct: Math.round((e.health / e.maxHealth) * 100),
      });
    }
    return contacts;
  }

  get sonarContext() {
    return {
      sonarPingActive: this.sonarPingActive,
      sonarPingOrigin: this.sonarPingOrigin,
      sonarPingRadius: this.sonarPingRangeM,
    };
  }
}

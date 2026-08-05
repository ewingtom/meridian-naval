/**
 * Converts live entity state into the plain-data contact list consumed by the
 * TacticalRadar UI. Handles domain-specific detection rules: surface/air contacts
 * are visible within radar range; submarines are hidden unless near-surface or
 * actively revealed by a sonar ping.
 */
export class RadarSystem {
  constructor({ rangeM = 6000, sonarPingRangeM = 2400 } = {}) {
    this.rangeM = rangeM;
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
  buildContacts(origins, entities, selectedId) {
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
      if (nearestDist > this.rangeM) continue;

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

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

  /** Returns { contacts, sonarContext } — sonarContext is fed to entity.update(). */
  buildContacts(playerPos, entities, selectedId) {
    const contacts = [];
    for (const e of entities) {
      if (e.destroyed) continue;
      const dist = e.position.distanceTo(playerPos);
      if (dist > this.rangeM) continue;

      if (e.domain === 'SUBSURFACE' && !e.isVisible) continue;

      contacts.push({
        id: e.id,
        x: e.position.x - playerPos.x,
        z: e.position.z - playerPos.z,
        domain: e.domain,
        iff: e.iff,
        name: e.name,
        selected: e.id === selectedId,
        distanceM: Math.round(dist),
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

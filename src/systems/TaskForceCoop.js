import * as THREE from 'three';

/**
 * Task-force cooperation layer — player ↔ escort AI (and MP radio stubs).
 * Makes cooperation required for some DynamicOps beats, but one-key / one-click easy.
 *
 * Orders the player can issue:
 *   SHARE     — push current track to the force (shared designation)
 *   ENGAGE    — weapons free on shared/selected track (escorts break to prosecute)
 *   HOLD      — check fire / weapons hold
 *   PING      — request an escort active-sonar sweep
 *   SCREEN    — escorts return to formation screen
 *   AFFIRM    — acknowledge current higher-command order
 */
export class TaskForceCoop {
  constructor({
    ships,
    autopilots,
    world,
    radar,
    onComms,
    getSelectedTargetId,
    setSelectedTargetId,
    getLocalShip,
    onSharedTrack,
  } = {}) {
    this.ships = ships;
    this.autopilots = autopilots;
    this.world = world;
    this.radar = radar;
    this.onComms = onComms || (() => {});
    this.getSelectedTargetId = getSelectedTargetId || (() => null);
    this.setSelectedTargetId = setSelectedTargetId || (() => {});
    this.getLocalShip = getLocalShip || (() => ships?.player);
    this.onSharedTrack = onSharedTrack || (() => {});

    this.sharedTargetId = null;
    this.weaponsPolicy = 'hold'; // 'hold' | 'free'
    this.lastPingAt = -999;
    this.lastOrderAt = -999;
    this._affirmNeeded = false;
    this._satisfied = new Set();
    this.pendingHint = null;
  }

  /** DynamicOps can mark that the current beat needs a player affirm / share / engage. */
  require(kind, detail = {}) {
    this.pendingHint = { kind, ...detail, at: performance.now() };
    if (kind === 'affirm') this._affirmNeeded = true;
    this._satisfied.delete(kind);
  }

  clearHint() {
    this.pendingHint = null;
    this._affirmNeeded = false;
  }

  isSatisfied(kind) {
    if (!kind) return true;
    return this._satisfied.has(kind);
  }

  _mark(kind) {
    this._satisfied.add(kind);
    if (this.pendingHint?.kind === kind) this.clearHint();
  }

  get status() {
    const target = this._resolveTarget(this.sharedTargetId);
    return {
      sharedTargetId: this.sharedTargetId,
      sharedName: target?.name || null,
      weaponsPolicy: this.weaponsPolicy,
      pendingHint: this.pendingHint,
      affirmNeeded: this._affirmNeeded,
    };
  }

  shareTrack(explicitId = null) {
    const id = explicitId || this.getSelectedTargetId();
    if (!id || String(id).startsWith('nav:') || String(id).startsWith('inbound:')) {
      this.onComms({
        speaker: 'CIC',
        text: 'No valid track selected — Tab a contact on the plot, then share.',
        urgency: 'normal',
      });
      return false;
    }
    const ent = this._resolveTarget(id);
    if (!ent) {
      this.onComms({ speaker: 'CIC', text: 'Track lost — cannot share.', urgency: 'warning' });
      return false;
    }
    this.sharedTargetId = id;
    this.onSharedTrack(id);
    const local = this.getLocalShip();
    const call = shortCall(local);
    const domain = String(ent.domain || '').toUpperCase();
    const tip = domain === 'SUBSURFACE'
      ? 'Weapons — select ASROC (3) before release.'
      : domain === 'AIR'
        ? 'Weapons — missiles preferred on air tracks.'
        : 'Stand by for weapons release.';
    this.onComms({
      speaker: `${call} CIC`,
      text: `All units — track shared: ${ent.name || id}, ${(ent.domain || '').toLowerCase()}. ${tip}`,
      urgency: 'warning',
    });
    // Escorts acknowledge
    this._escortAck(`Track ${ent.name || id} copied. Holding for weapons release.`);
    this._mark('share');
    return true;
  }

  engageShared() {
    const id = this.sharedTargetId || this.getSelectedTargetId();
    if (!id) {
      this.onComms({
        speaker: 'WEAPONS NET',
        text: 'No designation — share a track first (C), then release weapons (V).',
        urgency: 'warning',
      });
      return false;
    }
    if (!this.sharedTargetId) this.shareTrack(id);
    this.weaponsPolicy = 'free';
    const ent = this._resolveTarget(this.sharedTargetId);
    for (const ap of Object.values(this.autopilots || {})) {
      if (!ap || ap.ship === this.getLocalShip()) continue;
      ap.setEngageTarget(this.sharedTargetId);
      ap.weaponsEnabled = true;
      ap.breakFormation = true;
    }
    this.onComms({
      speaker: `${shortCall(this.getLocalShip())} WEAPONS`,
      text: `Weapons free on ${ent?.name || 'designated track'}. Escorts, prosecute.`,
      urgency: 'critical',
    });
    this._escortAck(`Wilco — engaging ${ent?.name || 'track'}.`);
    this._mark('engage');
    this._mark('share');
    return true;
  }

  weaponsHold() {
    this.weaponsPolicy = 'hold';
    for (const ap of Object.values(this.autopilots || {})) {
      if (!ap || ap.ship === this.getLocalShip()) continue;
      ap.setEngageTarget(null);
      ap.breakFormation = false;
    }
    this.onComms({
      speaker: `${shortCall(this.getLocalShip())} WEAPONS`,
      text: 'Check fire — all units weapons hold. Return to screen.',
      urgency: 'warning',
    });
    this._escortAck('Weapons hold, resuming station.');
    this._mark('hold');
    return true;
  }

  requestEscortPing() {
    const now = performance.now() / 1000;
    if (now - this.lastPingAt < 8) {
      this.onComms({ speaker: 'SONAR NET', text: 'Ping already in cycle — stand by.', urgency: 'normal' });
      return false;
    }
    this.lastPingAt = now;
    const escorts = Object.values(this.ships || {}).filter((s) => s && s !== this.getLocalShip() && s.alive !== false);
    const escort = escorts[0] || this.ships?.escort1;
    if (!escort) return false;
    const origin = escort.group.position.clone();
    this.radar?.triggerSonarPing(origin);
    this.onComms({
      speaker: `${shortCall(escort)} SONAR (AI)`,
      text: 'Active search — going loud. Stand by for subsurface contacts.',
      urgency: 'warning',
    });
    this._mark('ping');
    return true;
  }

  returnToScreen() {
    for (const ap of Object.values(this.autopilots || {})) {
      if (!ap || ap.ship === this.getLocalShip()) continue;
      ap.breakFormation = false;
      ap.setEngageTarget(this.weaponsPolicy === 'free' ? this.sharedTargetId : null);
    }
    this.onComms({
      speaker: `${shortCall(this.getLocalShip())} HELM`,
      text: 'Screen units, resume formation stations.',
      urgency: 'normal',
    });
    this._escortAck('On station.');
    this._mark('screen');
    return true;
  }

  affirm() {
    this.onComms({
      speaker: shortCall(this.getLocalShip()),
      text: this._affirmNeeded || this.pendingHint?.kind === 'affirm'
        ? 'MERIDIAN copies tasking. Wilco.'
        : 'Aye — standing by.',
      urgency: 'normal',
    });
    this._mark('affirm');
    return true;
  }

  /** Autopilot weapons filter — when policy is hold, escorts only shoot if explicitly tasked. */
  allowedHostileIds() {
    if (this.weaponsPolicy === 'free' && this.sharedTargetId) return new Set([this.sharedTargetId]);
    if (this.weaponsPolicy === 'free') return null; // any hostile
    return new Set(); // hold — empty set means fire none unless engage target set on AP
  }

  _resolveTarget(id) {
    if (!id) return null;
    return this.world?.entities?.find((e) => e.id === id && !e.destroyed)
      || Object.values(this.ships || {}).find((s) => s?.id === id || s?.shipId === id)
      || null;
  }

  _escortAck(text) {
    const escorts = ['SENTINEL', 'VANGUARD'];
    const who = escorts[Math.floor(Math.random() * escorts.length)];
    // slight delay feel via immediate second line is fine for UI
    setTimeout(() => {
      this.onComms({ speaker: `${who} (AI)`, text, urgency: 'normal' });
    }, 450 + Math.random() * 400);
  }
}

function shortCall(ship) {
  if (!ship) return 'MERIDIAN';
  const n = ship.name || ship.shipId || 'MERIDIAN';
  const parts = n.split(' ');
  return parts[1] || parts[0] || 'MERIDIAN';
}

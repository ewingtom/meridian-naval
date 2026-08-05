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
    getKnownIff,
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
    // The player's CURRENT KNOWLEDGE of a track's affiliation (see
    // IdentificationTracker.js) — separate from its ground-truth `iff`. Only
    // consulted by isClearedToEngage()/allowedHostileIds() below, for the
    // WEAPONS TIGHT gate. Defaults to "always resolved hostile" so a caller
    // that doesn't wire this up (e.g. a unit test) gets the pre-existing
    // behavior rather than a silent everything-blocked regression.
    this.getKnownIff = getKnownIff || (() => 'HOSTILE');

    this.sharedTargetId = null;
    this.weaponsPolicy = 'hold'; // 'hold' | 'tight' | 'free' — NATO weapons-control states
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
        ? 'Weapons — missiles or gun on air tracks; release when ready.'
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

  /** WEAPONS TIGHT — the middle NATO weapons-control state, between free (engage any
   * qualifying target) and hold (engage nothing but self-defense): units may only
   * engage the currently designated/shared track, never any hostile a sensor happens
   * to pick up. Functionally close to `engageShared()` but doesn't force a track to be
   * shared first and doesn't imply "prosecute now" — it's a standing posture: "if
   * something's designated, you may fire on it; if nothing is, hold." */
  weaponsTight() {
    this.weaponsPolicy = 'tight';
    // Closing a known gap: TIGHT used to hand escorts the shared track the moment
    // it was designated, with no check that it had actually been identified —
    // which defeated the entire point of the state (see isClearedToEngage's doc
    // comment). A designated-but-unresolved track now drives no engagement at all
    // until the TAO console actually clears it.
    const cleared = this.isClearedToEngage(this.sharedTargetId);
    for (const ap of Object.values(this.autopilots || {})) {
      if (!ap || ap.ship === this.getLocalShip()) continue;
      ap.setEngageTarget(cleared ? this.sharedTargetId : null);
      ap.breakFormation = false;
    }
    const ent = this._resolveTarget(this.sharedTargetId);
    let text;
    if (!this.sharedTargetId) text = 'Weapons tight — hold fire pending designation.';
    else if (!cleared) text = `Weapons tight — ${ent?.name || 'designated track'} not yet positively identified. Interrogate IFF before engagement.`;
    else text = `Weapons tight — cleared to engage ${ent?.name || 'designated track'} only.`;
    this.onComms({
      speaker: `${shortCall(this.getLocalShip())} WEAPONS`,
      text,
      urgency: 'warning',
    });
    this._escortAck('Weapons tight, copy.');
    this._mark('tight');
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

  /** WEAPONS TIGHT's actual doctrinal point: the designated track is only
   *  cleared to engage once it's been POSITIVELY IDENTIFIED — a shared/
   *  designated-but-unresolved contact is not "cleared," it's just "known
   *  about." FREE bypasses this (an operator choosing FREE has already
   *  accepted "any qualifying target"); HOLD blocks everything regardless of
   *  ID status. This was a known gap (see the old comment on allowedHostileIds
   *  below, now fixed) — it existed because there was no separate "player
   *  knowledge" state to check against; see IdentificationTracker.js. */
  isClearedToEngage(id) {
    if (!id) return false;
    if (this.weaponsPolicy === 'hold') return false;
    if (this.weaponsPolicy === 'free') return true;
    return String(this.getKnownIff(id)).toUpperCase() === 'HOSTILE';
  }

  /** Autopilot weapons filter:
   *  FREE  — any qualifying hostile, or just the shared track if one's designated.
   *  TIGHT — only the designated/shared track, AND only once it's cleared per
   *          isClearedToEngage() above — never "any hostile" even if one's in
   *          range, and never an undesignated-or-unresolved track either.
   *  HOLD  — nothing, unless an AP has its own explicit engage target set. */
  allowedHostileIds() {
    if (this.weaponsPolicy === 'free' && this.sharedTargetId) return new Set([this.sharedTargetId]);
    if (this.weaponsPolicy === 'free') return null; // any hostile
    if (this.weaponsPolicy === 'tight') {
      return this.sharedTargetId && this.isClearedToEngage(this.sharedTargetId)
        ? new Set([this.sharedTargetId])
        : new Set();
    }
    return new Set(); // hold
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

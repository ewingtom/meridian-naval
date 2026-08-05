import * as THREE from 'three';

/**
 * Per-ship tactical brain — perception, objectives, and doctrine decisions that
 * drive helm/weapons for AI-crewed hulls (and inform radio callouts).
 *
 * Anchored to modern surface-action-group realities:
 *  - Missiles first (ASM / SAM), guns as a close-in finisher
 *  - Layered AAW: SAM at range, CIWS is automatic elsewhere
 *  - Roles: SCREEN (formation/AAW picket), PROSECUTE (close shared track),
 *    DEFEND (cover damaged lead), ASW (hunt subs), TRANSIT (waypoint)
 *
 * The brain does not fire weapons or steer — ShipAutopilot consumes its
 * `decision` each tick. That keeps one place for "what should we do" and one
 * for "how do we actuate the ship."
 */

export const Role = {
  LEAD: 'LEAD',
  SCREEN: 'SCREEN',
  PROSECUTE: 'PROSECUTE',
  DEFEND: 'DEFEND',
  ASW: 'ASW',
  TRANSIT: 'TRANSIT',
};

export const Objective = {
  HOLD_STATION: 'HOLD_STATION',
  CLOSE_CONTACT: 'CLOSE_CONTACT',
  COVER_LEAD: 'COVER_LEAD',
  HUNT_SUB: 'HUNT_SUB',
  TRANSIT_WP: 'TRANSIT_WP',
  SELF_PRESERVE: 'SELF_PRESERVE',
};

/** Engagement envelope (metres) — missile-heavy, gun as last resort. Exported so
 *  the AEGIS console can draw a non-fabricated engagement-envelope reference
 *  ring for a hooked track, using the same doctrine numbers the AI itself
 *  fires by, rather than inventing a display-only figure. */
export const ENVELOPE = {
  asmMin: 900,
  asmMax: 5200,
  samMax: 9000,
  gunMax: 1800,
  torpedoMax: 2800,
  screenRadius: 3600,
};

function distFlat(a, b) {
  const dx = a.x - b.x;
  const dz = a.z - b.z;
  return Math.hypot(dx, dz);
}

function domainOf(e) {
  return String(e?.domain || '').toUpperCase();
}

export class ShipBrain {
  constructor(ship, { role = Role.SCREEN } = {}) {
    this.ship = ship;
    this.baseRole = role; // SCREEN escort or LEAD
    this.role = role;
    this.objective = Objective.HOLD_STATION;
    this.perception = {
      threats: [],
      primary: null,
      airThreats: [],
      subThreats: [],
      surfaceThreats: [],
      inboundBearing: null,
      allies: [],
      leadHull: null,
      leadHurt: false,
    };
    this.decision = {
      helmMode: 'station', // station | close | cover | transit | hold
      engageId: null,
      munition: null,
      fire: false,
      desiredRange: 2200,
      chatter: null,
    };
    this._lastChatter = '';
    this._chatterCool = 0;
    this._salvoSide = Math.random() < 0.5 ? 1 : -1;
  }

  /**
   * Build a threat picture from the shared world snapshot.
   * @param {object} ctx
   *   hostiles, ships (crewed), inbound (optional projectile threats),
   *   sharedTargetId, weaponsPolicy, waypoint, playerShip
   */
  perceive(ctx) {
    const self = this.ship.group.position;
    const hostiles = (ctx.hostiles || []).filter((h) => h.alive && !h.destroyed);
    const threats = [];
    for (const h of hostiles) {
      const d = distFlat(h.position || h.group?.position || self, self);
      const dom = domainOf(h);
      const score = this._threatScore(h, d, dom, ctx);
      threats.push({ entity: h, dist: d, domain: dom, score });
    }
    threats.sort((a, b) => b.score - a.score);

    const airThreats = threats.filter((t) => t.domain === 'AIR');
    const subThreats = threats.filter((t) => t.domain === 'SUBSURFACE');
    const surfaceThreats = threats.filter((t) => t.domain === 'SURFACE');

    let primary = null;
    if (ctx.sharedTargetId) {
      primary = threats.find((t) => t.entity.id === ctx.sharedTargetId) || null;
    }
    if (!primary && ctx.weaponsPolicy !== 'hold') {
      primary = threats[0] || null;
    }

    const lead = ctx.playerShip || ctx.ships?.player || null;
    const leadHurt = !!(lead?.damage && (lead.damage.fire > 0.15 || lead.damage.structurePct < 0.72 || lead.damage.missionKill));

    this.perception = {
      threats,
      primary,
      airThreats,
      subThreats,
      surfaceThreats,
      inboundBearing: ctx.inboundBearing ?? null,
      allies: (ctx.allies || []).filter((s) => s !== this.ship && s.alive !== false),
      leadHull: lead,
      leadHurt,
    };
  }

  _threatScore(h, d, dom, ctx) {
    // Closer = hotter; air and inbound ASM pressure outrank distant surface.
    let s = Math.max(0, 6000 - d);
    if (dom === 'AIR') s *= 1.55;
    if (dom === 'SUBSURFACE') s *= 1.35;
    if (dom === 'SURFACE') s *= 1.0;
    if (ctx.sharedTargetId && h.id === ctx.sharedTargetId) s *= 2.4;
    if (h.iff === 'HOSTILE' || h.iff === 'hostile') s *= 1.2;
    // Prefer targets already damaged — finish the cripple.
    if (h.damage?.missionKill) s *= 1.3;
    else if (h.damage && h.damage.structurePct < 0.5) s *= 1.15;
    return s;
  }

  /** Pick role + objective from perception and force policy. */
  decide(dt, ctx) {
    this._chatterCool = Math.max(0, this._chatterCool - dt);
    const p = this.perception;
    const dmg = this.ship.damage;
    const selfPreserve = dmg && (dmg.fire > 0.55 || dmg.flooding > 0.45 || dmg.missionKill);

    if (selfPreserve) {
      this.role = Role.DEFEND;
      this.objective = Objective.SELF_PRESERVE;
    } else if (p.leadHurt && this.baseRole === Role.SCREEN) {
      this.role = Role.DEFEND;
      this.objective = Objective.COVER_LEAD;
    } else if (p.subThreats.length && (!p.airThreats.length || p.subThreats[0].dist < 2200)) {
      this.role = Role.ASW;
      this.objective = Objective.HUNT_SUB;
    } else if (ctx.weaponsPolicy === 'free' && p.primary && p.primary.domain !== 'SUBSURFACE') {
      this.role = Role.PROSECUTE;
      this.objective = Objective.CLOSE_CONTACT;
    } else if (this.baseRole === Role.LEAD) {
      this.role = Role.LEAD;
      this.objective = Objective.TRANSIT_WP;
    } else {
      this.role = Role.SCREEN;
      this.objective = Objective.HOLD_STATION;
    }

    const decision = {
      helmMode: 'station',
      engageId: null,
      munition: null,
      fire: false,
      desiredRange: 2400,
      aim: null,
      chatter: null,
    };

    if (this.objective === Objective.SELF_PRESERVE) {
      decision.helmMode = 'hold';
      decision.chatter = this._maybeChatter('DC', 'Taking damage — reducing way, fighting the ship.');
    } else if (this.objective === Objective.COVER_LEAD) {
      decision.helmMode = 'cover';
      decision.chatter = this._maybeChatter('SCREEN', 'Lead is hurt — closing to cover.');
      // Still shoot air threats while covering.
      const air = p.airThreats[0];
      if (air && air.dist < ENVELOPE.samMax) {
        decision.fire = true;
        decision.engageId = air.entity.id;
        decision.munition = 'playerSam';
        decision.aim = air.entity;
      }
    } else if (this.objective === Objective.HUNT_SUB) {
      const sub = p.subThreats[0];
      decision.helmMode = 'close';
      decision.desiredRange = 900;
      if (sub) {
        decision.engageId = sub.entity.id;
        decision.aim = sub.entity;
        if (sub.dist < ENVELOPE.torpedoMax) {
          decision.fire = true;
          decision.munition = 'playerTorpedo';
        }
        decision.chatter = this._maybeChatter('ASW', `Sub contact at ${Math.round(sub.dist)} m — ASROC ready.`);
      }
    } else if (this.objective === Objective.CLOSE_CONTACT && p.primary) {
      decision.helmMode = 'close';
      decision.engageId = p.primary.entity.id;
      decision.aim = p.primary.entity;
      decision.desiredRange = p.primary.domain === 'AIR' ? 3500 : 2200;
      Object.assign(decision, this._pickMunition(p.primary));
    } else if (this.objective === Objective.TRANSIT_WP) {
      decision.helmMode = 'transit';
      // Lead still defends herself if painted.
      const air = p.airThreats[0];
      const surf = p.surfaceThreats[0];
      if (ctx.weaponsPolicy === 'free' && air && air.dist < ENVELOPE.samMax) {
        Object.assign(decision, this._pickMunition(air));
        decision.engageId = air.entity.id;
        decision.aim = air.entity;
      } else if (ctx.weaponsPolicy === 'free' && surf && surf.dist < ENVELOPE.asmMax) {
        Object.assign(decision, this._pickMunition(surf));
        decision.engageId = surf.entity.id;
        decision.aim = surf.entity;
      }
    } else {
      // SCREEN — hold station, prefer AAW, secondarily ASM on shared track only.
      decision.helmMode = 'station';
      if (p.airThreats[0] && p.airThreats[0].dist < ENVELOPE.samMax && ctx.weaponsPolicy === 'free') {
        Object.assign(decision, this._pickMunition(p.airThreats[0]));
        decision.engageId = p.airThreats[0].entity.id;
        decision.aim = p.airThreats[0].entity;
        decision.chatter = this._maybeChatter('AAW', 'Air track inbound — SAM away.');
      } else if (ctx.sharedTargetId && p.primary) {
        Object.assign(decision, this._pickMunition(p.primary));
        decision.engageId = p.primary.entity.id;
        decision.aim = p.primary.entity;
      }
    }

    this.decision = decision;
    return decision;
  }

  /**
   * Missile-centric doctrine:
   *  AIR → SAM (never ASM)
   *  SURFACE beyond gun range → ASM; inside gun range → shell as finisher
   *  SUB → torpedo/ASROC
   */
  _pickMunition(threat) {
    const out = { fire: false, munition: null, desiredRange: 2200 };
    if (!threat) return out;
    const { domain, dist } = threat;
    if (domain === 'AIR') {
      if (dist <= ENVELOPE.samMax) {
        out.fire = true;
        out.munition = 'playerSam';
        out.desiredRange = 4000;
      }
    } else if (domain === 'SUBSURFACE') {
      if (dist <= ENVELOPE.torpedoMax) {
        out.fire = true;
        out.munition = 'playerTorpedo';
        out.desiredRange = 1000;
      }
    } else if (domain === 'SURFACE') {
      if (dist >= ENVELOPE.asmMin && dist <= ENVELOPE.asmMax) {
        out.fire = true;
        out.munition = 'playerMissile';
        out.desiredRange = 2400;
      } else if (dist < ENVELOPE.gunMax) {
        // Finisher only — modern doctrine still has a deck gun for the cripple.
        out.fire = true;
        out.munition = 'playerShell';
        out.desiredRange = 1200;
      } else if (dist < ENVELOPE.asmMin) {
        // Inside min ASM but outside preferred gun — still prefer ASM if magazine allows,
        // else gun. Autopilot ammo check happens at fire time.
        out.fire = true;
        out.munition = 'playerMissile';
        out.desiredRange = 1600;
      }
    }
    return out;
  }

  _maybeChatter(tag, text) {
    if (this._chatterCool > 0) return null;
    const key = `${tag}:${text}`;
    if (key === this._lastChatter) return null;
    this._lastChatter = key;
    this._chatterCool = 14 + Math.random() * 10;
    return { tag, text };
  }

  /** Offset for screen geometry — stagger escorts so they don't stack. */
  screenOffset(baseOffset) {
    if (!baseOffset) return null;
    const o = baseOffset.clone();
    o.x += this._salvoSide * 40;
    return o;
  }
}

import * as THREE from 'three';

/**
 * Living-world director. Spawns concurrent surface/sub/air/merchant traffic, issues
 * higher-command orders, and synthesizes AI-manned station chatter that creates
 * actionable player tasks — all anchored to real entity state (bearings, domains).
 */
// Slowed down per direct player feedback: the scripted MissionSystem beats and this
// living-world director both spawn hostiles independently, with no coordination
// between them, so tight cooldowns meant they'd sometimes land close together and
// dump multiple contacts on the player at once. Longer, wider cooldowns (plus a much
// longer quiet opening window in start(), and lower spawn odds in
// _maintainPopulation below) give the player room to handle one thing before the
// next shows up.
// Tuned for a living battlespace: frequent enough that escorts, orders, and
 // station chatter keep the player reacting — without stacking three waves at once.
const ORDER_COOLDOWN = [55, 95];
const CHATTER_COOLDOWN = [18, 32];
const POP_CHECK_COOLDOWN = [45, 70];

function randRange([a, b]) {
  return a + Math.random() * (b - a);
}

function bearingTo(from, to) {
  const dx = to.x - from.x;
  const dz = to.z - from.z;
  return ((THREE.MathUtils.radToDeg(Math.atan2(dx, dz)) % 360) + 360) % 360;
}

function padBrg(deg) {
  return String(Math.round(((deg % 360) + 360) % 360)).padStart(3, '0');
}

export class DynamicOps {
  constructor({ world, ships, mission, onComms, onObjectiveHint, isHost = () => true, coop = null }) {
    this.world = world;
    this.ships = ships;
    this.mission = mission;
    this.onComms = onComms || (() => {});
    this.onObjectiveHint = onObjectiveHint || (() => {});
    this.isHost = isHost;
    this.coop = coop;

    this._orderAt = 12;
    this._chatterAt = 6;
    this._popAt = 20;
    this._spawnBudget = 0;
    this._activeOrder = null;
    this._orderTimer = 0;
    this._waveSerial = 0;
    this.started = false;
  }

  start() {
    this.started = true;
    // Longer quiet opening window — the player just got underway and is still
    // learning the stations/controls; the first DynamicOps-driven contact/order
    // shouldn't land on top of the scripted mission's own first encounter.
    this._orderAt = 40 + Math.random() * 20;
    this._chatterAt = 12 + Math.random() * 10;
    this._popAt = 35 + Math.random() * 15;
    const origin = this.ships.player.group.position;
    this.world.spawnMerchantTraffic(origin);
    this.world.spawnHorizonTaskForce(origin);
    this.world.spawnFriendlyScreen(origin);
    this.onComms({
      speaker: 'HORIZON ACTUAL',
      text: 'Task Force 21 is set. Weapons hold until MERIDIAN shares a track and releases the force. Use the Task Force Net.',
      urgency: 'normal',
    });
    this.coop?.require('affirm');
  }

  update(dt) {
    if (!this.started) return;
    const playerPos = this.ships.player.group.position;
    this._orderAt -= dt;
    this._chatterAt -= dt;
    this._popAt -= dt;
    if (this._activeOrder) {
      this._orderTimer -= dt;
      this._evaluateOrder(playerPos);
    }

    if (this._orderAt <= 0 && this.isHost()) {
      this._issueOrder(playerPos);
      this._orderAt = randRange(ORDER_COOLDOWN);
    }
    if (this._chatterAt <= 0) {
      this._stationChatter(playerPos);
      this._chatterAt = randRange(CHATTER_COOLDOWN);
    }
    if (this._popAt <= 0 && this.isHost()) {
      this._maintainPopulation(playerPos);
      this._popAt = randRange(POP_CHECK_COOLDOWN);
    }
  }

  _maintainPopulation(playerPos) {
    const hostiles = this.world.hostiles;
    const merchants = this.world.aliveOfType('SURFACE').filter((e) => e.iff === 'NEUTRAL' || e.iff === 'UNKNOWN');
    const subs = this.world.aliveOfType('SUBSURFACE');
    const air = this.world.aliveOfType('AIR');

    // Soft floor — at most one domain top-up per population tick. Odds lowered so a
    // check firing doesn't usually mean something new shows up — most ticks should
    // do nothing, keeping the pacing gradual rather than a steady drip of contacts.
    if (hostiles.length < 2 && this.mission.beatIndex >= 1 && Math.random() < 0.42) {
      this.world.spawnWave('wave1', playerPos);
      this.onComms({
        speaker: 'CIC',
        text: 'New surface contact entering the picture. Share the track before releasing weapons.',
        urgency: 'warning',
      });
      this.coop?.require('share');
    } else if (subs.length < 1 && this.mission.beatIndex >= 1 && Math.random() < 0.28) {
      this.world.spawnWave('sub_roamer', playerPos);
    } else if (air.length < 1 && this.mission.beatIndex >= 2 && Math.random() < 0.28) {
      this.world.spawnWave('air_probe', playerPos);
    } else if (merchants.length < 2 && Math.random() < 0.35) {
      this.world.spawnMerchantTraffic(playerPos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 2000, 0, (Math.random() - 0.5) * 2000)));
    }
  }

  _issueOrder(playerPos) {
    this._waveSerial++;
    const roll = Math.random();
    let order;
    let coopReq = null;

    if (roll < 0.18) {
      const p = playerPos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 1600, 0, 700 + Math.random() * 1200));
      this.world.spawnWave('combined_strike', p);
      order = {
        id: `ord-combo-${this._waveSerial}`,
        type: 'coop_prosecute',
        text: 'Combined arms raid — share the primary track (C), weapons free (V), split AAW / surface with escorts',
        targetPos: p,
        expires: 140,
        stationHint: 'TAO',
        needsCoop: 'engage',
      };
      coopReq = 'share';
      this.onComms({
        speaker: 'HORIZON ACTUAL',
        text: `FLASH — surface group AND air raid on axis ${padBrg(bearingTo(playerPos, p))}. MERIDIAN owns the picture; escorts will screen and shoot.`,
        urgency: 'critical',
      });
    } else if (roll < 0.36) {
      const p = playerPos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 1800, 0, 800 + Math.random() * 1400));
      this.world.spawnWave('fleet_probe', p);
      order = {
        id: `ord-surf-${this._waveSerial}`,
        type: 'coop_prosecute',
        text: 'Share the surface track (C), then weapons free (V) — escorts will help prosecute with ASMs',
        targetPos: p,
        expires: 120,
        stationHint: 'RADAR',
        needsCoop: 'engage',
      };
      coopReq = 'share';
      this.onComms({
        speaker: 'HORIZON ACTUAL',
        text: `Hostile SAG bearing ${padBrg(bearingTo(playerPos, p))}. Share track, then release the screen — missile doctrine, not a gun duel.`,
        urgency: 'warning',
      });
    } else if (roll < 0.52) {
      const p = playerPos.clone().add(new THREE.Vector3(-400 - Math.random() * 600, 0, 200 + Math.random() * 900));
      this.world.spawnWave('asw_alert', p);
      order = {
        id: `ord-sub-${this._waveSerial}`,
        type: 'coop_ping',
        text: 'Request escort active sonar (N), then localize and prosecute the sub',
        targetPos: p,
        expires: 130,
        stationHint: 'SONAR',
        needsCoop: 'ping',
      };
      coopReq = 'ping';
      this.onComms({
        speaker: 'SONAR NET',
        text: `Subsurface transient bearing ${padBrg(bearingTo(playerPos, p))}. MERIDIAN — have SENTINEL go active (Request Ping). ASROC preferred.`,
        urgency: 'warning',
      });
    } else if (roll < 0.66) {
      const p = playerPos.clone().add(new THREE.Vector3(-1200 - Math.random() * 800, 0, -900 - Math.random() * 700));
      this.world.spawnWave('air_probe', p);
      order = {
        id: `ord-air-${this._waveSerial}`,
        type: 'coop_prosecute',
        text: 'Designate bandits, share track (C), weapons free (V) — SAMs first, escorts picket',
        targetPos: p,
        expires: 100,
        stationHint: 'WEAPONS',
        needsCoop: 'engage',
      };
      coopReq = 'engage';
      this.onComms({
        speaker: 'AAWC',
        text: `Air warning yellow — bogeys bearing ${padBrg(bearingTo(playerPos, p))}. Select SAM, share designation, release the force.`,
        urgency: 'critical',
      });
    } else if (roll < 0.78) {
      const merchants = this.world.entities.filter((e) => e.iff === 'NEUTRAL' && !e.destroyed);
      let m = merchants[0];
      if (!m) {
        this.world.spawnMerchantTraffic(playerPos);
        m = this.world.entities.find((e) => e.iff === 'NEUTRAL' && !e.destroyed);
      }
      order = {
        id: `ord-id-${this._waveSerial}`,
        type: 'visual_id',
        text: 'Lookout — visually ID the merchant (R), then share the classified track (C)',
        targetId: m?.id,
        expires: 100,
        stationHint: 'LOOKOUT',
        needsCoop: 'share',
      };
      coopReq = 'affirm';
      this.onComms({
        speaker: 'CIC',
        text: `Unclassified ${m?.name || 'merchant'} — Lookout classify, CIC share to the force. Do not engage neutrals.`,
        urgency: 'normal',
      });
    } else if (roll < 0.90) {
      order = {
        id: `ord-screen-${this._waveSerial}`,
        type: 'resume_screen',
        text: 'Return escorts to formation screen (M) and affirm (Y)',
        expires: 60,
        stationHint: 'HELM',
        needsCoop: 'screen',
      };
      coopReq = 'screen';
      this.onComms({
        speaker: 'HORIZON ACTUAL',
        text: 'Screen is ragged. MERIDIAN Helm — pull SENTINEL and VANGUARD back on station.',
        urgency: 'warning',
      });
    } else {
      const wp = this.mission.currentWaypoint || this.mission.waypoints[0];
      order = {
        id: `ord-nav-${this._waveSerial}`,
        type: 'nav_hold',
        text: 'Helm — heading hold to VIGIL (H), then affirm tasking (Y)',
        targetPos: wp,
        expires: 90,
        stationHint: 'HELM',
        needsCoop: 'affirm',
      };
      coopReq = 'affirm';
      this.onComms({
        speaker: 'NAV',
        text: `Pilot, course for VIGIL bearing ${padBrg(bearingTo(playerPos, wp))}. Affirm when steady on.`,
        urgency: 'normal',
      });
    }

    this._activeOrder = order;
    this._orderTimer = order.expires;
    this.onObjectiveHint(order);
    const req = order.needsCoop || coopReq;
    if (req) this.coop?.require(req);
  }

  _evaluateOrder(playerPos) {
    const o = this._activeOrder;
    if (!o) return;
    let done = false;
    const coopOk = !o.needsCoop || this.coop?.isSatisfied(o.needsCoop);

    if (o.type === 'coop_prosecute' || o.type === 'investigate_surface' || o.type === 'air_defense') {
      const near = this.world.hostiles.filter((e) => e.position.distanceTo(o.targetPos) < 2200);
      if (near.length === 0 && this._orderTimer < o.expires - 20 && coopOk) done = true;
    } else if (o.type === 'coop_ping' || o.type === 'localize_sub') {
      const subs = this.world.aliveOfType('SUBSURFACE');
      const revealed = subs.some((s) => s.isVisible || (s.sonarRevealed > 0));
      if ((revealed || subs.length === 0) && coopOk && this._orderTimer < o.expires - 15) done = true;
    } else if (o.type === 'visual_id') {
      const e = this.world.entities.find((x) => x.id === o.targetId);
      if (e?.visualId && coopOk) done = true;
    } else if (o.type === 'nav_hold') {
      if (o.targetPos && playerPos.distanceTo(o.targetPos) < 700 && coopOk) done = true;
    } else if (o.type === 'resume_screen') {
      if (coopOk) done = true;
    }

    if (done || this._orderTimer <= 0) {
      if (done) {
        this.onComms({
          speaker: 'HORIZON ACTUAL',
          text: 'Tasking complete — good coordination with the screen. Stand by.',
          urgency: 'normal',
        });
      }
      this._activeOrder = null;
      this.onObjectiveHint(null);
      this.coop?.clearHint();
    }
  }

  _stationChatter(playerPos) {
    // Never overwrite an active DynamicOps beat — chatter was stealing pendingHint
    // mid-order (e.g. ping require replaced by engage), which made stations feel broken.
    if (this._activeOrder) {
      if (Math.random() < 0.35) {
        this.onComms({
          speaker: 'CIC',
          text: `Still working the order — ${this._activeOrder.text}`,
          urgency: 'normal',
        });
      }
      return;
    }

    const escorts = [this.ships.escort1, this.ships.escort2].filter(Boolean);
    const hostiles = this.world.hostiles;
    const inboundish = hostiles.find((h) => h.position.distanceTo(playerPos) < 2800);
    const roll = Math.random();

    if (inboundish && roll < 0.45) {
      const brg = padBrg(bearingTo(playerPos, inboundish.position));
      const call = escorts[Math.floor(Math.random() * escorts.length)]?.name?.split(' ')[1] || 'SENTINEL';
      if (inboundish.domain === 'AIR') {
        this.onComms({
          speaker: `${call} RADAR (AI)`,
          text: `Air track bearing ${brg}. Share it and give weapons free — I will take the shot with you.`,
          urgency: 'warning',
        });
        this.coop?.require('engage');
        this.onObjectiveHint({
          id: 'chat-air',
          type: 'coop_prosecute',
          text: `Share + weapons free on air track bearing ${brg}`,
          stationHint: 'WEAPONS',
          expires: 50,
          needsCoop: 'engage',
        });
      } else if (inboundish.domain === 'SUBSURFACE') {
        this.onComms({
          speaker: `${call} SONAR (AI)`,
          text: `Subsurface bearing ${brg}. Request I go active — press Request Ping on the net.`,
          urgency: 'warning',
        });
        this.coop?.require('ping');
      } else {
        this.onComms({
          speaker: `${call} WEAPONS (AI)`,
          text: `Holding ${inboundish.name || 'hostile'} bearing ${brg}. Waiting for your share and weapons free.`,
          urgency: 'normal',
        });
        this.coop?.require('share');
      }
      return;
    }

    if (roll < 0.4) {
      this.onComms({
        speaker: 'SENTINEL HELM (AI)',
        text: 'On your beam. Call Resume Screen if you want us tight again.',
        urgency: 'normal',
      });
    } else if (roll < 0.7) {
      this.onComms({
        speaker: 'VANGUARD RADAR (AI)',
        text: 'Merchant traffic only to the southeast — amber track. Share if you want it on the force plot.',
        urgency: 'normal',
      });
    } else {
      this.onComms({
        speaker: 'CIC',
        text: 'Doctrine reminder: weapons hold until MERIDIAN shares a track and releases the force.',
        urgency: 'normal',
      });
    }
  }
}

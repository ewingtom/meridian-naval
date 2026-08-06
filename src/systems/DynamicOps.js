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

/** Same compact convention the HUD uses (see ui/lib/utils.js). */
function rangeStr(m) {
  return m >= 1000 ? `${(m / 1000).toFixed(1)}km` : `${Math.round(m)}m`;
}

function pickOne(list) {
  return list[Math.floor(Math.random() * list.length)];
}

/** Nearest live entity to `pos` matching `pred`, or null. Chatter is only ever
 * generated FROM one of these — a line must never describe a contact that isn't there. */
function nearestTo(entities, pos, pred) {
  let best = null;
  let bestD = Infinity;
  for (const e of entities) {
    if (e.destroyed || e.alive === false) continue;
    if (!pred(e)) continue;
    const d = e.position.distanceTo(pos);
    if (d < bestD) { bestD = d; best = e; }
  }
  return best ? { entity: best, dist: bestD } : null;
}

export class DynamicOps {
  constructor({ world, ships, mission, onComms, onObjectiveHint, isHost = () => true, coop = null, weather = null, landmarks = [] }) {
    this.world = world;
    this.ships = ships;
    this.mission = mission;
    this.onComms = onComms || (() => {});
    this.onObjectiveHint = onObjectiveHint || (() => {});
    this.isHost = isHost;
    this.coop = coop;
    /** WeatherSystem — optional, so DynamicOps still works standalone in tests. */
    this.weather = weather;
    /** [{ name, position }] real scene landmarks, for littoral/navigation chatter. */
    this.landmarks = landmarks;

    this._orderAt = 12;
    this._chatterAt = 6;
    this._popAt = 20;
    this._spawnBudget = 0;
    this._activeOrder = null;
    this._orderTimer = 0;
    this._waveSerial = 0;
    this._lastWeather = weather?.state ?? null;
    this._weatherRemarkAt = 0; // cooldown so a fast debug state change can't spam comms
    this._civilianTopUpAt = 0;
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
    // Three civilian hulls on independent lanes at the opening, not one. A single
    // merchant crossing an otherwise empty sea reads as a scripted prop; a handful of
    // unrelated tracks reads as a shipping lane the warship happens to be patrolling.
    for (let i = 0; i < 3; i++) {
      this.world.spawnMerchantTraffic(origin, { laneAngle: (i / 3) * Math.PI * 2 + Math.random() * 0.6 });
    }
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
    this._weatherRemarkAt -= dt;
    this._pollWeather();
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

  /**
   * Weather-aware bridge chatter. Fires on the LEADING edge of a weather transition
   * (WeatherSystem retargets long before the picture has finished changing), so the
   * bridge calls the change as it starts building rather than announcing something the
   * player watched happen five minutes ago.
   */
  _pollWeather() {
    const w = this.weather;
    if (!w) return;
    const now = w.state;
    if (now === this._lastWeather) return;
    const prev = this._lastWeather;
    this._lastWeather = now;
    if (this._weatherRemarkAt > 0) return;
    this._weatherRemarkAt = 25;

    const r = w.report;
    const worsening = ['clear', 'haze', 'overcast', 'squall'];
    const gotWorse = worsening.indexOf(now) > worsening.indexOf(prev);

    const lines = {
      clear: [
        { speaker: 'BRIDGE', text: `Weather's lifting — horizon opening back up, visibility out to ${r.visibilityKm}km. Lookout, you've got the range again.` },
        { speaker: 'OOD', text: `Sea's laying down, ${r.seaLabel} state. Good optical conditions — recommend visual sweep of the surface picture.` },
      ],
      haze: [
        { speaker: 'BRIDGE', text: `Haze building on the horizon. Visibility down to about ${r.visibilityKm}km — lean on radar for anything past that.` },
        { speaker: 'OOD', text: `Losing the horizon line to haze. Lookout, call anything you see before it fades on you.` },
      ],
      overcast: [
        { speaker: 'BRIDGE', text: `Overcast rolling in, sea building ${r.seaLabel}. Visibility ${r.visibilityKm}km and dropping.` },
        { speaker: 'OOD', text: `Barometer's falling. Expect the sea state to build — secure for heavy weather topside.` },
      ],
      squall: [
        { speaker: 'BRIDGE', text: `Squall line on us — visibility ${r.visibilityKm}km, sea ${r.seaLabel}. Visual ID is going to be unreliable; work the radar picture.`, urgency: 'warning' },
        { speaker: 'OOD', text: `Heavy weather. Sea state ${r.seaLabel} — sonar conditions will degrade with this surface noise.`, urgency: 'warning' },
      ],
    };
    const line = pickOne(lines[now] || lines.clear);
    this.onComms({
      speaker: line.speaker,
      text: line.text,
      urgency: line.urgency || (gotWorse ? 'warning' : 'normal'),
    });
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
    } else if (merchants.length < 4 && Math.random() < 0.6) {
      // Civilian traffic is deliberately the LEAST gated branch and has the highest
      // floor: it costs the player nothing (neutrals never shoot) and it's what makes
      // the sea read as worked rather than as an empty arena with hostiles in it.
      this.world.spawnMerchantTraffic(
        playerPos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 2000, 0, (Math.random() - 0.5) * 2000))
      );
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

    // ---- Anchored cross-station beats -------------------------------------
    // Every candidate below is built FROM a live entity/landmark that was just looked
    // up, so a line can never describe a contact that doesn't exist. Beats that create
    // real player work carry a `weight` above the pure-flavour fallbacks, and several
    // attach an objective hint so the chatter turns into an actual task at a station.
    const beats = this._buildChatterBeats(playerPos, escorts);
    const total = beats.reduce((s, b) => s + b.weight, 0);
    let pick = Math.random() * total;
    let chosen = beats[beats.length - 1];
    for (const b of beats) {
      pick -= b.weight;
      if (pick <= 0) { chosen = b; break; }
    }
    this.onComms({ speaker: chosen.speaker, text: chosen.text, urgency: chosen.urgency || 'normal' });
    if (chosen.coop) this.coop?.require(chosen.coop);
    if (chosen.hint) this.onObjectiveHint(chosen.hint);
  }

  /** Build the weighted chatter pool from live world state. Never fabricates contacts. */
  _buildChatterBeats(playerPos, escorts) {
    const ents = this.world.entities;
    const beats = [];
    const escortName = (s) => s?.name?.split(' ')[1]?.toUpperCase() || 'SENTINEL';

    // --- Subsurface: the highest-value "creates a task" beat. Sonar transients are
    // what the player is supposed to chase down with an active sweep.
    const sub = nearestTo(ents, playerPos, (e) => e.domain === 'SUBSURFACE');
    if (sub && sub.dist < 9000) {
      const brg = padBrg(bearingTo(playerPos, sub.entity.position));
      beats.push({
        weight: 3.2,
        speaker: 'SONAR (AI)',
        text: `Holding a transient bearing ${brg}, estimated ${rangeStr(sub.dist)}. Classification ambiguous — recommend an active sweep before it goes quiet.`,
        urgency: 'warning',
        coop: 'ping',
        hint: {
          id: `chat-sub-${Math.round(sub.dist)}`,
          type: 'coop_ping',
          text: `Work the transient bearing ${brg} — request escort active sonar (N)`,
          stationHint: 'SONAR',
          expires: 55,
          needsCoop: 'ping',
        },
      });
      beats.push({
        weight: 1.1,
        speaker: `${escortName(escorts[0])} SONAR (AI)`,
        text: `Cross-fixing your transient off bearing ${brg}. Two bearings and we can localise — say when you want me active.`,
      });
    }

    // --- Air: bearing + range so the TAO can pre-stage SAMs rather than react late.
    const air = nearestTo(ents, playerPos, (e) => e.domain === 'AIR');
    if (air && air.dist < 14000) {
      const brg = padBrg(bearingTo(playerPos, air.entity.position));
      const hostileAir = air.entity.iff === 'HOSTILE';
      beats.push({
        weight: hostileAir ? 3.0 : 1.4,
        speaker: 'AAWC (AI)',
        text: hostileAir
          ? `Air track bearing ${brg}, ${rangeStr(air.dist)} and closing. Recommend SAM selected and the track shared before it's inside the horizon.`
          : `Air contact bearing ${brg} at ${rangeStr(air.dist)}, no mode-4 response yet. Hold fire until it's classified.`,
        urgency: hostileAir ? 'warning' : 'normal',
        coop: hostileAir ? 'engage' : null,
      });
    }

    // --- Neutral / civilian traffic: the visual-ID loop. Only offered for contacts
    // the Lookout hasn't already classified, and only inside plausible optical range.
    const neutral = nearestTo(ents, playerPos, (e) => e.iff === 'NEUTRAL' && !e.visualId);
    if (neutral && neutral.dist < 7000) {
      const brg = padBrg(bearingTo(playerPos, neutral.entity.position));
      const vis = this.weather?.report?.visibilityKm;
      const murky = vis != null && vis < 5.5;
      beats.push({
        weight: 2.6,
        speaker: 'LOOKOUT (AI)',
        text: murky
          ? `Contact bearing ${brg}, ${rangeStr(neutral.dist)} — hull-down in the murk, can't call it from here. Recommend we close for a visual ID.`
          : `Contact bearing ${brg}, ${rangeStr(neutral.dist)} — low freeboard, deck cranes, no weapon fits I can see. Reads merchant. Recommend visual ID and share.`,
        hint: {
          id: `chat-id-${neutral.entity.id}`,
          type: 'visual_id',
          text: `Lookout — visually ID contact bearing ${brg} (R), then share the track (C)`,
          targetId: neutral.entity.id,
          stationHint: 'LOOKOUT',
          expires: 70,
          needsCoop: 'share',
        },
      });
      beats.push({
        weight: 1.2,
        speaker: 'CIC',
        text: `${neutral.entity.name} bearing ${brg} is in the traffic lane, ${rangeStr(neutral.dist)}. Track's amber until somebody classifies it — do not release on it.`,
      });
    }

    // --- Already-classified neutrals: keeps the sea feeling worked without new tasks.
    const known = nearestTo(ents, playerPos, (e) => e.iff === 'NEUTRAL' && e.visualId);
    if (known && known.dist < 9000) {
      const brg = padBrg(bearingTo(playerPos, known.entity.position));
      beats.push({
        weight: 0.9,
        speaker: 'BRIDGE',
        text: `${known.entity.name} still opening on bearing ${brg}, ${rangeStr(known.dist)}. Nothing further — she's just going about her business.`,
      });
    }

    // --- Distant hostiles (beyond the 2.8km branch above): builds anticipation.
    const farHostile = nearestTo(ents, playerPos, (e) => e.iff === 'HOSTILE');
    if (farHostile && farHostile.dist >= 2800) {
      const brg = padBrg(bearingTo(playerPos, farHostile.entity.position));
      beats.push({
        weight: 2.4,
        speaker: 'RADAR (AI)',
        text: `${farHostile.entity.name || 'Surface contact'} bearing ${brg}, ${rangeStr(farHostile.dist)}. Outside gun range — this is a missile problem. Recommend you hook it and share.`,
        urgency: 'warning',
        coop: 'share',
      });
    }

    // --- Screen geometry, from the escorts' actual positions.
    for (const e of escorts) {
      const d = e.group.position.distanceTo(playerPos);
      if (d < 200 || d > 6000) continue;
      const brg = padBrg(bearingTo(playerPos, e.group.position));
      beats.push({
        weight: d > 1400 ? 1.8 : 0.8,
        speaker: `${escortName(e)} HELM (AI)`,
        text: d > 1400
          ? `We're ${rangeStr(d)} out on bearing ${brg} — wider than doctrine. Call Resume Screen (M) if you want us tight.`
          : `On station bearing ${brg}, ${rangeStr(d)}. Screen is set.`,
      });
    }

    // --- Littoral / navigation, anchored to the real island meshes in the scene.
    for (const lm of this.landmarks) {
      if (!lm?.position) continue;
      const d = lm.position.distanceTo(playerPos);
      if (d > 9000) continue;
      const brg = padBrg(bearingTo(playerPos, lm.position));
      beats.push({
        weight: d < 3500 ? 1.9 : 0.9,
        speaker: 'NAV',
        text: d < 3500
          ? `Landfall — ${lm.name} bearing ${brg}, ${rangeStr(d)}. Shoal water inshore of it; recommend we hold this side of the ten-fathom line.`
          : `${lm.name} bearing ${brg} at ${rangeStr(d)}, opening. Good radar landmark if you want a fix.`,
      });
    }

    // --- Weather-coupled tasking. Only offered when the weather actually justifies it.
    const wr = this.weather?.report;
    if (wr) {
      if (wr.visibilityKm < 5.0) {
        beats.push({
          weight: 2.0,
          speaker: 'CIC',
          text: `Visibility's down to ${wr.visibilityKm}km — optical classification is unreliable. Work the radar picture and interrogate before you release.`,
          urgency: 'warning',
        });
      }
      if (wr.seaState > 1.25) {
        beats.push({
          weight: 1.6,
          speaker: 'SONAR (AI)',
          text: `Sea state ${wr.seaLabel} — surface noise is up and my passive picture is degrading. Recommend we slow for a clean tow, or go active when you need it.`,
        });
        beats.push({
          weight: 1.3,
          speaker: 'OOD',
          text: `Taking green water forward with this ${wr.seaLabel} sea. Recommend easing the throttle before we start losing topside gear.`,
        });
      }
      if (wr.raining) {
        beats.push({
          weight: 1.4,
          speaker: 'LOOKOUT (AI)',
          text: `Rain's washing out my optics — I can barely hold the horizon. You'll want radar or IFF for anything past a couple of thousand metres.`,
          urgency: 'warning',
        });
      }
      if (wr.transitioning && wr.visibilityKm > 7.0) {
        beats.push({
          weight: 1.0,
          speaker: 'BRIDGE',
          text: `Weather's easing off — visibility back out to ${wr.visibilityKm}km. Good time to re-sweep the surface picture by eye.`,
        });
      }
    }

    // --- Always-available fallbacks so the pool is never empty.
    beats.push({
      weight: 1.0,
      speaker: 'CIC',
      text: 'Doctrine reminder: weapons hold until MERIDIAN shares a track and releases the force.',
    });
    beats.push({
      weight: 0.8,
      speaker: 'ENGINEERING (AI)',
      text: 'Plant is nominal, both shafts answering. Say the word if you want flank held for any length of time.',
    });
    beats.push({
      weight: 0.8,
      speaker: 'OOD',
      text: 'Bridge has the picture, no new contacts this sweep. Standing by.',
    });
    return beats;
  }
}

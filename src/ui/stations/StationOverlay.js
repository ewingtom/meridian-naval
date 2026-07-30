/**
 * stations/StationOverlay.js
 *
 * Seated-station HUD layer. Each station is a distinct "console minigame":
 * unique instruments, required inputs, and status that the player must manage.
 */

import './stations.css';
import { el, formatBearing, formatDistance } from '../lib/utils.js';

const WEAPON_SLOTS = [
  { key: 'gun', digit: '1', name: '130mm Deck Gun', infinite: true, role: 'SURFACE / AIR' },
  { key: 'missile', digit: '2', name: 'Anti-Ship Missile', ammoKey: 'missile', role: 'SURFACE LOCK' },
  { key: 'torpedo', digit: '3', name: 'ASROC Torpedo', ammoKey: 'torpedo', role: 'SUBSURFACE' },
  { key: 'drone', digit: '4', name: 'Recon Drone', ammoKey: 'drone', role: 'ISR' },
];

const ORDER_NOTCHES = [
  { value: -1, label: 'FULL ASTERN', key: '1' },
  { value: -0.35, label: 'SLOW ASTERN', key: '2' },
  { value: 0, label: 'ALL STOP', key: '3' },
  { value: 0.35, label: 'SLOW AHEAD', key: '4' },
  { value: 0.7, label: 'HALF AHEAD', key: '5' },
  { value: 1, label: 'FLANK SPEED', key: '6' },
];

function orderLabel(throttle) {
  let best = ORDER_NOTCHES[2];
  let bestDist = Infinity;
  for (const o of ORDER_NOTCHES) {
    const d = Math.abs(throttle - o.value);
    if (d < bestDist) { bestDist = d; best = o; }
  }
  return best.label;
}

function nearestNotch(throttle) {
  let best = ORDER_NOTCHES[2];
  let bestDist = Infinity;
  for (const o of ORDER_NOTCHES) {
    const d = Math.abs(throttle - o.value);
    if (d < bestDist) { bestDist = d; best = o; }
  }
  return best;
}

export class StationOverlay {
  constructor() {
    this.root = null;
    this._mounted = false;
    this._station = null;
    this._panels = {};
    this.onTelegraph = null; // (value) => void
    this.onFilterChange = null;
    this.onRangeChange = null;
  }

  mount(container = document.getElementById('ui-root')) {
    if (this._mounted) return this.root;
    this.root = el('div', { class: 'station-overlay', 'aria-hidden': 'true' });
    this.root.innerHTML = `
      <div class="stn-chrome"></div>
      <div class="stn-topbar hud-panel">
        <div class="hud-corners"></div>
        <div class="stn-title" data-stn="title">—</div>
        <div class="stn-hint" data-stn="hint"></div>
      </div>

      <div class="stn-panel" data-panel="HELM" hidden>
        <div class="stn-helm-nav hud-panel">
          <div class="hud-corners"></div>
          <div class="hud-label">Nav to Waypoint</div>
          <div class="stn-nav-name" data-helm="wp-name">—</div>
          <div class="stn-nav-grid">
            <div>BRG <strong data-helm="wp-brg">---</strong></div>
            <div>RNG <strong data-helm="wp-rng">---</strong></div>
            <div>CRS ERR <strong data-helm="wp-err">---</strong></div>
            <div>HOLD <strong data-helm="hold">OFF</strong></div>
          </div>
          <div class="stn-course-bar"><i data-helm="course-needle"></i></div>
          <div class="stn-hint" style="margin-top:8px"><kbd>H</kbd> Heading hold · <kbd>F</kbd> Steer to course</div>
        </div>
        <div class="stn-helm-cluster">
          <div class="stn-gauge hud-panel">
            <div class="hud-corners"></div>
            <div class="hud-label">Heading</div>
            <div class="stn-gauge-value" data-helm="heading">000</div>
            <div class="stn-gauge-unit" data-helm="heading-label">N</div>
          </div>
          <div class="stn-telegraph hud-panel">
            <div class="hud-corners"></div>
            <div class="hud-label">Engine Order Telegraph</div>
            <div class="stn-telegraph-notches" data-helm="notches"></div>
            <div class="stn-telegraph-track">
              <div class="stn-telegraph-zero"></div>
              <div class="stn-telegraph-fill" data-helm="throttle-fill"></div>
            </div>
            <div class="stn-order" data-helm="order">ALL STOP</div>
            <div class="stn-rudder">
              <span>PORT</span>
              <div class="stn-rudder-needle"><i data-helm="rudder"></i></div>
              <span>STBD</span>
            </div>
          </div>
          <div class="stn-gauge hud-panel">
            <div class="hud-corners"></div>
            <div class="hud-label">Speed</div>
            <div class="stn-gauge-value" data-helm="speed">0.0</div>
            <div class="stn-gauge-unit">KTS</div>
          </div>
        </div>
      </div>

      <div class="stn-panel" data-panel="WEAPONS" hidden>
        <div class="stn-weapons-scope">
          <div class="stn-weapons-reticle" aria-hidden="true">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="38"/>
              <circle cx="60" cy="60" r="8"/>
              <line x1="60" y1="6" x2="60" y2="28"/>
              <line x1="60" y1="92" x2="60" y2="114"/>
              <line x1="6" y1="60" x2="28" y2="60"/>
              <line x1="92" y1="60" x2="114" y2="60"/>
              <circle class="stn-lead-ring" cx="60" cy="60" r="22" fill="none"/>
            </svg>
          </div>
          <div class="stn-solution hud-panel" data-wpn="solution-box">
            <div class="hud-label">Fire Solution</div>
            <div class="stn-solution-state" data-wpn="solution">NO LOCK</div>
            <div class="stn-solution-meta" data-wpn="solution-meta">Designate a track · Tab</div>
          </div>
        </div>
        <div class="stn-inbound hud-panel">
          <div class="hud-corners"></div>
          <div class="hud-label">Inbound Threats</div>
          <div class="stn-inbound-body" data-wpn="inbound">CLEAR</div>
        </div>
        <div class="stn-weapons-rack" data-wpn="rack"></div>
        <div class="stn-target-panel hud-panel">
          <div class="hud-corners"></div>
          <div class="hud-label">Tracked Contact</div>
          <div class="stn-target-name" data-wpn="target-name">NO TARGET</div>
          <div class="stn-target-meta">
            <div>BRG <strong data-wpn="brg">---</strong></div>
            <div>RNG <strong data-wpn="rng">---</strong></div>
            <div>DOM <strong data-wpn="domain">---</strong></div>
            <div>IFF <strong data-wpn="iff">---</strong></div>
          </div>
          <div class="stn-fire-status is-notarget" data-wpn="fire">SELECT TARGET · TAB</div>
          <div class="stn-hint" style="margin-top:8px">
            <kbd>T</kbd> Track lock · <kbd>F</kbd>/<kbd>Space</kbd>/<span>Click</span> Fire · <kbd>G</kbd> CIWS focus
          </div>
        </div>
      </div>

      <div class="stn-panel" data-panel="RADAR" hidden>
        <div class="stn-radar-side">
          <div class="stn-radar-tools hud-panel">
            <div class="hud-corners"></div>
            <div class="hud-label">Scope Controls</div>
            <div class="stn-filter-row" data-rdr="filters">
              <button type="button" data-filter="ALL" class="is-active">ALL</button>
              <button type="button" data-filter="SURFACE">SURF</button>
              <button type="button" data-filter="AIR">AIR</button>
              <button type="button" data-filter="SUBSURFACE">SUB</button>
              <button type="button" data-filter="NAV">NAV</button>
            </div>
            <div class="stn-range-row">
              <button type="button" data-range="-">− RNG</button>
              <span data-rdr="range">6.0 KM</span>
              <button type="button" data-range="+">+ RNG</button>
            </div>
            <div class="stn-hint"><kbd>[</kbd>/<kbd>]</kbd> Range · <kbd>1</kbd>–<kbd>5</kbd> Filter · <kbd>Enter</kbd> Designate</div>
          </div>
          <div class="stn-contact-list hud-panel">
            <div class="hud-corners"></div>
            <div class="hud-label">Contact Track</div>
            <div class="stn-contact-list-body" data-rdr="list"></div>
          </div>
          <div class="stn-sonar-panel hud-panel">
            <div class="hud-corners"></div>
            <div class="hud-label">Active Sonar</div>
            <div class="stn-hint" style="margin-top:6px"><kbd>Q</kbd> Ping · localize submerged contacts</div>
            <div class="stn-sonar-pulse" data-rdr="sonar"><i></i></div>
            <div class="stn-nav-cue" data-rdr="nav-cue">VIGIL — not in picture</div>
          </div>
        </div>
      </div>

      <div class="stn-panel" data-panel="LOOKOUT" hidden>
        <div class="stn-lookout-frame"></div>
        <div class="stn-lookout-cross"></div>
        <div class="stn-lookout-call hud-panel">
          <div class="hud-corners"></div>
          <div class="hud-label">Visual ID</div>
          <div class="stn-lookout-contact" data-look="contact">Sweep horizon — center a contact</div>
          <div class="stn-lookout-meta" data-look="meta"></div>
          <div class="stn-hint" style="margin-top:8px"><kbd>R</kbd> Report / classify contact in crosshair</div>
        </div>
        <div class="stn-lookout-readout hud-panel" data-look="readout">
          BINOCULAR STATION
        </div>
      </div>
    `;
    container.appendChild(this.root);

    this._title = this.root.querySelector('[data-stn="title"]');
    this._hint = this.root.querySelector('[data-stn="hint"]');
    for (const p of this.root.querySelectorAll('.stn-panel')) {
      this._panels[p.dataset.panel] = p;
    }
    this._helm = {
      heading: this.root.querySelector('[data-helm="heading"]'),
      headingLabel: this.root.querySelector('[data-helm="heading-label"]'),
      speed: this.root.querySelector('[data-helm="speed"]'),
      fill: this.root.querySelector('[data-helm="throttle-fill"]'),
      order: this.root.querySelector('[data-helm="order"]'),
      rudder: this.root.querySelector('[data-helm="rudder"]'),
      notches: this.root.querySelector('[data-helm="notches"]'),
      wpName: this.root.querySelector('[data-helm="wp-name"]'),
      wpBrg: this.root.querySelector('[data-helm="wp-brg"]'),
      wpRng: this.root.querySelector('[data-helm="wp-rng"]'),
      wpErr: this.root.querySelector('[data-helm="wp-err"]'),
      hold: this.root.querySelector('[data-helm="hold"]'),
      courseNeedle: this.root.querySelector('[data-helm="course-needle"]'),
    };
    this._wpn = {
      rack: this.root.querySelector('[data-wpn="rack"]'),
      targetName: this.root.querySelector('[data-wpn="target-name"]'),
      brg: this.root.querySelector('[data-wpn="brg"]'),
      rng: this.root.querySelector('[data-wpn="rng"]'),
      domain: this.root.querySelector('[data-wpn="domain"]'),
      iff: this.root.querySelector('[data-wpn="iff"]'),
      fire: this.root.querySelector('[data-wpn="fire"]'),
      solution: this.root.querySelector('[data-wpn="solution"]'),
      solutionMeta: this.root.querySelector('[data-wpn="solution-meta"]'),
      solutionBox: this.root.querySelector('[data-wpn="solution-box"]'),
      inbound: this.root.querySelector('[data-wpn="inbound"]'),
      leadRing: this.root.querySelector('.stn-lead-ring'),
    };
    this._rdr = {
      list: this.root.querySelector('[data-rdr="list"]'),
      sonar: this.root.querySelector('[data-rdr="sonar"]'),
      filters: this.root.querySelector('[data-rdr="filters"]'),
      range: this.root.querySelector('[data-rdr="range"]'),
      navCue: this.root.querySelector('[data-rdr="nav-cue"]'),
    };
    this._look = {
      readout: this.root.querySelector('[data-look="readout"]'),
      contact: this.root.querySelector('[data-look="contact"]'),
      meta: this.root.querySelector('[data-look="meta"]'),
    };

    // Telegraph notches (clickable)
    this._helm.notches.innerHTML = ORDER_NOTCHES.map((o) =>
      `<button type="button" class="stn-notch" data-order="${o.value}" title="${o.label}"><kbd>${o.key}</kbd><span>${o.label.split(' ').pop()}</span></button>`
    ).join('');
    this._helm.notches.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-order]');
      if (!btn || !this.onTelegraph) return;
      this.onTelegraph(Number(btn.dataset.order));
    });

    this._rdr.filters.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-filter]');
      if (!btn || !this.onFilterChange) return;
      this.onFilterChange(btn.dataset.filter);
    });
    this.root.querySelector('.stn-range-row')?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-range]');
      if (!btn || !this.onRangeChange) return;
      this.onRangeChange(btn.dataset.range === '+' ? 1 : -1);
    });

    // Allow clicking station controls
    this.root.querySelectorAll('.stn-telegraph-notches, .stn-radar-tools, .stn-filter-row, .stn-range-row')
      .forEach((node) => { node.style.pointerEvents = 'auto'; });

    this._mounted = true;
    return this.root;
  }

  setStation(station) {
    if (!this._mounted) return;
    const name = station && station !== 'WALK' ? station : null;
    this._station = name;
    this.root.classList.toggle('is-active', !!name);
    this.root.setAttribute('aria-hidden', name ? 'false' : 'true');

    for (const [key, panel] of Object.entries(this._panels)) {
      panel.hidden = key !== name;
    }

    const meta = STATION_UI[name];
    if (meta) {
      this._title.textContent = meta.title;
      this._hint.innerHTML = meta.hint;
    }
  }

  get station() {
    return this._station;
  }

  update(state = {}) {
    if (!this._mounted || !this._station) return;

    if (this._station === 'HELM') this._updateHelm(state);
    else if (this._station === 'WEAPONS') this._updateWeapons(state);
    else if (this._station === 'RADAR') this._updateRadar(state);
    else if (this._station === 'LOOKOUT') this._updateLookout(state);
  }

  triggerSonarPulse() {
    if (!this._rdr.sonar) return;
    this._rdr.sonar.classList.remove('is-active');
    void this._rdr.sonar.offsetWidth;
    this._rdr.sonar.classList.add('is-active');
  }

  _updateHelm(s) {
    const heading = ((s.heading % 360) + 360) % 360;
    this._helm.heading.textContent = formatBearing(heading);
    this._helm.headingLabel.textContent = compassLabel(heading);
    this._helm.speed.textContent = (s.speedKnots ?? 0).toFixed(1);

    const t = Math.max(-1, Math.min(1, s.throttleFraction ?? 0));
    const pct = Math.abs(t) * 50;
    this._helm.fill.style.width = `${pct}%`;
    this._helm.fill.style.left = t >= 0 ? '50%' : `${50 - pct}%`;
    this._helm.fill.classList.toggle('reverse', t < 0);
    this._helm.order.textContent = orderLabel(t);

    const notch = nearestNotch(t);
    for (const btn of this._helm.notches.querySelectorAll('.stn-notch')) {
      btn.classList.toggle('is-active', Number(btn.dataset.order) === notch.value);
    }

    const rudder = Math.max(-1, Math.min(1, s.rudder ?? 0));
    this._helm.rudder.style.transform = `translateX(${rudder * 32}px)`;

    const wp = s.waypoint;
    if (wp) {
      this._helm.wpName.textContent = wp.name || 'WAYPOINT';
      this._helm.wpBrg.textContent = `${formatBearing(wp.bearing)}°`;
      this._helm.wpRng.textContent = formatDistance(wp.distanceM);
      const err = ((wp.bearing - heading + 540) % 360) - 180;
      const errAbs = Math.abs(err);
      this._helm.wpErr.textContent = `${err >= 0 ? '+' : ''}${err.toFixed(0)}°`;
      this._helm.wpErr.style.color = errAbs < 8 ? 'var(--c-green)' : errAbs < 25 ? 'var(--c-amber)' : 'var(--c-red, #ff6a6a)';
      this._helm.courseNeedle.style.transform = `translateX(${Math.max(-48, Math.min(48, err * 1.1))}px)`;
    } else {
      this._helm.wpName.textContent = 'NO ACTIVE WAYPOINT';
      this._helm.wpBrg.textContent = '---';
      this._helm.wpRng.textContent = '---';
      this._helm.wpErr.textContent = '---';
      this._helm.courseNeedle.style.transform = 'translateX(0)';
    }
    this._helm.hold.textContent = s.headingHold ? 'ON' : 'OFF';
    this._helm.hold.style.color = s.headingHold ? 'var(--c-green)' : 'var(--c-text-dim)';
  }

  _updateWeapons(s) {
    const ammo = s.ammo || {};
    const selected = s.selectedWeapon || 'gun';
    const ready = !!s.weaponReady;
    let html = '';
    for (const slot of WEAPON_SLOTS) {
      const count = slot.infinite ? '∞' : String(ammo[slot.ammoKey] ?? 0);
      const empty = !slot.infinite && (ammo[slot.ammoKey] ?? 0) <= 0;
      html += `<div class="stn-weapon-slot ${selected === slot.key ? 'is-selected' : ''} ${empty ? 'is-empty' : ''}">
        <span class="stn-weapon-key">${slot.digit}</span>
        <div>
          <div class="stn-weapon-name">${slot.name}</div>
          <div class="stn-weapon-role">${slot.role}</div>
        </div>
        <span class="stn-weapon-ammo">${count}</span>
      </div>`;
    }
    this._wpn.rack.innerHTML = html;

    const target = s.target;
    if (target) {
      this._wpn.targetName.textContent = target.name || 'CONTACT';
      this._wpn.brg.textContent = target.bearing != null ? `${formatBearing(target.bearing)}°` : '---';
      this._wpn.rng.textContent = target.distanceM != null ? formatDistance(target.distanceM) : '---';
      this._wpn.domain.textContent = (target.domain || '—').toUpperCase();
      this._wpn.iff.textContent = (target.iff || '—').toUpperCase();
    } else {
      this._wpn.targetName.textContent = 'NO TARGET';
      this._wpn.brg.textContent = '---';
      this._wpn.rng.textContent = '---';
      this._wpn.domain.textContent = '---';
      this._wpn.iff.textContent = '---';
    }

    const sol = s.fireSolution || { ok: false, reason: 'NO LOCK' };
    this._wpn.solution.textContent = sol.ok ? 'SOLUTION GOOD' : sol.reason;
    this._wpn.solutionMeta.textContent = sol.detail || '';
    this._wpn.solutionBox.classList.toggle('is-good', !!sol.ok);
    this._wpn.solutionBox.classList.toggle('is-bad', !sol.ok);
    if (this._wpn.leadRing) {
      this._wpn.leadRing.style.opacity = sol.ok ? '1' : '0.25';
      this._wpn.leadRing.style.stroke = sol.ok ? '#3dffa0' : '#ffb02e';
    }

    const inbound = s.inbound || [];
    if (!inbound.length) {
      this._wpn.inbound.textContent = 'CLEAR';
      this._wpn.inbound.classList.remove('is-alert');
    } else {
      this._wpn.inbound.classList.add('is-alert');
      this._wpn.inbound.innerHTML = inbound.slice(0, 4).map((t) =>
        `<div class="stn-inbound-row"><span>${t.name}</span><span>${formatBearing(t.bearing)}° · ${formatDistance(t.distanceM)}</span></div>`
      ).join('');
    }

    const fire = this._wpn.fire;
    fire.classList.remove('is-reloading', 'is-empty', 'is-notarget', 'is-blocked');
    if (!target) {
      fire.textContent = 'SELECT TRACK · TAB';
      fire.classList.add('is-notarget');
    } else if (!ready) {
      fire.textContent = 'RELOADING';
      fire.classList.add('is-reloading');
    } else if (!sol.ok) {
      fire.textContent = sol.reason || 'NO SOLUTION';
      fire.classList.add('is-blocked');
    } else {
      const slot = WEAPON_SLOTS.find((w) => w.key === selected);
      const empty = slot && !slot.infinite && (ammo[slot.ammoKey] ?? 0) <= 0;
      if (empty) {
        fire.textContent = 'MAGAZINE EMPTY';
        fire.classList.add('is-empty');
      } else {
        fire.textContent = s.trackLock ? 'WEAPONS FREE · TRACK LOCKED' : 'WEAPONS FREE · FIRE';
      }
    }
  }

  _updateRadar(s) {
    const contacts = s.contacts || [];
    const selectedId = s.selectedTargetId;
    const filter = s.filter || 'ALL';
    for (const btn of this._rdr.filters.querySelectorAll('[data-filter]')) {
      btn.classList.toggle('is-active', btn.dataset.filter === filter);
    }
    if (this._rdr.range) {
      const km = (s.rangeM || 6000) / 1000;
      this._rdr.range.textContent = `${km.toFixed(1)} KM`;
    }

    const rows = contacts.slice(0, 14).map((c) => {
      const iff = (c.iff || 'unknown').toLowerCase();
      const dist = c.distanceM != null ? formatDistance(c.distanceM) : '';
      const dom = (c.domain || '').toString().slice(0, 4).toUpperCase();
      return `<div class="stn-contact-row ${c.id === selectedId ? 'is-selected' : ''} ${c.isWaypoint ? 'is-nav' : ''}">
        <span class="stn-contact-dot ${iff}"></span>
        <span>${c.name || c.id} <em>${dom}</em></span>
        <span>${dist}</span>
      </div>`;
    });
    this._rdr.list.innerHTML = rows.length
      ? rows.join('')
      : `<div class="stn-contact-row"><span></span><span>NO CONTACTS IN FILTER</span><span></span></div>`;

    const nav = s.navWaypoint;
    if (nav && this._rdr.navCue) {
      this._rdr.navCue.textContent =
        `VIGIL  BRG ${formatBearing(nav.bearing)}°  ·  ${formatDistance(nav.distanceM)}  ·  marked on plot`;
    }
  }

  _updateLookout(s) {
    const zoom = s.lookoutZoom ?? 1;
    const lookBrg = s.lookBearing != null ? formatBearing(s.lookBearing) : '---';
    const shipBrg = s.heading != null ? formatBearing(s.heading) : '---';
    this._look.readout.textContent =
      `LOOK ${lookBrg}°  ·  HDG ${shipBrg}°  ·  ZOOM ${zoom.toFixed(1)}×  ·  SCROLL ZOOM  ·  E STAND`;

    const c = s.sighted;
    if (c) {
      this._look.contact.textContent = c.name || 'UNIDENTIFIED CONTACT';
      this._look.meta.textContent =
        `${(c.domain || '').toUpperCase()} · ${(c.iff || 'UNKNOWN').toUpperCase()} · ${formatDistance(c.distanceM)} · ${c.reported ? 'REPORTED' : 'CENTER R TO REPORT'}`;
      this._look.contact.style.color = c.iff === 'HOSTILE' || c.iff === 'hostile' ? 'var(--c-amber)' : 'var(--c-text)';
    } else {
      this._look.contact.textContent = 'Sweep horizon — center a contact in the crosshair';
      this._look.meta.textContent = '';
    }
  }

  dispose() {
    if (this.root?.parentElement) this.root.parentElement.removeChild(this.root);
    this.root = null;
    this._mounted = false;
  }
}

const STATION_UI = {
  HELM: {
    title: 'Helm Station',
    hint: '<kbd>1</kbd>–<kbd>6</kbd> Telegraph · <kbd>A</kbd>/<kbd>D</kbd> Rudder · <kbd>H</kbd> Hold · <kbd>F</kbd> Steer · <kbd>E</kbd> Stand',
  },
  WEAPONS: {
    title: 'Weapons Director',
    hint: '<kbd>1</kbd>–<kbd>4</kbd> Weapon · <kbd>Tab</kbd> Track · <kbd>T</kbd> Lock · Fire · <kbd>E</kbd> Stand',
  },
  RADAR: {
    title: 'Radar / Sonar CIC',
    hint: '<kbd>Q</kbd> Sonar · <kbd>[</kbd>/<kbd>]</kbd> Range · Filter · <kbd>Enter</kbd> Designate · <kbd>E</kbd> Stand',
  },
  LOOKOUT: {
    title: 'Bridge Wing Lookout',
    hint: 'Mouse Scan · Scroll Zoom · <kbd>R</kbd> Report Contact · <kbd>E</kbd> Stand',
  },
};

function compassLabel(deg) {
  const labels = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const i = Math.round((((deg % 360) + 360) % 360) / 45) % 8;
  return labels[i];
}

export { ORDER_NOTCHES };

/**
 * stations/StationOverlay.js
 *
 * Seated-station HUD layer. Appears when the player sits at Helm / Weapons /
 * Radar / Lookout — each with a distinct control read-out so the viewpoint
 * change is matched by a functional change. Pure DOM overlay; no Three.js.
 */

import './stations.css';
import { el, formatBearing, formatDistance } from '../lib/utils.js';

const WEAPON_SLOTS = [
  { key: 'gun', digit: '1', name: '130mm Deck Gun', infinite: true },
  { key: 'missile', digit: '2', name: 'Anti-Ship Missile', ammoKey: 'missile' },
  { key: 'torpedo', digit: '3', name: 'ASROC Torpedo', ammoKey: 'torpedo' },
  { key: 'drone', digit: '4', name: 'Recon Drone', ammoKey: 'drone' },
];

const ORDER_LABELS = [
  { max: -0.55, label: 'FULL ASTERN' },
  { max: -0.15, label: 'SLOW ASTERN' },
  { max: 0.08, label: 'ALL STOP' },
  { max: 0.35, label: 'SLOW AHEAD' },
  { max: 0.7, label: 'HALF AHEAD' },
  { max: 2, label: 'FLANK SPEED' },
];

function orderLabel(throttle) {
  for (const o of ORDER_LABELS) if (throttle <= o.max) return o.label;
  return 'FLANK SPEED';
}

export class StationOverlay {
  constructor() {
    this.root = null;
    this._mounted = false;
    this._station = null;
    this._panels = {};
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
        <div class="stn-helm-cluster">
          <div class="stn-gauge hud-panel">
            <div class="hud-corners"></div>
            <div class="hud-label">Heading</div>
            <div class="stn-gauge-value" data-helm="heading">000</div>
            <div class="stn-gauge-unit" data-helm="heading-label">N</div>
          </div>
          <div class="stn-telegraph hud-panel">
            <div class="hud-corners"></div>
            <div class="hud-label">Engine Order</div>
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
        <div class="stn-weapons-reticle" aria-hidden="true">
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="38"/>
            <circle cx="60" cy="60" r="8"/>
            <line x1="60" y1="6" x2="60" y2="28"/>
            <line x1="60" y1="92" x2="60" y2="114"/>
            <line x1="6" y1="60" x2="28" y2="60"/>
            <line x1="92" y1="60" x2="114" y2="60"/>
          </svg>
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
        </div>
      </div>

      <div class="stn-panel" data-panel="RADAR" hidden>
        <div class="stn-radar-side">
          <div class="stn-contact-list hud-panel">
            <div class="hud-corners"></div>
            <div class="hud-label">Contact Track</div>
            <div class="stn-contact-list-body" data-rdr="list"></div>
          </div>
          <div class="stn-sonar-panel hud-panel">
            <div class="hud-corners"></div>
            <div class="hud-label">Active Sonar</div>
            <div class="stn-hint" style="margin-top:6px"><kbd>Q</kbd> Ping subsurface contacts</div>
            <div class="stn-sonar-pulse" data-rdr="sonar"><i></i></div>
          </div>
        </div>
      </div>

      <div class="stn-panel" data-panel="LOOKOUT" hidden>
        <div class="stn-lookout-frame"></div>
        <div class="stn-lookout-cross"></div>
        <div class="stn-lookout-readout hud-panel" data-look="readout">
          BINOCULAR STATION · SCROLL TO ZOOM · E TO STAND
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
    };
    this._wpn = {
      rack: this.root.querySelector('[data-wpn="rack"]'),
      targetName: this.root.querySelector('[data-wpn="target-name"]'),
      brg: this.root.querySelector('[data-wpn="brg"]'),
      rng: this.root.querySelector('[data-wpn="rng"]'),
      domain: this.root.querySelector('[data-wpn="domain"]'),
      iff: this.root.querySelector('[data-wpn="iff"]'),
      fire: this.root.querySelector('[data-wpn="fire"]'),
    };
    this._rdr = {
      list: this.root.querySelector('[data-rdr="list"]'),
      sonar: this.root.querySelector('[data-rdr="sonar"]'),
    };
    this._look = {
      readout: this.root.querySelector('[data-look="readout"]'),
    };

    this._mounted = true;
    return this.root;
  }

  /** Sit at a station (or pass null / 'WALK' to clear). */
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

  /** Live instrument refresh — call from the main loop while seated. */
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
    // reflow so animation restarts
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

    const rudder = Math.max(-1, Math.min(1, s.rudder ?? 0));
    this._helm.rudder.style.transform = `translateX(${rudder * 32}px)`;
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
        <span class="stn-weapon-name">${slot.name}</span>
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

    const fire = this._wpn.fire;
    fire.classList.remove('is-reloading', 'is-empty', 'is-notarget');
    if (!target) {
      fire.textContent = 'SELECT TARGET · TAB';
      fire.classList.add('is-notarget');
    } else if (!ready) {
      fire.textContent = 'RELOADING';
      fire.classList.add('is-reloading');
    } else {
      const slot = WEAPON_SLOTS.find((w) => w.key === selected);
      const empty = slot && !slot.infinite && (ammo[slot.ammoKey] ?? 0) <= 0;
      if (empty) {
        fire.textContent = 'MAGAZINE EMPTY';
        fire.classList.add('is-empty');
      } else {
        fire.textContent = 'WEAPONS FREE · CLICK TO FIRE';
      }
    }
  }

  _updateRadar(s) {
    const contacts = s.contacts || [];
    const selectedId = s.selectedTargetId;
    const rows = contacts.slice(0, 12).map((c) => {
      const iff = (c.iff || 'unknown').toLowerCase();
      const dist = c.distanceM != null ? formatDistance(c.distanceM) : '';
      return `<div class="stn-contact-row ${c.id === selectedId ? 'is-selected' : ''}">
        <span class="stn-contact-dot ${iff}"></span>
        <span>${c.name || c.id}</span>
        <span>${dist}</span>
      </div>`;
    });
    this._rdr.list.innerHTML = rows.length
      ? rows.join('')
      : `<div class="stn-contact-row"><span></span><span>NO CONTACTS IN RANGE</span><span></span></div>`;
  }

  _updateLookout(s) {
    const zoom = s.lookoutZoom ?? 1;
    const bearing = s.heading != null ? formatBearing(s.heading) : '---';
    this._look.readout.textContent =
      `BRG ${bearing}°  ·  ZOOM ${zoom.toFixed(1)}×  ·  SCROLL TO ZOOM  ·  E TO STAND`;
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
    hint: '<kbd>W</kbd>/<kbd>S</kbd> Throttle · <kbd>A</kbd>/<kbd>D</kbd> Rudder · <kbd>E</kbd> Stand',
  },
  WEAPONS: {
    title: 'Weapons Station',
    hint: '<kbd>1</kbd>–<kbd>4</kbd> Select · <kbd>Tab</kbd> Target · Click Fire · <kbd>E</kbd> Stand',
  },
  RADAR: {
    title: 'Radar / Sonar',
    hint: '<kbd>Q</kbd> Sonar Ping · <kbd>Tab</kbd> Cycle Track · <kbd>E</kbd> Stand',
  },
  LOOKOUT: {
    title: 'Bridge Wing Lookout',
    hint: 'Mouse Look · Scroll Zoom · <kbd>E</kbd> Stand',
  },
};

function compassLabel(deg) {
  const labels = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const i = Math.round((((deg % 360) + 360) % 360) / 45) % 8;
  return labels[i];
}

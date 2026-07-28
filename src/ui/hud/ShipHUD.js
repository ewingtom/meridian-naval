/**
 * hud/ShipHUD.js
 *
 * In-world heads-up display shown while piloting / on deck. Renders a
 * compass ribbon, speed/throttle readout, hull integrity + subsystem
 * status, an objective ticker, a weapon/ammo readout, and an optional
 * aiming reticle — all as absolutely-positioned DOM overlaid on the
 * Three.js canvas.
 *
 * ---------------------------------------------------------------------
 * Usage
 *   import { ShipHUD } from './ui/index.js';
 *   const hud = new ShipHUD();
 *   hud.mount(document.getElementById('ui-root'));
 *   hud.update({ ... });     // call every frame / on state change
 *   hud.setAiming(true);     // show the reticle while aiming
 *   hud.hide(); hud.show();
 *   hud.dispose();
 *
 * ---------------------------------------------------------------------
 * update(state) shape (all fields optional — omitted fields keep their
 * last known value):
 * {
 *   heading: number,            // degrees, 0-360, 0 = North
 *   speedKnots: number,         // current speed in knots
 *   throttleFraction: number,   // -1..1 (reverse..full ahead), or 0..1
 *   hullPct: number,            // 0-100
 *   subsystems: {
 *     engine:  'nominal' | 'damaged' | 'destroyed',
 *     radar:   'nominal' | 'damaged' | 'destroyed',
 *     weapons: 'nominal' | 'damaged' | 'destroyed',
 *   },
 *   objective: {
 *     text: string,             // e.g. "Escort convoy to rally point"
 *     bearing: number|null,     // degrees to target, or null to hide arrow
 *     distanceM: number|null,   // meters to target
 *   },
 *   selectedWeapon: {
 *     name: string,             // e.g. "MK-45 5IN"
 *     ammo: number,
 *     maxAmmo: number,
 *     ready: boolean,           // false = reloading / cooling down
 *   },
 * }
 *
 * Constructor takes no required args. Pass { compassSpan } to control how
 * many degrees of the compass ribbon are visible at once (default 120).
 */

import './hud.css';
import { el, clamp, lerpAngleDeg, formatBearing, formatDistance, compassLabel } from '../lib/utils.js';

const SUBSYSTEM_ICONS = {
  engine: 'M4 12h3l2-5 3 10 2-7 2 4h4',
  radar: 'M12 3v5m0 0a9 9 0 0 1 9 9M12 8a9 9 0 0 0-9 9M12 8a4.5 4.5 0 0 1 4.5 4.5M12 8a4.5 4.5 0 0 0-4.5 4.5',
  weapons: 'M4 20l6-6m0 0l7-7 3 3-7 7m-3-3l3 3M15 5l4 4',
};

export class ShipHUD {
  constructor(options = {}) {
    this.options = { compassSpan: 120, ...options };
    this.root = null;
    this._mounted = false;
    this._displayHeading = 0; // eased heading used for smooth ribbon motion
    this._targetHeading = 0;
    this._rafId = null;
    this._lastState = {};
  }

  mount(container = document.getElementById('ui-root')) {
    if (this._mounted) return this.root;
    this.root = el('div', { class: 'ship-hud' });
    this.root.innerHTML = this._template();
    container.appendChild(this.root);
    this._cache();
    this._mounted = true;
    this._tick();
    return this.root;
  }

  _template() {
    return `
      <div class="shud-compass hud-panel">
        <div class="shud-compass-tape"></div>
        <div class="shud-compass-center-marker"></div>
        <div class="shud-compass-readout">
          <span class="shud-heading-num">000</span><span class="shud-heading-deg">&deg;</span>
          <span class="shud-heading-label">N</span>
        </div>
      </div>

      <div class="shud-objective hud-panel">
        <div class="hud-corners"></div>
        <div class="shud-obj-icon">&#9670;</div>
        <div class="shud-obj-body">
          <div class="hud-label">Objective</div>
          <div class="shud-obj-text">Standing by</div>
        </div>
        <div class="shud-obj-nav">
          <div class="shud-obj-arrow">&#9650;</div>
          <div class="shud-obj-dist">--</div>
        </div>
      </div>

      <div class="shud-bottom-left">
        <div class="shud-hull-block hud-panel">
          <div class="hud-corners"></div>
          <div class="hud-label">Hull Integrity</div>
          <div class="shud-hull-row">
            <div class="shud-hull-bar"><div class="shud-hull-fill"></div></div>
            <div class="shud-hull-pct">100%</div>
          </div>
          <div class="shud-subsystems">
            <div class="shud-sys" data-sys="engine">
              <svg viewBox="0 0 24 24"><path d="${SUBSYSTEM_ICONS.engine}"/></svg>
              <span>ENG</span>
            </div>
            <div class="shud-sys" data-sys="radar">
              <svg viewBox="0 0 24 24"><path d="${SUBSYSTEM_ICONS.radar}"/></svg>
              <span>RDR</span>
            </div>
            <div class="shud-sys" data-sys="weapons">
              <svg viewBox="0 0 24 24"><path d="${SUBSYSTEM_ICONS.weapons}"/></svg>
              <span>WPN</span>
            </div>
          </div>
        </div>

        <div class="shud-speed-block hud-panel">
          <div class="hud-corners"></div>
          <div class="hud-label">Speed / Throttle</div>
          <div class="shud-speed-row">
            <div class="shud-speed-num">0.0</div>
            <div class="shud-speed-unit">KTS</div>
          </div>
          <div class="shud-throttle-bar">
            <div class="shud-throttle-zero"></div>
            <div class="shud-throttle-fill"></div>
          </div>
        </div>
      </div>

      <div class="shud-bottom-right">
        <div class="shud-weapon-block hud-panel">
          <div class="hud-corners"></div>
          <div class="shud-weapon-name">--</div>
          <div class="shud-weapon-row">
            <div class="shud-ammo-pips"></div>
            <div class="shud-ammo-count">0/0</div>
          </div>
          <div class="shud-weapon-status">STANDBY</div>
        </div>
      </div>

      <div class="shud-reticle" hidden>
        <svg viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="36" class="ret-ring"/>
          <line x1="60" y1="4" x2="60" y2="26" class="ret-tick"/>
          <line x1="60" y1="94" x2="60" y2="116" class="ret-tick"/>
          <line x1="4" y1="60" x2="26" y2="60" class="ret-tick"/>
          <line x1="94" y1="60" x2="116" y2="60" class="ret-tick"/>
          <circle cx="60" cy="60" r="2.2" class="ret-dot"/>
        </svg>
      </div>
    `;
  }

  _cache() {
    const q = (s) => this.root.querySelector(s);
    this.el = {
      compassTape: q('.shud-compass-tape'),
      headingNum: q('.shud-heading-num'),
      headingLabel: q('.shud-heading-label'),
      objText: q('.shud-obj-text'),
      objArrow: q('.shud-obj-arrow'),
      objNav: q('.shud-obj-nav'),
      objDist: q('.shud-obj-dist'),
      hullFill: q('.shud-hull-fill'),
      hullPct: q('.shud-hull-pct'),
      hullBlock: q('.shud-hull-block'),
      speedNum: q('.shud-speed-num'),
      throttleFill: q('.shud-throttle-fill'),
      weaponName: q('.shud-weapon-name'),
      ammoPips: q('.shud-ammo-pips'),
      ammoCount: q('.shud-ammo-count'),
      weaponStatus: q('.shud-weapon-status'),
      weaponBlock: q('.shud-weapon-block'),
      reticle: q('.shud-reticle'),
      sysNodes: {
        engine: q('.shud-sys[data-sys="engine"]'),
        radar: q('.shud-sys[data-sys="radar"]'),
        weapons: q('.shud-sys[data-sys="weapons"]'),
      },
    };
  }

  /** Smoothly animates the compass ribbon toward the latest heading each frame. */
  _tick() {
    this._rafId = requestAnimationFrame(() => this._tick());
    if (!this._mounted) return;
    const diff = ((this._targetHeading - this._displayHeading + 540) % 360) - 180;
    if (Math.abs(diff) > 0.05) {
      this._displayHeading = lerpAngleDeg(this._displayHeading, this._targetHeading, 0.18);
      this._renderCompass(this._displayHeading);
    }
  }

  _renderCompass(heading) {
    const span = this.options.compassSpan;
    // Ribbon marks every 15 degrees across the visible span, offset by heading.
    const pxPerDeg = this.el.compassTape.parentElement.clientWidth / span || 4;
    const marks = [];
    const start = Math.floor((heading - span / 2) / 15) * 15;
    for (let d = start; d <= heading + span / 2 + 15; d += 15) {
      const norm = ((d % 360) + 360) % 360;
      const offset = (d - heading) * pxPerDeg;
      const major = norm % 90 === 0;
      const label = norm % 45 === 0 ? compassLabel(norm) : (norm % 15 === 0 ? formatBearing(norm) : '');
      marks.push(`<div class="shud-tick ${major ? 'major' : ''}" style="left:calc(50% + ${offset}px)">
        <span class="shud-tick-line"></span>
        ${label ? `<span class="shud-tick-label">${label}</span>` : ''}
      </div>`);
    }
    this.el.compassTape.innerHTML = marks.join('');
    this.el.headingNum.textContent = formatBearing(heading);
    this.el.headingLabel.textContent = compassLabel(heading);
  }

  /** Push a new state snapshot into the HUD. Fields are merged onto the last known state. */
  update(state = {}) {
    if (!this._mounted) return;
    const s = { ...this._lastState, ...state };
    this._lastState = s;

    if (typeof state.heading === 'number') {
      this._targetHeading = ((state.heading % 360) + 360) % 360;
    }

    if (typeof s.speedKnots === 'number') {
      this.el.speedNum.textContent = s.speedKnots.toFixed(1);
    }
    if (typeof s.throttleFraction === 'number') {
      const t = clamp(s.throttleFraction, -1, 1);
      // Bar centered at zero: fills right for forward, left for reverse.
      const pct = Math.abs(t) * 50;
      this.el.throttleFill.style.width = `${pct}%`;
      this.el.throttleFill.style.left = t >= 0 ? '50%' : `${50 - pct}%`;
      this.el.throttleFill.classList.toggle('reverse', t < 0);
    }

    if (typeof s.hullPct === 'number') {
      const pct = clamp(s.hullPct, 0, 100);
      this.el.hullFill.style.width = `${pct}%`;
      this.el.hullPct.textContent = `${Math.round(pct)}%`;
      this.el.hullBlock.classList.toggle('critical', pct <= 25);
      this.el.hullBlock.classList.toggle('warning', pct > 25 && pct <= 50);
    }

    if (s.subsystems) {
      for (const [key, node] of Object.entries(this.el.sysNodes)) {
        const status = s.subsystems[key];
        if (!status) continue;
        node.classList.remove('nominal', 'damaged', 'destroyed');
        node.classList.add(status);
      }
    }

    if (s.objective) {
      this.el.objText.textContent = s.objective.text || '';
      const hasNav = s.objective.bearing != null;
      this.el.objNav.style.display = hasNav ? '' : 'none';
      if (hasNav) {
        this.el.objArrow.style.transform = `rotate(${s.objective.bearing}deg)`;
        this.el.objDist.textContent = formatDistance(s.objective.distanceM);
      }
    }

    if (s.selectedWeapon) {
      const w = s.selectedWeapon;
      this.el.weaponName.textContent = w.name || '--';
      this.el.ammoCount.textContent = `${w.ammo ?? 0}/${w.maxAmmo ?? 0}`;
      this._renderAmmoPips(w.ammo ?? 0, w.maxAmmo ?? 0);
      this.el.weaponStatus.textContent = w.ready ? 'READY' : 'RELOADING';
      this.el.weaponBlock.classList.toggle('not-ready', !w.ready);
    }
  }

  _renderAmmoPips(ammo, maxAmmo) {
    const cap = Math.min(maxAmmo || 0, 24); // cap pip count for very large magazines
    const filled = maxAmmo > 0 ? Math.round((ammo / maxAmmo) * cap) : 0;
    let html = '';
    for (let i = 0; i < cap; i++) {
      html += `<span class="shud-pip ${i < filled ? 'filled' : ''}"></span>`;
    }
    this.el.ammoPips.innerHTML = html;
  }

  /** Toggle the center aiming reticle. */
  setAiming(isAiming) {
    if (!this.el) return;
    this.el.reticle.hidden = !isAiming;
  }

  show() {
    if (this.root) this.root.classList.remove('shud-hidden');
  }

  hide() {
    if (this.root) this.root.classList.add('shud-hidden');
  }

  dispose() {
    if (this._rafId) cancelAnimationFrame(this._rafId);
    if (this.root && this.root.parentElement) this.root.parentElement.removeChild(this.root);
    this.root = null;
    this._mounted = false;
  }
}

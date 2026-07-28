/**
 * notifications/DamageVignette.js
 *
 * Full-screen damage overlay: a persistent red vignette that intensifies
 * as hull integrity drops, plus a sharp directional-agnostic flash pulse
 * on individual hits. Pure CSS overlay (no canvas needed), pointer-events
 * disabled throughout so it never blocks input. Styles live in
 * notifications/comms.css alongside CommsLog.
 *
 * ---------------------------------------------------------------------
 * Usage
 *   const vignette = new DamageVignette();
 *   vignette.mount(document.getElementById('ui-root'));
 *   vignette.setHullPct(72);        // call whenever hull % changes
 *   vignette.flashHit(0.6);         // call on every hit taken, 0-1 intensity
 *
 * Public API:
 *   setHullPct(pct: number)             // 0-100, drives the persistent edge vignette
 *   flashHit(intensityFraction: number) // 0-1, one-shot flash pulse
 */

import './comms.css';
import { el, clamp } from '../lib/utils.js';

export class DamageVignette {
  constructor(options = {}) {
    this.options = options;
    this.root = null;
    this._mounted = false;
    this._hullPct = 100;
    this._flashTimer = null;
  }

  mount(container = document.getElementById('ui-root')) {
    if (this._mounted) return this.root;
    this.root = el('div', { class: 'damage-vignette' });
    this.root.innerHTML = `
      <div class="dv-base"></div>
      <div class="dv-flash"></div>
    `;
    container.appendChild(this.root);
    this._base = this.root.querySelector('.dv-base');
    this._flash = this.root.querySelector('.dv-flash');
    this._mounted = true;
    this._applyHullState();
    return this.root;
  }

  /** Convenience alias: update({ hullPct }) forwards to setHullPct. */
  update(data = {}) {
    if (typeof data.hullPct === 'number') this.setHullPct(data.hullPct);
  }

  setHullPct(pct) {
    this._hullPct = clamp(pct, 0, 100);
    this._applyHullState();
  }

  _applyHullState() {
    if (!this._mounted) return;
    // Vignette starts appearing once hull drops below 60%, ramping to max at 0%.
    const damageFrac = clamp((60 - this._hullPct) / 60, 0, 1);
    this._base.style.setProperty('--dv-base-alpha', damageFrac.toFixed(3));
    this.root.classList.toggle('dv-critical', this._hullPct <= 25);
  }

  /** One-shot flash pulse on taking a hit. intensityFraction: 0 (none) - 1 (max). */
  flashHit(intensityFraction = 0.5) {
    if (!this._mounted) return;
    const intensity = clamp(intensityFraction, 0, 1);
    this._flash.style.setProperty('--dv-flash-alpha', (0.25 + intensity * 0.55).toFixed(3));
    // restart the animation even if it's already running
    this._flash.classList.remove('dv-flash-play');
    void this._flash.offsetWidth;
    this._flash.classList.add('dv-flash-play');
  }

  show() { if (this.root) this.root.classList.remove('dv-hidden'); }
  hide() { if (this.root) this.root.classList.add('dv-hidden'); }

  dispose() {
    if (this._flashTimer) clearTimeout(this._flashTimer);
    if (this.root && this.root.parentElement) this.root.parentElement.removeChild(this.root);
    this.root = null;
    this._mounted = false;
  }
}

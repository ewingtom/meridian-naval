/**
 * radar/TacticalRadar.js
 *
 * Circular sweep radar rendered on a <canvas> (fully procedural, no image
 * assets). Lives in a corner tactical panel: rotating sweep line with a
 * fading trail, labeled range rings, and contact blips shaped/colored by
 * domain + IFF. Contacts fade+ping in when first seen, fade out when
 * removed, and are clickable to select.
 *
 * ---------------------------------------------------------------------
 * Coordinate convention (important — this is a contract, not Three.js
 * world space): each contact's `x`/`z` are meters **relative to the
 * player**, where +x = east of player, +z = north of player. The
 * integrator is responsible for converting whatever the 3D engine's
 * scene axes are into this simplified nav convention before calling
 * update(). Bearing is then computed internally as
 * atan2(x, z) in degrees (0 = dead ahead of true north, clockwise).
 *
 * ---------------------------------------------------------------------
 * Usage
 *   const radar = new TacticalRadar({ onSelectContact: (id) => ... });
 *   radar.mount(document.getElementById('ui-root'));
 *   radar.update({ rangeM: 8000, playerHeading: 47, contacts: [...] });
 *   radar.setNorthUp(false); // default is heading-up (false = heading-up)
 *
 * update(data) shape:
 * {
 *   rangeM: number,            // radius of the outermost ring, in meters
 *   playerHeading: number,     // degrees, 0-360, player's current heading
 *   contacts: [
 *     {
 *       id: string|number,     // stable identifier, used for selection + animation tracking
 *       x: number,             // meters east of player
 *       z: number,             // meters north of player
 *       domain: 'surface'|'air'|'subsurface',
 *       iff: 'friendly'|'hostile'|'unknown',
 *       name: string,          // optional label, e.g. "MASTER 3"
 *       selected: boolean,     // optional, draws a selection ring
 *     }, ...
 *   ]
 * }
 *
 * Constructor options:
 *   onSelectContact(id) — called when the user clicks a contact blip.
 *   northUp: boolean    — initial orientation mode (default false = heading-up).
 *   size: number         — panel diameter in px (default 260).
 */

import './radar.css';
import { el, clamp } from '../lib/utils.js';

const RING_COUNT = 4;
const SWEEP_PERIOD_S = 4.2; // seconds per full rotation
const SWEEP_TRAIL_DEG = 70; // trailing fade wedge, degrees
const CONTACT_APPEAR_MS = 550;
const CONTACT_REMOVE_MS = 400;
const PING_MS = 900;

const IFF_COLOR = {
  friendly: '#3dffa0',
  hostile: '#ff4444',
  unknown: '#ffb02e',
};

export class TacticalRadar {
  constructor(options = {}) {
    this.options = { northUp: false, size: 260, ...options };
    this.onSelectContact = options.onSelectContact || null;
    this.root = null;
    this.canvas = null;
    this.ctx = null;
    this._mounted = false;
    this._dpr = Math.min(window.devicePixelRatio || 1, 2);
    this._sweepAngle = 0; // radians, current sweep position
    this._stopTicker = null;
    this._data = { rangeM: 5000, playerHeading: 0, contacts: [] };
    this._contactState = new Map(); // id -> tracked animation state
    this._hitTargets = []; // populated each render: {id, x, y, r}
    this._northUp = this.options.northUp;

    this._onResize = this._onResize.bind(this);
    this._onClick = this._onClick.bind(this);
  }

  mount(container = document.getElementById('ui-root')) {
    if (this._mounted) return this.root;
    this.root = el('div', { class: 'tac-radar hud-panel' });
    this.root.innerHTML = `
      <div class="hud-corners"></div>
      <div class="tac-radar-header">
        <span class="hud-label">Tactical</span>
        <span class="tac-radar-mode" title="Toggle orientation">${this._northUp ? 'NORTH UP' : 'HDG UP'}</span>
      </div>
      <canvas class="tac-radar-canvas"></canvas>
      <div class="tac-radar-range hud-label">RNG --</div>
    `;
    this.root.style.setProperty('--radar-size', `${this.options.size}px`);
    container.appendChild(this.root);

    this.canvas = this.root.querySelector('.tac-radar-canvas');
    this.ctx = this.canvas.getContext('2d');
    this._modeLabel = this.root.querySelector('.tac-radar-mode');
    this._rangeLabel = this.root.querySelector('.tac-radar-range');

    this._modeLabel.addEventListener('click', () => this.setNorthUp(!this._northUp));
    this.canvas.addEventListener('click', this._onClick);
    window.addEventListener('resize', this._onResize);

    this._resizeCanvas();
    this._mounted = true;

    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      this._sweepAngle = (this._sweepAngle + (dt / SWEEP_PERIOD_S) * Math.PI * 2) % (Math.PI * 2);
      this._render();
      this._rafId = requestAnimationFrame(loop);
    };
    this._rafId = requestAnimationFrame(loop);

    return this.root;
  }

  _resizeCanvas() {
    const size = this.options.size;
    this.canvas.width = size * this._dpr;
    this.canvas.height = size * this._dpr;
    this.canvas.style.width = `${size}px`;
    this.canvas.style.height = `${size}px`;
    this.ctx.setTransform(this._dpr, 0, 0, this._dpr, 0, 0);
  }

  _onResize() {
    // panel size is fixed by design (--radar-size), but keep DPR in sync
    // in case the window moves to a display with a different pixel ratio.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (dpr !== this._dpr) {
      this._dpr = dpr;
      this._resizeCanvas();
    }
  }

  /** Push new radar data. Diffs contact ids against the previous frame to drive appear/remove animations. */
  update(data = {}) {
    if (data.rangeM != null) this._data.rangeM = data.rangeM;
    if (data.playerHeading != null) this._data.playerHeading = data.playerHeading;
    if (this._rangeLabel) this._rangeLabel.textContent = `RNG ${this._formatRange(this._data.rangeM)}`;

    if (data.contacts) {
      const seen = new Set();
      const now = performance.now();
      for (const c of data.contacts) {
        seen.add(c.id);
        let s = this._contactState.get(c.id);
        if (!s) {
          s = { appearedAt: now, removing: false };
          this._contactState.set(c.id, s);
        }
        s.data = c;
        s.removing = false;
      }
      // mark contacts absent from this update as removing (fade-out), purge once done
      for (const [id, s] of this._contactState.entries()) {
        if (!seen.has(id) && !s.removing) {
          s.removing = true;
          s.removedAt = now;
        }
      }
    }
  }

  _formatRange(m) {
    return m >= 1000 ? `${(m / 1000).toFixed(1)}KM` : `${Math.round(m)}M`;
  }

  _onClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    let best = null, bestDist = Infinity;
    for (const t of this._hitTargets) {
      const d = Math.hypot(mx - t.x, my - t.y);
      if (d <= Math.max(t.r, 10) && d < bestDist) { best = t; bestDist = d; }
    }
    if (best && this.onSelectContact) this.onSelectContact(best.id);
  }

  setNorthUp(isNorthUp) {
    this._northUp = isNorthUp;
    if (this._modeLabel) this._modeLabel.textContent = isNorthUp ? 'NORTH UP' : 'HDG UP';
  }

  _render() {
    const ctx = this.ctx;
    const size = this.options.size;
    const cx = size / 2, cy = size / 2;
    const R = size / 2 - 14;

    ctx.clearRect(0, 0, size, size);

    // rotation applied to world bearings so "up" means heading (unless north-up)
    const rot = this._northUp ? 0 : -this._data.playerHeading;

    this._drawRings(ctx, cx, cy, R);
    this._drawSweep(ctx, cx, cy, R);
    this._drawOwnShip(ctx, cx, cy, rot);
    this._hitTargets = [];
    this._drawContacts(ctx, cx, cy, R, rot);
  }

  _drawRings(ctx, cx, cy, R) {
    ctx.save();
    ctx.strokeStyle = 'rgba(120,210,230,0.28)';
    ctx.fillStyle = 'rgba(130,220,235,0.55)';
    ctx.font = '9px var(--font-mono), monospace';
    ctx.lineWidth = 1;
    for (let i = 1; i <= RING_COUNT; i++) {
      const r = (R * i) / RING_COUNT;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    // cardinal crosshair lines
    ctx.beginPath();
    ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy);
    ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R);
    ctx.strokeStyle = 'rgba(120,210,230,0.14)';
    ctx.stroke();
    ctx.restore();
  }

  _drawSweep(ctx, cx, cy, R) {
    ctx.save();
    ctx.translate(cx, cy);
    const trailRad = (SWEEP_TRAIL_DEG * Math.PI) / 180;
    const grad = ctx.createConicGradient
      ? ctx.createConicGradient(this._sweepAngle - trailRad, 0, 0)
      : null;
    if (grad) {
      grad.addColorStop(0, 'rgba(77,232,255,0)');
      grad.addColorStop(1, 'rgba(77,232,255,0.28)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, R, this._sweepAngle - trailRad, this._sweepAngle);
      ctx.closePath();
      ctx.fill();
    } else {
      // fallback for engines without conic gradients: stepped wedge segments
      const steps = 14;
      for (let i = 0; i < steps; i++) {
        const a0 = this._sweepAngle - trailRad + (trailRad * i) / steps;
        const a1 = this._sweepAngle - trailRad + (trailRad * (i + 1)) / steps;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, R, a0, a1);
        ctx.closePath();
        ctx.fillStyle = `rgba(77,232,255,${(0.28 * i) / steps})`;
        ctx.fill();
      }
    }
    // leading sweep line
    ctx.strokeStyle = 'rgba(77,232,255,0.9)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(R * Math.cos(this._sweepAngle), R * Math.sin(this._sweepAngle));
    ctx.stroke();
    ctx.restore();
  }

  _drawOwnShip(ctx, cx, cy, rot) {
    ctx.save();
    ctx.translate(cx, cy);
    // heading-up: own heading always points up (0). north-up: rotate marker to actual heading.
    const angle = this._northUp ? ((this._data.playerHeading || 0) * Math.PI) / 180 : 0;
    ctx.rotate(angle);
    ctx.fillStyle = '#ffb02e';
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(5, 6);
    ctx.lineTo(0, 3);
    ctx.lineTo(-5, 6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  _drawContacts(ctx, cx, cy, R, rot) {
    const now = performance.now();
    const range = this._data.rangeM || 1;

    for (const [id, s] of this._contactState.entries()) {
      const c = s.data;
      if (!c) continue;

      // fade progress
      let alpha = 1;
      if (s.removing) {
        const t = clamp((now - s.removedAt) / CONTACT_REMOVE_MS, 0, 1);
        alpha = 1 - t;
        if (t >= 1) { this._contactState.delete(id); continue; }
      } else {
        const t = clamp((now - s.appearedAt) / CONTACT_APPEAR_MS, 0, 1);
        alpha = t;
      }

      const distM = Math.hypot(c.x, c.z);
      const bearingDeg = (Math.atan2(c.x, c.z) * 180) / Math.PI; // 0=north, clockwise
      const screenDeg = bearingDeg + rot;
      const screenRad = ((screenDeg - 90) * Math.PI) / 180; // -90 so 0deg (north/heading) points up
      const r = clamp(distM / range, 0, 1) * R;
      const px = cx + r * Math.cos(screenRad);
      const py = cy + r * Math.sin(screenRad);

      const color = IFF_COLOR[c.iff] || IFF_COLOR.unknown;
      const scale = s.removing ? 1 : 0.5 + 0.5 * alpha; // pop-in scale on appear

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(px, py);
      ctx.scale(scale, scale);
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1.4;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;

      this._drawContactGlyph(ctx, c.domain);

      if (c.selected) {
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(255,255,255,0.85)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, 9, 0, Math.PI * 2);
        ctx.stroke();
      }

      // ping ring on recent appearance
      if (!s.removing) {
        const pingT = (now - s.appearedAt) / PING_MS;
        if (pingT >= 0 && pingT <= 1) {
          ctx.shadowBlur = 0;
          ctx.globalAlpha = alpha * (1 - pingT);
          ctx.beginPath();
          ctx.arc(0, 0, 4 + pingT * 16, 0, Math.PI * 2);
          ctx.strokeStyle = color;
          ctx.stroke();
        }
      }
      ctx.restore();

      if (c.name) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.font = '9px var(--font-mono), monospace';
        ctx.fillText(c.name, px + 8, py - 6);
        ctx.restore();
      }

      this._hitTargets.push({ id, x: px, y: py, r: 10 });
    }
  }

  _drawContactGlyph(ctx, domain) {
    ctx.beginPath();
    if (domain === 'air') {
      // diamond
      ctx.moveTo(0, -6); ctx.lineTo(5, 0); ctx.lineTo(0, 6); ctx.lineTo(-5, 0);
      ctx.closePath();
      ctx.stroke();
    } else if (domain === 'subsurface') {
      // dashed submerged circle
      ctx.setLineDash([2, 2]);
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    } else {
      // surface: triangle
      ctx.moveTo(0, -6); ctx.lineTo(5.5, 5); ctx.lineTo(-5.5, 5);
      ctx.closePath();
      ctx.stroke();
    }
  }

  show() { if (this.root) this.root.classList.remove('tac-radar-hidden'); }
  hide() { if (this.root) this.root.classList.add('tac-radar-hidden'); }

  dispose() {
    if (this._rafId) cancelAnimationFrame(this._rafId);
    window.removeEventListener('resize', this._onResize);
    if (this.canvas) this.canvas.removeEventListener('click', this._onClick);
    if (this.root && this.root.parentElement) this.root.parentElement.removeChild(this.root);
    this.root = null;
    this._mounted = false;
    this._contactState.clear();
  }
}

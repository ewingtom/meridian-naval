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
  { key: 'missile', digit: '2', name: 'Anti-Ship Missile', ammoKey: 'missile', role: 'SURFACE' },
  { key: 'sam', digit: '3', name: 'Air Defense Missile', ammoKey: 'sam', role: 'AIR' },
  { key: 'lacm', digit: '4', name: 'Land Attack Cruise', ammoKey: 'lacm', role: 'LAND' },
  { key: 'torpedo', digit: '5', name: 'ASROC Torpedo', ammoKey: 'torpedo', role: 'SUBSURFACE' },
  { key: 'drone', digit: '6', name: 'Recon Drone', ammoKey: 'drone', role: 'ISR' },
];

const ORDER_NOTCHES = [
  { value: -1, label: 'FULL ASTERN', key: '1' },
  { value: -0.35, label: 'SLOW ASTERN', key: '2' },
  { value: 0, label: 'ALL STOP', key: '3' },
  { value: 0.35, label: 'SLOW AHEAD', key: '4' },
  { value: 0.7, label: 'HALF AHEAD', key: '5' },
  { value: 1, label: 'FLANK SPEED', key: '6' },
];

/* ==========================================================================
   GCCS-M (TAO) support — MIL-STD-2525 symbology, chart maths, formatting.
   ==========================================================================
   Frame shape carries affiliation and frame closure carries battle dimension:
     friend   circle        hostile  diamond
     neutral  square        unknown  quatrefoil ("cloverleaf")
     surface  closed frame  air      open at the bottom
     subsurface  open at the top
   Frame colours follow the standard's affiliation colours: cyan friend, red
   hostile, green neutral, yellow unknown. */

const NM_M = 1852;
/** Fictional op area (Philippine Sea / Ryukyus) used as the datum the plot's
 *  dead-reckoned lat/long is expressed against. */
const TAO_ORIGIN = { lat: 24.7333, lon: 122.1667 };
/** Canvas needs a resolved font stack — `var(--font-mono)` silently fails to parse
 *  in ctx.font and leaves the previous font in place. */
const TAO_FONT = 'ui-monospace, "SF Mono", Menlo, Consolas, "Roboto Mono", monospace';
const TAO_MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const TAO_C = {
  /* Fielded GCCS-M / COP GEO views: deep blue-black sea, muted olive land,
     cyan/amber Motif chrome — not a game radar green. */
  sea: '#031018',
  seaHi: '#071c28',
  land: '#2a3a2e',
  landEdge: 'rgba(120, 150, 110, 0.55)',
  landFill: 'rgba(58, 78, 58, 0.72)',
  grid: 'rgba(94, 140, 156, 0.20)',
  gridMajor: 'rgba(124, 178, 196, 0.42)',
  gridText: 'rgba(138, 178, 192, 0.6)',
  ring: 'rgba(104, 156, 172, 0.38)',
  ringMajor: 'rgba(150, 200, 216, 0.75)',
  ringText: 'rgba(158, 200, 214, 0.75)',
  bezel: 'rgba(150, 190, 205, 0.45)',
  cursor: 'rgba(160, 220, 235, 0.55)',
  hover: 'rgba(255, 255, 255, 0.55)',
  hookText: '#ffffff',
  blockBg: 'rgba(4, 20, 29, 0.92)',
  own: '#7ef2ff',
  ownDim: 'rgba(126, 242, 255, 0.6)',
  ownFill: 'rgba(126, 242, 255, 0.16)',
  scaleA: 'rgba(190, 220, 230, 0.85)',
  scaleB: 'rgba(20, 44, 55, 0.85)',
  scan: 'rgba(90, 160, 180, 0.06)',
};

const TAO_AFFIL = {
  friend:  { key: 'friend',  short: 'FRND', long: 'FRIEND',  color: '#4de8ff', dim: 'rgba(77,232,255,0.62)',  fill: 'rgba(77,232,255,0.10)' },
  hostile: { key: 'hostile', short: 'HOST', long: 'HOSTILE', color: '#ff4d4d', dim: 'rgba(255,77,77,0.66)',   fill: 'rgba(255,77,77,0.12)' },
  neutral: { key: 'neutral', short: 'NEUT', long: 'NEUTRAL', color: '#3dff8f', dim: 'rgba(61,255,143,0.6)',   fill: 'rgba(61,255,143,0.10)' },
  unknown: { key: 'unknown', short: 'UNK',  long: 'UNKNOWN', color: '#ffdf3d', dim: 'rgba(255,223,61,0.62)',  fill: 'rgba(255,223,61,0.10)' },
};

function taoAffiliation(iff) {
  const v = String(iff || 'unknown').toLowerCase();
  if (v.startsWith('friend') || v === 'own') return TAO_AFFIL.friend;
  if (v.startsWith('host') || v === 'enemy') return TAO_AFFIL.hostile;
  if (v.startsWith('neut')) return TAO_AFFIL.neutral;
  return TAO_AFFIL.unknown;
}

function taoDimension(domain) {
  const v = String(domain || '').toUpperCase();
  if (v.startsWith('AIR')) return 'AIR';
  if (v.startsWith('SUB')) return 'SUBSURFACE';
  return 'SURFACE';
}

function taoCategory(domain) {
  const d = taoDimension(domain);
  return d === 'AIR' ? 'AIR' : d === 'SUBSURFACE' ? 'SUB' : 'SURF';
}
function taoCategoryLong(domain) {
  const d = taoDimension(domain);
  return d === 'AIR' ? 'AIR CONTACT' : d === 'SUBSURFACE' ? 'SUBSURFACE' : 'SEA SURFACE';
}

/** Stable 4-digit track number from an entity id — real tracks are referred to by
 *  number on the net, not by a friendly name. */
function taoTrackNumber(id) {
  let hash = 0;
  const str = String(id);
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  return String(1000 + (hash % 8999));
}

/** Traces the MIL-STD-2525 frame for an affiliation/dimension pair. Open frames
 *  (air / subsurface) are deliberately left unclosed so they stroke as open shapes. */
function taoFramePath(ctx, x, y, s, affil, dim) {
  const PI = Math.PI;
  ctx.beginPath();
  if (affil === 'friend') {
    if (dim === 'AIR') ctx.arc(x, y, s, PI, 0);              // upper half — open below
    else if (dim === 'SUBSURFACE') ctx.arc(x, y, s, 0, PI);  // lower half — open above
    else ctx.arc(x, y, s, 0, PI * 2);
  } else if (affil === 'hostile') {
    const t = s * 1.22;
    if (dim === 'AIR') { ctx.moveTo(x - s, y); ctx.lineTo(x, y - t); ctx.lineTo(x + s, y); }
    else if (dim === 'SUBSURFACE') { ctx.moveTo(x - s, y); ctx.lineTo(x, y + t); ctx.lineTo(x + s, y); }
    else { ctx.moveTo(x, y - t); ctx.lineTo(x + s, y); ctx.lineTo(x, y + t); ctx.lineTo(x - s, y); ctx.closePath(); }
  } else if (affil === 'neutral') {
    if (dim === 'AIR') { ctx.moveTo(x - s, y + s); ctx.lineTo(x - s, y - s); ctx.lineTo(x + s, y - s); ctx.lineTo(x + s, y + s); }
    else if (dim === 'SUBSURFACE') { ctx.moveTo(x - s, y - s); ctx.lineTo(x - s, y + s); ctx.lineTo(x + s, y + s); ctx.lineTo(x + s, y - s); }
    else ctx.rect(x - s, y - s, s * 2, s * 2);
  } else {
    // Quatrefoil: a square whose four sides bulge outward into semicircles.
    const a = s * 0.6;
    if (dim === 'AIR') {
      ctx.moveTo(x - 2 * a, y);
      ctx.arc(x - a, y, a, PI, PI * 1.5);
      ctx.arc(x, y - a, a, PI, 0);
      ctx.arc(x + a, y, a, PI * 1.5, PI * 2);
    } else if (dim === 'SUBSURFACE') {
      ctx.moveTo(x - 2 * a, y);
      ctx.arc(x - a, y, a, PI, PI * 0.5, true);
      ctx.arc(x, y + a, a, PI, 0, true);
      ctx.arc(x + a, y, a, PI * 0.5, 0, true);
    } else {
      ctx.arc(x, y - a, a, PI, 0);
      ctx.arc(x + a, y, a, PI * 1.5, PI * 0.5);
      ctx.arc(x, y + a, a, 0, PI);
      ctx.arc(x - a, y, a, PI * 0.5, PI * 1.5);
      ctx.closePath();
    }
  }
}

function fmtLat(deg) {
  const h = deg < 0 ? 'S' : 'N';
  const d = Math.abs(deg);
  const whole = Math.floor(d);
  const min = (d - whole) * 60;
  return `${String(whole).padStart(2, '0')}°${min.toFixed(1).padStart(4, '0')}'${h}`;
}
function fmtLon(deg) {
  const h = deg < 0 ? 'W' : 'E';
  const d = Math.abs(deg);
  const whole = Math.floor(d);
  const min = (d - whole) * 60;
  return `${String(whole).padStart(3, '0')}°${min.toFixed(1).padStart(4, '0')}'${h}`;
}
/** Rounds a range-ring / scale-bar interval to a chart-like 1/2/5 x 10^n value. */
function niceRingStep(spanNM) {
  const raw = spanNM / 4;
  const pow = Math.pow(10, Math.floor(Math.log10(Math.max(raw, 0.01))));
  const n = raw / pow;
  return (n >= 5 ? 5 : n >= 2 ? 2 : 1) * pow;
}
const p2 = (n) => String(n).padStart(2, '0');
const escapeAttr = (s) => String(s).replace(/[&<>"']/g, (ch) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

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
    this.onSelectContact = null; // (id) => void — click a contact row
    this.onDesignate = null; // () => void — double-click / Enter pathway from UI
    this._lastListUpdate = 0; // throttles the innerHTML-rebuilding stations, see update()
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
            <div class="stn-solution-meta" data-wpn="solution-meta">Scan to acquire · Tab cycle · Scroll zoom</div>
            <div class="stn-wpn-zoom" data-wpn="zoom">ZOOM 1.0×</div>
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
            <kbd>R</kbd> Lock boresight · <kbd>T</kbd> Track · Scroll zoom · <kbd>F</kbd> Fire · <kbd>1–6</kbd> Weapon
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
              <button type="button" data-filter="LAND">LAND</button>
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

      <div class="stn-panel" data-panel="SONAR" hidden>
        <div class="stn-radar-side">
          <div class="stn-sonar-panel hud-panel">
            <div class="hud-corners"></div>
            <div class="hud-label">Active Sonar</div>
            <div class="stn-hint" style="margin-top:6px"><kbd>Q</kbd> Ping · localize submerged contacts</div>
            <div class="stn-sonar-pulse" data-snr="sonar"><i></i></div>
            <div class="stn-nav-cue" data-snr="depth">No subsurface contact</div>
          </div>
          <div class="stn-contact-list hud-panel">
            <div class="hud-corners"></div>
            <div class="hud-label">Subsurface Contacts</div>
            <div class="stn-contact-list-body" data-snr="list"></div>
          </div>
        </div>
      </div>

      <div class="stn-panel" data-panel="TAO" hidden>
        <div class="stn-gccsm">
          <div class="gccsm-window">
            <div class="gccsm-classbar">SECRET // REL TO CTF-71 — HANDLE VIA GENSER CHANNELS ONLY</div>
            <div class="gccsm-titlebar">
              <span class="gccsm-winicon"></span>
              <span class="gccsm-wintitle">GCCS-M 4.1.2 — TACTICAL DISPLAY (GEO)</span>
              <span class="gccsm-winmeta" data-tao="unit">COP: CTF-71 · TDBM LOCAL · USS MERIDIAN (DDG&#8209;119)</span>
              <span class="gccsm-winbtns"><i>_</i><i>&#9723;</i><i>&#10005;</i></span>
            </div>
            <div class="gccsm-menubar">
              <span>File</span><span>Edit</span><span>View</span><span>Track</span><span>Overlay</span>
              <span>Filter</span><span>Geo</span><span>Tools</span><span>Window</span><span>Help</span>
            </div>
            <div class="gccsm-toolbar" data-tao="toolbar">
              <button type="button" class="gccsm-tool" data-gtool="out" title="Zoom out — increase area coverage">RNG&minus;</button>
              <button type="button" class="gccsm-tool" data-gtool="in" title="Zoom in — decrease area coverage">RNG+</button>
              <span class="gccsm-toolsep"></span>
              <button type="button" class="gccsm-tool is-on" data-gtool="rings" title="Range rings about own unit">RINGS</button>
              <button type="button" class="gccsm-tool is-on" data-gtool="grid" title="Lat/long graticule">GRAT</button>
              <button type="button" class="gccsm-tool is-on" data-gtool="vec" title="Course/speed leaders">LEADER</button>
              <button type="button" class="gccsm-tool is-on" data-gtool="lbl" title="Track labels / amplifiers">AMPL</button>
              <button type="button" class="gccsm-tool is-on" data-gtool="hist" title="Track position history">HIST</button>
              <span class="gccsm-toolsep"></span>
              <button type="button" class="gccsm-tool" data-gtool="drop" title="Drop the current hook">DROP HOOK</button>
              <span class="gccsm-toolstatus" data-tao="mode">HOOK MODE — PICK A TRACK</span>
            </div>
            <div class="gccsm-chartwrap">
              <canvas class="gccsm-canvas"></canvas>
              <div class="gccsm-legend">
                <span><i class="gccsm-lg-shape friend"></i>FRIEND</span>
                <span><i class="gccsm-lg-shape hostile"></i>HOSTILE</span>
                <span><i class="gccsm-lg-shape neutral"></i>NEUTRAL</span>
                <span><i class="gccsm-lg-shape unknown"></i>UNKNOWN</span>
              </div>
            </div>
            <div class="gccsm-statusbar">
              <span data-tao="cursor">CURSOR &nbsp;--°--.-'N &nbsp;---°--.-'E</span>
              <span data-tao="cursorbr">BRG --- / RNG ---</span>
              <span data-tao="scale">SCALE 1:------</span>
              <span data-tao="count">TRK 000</span>
              <span data-tao="zulu">--:--:--Z</span>
            </div>
            <div class="gccsm-classbar">SECRET // REL TO CTF-71</div>
          </div>
          <div class="stn-radar-side">
            <div class="gccsm-pane">
              <div class="gccsm-panehead">Task Force Net</div>
              <div class="gccsm-panebody">
                <div class="stn-tao-status" data-tao="status">WEAPONS HOLD · NO SHARED TRACK</div>
                <div class="stn-hint" style="margin-top:6px">
                  <kbd>C</kbd> Share · <kbd>V</kbd> Free · <kbd>B</kbd> Hold · <kbd>N</kbd> Ping · <kbd>M</kbd> Screen · <kbd>Y</kbd> Wilco
                </div>
              </div>
            </div>
            <div class="gccsm-pane gccsm-tracktable">
              <div class="gccsm-panehead">Track Manager <span data-tao="tcount">000 TRK</span></div>
              <div class="gccsm-table-head">
                <span>TN</span><span>ID</span><span>CAT</span><span>BRG</span><span>RNG</span><span>CSE</span><span>SPD</span>
              </div>
              <div class="stn-contact-list-body" data-tao="list"></div>
            </div>
            <div class="gccsm-pane gccsm-detail">
              <div class="gccsm-panehead">Hooked Track — Data Block</div>
              <div class="gccsm-detail-body" data-tao="detail"></div>
            </div>
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
      reticle: this.root.querySelector('.stn-weapons-reticle'),
      zoom: this.root.querySelector('[data-wpn="zoom"]'),
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
    this._snr = {
      list: this.root.querySelector('[data-snr="list"]'),
      sonar: this.root.querySelector('[data-snr="sonar"]'),
      depth: this.root.querySelector('[data-snr="depth"]'),
    };
    this._tao = {
      status: this.root.querySelector('[data-tao="status"]'),
      list: this.root.querySelector('[data-tao="list"]'),
      canvas: this.root.querySelector('.gccsm-canvas'),
      scale: this.root.querySelector('[data-tao="scale"]'),
      cursor: this.root.querySelector('[data-tao="cursor"]'),
      cursorBr: this.root.querySelector('[data-tao="cursorbr"]'),
      count: this.root.querySelector('[data-tao="count"]'),
      tcount: this.root.querySelector('[data-tao="tcount"]'),
      zulu: this.root.querySelector('[data-tao="zulu"]'),
      detail: this.root.querySelector('[data-tao="detail"]'),
      mode: this.root.querySelector('[data-tao="mode"]'),
      toolbar: this.root.querySelector('[data-tao="toolbar"]'),
    };
    this._taoCtx = this._tao.canvas.getContext('2d');
    this._taoDpr = Math.min(window.devicePixelRatio || 1, 2);
    this._taoSelectedId = null;
    this._taoDroppedId = null;
    this._taoHoverId = null;
    this._taoLastContacts = [];
    this._taoRangeM = 9000;
    this._taoManualRange = false;
    // Layer toggles mirrored from the toolbar buttons (all on by default).
    this._taoLayers = { rings: true, grid: true, vec: true, lbl: true, hist: true };
    // Derived kinematics + dead-reckoned own position. `allContacts` only carries
    // ship-relative x/z, so course/speed and track history are reconstructed here by
    // differencing successive fixes and adding own-ship motion back in.
    this._taoTracks = new Map();   // id -> { wx, wz, cse, spd, hist:[{wx,wz}], lastT, lastSampleT }
    this._taoOwn = { wx: 0, wz: 0, t: 0 };
    this._taoCursor = null;        // { px, py } in CSS px within the canvas
    this._taoRedrawQueued = false;
    this._taoLastHeading = 0;
    this._resizeTaoCanvas();
    window.addEventListener('resize', () => this._resizeTaoCanvas());
    if (typeof ResizeObserver !== 'undefined') {
      // The chart only gets a real size once the TAO panel un-hides; a window-resize
      // listener alone leaves the canvas stuck at its 420x300 fallback on first show.
      this._taoRO = new ResizeObserver(() => this._resizeTaoCanvas());
      this._taoRO.observe(this._tao.canvas.parentElement);
    }
    this._tao.canvas.addEventListener('click', (e) => this._onTaoCanvasClick(e));
    this._tao.canvas.addEventListener('dblclick', (e) => {
      this._onTaoCanvasClick(e);
      if (this._taoSelectedId) this.onDesignate?.();
    });
    this._tao.canvas.addEventListener('mousemove', (e) => this._onTaoCanvasHover(e));
    this._tao.canvas.addEventListener('mouseleave', () => {
      this._taoCursor = null;
      this._taoHoverId = null;
      if (this._tao.cursor) this._tao.cursor.textContent = "CURSOR  --°--.-'N  ---°--.-'E";
      if (this._tao.cursorBr) this._tao.cursorBr.textContent = 'BRG --- / RNG ---';
      this._queueTaoRedraw();
    });
    // Wheel zoom — same as RNG+/RNG− toolbar; stopPropagation so the page never scrolls.
    this._tao.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this._taoManualRange = true;
      const f = e.deltaY > 0 ? 1.18 : 1 / 1.18;
      this._taoRangeM = Math.max(2000, Math.min(80000, this._taoRangeM * f));
      this._queueTaoRedraw();
    }, { passive: false });
    this._tao.toolbar.addEventListener('click', (e) => this._onTaoToolClick(e));

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

    if (this._station === 'HELM') { this._updateHelm(state); return; }
    if (this._station === 'LOOKOUT') { this._updateLookout(state); return; }

    // WEAPONS/RADAR/SONAR/TAO all rebuild a contact-list (or weapon-rack) innerHTML
    // from scratch on every call — real DOM churn (destroy+recreate every row, forced
    // layout) that doesn't need to run at 60Hz: a radar contact list refreshing 10x/sec
    // is imperceptible, and this measurably cut frame cost while seated. Not applied to
    // Helm/Lookout above, which only touch cheap textContent/style/classList.
    const now = performance.now();
    if (now - this._lastListUpdate < 100) return;
    this._lastListUpdate = now;

    if (this._station === 'WEAPONS') this._updateWeapons(state);
    else if (this._station === 'RADAR') this._updateRadar(state);
    else if (this._station === 'SONAR') this._updateSonar(state);
    else if (this._station === 'TAO') this._updateTao(state);
  }

  triggerSonarPulse() {
    for (const el of [this._rdr.sonar, this._snr.sonar]) {
      if (!el) continue;
      el.classList.remove('is-active');
      void el.offsetWidth;
      el.classList.add('is-active');
    }
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
    // Reticle reads the SAME designation the radar operator (you, or an AI crewmate
    // manning that console) shares to the force — a track called out at Radar shows
    // up here in red the instant it's designated, without Weapons having to hunt for
    // it themselves. Grey/hidden with nothing designated, red once a track exists,
    // brighter/pulsing once the tactical camera has actually locked onto it (s.trackLock).
    if (this._wpn.reticle) {
      this._wpn.reticle.classList.toggle('has-target', !!target || !!s.acquiring);
      this._wpn.reticle.classList.toggle('is-acquiring', !!s.acquiring && !s.trackLock);
      this._wpn.reticle.classList.toggle('is-locked', !!target && !!s.trackLock);
    }
    if (this._wpn.zoom) {
      const z = s.weaponsZoom ?? 1;
      this._wpn.zoom.textContent = `ZOOM ${z.toFixed(1)}×`;
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
      const nav = c.isWaypoint ? 'is-nav' : '';
      return `<div class="stn-contact-row ${c.id === selectedId ? 'is-selected' : ''} ${nav}" data-contact-id="${c.id}" role="button" tabindex="0">
        <span class="stn-contact-dot ${iff}"></span>
        <span>${c.name || c.id} <em>${dom}</em></span>
        <span>${dist}</span>
      </div>`;
    });
    this._rdr.list.innerHTML = rows.length
      ? rows.join('')
      : `<div class="stn-contact-row"><span></span><span>NO CONTACTS IN FILTER</span><span></span></div>`;
    this._wireContactList(this._rdr.list);

    const nav = s.navWaypoint;
    if (nav && this._rdr.navCue) {
      this._rdr.navCue.textContent =
        `VIGIL  BRG ${formatBearing(nav.bearing)}°  ·  ${formatDistance(nav.distanceM)}  ·  marked on plot`;
    }
  }

  _updateSonar(s) {
    const subs = (s.allContacts || []).filter((c) => String(c.domain).toUpperCase() === 'SUBSURFACE');
    const rows = subs.slice(0, 10).map((c) => `
      <div class="stn-contact-row ${c.id === s.selectedTargetId ? 'is-selected' : ''}" data-contact-id="${c.id}" role="button" tabindex="0">
        <span class="stn-contact-dot hostile"></span>
        <span>${c.name || c.id} <em>SUB</em></span>
        <span>${c.distanceM != null ? formatDistance(c.distanceM) : ''}</span>
      </div>`);
    this._snr.list.innerHTML = rows.length
      ? rows.join('')
      : `<div class="stn-contact-row"><span></span><span>NO SUBSURFACE CONTACTS</span><span></span></div>`;
    this._wireContactList(this._snr.list);
    if (this._snr.depth) {
      this._snr.depth.textContent = subs.length
        ? `Nearest sub ${formatDistance(subs[0].distanceM)} — ping to localize`
        : 'No subsurface contact';
    }
  }

  /** TAO's console — a GCCS-M workstation replica (the real fused Common Operational
   * Picture terminal a CIC/TAO references) rather than a stylized sweep radar:
   * classification banners, Motif-style window chrome/menu/toolbar, a north-up geo
   * plot with a lat/long graticule, MIL-STD-2525 track frames, velocity leaders,
   * track history, a hooked-track data block, a Track Manager tote, and a cursor
   * lat/long + bearing/range status bar. See _drawGccsmChart for the plot itself. */
  _updateTao(s) {
    const st = s.taskForceStatus || {};
    if (this._tao.status) {
      const policy = st.weaponsPolicy === 'free' ? 'WEAPONS FREE' : 'WEAPONS HOLD';
      const track = st.sharedName ? `SHARED · ${st.sharedName}` : 'NO SHARED TRACK';
      this._tao.status.textContent = `${policy} · ${track}`;
      this._tao.status.classList.toggle('is-free', st.weaponsPolicy === 'free');
    }
    const contacts = (s.allContacts || []).filter((c) => !c.isWaypoint);
    this._taoLastContacts = contacts;
    // main.js's onSelectContact ignores null, so DROP HOOK can't clear the shared
    // designation — remember which id we dropped and stop echoing it back locally
    // until something actually designates a different track.
    if (s.selectedTargetId && s.selectedTargetId !== this._taoDroppedId) {
      this._taoSelectedId = s.selectedTargetId;
      this._taoDroppedId = null;
    }
    // Radar's range knob seeds the plot scale, but once the TAO zooms the chart
    // themselves the console stops being yanked around by another console's setting.
    if (s.rangeM && !this._taoManualRange) this._taoRangeM = Math.max(s.rangeM * 1.5, 6000);

    this._taoLastHeading = s.heading || 0;
    this._advanceTaoKinematics(contacts, s.heading || 0, s.speedKnots || 0);

    const rows = contacts.slice(0, 22).map((c) => {
      const a = taoAffiliation(c.iff);
      const k = this._taoTracks.get(c.id);
      const brg = c.x != null && c.z != null
        ? formatBearing(((Math.atan2(c.x, c.z) * 180) / Math.PI + 360) % 360)
        : '---';
      return `<div class="stn-contact-row gccsm-row ${c.id === this._taoSelectedId ? 'is-selected' : ''}" data-contact-id="${c.id}" role="button" tabindex="0" title="${escapeAttr(c.name || c.id)}">
        <span class="gccsm-tn">${taoTrackNumber(c.id)}</span>
        <span class="gccsm-affil ${a.key}">${a.short}</span>
        <span>${taoCategory(c.domain)}</span>
        <span>${brg}</span>
        <span>${c.distanceM != null ? (c.distanceM / NM_M).toFixed(1) : '---'}</span>
        <span>${k && k.spd > 0.6 ? formatBearing(k.cse) : '---'}</span>
        <span>${k && k.spd > 0.6 ? k.spd.toFixed(0) : '--'}</span>
      </div>`;
    });
    this._tao.list.innerHTML = rows.length
      ? rows.join('')
      : `<div class="stn-contact-row gccsm-row gccsm-empty"><span>----</span><span>PICTURE CLEAR</span><span></span><span></span><span></span><span></span><span></span></div>`;
    this._wireContactList(this._tao.list);

    const selected = contacts.find((c) => c.id === this._taoSelectedId) || null;
    this._renderTaoDataBlock(selected);

    const n = contacts.length;
    if (this._tao.count) this._tao.count.textContent = `TRK ${String(n).padStart(3, '0')}`;
    if (this._tao.tcount) this._tao.tcount.textContent = `${String(n).padStart(3, '0')} TRK`;
    if (this._tao.mode) {
      this._tao.mode.textContent = selected
        ? `HOOKED — TN ${taoTrackNumber(selected.id)}`
        : 'HOOK MODE — PICK A TRACK';
      this._tao.mode.classList.toggle('is-hooked', !!selected);
    }
    if (this._tao.zulu) {
      const d = new Date();
      this._tao.zulu.textContent =
        `${p2(d.getUTCHours())}${p2(d.getUTCMinutes())}${p2(d.getUTCSeconds())}Z ${TAO_MONTHS[d.getUTCMonth()]}`;
    }

    this._drawGccsmChart();
  }

  /** Fills the side-column data block for the hooked track. GCCS-M shows a fixed set
   *  of amplifier fields for the hooked contact; mirrored here. */
  _renderTaoDataBlock(c) {
    const box = this._tao.detail;
    if (!box) return;
    if (!c) {
      box.classList.add('is-empty');
      box.innerHTML = '<div class="gccsm-detail-none">NO TRACK HOOKED<br><span>Pick a symbol on the plot or a row in the Track Manager.</span></div>';
      return;
    }
    box.classList.remove('is-empty');
    const a = taoAffiliation(c.iff);
    const k = this._taoTracks.get(c.id);
    const brgDeg = c.x != null ? ((Math.atan2(c.x, c.z) * 180) / Math.PI + 360) % 360 : null;
    const pos = this._taoGeoFor(c.x || 0, c.z || 0);
    const rows = [
      ['TN', taoTrackNumber(c.id)],
      ['ID', `<b class="${a.key}">${a.long}</b>`],
      ['CAT', taoCategoryLong(c.domain)],
      ['PLAT', (c.name || c.id).toUpperCase()],
      ['POS', `${fmtLat(pos.lat)} ${fmtLon(pos.lon)}`],
      ['BRG/RNG', brgDeg == null ? '---' : `${formatBearing(brgDeg)}T / ${(c.distanceM / NM_M).toFixed(1)} NM`],
      ['CSE/SPD', k && k.spd > 0.6 ? `${formatBearing(k.cse)}T / ${k.spd.toFixed(0)} KTS` : 'STATIONARY'],
      ['SOURCE', a.key === 'friend' ? 'LINK-16 / PPLI' : 'ORG SENSOR / RDR'],
      ['QUAL', a.key === 'unknown' ? '3 — AMBIGUOUS' : '5 — FIRM'],
    ];
    box.innerHTML = rows
      .map(([k2, v]) => `<span class="gccsm-dk">${k2}</span><span class="gccsm-dv">${v}</span>`)
      .join('');
  }

  /** Reconstructs true course/speed and a position history for every track.
   *  `allContacts` only carries own-ship-relative x/z, so relative motion is
   *  differenced and own-ship velocity added back to recover ground track. Own
   *  position is dead-reckoned from heading/speed so the plot can show real
   *  lat/long and so history trails stay put in the world as own-ship moves. */
  _advanceTaoKinematics(contacts, headingDeg, speedKnots) {
    const now = performance.now() / 1000;
    const prevT = this._taoOwn.t || now;
    const dt = Math.min(Math.max(now - prevT, 0), 0.5);
    const hr = (headingDeg * Math.PI) / 180;
    const v = speedKnots * 0.514444;
    this._taoOwn.wx += Math.sin(hr) * v * dt;
    this._taoOwn.wz += Math.cos(hr) * v * dt;
    this._taoOwn.t = now;

    const live = new Set();
    for (const c of contacts) {
      if (c.x == null || c.z == null) continue;
      live.add(c.id);
      const wx = this._taoOwn.wx + c.x;
      const wz = this._taoOwn.wz + c.z;
      let k = this._taoTracks.get(c.id);
      if (!k) {
        k = { wx, wz, cse: 0, spd: 0, hist: [], lastT: now, lastSampleT: now };
        this._taoTracks.set(c.id, k);
        continue;
      }
      // Sample at ~2 Hz: differencing every 100 ms frame turns position jitter into
      // wild speed readings, and a C2 tote that flickers 4→40 kts reads as broken.
      const sdt = now - k.lastSampleT;
      if (sdt >= 0.5) {
        const vx = (wx - k.wx) / sdt;
        const vz = (wz - k.wz) / sdt;
        const spd = Math.hypot(vx, vz) / 0.514444;
        const cse = ((Math.atan2(vx, vz) * 180) / Math.PI + 360) % 360;
        if (k.spd <= 0.6) { k.spd = spd; k.cse = cse; }
        else {
          k.spd += (spd - k.spd) * 0.3;
          k.cse = k.cse + (((cse - k.cse + 540) % 360) - 180) * 0.3;
          k.cse = ((k.cse % 360) + 360) % 360;
        }
        k.lastSampleT = now;
        if (now - k.lastT >= 4) {
          k.hist.push({ wx, wz });
          if (k.hist.length > 6) k.hist.shift();
          k.lastT = now;
        }
      }
      k.wx = wx; k.wz = wz;
    }
    for (const id of this._taoTracks.keys()) if (!live.has(id)) this._taoTracks.delete(id);
  }

  /** Ship-relative metres -> lat/long, via the dead-reckoned own-ship position. */
  _taoGeoFor(relX, relZ) {
    const northM = this._taoOwn.wz + relZ;
    const eastM = this._taoOwn.wx + relX;
    const lat = TAO_ORIGIN.lat + northM / 111132;
    const lon = TAO_ORIGIN.lon + eastM / (111320 * Math.cos((lat * Math.PI) / 180));
    return { lat, lon };
  }

  _resizeTaoCanvas() {
    if (!this._tao?.canvas) return;
    const wrap = this._tao.canvas.parentElement;
    const w = Math.max(wrap.clientWidth || 0, 200);
    const h = Math.max(wrap.clientHeight || 0, 160);
    if (this._tao.canvas.width === Math.round(w * this._taoDpr)
      && this._tao.canvas.height === Math.round(h * this._taoDpr)) return;
    this._tao.canvas.width = Math.round(w * this._taoDpr);
    this._tao.canvas.height = Math.round(h * this._taoDpr);
    this._tao.canvas.style.width = `${w}px`;
    this._tao.canvas.style.height = `${h}px`;
    this._drawGccsmChart();
  }

  /** Chart geometry shared by hit-testing and rendering so a click always lands on
   *  exactly the symbol the operator sees. */
  _taoGeom() {
    const dpr = this._taoDpr;
    const w = this._tao.canvas.width / dpr;
    const h = this._tao.canvas.height / dpr;
    const cx = w / 2, cy = h / 2;
    const R = Math.max(h / 2 - 26, 40); // rings sized to height; chart is wider than tall
    return { w, h, cx, cy, R, scale: R / this._taoRangeM };
  }

  _taoPick(px, py) {
    const g = this._taoGeom();
    let best = null, bestD = 18;
    for (const c of this._taoLastContacts) {
      if (c.x == null || c.z == null) continue;
      const sx = g.cx + c.x * g.scale, sy = g.cy - c.z * g.scale;
      const d = Math.hypot(px - sx, py - sy);
      if (d < bestD) { bestD = d; best = c; }
    }
    return best;
  }

  _onTaoCanvasClick(e) {
    const rect = this._tao.canvas.getBoundingClientRect();
    const best = this._taoPick(e.clientX - rect.left, e.clientY - rect.top);
    if (best) {
      this._taoDroppedId = null;
      this._taoSelectedId = best.id;
      this.onSelectContact?.(best.id);
      this._renderTaoDataBlock(best);
      if (this._tao.mode) {
        this._tao.mode.textContent = `HOOKED — TN ${taoTrackNumber(best.id)}`;
        this._tao.mode.classList.add('is-hooked');
      }
    }
    this._queueTaoRedraw();
  }

  _onTaoCanvasHover(e) {
    const rect = this._tao.canvas.getBoundingClientRect();
    const px = e.clientX - rect.left, py = e.clientY - rect.top;
    this._taoCursor = { px, py };
    const hit = this._taoPick(px, py);
    this._taoHoverId = hit ? hit.id : null;
    this._tao.canvas.style.cursor = hit ? 'pointer' : 'crosshair';

    const g = this._taoGeom();
    const relX = (px - g.cx) / g.scale;
    const relZ = (g.cy - py) / g.scale;
    const geo = this._taoGeoFor(relX, relZ);
    const brg = ((Math.atan2(relX, relZ) * 180) / Math.PI + 360) % 360;
    const rng = Math.hypot(relX, relZ) / NM_M;
    if (this._tao.cursor) this._tao.cursor.textContent = `CURSOR  ${fmtLat(geo.lat)}  ${fmtLon(geo.lon)}`;
    if (this._tao.cursorBr) this._tao.cursorBr.textContent = `BRG ${formatBearing(brg)}T / RNG ${rng.toFixed(1)} NM`;
    this._queueTaoRedraw();
  }

  _onTaoToolClick(e) {
    const btn = e.target.closest('[data-gtool]');
    if (!btn) return;
    const tool = btn.dataset.gtool;
    if (tool === 'in' || tool === 'out') {
      this._taoManualRange = true;
      const f = tool === 'in' ? 1 / 1.5 : 1.5;
      this._taoRangeM = Math.max(2000, Math.min(80000, this._taoRangeM * f));
    } else if (tool === 'drop') {
      this._taoDroppedId = this._taoSelectedId;
      this._taoSelectedId = null;
      this._taoHoverId = null;
      this._renderTaoDataBlock(null);
      if (this._tao.mode) {
        this._tao.mode.textContent = 'HOOK MODE — PICK A TRACK';
        this._tao.mode.classList.remove('is-hooked');
      }
      this.onSelectContact?.(null);
    } else if (tool in this._taoLayers) {
      this._taoLayers[tool] = !this._taoLayers[tool];
      btn.classList.toggle('is-on', this._taoLayers[tool]);
    }
    this._queueTaoRedraw();
  }

  /** Pointer motion can fire far faster than the 10 Hz console refresh — coalesce
   *  cursor-driven repaints into one per animation frame. */
  _queueTaoRedraw() {
    if (this._taoRedrawQueued) return;
    this._taoRedrawQueued = true;
    requestAnimationFrame(() => {
      this._taoRedrawQueued = false;
      if (this._station === 'TAO') this._drawGccsmChart();
    });
  }

  /** North-up geo plot, own-unit centred. GCCS-M is a fused command picture drawn on
   *  a chart, not a heading-up sensor scope, so the picture never rotates — only the
   *  own-unit symbol does. Tracks use MIL-STD-2525 frames: the shape carries
   *  affiliation (circle friend / diamond hostile / square neutral / quatrefoil
   *  unknown) and the frame closure carries battle dimension (closed = surface,
   *  open at the bottom = air, open at the top = subsurface). */
  _drawGccsmChart() {
    const ctx = this._taoCtx;
    if (!ctx) return;
    const dpr = this._taoDpr;
    const { w, h, cx, cy, R, scale } = this._taoGeom();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Vertical wash — CRT/LCD GEO displays rarely look flat-black.
    const seaGrad = ctx.createLinearGradient(0, 0, 0, h);
    seaGrad.addColorStop(0, TAO_C.seaHi);
    seaGrad.addColorStop(1, TAO_C.sea);
    ctx.fillStyle = seaGrad;
    ctx.fillRect(0, 0, w, h);
    ctx.lineJoin = 'miter';
    ctx.textBaseline = 'alphabetic';

    this._drawTaoLand(ctx, cx, cy, scale, w, h, R);
    if (this._taoLayers.grid) this._drawTaoGraticule(ctx, w, h, cx, cy, scale);
    if (this._taoLayers.rings) this._drawTaoRangeRings(ctx, cx, cy, R);
    this._drawTaoBearingRing(ctx, cx, cy, R);
    this._drawTaoCursor(ctx, w, h);
    this._drawTaoOwnUnit(ctx, cx, cy);

    // Hooked track drawn last so its data block sits above neighbouring symbols.
    const ordered = this._taoLastContacts.filter((c) => c.x != null && c.z != null);
    ordered.sort((a, b) => (a.id === this._taoSelectedId ? 1 : 0) - (b.id === this._taoSelectedId ? 1 : 0));
    for (const c of ordered) this._drawTaoTrack(ctx, c, cx, cy, scale, w, h);

    this._drawTaoScaleBar(ctx, w, h, scale);
    // Thin inner bezel — the geo view is a framed sub-window inside the workstation.
    ctx.strokeStyle = TAO_C.bezel;
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, w - 1, h - 1);
  }

  /** Static land fills relative to own-unit — reads as a real COP chart, not an empty scope. */
  _drawTaoLand(ctx, cx, cy, scale, w, h, R) {
    // Fictional littoral masses in metres relative to own unit (x east, z north).
    const masses = [
      [[4200, 1800], [5600, 900], [7200, 1400], [7800, 3200], [6100, 4100], [4500, 3400]],
      [[-8200, -2200], [-6400, -3100], [-5100, -1800], [-5800, -400], [-7900, -600]],
      [[-2400, 6200], [-1100, 7000], [400, 6800], [900, 5600], [-800, 5100]],
    ];
    ctx.fillStyle = TAO_C.landFill;
    ctx.strokeStyle = TAO_C.landEdge;
    ctx.lineWidth = 1.2;
    for (const poly of masses) {
      ctx.beginPath();
      for (let i = 0; i < poly.length; i++) {
        const [mx, mz] = poly[i];
        const sx = cx + mx * scale;
        const sy = cy - mz * scale;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    // Soft vignette so the Motif window feels inset.
    const rr = Math.max(40, R || Math.min(w, h) * 0.45);
    const vig = ctx.createRadialGradient(cx, cy, rr * 0.35, cx, cy, rr * 1.15);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(0,0,0,0.28)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, w, h);
  }

  _drawTaoGraticule(ctx, w, h, cx, cy, scale) {
    // Graticule spacing chosen so lines land on whole minutes of arc at this zoom.
    const own = this._taoGeoFor(0, 0);
    const mPerMinLat = 1852;
    const mPerMinLon = 1852 * Math.cos((own.lat * Math.PI) / 180);
    const spanMin = (h / scale) / mPerMinLat;
    const step = spanMin > 90 ? 30 : spanMin > 30 ? 10 : spanMin > 12 ? 5 : spanMin > 4 ? 2 : 1;

    ctx.lineWidth = 1;
    ctx.font = `9px ${TAO_FONT}`;
    ctx.textAlign = 'left';

    const latMin0 = Math.floor((own.lat * 60 - spanMin / 2) / step) * step;
    for (let m = latMin0; m < own.lat * 60 + spanMin; m += step) {
      const y = cy - ((m / 60 - own.lat) * 111132) * scale;
      if (y < -20 || y > h + 20) continue;
      const major = Math.abs(m % 60) < 1e-6;
      ctx.strokeStyle = major ? TAO_C.gridMajor : TAO_C.grid;
      ctx.beginPath(); ctx.moveTo(0, Math.round(y) + 0.5); ctx.lineTo(w, Math.round(y) + 0.5); ctx.stroke();
      ctx.fillStyle = TAO_C.gridText;
      ctx.fillText(fmtLat(m / 60), 4, y - 3);
    }
    const lonSpanMin = (w / scale) / mPerMinLon;
    const lonMin0 = Math.floor((own.lon * 60 - lonSpanMin / 2) / step) * step;
    for (let m = lonMin0; m < own.lon * 60 + lonSpanMin; m += step) {
      const x = cx + ((m / 60 - own.lon) * 111320 * Math.cos((own.lat * Math.PI) / 180)) * scale;
      if (x < -20 || x > w + 20) continue;
      const major = Math.abs(m % 60) < 1e-6;
      ctx.strokeStyle = major ? TAO_C.gridMajor : TAO_C.grid;
      ctx.beginPath(); ctx.moveTo(Math.round(x) + 0.5, 0); ctx.lineTo(Math.round(x) + 0.5, h); ctx.stroke();
      ctx.save();
      ctx.fillStyle = TAO_C.gridText;
      ctx.translate(x + 3, h - 6);
      ctx.fillText(fmtLon(m / 60), 0, 0);
      ctx.restore();
    }
  }

  _drawTaoRangeRings(ctx, cx, cy, R) {
    const rangeNM = this._taoRangeM / NM_M;
    const stepNM = niceRingStep(rangeNM);
    ctx.font = `9px ${TAO_FONT}`;
    ctx.textAlign = 'left';
    for (let r = stepNM; r <= rangeNM + 0.001; r += stepNM) {
      const rr = (r / rangeNM) * R;
      ctx.strokeStyle = TAO_C.ring;
      ctx.setLineDash([2, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, rr, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = TAO_C.ringText;
      ctx.fillText(`${r % 1 ? r.toFixed(1) : r.toFixed(0)}`, cx + 3, cy - rr - 2);
    }
  }

  /** True-bearing tick ring at the plot edge — labelled every 30°, ticked every 10°. */
  _drawTaoBearingRing(ctx, cx, cy, R) {
    ctx.strokeStyle = TAO_C.ring;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    ctx.font = `8px ${TAO_FONT}`;
    ctx.textAlign = 'center';
    for (let d = 0; d < 360; d += 10) {
      const a = ((d - 90) * Math.PI) / 180;
      const major = d % 30 === 0;
      const len = major ? 7 : 4;
      const x1 = cx + Math.cos(a) * R, y1 = cy + Math.sin(a) * R;
      const x2 = cx + Math.cos(a) * (R - len), y2 = cy + Math.sin(a) * (R - len);
      ctx.strokeStyle = major ? TAO_C.ringMajor : TAO_C.ring;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      if (major) {
        ctx.fillStyle = TAO_C.ringText;
        ctx.fillText(String(d).padStart(3, '0'), cx + Math.cos(a) * (R + 10), cy + Math.sin(a) * (R + 10) + 3);
      }
    }
  }

  _drawTaoCursor(ctx, w, h) {
    const c = this._taoCursor;
    if (!c) return;
    ctx.strokeStyle = TAO_C.cursor;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.moveTo(0, Math.round(c.py) + 0.5); ctx.lineTo(w, Math.round(c.py) + 0.5);
    ctx.moveTo(Math.round(c.px) + 0.5, 0); ctx.lineTo(Math.round(c.px) + 0.5, h);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  _drawTaoOwnUnit(ctx, cx, cy) {
    const hdg = this._taoLastHeading || 0;
    ctx.save();
    ctx.strokeStyle = TAO_C.own;
    ctx.fillStyle = TAO_C.ownFill;
    ctx.lineWidth = 2;
    // Friendly surface frame (closed circle) + own-unit tick, per 2525 practice of
    // marking own unit with the friendly frame plus a distinguishing centre mark.
    ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy - 3.5); ctx.lineTo(cx, cy + 3.5);
    ctx.moveTo(cx - 3.5, cy); ctx.lineTo(cx + 3.5, cy); ctx.stroke();
    // Own course leader.
    const a = ((hdg - 90) * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * 7, cy + Math.sin(a) * 7);
    ctx.lineTo(cx + Math.cos(a) * 26, cy + Math.sin(a) * 26);
    ctx.stroke();
    ctx.fillStyle = TAO_C.own;
    ctx.font = `bold 9px ${TAO_FONT}`;
    ctx.textAlign = 'left';
    ctx.fillText('OWN UNIT', cx + 11, cy + 15);
    ctx.font = `9px ${TAO_FONT}`;
    ctx.fillStyle = TAO_C.ownDim;
    ctx.fillText(`MERIDIAN  ${formatBearing(hdg)}T`, cx + 11, cy + 25);
    ctx.restore();
  }

  _drawTaoTrack(ctx, c, cx, cy, scale, w, h) {
    const sx = cx + c.x * scale, sy = cy - c.z * scale;
    if (sx < -40 || sx > w + 40 || sy < -40 || sy > h + 40) return;
    const a = taoAffiliation(c.iff);
    const dim = taoDimension(c.domain);
    const hooked = c.id === this._taoSelectedId;
    const hovered = c.id === this._taoHoverId;
    const k = this._taoTracks.get(c.id);
    const size = 8;

    // Position history — GCCS-M plots past fixes as small dots behind the symbol.
    if (this._taoLayers.hist && k && k.hist.length) {
      ctx.fillStyle = a.dim;
      for (const p of k.hist) {
        const hx = cx + (p.wx - this._taoOwn.wx) * scale;
        const hy = cy - (p.wz - this._taoOwn.wz) * scale;
        ctx.fillRect(hx - 1, hy - 1, 2, 2);
      }
    }

    // Velocity leader: length = distance run in 6 minutes at present speed.
    if (this._taoLayers.vec && k && k.spd > 0.6) {
      const runM = (k.spd * NM_M / 60) * 6;
      const ang = ((k.cse - 90) * Math.PI) / 180;
      ctx.strokeStyle = a.color;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(sx + Math.cos(ang) * size, sy + Math.sin(ang) * size);
      ctx.lineTo(sx + Math.cos(ang) * (size + runM * scale), sy + Math.sin(ang) * (size + runM * scale));
      ctx.stroke();
    }

    ctx.lineWidth = hooked ? 2.2 : 1.6;
    ctx.strokeStyle = a.color;
    ctx.fillStyle = a.fill;
    taoFramePath(ctx, sx, sy, size, a.key, dim);
    if (dim === 'SURFACE') ctx.fill();
    ctx.stroke();

    if (hovered && !hooked) {
      ctx.strokeStyle = TAO_C.hover;
      ctx.lineWidth = 1;
      ctx.strokeRect(sx - size - 5.5, sy - size - 5.5, (size + 5.5) * 2, (size + 5.5) * 2);
    }
    if (hooked) this._drawTaoHook(ctx, sx, sy, size + 6);

    if (this._taoLayers.lbl) {
      // Amplifier text sits to the upper right of the frame, per 2525 field layout,
      // with a short leader so a dense picture stays legible.
      const lx = sx + size + 9, ly = sy - size - 1;
      ctx.strokeStyle = a.dim;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(sx + size * 0.7, sy - size * 0.7); ctx.lineTo(lx - 3, ly + 2); ctx.stroke();
      ctx.fillStyle = hooked ? TAO_C.hookText : a.color;
      ctx.font = `${hooked ? 'bold ' : ''}9px ${TAO_FONT}`;
      ctx.textAlign = 'left';
      ctx.fillText(taoTrackNumber(c.id), lx, ly + 4);
      ctx.fillStyle = a.dim;
      ctx.font = `8px ${TAO_FONT}`;
      ctx.fillText((c.name || c.id).toUpperCase().slice(0, 14), lx, ly + 14);
      if (k && k.spd > 0.6) ctx.fillText(`${formatBearing(k.cse)}/${k.spd.toFixed(0)}`, lx, ly + 23);
    }

    if (hooked) this._drawTaoHookedBlock(ctx, c, sx, sy, size, w, h, a, k);
  }

  /** The hook marker: four corner brackets around the symbol, as a GCCS-M operator
   *  sees on the track they have picked. */
  _drawTaoHook(ctx, x, y, r) {
    ctx.strokeStyle = TAO_C.hookText;
    ctx.lineWidth = 1.4;
    const t = 5;
    for (const [dx, dy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      ctx.beginPath();
      ctx.moveTo(x + dx * r, y + dy * r - dy * t);
      ctx.lineTo(x + dx * r, y + dy * r);
      ctx.lineTo(x + dx * r - dx * t, y + dy * r);
      ctx.stroke();
    }
  }

  /** Boxed data block tethered to the hooked symbol by a leader line. */
  _drawTaoHookedBlock(ctx, c, sx, sy, size, w, h, a, k) {
    const lines = [
      `TN ${taoTrackNumber(c.id)}  ${a.short}`,
      (c.name || c.id).toUpperCase().slice(0, 18),
      `${taoCategoryLong(c.domain)}`,
      k && k.spd > 0.6 ? `CSE ${formatBearing(k.cse)}T  SPD ${k.spd.toFixed(0)}KT` : 'CSE ---  SPD ---',
      `RNG ${(c.distanceM / NM_M).toFixed(1)}NM  BRG ${formatBearing(((Math.atan2(c.x, c.z) * 180) / Math.PI + 360) % 360)}T`,
    ];
    ctx.font = `9px ${TAO_FONT}`;
    let bw = 0;
    for (const l of lines) bw = Math.max(bw, ctx.measureText(l).width);
    bw += 12;
    const bh = lines.length * 11 + 8;
    let bx = sx + size + 18, by = sy + size + 12;
    if (bx + bw > w - 4) bx = sx - size - 18 - bw;
    if (by + bh > h - 4) by = sy - size - 12 - bh;

    ctx.strokeStyle = TAO_C.hookText;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(bx + (bx > sx ? 0 : bw), by + (by > sy ? 0 : bh));
    ctx.stroke();

    ctx.fillStyle = TAO_C.blockBg;
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeRect(bx + 0.5, by + 0.5, bw - 1, bh - 1);
    ctx.textAlign = 'left';
    lines.forEach((l, i) => {
      ctx.fillStyle = i === 0 ? TAO_C.hookText : a.color;
      ctx.font = `${i === 0 ? 'bold ' : ''}9px ${TAO_FONT}`;
      ctx.fillText(l, bx + 6, by + 13 + i * 11);
    });
  }

  /** Graphic scale bar — alternating light/dark segments, as on a real chart. */
  _drawTaoScaleBar(ctx, w, h, scale) {
    const targetPx = 110;
    const nm = niceRingStep((targetPx / scale) / NM_M * 2);
    const px = nm * NM_M * scale;
    const x0 = 12, y0 = h - 22;
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = i % 2 ? TAO_C.scaleA : TAO_C.scaleB;
      ctx.fillRect(x0 + (px / 4) * i, y0, px / 4, 5);
    }
    ctx.strokeStyle = TAO_C.scaleA;
    ctx.strokeRect(x0 + 0.5, y0 + 0.5, px - 1, 4);
    ctx.fillStyle = TAO_C.ringText;
    ctx.font = `9px ${TAO_FONT}`;
    ctx.textAlign = 'left';
    ctx.fillText('0', x0 - 2, y0 - 4);
    ctx.fillText(`${nm % 1 ? nm.toFixed(1) : nm.toFixed(0)} NM`, x0 + px - 8, y0 - 4);

    // Screen-scale denominator (~96 dpi CSS px) for the status bar.
    if (this._tao.scale) {
      const denom = Math.round((this._taoRangeM * 2) / (this._taoGeom().R * 2 * 0.0002645833) / 1000) * 1000;
      this._tao.scale.textContent = `SCALE 1:${denom.toLocaleString('en-US')}`;
    }
  }

  _wireContactList(listEl) {
    if (!listEl || listEl.dataset.wired === '1') {
      // Rebuilt innerHTML each frame — always rebind on the new nodes.
    }
    listEl.querySelectorAll('[data-contact-id]').forEach((row) => {
      const id = row.getAttribute('data-contact-id');
      if (!id || id.startsWith('nav:')) return;
      row.style.cursor = 'pointer';
      row.addEventListener('click', (ev) => {
        ev.preventDefault();
        this._taoDroppedId = null;
        this._taoSelectedId = id;
        this.onSelectContact?.(id);
        const contact = this._taoLastContacts?.find((c) => String(c.id) === String(id));
        this._renderTaoDataBlock(contact || null);
        if (this._tao.mode) {
          this._tao.mode.textContent = `HOOKED — TN ${taoTrackNumber(id)}`;
          this._tao.mode.classList.add('is-hooked');
        }
        this._queueTaoRedraw();
        if (ev.detail >= 2) this.onDesignate?.();
      });
    });
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
    this._taoRO?.disconnect();
    this._taoRO = null;
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
    title: 'Radar CIC',
    hint: '<kbd>[</kbd>/<kbd>]</kbd> Range · Filter · <kbd>Enter</kbd> Designate · <kbd>E</kbd> Stand',
  },
  SONAR: {
    title: 'Sonar / ASW',
    hint: '<kbd>Q</kbd> Active Ping · localize & prosecute subsurface · <kbd>E</kbd> Stand',
  },
  LOOKOUT: {
    title: 'Bridge Wing Lookout',
    hint: 'Mouse Scan · Scroll Zoom · <kbd>R</kbd> Report Contact · <kbd>E</kbd> Stand',
  },
  TAO: {
    title: 'TAO / CIC',
    hint: '<kbd>C</kbd> Share · <kbd>V</kbd> Free · <kbd>B</kbd> Hold · <kbd>N</kbd> Ping · <kbd>M</kbd> Screen · <kbd>Y</kbd> Wilco · <kbd>E</kbd> Stand',
  },
};

function compassLabel(deg) {
  const labels = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const i = Math.round((((deg % 360) + 360) % 360) / 45) % 8;
  return labels[i];
}

export { ORDER_NOTCHES };

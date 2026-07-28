/**
 * lib/utils.js
 * Small framework-free helpers shared across the MERIDIAN UI modules.
 * Not part of the public integrator-facing API, but harmless to import.
 */

/** Clamp a number between min and max. */
export function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

/** Linear interpolation. */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/** Shortest-path interpolation between two compass angles (degrees). */
export function lerpAngleDeg(a, b, t) {
  let diff = ((b - a + 540) % 360) - 180;
  return (a + diff * t + 360) % 360;
}

/** Normalize an angle in degrees to the [0, 360) range. */
export function normalizeDeg(deg) {
  return ((deg % 360) + 360) % 360;
}

/** Create a DOM element with class name(s), attributes, and children in one call. */
export function el(tag, opts = {}, children = []) {
  const node = document.createElement(tag);
  if (opts.class) node.className = opts.class;
  if (opts.html !== undefined) node.innerHTML = opts.html;
  if (opts.text !== undefined) node.textContent = opts.text;
  if (opts.attrs) {
    for (const [k, v] of Object.entries(opts.attrs)) node.setAttribute(k, v);
  }
  if (opts.style) Object.assign(node.style, opts.style);
  for (const child of children) {
    if (child) node.appendChild(child);
  }
  return node;
}

/** Format a bearing in degrees as a fixed-width 3-digit string, e.g. "045". */
export function formatBearing(deg) {
  const n = Math.round(normalizeDeg(deg));
  return String(n).padStart(3, '0');
}

/** Convert meters to a compact readout string (m below 1000, km above). */
export function formatDistance(m) {
  if (m == null || Number.isNaN(m)) return '--';
  if (m >= 1000) return `${(m / 1000).toFixed(1)}km`;
  return `${Math.round(m)}m`;
}

/** Simple 16-point compass label for a heading in degrees. */
const COMPASS_LABELS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
export function compassLabel(deg) {
  const idx = Math.round(normalizeDeg(deg) / 22.5) % 16;
  return COMPASS_LABELS[idx];
}

/** requestAnimationFrame-driven ticker with a stop handle. Used by components with continuous animation (radar sweep, vignette pulses). */
export function startTicker(fn) {
  let raf = null;
  let running = true;
  let last = performance.now();
  function frame(now) {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    fn(dt, now);
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);
  return () => { running = false; if (raf) cancelAnimationFrame(raf); };
}

import * as THREE from 'three';

function hash(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function valueNoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  const ux = xf * xf * (3 - 2 * xf), uy = yf * yf * (3 - 2 * yf);
  return THREE.MathUtils.lerp(THREE.MathUtils.lerp(a, b, ux), THREE.MathUtils.lerp(c, d, ux), uy);
}
function fbm(x, y, octaves = 5) {
  let v = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < octaves; i++) { v += amp * valueNoise(x * freq, y * freq); freq *= 2.03; amp *= 0.5; }
  return v;
}

/**
 * Generates a matched {map, normalMap, roughnessMap} set for a hull-like surface:
 * base colour + panel-line grid + vertical rust/grime streaking + speckle grime,
 * a Sobel-derived normal map from the same panel-line/noise heightfield (so the
 * grooves actually shade correctly under the sun, not just a flat colour print),
 * and a roughness map that reads rougher/grimier in the streaked areas.
 * Everything is generated on an HTML canvas at runtime — no downloaded images.
 */
export function buildHullTextureSet({
  size = 512,
  baseColor = [0.42, 0.44, 0.47],
  panelCols = 8,
  panelRows = 14,
  rustColor = [0.30, 0.19, 0.14],
  rustAmount = 0.35,
  seed = 0,
} = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');

  const [br, bg, bb] = baseColor.map((c) => Math.round(c * 255));
  ctx.fillStyle = `rgb(${br},${bg},${bb})`;
  ctx.fillRect(0, 0, size, size);

  // subtle base grime/noise
  const img = ctx.getImageData(0, 0, size, size);
  const heightData = new Float32Array(size * size); // recessed seams + bumps, used for the normal map too
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const n = fbm(x * 0.035 + seed * 91, y * 0.035 + seed * 57, 5);
      const grime = (n - 0.5) * 22;
      img.data[i] = THREE.MathUtils.clamp(img.data[i] + grime, 0, 255);
      img.data[i + 1] = THREE.MathUtils.clamp(img.data[i + 1] + grime, 0, 255);
      img.data[i + 2] = THREE.MathUtils.clamp(img.data[i + 2] + grime, 0, 255);
      heightData[y * size + x] = 0.5 + (n - 0.5) * 0.3;
    }
  }
  ctx.putImageData(img, 0, 0);

  // Panel-line/rivet contrast relative to base luminance — a fixed near-black line
  // (as this used to be, unconditionally) is invisible against an already-dark hull
  // like the submarine's, which is exactly why it read as flat. Go lighter on dark
  // hulls, darker on light ones, so the seams always actually show up.
  const baseLum = 0.2126 * baseColor[0] + 0.7152 * baseColor[1] + 0.0722 * baseColor[2];
  const lineIsLight = baseLum < 0.35;
  const lineRGB = lineIsLight ? '255,255,255' : '8,8,10';
  const lineAlpha = lineIsLight ? 0.5 : 0.6;
  const rivetRGB = lineIsLight ? '235,238,240' : '0,0,0';
  const rivetAlpha = lineIsLight ? 0.55 : 0.4;

  // panel-line grid (slightly irregular pitch so it doesn't look like a spreadsheet)
  ctx.strokeStyle = `rgba(${lineRGB},${lineAlpha})`;
  ctx.lineWidth = Math.max(1, size / 300);
  const colXs = [0];
  for (let i = 1; i < panelCols; i++) colXs.push((i / panelCols + (hash(i, seed) - 0.5) * 0.02) * size);
  colXs.push(size);
  const rowYs = [0];
  for (let i = 1; i < panelRows; i++) rowYs.push((i / panelRows + (hash(seed, i) - 0.5) * 0.015) * size);
  rowYs.push(size);
  for (const x of colXs) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, size); ctx.stroke(); markSeamHeight(heightData, size, x, true); }
  for (const y of rowYs) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(size, y); ctx.stroke(); markSeamHeight(heightData, size, y, false); }

  // rivet dots at panel corners (cheap greeble that reads well at a distance)
  ctx.fillStyle = `rgba(${rivetRGB},${rivetAlpha})`;
  for (const x of colXs.slice(1, -1)) {
    for (const y of rowYs.slice(1, -1)) {
      for (const [ox, oy] of [[-10, -10], [10, -10], [-10, 10], [10, 10]]) {
        ctx.beginPath();
        ctx.arc(x + ox * (size / 512), y + oy * (size / 512), size / 340, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // vertical rust/grime streaks running down from panel seams and fittings
  const [rr, rg, rb] = rustColor.map((c) => Math.round(c * 255));
  for (let s = 0; s < Math.round(panelCols * 2.2 * rustAmount); s++) {
    const x0 = colXs[1 + Math.floor(hash(s, seed + 1) * (colXs.length - 2))] + (hash(s, seed + 5) - 0.5) * 14;
    const yStart = hash(s, seed + 2) * size * 0.4;
    const len = size * (0.25 + hash(s, seed + 3) * 0.55);
    const w = size * (0.006 + hash(s, seed + 4) * 0.016);
    const grad = ctx.createLinearGradient(x0, yStart, x0, yStart + len);
    grad.addColorStop(0, `rgba(${rr},${rg},${rb},${0.0})`);
    grad.addColorStop(0.15, `rgba(${rr},${rg},${rb},${0.32 + hash(s, seed) * 0.25})`);
    grad.addColorStop(1, `rgba(${rr},${rg},${rb},0.0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(x0 - w / 2, yStart);
    ctx.quadraticCurveTo(x0 + w * (hash(s, seed + 9) - 0.5) * 3, yStart + len * 0.5, x0 - w / 2 + (hash(s, seed + 8) - 0.5) * 10, yStart + len);
    ctx.lineTo(x0 + w / 2 + (hash(s, seed + 8) - 0.5) * 10, yStart + len);
    ctx.quadraticCurveTo(x0 + w * (hash(s, seed + 9) - 0.5) * 3 + w, yStart + len * 0.5, x0 + w / 2, yStart);
    ctx.closePath();
    ctx.fill();
  }

  // scattered darker grime speckle
  ctx.fillStyle = 'rgba(5,5,6,0.5)';
  for (let i = 0; i < size * 1.2; i++) {
    const x = Math.random() * size, y = Math.random() * size;
    const r = Math.random() * (size / 260);
    ctx.globalAlpha = 0.06 + Math.random() * 0.1;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;

  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;

  // --- normal map, derived from the same heightfield via a Sobel-ish gradient ---
  const normalCanvas = document.createElement('canvas');
  normalCanvas.width = size; normalCanvas.height = size;
  const nctx = normalCanvas.getContext('2d');
  const nImg = nctx.createImageData(size, size);
  const strength = 2.2;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const xL = heightData[y * size + ((x - 1 + size) % size)];
      const xR = heightData[y * size + ((x + 1) % size)];
      const yT = heightData[((y - 1 + size) % size) * size + x];
      const yB = heightData[((y + 1) % size) * size + x];
      const dx = (xL - xR) * strength;
      const dy = (yT - yB) * strength;
      const nx = -dx, ny = -dy, nz = 1.0;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
      const i = (y * size + x) * 4;
      nImg.data[i] = ((nx / len) * 0.5 + 0.5) * 255;
      nImg.data[i + 1] = ((ny / len) * 0.5 + 0.5) * 255;
      nImg.data[i + 2] = ((nz / len) * 0.5 + 0.5) * 255;
      nImg.data[i + 3] = 255;
    }
  }
  nctx.putImageData(nImg, 0, 0);
  const normalMap = new THREE.CanvasTexture(normalCanvas);
  normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;

  // --- roughness map: rougher/grimier in streaked+speckled areas, smoother on bare panels ---
  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size; roughCanvas.height = size;
  const rctx = roughCanvas.getContext('2d');
  rctx.fillStyle = '#9a9a9a';
  rctx.fillRect(0, 0, size, size);
  rctx.globalAlpha = 0.5;
  rctx.drawImage(canvas, 0, 0); // reuse the albedo's streak/grime pattern as a rough proxy
  rctx.globalAlpha = 1;
  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping;

  return { map, normalMap, roughnessMap };
}

function markSeamHeight(heightData, size, coord, isVertical) {
  const c = Math.round(coord);
  for (let k = -1; k <= 1; k++) {
    const v = THREE.MathUtils.clamp(c + k, 0, size - 1);
    for (let j = 0; j < size; j++) {
      const idx = isVertical ? j * size + v : v * size + j;
      heightData[idx] -= 0.16 - Math.abs(k) * 0.06;
    }
  }
}

/**
 * A small tileable fine-grain normal+roughness pair (brushed-metal/micro-scratch
 * noise, no panel lines) meant to be applied at a HIGH repeat count on top of an
 * existing baked albedo texture whose UVs we don't control — e.g. the Blender-baked
 * player ship, whose materials shipped with zero normal maps. Because it's pure
 * high-frequency noise it reads as believable micro-detail regardless of the
 * underlying UV layout, unlike a large panel-line texture which would need UVs
 * that actually match.
 */
export function buildMicroDetailMaps({ size = 256, strength = 1.4, seed = 0 } = {}) {
  const heightData = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const n = fbm(x * 0.08 + seed * 31, y * 0.08 + seed * 17, 4);
      const scratch = Math.pow(valueNoise(x * 0.6 + seed * 11, y * 0.02 + seed * 5), 6) * 0.4;
      heightData[y * size + x] = n + scratch;
    }
  }

  const normalCanvas = document.createElement('canvas');
  normalCanvas.width = size; normalCanvas.height = size;
  const nctx = normalCanvas.getContext('2d');
  const nImg = nctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const xL = heightData[y * size + ((x - 1 + size) % size)];
      const xR = heightData[y * size + ((x + 1) % size)];
      const yT = heightData[((y - 1 + size) % size) * size + x];
      const yB = heightData[((y + 1) % size) * size + x];
      const dx = (xL - xR) * strength, dy = (yT - yB) * strength;
      const len = Math.sqrt(dx * dx + dy * dy + 1);
      const i = (y * size + x) * 4;
      nImg.data[i] = ((-dx / len) * 0.5 + 0.5) * 255;
      nImg.data[i + 1] = ((-dy / len) * 0.5 + 0.5) * 255;
      nImg.data[i + 2] = ((1 / len) * 0.5 + 0.5) * 255;
      nImg.data[i + 3] = 255;
    }
  }
  nctx.putImageData(nImg, 0, 0);
  const normalMap = new THREE.CanvasTexture(normalCanvas);
  normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size; roughCanvas.height = size;
  const rctx = roughCanvas.getContext('2d');
  const rImg = rctx.createImageData(size, size);
  for (let i = 0; i < size * size; i++) {
    const v = THREE.MathUtils.clamp(0.55 + (heightData[i] - 0.5) * 0.7, 0.15, 0.95) * 255;
    rImg.data[i * 4] = rImg.data[i * 4 + 1] = rImg.data[i * 4 + 2] = v;
    rImg.data[i * 4 + 3] = 255;
  }
  rctx.putImageData(rImg, 0, 0);
  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping;

  return { normalMap, roughnessMap };
}

const _cache = new Map();
/** Cached per-(preset) texture set so multiple ship instances share GPU textures. */
export function getSharedHullTextures(preset, opts) {
  if (!_cache.has(preset)) _cache.set(preset, buildHullTextureSet(opts));
  return _cache.get(preset);
}

let _microDetail = null;
export function getSharedMicroDetailMaps() {
  if (!_microDetail) _microDetail = buildMicroDetailMaps();
  return _microDetail;
}

import * as THREE from 'three';

function hash(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function noise2D(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  const ux = xf * xf * (3 - 2 * xf), uy = yf * yf * (3 - 2 * yf);
  return THREE.MathUtils.lerp(THREE.MathUtils.lerp(a, b, ux), THREE.MathUtils.lerp(c, d, ux), uy);
}
function fbm(x, y, octaves = 5) {
  let v = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < octaves; i++) {
    v += amp * noise2D(x * freq, y * freq);
    freq *= 2.05; amp *= 0.5;
  }
  return v;
}

/**
 * A small landfall island: procedurally sculpted terrain (sand -> rock -> grass by
 * height/slope), a beach ring fading into the sea, scattered rock/vegetation dressing,
 * and a lighthouse landmark. Everything generated at runtime, no external assets.
 *
 * `seed` offsets the noise sampling coordinates so a second call with the same
 * radius/peak doesn't produce byte-identical terrain — without it every island of a
 * given size would be indistinguishable since the fbm fields are purely a function of
 * local vertex x/z. `rockCount`/`scrubCount`/`lighthouse` let a small islet dial down
 * dressing density (and skip the landmark) rather than looking like a shrunken clone
 * of the main island.
 */
export function buildIsland({ radius = 260, peak = 58, segments = 128, seed = 0, rockCount = 60, scrubCount = 140, lighthouse = true } = {}) {
  const group = new THREE.Group();
  group.name = 'Island';
  const sx = seed * 517.3, sz = seed * 291.7; // noise-sampling offset, in fbm coordinate space

  // Plane only needs a small margin beyond the island's own falloff radius — too
  // large a margin leaves a wide flat "sea-level filler" ring that flickers against
  // the real ocean mesh's wave troughs/crests (z-fighting-like interference).
  const geo = new THREE.PlaneGeometry(radius * 1.4, radius * 1.4, segments, segments);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);

  const sand = new THREE.Color(0xd8c48a);
  const grass = new THREE.Color(0x4c7a3e);
  const rock = new THREE.Color(0x6b675f);
  const rockHigh = new THREE.Color(0x8f8b82);
  const tmp = new THREE.Color();

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const d = Math.sqrt(x * x + z * z) / radius; // 0 center -> 1+ edge

    // radial falloff (island silhouette) combined with fbm for natural ruggedness
    const falloff = Math.max(0, 1 - Math.pow(d, 2.1));
    const n = fbm(x * 0.012 + sx, z * 0.012 + sz, 5);
    const ridge = fbm(x * 0.035 + 40 + sx, z * 0.035 + 40 + sz, 3);
    let h = falloff * peak * (0.55 + 0.65 * n) - ridge * 6 * falloff;
    // sink anything beyond the island's own silhouette well below sea level (and any
    // plausible wave trough) instead of leaving it at a contested y=0 — this is what
    // actually fixes the flicker, not just trimming the plane's overall size.
    h = THREE.MathUtils.lerp(-14, h, falloff);
    h = Math.max(h, -14);

    // beach flattening near sea level
    if (h < 4 && h > -2) h *= 0.6;

    pos.setY(i, h);

    const slope = Math.abs(n - fbm(x * 0.012 + 0.6 + sx, z * 0.012 + sz, 5));
    let c;
    if (h < 1.2) c = tmp.copy(sand);
    else if (h < 9) c = tmp.copy(sand).lerp(grass, THREE.MathUtils.smoothstep(h, 1.2, 9));
    else if (h < peak * 0.62) c = tmp.copy(grass).lerp(rock, THREE.MathUtils.smoothstep(slope, 0.08, 0.32));
    else c = tmp.copy(rock).lerp(rockHigh, THREE.MathUtils.smoothstep(h, peak * 0.62, peak * 0.95));

    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();

  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0.0 });
  const terrain = new THREE.Mesh(geo, mat);
  terrain.receiveShadow = true;
  terrain.castShadow = false;
  group.add(terrain);

  // scattered rocks
  const rockGeo = new THREE.DodecahedronGeometry(1, 0);
  const rockMat = new THREE.MeshStandardMaterial({ color: 0x6e6a62, roughness: 0.95, flatShading: true });
  const rockMesh = new THREE.InstancedMesh(rockGeo, rockMat, rockCount);
  rockMesh.castShadow = true; rockMesh.receiveShadow = true;
  const dummy = new THREE.Object3D();
  let placed = 0, attempts = 0;
  while (placed < rockCount && attempts < rockCount * 20) {
    attempts++;
    const a = Math.random() * Math.PI * 2;
    const rr = Math.pow(Math.random(), 0.6) * radius * 0.92;
    const x = Math.cos(a) * rr, z = Math.sin(a) * rr;
    const d = Math.sqrt(x * x + z * z) / radius;
    const falloff = Math.max(0, 1 - Math.pow(d, 2.1));
    const n = fbm(x * 0.012 + sx, z * 0.012 + sz, 5);
    const h = falloff * peak * (0.55 + 0.65 * n);
    if (h < 2) continue; // keep rocks off the beach/underwater
    const s = 1.2 + Math.random() * 3.2;
    dummy.position.set(x, h - 0.4, z);
    dummy.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
    dummy.scale.set(s, s * (0.7 + Math.random() * 0.6), s);
    dummy.updateMatrix();
    rockMesh.setMatrixAt(placed, dummy.matrix);
    placed++;
  }
  rockMesh.count = placed;
  group.add(rockMesh);

  // low scrub vegetation (simple cone clusters) on grass zones
  const scrubGeo = new THREE.ConeGeometry(1, 2.2, 6);
  const scrubMat = new THREE.MeshStandardMaterial({ color: 0x3f6b34, roughness: 0.9, flatShading: true });
  const scrubMesh = new THREE.InstancedMesh(scrubGeo, scrubMat, scrubCount);
  scrubMesh.castShadow = false;
  let sPlaced = 0, sAttempts = 0;
  while (sPlaced < scrubCount && sAttempts < scrubCount * 20) {
    sAttempts++;
    const a = Math.random() * Math.PI * 2;
    const rr = Math.pow(Math.random(), 0.5) * radius * 0.75;
    const x = Math.cos(a) * rr, z = Math.sin(a) * rr;
    const d = Math.sqrt(x * x + z * z) / radius;
    const falloff = Math.max(0, 1 - Math.pow(d, 2.1));
    const n = fbm(x * 0.012 + sx, z * 0.012 + sz, 5);
    const h = falloff * peak * (0.55 + 0.65 * n);
    if (h < 3 || h > peak * 0.55) continue;
    const s = 0.7 + Math.random() * 1.1;
    dummy.position.set(x, h + 1.0 * s * 0.4, z);
    dummy.rotation.set(0, Math.random() * 6, 0);
    dummy.scale.set(s, s * (0.8 + Math.random() * 0.7), s);
    dummy.updateMatrix();
    scrubMesh.setMatrixAt(sPlaced, dummy.matrix);
    sPlaced++;
  }
  scrubMesh.count = sPlaced;
  group.add(scrubMesh);

  // lighthouse landmark near the highest point — a small islet can skip it (lighthouse
  // = false) so it doesn't read as a shrunken clone of the main landfall island
  let beaconLight = null, lamp = null;
  if (lighthouse) {
    const lhMat = new THREE.MeshStandardMaterial({ color: 0xe8e2d0, roughness: 0.6 });
    const lhStripeMat = new THREE.MeshStandardMaterial({ color: 0xb5352f, roughness: 0.6 });
    const lhGroup = new THREE.Group();
    const towerH = 22;
    const towerGeo = new THREE.CylinderGeometry(2.6, 3.6, towerH, 12);
    const tower = new THREE.Mesh(towerGeo, lhMat);
    tower.position.y = towerH / 2;
    tower.castShadow = true;
    lhGroup.add(tower);
    for (let i = 0; i < 3; i++) {
      const stripe = new THREE.Mesh(new THREE.CylinderGeometry(2.62 + i * 0.006, 2.9 + i * 0.5, towerH / 6, 12), lhStripeMat);
      stripe.position.y = towerH * 0.18 + i * (towerH / 3.1);
      lhGroup.add(stripe);
    }
    const lantern = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 3, 10), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.3, metalness: 0.4 }));
    lantern.position.y = towerH + 1.5;
    lhGroup.add(lantern);
    const lampGeo = new THREE.SphereGeometry(1.1, 10, 8);
    const lampMat = new THREE.MeshStandardMaterial({ color: 0xfff3c4, emissive: 0xffdd88, emissiveIntensity: 2.2, roughness: 0.3 });
    lamp = new THREE.Mesh(lampGeo, lampMat);
    lamp.position.y = towerH + 1.5;
    lhGroup.add(lamp);
    beaconLight = new THREE.PointLight(0xffdd88, 8, 400, 2);
    beaconLight.position.y = towerH + 1.5;
    lhGroup.add(beaconLight);

    // place lighthouse near the peak, on solid ground
    const lhX = radius * 0.12, lhZ = -radius * 0.08;
    const lhFalloff = Math.max(0, 1 - Math.pow(Math.sqrt(lhX * lhX + lhZ * lhZ) / radius, 2.1));
    const lhH = lhFalloff * peak * (0.55 + 0.65 * fbm(lhX * 0.012 + sx, lhZ * 0.012 + sz, 5));
    lhGroup.position.set(lhX, lhH, lhZ);
    group.add(lhGroup);
  }

  return { group, radius, beaconLight, lamp };
}

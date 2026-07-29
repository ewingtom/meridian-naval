import * as THREE from 'three';
import { getSharedHullTextures } from '../utils/ProceduralTextures.js';

/** THREE.ExtrudeGeometry built from a custom Shape (moveTo/lineTo, not a primitive)
 * emits UVs in raw shape-space coordinates, not normalized 0-1 — so a `repeat` value
 * chosen for "N tiles across the surface" silently tiles thousands of times over and
 * aliases into a flat grey smear once mipmapped. Remap to 0-1 so `repeat` behaves the
 * way texturedMat()'s callers expect. (Primitive geometries — Box/Cylinder/Lathe/Cone/
 * Sphere — already normalize correctly and don't need this.)
 */
function normalizeUVs(geometry) {
  const uv = geometry.attributes.uv;
  if (!uv) return geometry;
  let minU = Infinity, maxU = -Infinity, minV = Infinity, maxV = -Infinity;
  for (let i = 0; i < uv.count; i++) {
    const u = uv.getX(i), v = uv.getY(i);
    if (u < minU) minU = u; if (u > maxU) maxU = u;
    if (v < minV) minV = v; if (v > maxV) maxV = v;
  }
  const du = maxU - minU || 1, dv = maxV - minV || 1;
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(i, (uv.getX(i) - minU) / du, (uv.getY(i) - minV) / dv);
  }
  uv.needsUpdate = true;
  return geometry;
}

const matCache = {};
function mat(key, color, roughness = 0.55, metalness = 0.4) {
  if (!matCache[key]) matCache[key] = new THREE.MeshStandardMaterial({ color, roughness, metalness });
  return matCache[key];
}

/** Textured hull material: shares one generated canvas texture set per preset, but
 * each surface gets its own cloned map (with its own `.repeat`) since a ship hull
 * and a small sail panel need very different tiling density from the same source. */
function texturedMat(key, preset, presetOpts, repeatX, repeatY, { roughness = 1, metalness = 0.35, normalScale = 0.7, colorMul = 1 } = {}) {
  if (matCache[key]) return matCache[key];
  const src = getSharedHullTextures(preset, presetOpts);
  const map = src.map.clone(); map.needsUpdate = true;
  const normalMap = src.normalMap.clone(); normalMap.needsUpdate = true;
  const roughnessMap = src.roughnessMap.clone(); roughnessMap.needsUpdate = true;
  for (const t of [map, normalMap, roughnessMap]) { t.repeat.set(repeatX, repeatY); t.wrapS = t.wrapT = THREE.RepeatWrapping; }
  const m = new THREE.MeshStandardMaterial({
    map, normalMap, roughnessMap, roughness, metalness,
    normalScale: new THREE.Vector2(normalScale, normalScale),
  });
  if (colorMul !== 1) m.color.setScalar(colorMul);
  matCache[key] = m;
  return m;
}

/** Small/medium hostile surface combatant — distinct silhouette from the player hero ship. */
export function buildEnemyShipMesh(iffColor = 0x8a2f2f) {
  const group = new THREE.Group();
  const length = 110, beam = 13, deckY = 6.5;

  const hullShape = new THREE.Shape();
  const half = length / 2;
  hullShape.moveTo(-half * 0.96, 0);
  hullShape.lineTo(-half, beam * 0.3);
  hullShape.lineTo(-half * 0.2, beam * 0.5);
  hullShape.lineTo(half * 0.6, beam * 0.5);
  hullShape.lineTo(half, 0);
  hullShape.lineTo(half * 0.6, -beam * 0.5);
  hullShape.lineTo(-half * 0.2, -beam * 0.5);
  hullShape.lineTo(-half, -beam * 0.3);
  hullShape.lineTo(-half * 0.96, 0);
  const hullGeo = normalizeUVs(new THREE.ExtrudeGeometry(hullShape, { depth: deckY, bevelEnabled: true, bevelSize: 0.3, bevelThickness: 0.3, bevelSegments: 2, steps: 1 }));
  hullGeo.rotateX(-Math.PI / 2);
  hullGeo.rotateY(Math.PI / 2);
  // naval haze-grey hull (not a solid IFF-colour paint job — real ships aren't painted
  // that way); IFF colour is reserved for small trim/marking accents instead.
  const hullMat = texturedMat('enemyHullTex', 'navalGrey', { baseColor: [0.44, 0.46, 0.49], panelCols: 9, panelRows: 4, rustAmount: 0.4 }, 9, 3);
  const hull = new THREE.Mesh(hullGeo, hullMat);
  hull.castShadow = true;
  hull.receiveShadow = true;
  group.add(hull);

  // dark waterline boot stripe — the hull above went through rotateX+rotateY so its
  // length axis ends up on local Z and beam on local X; BoxGeometry(w,h,d) puts its
  // first arg on X, so args here must be (beam, height, length), NOT (length, height,
  // beam), or you get a ~100m-wide slab jutting out sideways through the hull instead
  // of a thin stripe running fore-and-aft along it.
  const stripeGeo = new THREE.BoxGeometry(beam * 1.02, 0.9, length * 0.92);
  const stripe = new THREE.Mesh(stripeGeo, mat('enemyStripe', 0x0c0e10, 0.6, 0.2));
  stripe.position.set(0, 0.3, 0);
  group.add(stripe);

  const superMat = texturedMat('enemySuperTex', 'navalGreySuper', { baseColor: [0.52, 0.54, 0.57], panelCols: 5, panelRows: 5, rustAmount: 0.2 }, 3, 3, { normalScale: 0.5 });
  const glassMat = mat('enemyGlass', 0x121a20, 0.2, 0.6);

  // angled bridge block (tapered, not a plain box) with a dark window band
  const bridgeShape = new THREE.Shape();
  bridgeShape.moveTo(-4.2, 0); bridgeShape.lineTo(4.2, 0);
  bridgeShape.lineTo(3.4, 6); bridgeShape.lineTo(-3.4, 6); bridgeShape.lineTo(-4.2, 0);
  const bridgeGeo = normalizeUVs(new THREE.ExtrudeGeometry(bridgeShape, { depth: 11, bevelEnabled: false }));
  bridgeGeo.rotateX(-Math.PI / 2);
  bridgeGeo.translate(0, deckY, 2.5);
  const bridge = new THREE.Mesh(bridgeGeo, superMat);
  bridge.castShadow = true;
  group.add(bridge);

  const windowBand = new THREE.Mesh(new THREE.BoxGeometry(7.6, 1.1, 0.15), glassMat);
  windowBand.position.set(0, deckY + 4.6, 8.05);
  group.add(windowBand);

  // lattice-style mast (tapering pole + yardarm) rather than a plain cylinder
  const mastGeo = new THREE.CylinderGeometry(0.35, 0.55, 9, 6);
  const mast = new THREE.Mesh(mastGeo, superMat);
  mast.position.set(0, deckY + 6 + 4.5, 4);
  mast.castShadow = true;
  group.add(mast);
  const yard = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 5, 5), superMat);
  yard.rotation.z = Math.PI / 2;
  yard.position.set(0, deckY + 6 + 7, 4);
  group.add(yard);
  const radome = new THREE.Mesh(new THREE.SphereGeometry(0.9, 8, 6), mat('enemyRadome', 0xd8dbde, 0.4, 0.1));
  radome.position.set(0, deckY + 6 + 9.4, 4);
  group.add(radome);

  const gunBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 5, 8), mat('barrel', 0x161616, 0.4, 0.6));
  gunBarrel.rotation.x = Math.PI / 2;
  gunBarrel.position.set(0, deckY + 1.5, 42);
  group.add(gunBarrel);
  const gunHouse = new THREE.Mesh(new THREE.ConeGeometry(2.2, 2.4, 5), superMat);
  gunHouse.rotation.x = Math.PI / 2;
  gunHouse.position.set(0, deckY + 1.3, 38.5);
  group.add(gunHouse);

  // simple deck-edge railings (thin boxes along both sides)
  const railMat = mat('enemyRail', 0x2a2e32, 0.6, 0.4);
  for (const side of [-1, 1]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(length * 0.55, 0.6, 0.08), railMat);
    rail.position.set(-6, deckY + 0.9, side * beam * 0.48);
    group.add(rail);
  }

  return { group, length, beam, deckY };
}

/** Neutral merchant/tanker — larger, slab-sided civilian hull with a rust-orange
 * boot-topping and cream upperworks (a deliberately warm, distinctly non-military
 * paint scheme), aft-mounted deckhouse + funnel, and simple cargo-boom greebles.
 * No armament, no radar mast, no gun — reads as "not a combatant" at a glance,
 * the way the haze-grey combatant hulls above deliberately don't distinguish IFF. */
export function buildMerchantShipMesh() {
  const group = new THREE.Group();
  const length = 150, beam = 21, deckY = 9.5;
  const half = length / 2;

  const hullShape = new THREE.Shape();
  hullShape.moveTo(-half * 0.98, 0);
  hullShape.lineTo(-half, beam * 0.32);
  hullShape.lineTo(-half * 0.7, beam * 0.5);
  hullShape.lineTo(half * 0.55, beam * 0.5);
  hullShape.lineTo(half * 0.94, beam * 0.18);
  hullShape.lineTo(half, 0);
  hullShape.lineTo(half * 0.94, -beam * 0.18);
  hullShape.lineTo(half * 0.55, -beam * 0.5);
  hullShape.lineTo(-half * 0.7, -beam * 0.5);
  hullShape.lineTo(-half, -beam * 0.32);
  hullShape.lineTo(-half * 0.98, 0);
  const hullGeo = normalizeUVs(new THREE.ExtrudeGeometry(hullShape, { depth: deckY, bevelEnabled: true, bevelSize: 0.3, bevelThickness: 0.3, bevelSegments: 2, steps: 1 }));
  hullGeo.rotateX(-Math.PI / 2);
  hullGeo.rotateY(Math.PI / 2);
  const hullMat = texturedMat('merchantHullTex', 'merchantRust', { baseColor: [0.66, 0.35, 0.16], panelCols: 8, panelRows: 5, rustAmount: 0.6, rustColor: [0.22, 0.12, 0.08] }, 8, 3);
  const hull = new THREE.Mesh(hullGeo, hullMat);
  hull.castShadow = true;
  hull.receiveShadow = true;
  group.add(hull);

  // dark waterline boot stripe, same convention as the combatant hull above
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(beam * 1.02, 0.9, length * 0.92), mat('merchantStripe', 0x0c0e10, 0.6, 0.2));
  stripe.position.set(0, 0.3, 0);
  group.add(stripe);

  // cream/tan upper-hull freeboard band — warm, not the naval haze-grey used above
  const upperMat = texturedMat('merchantUpperTex', 'merchantCream', { baseColor: [0.78, 0.75, 0.65], panelCols: 8, panelRows: 2, rustAmount: 0.15 }, 8, 1, { normalScale: 0.4 });
  const upper = new THREE.Mesh(new THREE.BoxGeometry(beam * 0.94, deckY * 0.32, length * 0.9), upperMat);
  upper.position.set(0, deckY * 0.86, 0);
  group.add(upper);

  // aft-mounted deckhouse/bridge (merchant ships stack accommodation+bridge over the
  // engine room at the stern, unlike the amidships bridge on the combatant above)
  const houseMat = texturedMat('merchantHouseTex', 'merchantCream', { baseColor: [0.8, 0.77, 0.67], panelCols: 4, panelRows: 6, rustAmount: 0.12 }, 3, 4, { normalScale: 0.4 });
  const glassMat = mat('merchantGlass', 0x121a20, 0.2, 0.6);
  const houseZ = -half * 0.68;
  const house = new THREE.Mesh(new THREE.BoxGeometry(beam * 0.72, 12, 16), houseMat);
  house.position.set(0, deckY + 6, houseZ);
  house.castShadow = true;
  group.add(house);
  const windowBand = new THREE.Mesh(new THREE.BoxGeometry(beam * 0.6, 1.3, 0.15), glassMat);
  windowBand.position.set(0, deckY + 11, houseZ + 8.05);
  group.add(windowBand);

  const funnel = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.9, 6, 10), mat('merchantFunnel', 0x8a2f2f, 0.7, 0.1));
  funnel.position.set(0, deckY + 15, houseZ - 3);
  funnel.castShadow = true;
  group.add(funnel);

  // deck cargo gear — king-post + boom pairs, a cheap greeble that reads as "working
  // ship" silhouette from a distance without adding real geometric weight
  const postMat = mat('merchantPost', 0x3c4046, 0.6, 0.4);
  for (const z of [half * 0.25, -half * 0.15]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 9, 6), postMat);
    post.position.set(0, deckY + 4.5, z);
    group.add(post);
    const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 11, 6), postMat);
    boom.rotation.z = Math.PI / 2.6;
    boom.position.set(0, deckY + 7.5, z + 3);
    group.add(boom);
  }

  // deck-edge railings, same convention as the combatant hull above
  const railMat = mat('merchantRail', 0x2a2e32, 0.6, 0.4);
  for (const side of [-1, 1]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(length * 0.6, 0.6, 0.08), railMat);
    rail.position.set(-4, deckY + 0.9, side * beam * 0.47);
    group.add(rail);
  }

  return { group, length, beam, deckY };
}

/** Submarine — tapered hull (lathed profile) + sail with planes, mostly submerged. */
export function buildSubmarineMesh() {
  const group = new THREE.Group();
  const bodyMat = texturedMat('subBodyTex', 'darkHull', { baseColor: [0.15, 0.16, 0.17], panelCols: 7, panelRows: 12, rustAmount: 0.3, rustColor: [0.22, 0.17, 0.14] }, 9, 4, { metalness: 0.5, normalScale: 1.0 });

  // Tapered teardrop hull via a lathed profile (bow taper -> parallel body -> stern taper)
  const profile = [
    new THREE.Vector2(0.0, -30), new THREE.Vector2(1.6, -27.5), new THREE.Vector2(3.0, -22),
    new THREE.Vector2(3.6, -10), new THREE.Vector2(3.7, 5), new THREE.Vector2(3.5, 16),
    new THREE.Vector2(2.6, 24), new THREE.Vector2(1.2, 28.5), new THREE.Vector2(0.0, 30),
  ];
  const hullGeo = new THREE.LatheGeometry(profile, 24);
  hullGeo.rotateZ(Math.PI / 2);
  const hull = new THREE.Mesh(hullGeo, bodyMat);
  hull.castShadow = true;
  hull.receiveShadow = true;
  group.add(hull);

  // sail / fairwater, tapered fore-and-aft, with small fairing fillet
  const sailShape = new THREE.Shape();
  sailShape.moveTo(-4.5, 0);
  sailShape.lineTo(-3.8, 5.4);
  sailShape.lineTo(2.8, 5.6);
  sailShape.lineTo(3.6, 0);
  sailShape.lineTo(-4.5, 0);
  const sailGeo = normalizeUVs(new THREE.ExtrudeGeometry(sailShape, { depth: 2.6, bevelEnabled: true, bevelSize: 0.15, bevelThickness: 0.15, bevelSegments: 1 }));
  sailGeo.rotateX(-Math.PI / 2);
  sailGeo.translate(0, 3.5, 4);
  sailGeo.rotateY(0);
  const sail = new THREE.Mesh(sailGeo, bodyMat);
  sail.position.y = 0;
  sail.castShadow = true;
  group.add(sail);

  // sail planes (fairwater/diving planes) jutting from the sail
  const planeMat = mat('subPlane', 0x14171a, 0.4, 0.6);
  for (const side of [-1, 1]) {
    const plane = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.18, 1.1), planeMat);
    plane.position.set(side * 2.6, 6.2, 4);
    plane.rotation.z = side * 0.05;
    group.add(plane);
  }

  const periscope = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 3.4, 6), mat('periscope', 0x0a0a0a));
  periscope.position.set(-0.6, 9.5, 4.6);
  group.add(periscope);
  const snorkel = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 2.6, 6), mat('periscope', 0x0a0a0a));
  snorkel.position.set(0.6, 9.1, 3.2);
  group.add(snorkel);

  // stern control surfaces (cruciform tail)
  for (const rot of [0, Math.PI / 2]) {
    const finGeo = new THREE.BoxGeometry(0.15, 4.2, 3.2);
    const finA = new THREE.Mesh(finGeo, bodyMat);
    finA.position.set(0, 0, -27);
    finA.rotation.x = rot;
    group.add(finA);
  }

  group.traverse((o) => { if (o.isMesh) o.castShadow = true; });

  return { group, length: 70, beam: 8, deckY: 0 };
}

/** Attack aircraft — swept delta wing + tapered fuselage + canopy + twin canted tails. */
export function buildAircraftMesh(iffColor = 0x8a2f2f) {
  const group = new THREE.Group();
  const skinColor = new THREE.Color(iffColor);
  const m = texturedMat('aircraftSkinTex_' + iffColor, 'aircraftSkin_' + iffColor,
    { baseColor: [skinColor.r, skinColor.g, skinColor.b], panelCols: 5, panelRows: 10, rustAmount: 0.15, rustColor: [skinColor.r * 0.4, skinColor.g * 0.4, skinColor.b * 0.4] },
    6, 10, { metalness: 0.6, roughness: 0.7, normalScale: 0.8 });
  const darkM = mat('aircraftDark', 0x1a1a1c, 0.3, 0.5);
  const glassM = mat('aircraftGlass', 0x1c2e38, 0.15, 0.7);

  // tapered fuselage via lathe (nose cone -> body -> tail taper)
  const profile = [
    new THREE.Vector2(0.0, -5.2), new THREE.Vector2(0.35, -4.6), new THREE.Vector2(0.62, -3.2),
    new THREE.Vector2(0.7, -0.5), new THREE.Vector2(0.68, 1.8), new THREE.Vector2(0.5, 3.4),
    new THREE.Vector2(0.28, 4.4), new THREE.Vector2(0.0, 4.9),
  ];
  const fuseGeo = new THREE.LatheGeometry(profile, 18);
  fuseGeo.rotateZ(Math.PI / 2);
  const fuselage = new THREE.Mesh(fuseGeo, m);
  fuselage.castShadow = true;
  group.add(fuselage);

  // canopy — small stretched sphere set into the spine ahead of center
  const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.42, 10, 8), glassM);
  canopy.scale.set(1.7, 0.6, 0.85);
  canopy.position.set(1.3, 0.32, 0);
  group.add(canopy);

  // swept delta wing via extruded planform shape
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0.9, 0);
  wingShape.lineTo(-1.6, 0);
  wingShape.lineTo(-3.4, 4.6);
  wingShape.lineTo(-2.6, 4.6);
  wingShape.lineTo(0.2, 0.6);
  wingShape.lineTo(0.9, 0);
  const wingGeo = normalizeUVs(new THREE.ExtrudeGeometry(wingShape, { depth: 0.12, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 1 }));
  wingGeo.rotateX(-Math.PI / 2);
  wingGeo.translate(-0.4, -0.06, 0);
  const wingR = new THREE.Mesh(wingGeo, m);
  wingR.castShadow = true;
  group.add(wingR);
  const wingL = wingR.clone();
  wingL.scale.z = -1;
  group.add(wingL);

  // small canted twin tail fins
  const finShape = new THREE.Shape();
  finShape.moveTo(-1.0, 0);
  finShape.lineTo(0.7, 0);
  finShape.lineTo(0.2, 1.8);
  finShape.lineTo(-0.5, 1.8);
  finShape.lineTo(-1.0, 0);
  const finGeo = new THREE.ExtrudeGeometry(finShape, { depth: 0.1, bevelEnabled: false });
  for (const side of [-1, 1]) {
    const fin = new THREE.Mesh(finGeo, darkM);
    fin.position.set(-3.6, -0.1, side * 0.55);
    fin.rotation.y = Math.PI / 2;
    fin.rotation.x = side * 0.35;
    group.add(fin);
  }

  // engine nacelle / exhaust nozzle
  const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.42, 0.7, 10), darkM);
  nozzle.rotation.z = Math.PI / 2;
  nozzle.position.set(-4.7, 0, 0);
  group.add(nozzle);

  group.traverse((o) => { if (o.isMesh) o.castShadow = true; });

  return { group, length: 10, beam: 7, deckY: 0 };
}

import * as THREE from 'three';

const matCache = {};
function mat(key, color, roughness = 0.55, metalness = 0.4) {
  if (!matCache[key]) matCache[key] = new THREE.MeshStandardMaterial({ color, roughness, metalness });
  return matCache[key];
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
  const hullGeo = new THREE.ExtrudeGeometry(hullShape, { depth: deckY, bevelEnabled: true, bevelSize: 0.3, bevelThickness: 0.3, bevelSegments: 2, steps: 1 });
  hullGeo.rotateX(-Math.PI / 2);
  hullGeo.rotateY(Math.PI / 2);
  const hull = new THREE.Mesh(hullGeo, mat('enemyHull_' + iffColor, iffColor, 0.6, 0.35));
  hull.castShadow = true;
  hull.receiveShadow = true;
  group.add(hull);

  const superMat = mat('enemySuper_' + iffColor, 0x484c50, 0.55, 0.3);
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(8, 6, 12), superMat);
  bridge.position.set(0, deckY + 3, 8);
  bridge.castShadow = true;
  group.add(bridge);
  const mastGeo = new THREE.CylinderGeometry(0.4, 0.6, 8, 6);
  const mast = new THREE.Mesh(mastGeo, superMat);
  mast.position.set(0, deckY + 6 + 4, 8);
  mast.castShadow = true;
  group.add(mast);

  const gunBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 5, 8), mat('barrel', 0x161616, 0.4, 0.6));
  gunBarrel.rotation.x = Math.PI / 2;
  gunBarrel.position.set(0, deckY + 1.5, 42);
  group.add(gunBarrel);

  return { group, length, beam, deckY };
}

/** Submarine — tapered hull (lathed profile) + sail with planes, mostly submerged. */
export function buildSubmarineMesh() {
  const group = new THREE.Group();
  const bodyMat = mat('subBody', 0x1c1f22, 0.45, 0.55);

  // Tapered teardrop hull via a lathed profile (bow taper -> parallel body -> stern taper)
  const profile = [
    new THREE.Vector2(0.0, -30), new THREE.Vector2(1.6, -27.5), new THREE.Vector2(3.0, -22),
    new THREE.Vector2(3.6, -10), new THREE.Vector2(3.7, 5), new THREE.Vector2(3.5, 16),
    new THREE.Vector2(2.6, 24), new THREE.Vector2(1.2, 28.5), new THREE.Vector2(0.0, 30),
  ];
  const hullGeo = new THREE.LatheGeometry(profile, 16);
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
  const sailGeo = new THREE.ExtrudeGeometry(sailShape, { depth: 2.6, bevelEnabled: true, bevelSize: 0.15, bevelThickness: 0.15, bevelSegments: 1 });
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
  const m = mat('aircraft_' + iffColor, iffColor, 0.38, 0.55);
  const darkM = mat('aircraftDark', 0x1a1a1c, 0.3, 0.5);
  const glassM = mat('aircraftGlass', 0x1c2e38, 0.15, 0.7);

  // tapered fuselage via lathe (nose cone -> body -> tail taper)
  const profile = [
    new THREE.Vector2(0.0, -5.2), new THREE.Vector2(0.35, -4.6), new THREE.Vector2(0.62, -3.2),
    new THREE.Vector2(0.7, -0.5), new THREE.Vector2(0.68, 1.8), new THREE.Vector2(0.5, 3.4),
    new THREE.Vector2(0.28, 4.4), new THREE.Vector2(0.0, 4.9),
  ];
  const fuseGeo = new THREE.LatheGeometry(profile, 12);
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
  const wingGeo = new THREE.ExtrudeGeometry(wingShape, { depth: 0.12, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 1 });
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

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

/** Submarine — low-profile hull + sail, mostly submerged. */
export function buildSubmarineMesh() {
  const group = new THREE.Group();
  const bodyMat = mat('subBody', 0x1c1f22, 0.5, 0.5);
  const bodyGeo = new THREE.CapsuleGeometry(3.6, 60, 6, 12);
  bodyGeo.rotateZ(Math.PI / 2);
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.castShadow = true;
  group.add(body);

  const sail = new THREE.Mesh(new THREE.BoxGeometry(3, 5, 8), bodyMat);
  sail.position.set(0, 5, 4);
  sail.castShadow = true;
  group.add(sail);

  const periscope = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 3, 6), mat('periscope', 0x0a0a0a));
  periscope.position.set(0, 8, 4);
  group.add(periscope);

  return { group, length: 70, beam: 8, deckY: 0 };
}

/** Attack aircraft — simple low-poly fixed-wing jet silhouette. */
export function buildAircraftMesh(iffColor = 0x8a2f2f) {
  const group = new THREE.Group();
  const m = mat('aircraft_' + iffColor, iffColor, 0.4, 0.5);

  const fuselage = new THREE.Mesh(new THREE.CapsuleGeometry(0.6, 8, 4, 8), m);
  fuselage.rotation.z = Math.PI / 2;
  group.add(fuselage);

  const wingGeo = new THREE.BoxGeometry(9, 0.15, 2.2);
  const wing = new THREE.Mesh(wingGeo, m);
  wing.position.set(0, 0, -0.3);
  group.add(wing);

  const tailGeo = new THREE.BoxGeometry(3, 0.12, 1.2);
  const tail = new THREE.Mesh(tailGeo, m);
  tail.position.set(-3.6, 0, -0.2);
  group.add(tail);

  const finGeo = new THREE.BoxGeometry(1, 1.4, 0.12);
  const fin = new THREE.Mesh(finGeo, m);
  fin.position.set(-3.6, 0.8, 0);
  group.add(fin);

  group.traverse((o) => { if (o.isMesh) o.castShadow = true; });

  return { group, length: 9, beam: 9, deckY: 0 };
}

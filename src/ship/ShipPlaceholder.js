import * as THREE from 'three';

/**
 * Simple placeholder hull+superstructure so gameplay systems (player controller,
 * camera mounts, weapons, AI) can be built and tested while the high-detail Blender
 * model is produced separately. Swapped out by PlayerShip once the real asset loads.
 */
export function buildPlaceholderShip({ length = 180, beam = 21 } = {}) {
  const group = new THREE.Group();
  group.name = 'ShipPlaceholder';

  const mat = new THREE.MeshStandardMaterial({ color: 0x6b727a, roughness: 0.55, metalness: 0.35 });
  const matDeck = new THREE.MeshStandardMaterial({ color: 0x2b2f33, roughness: 0.85, metalness: 0.1 });
  const matDark = new THREE.MeshStandardMaterial({ color: 0x14171a, roughness: 0.4, metalness: 0.5 });

  const deckY = 9;

  // hull via lathe-ish extrude for a smoother placeholder than pure boxes
  const hullShape = new THREE.Shape();
  const half = length / 2;
  hullShape.moveTo(-half * 0.98, 0);
  hullShape.quadraticCurveTo(-half, 0, -half, beam * 0.28);
  hullShape.lineTo(-half * 0.3, beam * 0.5);
  hullShape.lineTo(half * 0.55, beam * 0.5);
  hullShape.quadraticCurveTo(half * 0.92, beam * 0.5, half, 0);
  hullShape.quadraticCurveTo(half * 0.92, -beam * 0.5, half * 0.55, -beam * 0.5);
  hullShape.lineTo(-half * 0.3, -beam * 0.5);
  hullShape.quadraticCurveTo(-half, -beam * 0.5, -half, -beam * 0.28);
  hullShape.lineTo(-half * 0.98, 0);

  const hullGeo = new THREE.ExtrudeGeometry(hullShape, { depth: deckY, bevelEnabled: true, bevelSize: 0.4, bevelThickness: 0.4, bevelSegments: 3, steps: 1 });
  hullGeo.rotateX(-Math.PI / 2);
  // rotate so length runs along Z (ship forward = +Z)
  hullGeo.rotateY(Math.PI / 2);
  const hull = new THREE.Mesh(hullGeo, mat);
  hull.castShadow = true;
  hull.receiveShadow = true;
  group.add(hull);

  function box(w, h, d, x, y, z, material = mat) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
    return m;
  }

  // superstructure (bridge + mast) - roughly amidships-forward
  const bridge = box(16, 9, 20, 0, deckY + 4.5, 25, mat);
  const mast = box(9, 11, 12, 0, deckY + 9 + 5.5, 25, mat);
  box(10, 0.5, 10, 0, deckY + 15.2, 25, matDark); // radar platform

  // aft superstructure (funnel/hangar)
  box(15, 6, 20, 0, deckY + 3, -35, mat);
  box(20, 0.3, 30, 0, deckY + 6.05, -45, matDeck); // flight deck patch

  // gun forward
  const gunBase = box(4, 3, 5, 0, deckY + 1.5, 75, mat);
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 9, 12), matDark);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0, deckY + 2.6, 82);
  barrel.castShadow = true;
  group.add(barrel);

  // deck plating tint pass (just recolors main deck strip area visually via a thin plane)
  const deckPlane = new THREE.Mesh(new THREE.PlaneGeometry(beam * 0.94, length * 0.88), matDeck);
  deckPlane.rotation.x = -Math.PI / 2;
  deckPlane.position.set(0, deckY + 0.03, 0);
  deckPlane.receiveShadow = true;
  group.add(deckPlane);

  // Mount points are calibrated against the high-detail Blender export's actual
  // geometry (bridge wings, VLS deck, gun barrel bbox — probed via raycasts/bbox
  // queries against the loaded model), not just this placeholder's own proportions,
  // so camera placement lines up correctly once PlayerShip swaps the real model in.
  const mountPoints = {
    helm: new THREE.Vector3(-6.5, 19.4, 17),        // port bridge wing
    weaponsStation: new THREE.Vector3(8, 18.9, 17),  // starboard bridge wing
    bridgeInteriorCenter: new THREE.Vector3(0, 19.5, 17),
    gunBarrelTip: new THREE.Vector3(0, 13.6, 76),
    missileTubes: [
      new THREE.Vector3(-3, 10.5, 37),
      new THREE.Vector3(3, 10.5, 37),
      new THREE.Vector3(-3, 10.5, 41),
      new THREE.Vector3(3, 10.5, 41),
    ],
    ciws: [new THREE.Vector3(0, 16.6, 31.6), new THREE.Vector3(0, 12, -49.5)],
    deckY,
    length,
    beam,
  };

  return { group, mountPoints };
}

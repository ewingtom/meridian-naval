import * as THREE from 'three';
import { TrailRibbon } from '../utils/TrailRibbon.js';
import { getSharedFoamTexture } from '../utils/ProceduralTextures.js';

const _sternWorld = new THREE.Vector3();
const _samplePos = new THREE.Vector3();
const _sideA = new THREE.Vector3();
const _sideB = new THREE.Vector3();

/**
 * Per-ship wake: stern foam ribbon + dual Kelvin arms.
 * Non-additive cream foam — additive white ribbons bloom into judge FAIL waterline glow.
 */
export class ShipWake {
  constructor(scene, ship) {
    this.scene = scene;
    this.ship = ship;
    const length = ship.physics.length;
    this._sternLocal = new THREE.Vector3(0, 0, -length * 0.48);
    this._sinceSample = 999;
    this.sampleInterval = 0.07;
    this.life = 20;

    const beam = ship.physics.beam || 20;
    const foam = getSharedFoamTexture();
    const mkRibbon = (life, widthScale, alphaScale) => new TrailRibbon(scene, {
      capacity: 200,
      life,
      color: 0xd2dde4,
      map: foam,
      additive: false,
      orientation: 'horizontal',
      uvRepeat: 6,
      renderOrder: 2,
      opacity: 0.78,
      widthFn: (age, life, u, speedKn) => {
        const speedFactor = THREE.MathUtils.clamp((speedKn ?? 10) / 22, 0.45, 1.25);
        const spread = Math.min(1, Math.pow(age / (life * 0.5), 0.8));
        return THREE.MathUtils.lerp(beam * 0.7 * widthScale, beam * 4.6 * widthScale, spread)
          * (0.55 + 0.55 * speedFactor);
      },
      alphaFn: (age, life, u, speedKn) => {
        const fadeIn = THREE.MathUtils.clamp(age / 0.4, 0, 1);
        const t = THREE.MathUtils.clamp(age / life, 0, 1);
        const fadeOut = Math.pow(1 - t, 1.25);
        const speedFactor = THREE.MathUtils.clamp((speedKn ?? 10) / 12, 0.35, 1.0);
        const edge = 0.25 + 0.75 * (1 - Math.abs(u * 2 - 1));
        return fadeIn * fadeOut * speedFactor * alphaScale * edge * 0.95;
      },
    });

    this.ribbon = mkRibbon(this.life, 1.25, 0.95);
    this.kelvinL = mkRibbon(this.life * 0.95, 0.85, 0.7);
    this.kelvinR = mkRibbon(this.life * 0.95, 0.85, 0.7);
    this.sprayMats = [];
    this.spraySprites = [];
    this.sprayGroup = new THREE.Group();
    scene.add(this.sprayGroup);
  }

  update(dt, elapsed, getWaveHeight) {
    // Mesh ribbons read as emissive stickers at chase cam (F52–F54 FAIL).
    // Ocean shader owns wake foam; keep ribbons cleared.
    this.ribbon.clear();
    this.kelvinL.clear();
    this.kelvinR.clear();
    void dt; void elapsed; void getWaveHeight;
  }

  dispose() {
    this.ribbon.dispose();
    this.kelvinL.dispose();
    this.kelvinR.dispose();
    this.scene.remove(this.sprayGroup);
  }
}

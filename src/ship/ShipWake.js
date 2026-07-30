import * as THREE from 'three';
import { TrailRibbon } from '../utils/TrailRibbon.js';
import { getSharedFoamTexture } from '../utils/ProceduralTextures.js';

const _sternWorld = new THREE.Vector3();
const _bowWorld = new THREE.Vector3();
const _samplePos = new THREE.Vector3();

/**
 * Per-ship stern foam wake — a widening wedge trail sampled at the stern every ~0.1s,
 * rendered as a flat foam ribbon lying on the water surface — plus a small bow-spray
 * sprite cluster that kicks up once the ship is making real way. Every CrewedShip (the
 * player Meridian and both task-force escorts) owns one of these; see CrewedShip.js.
 * Cheap: one ~150-vertex ribbon mesh + 5 sprites per ship, rebuilt (not reallocated)
 * each frame, using the same shared procedural foam texture as everything else here.
 */
export class ShipWake {
  constructor(scene, ship) {
    this.scene = scene;
    this.ship = ship;
    const length = ship.physics.length;
    this._sternLocal = new THREE.Vector3(0, 0, -length * 0.48);
    this._bowLocal = new THREE.Vector3(0, 0, length * 0.5);
    this._sinceSample = 999;
    this.sampleInterval = 0.1;
    this.life = 14;

    const beam = length > 0 ? ship.physics.beam || 22 : 22;
    this.ribbon = new TrailRibbon(scene, {
      capacity: 150,
      life: this.life,
      color: 0xe8f4f6,
      map: getSharedFoamTexture(),
      orientation: 'horizontal',
      uvRepeat: 6,
      renderOrder: 1,
      // Classic widening Kelvin-wake wedge: starts about as wide as the stern itself
      // and fans out behind the ship as the foam patch ages, capped a few beam-widths
      // out so it reads clearly from a distant chase/tactical camera without looking
      // absurd up close.
      widthFn: (age, life, u, speedKn) => {
        const speedFactor = THREE.MathUtils.clamp((speedKn ?? 10) / 26, 0.3, 1);
        const spread = Math.min(1, age / 9);
        return THREE.MathUtils.lerp(beam * 0.55, beam * 3.2, spread) * (0.55 + 0.45 * speedFactor);
      },
      alphaFn: (age, life, u, speedKn) => {
        const fadeIn = THREE.MathUtils.clamp(age / 0.5, 0, 1);
        const fadeOut = 1 - THREE.MathUtils.clamp(age / life, 0, 1);
        const speedFactor = THREE.MathUtils.clamp((speedKn ?? 10) / 16, 0.25, 1.15);
        return fadeIn * fadeOut * speedFactor * 1.15;
      },
    });

    const dotTex = getSharedFoamTexture();
    this.sprayMats = [];
    this.spraySprites = [];
    this.sprayGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const mat = new THREE.SpriteMaterial({ map: dotTex, color: 0xf0fbff, transparent: true, depthWrite: false, opacity: 0 });
      const spr = new THREE.Sprite(mat);
      spr.visible = false;
      this.sprayGroup.add(spr);
      this.sprayMats.push(mat);
      this.spraySprites.push(spr);
    }
    scene.add(this.sprayGroup);
  }

  update(dt, elapsed, getWaveHeight) {
    if (!this.ship.alive) {
      this.ribbon.clear();
      for (const s of this.spraySprites) s.visible = false;
      return;
    }

    const speedKn = Math.abs(this.ship.physics.speedKnots);
    this._sinceSample += dt;

    if (speedKn > 1.2 && this._sinceSample >= this.sampleInterval) {
      this._sinceSample = 0;
      this.ship.getMountWorld(this._sternLocal, _sternWorld);
      const y = getWaveHeight(_sternWorld.x, _sternWorld.z, elapsed) + 0.1;
      _samplePos.set(_sternWorld.x, y, _sternWorld.z);
      this.ribbon.addSample(_samplePos, elapsed, speedKn);
    }

    this.ribbon.update(elapsed);
    this._updateBowSpray(elapsed, speedKn, getWaveHeight);
  }

  _updateBowSpray(elapsed, speedKn, getWaveHeight) {
    const active = speedKn > 7;
    if (!active) {
      for (const s of this.spraySprites) s.visible = false;
      return;
    }
    this.ship.getMountWorld(this._bowLocal, _bowWorld);
    const waterY = getWaveHeight(_bowWorld.x, _bowWorld.z, elapsed);
    const intensity = THREE.MathUtils.clamp((speedKn - 7) / 20, 0, 1);
    const fwd = this.ship.forward;
    const beam = this.ship.physics.beam || 20;
    for (let i = 0; i < this.spraySprites.length; i++) {
      const spr = this.spraySprites[i];
      spr.visible = true;
      const side = i % 2 === 0 ? 1 : -1;
      const rank = Math.floor(i / 2) + 1;
      const jitter = Math.sin(elapsed * 6.3 + i * 2.7) * 0.5;
      spr.position.set(
        _bowWorld.x - fwd.x * rank * 2.2 + side * (beam * 0.22 * rank) + jitter,
        waterY + 1.0 + rank * 0.5 * intensity,
        _bowWorld.z - fwd.z * rank * 2.2
      );
      const scale = (2.5 + rank * 1.6) * (0.5 + intensity * 0.7);
      spr.scale.set(scale, scale, 1);
      this.sprayMats[i].opacity = 0.5 * intensity * (0.6 + 0.4 * Math.abs(Math.sin(elapsed * 4 + i)));
    }
  }

  dispose() {
    this.ribbon.dispose();
    this.scene.remove(this.sprayGroup);
    for (const m of this.sprayMats) m.dispose();
  }
}

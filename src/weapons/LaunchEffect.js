import * as THREE from 'three';
import { getSharedDotTexture, getSharedFoamTexture } from '../utils/ProceduralTextures.js';

/**
 * One-shot launch VFX at a tube / barrel: additive flash, rising smoke, brief point light.
 * Used for missile / torpedo / gun launches so ordnance doesn't "teleport" into existence.
 */
export class LaunchEffect {
  constructor(scene, position, {
    color = 0xffc070,
    scale = 1,
    underwater = false,
    loft = new THREE.Vector3(0, 1, 0),
  } = {}) {
    this.scene = scene;
    this.age = 0;
    this.life = underwater ? 1.4 : 1.8;
    this.dead = false;
    this.scale = scale;
    this.underwater = underwater;
    this.origin = position.clone();
    this.loft = loft.clone().normalize();

    const hot = new THREE.Color(underwater ? 0xa8e8ff : color).multiplyScalar(2.2);

    this.flashMat = new THREE.SpriteMaterial({
      map: getSharedDotTexture(),
      color: hot,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 1,
    });
    this.flash = new THREE.Sprite(this.flashMat);
    this.flash.position.copy(position);
    this.flash.scale.setScalar(2.2 * scale);
    scene.add(this.flash);

    this.light = new THREE.PointLight(underwater ? 0x66d0e8 : 0xffb060, 40 * scale, 90 * scale, 2);
    this.light.position.copy(position);
    scene.add(this.light);

    const smokeTex = getSharedFoamTexture();
    this.puffs = [];
    const puffCount = underwater ? 4 : 6;
    for (let i = 0; i < puffCount; i++) {
      const mat = new THREE.SpriteMaterial({
        map: smokeTex,
        color: underwater ? 0xc8f0ff : 0x6a6860,
        transparent: true,
        depthWrite: false,
        opacity: 0,
      });
      const spr = new THREE.Sprite(mat);
      spr.position.copy(position);
      const side = new THREE.Vector3(Math.random() - 0.5, Math.random() * 0.4, Math.random() - 0.5).normalize();
      spr.userData.vel = this.loft.clone()
        .multiplyScalar(3 + Math.random() * 5)
        .addScaledVector(side, 1.5 + Math.random() * 3)
        .multiplyScalar(scale);
      spr.userData.spin = (Math.random() - 0.5) * 0.8;
      scene.add(spr);
      this.puffs.push({ sprite: spr, mat });
    }
  }

  update(dt) {
    this.age += dt;
    if (this.age >= this.life) {
      this.dead = true;
      return;
    }
    const t = this.age / this.life;
    const flashT = Math.min(1, this.age / 0.22);
    this.flash.scale.setScalar(THREE.MathUtils.lerp(1.2, 7, flashT) * this.scale);
    this.flashMat.opacity = Math.max(0, 1 - flashT) * 0.95;
    this.light.intensity = 42 * this.scale * Math.max(0, 1 - this.age / 0.45);

    for (const { sprite, mat } of this.puffs) {
      sprite.position.addScaledVector(sprite.userData.vel, dt);
      sprite.userData.vel.y += (this.underwater ? 0.4 : 1.8) * dt;
      sprite.userData.vel.multiplyScalar(0.97);
      const grow = THREE.MathUtils.lerp(1.2, 8, t) * this.scale;
      sprite.scale.setScalar(grow);
      mat.opacity = Math.sin(Math.min(1, t) * Math.PI) * (this.underwater ? 0.55 : 0.42);
    }
  }

  dispose() {
    this.scene.remove(this.flash);
    this.flashMat.dispose();
    this.scene.remove(this.light);
    for (const { sprite, mat } of this.puffs) {
      this.scene.remove(sprite);
      mat.dispose();
    }
  }
}

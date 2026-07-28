import * as THREE from 'three';

const geoCache = new THREE.SphereGeometry(1, 12, 8);

/** Cheap expanding-sphere + flash-light explosion. No particle textures needed. */
export class Explosion {
  constructor(scene, position, { scale = 1, underwater = false } = {}) {
    this.scene = scene;
    this.age = 0;
    this.life = 1.1 * scale;
    this.scale = scale;
    this.dead = false;

    const color = underwater ? 0x66d0e8 : 0xffb347;
    this.mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1, depthWrite: false });
    this.mesh = new THREE.Mesh(geoCache, this.mat);
    this.mesh.position.copy(position);
    this.mesh.scale.setScalar(0.1);
    scene.add(this.mesh);

    this.light = new THREE.PointLight(color, 40 * scale, 120 * scale, 2);
    this.light.position.copy(position);
    scene.add(this.light);

    this.core = new THREE.Mesh(geoCache, new THREE.MeshBasicMaterial({ color: 0xfff6d8, transparent: true, opacity: 1, depthWrite: false }));
    this.core.position.copy(position);
    this.core.scale.setScalar(0.05);
    scene.add(this.core);
  }

  update(dt) {
    this.age += dt;
    const t = this.age / this.life;
    if (t >= 1) {
      this.dead = true;
      return;
    }
    const grow = 1 - Math.pow(1 - Math.min(1, t * 2.2), 3);
    this.mesh.scale.setScalar(THREE.MathUtils.lerp(0.5, 9, grow) * this.scale);
    this.mat.opacity = 1 - t;
    this.core.scale.setScalar(THREE.MathUtils.lerp(0.3, 3.5, Math.min(1, t * 4)) * this.scale);
    this.core.material.opacity = Math.max(0, 1 - t * 3);
    this.light.intensity = 40 * this.scale * (1 - t);
  }

  dispose() {
    this.scene.remove(this.mesh);
    this.scene.remove(this.core);
    this.scene.remove(this.light);
    this.mat.dispose();
    this.core.material.dispose();
  }
}

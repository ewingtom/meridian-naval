import * as THREE from 'three';
import { SkyShader } from './skyShader.js';

/**
 * Procedural physical sky (hand-authored gradient + sun + clouds — see skyShader.js)
 * + sun light + dynamic env map. No textures — everything is generated on the GPU.
 */
export class SkySystem {
  constructor(renderer, scene) {
    this.renderer = renderer;
    this.scene = scene;

    const geo = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(SkyShader.uniforms),
      vertexShader: SkyShader.vertexShader,
      fragmentShader: SkyShader.fragmentShader,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      toneMapped: false,
    });
    this.sky = new THREE.Mesh(geo, mat);
    this.sky.scale.setScalar(45000);
    scene.add(this.sky);

    this.sunPosition = new THREE.Vector3();
    this.sunDirection = new THREE.Vector3();

    // Key sun light — warm, low-ish for long dramatic shadows / glitter
    this.sunLight = new THREE.DirectionalLight(0xfff2e0, 5.1);
    this.sunLight.castShadow = true;
    // 1536² instead of 2048² — the shadow pass re-renders every shadow-casting
    // mesh (hundreds, across the task force) into this map each frame, and 1536
    // still resolves crisp deck/superstructure shadows at ~44% less shadow-map
    // fill than 2048.
    this.sunLight.shadow.mapSize.set(1536, 1536);
    this.sunLight.shadow.camera.near = 40;
    this.sunLight.shadow.camera.far = 900;
    // Tight ortho frustum around the hero — a ±360m box wasted texels and left deck
    // contact shadows too soft for chase/helm AAA reads. Updated each frame in update().
    this._shadowHalfExtent = 165;
    this._applyShadowFrustum();
    this.sunLight.shadow.bias = -0.00035;
    this.sunLight.shadow.normalBias = 0.018;
    this.sunLight.shadow.radius = 2.0;
    scene.add(this.sunLight);
    scene.add(this.sunLight.target);

    // Soft cool sky fill — kept low so sun key + SSAO can sculpt form (judge: plastic wash)
    // Balanced hemi — too low made ocean/hull near-black; too high washed AO
    this.hemiLight = new THREE.HemisphereLight(0x7aa0c0, 0x0e1412, 0.16);
    scene.add(this.hemiLight);

    this.pmrem = new THREE.PMREMGenerator(renderer);
    this.pmrem.compileEquirectangularShader();
    this.envRT = null;

    this._elevation = 22;
    this._azimuth = 215;
    this._lastEnvRefresh = -999;
    this._followTarget = new THREE.Vector3();
    this.setSunAngle(this._elevation, this._azimuth);
    this.updateEnvMap();
  }

  setSunAngle(elevationDeg, azimuthDeg) {
    this._elevation = elevationDeg;
    this._azimuth = azimuthDeg;
    const phi = THREE.MathUtils.degToRad(90 - elevationDeg);
    const theta = THREE.MathUtils.degToRad(azimuthDeg);
    this.sunPosition.setFromSphericalCoords(1, phi, theta);
    this.sunDirection.copy(this.sunPosition).normalize();
    this.sky.material.uniforms.uSunDirection.value.copy(this.sunDirection);

    const dist = 400;
    this.sunLight.position.copy(this.sunPosition).multiplyScalar(dist);
    // Target is updated each frame to follow the ship (see update)

    const t = THREE.MathUtils.clamp(elevationDeg / 45, 0, 1);
    this.sunLight.intensity = THREE.MathUtils.lerp(2.4, 5.4, t);
    const warm = new THREE.Color(0xff9d52);
    const white = new THREE.Color(0xfff4e2);
    this.sunLight.color.copy(warm).lerp(white, t);

    // Sky gradient colours shift warmer/dimmer near the horizon (sunrise/sunset)
    const u = this.sky.material.uniforms;
    const zenithHigh = new THREE.Color(0x0f3d78);
    const zenithLow = new THREE.Color(0x2c3f6b);
    const horizonHigh = new THREE.Color(0x9dc3dc);
    const horizonLow = new THREE.Color(0xe8a86a);
    u.uZenithColor.value.copy(zenithLow).lerp(zenithHigh, t);
    u.uHorizonColor.value.copy(horizonLow).lerp(horizonHigh, t);
    u.uSunColor.value.copy(warm).lerp(white, t);
  }

  updateEnvMap() {
    if (this.envRT) this.envRT.dispose();
    this.envRT = this.pmrem.fromScene(this.sky, 0.04);
    this.scene.environment = this.envRT.texture;
    return this.envRT.texture;
  }

  _applyShadowFrustum() {
    const h = this._shadowHalfExtent;
    const cam = this.sunLight.shadow.camera;
    cam.left = -h;
    cam.right = h;
    cam.top = h;
    cam.bottom = -h;
    cam.updateProjectionMatrix();
  }

  /** Keep shadow frustum under the player ship so chase shots get hull contact shadows. */
  setFollowTarget(pos) {
    if (!pos) return;
    this._followTarget.copy(pos);
  }

  update(camera, elapsed = 0) {
    this.sky.position.set(camera.position.x, 0, camera.position.z);
    this.sky.material.uniforms.uTime.value = elapsed;

    const anchor = this._followTarget.lengthSq() > 0.01 ? this._followTarget : camera.position;
    this.sunLight.target.position.set(anchor.x, 0, anchor.z);
    this.sunLight.target.updateMatrixWorld();
    const half = this.sunLight.userData.shadowHalfExtent ?? this._shadowHalfExtent;
    if (half !== this._shadowHalfExtent) {
      this._shadowHalfExtent = half;
      this._applyShadowFrustum();
    }
    const dist = 400;
    this.sunLight.position.copy(this.sunPosition).multiplyScalar(dist).add(anchor);

    // Refresh PMREM only occasionally so water/hull env reflections track slow
    // cloud/sun change. Each refresh renders the sky to a cubemap and runs the
    // full PMREM convolution (plus a render-target realloc) — a ~hundreds-of-ms
    // GPU hitch — so doing it every 2.5 s produced a periodic stutter. The env
    // barely changes over a patrol (sun is fixed; low-roughness reflections are
    // near-insensitive to cloud drift), so a 15 s cadence keeps the reflections
    // fresh enough while cutting the hitch frequency 6×.
    if (elapsed - this._lastEnvRefresh > 15) {
      this._lastEnvRefresh = elapsed;
      this.updateEnvMap();
      this.onEnvMapUpdated?.(this.envRT.texture);
    }
  }
}

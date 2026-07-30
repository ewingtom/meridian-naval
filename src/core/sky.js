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
    this.sunLight = new THREE.DirectionalLight(0xfff2e0, 4.2);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.set(2048, 2048);
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 1200;
    this.sunLight.shadow.camera.left = -360;
    this.sunLight.shadow.camera.right = 360;
    this.sunLight.shadow.camera.top = 360;
    this.sunLight.shadow.camera.bottom = -360;
    this.sunLight.shadow.bias = -0.0005;
    this.sunLight.shadow.normalBias = 0.025;
    this.sunLight.shadow.radius = 2.5;
    scene.add(this.sunLight);
    scene.add(this.sunLight.target);

    // Soft cool sky fill (hemisphere) so shadows aren't pure black
    this.hemiLight = new THREE.HemisphereLight(0x9fc4e8, 0x1a2b1f, 0.45);
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
    this.sunLight.intensity = THREE.MathUtils.lerp(2.0, 4.6, t);
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
    const dist = 400;
    this.sunLight.position.copy(this.sunPosition).multiplyScalar(dist).add(anchor);

    // Refresh PMREM occasionally so water/hull env reflections track cloud motion
    if (elapsed - this._lastEnvRefresh > 2.5) {
      this._lastEnvRefresh = elapsed;
      this.updateEnvMap();
      this.onEnvMapUpdated?.(this.envRT.texture);
    }
  }
}

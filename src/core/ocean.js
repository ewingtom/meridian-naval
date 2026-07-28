import * as THREE from 'three';

// Gerstner wave parameters: [dirX, dirZ, steepness, wavelength, speed]
const WAVE_SET = [
  [1.0, 0.2, 0.34, 74.0, 1.05],
  [0.65, -0.75, 0.28, 48.0, 1.3],
  [-0.4, 0.9, 0.22, 31.0, 1.7],
  [0.9, 0.5, 0.16, 19.0, 2.1],
  [-0.75, -0.6, 0.13, 12.0, 2.6],
  [0.2, -1.0, 0.09, 7.2, 3.4],
  [-1.0, 0.15, 0.07, 4.1, 4.3],
  [0.55, 0.83, 0.05, 2.3, 5.6],
];

function buildWaveGLSL() {
  let decl = `#define NUM_WAVES ${WAVE_SET.length}\n`;
  decl += `uniform vec4 uWaveA[NUM_WAVES];\nuniform vec2 uWaveB[NUM_WAVES];\n`;
  return decl;
}

const GERSTNER_FUNC = `
// Returns displaced position + accumulates normal
vec3 gerstner(vec3 p, float t, out vec3 tangent, out vec3 binormal) {
  vec3 offset = vec3(0.0);
  tangent = vec3(1.0, 0.0, 0.0);
  binormal = vec3(0.0, 0.0, 1.0);
  float steepSum = 0.0;
  for (int i = 0; i < NUM_WAVES; i++) {
    vec2 dir = uWaveA[i].xy;
    float steepness = uWaveA[i].z;
    float wavelength = uWaveA[i].w;
    float speed = uWaveB[i].x;
    float k = 6.28318530718 / wavelength;
    float c = sqrt(9.8 / k) * speed * 0.35 + speed * 0.15;
    float f = k * (dot(dir, p.xz) - c * t * 3.0);
    float a = steepness / k / float(NUM_WAVES) * 2.2;
    offset.x += dir.x * a * cos(f);
    offset.z += dir.y * a * cos(f);
    offset.y += a * sin(f) * 0.72;

    float wa = k * a;
    tangent += vec3(
      -dir.x * dir.x * wa * sin(f),
      dir.x * wa * cos(f),
      -dir.x * dir.y * wa * sin(f)
    );
    binormal += vec3(
      -dir.x * dir.y * wa * sin(f),
      dir.y * wa * cos(f),
      -dir.y * dir.y * wa * sin(f)
    );
  }
  return offset;
}
`;

export const OCEAN_VERTEX = `
${buildWaveGLSL()}
uniform float uTime;
uniform vec3 uCamPos;
varying vec3 vWorldPos;
varying vec3 vNormal;
varying float vFoamFactor;
varying float vFresnelBoost;

${GERSTNER_FUNC}

void main() {
  vec3 pos = position;
  // world-space XZ (grid is re-centered on camera each frame via mesh position)
  vec3 worldXZ = pos + vec3(modelMatrix[3].x, 0.0, modelMatrix[3].z);

  vec3 tangent, binormal;
  vec3 disp = gerstner(worldXZ, uTime, tangent, binormal);
  pos += disp;

  vec3 n = normalize(cross(binormal, tangent));
  vNormal = n;

  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vWorldPos = worldPos.xyz;

  // crude crest/foam factor from steepness accumulation (jacobian-ish)
  float steep = length(tangent - vec3(1.0,0.0,0.0)) + length(binormal - vec3(0.0,0.0,1.0));
  vFoamFactor = clamp(steep - 0.55, 0.0, 1.6);

  float distToCam = length(uCamPos - worldPos.xyz);
  vFresnelBoost = smoothstep(800.0, 40.0, distToCam);

  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

export const OCEAN_FRAGMENT = `
uniform float uTime;
uniform vec3 uSunDirection;
uniform vec3 uSunColor;
uniform vec3 uCamPos;
uniform samplerCube uEnvMap;
uniform vec3 uDeepColor;
uniform vec3 uShallowColor;
uniform vec3 uFogColor;
uniform float uFogDensity;

varying vec3 vWorldPos;
varying vec3 vNormal;
varying float vFoamFactor;
varying float vFresnelBoost;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
float fbm(vec2 p) {
  float v = 0.0, amp = 0.5;
  for (int i = 0; i < 5; i++) { v += amp * noise(p); p *= 2.02; amp *= 0.5; }
  return v;
}

void main() {
  vec3 viewDir = normalize(uCamPos - vWorldPos);

  // Fine ripple detail via layered noise-driven normal perturbation
  vec2 rp = vWorldPos.xz * 0.06 + uTime * 0.035;
  float n1 = fbm(rp);
  float n2 = fbm(rp * 2.7 + 11.0 - uTime * 0.02);
  vec2 grad = vec2(n1 - fbm(rp + vec2(0.6, 0.0)), n1 - fbm(rp + vec2(0.0, 0.6)));
  vec3 detailNormal = normalize(vec3(grad.x * 1.4, 1.0, grad.y * 1.4));

  vec3 N = normalize(mix(vNormal, normalize(vNormal + detailNormal * 0.55), 0.75));

  float NdotV = clamp(dot(N, viewDir), 0.0, 1.0);
  float fresnel = pow(1.0 - NdotV, 5.0);
  fresnel = mix(0.02, 1.0, fresnel);

  // Reflection
  vec3 reflectDir = reflect(-viewDir, N);
  vec3 reflColor = textureCube(uEnvMap, reflectDir).rgb;

  // Water body colour — deeper for grazing view, lighter/greener near-surface
  float depthMix = clamp(dot(N, vec3(0.0,1.0,0.0)), 0.0, 1.0);
  vec3 waterColor = mix(uDeepColor, uShallowColor, pow(depthMix, 3.0) * 0.4);

  // Sun specular glitter — sharp + sparkle-modulated
  vec3 halfDir = normalize(uSunDirection + viewDir);
  float spec = pow(clamp(dot(N, halfDir), 0.0, 1.0), 480.0);
  float sparkle = smoothstep(0.86, 1.0, noise(vWorldPos.xz * 3.1 + uTime * 1.7));
  float glitter = pow(clamp(dot(N, halfDir), 0.0, 1.0), 90.0) * sparkle * 2.5;
  vec3 sunSpec = uSunColor * (spec * 10.0 + glitter) * (0.4 + 0.6 * vFresnelBoost);

  // Foam
  float foamNoise = fbm(vWorldPos.xz * 0.35 + uTime * 0.12);
  float foamMask = clamp(vFoamFactor * 1.4 - 0.25, 0.0, 1.0);
  foamMask *= smoothstep(0.25, 0.75, foamNoise + vFoamFactor * 0.3);
  vec3 foamColor = vec3(0.95, 0.98, 1.0);

  vec3 base = mix(waterColor, reflColor, fresnel * 0.92);
  base += sunSpec;
  base = mix(base, foamColor, foamMask);

  // Distance fog blending to sky/horizon colour
  float dist = length(uCamPos - vWorldPos);
  float fog = 1.0 - exp(-dist * uFogDensity);
  fog = clamp(fog, 0.0, 1.0);
  vec3 color = mix(base, uFogColor, fog);

  gl_FragColor = vec4(color, 1.0);
}
`;

export class OceanField {
  constructor(renderer, sunDirection) {
    this.renderer = renderer;

    const SIZE = 2600;
    const SEGMENTS = 320;
    const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS);
    geo.rotateX(-Math.PI / 2);
    geo.computeBoundingSphere();

    const waveA = WAVE_SET.map(w => new THREE.Vector4(w[0], w[1], w[2], w[3]));
    const waveB = WAVE_SET.map(w => new THREE.Vector2(w[4], 0));

    this.uniforms = {
      uTime: { value: 0 },
      uCamPos: { value: new THREE.Vector3() },
      uWaveA: { value: waveA },
      uWaveB: { value: waveB },
      uSunDirection: { value: sunDirection.clone() },
      uSunColor: { value: new THREE.Color(0xfff0d8) },
      uEnvMap: { value: null },
      uDeepColor: { value: new THREE.Color(0x02182a) },
      uShallowColor: { value: new THREE.Color(0x0c5c66) },
      uFogColor: { value: new THREE.Color(0xaec7d6) },
      uFogDensity: { value: 0.00075 },
    };

    this.material = new THREE.ShaderMaterial({
      vertexShader: OCEAN_VERTEX,
      fragmentShader: OCEAN_FRAGMENT,
      uniforms: this.uniforms,
      lights: false,
      fog: false,
    });

    this.mesh = new THREE.Mesh(geo, this.material);
    this.mesh.receiveShadow = false;
    this.mesh.frustumCulled = false;

    // Far skirt so the grid edge never shows against the horizon
    const skirtGeo = new THREE.RingGeometry(SIZE * 0.48, 18000, 64, 1);
    skirtGeo.rotateX(-Math.PI / 2);
    this.skirtMat = new THREE.MeshBasicMaterial({ color: 0x0b3c46, fog: false });
    this.skirt = new THREE.Mesh(skirtGeo, this.skirtMat);
    this.skirt.position.y = -1.2;

    this.group = new THREE.Group();
    this.group.add(this.mesh);
    this.group.add(this.skirt);
  }

  setEnvMap(cubeTexture) {
    this.uniforms.uEnvMap.value = cubeTexture;
  }

  setFogColor(color) {
    this.uniforms.uFogColor.value.copy(color);
    this.skirtMat.color.copy(color).multiplyScalar(0.55);
  }

  update(dt, elapsed, camera) {
    this.uniforms.uTime.value = elapsed;
    this.uniforms.uCamPos.value.copy(camera.position);
    const step = 2600 / 320;
    this.mesh.position.x = Math.round(camera.position.x / step) * step;
    this.mesh.position.z = Math.round(camera.position.z / step) * step;
    this.skirt.position.x = camera.position.x;
    this.skirt.position.z = camera.position.z;
  }

  // Sample approximate wave height at a world XZ (CPU-side, matches vertex shader math)
  getHeightAt(x, z, t) {
    let y = 0;
    for (const [dx, dz, steepness, wavelength] of WAVE_SET) {
      const k = (2 * Math.PI) / wavelength;
      const speed = WAVE_SET.find(w => w[3] === wavelength)[4];
      const c = Math.sqrt(9.8 / k) * speed * 0.35 + speed * 0.15;
      const f = k * (dx * x + dz * z - c * t * 3.0);
      const a = (steepness / k / WAVE_SET.length) * 2.2;
      y += a * Math.sin(f) * 0.72;
    }
    return y;
  }
}

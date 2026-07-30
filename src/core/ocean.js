import * as THREE from 'three';

// Gerstner wave parameters: [dirX, dirZ, steepness, wavelength, speed]
const WAVE_SET = [
  [1.0, 0.2, 0.38, 82.0, 1.05],
  [0.65, -0.75, 0.32, 52.0, 1.28],
  [-0.4, 0.9, 0.26, 34.0, 1.65],
  [0.9, 0.5, 0.19, 21.0, 2.05],
  [-0.75, -0.6, 0.15, 13.0, 2.55],
  [0.2, -1.0, 0.11, 7.8, 3.35],
  [-1.0, 0.15, 0.085, 4.4, 4.2],
  [0.55, 0.83, 0.06, 2.5, 5.5],
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
    float a = steepness / k / float(NUM_WAVES) * 2.85;
    offset.x += dir.x * a * cos(f);
    offset.z += dir.y * a * cos(f);
    offset.y += a * sin(f) * 0.82;

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
  for (int i = 0; i < 3; i++) { v += amp * noise(p); p *= 2.02; amp *= 0.5; }
  return v;
}

uniform float uDetailLevel; // 0 = cheap distant water, 1 = near-field micro detail

void main() {
  vec3 viewDir = normalize(uCamPos - vWorldPos);
  float dist = length(uCamPos - vWorldPos);
  // Skip expensive noise beyond ~220m; fade in near the camera.
  float nearDetail = smoothstep(420.0, 70.0, dist) * uDetailLevel;

  vec3 N = normalize(vNormal);
  if (nearDetail > 0.01) {
    vec2 rp = vWorldPos.xz * 0.06 + uTime * 0.035;
    float n1 = fbm(rp);
    vec2 grad = vec2(n1 - fbm(rp + vec2(0.6, 0.0)), n1 - fbm(rp + vec2(0.0, 0.6)));
    vec2 grad2 = vec2(0.0);
    if (nearDetail > 0.55) {
      vec2 rp2 = vWorldPos.xz * 0.34 - uTime * 0.05;
      float n2 = fbm(rp2);
      grad2 = vec2(n2 - fbm(rp2 + vec2(0.35, 0.0)), n2 - fbm(rp2 + vec2(0.0, 0.35))) * 0.55;
    }
    vec3 detailNormal = normalize(vec3(grad.x * 1.35 + grad2.x, 1.0, grad.y * 1.35 + grad2.y));
    N = normalize(mix(vNormal, normalize(vNormal + detailNormal * 0.55), nearDetail * 0.85));
  }

  float NdotV = clamp(dot(N, viewDir), 0.0, 1.0);
  float fresnel = pow(1.0 - NdotV, 4.2);
  fresnel = mix(0.04, 1.0, fresnel);

  vec3 reflectDir = reflect(-viewDir, N);
  vec3 reflColor = textureCube(uEnvMap, reflectDir).rgb;
  // Boost sky reflection so distant water reads like glass, not matte paint
  reflColor *= 1.15;

  float depthMix = clamp(dot(N, vec3(0.0,1.0,0.0)), 0.0, 1.0);
  vec3 waterColor = mix(uDeepColor, uShallowColor, pow(depthMix, 2.4) * 0.55);

  vec3 halfDir = normalize(uSunDirection + viewDir);
  float NdotH = clamp(dot(N, halfDir), 0.0, 1.0);
  float spec = min(pow(NdotH, 560.0) * 1.15, 1.1);
  float sparkle = nearDetail > 0.15
    ? smoothstep(0.955, 1.0, noise(vWorldPos.xz * 11.0 + uTime * 2.1))
    : 0.0;
  float glitter = pow(NdotH, 180.0) * sparkle * 1.05;
  vec3 sunSpec = uSunColor * (spec + glitter) * (0.45 + 0.7 * vFresnelBoost);

  float foamMask = clamp(vFoamFactor * 1.65 - 0.08, 0.0, 1.0);
  // Crest foam readable from chase altitude; micro-noise only near camera
  if (nearDetail > 0.1 && foamMask > 0.015) {
    float foamNoise = fbm(vWorldPos.xz * 0.32 + uTime * 0.12);
    foamMask *= smoothstep(0.12, 0.7, foamNoise * 0.5 + vFoamFactor * 0.5);
  } else {
    foamMask *= smoothstep(0.04, 0.5, vFoamFactor);
  }
  vec3 foamColor = vec3(0.94, 0.97, 1.0);

  // Distant water deepens + desaturates (beer-lambert-ish) so the near field pops
  float absorb = 1.0 - exp(-dist * 0.00032);
  waterColor = mix(waterColor, uDeepColor * 0.68, absorb * 0.7);

  // Soft-edge the Gerstner tile so it doesn't hard-cut into the skirt (horizon steps)
  float edgeDist = length(vWorldPos.xz - uCamPos.xz);
  float edgeFade = smoothstep(1000.0, 1320.0, edgeDist);

  // Second specular lobe (broader) sells "wet" water from chase altitude like WoWS
  float broadSpec = pow(NdotH, 48.0) * 0.22;
  sunSpec += uSunColor * broadSpec * (0.35 + 0.65 * nearDetail);

  float horizonBoost = pow(1.0 - clamp(N.y, 0.0, 1.0), 2.2);
  vec3 base = mix(waterColor, reflColor, fresnel * 0.94 + horizonBoost * 0.32);
  base += sunSpec * (1.1 + horizonBoost * 0.6);
  base = mix(base, foamColor, foamMask * 0.95);
  // Skirt blend uses deeper water tint, not fog gray — reduces hard horizon seam
  vec3 skirtTint = mix(uDeepColor * 0.85, uFogColor * 0.55, 0.35);
  base = mix(base, skirtTint, edgeFade);

  // Distance fog — softstep to reduce banding on large flat gradients
  float fog = 1.0 - exp(-dist * uFogDensity);
  fog = clamp(fog, 0.0, 1.0);
  fog = smoothstep(0.0, 1.0, fog);
  float dither = (hash(gl_FragCoord.xy * 0.15 + uTime) - 0.5) * (1.5 / 255.0);
  vec3 color = mix(base, uFogColor, fog * 0.9) + dither;

  gl_FragColor = vec4(color, 1.0);
}
`;

export class OceanField {
  constructor(renderer, sunDirection) {
    this.renderer = renderer;

    // 220² (~97k tris) — smoother Gerstner silhouette at chase altitude vs 160².
    this.size = 2800;
    this.segments = 220;
    const geo = new THREE.PlaneGeometry(this.size, this.size, this.segments, this.segments);
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
      uDeepColor: { value: new THREE.Color(0x021526) },
      uShallowColor: { value: new THREE.Color(0x0e6a72) },
      uFogColor: { value: new THREE.Color(0xb0c9d8) },
      uFogDensity: { value: 0.00068 },
      uDetailLevel: { value: 0.75 },
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

    // Far skirt: high radial density so the horizon doesn't stair-step against the sky.
    // Color-matched to fog and lifted near sea level so the Gerstner grid edge soft-fades
    // instead of reading as a hard polygonal silhouette.
    const skirtGeo = new THREE.RingGeometry(this.size * 0.42, 22000, 192, 1);
    skirtGeo.rotateX(-Math.PI / 2);
    this.skirtMat = new THREE.MeshBasicMaterial({
      color: 0x0b3c46,
      fog: false,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
    });
    this.skirt = new THREE.Mesh(skirtGeo, this.skirtMat);
    this.skirt.position.y = -0.35;
    this.skirt.renderOrder = -1;

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

  setQuality(q) {
    const levels = { low: 0.2, medium: 0.7, high: 0.92, ultra: 1.0 };
    this.uniforms.uDetailLevel.value = levels[q] ?? 0.7;
  }

  update(dt, elapsed, camera) {
    this.uniforms.uTime.value = elapsed;
    this.uniforms.uCamPos.value.copy(camera.position);
    const step = this.size / this.segments;
    this.mesh.position.x = Math.round(camera.position.x / step) * step;
    this.mesh.position.z = Math.round(camera.position.z / step) * step;
    this.skirt.position.x = camera.position.x;
    this.skirt.position.z = camera.position.z;
  }

  // Sample approximate wave height at a world XZ (CPU-side, matches vertex shader math)
  getHeightAt(x, z, t) {
    let y = 0;
    for (const [dx, dz, steepness, wavelength, speed] of WAVE_SET) {
      const k = (2 * Math.PI) / wavelength;
      const c = Math.sqrt(9.8 / k) * speed * 0.35 + speed * 0.15;
      const f = k * (dx * x + dz * z - c * t * 3.0);
      const a = (steepness / k / WAVE_SET.length) * 2.85;
      y += a * Math.sin(f) * 0.82;
    }
    return y;
  }
}

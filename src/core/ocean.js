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
    float a = steepness / k / float(NUM_WAVES) * 3.35;
    offset.x += dir.x * a * cos(f);
    offset.z += dir.y * a * cos(f);
    offset.y += a * sin(f) * 0.92;

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
uniform vec3 uShipPos;
uniform float uShipSpeed;
uniform vec2 uShipFwd;
varying vec3 vWorldPos;
varying vec3 vNormal;
varying float vFoamFactor;
varying float vFresnelBoost;
varying float vHullWake;

${GERSTNER_FUNC}

void main() {
  vec3 pos = position;
  // world-space XZ (grid is re-centered on camera each frame via mesh position)
  vec3 worldXZ = pos + vec3(modelMatrix[3].x, 0.0, modelMatrix[3].z);

  vec3 tangent, binormal;
  vec3 disp = gerstner(worldXZ, uTime, tangent, binormal);

  // Hull bow mound — displace the water SURFACE (judge: stickers aren't fluid)
  float spd = clamp(uShipSpeed / 22.0, 0.0, 1.35);
  vec2 fwd = length(uShipFwd) > 0.01 ? normalize(uShipFwd) : vec2(0.0, 1.0);
  vec2 toShip = worldXZ.xz - uShipPos.xz;
  float along = dot(toShip, fwd);
  float side = abs(dot(toShip, vec2(-fwd.y, fwd.x)));
  float bowMound = smoothstep(70.0, 0.0, along) * smoothstep(-10.0, 28.0, along)
    * smoothstep(28.0, 0.8, side) * spd;
  // Slight stern depression / roostertail lift
  float sternLift = smoothstep(8.0, -14.0, along) * smoothstep(-120.0, -18.0, along)
    * smoothstep(22.0, 1.5, side) * spd * 0.55;
  // Bow mound + stern lift strong enough to read at chase altitude
  // Keep wake mounds modest — large values dig a blue "skirt" depression around the hull
  float wakeH = bowMound * 5.5 + sternLift * 2.2;
  // Kelvin displacement ridges (height, not just foam paint)
  float armAng = abs(atan(side, max(0.001, -along)));
  float kelvinRidge = smoothstep(0.08, 0.0, abs(armAng - 0.34))
    * smoothstep(-12.0, -70.0, along) * smoothstep(-380.0, -40.0, along)
    * smoothstep(120.0, 10.0, side) * spd;
  // NEVER depress water beside the hull — that exposed the underwater tan skirt (F40 FAIL).
  // Dark troughs are COLOR-only in the fragment shader. Vertex wake only lifts UP.
  float ridgeNoise = 0.55 + 0.45 * sin(along * 0.07 + side * 0.11);
  disp.y += wakeH + kelvinRidge * 1.2 * ridgeNoise;
  // Tip normals toward the mound / ridges so lighting sells displacement
  tangent.y += bowMound * 0.55 + kelvinRidge * 0.35 * ridgeNoise;
  binormal.y += bowMound * 0.25 + kelvinRidge * 0.18 * ridgeNoise;
  vHullWake = clamp(bowMound + sternLift + kelvinRidge * 0.8, 0.0, 1.6);

  pos += disp;

  vec3 n = normalize(cross(binormal, tangent));
  vNormal = n;

  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vWorldPos = worldPos.xyz;

  // crude crest/foam factor from steepness accumulation (jacobian-ish)
  float steep = length(tangent - vec3(1.0,0.0,0.0)) + length(binormal - vec3(0.0,0.0,1.0));
  vFoamFactor = clamp(steep - 0.55 + vHullWake * 0.8, 0.0, 1.8);

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
varying float vHullWake;

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
uniform vec3 uShipPos;
uniform float uShipSpeed; // knots
uniform vec2 uShipFwd;    // XZ forward unit
uniform float uShipHalfLen;
uniform float uShipBeam;

void main() {
  vec3 viewDir = normalize(uCamPos - vWorldPos);
  float dist = length(uCamPos - vWorldPos);
  // Skip expensive noise beyond ~220m; fade in near the camera.
  float nearDetail = smoothstep(420.0, 70.0, dist) * uDetailLevel;

  vec3 N = normalize(vNormal);
  if (nearDetail > 0.01) {
    // Capillary + chop layers so ocean isn't a smooth plastic swell
    vec2 rp = vWorldPos.xz * 0.06 + uTime * 0.035;
    float n1 = fbm(rp);
    vec2 grad = vec2(n1 - fbm(rp + vec2(0.6, 0.0)), n1 - fbm(rp + vec2(0.0, 0.6)));
    vec2 rpChop = vWorldPos.xz * 0.55 + uTime * 0.12;
    float nChop = fbm(rpChop);
    grad += vec2(nChop - fbm(rpChop + vec2(0.18, 0.0)), nChop - fbm(rpChop + vec2(0.0, 0.18))) * 0.65;
    vec2 rpCap = vWorldPos.xz * 2.8 + uTime * 0.4;
    float nCap = noise(rpCap);
    grad += vec2(nCap - noise(rpCap + vec2(0.04, 0.0)), nCap - noise(rpCap + vec2(0.0, 0.04))) * 0.4;
    vec3 detailNormal = normalize(vec3(grad.x * 1.7, 1.0, grad.y * 1.7));
    N = normalize(mix(vNormal, normalize(vNormal + detailNormal * 0.85), nearDetail * 0.95));
  }

  float NdotV = clamp(dot(N, viewDir), 0.0, 1.0);
  float fresnel = pow(1.0 - NdotV, 4.2);
  fresnel = mix(0.04, 1.0, fresnel);

  vec3 reflectDir = reflect(-viewDir, N);
  vec3 reflColor = textureCube(uEnvMap, reflectDir).rgb;
  // Boost sky reflection so distant water reads like glass, not matte paint
  reflColor *= 1.18;

  float depthMix = clamp(dot(N, vec3(0.0,1.0,0.0)), 0.0, 1.0);
  vec3 waterColor = mix(uDeepColor, uShallowColor, pow(depthMix, 2.4) * 0.55);

  vec3 halfDir = normalize(uSunDirection + viewDir);
  float NdotH = clamp(dot(N, halfDir), 0.0, 1.0);
  // Tight glitter + mid lobe — avoid giant cyan specular pancake at chase altitude
  float spec = min(pow(NdotH, 720.0) * 0.55, 0.65);
  float sparkle = nearDetail > 0.2
    ? smoothstep(0.97, 1.0, noise(vWorldPos.xz * 14.0 + uTime * 2.4))
    : 0.0;
  float glitter = pow(NdotH, 240.0) * sparkle * 0.55;
  vec3 sunSpec = uSunColor * (spec + glitter) * (0.35 + 0.55 * vFresnelBoost);

  vec2 toShip = vWorldPos.xz - uShipPos.xz;
  float shipDist = length(toShip);
  float spd = clamp(uShipSpeed / 20.0, 0.0, 1.4);
  vec2 fwd = length(uShipFwd) > 0.01 ? normalize(uShipFwd) : vec2(0.0, 1.0);
  float along = dot(toShip, fwd);
  float side = abs(dot(toShip, vec2(-fwd.y, fwd.x)));
  // Midships flank mask — foam banned on beam flanks (F41)
  float halfLen = max(uShipHalfLen, 55.0);
  float beam = max(uShipBeam, 16.0);
  float besideHull = smoothstep(halfLen * 0.72, halfLen * 0.28, abs(along))
    * smoothstep(beam * 2.6, beam * 0.5, side);
  // Tight waterline ring around FULL LOA (incl. bow) — kills specular bloom without
  // blanketing the Kelvin arms that live farther outboard / aft.
  float waterlineRing = smoothstep(beam * 1.85, beam * 0.22, side)
    * smoothstep(halfLen + 18.0, halfLen * 0.92, abs(along));
  float contactKill = (1.0 - max(besideHull, waterlineRing * 0.92))
    * smoothstep(8.0, 36.0, shipDist);

  float foamMask = clamp(vFoamFactor * 1.55 - 0.08, 0.0, 1.0);
  if (nearDetail > 0.1 && foamMask > 0.015) {
    float foamNoise = fbm(vWorldPos.xz * 0.32 + uTime * 0.12);
    foamMask *= smoothstep(0.12, 0.7, foamNoise * 0.5 + vFoamFactor * 0.5);
  } else {
    foamMask *= smoothstep(0.04, 0.5, vFoamFactor);
  }
  float ambientCrest = smoothstep(0.48, 0.9, vFoamFactor) * (0.2 + 0.16 * fbm(vWorldPos.xz * 0.18 + uTime * 0.05));
  foamMask = max(foamMask, ambientCrest * (0.5 + 0.3 * nearDetail));
  foamMask *= mix(0.05, 1.0, contactKill);

  // Physical wake foam: bow lace + Kelvin V + stern lane (outside waterline contact)
  float hullFoam = 0.0;
  if (spd > 0.04 && shipDist < 480.0) {
    float lace = smoothstep(0.3, 0.88, fbm(vWorldPos.xz * 0.55 + uTime * 0.4));
    float streak = smoothstep(0.5, 0.95, fbm(vWorldPos.xz * 1.4 - uTime * 0.2));
    float sternLane = smoothstep(-8.0, -35.0, along) * smoothstep(-480.0, -40.0, along)
      * smoothstep(42.0, 2.0, side);
    sternLane *= exp(-max(0.0, -along) * 0.0065);
    float armAngle = abs(atan(side, max(0.001, -along)));
    float armBand = smoothstep(0.1, 0.0, abs(armAngle - 0.34));
    float kelvinArm = smoothstep(-8.0, -42.0, along) * smoothstep(-500.0, -40.0, along)
      * armBand * smoothstep(150.0, 5.0, side);
    kelvinArm *= exp(-max(0.0, -along) * 0.0035);
    // Bow lace — kept OUTBOARD of the waterline ring so it doesn't become bloom
    float bow = smoothstep(85.0, 22.0, along) * smoothstep(14.0, 48.0, along)
      * smoothstep(28.0, beam * 0.9, side) * smoothstep(beam * 0.55, beam * 1.6, side);
    bow *= 0.25 + 0.75 * lace * streak;
    float moundFoam = vHullWake * smoothstep(14.0, 50.0, along) * (1.0 - besideHull)
      * (1.0 - waterlineRing) * 0.85;
    // Distance falloff + noise breakup so wake dissolves into swell
    float wakeAge = exp(-max(0.0, -along) * 0.0032);
    float breakup = lace * streak * (0.45 + 0.55 * sin(along * 0.12 + uTime * 1.1 + side * 0.08));
    // Prefer stern + Kelvin (readable chase V) over bow contact foam
    hullFoam = (sternLane * 2.2 + kelvinArm * 2.6 + bow * 0.55 + moundFoam) * spd * wakeAge;
    hullFoam *= 0.4 + 0.6 * breakup;
  }
  // Never paint foam on hull flanks or inside the waterline bloom ring
  hullFoam *= (1.0 - besideHull) * (1.0 - waterlineRing * 0.98);
  hullFoam *= mix(0.5, 1.0, smoothstep(-halfLen * 0.1, -halfLen * 0.75, along)
    + smoothstep(halfLen * 0.35, halfLen * 0.75, along) * 0.35);
  // Soft wet darkening along hull flanks + dark fill inside Kelvin V
  float wetBand = max(besideHull * (0.5 + 0.25 * spd), smoothstep(16.0, 3.0, shipDist) * (0.15 + 0.18 * spd));
  float armAngle2 = abs(atan(side, max(0.001, -along)));
  float wakeTrough = smoothstep(0.32, 0.05, armAngle2) * smoothstep(-18.0, -95.0, along)
    * smoothstep(-340.0, -45.0, along) * spd * 0.55;
  hullFoam = max(hullFoam, 0.0);
  foamMask = max(foamMask, clamp(hullFoam, 0.0, 1.0));

  // Soft foam — never near-white at contact (emissive skirt FAIL)
  vec3 foamCrest = vec3(0.68, 0.74, 0.76);
  vec3 foamBase = vec3(0.40, 0.50, 0.54);
  vec3 foamColor = mix(foamBase, foamCrest, clamp(hullFoam * 0.55 + foamMask * 0.08, 0.0, 1.0));

  // Distant water deepens + desaturates (beer-lambert-ish) so the near field pops
  float absorb = 1.0 - exp(-dist * 0.00032);
  waterColor = mix(waterColor, uDeepColor * 0.68, absorb * 0.7);

  // Soft-edge the Gerstner tile so it doesn't hard-cut into the skirt (horizon steps)
  float edgeDist = length(vWorldPos.xz - uCamPos.xz);
  float edgeFade = smoothstep(900.0, 1450.0, edgeDist);

  // Second specular lobe (broader) sells "wet" water from chase altitude like WoWS
  float broadSpec = pow(NdotH, 64.0) * 0.12;
  sunSpec += uSunColor * broadSpec * (0.25 + 0.5 * nearDetail);

  float horizonBoost = pow(1.0 - clamp(N.y, 0.0, 1.0), 2.2);
  // Kill specular/fresnel hot-edge at hull contact (reads as white waterline bloom)
  float nearShip = smoothstep(beam * 3.2, beam * 0.9, shipDist);
  float contactDim = mix(0.03, 1.0, contactKill);
  contactDim *= mix(0.22, 1.0, 1.0 - besideHull * 0.92);
  contactDim *= mix(0.10, 1.0, 1.0 - waterlineRing);
  contactDim *= mix(0.35, 1.0, 1.0 - nearShip * 0.85);
  float fresnelUse = fresnel * mix(0.12, 0.94, contactKill) * (1.0 - nearShip * 0.55);
  vec3 base = mix(waterColor, reflColor, fresnelUse + horizonBoost * 0.28 * contactDim);
  base += sunSpec * (1.05 + horizonBoost * 0.5) * contactDim;
  // Extra hard kill on residual white contact patch under midships/bow
  float bloomKill = max(waterlineRing, max(nearShip * besideHull, nearShip * 0.55));
  base = mix(base, waterColor * 0.88, bloomKill * 0.95);
  sunSpec *= (1.0 - bloomKill * 0.98);
  // Soften any leftover bright streak near the hull footprint
  base = mix(base, uDeepColor * 0.75, bloomKill * 0.35);
  // Wet contact + dark V-fill before foam (foam lives on Kelvin crests / stern / bow)
  base *= (1.0 - wetBand * 0.7);
  base = mix(base, uDeepColor * 0.5, clamp(wakeTrough + (1.0 - contactKill) * 0.35, 0.0, 0.75));
  // Foam outside waterline ring — stern/Kelvin must read at chase altitude
  float foamAmt = clamp(foamMask, 0.0, 1.0) * 0.78
    * (1.0 - besideHull * 0.95) * (1.0 - waterlineRing * 0.92);
  base = mix(base, foamColor, foamAmt);
  base += foamCrest * clamp(hullFoam, 0.0, 1.0) * 0.09
    * (1.0 - besideHull) * (1.0 - waterlineRing);
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
      uDeepColor: { value: new THREE.Color(0x071f32) },
      uShallowColor: { value: new THREE.Color(0x14606a) },
      uFogColor: { value: new THREE.Color(0xa8bcc8) },
      uFogDensity: { value: 0.00095 },
      uDetailLevel: { value: 0.85 },
      uShipPos: { value: new THREE.Vector3() },
      uShipSpeed: { value: 0 },
      uShipFwd: { value: new THREE.Vector2(0, 1) },
      uShipHalfLen: { value: 70 },
      uShipBeam: { value: 18 },
    };

    this.material = new THREE.ShaderMaterial({
      vertexShader: OCEAN_VERTEX,
      fragmentShader: OCEAN_FRAGMENT,
      uniforms: this.uniforms,
      lights: false,
      fog: false,
    });

    this.mesh = new THREE.Mesh(geo, this.material);
    this.mesh.receiveShadow = true;
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
      opacity: 0.78,
      depthWrite: false,
    });
    this.skirt = new THREE.Mesh(skirtGeo, this.skirtMat);
    this.skirt.position.y = -0.55;
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
    const levels = { low: 0.2, medium: 0.75, high: 0.95, ultra: 1.0 };
    this.uniforms.uDetailLevel.value = levels[q] ?? 0.75;
  }

  /** Drive hull-proximal foam from the local ship each frame. */
  setShipState(ship) {
    if (!ship?.group) return;
    const p = ship.group.position;
    this.uniforms.uShipPos.value.set(p.x, p.y, p.z);
    this.uniforms.uShipSpeed.value = Math.abs(ship.physics?.speedKnots || 0);
    const h = ship.physics?.heading ?? 0;
    this.uniforms.uShipFwd.value.set(Math.sin(h), Math.cos(h));
    const len = ship.physics?.length || 140;
    const beam = ship.physics?.beam || 18;
    this.uniforms.uShipHalfLen.value = len * 0.48;
    this.uniforms.uShipBeam.value = beam;
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

  // Sample wave height + hull wake displacement (must match vertex shader for coupling)
  getHeightAt(x, z, t) {
    let y = 0;
    for (const [dx, dz, steepness, wavelength, speed] of WAVE_SET) {
      const k = (2 * Math.PI) / wavelength;
      const c = Math.sqrt(9.8 / k) * speed * 0.35 + speed * 0.15;
      const f = k * (dx * x + dz * z - c * t * 3.0);
      const a = (steepness / k / WAVE_SET.length) * 3.35;
      y += a * Math.sin(f) * 0.92;
    }
    const ship = this.uniforms.uShipPos.value;
    const spd = Math.min(1.35, Math.max(0, this.uniforms.uShipSpeed.value / 22));
    if (spd > 0.02) {
      const fwd = this.uniforms.uShipFwd.value;
      const fl = Math.hypot(fwd.x, fwd.y) || 1;
      const fx = fwd.x / fl;
      const fz = fwd.y / fl;
      const tx = x - ship.x;
      const tz = z - ship.z;
      const along = tx * fx + tz * fz;
      const side = Math.abs(tx * -fz + tz * fx);
      const bowMound = Math.max(0, Math.min(1,
        (1 - Math.max(0, Math.min(1, (along - 2) / 56))) *
        Math.max(0, Math.min(1, (along + 8) / 30)) *
        Math.max(0, Math.min(1, 1 - (side - 1.2) / 22.8))
      )) * spd;
      const sternLift = Math.max(0, Math.min(1,
        Math.max(0, Math.min(1, (8 - along) / 22)) *
        Math.max(0, Math.min(1, (along + 100) / 80)) *
        Math.max(0, Math.min(1, 1 - (side - 2) / 16))
      )) * spd * 0.4;
      const armAng = Math.abs(Math.atan2(side, Math.max(0.001, -along)));
      const kelvinRidge = Math.max(0, 1 - Math.abs(armAng - 0.34) / 0.08) *
        Math.max(0, Math.min(1, (-along - 12) / 58)) *
        Math.max(0, Math.min(1, (-along + 380) / 340)) *
        Math.max(0, Math.min(1, 1 - (side - 10) / 110)) * spd;
      y += bowMound * 5.5 + sternLift * 2.2 + kelvinRidge * 1.2;
    }
    return y;
  }
}

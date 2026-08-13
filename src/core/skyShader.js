import { Vector3, Color } from 'three';

/**
 * Hand-authored procedural sky: gradient (horizon -> zenith), sun disc + corona + halo,
 * and a soft animated cumulus cloud layer via fbm noise. Chosen over a raw physical
 * (Preetham) model because that model's calibration desaturates badly under normal
 * exposure (see git history / comments in sky.js) — an authored gradient is what
 * real AAA game skies use anyway, since it gives direct, reliable art control.
 */
export const SkyShader = {
  uniforms: {
    uSunDirection: { value: new Vector3(0, 0.5, -1) },
    uZenithColor: { value: new Color(0x1c4d86) },
    uHorizonColor: { value: new Color(0xaecbdd) },
    uSunColor: { value: new Color(0xfff2d6) },
    uCloudCoverage: { value: 0.18 },
    uCloudiness: { value: 0.95 },
    uCloudColorLit: { value: new Color(0xf4f7fb) },
    uCloudColorShadow: { value: new Color(0x2e3c4c) },
    uTime: { value: 0 },
  },
  vertexShader: /* glsl */`
    varying vec3 vWorldPosition;
    void main() {
      vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      gl_Position.z = gl_Position.w;
    }
  `,
  fragmentShader: /* glsl */`
    varying vec3 vWorldPosition;
    uniform vec3 uSunDirection;
    uniform vec3 uZenithColor;
    uniform vec3 uHorizonColor;
    uniform vec3 uSunColor;
    uniform float uCloudCoverage;
    uniform float uCloudiness;
    uniform vec3 uCloudColorLit;
    uniform vec3 uCloudColorShadow;
    uniform float uTime;

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
    // Full-detail fbm for the visible cloud silhouette / erosion.
    float fbm(vec2 p) {
      float v = 0.0, amp = 0.52;
      for (int i = 0; i < 5; i++) { v += amp * noise(p); p = p * 2.03 + vec2(1.7, 9.2); amp *= 0.5; }
      return v;
    }
    // Cheap 3-octave fbm reused by the sun light-march taps below (the shadow only
    // needs the coarse cloud mass, not the fine erosion detail, so paying for 5
    // octaves per tap would be wasted).
    float fbm3(vec2 p) {
      float v = 0.0, amp = 0.5;
      for (int i = 0; i < 3; i++) { v += amp * noise(p); p = p * 2.02 + vec2(3.1, 1.7); amp *= 0.5; }
      return v;
    }

    // Coarse cloud mass with domain warping. The warp is what turns blobby value
    // noise into billowing cumulus cauliflower shapes — it is the single biggest
    // difference between "procedural noise" and "clouds". thr is the coverage
    // threshold (WeatherSystem drives it; lower = cloudier). Reused for both the
    // displayed shape and the light-march occlusion taps so they agree.
    float cloudShape(vec2 uv, float thr) {
      vec2 w = vec2(fbm3(uv * 0.65 + 11.5), fbm3(uv * 0.65 + 27.1));
      vec2 uw = uv + (w - 0.5) * 2.1;
      float d = fbm3(uw);
      return clamp((d - thr) / (1.0 - thr), 0.0, 1.0);
    }

    void main() {
      vec3 dir = normalize(vWorldPosition - cameraPosition);
      float elevation = dir.y;

      // Jitter elevation before the pow — breaks mach bands on the large horizon ramp
      float skyMixRaw = clamp(elevation, 0.0, 1.0);
      skyMixRaw += (hash(gl_FragCoord.xy * 0.37 + uTime * 0.03) - 0.5) * 0.007;
      float skyMix = pow(clamp(skyMixRaw, 0.0, 1.0), 0.45);
      vec3 sky = mix(uHorizonColor, uZenithColor, skyMix);

      // subtle extra warmth low near the horizon
      float lowBand = 1.0 - smoothstep(0.0, 0.22, elevation);
      sky = mix(sky, sky + vec3(0.05, 0.02, -0.02), lowBand * 0.5);

      // Directional aerial-perspective haze: real skies are visibly brighter and warmer
      // in a band around the sun's azimuth near the horizon (forward Mie scattering),
      // and slightly darker/cooler on the anti-sun side. A horizonColor that's flat in
      // every direction is one of the biggest "cheap CG sky" tells — this breaks that up
      // and gives the sky a sense of depth/directionality without touching the base
      // gradient uniforms (still fully driven by uZenithColor/uHorizonColor).
      vec3 horizDirN = normalize(vec3(dir.x, 0.0, dir.z));
      vec3 horizSunN = normalize(vec3(uSunDirection.x, 0.0, uSunDirection.z));
      float sunAz = dot(horizDirN, horizSunN);
      float hazeBand = (1.0 - smoothstep(0.0, 0.5, elevation)) * clamp(elevation * 4.0 + 0.15, 0.0, 1.0);
      float hazeDir = sunAz * 0.5 + 0.5;
      vec3 hazeWarm = vec3(0.07, 0.032, -0.034) * pow(hazeDir, 2.0);
      vec3 hazeCool = vec3(-0.016, -0.006, 0.012) * pow(1.0 - hazeDir, 2.0);
      sky += (hazeWarm + hazeCool) * hazeBand;

      // below-horizon (looking down toward sea from a height, sky box interior) — keep consistent with horizon color
      if (elevation < 0.0) {
        sky = uHorizonColor * 0.9;
      }

      // sun disc / corona / halo
      float sunDot = dot(dir, normalize(uSunDirection));
      float sunDisc = smoothstep(0.99920, 0.99982, sunDot);
      float corona = pow(clamp(sunDot, 0.0, 1.0), 280.0) * 1.15;
      float halo = pow(clamp(sunDot, 0.0, 1.0), 9.0) * 0.32;
      vec3 sunContribution = uSunColor * (sunDisc * 14.0 + corona * 5.5 + halo);

      // ---- Cloud layer -----------------------------------------------------
      // Flat-plane projection (dir.xz / elevation), continuous in every direction
      // and physically the right mapping — it gives real perspective
      // foreshortening toward the horizon rather than uniform dome-stretched noise.
      //
      // The clouds are lit with a fake-volumetric model: a short light-march
      // toward the sun accumulates cloud mass between each point and the sun, and
      // Beer's law turns that into a transmittance. That is what gives the cloud
      // dimensional form — bright tops, shadowed undersides, and a bright rim
      // (silver lining) where the sun burns through thin edges. All in a single
      // fragment pass, no 3D volume, so it stays cheap enough for a sky box.
      float highFade = 1.0 - smoothstep(0.72, 1.0, elevation);
      float cloudFade = smoothstep(0.008, 0.11, elevation) * highFade;

      vec2 wind = vec2(uTime * 0.0038, uTime * 0.0011);
      vec2 cuv = (dir.xz / max(elevation, 0.085)) * 0.5 + wind;

      float thr = uCloudCoverage;
      float shape = cloudShape(cuv, thr);
      // Erode the edges with fine detail so cloud borders read as wispy/fractal
      // rather than as a hard noise contour.
      float detail = fbm(cuv * 3.3 + 6.0);
      float dens = clamp(shape * 1.3 - detail * (1.0 - shape) * 0.5, 0.0, 1.0);

      // Light march toward the sun's position projected onto the cloud plane. The
      // taps accumulate cloud mass between this point and the sun; Beer's law turns
      // that into a transmittance so cloud undersides / far sides go properly grey.
      vec2 sunPlane = uSunDirection.xz / max(uSunDirection.y, 0.20);
      vec2 toSun = normalize(sunPlane - cuv);
      float occ = 0.0;
      occ += cloudShape(cuv + toSun * 0.13, thr);
      occ += cloudShape(cuv + toSun * 0.28, thr);
      occ += cloudShape(cuv + toSun * 0.48, thr);
      occ += cloudShape(cuv + toSun * 0.74, thr);
      float light = exp(-occ * 1.35);             // transmittance toward the sun
      float powder = 1.0 - exp(-dens * 3.0);      // dark cores / bright fluffy edges

      // Shadowed cloud isn't black — it picks up bounced sky light. Mixing a little
      // of the local sky colour into the shadow keeps undersides from going muddy
      // while still reading clearly darker than the lit tops.
      vec3 lit = uCloudColorLit;
      vec3 shad = mix(uCloudColorShadow, sky * 0.75, 0.35);
      vec3 cloudColor = mix(shad, lit, light * (0.45 + 0.55 * powder));
      // Silver lining: looking toward the sun through a thin cloud edge blows out
      // bright and warm. Peaks where the cloud is lit (high transmittance) and thin.
      float rim = pow(clamp(sunDot, 0.0, 1.0), 4.0) * light * (1.0 - dens) * 1.8;
      cloudColor += uSunColor * (rim + corona * 0.12);

      // Crisp alpha ramp: cloud cores read as solid, edges stay fluffy. A soft
      // linear density made every cloud a translucent smudge that washed into the
      // bright sky — this is what makes them read as cumulus with real presence.
      float cloudA = smoothstep(0.04, 0.5, dens) * cloudFade * uCloudiness;
      sky = mix(sky, cloudColor, cloudA);

      // High, thin cirrus streaks for depth above the cumulus deck — very cheap,
      // faded out wherever the main deck already covers the sky.
      vec2 cir = dir.xz / max(elevation, 0.06) * 0.22 + vec2(uTime * 0.0016, uTime * 0.0006);
      float cirrus = smoothstep(0.52, 0.92, fbm(cir * 1.6))
        * smoothstep(0.04, 0.28, elevation) * highFade * (1.0 - cloudA);
      sky = mix(sky, uCloudColorLit * 1.03, cirrus * 0.22 * uCloudiness);

      vec3 color = sky + sunContribution * (1.0 - cloudA * 0.92);
      // Break sky gradient banding (common WebGL 8-bit artifact on large smooth ramps)
      float dither = (hash(gl_FragCoord.xy + uTime * 17.0) - 0.5) * (3.0 / 255.0);
      float horizonBand = (1.0 - smoothstep(0.0, 0.38, elevation));
      dither += (hash(vec2(gl_FragCoord.x * 0.5, gl_FragCoord.y * 0.5 + uTime * 3.0)) - 0.5)
        * horizonBand * (2.8 / 255.0);
      color += dither;
      // Soften near-horizon mach bands further with a tiny luma noise
      color += (hash(gl_FragCoord.yx * 1.7) - 0.5) * (1.6 / 255.0);
      gl_FragColor = vec4(color, 1.0);
    }
  `,
};

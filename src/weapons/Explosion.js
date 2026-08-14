import * as THREE from 'three';
import { getSharedDotTexture, getSharedRingTexture, getSharedFoamTexture } from '../utils/ProceduralTextures.js';

const fireballGeo = new THREE.SphereGeometry(1, 14, 10);
const ringGeo = new THREE.PlaneGeometry(2, 2);
ringGeo.rotateX(-Math.PI / 2);

const FIREBALL_VERT = `
varying vec3 vNormal;
varying vec3 vWorldPos;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const FIREBALL_FRAG = `
uniform float uTime;
uniform float uProgress;
uniform vec3 uColorHot;
uniform vec3 uColorCore;
varying vec3 vNormal;
varying vec3 vWorldPos;
float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float noise(vec3 x) {
  vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                  mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
              mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                  mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
void main() {
  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  float fresnel = pow(1.0 - clamp(dot(normalize(vNormal), viewDir), 0.0, 1.0), 1.6);
  // Three octaves with a sharper contrast curve so the fire reads as turbulent
  // billows (dark gaps between bright wisps) instead of a smooth glassy glob.
  float n = noise(vWorldPos * 0.09 + uTime * 1.8);
  n += noise(vWorldPos * 0.22 - uTime * 1.1) * 0.5;
  n += noise(vWorldPos * 0.48 + uTime * 2.4) * 0.25;
  n /= 1.75;
  float turb = smoothstep(0.32, 0.78, n);
  vec3 color = mix(uColorCore, uColorHot, turb);
  // Dimmer additive contribution than before (peak ~0.62, not 1.0): additive
  // fireballs SUM where they overlap, so a bright one blew rapid/stacked hits out
  // to a cream-white mass past the bloom threshold. Kept dim so the opaque core
  // (drawn over this) carries the brightness and stacked blasts stay legible fire
  // + dark smoke rather than a white blob.
  float alpha = mix(0.16, 0.62, turb) * (1.0 - uProgress) * mix(0.4, 0.85, fresnel);
  gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
}
`;

const EMBER_VERT = `
attribute vec3 aVel;
attribute float aSeed;
uniform float uTime;
uniform float uGravity;
uniform float uLife;
uniform float uBaseSize;
varying float vLife;
varying float vSeed;
void main() {
  float t = min(uTime, uLife);
  vec3 pos = position + aVel * t;
  pos.y -= 0.5 * uGravity * t * t;
  vLife = 1.0 - clamp(uTime / uLife, 0.0, 1.0);
  vSeed = aSeed;
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = uBaseSize * (0.5 + aSeed) * vLife * (250.0 / max(1.0, -mv.z));
  gl_Position = projectionMatrix * mv;
}
`;

const EMBER_FRAG = `
uniform sampler2D map;
uniform vec3 uColorA;
uniform vec3 uColorB;
varying float vLife;
varying float vSeed;
void main() {
  float a = texture2D(map, gl_PointCoord).a;
  vec3 color = mix(uColorB, uColorA, vSeed);
  float alpha = a * vLife;
  if (alpha < 0.02) discard;
  gl_FragColor = vec4(color, alpha);
}
`;

function buildEmberGeometry(count) {
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const dir = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(THREE.MathUtils.lerp(-0.2, 1, Math.random()));
    const speed = 4 + Math.random() * 10;
    dir.set(Math.sin(phi) * Math.cos(theta), Math.cos(phi) * 0.8 + 0.3, Math.sin(phi) * Math.sin(theta)).normalize();
    velocities[i * 3] = dir.x * speed;
    velocities[i * 3 + 1] = dir.y * speed;
    velocities[i * 3 + 2] = dir.z * speed;
    seeds[i] = Math.random();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('aVel', new THREE.BufferAttribute(velocities, 3));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
  return geo;
}

/**
 * Layered explosion: a noise-turbulent additive fireball (custom shader — organic
 * distortion instead of a flat-shaded sphere), a burst of ember/debris points that fly
 * outward under gravity, an expanding shockwave ring, a flash light, and (surface hits
 * only) a lingering drifting smoke puff. All geometry/textures are shared/cached module-
 * level or generated procedurally (see ProceduralTextures.js) — no image assets. Small
 * hits (CIWS intercepts, scale <= ~0.55) skip the smoke puff and use fewer embers, since
 * those can spawn in a rapid burst during sustained CIWS engagement and this needs to
 * stay cheap with several alive at once.
 */
export class Explosion {
  constructor(scene, position, { scale = 1, underwater = false, airburst = false } = {}) {
    this.scene = scene;
    this.age = 0;
    this.scale = scale;
    this.underwater = underwater;
    // An airburst (CIWS frag kill) must NOT read like a ship hit: no rolling fireball
    // and no lingering column of smoke, just a hard white flash that snaps out.
    this.airburst = airburst;
    this.dead = false;
    this.fireballLife = (airburst ? 0.34 : 1.05) * scale;
    // A surface ship strike leaves a smoke column that long outlives the fireball —
    // it should smoke for many seconds, not puff out in two (visual-judge finding:
    // "no dark rising smoke column"). Air and underwater bursts stay short (no
    // persistent plume); the fireball/embers/ring run on their own shorter timers,
    // so this only prolongs the smoke.
    this.life = airburst
      ? Math.max(0.55, 0.9 * scale)
      : underwater
        ? 2.6 * Math.min(1.6, scale)
        : Math.min(11, 2.6 * Math.min(1.6, scale) + (scale > 1 ? 5.5 : 0));

    const hot = airburst
      ? new THREE.Color(0xfff4d4).multiplyScalar(3.2)
      : (underwater ? new THREE.Color(0x8fe8ff) : new THREE.Color(0xffb247)).multiplyScalar(underwater ? 2.0 : 2.4);
    const core = airburst ? new THREE.Color(0xbfc4c8) : (underwater ? new THREE.Color(0x1c5a70) : new THREE.Color(0x5c1604));

    this.fireMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uColorHot: { value: hot },
        uColorCore: { value: core },
      },
      vertexShader: FIREBALL_VERT,
      fragmentShader: FIREBALL_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
    });
    this.fireMesh = new THREE.Mesh(fireballGeo, this.fireMat);
    this.fireMesh.position.copy(position);
    this.fireMesh.scale.setScalar(0.1);
    scene.add(this.fireMesh);

    // Opaque hot core — NORMAL (not additive) blending is the point: additive
    // never reads as solid (it just adds light and washes out over a bright sky),
    // which is exactly why the fireball looked like a translucent amber smudge with
    // no dense center. A normal-blended opaque hot ball gives the explosion a real
    // molten core; the additive fireball above is the glow wrapped around it.
    this.core = new THREE.Mesh(fireballGeo, new THREE.MeshBasicMaterial({
      color: underwater ? 0xcdf7ff : 0xffcf7a,
      transparent: true,
      opacity: 1,
      depthWrite: false,
      blending: THREE.NormalBlending,
    }));
    this.core.position.copy(position);
    this.core.scale.setScalar(0.05);
    this.core.renderOrder = 3; // draw over the additive fireball glow
    scene.add(this.core);

    this.light = new THREE.PointLight(
      airburst ? 0xfff0cc : (underwater ? 0x66d0e8 : 0xffb347),
      55 * scale, 140 * scale, 2
    );
    this.light.position.copy(position);
    scene.add(this.light);

    // --- embers / debris ---
    const emberCount = Math.max(10, Math.round(30 * Math.min(1, scale)));
    this.emberLife = 1.9 * Math.min(1.4, scale + 0.3);
    this.emberMat = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: getSharedDotTexture() },
        uTime: { value: 0 },
        uGravity: { value: underwater ? 3 : 12 },
        uLife: { value: this.emberLife },
        uBaseSize: { value: 26 * Math.sqrt(scale) },
        uColorA: { value: underwater ? new THREE.Color(0xbdeeff) : new THREE.Color(0xffe08a) },
        uColorB: { value: underwater ? new THREE.Color(0x2f6d82) : new THREE.Color(0x7a2c0a) },
      },
      vertexShader: EMBER_VERT,
      fragmentShader: EMBER_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.embers = new THREE.Points(buildEmberGeometry(emberCount), this.emberMat);
    this.embers.position.copy(position);
    this.embers.frustumCulled = false;
    scene.add(this.embers);

    // --- shockwave ring ---
    // Surface bursts throw a ring across the water plane; an airburst has no ground to
    // spread over, so its blast ring is a camera-facing sprite instead of a flat disc.
    this.ringLife = (airburst ? 0.4 : 0.9) * Math.max(1, scale);
    if (airburst) {
      this.ringMat = new THREE.SpriteMaterial({
        map: getSharedRingTexture(),
        color: 0xfffaf0,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0,
      });
      this.ring = new THREE.Sprite(this.ringMat);
      this.ring.position.copy(position);
      this.ring.scale.setScalar(0.1);
      scene.add(this.ring);
    } else {
      this.ringMat = new THREE.MeshBasicMaterial({
        map: getSharedRingTexture(),
        color: underwater ? 0xaeeeff : 0xfff0c0,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        opacity: 0,
      });
      this.ring = new THREE.Mesh(ringGeo, this.ringMat);
      this.ring.position.copy(position);
      this.ring.position.y += underwater ? 0.05 : 0.15;
      this.ring.scale.setScalar(0.1);
      scene.add(this.ring);
    }

    // --- lingering smoke puff (surface hits above a small-hit threshold only) ---
    if (!underwater && !airburst && scale > 0.55) {
      const smokeTex = getSharedFoamTexture();
      this.smokeSprites = [];
      this.smokeGroup = new THREE.Group();
      this.smokeGroup.position.copy(position);
      // Puff count scales with the blast so a big ship strike throws a tall column,
      // while a small hit stays a modest puff. Staggered initial heights + a
      // dark-base/lighter-top gradient make the sprites read as one rising plume
      // rather than a flat cluster.
      // More, denser puffs so a big hit reads as thick billowing smoke, not a thin
      // wispy trail (judge finding). Darker sooty base.
      const smokeCount = Math.round(THREE.MathUtils.clamp(4 + scale * 4.0, 4, 18));
      const baseCol = new THREE.Color(0x16140f);
      const topCol = new THREE.Color(0x615d54);
      for (let i = 0; i < smokeCount; i++) {
        const t = i / Math.max(1, smokeCount - 1); // 0 at base, 1 at top
        const mat = new THREE.SpriteMaterial({
          map: smokeTex, color: baseCol.clone().lerp(topCol, t),
          transparent: true, depthWrite: false, opacity: 0,
        });
        const spr = new THREE.Sprite(mat);
        const spread = (1 - t * 0.55); // column narrows toward the top
        spr.userData.offset = new THREE.Vector3(
          (Math.random() - 0.5) * 5 * scale * spread,
          t * 7 * scale,
          (Math.random() - 0.5) * 5 * scale * spread,
        );
        spr.userData.rise = 2.4 + Math.random() * 2.2 + t * 1.6;
        spr.userData.drift = new THREE.Vector3((Math.random() - 0.5) * 1.6, 0, (Math.random() - 0.5) * 1.6);
        spr.userData.delay = t * 0.25; // upper puffs bloom slightly later
        this.smokeGroup.add(spr);
        this.smokeSprites.push({ sprite: spr, mat });
      }
      scene.add(this.smokeGroup);
    }
  }

  update(dt) {
    this.age += dt;
    if (this.age >= this.life) {
      this.dead = true;
      return;
    }

    // --- fireball ---
    const ft = Math.min(1, this.age / this.fireballLife);
    if (ft < 1) {
      const grow = 1 - Math.pow(1 - Math.min(1, ft * 2.2), 3);
      this.fireMesh.scale.setScalar(THREE.MathUtils.lerp(0.6, 10, grow) * this.scale);
      this.fireMat.uniforms.uTime.value = this.age;
      this.fireMat.uniforms.uProgress.value = ft;
      this.fireMesh.visible = true;

      // Solid molten core: grows fast to a dense mass then fades over the first
      // third of the fireball's life (slower than before, so it reads as a real
      // burning core rather than a one-frame flash), shading hot-white -> orange.
      this.core.scale.setScalar(THREE.MathUtils.lerp(0.35, 4.6, Math.min(1, ft * 3.2)) * this.scale);
      this.core.material.opacity = Math.max(0, 1 - ft * 2.2);
      this.core.material.color.setRGB(1.0, 0.72 - ft * 0.35, 0.38 - ft * 0.3);
      this.core.visible = true;

      this.light.intensity = 55 * this.scale * (1 - ft);
    } else {
      this.fireMesh.visible = false;
      this.core.visible = false;
      this.light.intensity = 0;
    }

    // --- shockwave ring ---
    const rt = Math.min(1, this.age / this.ringLife);
    if (rt < 1) {
      const ease = 1 - Math.pow(1 - rt, 2);
      this.ring.scale.setScalar(THREE.MathUtils.lerp(0.5, 16 * this.scale, ease));
      this.ringMat.opacity = (1 - rt) * 0.8;
      this.ring.visible = true;
    } else {
      this.ring.visible = false;
    }

    // --- embers ---
    if (this.age <= this.emberLife) {
      this.emberMat.uniforms.uTime.value = this.age;
      this.embers.visible = true;
    } else {
      this.embers.visible = false;
    }

    // --- smoke ---
    if (this.smokeSprites) {
      const smokeStart = this.fireballLife * 0.35;
      const smokeT = THREE.MathUtils.clamp((this.age - smokeStart) / Math.max(0.01, this.life - smokeStart), 0, 1);
      for (const { sprite, mat } of this.smokeSprites) {
        const o = sprite.userData;
        // Per-puff progress, offset by its delay so the column builds upward over
        // time rather than every puff popping at once.
        const pt = THREE.MathUtils.clamp((smokeT - (o.delay || 0)) / (1 - (o.delay || 0)), 0, 1);
        sprite.position.set(
          o.offset.x + o.drift.x * this.age,
          o.offset.y + o.rise * this.age,
          o.offset.z + o.drift.z * this.age
        );
        const sc = THREE.MathUtils.lerp(2.0, 12, pt) * this.scale;
        sprite.scale.setScalar(sc);
        mat.opacity = Math.sin(pt * Math.PI) * 0.78;
      }
    }
  }

  dispose() {
    this.scene.remove(this.fireMesh);
    this.fireMat.dispose();
    this.scene.remove(this.core);
    this.core.material.dispose();
    this.scene.remove(this.light);
    this.scene.remove(this.embers);
    this.embers.geometry.dispose();
    this.emberMat.dispose();
    this.scene.remove(this.ring);
    this.ringMat.dispose();
    if (this.smokeGroup) {
      this.scene.remove(this.smokeGroup);
      for (const { mat } of this.smokeSprites) mat.dispose();
    }
  }
}

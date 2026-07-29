import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

const VIGNETTE_GRADE_SHADER = {
  uniforms: {
    tDiffuse: { value: null },
    uVignetteStrength: { value: 0.38 },
    uGrainAmount: { value: 0.022 },
    uTime: { value: 0 },
    uContrast: { value: 1.06 },
    uSaturation: { value: 1.12 },
    uLift: { value: 0.0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uVignetteStrength;
    uniform float uGrainAmount;
    uniform float uTime;
    uniform float uContrast;
    uniform float uSaturation;
    varying vec2 vUv;

    float hash(vec2 p) { return fract(sin(dot(p, vec2(41.7, 289.1))) * 43758.5453123); }

    void main() {
      vec3 c = texture2D(tDiffuse, vUv).rgb;

      // Filmic contrast + saturation grade
      c = (c - 0.5) * uContrast + 0.5;
      float luma = dot(c, vec3(0.2126, 0.7152, 0.0722));
      c = mix(vec3(luma), c, uSaturation);

      // subtle teal-orange lean
      c += vec3(0.012, 0.004, -0.014) * smoothstep(0.0, 1.0, luma);

      // vignette
      vec2 d = vUv - 0.5;
      float vig = 1.0 - dot(d, d) * uVignetteStrength;
      c *= vig;

      // film grain
      float g = (hash(vUv * vec2(1920.0, 1080.0) + uTime) - 0.5) * uGrainAmount;
      c += g;

      gl_FragColor = vec4(clamp(c, 0.0, 1.0), 1.0);
    }
  `,
};

export class RenderPipeline {
  constructor(canvas) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      powerPreference: 'high-performance',
      stencil: false,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.composer = null;
    this.fxaaPass = null;
    this.gradePass = null;
  }

  setup(scene, camera) {
    const renderPass = new RenderPass(scene, camera);
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.3, // strength
      0.15, // radius
      0.97  // threshold
    );

    this.gradePass = new ShaderPass(VIGNETTE_GRADE_SHADER);

    this.fxaaPass = new ShaderPass(FXAAShader);
    const pr = this.renderer.getPixelRatio();
    this.fxaaPass.material.uniforms['resolution'].value.set(
      1 / (window.innerWidth * pr),
      1 / (window.innerHeight * pr)
    );

    const outputPass = new OutputPass();

    // IMPORTANT: tonemapping + colorspace (OutputPass) must run on the raw HDR
    // buffer BEFORE any LDR-only pass (grade/vignette clamps to [0,1], FXAA
    // expects sRGB-encoded input) — otherwise HDR highlights (e.g. sky
    // radiance well above 1.0) get hard-clamped to flat white before ACES
    // ever gets a chance to roll them off.
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderPass);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(outputPass);
    this.composer.addPass(this.gradePass);
    this.composer.addPass(this.fxaaPass);
  }

  resize() {
    const w = window.innerWidth, h = window.innerHeight;
    this.renderer.setSize(w, h);
    this.composer.setSize(w, h);
    const pr = this.renderer.getPixelRatio();
    this.fxaaPass.material.uniforms['resolution'].value.set(1 / (w * pr), 1 / (h * pr));
  }

  render(elapsed) {
    this.gradePass.uniforms.uTime.value = elapsed;
    this.composer.render();
  }
}

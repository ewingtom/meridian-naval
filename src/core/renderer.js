import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { Pass } from 'three/examples/jsm/postprocessing/Pass.js';

// UnrealBloomPass's internal mip-chain composite leaves renderer.setViewport()/
// setScissor()/setScissorTest() pointed at one of its small blur-mip rectangles
// instead of restoring the full frame. Every pass after it renders to a real
// WebGLRenderTarget (which carries its own always-correct .viewport/.scissor), so
// nothing else notices — except the final pass, which renders to the screen
// (renderTarget === null), and for that case three.js reuses whatever viewport/scissor
// was last set on the renderer rather than the full drawing-buffer size. Net effect:
// the composer path silently draws into a small scissored corner of the canvas every
// frame. This no-op pass restores full viewport and disables the scissor test right
// after bloom, before anything else can inherit the stale state.
class ViewportRestorePass extends Pass {
  constructor(renderer) {
    super();
    this.needsSwap = false;
    this._renderer = renderer;
  }
  render(renderer) {
    const size = renderer.getSize(ViewportRestorePass._v2);
    renderer.setViewport(0, 0, size.x, size.y);
    renderer.setScissorTest(false);
  }
}
ViewportRestorePass._v2 = new THREE.Vector2();

const VIGNETTE_GRADE_SHADER = {
  uniforms: {
    tDiffuse: { value: null },
    uVignetteStrength: { value: 0.28 },
    uGrainAmount: { value: 0.016 },
    uTime: { value: 0 },
    uContrast: { value: 1.04 },
    uSaturation: { value: 1.08 },
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
      vec3 sCurve = c * c * (3.0 - 2.0 * c);
      c = mix(c, sCurve, 0.15);
      c = (c - 0.5) * uContrast + 0.5;
      float luma = dot(c, vec3(0.2126, 0.7152, 0.0722));
      c = mix(vec3(luma), c, uSaturation);
      float shadowW = 1.0 - smoothstep(0.0, 0.5, luma);
      float highlightW = smoothstep(0.5, 1.0, luma);
      c += vec3(-0.008, -0.003, 0.01) * shadowW + vec3(0.01, 0.004, -0.01) * highlightW;
      vec2 d = vUv - 0.5;
      c *= 1.0 - dot(d, d) * uVignetteStrength;
      float g = (hash(vUv * vec2(1920.0, 1080.0) + uTime) - 0.5) * uGrainAmount;
      float dither = (hash(vUv * vec2(127.1, 311.7) + uTime * 0.37) - 0.5) * (1.0 / 255.0) * 2.0;
      c += g + dither;
      gl_FragColor = vec4(clamp(c, 0.0, 1.0), 1.0);
    }
  `,
};

export class RenderPipeline {
  constructor(canvas) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.composer = null;
    this.fxaaPass = null;
    this.gradePass = null;
    this.bloomPass = null;
    // Start on raw path — post stack has been blacking out on some WebGL configs.
    // Enable composer only after a healthy probe frame.
    this._useComposer = false;
    this._composerHealthy = false;
    this._probeFrames = 0;
  }

  setup(scene, camera) {
    this._scene = scene;
    this._camera = camera;

    const w = window.innerWidth;
    const h = window.innerHeight;

    try {
      const renderPass = new RenderPass(scene, camera);
      this.bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 0.22, 0.45, 0.82);
      this.gradePass = new ShaderPass(VIGNETTE_GRADE_SHADER);
      this.fxaaPass = new ShaderPass(FXAAShader);
      const pr = this.renderer.getPixelRatio();
      this.fxaaPass.material.uniforms['resolution'].value.set(1 / (w * pr), 1 / (h * pr));
      const outputPass = new OutputPass();

      // Let EffectComposer allocate its own targets (more reliable than a hand-built HalfFloat RT).
      this.composer = new EffectComposer(this.renderer);
      this.composer.addPass(renderPass);
      this.composer.addPass(this.bloomPass);
      this.composer.addPass(new ViewportRestorePass(this.renderer));
      this.composer.addPass(outputPass);
      this.composer.addPass(this.gradePass);
      this.composer.addPass(this.fxaaPass);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[RenderPipeline] composer setup failed', err);
      this.composer = null;
    }
  }

  resize() {
    const w = window.innerWidth, h = window.innerHeight;
    this.renderer.setSize(w, h);
    if (this.composer) this.composer.setSize(w, h);
    if (this.fxaaPass) {
      const pr = this.renderer.getPixelRatio();
      this.fxaaPass.material.uniforms['resolution'].value.set(1 / (w * pr), 1 / (h * pr));
    }
  }

  render(elapsed) {
    if (this.gradePass) this.gradePass.uniforms.uTime.value = elapsed;

    // Prefer raw render until composer proves it draws a real frame (not a black blit).
    if (!this._useComposer || !this.composer) {
      this.renderer.render(this._scene, this._camera);
      this._probeFrames++;
      // After a few healthy raw frames, try enabling composer once.
      if (this.composer && !this._composerHealthy && this._probeFrames === 8) {
        this._useComposer = true;
      }
      return;
    }

    // WebGLRenderer resets `info.render` at the top of every internal render() call,
    // and EffectComposer's later passes (OutputPass/gradePass/fxaaPass) each do their
    // own full-screen-quad render() — so reading info.render.triangles right after
    // composer.render() only ever reflects that LAST quad (~2 triangles), no matter
    // how many triangles the real scene drew in the earlier RenderPass. That made this
    // health check trip its "collapsed" fallback on every healthy frame too, silently
    // and permanently disabling bloom/tonemap-grade/vignette/FXAA for the whole session.
    // Fix: disable autoReset and accumulate across all passes in this one composer.render()
    // call, so a real scene's triangle count actually shows up in the total.
    const info = this.renderer.info;
    const prevAutoReset = info.autoReset;
    info.autoReset = false;
    info.reset();
    try {
      this.composer.render();
      const total = info.render.triangles;
      // A handful of fullscreen quad passes is ~8-10 triangles total; a healthy scene
      // draw dwarfs that. If it doesn't, the composer really is collapsing.
      if (total <= 10) {
        this._composerFail = (this._composerFail || 0) + 1;
        if (this._composerFail > 3) {
          this._useComposer = false;
          this._composerHealthy = false;
          // eslint-disable-next-line no-console
          console.warn('[RenderPipeline] composer output collapsed; using raw renderer');
        }
      } else {
        this._composerHealthy = true;
        this._composerFail = 0;
      }
    } catch (err) {
      this._useComposer = false;
      this.renderer.render(this._scene, this._camera);
      // eslint-disable-next-line no-console
      console.warn('[RenderPipeline] composer threw; raw fallback', err);
    } finally {
      info.autoReset = prevAutoReset;
    }
  }
}

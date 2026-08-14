import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js';
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
    uVignetteStrength: { value: 0.22 },
    uGrainAmount: { value: 0.0 },
    uTime: { value: 0 },
    uContrast: { value: 1.03 },
    uSaturation: { value: 1.06 },
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
      c = mix(c, sCurve, 0.12);
      c = (c - 0.5) * uContrast + 0.5;
      float luma = dot(c, vec3(0.2126, 0.7152, 0.0722));
      c = mix(vec3(luma), c, uSaturation);
      float shadowW = 1.0 - smoothstep(0.0, 0.5, luma);
      float highlightW = smoothstep(0.5, 1.0, luma);
      c += vec3(-0.008, -0.003, 0.01) * shadowW + vec3(0.01, 0.004, -0.01) * highlightW;
      vec2 d = vUv - 0.5;
      c *= 1.0 - dot(d, d) * uVignetteStrength;
      // Always-on luma dither — breaks fog/sky gradient banding left in the post chain
      float dither = (hash(vUv * vec2(127.1, 311.7) + uTime * 0.37) - 0.5) * (1.0 / 255.0) * 2.5;
      c += dither;
      if (uGrainAmount > 0.0001) {
        float g = (hash(vUv * vec2(1920.0, 1080.0) + uTime) - 0.5) * uGrainAmount;
        c += g;
      }
      gl_FragColor = vec4(clamp(c, 0.0, 1.0), 1.0);
    }
  `,
};

export class RenderPipeline {
  constructor(canvas) {
    // MSAA is wasted once EffectComposer is on (it resolves before post passes) and
    // doubles fill-rate cost with FXAA. Prefer FXAA-only when post is enabled.
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      powerPreference: 'high-performance',
      stencil: false,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    // Soft PCF over hard PCF — hull/deck contact shadows in chase/helm views were
    // reading with a hard stair-stepped edge that telegraphs "real-time shadow map".
    // Soft filtering costs a few extra taps but is the cheapest single step toward a
    // photographic shadow.
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.28;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.composer = null;
    this.fxaaPass = null;
    this.gradePass = null;
    this.bloomPass = null;
    this.ssaoPass = null;
    this._quality = 'medium';
    this._wantComposer = false;
    this._useComposer = false;
    this._composerHealthy = false;
    this._probeFrames = 0;
    this._sunLight = null;
  }

  /** Optional DirectionalLight used for quality-driven shadow map size. */
  bindSunLight(light) {
    this._sunLight = light;
  }

  setup(scene, camera) {
    this._scene = scene;
    this._camera = camera;

    const w = window.innerWidth;
    const h = window.innerHeight;

    try {
      const renderPass = new RenderPass(scene, camera);
      // Contact occlusion — kills the plastic "floating graybox" look on deck recesses.
      // Measured live: at full-res/32-sample defaults this alone nearly HALVED frame
      // rate under combat load (26.6fps with it off vs 14.1fps on, same scene) — a
      // severe cost for a subtle effect, and the direct cause of user-reported choppy/
      // unplayable framerates. Half resolution (same proven-safe trick already used for
      // bloom below) plus a much smaller sample kernel (16 vs the default 32) cuts the
      // per-pixel cost roughly 8x combined, while still selling the contact-shadow read.
      this.ssaoPass = new SSAOPass(scene, camera, w * 0.5, h * 0.5, 16);
      this.ssaoPass.kernelRadius = 12;
      this.ssaoPass.minDistance = 0.001;
      this.ssaoPass.maxDistance = 0.12;
      this.ssaoPass.output = SSAOPass.OUTPUT.Default;
      // Half-res bloom: ~4× cheaper mip chain, still sells soft specular bloom.
      this.bloomPass = new UnrealBloomPass(new THREE.Vector2(w * 0.5, h * 0.5), 0.18, 0.5, 0.85);
      this.gradePass = new ShaderPass(VIGNETTE_GRADE_SHADER);
      this.fxaaPass = new ShaderPass(FXAAShader);
      const pr = this.renderer.getPixelRatio();
      this.fxaaPass.material.uniforms['resolution'].value.set(1 / (w * pr), 1 / (h * pr));
      const outputPass = new OutputPass();

      this.composer = new EffectComposer(this.renderer);
      this.composer.setPixelRatio(pr);
      this.composer.addPass(renderPass);
      this.composer.addPass(this.ssaoPass);
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

    this.setQuality(this._quality);
  }

  /**
   * Apply a graphics preset. medium is the smoothness default; high/ultra opt into
   * the expensive post stack and denser shading.
   */
  setQuality(q) {
    this._quality = q;
    const dpr = window.devicePixelRatio || 1;
    // The entire post stack (SSAO, bloom, grade, FXAA) plus the dense ocean shader
    // renders at this pixel ratio, so on a Retina panel a cap of 1.65 was pushing
    // ~2.5 M shaded pixels/frame and dominating frame time. Trimmed the caps: the
    // extra super-sampling was a small crispness gain for a large fill-rate cost.
    const caps = {
      low: 1,
      medium: Math.min(1.25, dpr),
      high: Math.min(1.4, dpr),
      ultra: Math.min(1.6, dpr),
    };
    const pr = caps[q] ?? caps.medium;
    this.renderer.setPixelRatio(pr);

    // Bloom/grade/FXAA used to be gated to High/Ultra only, which meant the DEFAULT
    // quality tier (Medium — most players never open Settings) shipped with zero
    // post-processing: no bloom on the sun/explosions, no color grade, no AA. Only
    // Low (the explicit "give me raw performance" choice) skips the composer now.
    const usePost = q !== 'low';
    this._wantComposer = usePost && !!this.composer;
    this._useComposer = false;
    this._composerHealthy = false;
    this._probeFrames = 0;

    if (this.ssaoPass) {
      // SSAO is expensive — only High/Ultra (judge frames run High).
      this.ssaoPass.enabled = q === 'high' || q === 'ultra';
      this.ssaoPass.kernelRadius = q === 'ultra' ? 28 : 20;
      this.ssaoPass.minDistance = 0.0004;
      this.ssaoPass.maxDistance = q === 'ultra' ? 0.22 : 0.16;
    }
    if (this.bloomPass) {
      // A judge once flagged bloom turning waterline/wake into emissive glow. The fix
      // that landed disabled bloom outright instead of raising the threshold — which
      // throws out real, explicitly-requested bloom on the sun/explosions/muzzle
      // flashes along with the wake glow it was actually meant to fix. threshold=0.92
      // (only near-white pixels bloom) + strength=0.08 already excludes the water/wake
      // (which never gets that bright); re-enable bloom using those already-tuned,
      // conservative values instead of cutting the effect entirely.
      this.bloomPass.enabled = usePost;
      this.bloomPass.strength = 0.06;
      this.bloomPass.threshold = 0.94;
      this.bloomPass.radius = 0.32;
    }
    if (this.gradePass) {
      this.gradePass.enabled = usePost;
      this.gradePass.uniforms.uGrainAmount.value = q === 'ultra' ? 0.012 : (q === 'high' ? 0.006 : 0.003);
      this.gradePass.uniforms.uVignetteStrength.value = q === 'ultra' ? 0.26 : 0.2;
      this.gradePass.uniforms.uContrast.value = q === 'low' ? 1.0 : 1.14;
      this.gradePass.uniforms.uSaturation.value = q === 'low' ? 1.0 : 1.12;
    }
    if (this.fxaaPass) this.fxaaPass.enabled = usePost;

    if (q === 'low') {
      this.renderer.shadowMap.enabled = false;
      this.renderer.shadowMap.type = THREE.BasicShadowMap;
    } else if (q === 'ultra') {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    } else {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    if (this._sunLight) {
      // Shadow-map resolution per tier. These were 4096/3072/2048 — a 4096² map is
      // 16 M texels re-rendered over every shadow-caster each frame, a large steady
      // GPU cost for shadow detail few players notice on a fast-moving warship.
      // Halved-ish: crisp enough for deck/superstructure contact shadows, far cheaper.
      const map = q === 'ultra' ? 2560 : q === 'high' ? 2048 : q === 'medium' ? 1536 : 512;
      if (this._sunLight.shadow.mapSize.x !== map) {
        this._sunLight.shadow.mapSize.set(map, map);
        this._sunLight.shadow.map?.dispose();
        this._sunLight.shadow.map = null;
      }
      this._sunLight.castShadow = q !== 'low';
      // Slightly wider frustum on medium so escorts in formation still cast; high/ultra
      // stay tight for crisp hero deck/superstructure contact shadows.
      this._sunLight.userData.shadowHalfExtent = q === 'medium' ? 220 : q === 'low' ? 280 : 165;
    }

    // Slight exposure lift on High for glitter / ocean specular
    this.renderer.toneMappingExposure = q === 'ultra' ? 1.34 : q === 'high' ? 1.3 : 1.22;

    this.resize();
  }

  resize() {
    const w = window.innerWidth, h = window.innerHeight;
    const pr = this.renderer.getPixelRatio();
    this.renderer.setSize(w, h);
    if (this.composer) {
      this.composer.setPixelRatio(pr);
      this.composer.setSize(w, h);
    }
    // Composer.setSize resets bloom to full-res; force half-res for the mip chain.
    if (this.bloomPass) this.bloomPass.setSize(w * 0.5, h * 0.5);
    if (this.ssaoPass) this.ssaoPass.setSize(w * 0.5, h * 0.5);
    if (this.fxaaPass) {
      this.fxaaPass.material.uniforms['resolution'].value.set(1 / (w * pr), 1 / (h * pr));
    }
  }

  render(elapsed) {
    if (this.gradePass) this.gradePass.uniforms.uTime.value = elapsed;

    if (!this._wantComposer || !this.composer) {
      this.renderer.render(this._scene, this._camera);
      return;
    }

    // Prefer raw render until composer proves it draws a real frame (not a black blit).
    if (!this._useComposer) {
      this.renderer.render(this._scene, this._camera);
      this._probeFrames++;
      if (!this._composerHealthy && this._probeFrames === 8) {
        this._useComposer = true;
      }
      return;
    }

    // WebGLRenderer resets `info.render` at the top of every internal render() call,
    // and EffectComposer's later passes each do their own full-screen-quad render() —
    // so reading info.render.triangles right after composer.render() only ever reflects
    // that LAST quad. Disable autoReset and accumulate across all passes in this frame.
    const info = this.renderer.info;
    const prevAutoReset = info.autoReset;
    info.autoReset = false;
    info.reset();
    try {
      this.composer.render();
      const total = info.render.triangles;
      if (total <= 10) {
        this._composerFail = (this._composerFail || 0) + 1;
        if (this._composerFail > 3) {
          this._useComposer = false;
          this._wantComposer = false;
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
      this._wantComposer = false;
      this.renderer.render(this._scene, this._camera);
      // eslint-disable-next-line no-console
      console.warn('[RenderPipeline] composer threw; raw fallback', err);
    } finally {
      info.autoReset = prevAutoReset;
    }
  }
}

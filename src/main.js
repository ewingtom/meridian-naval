import * as THREE from 'three';
import { RenderPipeline } from './core/renderer.js';
import { SkySystem } from './core/sky.js';
import { OceanField } from './core/ocean.js';

const canvas = document.getElementById('scene');
const pipeline = new RenderPipeline(canvas);
const renderer = pipeline.renderer;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 20000);
camera.position.set(0, 18, 30);

pipeline.setup(scene, camera);

const sky = new SkySystem(renderer, scene);
const ocean = new OceanField(renderer, sky.sunDirection);
scene.add(ocean.group);
ocean.setEnvMap(sky.envRT.texture);

const fogColor = new THREE.Color(0xaec7d6);
scene.fog = new THREE.FogExp2(fogColor.getHex(), 0.0009);
ocean.setFogColor(fogColor);

// --- temporary free-fly debug camera controller ---
const keys = new Set();
window.addEventListener('keydown', (e) => keys.add(e.code));
window.addEventListener('keyup', (e) => keys.delete(e.code));

let yaw = -3.05, pitch = -0.02;
let dragging = false;
canvas.addEventListener('mousedown', () => { dragging = true; });
window.addEventListener('mouseup', () => { dragging = false; });
window.addEventListener('mousemove', (e) => {
  if (!dragging) return;
  yaw -= e.movementX * 0.0025;
  pitch -= e.movementY * 0.0025;
  pitch = Math.max(-1.4, Math.min(1.4, pitch));
});

function updateFreeCam(dt) {
  const speed = (keys.has('ShiftLeft') ? 60 : 18) * dt;
  const dir = new THREE.Vector3(
    Math.sin(yaw) * Math.cos(pitch),
    Math.sin(pitch),
    Math.cos(yaw) * Math.cos(pitch)
  );
  const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();
  if (keys.has('KeyW')) camera.position.addScaledVector(dir, speed);
  if (keys.has('KeyS')) camera.position.addScaledVector(dir, -speed);
  if (keys.has('KeyA')) camera.position.addScaledVector(right, -speed);
  if (keys.has('KeyD')) camera.position.addScaledVector(right, speed);
  if (keys.has('KeyQ')) camera.position.y -= speed;
  if (keys.has('KeyE')) camera.position.y += speed;
  camera.lookAt(camera.position.clone().add(dir));
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  pipeline.resize();
});

window.GAME = {
  pipeline, sky, ocean, camera, scene, renderer, THREE,
  setYawPitch: (y, p) => { yaw = y; pitch = p; },
};

const clock = new THREE.Clock();
let frameCount = 0, fpsAccum = 0, fps = 60;
const fpsEl = document.createElement('div');
fpsEl.style.cssText = 'position:fixed;top:8px;left:8px;color:#7fffb0;font:12px monospace;z-index:100;background:rgba(0,0,0,0.4);padding:4px 8px;border-radius:4px;';
document.body.appendChild(fpsEl);

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  const elapsed = clock.elapsedTime;

  updateFreeCam(dt);
  sky.update(camera, elapsed);
  ocean.update(dt, elapsed, camera);

  pipeline.render(elapsed);

  frameCount++; fpsAccum += dt;
  if (fpsAccum >= 0.5) {
    fps = Math.round(frameCount / fpsAccum);
    fpsEl.textContent = `${fps} fps`;
    frameCount = 0; fpsAccum = 0;
  }
}
animate();

import * as THREE from 'three';
import { RenderPipeline } from './core/renderer.js';
import { SkySystem } from './core/sky.js';
import { OceanField } from './core/ocean.js';
import { CameraRig } from './core/CameraRig.js';
import { PlayerShip } from './ship/PlayerShip.js';
import { PlayerController, Station } from './player/PlayerController.js';
import { WeaponsSystem } from './weapons/WeaponsSystem.js';
import { RadarSystem } from './systems/RadarSystem.js';
import { MissionSystem } from './systems/MissionSystem.js';
import { WorldManager } from './world/WorldManager.js';
import { AudioEngine } from './audio/AudioEngine.js';
import { ShipHUD, TacticalRadar, MainMenu, PauseMenu, SettingsPanel, CommsLog, DamageVignette } from './ui/index.js';

const canvas = document.getElementById('scene');
const pipeline = new RenderPipeline(canvas);
const renderer = pipeline.renderer;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 20000);

pipeline.setup(scene, camera);

const sky = new SkySystem(renderer, scene);
const ocean = new OceanField(renderer, sky.sunDirection);
scene.add(ocean.group);
ocean.setEnvMap(sky.envRT.texture);

const fogColor = new THREE.Color(0x9dc3dc);
scene.fog = new THREE.FogExp2(fogColor.getHex(), 0.00065);
ocean.setFogColor(fogColor);

const playerShip = new PlayerShip(scene);
playerShip.group.position.set(0, 0, 0);
const playerProxy = { get position() { return playerShip.group.position; } };

const cameraRig = new CameraRig(camera);
cameraRig.setImmediate(new THREE.Vector3(0, 20, 30), new THREE.Quaternion());

// ============================== AUDIO ==============================
const audio = new AudioEngine();
let audioUnlocked = false;
function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  audio.unlock();
  audio.setMasterVolume(0.8);
  audio.setSfxVolume(0.85);
  audio.startOceanAmbience();
  audio.startWind(0.3);
  audio._engineHum = audio.startEngineHum(0);
}

// ============================ SYSTEMS ==============================
let playerHealth = 100;
let gameOver = false;

const weapons = new WeaponsSystem(scene, {
  onFire: (key) => {
    if (key === 'gun') audio.playDeckGunFire();
    else if (key === 'missile') audio.playMissileLaunch();
    else if (key === 'torpedo') audio.playTorpedoLaunch();
    else if (key === 'ciws') audio.playCiwsBurst();
  },
  onExplosion: (pos, opts) => {
    if (opts?.underwater) audio.playExplosionSmall({ position: pos });
    else audio.playExplosionLarge({ position: pos });
    shakeCamera(opts?.scale > 1 ? 0.5 : 0.25);
  },
  onHit: () => {},
  onPlayerHit: (dmg) => {
    if (gameOver) return;
    playerHealth = Math.max(0, playerHealth - dmg);
    audio.playHitImpact();
    shakeCamera(0.6);
    damageVignette.flashHit(Math.min(1, dmg / 40));
    if (playerHealth <= 0) handleGameOver();
  },
});
const radar = new RadarSystem({ rangeM: 6000, sonarPingRangeM: 2400 });
const world = new WorldManager(scene, weapons);
const mission = new MissionSystem({
  onComms: (line) => { commsLog.push(line); audio.playRadioBlip(); },
  onObjective: (obj) => setObjective(obj),
});

let currentObjective = null;
function setObjective(obj) { currentObjective = obj; }

let shakeMag = 0;
function shakeCamera(mag) { shakeMag = Math.max(shakeMag, mag); }

// ============================ UI ============================
const uiRoot = document.getElementById('ui-root');

const hud = new ShipHUD();
hud.mount(uiRoot);
hud.hide();

const tacRadar = new TacticalRadar({
  onSelectContact: (id) => { weapons.selectedTargetId = id; },
});
tacRadar.mount(uiRoot);
tacRadar.hide();

const commsLog = new CommsLog({ maxVisible: 6 });
commsLog.mount(uiRoot);

const damageVignette = new DamageVignette();
damageVignette.mount(uiRoot);

let settingsOpenedFrom = 'main'; // 'main' | 'pause' — tracked ourselves since the UI
                                  // components don't expose an isOpen getter
const settings = new SettingsPanel({
  onChange: (key, value) => {
    if (key === 'masterVolume') audio.setMasterVolume(value / 100);
    else if (key === 'musicVolume') audio.setMusicVolume(value / 100);
    else if (key === 'sfxVolume') audio.setSfxVolume(value / 100);
    else if (key === 'mouseSensitivity') playerController.mouseSensScale = value / 50;
    else if (key === 'invertY') playerController.invertY = value;
    else if (key === 'graphicsQuality') applyGraphicsQuality(value);
  },
  onClose: () => {
    settings.hide();
    settingsIsOpen = false;
    if (settingsOpenedFrom === 'pause') pauseMenu.show();
    else mainMenu.show();
  },
});
settings.mount(uiRoot);
settings.hide();
let settingsIsOpen = false;

function applyGraphicsQuality(q) {
  const dpr = window.devicePixelRatio || 1;
  const caps = { low: 1, medium: Math.min(1.25, dpr), high: Math.min(1.75, dpr), ultra: Math.min(2, dpr) };
  renderer.setPixelRatio(caps[q] ?? Math.min(1.5, dpr));
  pipeline.bloomPass.enabled = q !== 'low';
}

let gameStarted = false;
let paused = false;

const pauseMenu = new PauseMenu({
  onResume: () => { resumeFromPause(); },
  onSettings: () => { pauseMenu.hide(); settingsOpenedFrom = 'pause'; settingsIsOpen = true; settings.show(); },
  onQuitToMainMenu: () => {
    paused = false;
    pauseMenu.hide();
    gameStarted = false;
    hud.hide(); tacRadar.hide();
    if (document.pointerLockElement) document.exitPointerLock();
    mainMenu.update({ continueEnabled: true });
    mainMenu.show();
  },
});
pauseMenu.mount(uiRoot);
pauseMenu.hide();

function resumeFromPause() {
  paused = false;
  pauseMenu.hide();
  if (playerController.state !== Station.WALK) canvas.requestPointerLock();
  else canvas.requestPointerLock();
}

// ---- game over overlay (no dedicated component from the UI kit — same visual
// language as the menus: dark glass panel, angled corners, cyan/red accents) ----
const gameOverEl = document.createElement('div');
gameOverEl.className = 'hud-panel';
gameOverEl.style.cssText = `
  position:fixed; left:50%; top:50%; transform:translate(-50%,-50%);
  padding:36px 48px; text-align:center; z-index:80; display:none;
  min-width:360px;
`;
gameOverEl.innerHTML = `
  <div class="hud-corners"></div>
  <div class="hud-label" style="color:var(--c-red);">TASK FORCE COMMAND</div>
  <div style="font-family:var(--font-display); font-size:38px; color:var(--c-red); letter-spacing:0.08em; margin:8px 0 4px; text-shadow:0 0 16px rgba(255,68,68,0.6);">MERIDIAN LOST</div>
  <div style="color:var(--c-text-dim); font:13px var(--font-mono); margin-bottom:22px;">Hull integrity failure — all hands abandon ship.</div>
  <button id="gameover-restart" style="font:12px var(--font-mono); letter-spacing:0.12em; text-transform:uppercase; color:var(--c-text); background:var(--c-cyan-soft); border:1px solid var(--c-border-strong); padding:10px 22px; cursor:pointer; clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);">Return to Main Menu</button>
`;
document.body.appendChild(gameOverEl);
gameOverEl.querySelector('#gameover-restart').addEventListener('click', () => {
  gameOverEl.style.display = 'none';
  gameOver = false;
  playerHealth = 100;
  damageVignette.setHullPct(100);
  gameStarted = false;
  hud.hide(); tacRadar.hide();
  // clear the battle: reset ship + wipe hostiles so a fresh patrol starts clean
  for (const e of world.entities) e.dispose(scene);
  world.entities = [];
  playerShip.physics.position.set(0, 0, 0);
  playerShip.physics.speed = 0;
  playerShip.physics.heading = 0;
  throttleCmd = 0; rudderCmd = 0;
  mission.started = false; mission._started = false; mission.beatIndex = 0; mission.flags.clear();
  hostileWaveSpawned = false;
  if (document.pointerLockElement) document.exitPointerLock();
  mainMenu.update({ continueEnabled: false });
  mainMenu.show();
});

function handleGameOver() {
  gameOver = true;
  audio.playAlarmKlaxon();
  commsLog.push({ speaker: 'TASK FORCE ACTUAL', text: 'MERIDIAN is down. All units, converge and render assistance.', urgency: 'critical' });
  if (document.pointerLockElement) document.exitPointerLock();
  setTimeout(() => { gameOverEl.style.display = 'block'; }, 1200);
}

const mainMenu = new MainMenu({
  onNewPatrol: () => {
    unlockAudio();
    mainMenu.hide();
    gameStarted = true;
    hud.show(); tacRadar.show();
    canvas.requestPointerLock();
    if (!mission.started) {
      mission.start();
      world.spawnTaskForce(playerShip.group.position);
    }
  },
  onContinue: () => {
    mainMenu.hide();
    gameStarted = true;
    hud.show(); tacRadar.show();
    canvas.requestPointerLock();
  },
  onSettings: () => { mainMenu.hide(); settingsOpenedFrom = 'main'; settingsIsOpen = true; settings.show(); },
  onCredits: () => {
    commsLog.push({ speaker: 'MERIDIAN', text: 'A naval combat tech demo — built with Three.js, procedural graphics/audio, zero external assets.', urgency: 'normal' });
  },
  continueEnabled: false,
});
mainMenu.mount(uiRoot);
mainMenu.show();

window.addEventListener('keydown', (e) => {
  if (e.code === 'Escape' && gameStarted) {
    if (settingsIsOpen) { settings.hide(); settingsIsOpen = false; if (paused) pauseMenu.show(); return; }
    if (!paused) {
      paused = true;
      if (document.pointerLockElement) document.exitPointerLock();
      pauseMenu.show();
    } else {
      resumeFromPause();
    }
  }
});

// ============================ TEMP UI (not covered by the UI component library) ============================
const promptEl = div(`position:fixed;left:50%;bottom:14%;transform:translateX(-50%);padding:10px 18px;
  background:rgba(6,14,18,0.82);border:1px solid rgba(120,210,230,0.4);color:#d9eef4;
  font:13px/1.4 ui-monospace,monospace;letter-spacing:0.05em;border-radius:3px;display:none;z-index:50;pointer-events:none;`);
const stationBarEl = div(`position:fixed;top:14px;left:50%;transform:translateX(-50%);padding:6px 16px;
  background:rgba(6,14,18,0.75);border:1px solid rgba(120,210,230,0.35);color:#4de8ff;
  font:12px ui-monospace,monospace;letter-spacing:0.12em;text-transform:uppercase;border-radius:3px;display:none;z-index:50;pointer-events:none;`);
function div(css) { const d = document.createElement('div'); d.style.cssText = css; document.body.appendChild(d); return d; }

// ============================ PLAYER CONTROLLER ============================
const playerController = new PlayerController({
  camera, cameraRig, domElement: canvas, playerShip,
  onInteractPrompt: (station) => {
    if (station === Station.HELM) { promptEl.textContent = 'Press E to take the Helm'; promptEl.style.display = 'block'; }
    else if (station === Station.WEAPONS) { promptEl.textContent = 'Press E to man Weapons Station'; promptEl.style.display = 'block'; }
    else promptEl.style.display = 'none';
  },
  onStationChange: (station) => {
    if (station === Station.HELM) {
      stationBarEl.textContent = 'HELM — W/S Throttle · A/D Rudder · E to leave';
      stationBarEl.style.display = 'block';
      hud.setAiming(false);
      mission.flag('depart');
    } else if (station === Station.WEAPONS) {
      stationBarEl.textContent = 'WEAPONS — 1-4 Select · Click Fire · Tab Target · Q Sonar Ping · E Leave';
      stationBarEl.style.display = 'block';
      hud.setAiming(true);
    } else {
      stationBarEl.style.display = 'none';
      hud.setAiming(false);
    }
  },
});

// ---- weapons-station specific input ----
window.addEventListener('keydown', (e) => {
  if (!gameStarted || paused || playerController.state !== Station.WEAPONS) return;
  if (e.code === 'Digit1') weapons.selectWeapon('gun');
  else if (e.code === 'Digit2') weapons.selectWeapon('missile');
  else if (e.code === 'Digit3') weapons.selectWeapon('torpedo');
  else if (e.code === 'Digit4') weapons.selectWeapon('drone');
  else if (e.code === 'KeyQ') {
    radar.triggerSonarPing(playerShip.group.position.clone());
    audio.playSonarPing();
  } else if (e.code === 'Tab') {
    e.preventDefault();
    cycleTarget();
  }
});
canvas.addEventListener('click', () => {
  if (!gameStarted || paused || playerController.state !== Station.WEAPONS) return;
  fireSelectedWeapon();
});

function cycleTarget() {
  const contacts = lastContacts || [];
  if (!contacts.length) return;
  const idx = contacts.findIndex((c) => c.id === weapons.selectedTargetId);
  const next = contacts[(idx + 1) % contacts.length];
  weapons.selectedTargetId = next.id;
}

function fireSelectedWeapon() {
  const mp = playerShip.mountPoints;
  const targetEntity = world.entities.find((e) => e.id === weapons.selectedTargetId && e.alive);
  let fromLocal = mp.gunBarrelTip;
  if (weapons.selectedWeapon === 'missile') fromLocal = mp.missileTubes[0];
  else if (weapons.selectedWeapon === 'torpedo') fromLocal = mp.missileTubes[2] || mp.missileTubes[0];
  const from = playerShip.getMountWorld(fromLocal, new THREE.Vector3());

  let targetPos;
  if (targetEntity) {
    targetPos = targetEntity.position.clone();
    if (weapons.selectedWeapon === 'torpedo' && targetEntity.domain !== 'SUBSURFACE') targetPos = null;
  }
  if (!targetPos) {
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    const dist = Math.abs(dir.y) > 0.01 ? (from.y) / -dir.y : 2000;
    targetPos = from.clone().addScaledVector(dir, dist > 0 ? dist : 2000);
  }
  weapons.firePlayerWeapon(from, targetPos, targetEntity || null);
}

// ============================ RESIZE / DEBUG ============================
window.GAME = {
  pipeline, sky, ocean, camera, scene, renderer, THREE, playerShip, cameraRig, playerController,
  weapons, radar, world, mission, audio, hud, tacRadar, mainMenu, pauseMenu, settings, commsLog, damageVignette,
};

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  pipeline.resize();
});

// ============================ MAIN LOOP ============================
let throttleCmd = 0;
let rudderCmd = 0;
let lastContacts = [];
let hostileWaveSpawned = false;

const clock = new THREE.Clock();
let frameCount = 0, fpsAccum = 0;
const fpsEl = document.createElement('div');
fpsEl.style.cssText = 'position:fixed;top:8px;left:8px;color:#7fffb0;font:12px monospace;z-index:100;background:rgba(0,0,0,0.4);padding:4px 8px;border-radius:4px;';
document.body.appendChild(fpsEl);

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  const elapsed = clock.elapsedTime;

  const active = gameStarted && !paused && !gameOver;

  if (active) {
    if (playerController.state === Station.HELM) {
      const k = playerController.keys;
      throttleCmd = THREE.MathUtils.clamp(throttleCmd + ((k.has('KeyW') ? 1 : 0) - (k.has('KeyS') ? 1 : 0)) * dt * 0.8, -1, 1);
      rudderCmd = (k.has('KeyD') ? 1 : 0) - (k.has('KeyA') ? 1 : 0);
    }
    playerShip.setCommand(throttleCmd, rudderCmd);
    playerShip.update(dt, elapsed, (x, z, t) => ocean.getHeightAt(x, z, t));
    playerController.update(dt);
  }
  cameraRig.update(dt);

  if (shakeMag > 0.001) {
    camera.position.x += (Math.random() - 0.5) * shakeMag;
    camera.position.y += (Math.random() - 0.5) * shakeMag;
    camera.position.z += (Math.random() - 0.5) * shakeMag;
    shakeMag *= 0.88;
  } else shakeMag = 0;

  sky.update(camera, elapsed);
  ocean.update(dt, elapsed, camera);

  if (active) {
    radar.update(dt);
    const fireWeapon = (type, from, targetPos, source) => {
      weapons.spawn(type, from, targetPos, { sourceEntity: source, targetEntity: playerProxy });
    };
    world.update(dt, {
      playerPos: playerShip.group.position,
      playerShip,
      elapsed,
      fireWeapon,
      getWaveHeight: (x, z, t) => ocean.getHeightAt(x, z, t),
      ...radar.sonarContext,
    });
    weapons.update(dt, { playerShip, enemies: world.entities, elapsed });

    const wp = mission.currentWaypoint;
    if (wp && playerShip.group.position.distanceTo(wp) < 500) mission.flag('nearWaypoint0');
    const spawnReq = mission.consumeSpawnRequest();
    if (spawnReq) { world.spawnWave(spawnReq, wp || playerShip.group.position); hostileWaveSpawned = true; }
    if (hostileWaveSpawned && world.hostiles.length === 0) {
      mission.flag('wave1Cleared'); mission.flag('subCleared'); mission.flag('airWaveCleared');
    }

    audio.setListenerPosition(camera.position.x, camera.position.y, camera.position.z);
    const camFwd = new THREE.Vector3(); camera.getWorldDirection(camFwd);
    audio.setListenerOrientation(camFwd, new THREE.Vector3(0, 1, 0));
    audio._engineHum?.setRpm?.(Math.abs(throttleCmd));

    const heading = ((THREE.MathUtils.radToDeg(playerShip.physics.heading) % 360) + 360) % 360;
    const w = weapons.getWeaponInfo();
    hud.update({
      heading,
      speedKnots: playerShip.physics.speedKnots,
      throttleFraction: throttleCmd,
      hullPct: playerHealth,
      subsystems: { engine: 'nominal', radar: 'nominal', weapons: 'nominal' },
      objective: currentObjective ? { text: currentObjective.text, bearing: null, distanceM: wp ? Math.round(playerShip.group.position.distanceTo(wp)) : null } : null,
      selectedWeapon: { name: w.name, ammo: w.ammo === Infinity ? 999 : w.ammo, maxAmmo: w.maxAmmo === Infinity ? 999 : w.maxAmmo, ready: w.ready },
    });
    damageVignette.setHullPct(playerHealth);

    lastContacts = radar.buildContacts(playerShip.group.position, world.entities, weapons.selectedTargetId);
    tacRadar.update({
      rangeM: radar.rangeM,
      playerHeading: heading,
      contacts: lastContacts.map((c) => ({
        id: c.id, x: c.x, z: c.z,
        domain: c.domain.toLowerCase(),
        iff: c.iff.toLowerCase(),
        name: c.name,
        selected: c.selected,
      })),
    });
  }

  pipeline.render(elapsed);

  frameCount++; fpsAccum += dt;
  if (fpsAccum >= 0.5) { fpsEl.textContent = `${Math.round(frameCount / fpsAccum)} fps`; frameCount = 0; fpsAccum = 0; }
}

animate();

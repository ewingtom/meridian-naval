import * as THREE from 'three';
import { RenderPipeline } from './core/renderer.js';
import { SkySystem } from './core/sky.js';
import { OceanField } from './core/ocean.js';
import { CameraRig } from './core/CameraRig.js';
import { CrewedShip } from './ship/CrewedShip.js';
import { ShipAutopilot } from './ai/ShipAutopilot.js';
import { MultiplayerSession } from './net/MultiplayerSession.js';
import { PlayerController, Station, STATION_DEFS } from './player/PlayerController.js';
import { WeaponsSystem } from './weapons/WeaponsSystem.js';
import { RadarSystem } from './systems/RadarSystem.js';
import { MissionSystem } from './systems/MissionSystem.js';
import { DynamicOps } from './systems/DynamicOps.js';
import { TaskForceCoop } from './systems/TaskForceCoop.js';
import { WorldManager } from './world/WorldManager.js';
import { buildIsland } from './world/Island.js';
import { AudioEngine } from './audio/AudioEngine.js';
import { ShipHUD, TacticalRadar, MainMenu, PauseMenu, SettingsPanel, CommsLog, DamageVignette, StationOverlay, LobbyMenu, CoopPanel } from './ui/index.js';
import { installFrameDumper } from './debug/frameDump.js';

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
sky.onEnvMapUpdated = (tex) => ocean.setEnvMap(tex);
pipeline.bindSunLight(sky.sunLight);

const fogColor = new THREE.Color(0x9dc3dc);
scene.fog = new THREE.FogExp2(fogColor.getHex(), 0.00036);
ocean.setFogColor(fogColor);

// ============================ CREWED SHIPS ============================
// Every ship a human can board: the hero Meridian and the two task-force escorts. All
// three are always present, whether or not anyone's aboard — an empty seat just means
// ShipAutopilot is flying/fighting it instead of a human (single-player: that's always
// true for the two escorts; multiplayer: true for whatever the lobby leaves unclaimed).
const ships = {
  player: new CrewedShip(scene, { hullKind: 'hero', name: 'FS Meridian (DDG)', shipId: 'player' }),
  escort1: new CrewedShip(scene, { hullKind: 'escort', iffColor: 0x2f6a8a, name: 'FS Sentinel (DDG)', shipId: 'escort1' }),
  escort2: new CrewedShip(scene, { hullKind: 'escort', iffColor: 0x3a6a4a, name: 'FS Vanguard (CG)', shipId: 'escort2' }),
};
ships.player.group.position.set(0, 0, 0);
ships.escort1.physics.position.set(-420, 0, -60);
ships.escort2.physics.position.set(360, 0, -180);

const autopilots = {
  player: new ShipAutopilot(ships.player, { role: 'lead' }),
  escort1: new ShipAutopilot(ships.escort1, { role: 'escort', stationOffset: new THREE.Vector3(-420, 0, -60) }),
  escort2: new ShipAutopilot(ships.escort2, { role: 'escort', stationOffset: new THREE.Vector3(360, 0, -180) }),
};

// The ship/station the LOCAL human is walking around on and piloting from. Fixed for
// single-player (always the Meridian); in multiplayer it's whatever the lobby assigns
// before Start Patrol, and doesn't change again mid-patrol.
let localShipId = 'player';
let localShip = ships.player;

const mp = new MultiplayerSession({ ships, name: 'Officer' });

// Landfall island along the patrol route to VIGIL — somewhere to actually go ashore.
const island = buildIsland({ radius: 260, peak: 58 });
island.group.position.set(2100, 0, 3500);
scene.add(island.group);

// A second, smaller rocky islet elsewhere on the map — a distinct silhouette (seeded
// differently so its terrain isn't a shrunken clone of the main island) and no
// lighthouse, so the two landmarks read as different places, not the same asset twice.
const islet = buildIsland({ radius: 95, peak: 24, segments: 72, seed: 7, rockCount: 30, scrubCount: 36, lighthouse: false });
islet.group.position.set(-1900, 0, 1000);
scene.add(islet.group);

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
  // Any crewed ship can take a hit now, not just one hardcoded player ship — only
  // give the full hit-feedback treatment (shake/vignette/game-over) when it's the
  // ship the LOCAL human is actually standing on.
  onShipHit: (ship, dmg) => {
    if (ship !== localShip || gameOver) return;
    audio.playHitImpact();
    shakeCamera(0.6);
    damageVignette.flashHit(Math.min(1, dmg / 40));
    if (localShip.health <= 0) handleGameOver();
  },
  // Electronic Warfare doctrine hook: the instant a missile comes within chaff range
  // of a ship, this fires once for that threat. Escorts auto-chaff themselves after a
  // realistic reaction delay (their own EW tech, not the player); the local human's
  // OWN ship gets no auto-assist here — deliberately, so "hold X for fire, Z for
  // chaff" both require the player to actually do something under pressure instead of
  // the game quietly bailing them out.
  onEwWarning: (ship, threat) => {
    const call = shipCallsign(ship);
    if (ship === localShip) {
      ewWarningUntil = performance.now() / 1000 + 6;
      commsLog.push({ speaker: `${call} EW`, text: 'Missile lock — inbound, chaff range. Hold Z to spoof it.', urgency: 'critical' });
      audio.playAlarmKlaxon?.();
    } else {
      setTimeout(() => {
        if (!threat.dead) weapons.deployChaff(ship);
      }, 700 + Math.random() * 600);
    }
  },
  onChaff: (ship, spoofed) => {
    const call = shipCallsign(ship);
    audio.playUiConfirm?.();
    commsLog.push({
      speaker: `${call} EW`,
      text: spoofed ? 'Chaff away — missile spoofed, breaking track.' : 'Chaff away — no joy, missile still tracking.',
      urgency: spoofed ? 'normal' : 'warning',
    });
    if (ship === localShip && spoofed) ewWarningUntil = 0;
  },
});
let ewWarningUntil = 0;
const radar = new RadarSystem({ rangeM: 6000, sonarPingRangeM: 2400 });
const world = new WorldManager(scene, weapons);
const mission = new MissionSystem({
  onComms: (line) => { commsLog.push(line); audio.playRadioBlip(); },
  // Host broadcasts every beat advance so the whole room's objective/narrative text
  // stays in lockstep even though hostile encounters themselves are still simulated
  // independently per client (see the multiplayer session's documented limitation:
  // full entity replication is a follow-up, not yet wired up).
  onObjective: (obj) => {
    setObjective(obj);
    if (mp.isHost && mp.inSession) mp.net.sendMissionState({ beatIndex: mission.beatIndex });
  },
});
mp.onMissionState = (msg) => {
  if (!mp.isHost) mission.syncBeat(msg.beatIndex);
};
mp.onDisconnected = () => {
  commsLog.push({ speaker: 'TASK FORCE COMMAND', text: 'Link to the task force network lost — resuming independent command.', urgency: 'warning' });
  audio.playRadioBlip();
};

let currentObjective = null;
let opsObjective = null; // DynamicOps flash tasking overlays mission text temporarily
function setObjective(obj) { currentObjective = obj; }
function setOpsObjective(order) {
  opsObjective = order
    ? { text: order.text, stationHint: order.stationHint, bearing: null, distanceM: null }
    : null;
}

let shakeMag = 0;
function shakeCamera(mag) { shakeMag = Math.max(shakeMag, mag); }

// generic weapon spawn used by both hostile AI (targeting the Meridian) and friendly
// autopilot fire (targeting whatever hostile it picked) — kept as two thin wrappers
// around the same WeaponsSystem.spawn so damage/explosion/audio all flow one way.
function fireHostileWeapon(type, from, targetPos, source) {
  weapons.spawn(type, from, targetPos, { sourceEntity: source, targetEntity: shipProxy(ships.player) });
}
function fireFriendlyWeapon(type, from, targetPos, source, targetEntity) {
  mp.fireAndRelay((t, f, tp, opts) => weapons.spawn(t, f, tp, opts), type, from, targetPos, { sourceEntity: source, targetEntity });
}
function shipProxy(ship) {
  return { get position() { return ship.group.position; } };
}

// ---- AI-crewmate radio chatter: fires from ShipAutopilot.updateWeapons whenever an
// AI-manned weapons station (an escort with nobody aboard, or the player's own ship
// when someone else holds Helm but not Weapons) picks up a target — literally "an AI
// agent manning another station causing you to react" rather than flavor text, since
// it's tied to the same fireWeapon call that actually damages the target. ----
function shipCallsign(ship) {
  const m = (ship.name || '').match(/^FS ([A-Za-z]+)/);
  return m ? m[1].toUpperCase() : (ship.name || 'UNIT').toUpperCase();
}
function announceAiEngagement(ship, target) {
  const call = shipCallsign(ship);
  const targetDesc = target.domain === 'SUBSURFACE' ? 'a submerged contact'
    : target.domain === 'AIR' ? 'an inbound aircraft'
    : 'a hostile surface contact';
  commsLog.push({ speaker: `${call} WEAPONS (AI)`, text: `Engaging ${targetDesc} — ${target.name || 'unknown track'} designated, weapons free.`, urgency: 'warning' });
  audio.playRadioBlip();
}
function announceAiDisengagement(ship) {
  commsLog.push({ speaker: `${shipCallsign(ship)} WEAPONS (AI)`, text: 'Target down or out of range. Stowing weapons, resuming patrol picture.', urgency: 'normal' });
}

// ---- Ambient radio is now owned by DynamicOps (orders + AI station chatter). ----
let extraWaveCount = 0;

// ============================ UI ============================
const uiRoot = document.getElementById('ui-root');

const hud = new ShipHUD();
hud.mount(uiRoot);
hud.hide();

const tacRadar = new TacticalRadar({
  onSelectContact: (id) => {
    if (String(id).startsWith('nav:') || String(id).startsWith('inbound:')) return;
    weapons.selectedTargetId = id;
  },
});
tacRadar.mount(uiRoot);
tacRadar.hide();

const stationOverlay = new StationOverlay();
stationOverlay.mount(uiRoot);

// Helm/radar station control state (shared with the seated-station input handler).
let headingHold = false;
let radarFilter = 'ALL';
const RADAR_RANGES = [3000, 4500, 6000, 8000, 12000];
let radarRangeIdx = 2;
radar.rangeM = RADAR_RANGES[radarRangeIdx];

stationOverlay.onTelegraph = (value) => {
  if (playerController?.state === Station.HELM) throttleCmd = value;
};
stationOverlay.onFilterChange = (f) => { radarFilter = f; };
stationOverlay.onRangeChange = (dir) => {
  radarRangeIdx = THREE.MathUtils.clamp(radarRangeIdx + dir, 0, RADAR_RANGES.length - 1);
  radar.rangeM = RADAR_RANGES[radarRangeIdx];
};

const commsLog = new CommsLog({ maxVisible: 6 });
commsLog.mount(uiRoot);

const damageVignette = new DamageVignette();
damageVignette.mount(uiRoot);

const taskForce = new TaskForceCoop({
  ships,
  autopilots,
  world,
  radar,
  onComms: (line) => { commsLog.push(line); audio.playRadioBlip(); },
  getSelectedTargetId: () => weapons.selectedTargetId,
  setSelectedTargetId: (id) => { weapons.selectedTargetId = id; },
  getLocalShip: () => localShip,
  onSharedTrack: (id) => {
    weapons.selectedTargetId = id;
    const ent = world.entities.find((e) => e.id === id);
    if (!ent) return;
    const d = String(ent.domain || '').toUpperCase();
    if (d === 'SUBSURFACE') weapons.selectWeapon('torpedo');
    else if (d === 'AIR') weapons.selectWeapon('missile');
    else weapons.selectWeapon('gun');
  },
});

const coopPanel = new CoopPanel({
  onAction: (action) => {
    if (action === 'share') taskForce.shareTrack();
    else if (action === 'engage') taskForce.engageShared();
    else if (action === 'hold') taskForce.weaponsHold();
    else if (action === 'ping') {
      if (taskForce.requestEscortPing()) stationOverlay.triggerSonarPulse();
    } else if (action === 'screen') taskForce.returnToScreen();
    else if (action === 'affirm') taskForce.affirm();
  },
});
coopPanel.mount(uiRoot);

// ---- AI coordination fallback: TaskForceCoop's orders (share/engage/hold/ping/
// screen/affirm) are issued via keybinds that work "from any seat" — which is exactly
// the bug a player at Helm hit: DynamicOps kept nagging them to "share the track,"
// but sharing a track is Radar/Sonar's job, not the helmsman's, and there was nobody
// actually covering that job when the player wasn't personally sitting there. Each
// coop requirement now has an owning station; if the player isn't manning it, an AI
// crewmate fulfills the order after a realistic delay instead of the game just
// waiting on a station nobody's even at. Matches the pattern already established for
// Damage Control / EW: the player's own current post is theirs to handle, everything
// else runs itself. */
const COOP_OWNER_STATIONS = {
  share: ['RADAR', 'SONAR'],
  ping: ['SONAR', 'RADAR'],
  engage: ['TAO'],
  hold: ['TAO'],
  screen: ['TAO'],
  affirm: ['TAO'],
};
let aiCoopFulfillAt = 0;
function aiEnsureTargetDesignated() {
  const cur = weapons.selectedTargetId;
  const valid = cur && !String(cur).startsWith('nav:') && !String(cur).startsWith('inbound:')
    && world.entities.some((e) => e.id === cur && e.alive);
  if (valid) return true;
  let nearest = null, nearestD = Infinity;
  for (const h of world.hostiles) {
    const d = h.position.distanceTo(ships.player.group.position);
    if (d < nearestD) { nearestD = d; nearest = h; }
  }
  if (!nearest) return false;
  weapons.selectedTargetId = nearest.id;
  return true;
}
function updateAiCoordination() {
  const hint = taskForce.pendingHint;
  if (!hint) { aiCoopFulfillAt = 0; return; }
  const owners = COOP_OWNER_STATIONS[hint.kind];
  if (!owners || owners.includes(playerController.state)) {
    // It's the seat the player is actually in right now — theirs to handle, don't
    // undercut them by having the AI grab it out from under them.
    aiCoopFulfillAt = 0;
    return;
  }
  const now = performance.now() / 1000;
  if (!aiCoopFulfillAt) { aiCoopFulfillAt = now + 3 + Math.random() * 2.5; return; }
  if (now < aiCoopFulfillAt) return;
  aiCoopFulfillAt = 0;
  if (hint.kind === 'share' || hint.kind === 'engage') aiEnsureTargetDesignated();
  if (hint.kind === 'share') taskForce.shareTrack();
  else if (hint.kind === 'engage') taskForce.engageShared();
  else if (hint.kind === 'hold') taskForce.weaponsHold();
  else if (hint.kind === 'ping') {
    if (taskForce.requestEscortPing()) { stationOverlay.triggerSonarPulse(); audio.playSonarPing(); }
  } else if (hint.kind === 'screen') taskForce.returnToScreen();
  else if (hint.kind === 'affirm') taskForce.affirm();
}

const dynamicOps = new DynamicOps({
  world,
  ships,
  mission,
  coop: taskForce,
  onComms: (line) => { commsLog.push(line); audio.playRadioBlip(); },
  onObjectiveHint: (order) => setOpsObjective(order),
  isHost: () => !mp.inSession || mp.isHost,
});

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
  pipeline.setQuality(q);
  ocean.setQuality(q);
}
applyGraphicsQuality(settings.values.graphicsQuality);

let gameStarted = false;
let paused = false;
// true only while the patrol-start cinematic sweep (playPatrolIntro, below) is
// in flight — lets the main loop keep simulating the world/ship during the shot
// without also running the player's WALK-state camera control, which would
// otherwise stomp the in-progress CameraRig transition every frame.
let introPlaying = false;

const pauseMenu = new PauseMenu({
  onResume: () => { resumeFromPause(); },
  onSettings: () => { pauseMenu.hide(); settingsOpenedFrom = 'pause'; settingsIsOpen = true; settings.show(); },
  onQuitToMainMenu: () => {
    paused = false;
    pauseMenu.hide();
    gameStarted = false;
    hud.hide(); tacRadar.hide();
    coopPanel.hide();
    stationOverlay.setStation(null);
    tacRadar.setStationFocus(false);
    if (document.pointerLockElement) document.exitPointerLock();
    if (mp.inSession) mp.leave();
    mainMenu.update({ continueEnabled: true });
    mainMenu.show();
  },
});
pauseMenu.mount(uiRoot);
pauseMenu.hide();

function resumeFromPause() {
  paused = false;
  pauseMenu.hide();
  canvas.requestPointerLock();
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
  localShip.health = localShip.maxHealth;
  damageVignette.setHullPct(100);
  gameStarted = false;
  hud.hide(); tacRadar.hide();
  coopPanel.hide();
  // clear the battle: reset ships + wipe hostiles so a fresh patrol starts clean
  for (const e of world.entities) e.dispose(scene);
  world.entities = [];
  for (const [id, ship] of Object.entries(ships)) {
    ship.health = ship.maxHealth;
    const base = id === 'player' ? new THREE.Vector3(0, 0, 0) : autopilots[id].stationOffset;
    ship.physics.position.copy(base);
    ship.physics.speed = 0;
    ship.physics.heading = 0;
  }
  throttleCmd = 0; rudderCmd = 0;
  mission.started = false; mission._started = false; mission.beatIndex = 0; mission.flags.clear();
  hostileWaveSpawned = false;
  if (document.pointerLockElement) document.exitPointerLock();
  mainMenu.update({ continueEnabled: false });
  mainMenu.show();
});

// A drifting pull-back (through the same CameraRig every other camera move uses)
// instead of the camera just freezing wherever it happened to be pointed at the
// moment of death — the overlay still fades in on the same timer, but the shot
// underneath it is a deliberate cinematic beat rather than a hard cut.
function playGameOverCameraDrift() {
  cameraRig.lookEnabled = false;
  cameraRig.resetLook();
  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  const pullBackPos = camera.position.clone().addScaledVector(dir, -65).add(new THREE.Vector3(0, 42, 0));
  const lookTarget = localShip.group.position.clone().add(new THREE.Vector3(0, 4, 0));
  const quat = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(pullBackPos, lookTarget, new THREE.Vector3(0, 1, 0)));
  cameraRig.transitionTo(pullBackPos, quat, 62, 3.6);
}

function handleGameOver() {
  gameOver = true;
  audio.playAlarmKlaxon();
  commsLog.push({ speaker: 'TASK FORCE ACTUAL', text: `${localShip.name} is down. All units, converge and render assistance.`, urgency: 'critical' });
  if (document.pointerLockElement) document.exitPointerLock();
  playGameOverCameraDrift();
  setTimeout(() => { gameOverEl.style.display = 'block'; }, 1200);
}

// ============================ LOBBY (multiplayer) ============================
const lobby = new LobbyMenu({
  onJoin: async (code, name) => {
    try {
      await mp.start({ code, name });
      lobby.showRoom();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[Lobby] Could not reach the relay server.', err);
      commsLog.push({ speaker: 'TASK FORCE COMMAND', text: 'Could not reach the multiplayer relay — check the server is running.', urgency: 'critical' });
      lobby.hide();
      mainMenu.show();
    }
  },
  onClaim: (shipId, station) => mp.claimSlot(shipId, station),
  onRelease: () => mp.releaseSlot(),
  onReady: (ready) => mp.setReady(ready),
  onStart: () => mp.startPatrol(),
  onLeave: () => {
    if (mp.inSession) mp.leave();
    lobby.hide();
    mainMenu.show();
  },
});
lobby.mount(uiRoot);
lobby.hide();

mp.onRoomState = (msg) => {
  lobby.update({ code: msg.code, hostId: msg.hostId, players: msg.players, localPlayerId: mp.net?.playerId });
};

mp.onStartPatrol = () => {
  // Whatever the lobby assigned us to (default to the Meridian if we never claimed a
  // seat) becomes our ship for the rest of the patrol.
  const me = mp.net?.me;
  localShipId = me?.shipId || 'player';
  localShip = ships[localShipId];
  playerController.setShip(localShip);
  lobby.hide();
  beginPatrol();
};

mp.setWeaponHooks({
  spawn: (type, from, targetPos, opts) => weapons.spawn(type, from, targetPos, opts),
  findEntity: (id) => world.entities.find((e) => e.id === id) || Object.values(ships).find((s) => s.id === id) || null,
});

const mainMenu = new MainMenu({
  onNewPatrol: () => {
    unlockAudio();
    mainMenu.hide();
    localShipId = 'player';
    localShip = ships.player;
    playerController.setShip(localShip);
    beginPatrol();
  },
  onContinue: () => {
    mainMenu.hide();
    gameStarted = true;
    hud.show(); tacRadar.show();
    coopPanel.show();
    canvas.requestPointerLock();
  },
  onMultiplayer: () => {
    mainMenu.hide();
    lobby.show();
  },
  onSettings: () => { mainMenu.hide(); settingsOpenedFrom = 'main'; settingsIsOpen = true; settings.show(); },
  onCredits: () => {
    commsLog.push({ speaker: 'MERIDIAN', text: 'A naval combat tech demo — built with Three.js, procedural graphics/audio, zero external assets.', urgency: 'normal' });
  },
  continueEnabled: false,
});
mainMenu.mount(uiRoot);
mainMenu.show();

function beginPatrol() {
  unlockAudio();
  if (!mission.started) {
    mission.start();
  }
  if (!dynamicOps.started) dynamicOps.start();
  // brief cinematic sweep (task force + ship exterior) before handing off to the
  // first-person bridge spawn — see playPatrolIntro() below. gameStarted flips true
  // only once it completes, so nothing shows/updates HUD-side until the handoff.
  playPatrolIntro(() => {
    gameStarted = true;
    hud.show(); tacRadar.show();
    coopPanel.show();
    showControlsIntro();
  });
}

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
const promptEl = document.createElement('div');
promptEl.className = 'stn-prompt';
document.body.appendChild(promptEl);

// ---- Damage Control alert: a hit that starts a fire (see CrewedShip.takeDamage)
// needs the player to actually do something about it — hold X to fight it, from
// wherever they're standing, station or not — instead of just watching the hull bar
// drain. AI runs a slow passive baseline on every ship whether or not this is up. ----
const fireAlertEl = document.createElement('div');
fireAlertEl.className = 'hud-panel';
fireAlertEl.style.cssText = `
  position:fixed; left:50%; bottom:22%; transform:translateX(-50%);
  padding:14px 26px; z-index:65; display:none; text-align:center;
  border-color:rgba(255,68,68,0.6);
`;
fireAlertEl.innerHTML = `
  <div class="hud-corners"></div>
  <div class="hud-label" style="color:var(--c-red); font-size:14px;">DAMAGE CONTROL — FIRE ABOARD</div>
  <div style="font:12px var(--font-mono); color:var(--c-text); margin-top:4px;">Hold <kbd>X</kbd> to fight it</div>
`;
document.body.appendChild(fireAlertEl);
let localShipWasBurning = false;

// ---- EW alert: mirrors the DC alert but for an inbound missile lock (see the
// WeaponsSystem onEwWarning/onChaff callbacks above) — a timed window rather than a
// continuous state, since a missile is seconds away, not an ongoing casualty. ----
const ewAlertEl = document.createElement('div');
ewAlertEl.className = 'hud-panel';
ewAlertEl.style.cssText = `
  position:fixed; left:50%; bottom:29%; transform:translateX(-50%);
  padding:14px 26px; z-index:65; display:none; text-align:center;
  border-color:rgba(255,176,46,0.6);
`;
ewAlertEl.innerHTML = `
  <div class="hud-corners"></div>
  <div class="hud-label" style="color:var(--c-amber); font-size:14px;">EW — MISSILE LOCK</div>
  <div style="font:12px var(--font-mono); color:var(--c-text); margin-top:4px;">Press <kbd>Z</kbd> to deploy chaff</div>
`;
document.body.appendChild(ewAlertEl);

// ---- controls intro: shown once per new patrol, on the deck before the mouse is
// captured, so the player can read it without having to fight pointer lock. Only
// covers the universal walk-around controls — station-specific ones (throttle/rudder,
// weapon select/fire) are already taught contextually via the station overlay the
// moment the player sits down, so they're deliberately left out here. ----
const introEl = document.createElement('div');
introEl.className = 'hud-panel';
introEl.style.cssText = `
  position:fixed; left:50%; bottom:9%; transform:translateX(-50%);
  padding:20px 30px; z-index:70; display:none; min-width:320px; text-align:left;
  animation: hud-fade-up 0.45s var(--ease-hud) both;
`;
introEl.innerHTML = `
  <div class="hud-corners"></div>
  <div class="hud-label" style="color:var(--c-cyan); margin-bottom:12px;">BRIDGE ORIENTATION</div>
  <div style="display:grid; grid-template-columns:auto 1fr; gap:7px 20px; font:13px var(--font-mono); color:var(--c-text); white-space:nowrap;">
    <span style="color:var(--c-cyan);">W&nbsp;A&nbsp;S&nbsp;D</span><span>Move about the bridge</span>
    <span style="color:var(--c-cyan);">MOUSE</span><span>Look around</span>
    <span style="color:var(--c-cyan);">SHIFT</span><span>Sprint</span>
    <span style="color:var(--c-cyan);">E</span><span>Sit at a glowing station</span>
    <span style="color:var(--c-cyan);">ESC</span><span>Pause</span>
  </div>
  <div class="hud-label" style="margin-top:16px; opacity:0.7;">Click anywhere to take the deck</div>
`;
document.body.appendChild(introEl);

function showControlsIntro() {
  introEl.style.display = 'block';
  let dismissed = false;
  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    introEl.style.display = 'none';
    canvas.requestPointerLock();
    window.removeEventListener('keydown', dismiss);
    canvas.removeEventListener('click', dismiss);
    clearTimeout(autoTimer);
  };
  window.addEventListener('keydown', dismiss);
  canvas.addEventListener('click', dismiss);
  const autoTimer = setTimeout(dismiss, 14000);
}

// ---- new-patrol cinematic: a brief exterior sweep of the ship (and the task force
// holding formation around her) before blending into the first-person bridge spawn,
// so getting underway never feels like an abrupt teleport into the bridge. Goes
// through the same CameraRig blend as every other camera move in the game (station
// sit-downs, etc.) — no separate lerp system, just three chained transitionTo legs. ----
function playPatrolIntro(onDone) {
  introPlaying = true;
  // Force every ship's exterior transform to reflect its current physics state right
  // now — normally that only happens inside the gameStarted-gated main-loop update,
  // so without this the very first frame (and, after a game-over restart, every
  // frame until introPlaying flips world simulation back on) would still show ships
  // at their stale pre-reset transform.
  for (const ship of Object.values(ships)) ship.physics.applyToObject3D(ship.group);

  const shipPos = localShip.group.position.clone();
  const shipQuat = localShip.group.quaternion.clone();
  const up = new THREE.Vector3(0, 1, 0);

  // leg 1: wide, high establishing shot behind/above the ship — shows the escorts
  // holding station around her
  const wideLocal = new THREE.Vector3(150, 100, -230);
  const widePos = wideLocal.clone().applyQuaternion(shipQuat).add(shipPos);
  const wideLook = shipPos.clone().add(new THREE.Vector3(0, 12, 30));
  const wideQuat = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(widePos, wideLook, up));

  // leg 2: lower pass along the hull, closing in toward the bow/bridge
  const passLocal = new THREE.Vector3(-70, 26, 40);
  const passPos = passLocal.clone().applyQuaternion(shipQuat).add(shipPos);
  const passLook = shipPos.clone().add(new THREE.Vector3(0, 6, -10));
  const passQuat = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(passPos, passLook, up));

  cameraRig.transitionTo(widePos, wideQuat, 45, 2.1, () => {
    cameraRig.transitionTo(passPos, passQuat, 55, 2.6, () => {
      // leg 3: blend into the player's actual first-person bridge spawn pose
      const bridgePos = playerController._walkWorldPosition();
      const bridgeQuat = playerController._walkWorldQuaternion();
      cameraRig.transitionTo(bridgePos, bridgeQuat, 70, 2.4, () => {
        introPlaying = false;
        onDone();
      });
    });
  });
}

// ============================ PLAYER CONTROLLER ============================
const playerController = new PlayerController({
  camera, cameraRig, domElement: canvas, playerShip: localShip,
  onInteractPrompt: (station) => {
    const def = STATION_DEFS[station];
    if (def) {
      promptEl.innerHTML = `<kbd>E</kbd>${def.promptText.replace(/^Press E to /i, '')}`;
      promptEl.classList.add('is-visible');
    } else {
      promptEl.classList.remove('is-visible');
    }
  },
  onStationChange: (station) => {
    const seated = station && station !== 'WALK' && STATION_DEFS[station];
    stationOverlay.setStation(seated ? station : null);
    hud.setAiming(station === Station.WEAPONS);
    tacRadar.setStationFocus(station === Station.RADAR || station === Station.SONAR || station === Station.TAO);
    if (station !== Station.HELM) headingHold = false;
    if (station !== Station.WEAPONS) {
      playerController.weaponsTrackLock = false;
      playerController.trackTargetPos = null;
    }
    // Dim the corner radar while seated at weapons/helm/lookout so the station UI owns the frame;
    // keep it visible (enlarged) at the radar console.
    if (station === Station.RADAR) tacRadar.show();
    else if (station && station !== 'WALK') {
      // keep a small situational awareness blip visible except lookout immersion
      if (station === Station.LOOKOUT) tacRadar.hide();
      else tacRadar.show();
    } else if (gameStarted) {
      tacRadar.show();
    }
    if (station === Station.HELM) mission.flag('depart');
    if (seated) {
      unlockAudio();
      audio.playUiConfirm();
    }
  },
});

// ---- task-force net: available from any seat (and while walking the bridge) ----
window.addEventListener('keydown', (e) => {
  if (!gameStarted || paused || gameOver) return;
  if (e.code === 'KeyC') { taskForce.shareTrack(); audio.playUiConfirm(); }
  else if (e.code === 'KeyV') { taskForce.engageShared(); audio.playUiConfirm(); }
  else if (e.code === 'KeyB') { taskForce.weaponsHold(); audio.playUiConfirm(); }
  else if (e.code === 'KeyN') {
    if (taskForce.requestEscortPing()) {
      stationOverlay.triggerSonarPulse();
      audio.playSonarPing();
    }
  } else if (e.code === 'KeyM') { taskForce.returnToScreen(); audio.playUiConfirm(); }
  else if (e.code === 'KeyY') { taskForce.affirm(); audio.playUiConfirm(); }
  else if (e.code === 'KeyZ') { weapons.deployChaff(localShip); }
});

// ---- station-specific inputs: each console owns a distinct control set ----
window.addEventListener('keydown', (e) => {
  if (!gameStarted || paused) return;
  const st = playerController.state;

  if (st === Station.HELM) {
    if (e.code === 'Digit1') throttleCmd = -1;
    else if (e.code === 'Digit2') throttleCmd = -0.35;
    else if (e.code === 'Digit3') throttleCmd = 0;
    else if (e.code === 'Digit4') throttleCmd = 0.35;
    else if (e.code === 'Digit5') throttleCmd = 0.7;
    else if (e.code === 'Digit6') throttleCmd = 1;
    else if (e.code === 'KeyH') {
      headingHold = !headingHold;
      audio.playUiConfirm();
    } else if (e.code === 'KeyF') {
      // One-shot steer toward waypoint
      const wp = mission.currentWaypoint;
      if (wp) {
        const dx = wp.x - localShip.group.position.x;
        const dz = wp.z - localShip.group.position.z;
        const brg = Math.atan2(dx, dz);
        let err = brg - localShip.physics.heading;
        while (err > Math.PI) err -= Math.PI * 2;
        while (err < -Math.PI) err += Math.PI * 2;
        rudderCmd = THREE.MathUtils.clamp(err * 1.6, -1, 1);
      }
    }
    return;
  }

  if (st === Station.RADAR) {
    if (e.code === 'Digit1') radarFilter = 'ALL';
    else if (e.code === 'Digit2') radarFilter = 'SURFACE';
    else if (e.code === 'Digit3') radarFilter = 'AIR';
    else if (e.code === 'Digit4') radarFilter = 'SUBSURFACE';
    else if (e.code === 'Digit5') radarFilter = 'NAV';
    else if (e.code === 'BracketLeft') {
      radarRangeIdx = Math.max(0, radarRangeIdx - 1);
      radar.rangeM = RADAR_RANGES[radarRangeIdx];
    } else if (e.code === 'BracketRight') {
      radarRangeIdx = Math.min(RADAR_RANGES.length - 1, radarRangeIdx + 1);
      radar.rangeM = RADAR_RANGES[radarRangeIdx];
    } else if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      // Designate currently selected track to weapons
      if (weapons.selectedTargetId && !String(weapons.selectedTargetId).startsWith('nav:')) {
        commsLog.push({
          speaker: 'CIC',
          text: `Track ${weapons.selectedTargetId} designated to weapons.`,
          urgency: 'warning',
        });
        audio.playUiConfirm();
      }
    }
  }

  if (st === Station.WEAPONS) {
    if (e.code === 'Digit1') weapons.selectWeapon('gun');
    else if (e.code === 'Digit2') weapons.selectWeapon('missile');
    else if (e.code === 'Digit3') weapons.selectWeapon('torpedo');
    else if (e.code === 'Digit4') weapons.selectWeapon('drone');
    else if (e.code === 'KeyT') {
      playerController.weaponsTrackLock = !playerController.weaponsTrackLock;
      audio.playUiConfirm();
    } else if (e.code === 'KeyF' || e.code === 'Space') {
      e.preventDefault();
      fireSelectedWeapon();
    } else if (e.code === 'KeyG') {
      // Snap select nearest inbound threat's source if any, else nearest hostile
      const inbound = getInboundThreats();
      if (inbound.length) {
        // Prefer nearest hostile surface/air for CIWS-style gun
        weapons.selectWeapon('gun');
        const hostiles = lastContacts.filter((c) => c.iff === 'HOSTILE' || c.iff === 'hostile');
        if (hostiles.length) {
          hostiles.sort((a, b) => Math.hypot(a.x, a.z) - Math.hypot(b.x, b.z));
          weapons.selectedTargetId = hostiles[0].id;
          playerController.weaponsTrackLock = true;
        }
      }
    }
  }

  if (st === Station.LOOKOUT && e.code === 'KeyR') {
    reportLookoutContact();
    return;
  }

  if (st !== Station.WEAPONS && st !== Station.RADAR && st !== Station.SONAR) return;
  if (e.code === 'KeyQ') {
    radar.triggerSonarPing(localShip.group.position.clone());
    audio.playSonarPing();
    stationOverlay.triggerSonarPulse();
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
  const contacts = (lastContacts || []).filter((c) => !c.isWaypoint && !String(c.id).startsWith('nav:') && !String(c.id).startsWith('inbound:'));
  if (!contacts.length) return;
  const idx = contacts.findIndex((c) => c.id === weapons.selectedTargetId);
  const next = contacts[(idx + 1) % contacts.length];
  weapons.selectedTargetId = next.id;
}

function waypointNav(playerPos, wp, name = 'VIGIL') {
  if (!wp) return null;
  const dx = wp.x - playerPos.x;
  const dz = wp.z - playerPos.z;
  const distanceM = Math.hypot(dx, dz);
  const bearing = ((THREE.MathUtils.radToDeg(Math.atan2(dx, dz)) % 360) + 360) % 360;
  return { name, bearing, distanceM, x: dx, z: dz };
}

function getInboundThreats() {
  const shipPos = localShip.group.position;
  const threats = [];
  for (const p of weapons.projectiles) {
    if (p.dead) continue;
    if (!['enemyMissile', 'torpedo', 'airMissile'].includes(p.type)) continue;
    const dist = p.position.distanceTo(shipPos);
    if (dist > 3500) continue;
    const dx = p.position.x - shipPos.x;
    const dz = p.position.z - shipPos.z;
    const bearing = ((THREE.MathUtils.radToDeg(Math.atan2(dx, dz)) % 360) + 360) % 360;
    threats.push({
      id: `inbound:${p.id || threats.length}`,
      name: p.type === 'torpedo' ? 'TORPEDO' : 'INBOUND MSL',
      bearing,
      distanceM: dist,
      x: dx,
      z: dz,
      domain: 'INBOUND',
      iff: 'INBOUND',
      isInbound: true,
    });
  }
  threats.sort((a, b) => a.distanceM - b.distanceM);
  return threats;
}

function evaluateFireSolution(targetEntity, targetInfo) {
  const key = weapons.selectedWeapon;
  if (!targetInfo && key !== 'gun' && key !== 'drone') {
    return { ok: false, reason: 'NO TRACK', detail: 'Tab to select a contact' };
  }
  if (key === 'missile') {
    if (!targetEntity || targetEntity.domain !== 'SURFACE') {
      return { ok: false, reason: 'WRONG DOMAIN', detail: 'Missiles need a surface track' };
    }
    if (targetEntity.iff === 'FRIENDLY') {
      return { ok: false, reason: 'FRIENDLY', detail: 'Cannot engage friendly track' };
    }
  }
  if (key === 'torpedo') {
    if (!targetEntity || targetEntity.domain !== 'SUBSURFACE') {
      return { ok: false, reason: 'NO SUB TRACK', detail: 'Ping sonar (Radar Q) then select sub' };
    }
  }
  if (targetEntity && targetInfo) {
    // Require the director camera to be roughly on the target when track-lock is off
    const camDir = new THREE.Vector3();
    camera.getWorldDirection(camDir);
    const toT = targetEntity.position.clone().sub(camera.position).normalize();
    const align = camDir.dot(toT);
    if (!playerController.weaponsTrackLock && align < 0.55 && key !== 'drone' && key !== 'gun') {
      return { ok: false, reason: 'OFF BORESIGHT', detail: 'Slew onto target or press T to lock track' };
    }
    if (targetInfo.distanceM > 5500 && key === 'gun') {
      return { ok: false, reason: 'OUT OF RANGE', detail: 'Close range or switch to missile' };
    }
  }
  if (!weapons.canFireSelected()) {
    return { ok: false, reason: 'NOT READY', detail: 'Magazine or cooldown' };
  }
  return { ok: true, reason: 'SOLUTION GOOD', detail: playerController.weaponsTrackLock ? 'Track lock engaged' : 'Boresight clear' };
}

function reportLookoutContact() {
  const sighted = findSightedContact();
  if (!sighted?.entity) {
    commsLog.push({ speaker: 'LOOKOUT', text: 'Nothing in the glass — keep sweeping.', urgency: 'normal' });
    return;
  }
  const e = sighted.entity;
  e.visualId = true;
  if (e.iff === 'UNKNOWN' || e.iff === 'NEUTRAL') {
    // Visual classify: merchants stay neutral but marked; unknowns become hostile if military-looking domains
    if (e.domain === 'SURFACE' && e.name?.toLowerCase().includes('merchant')) {
      e.iff = 'NEUTRAL';
    } else if (e.iff === 'UNKNOWN') {
      e.iff = 'HOSTILE';
    }
  }
  const brg = formatBearingSafe(playerController.getLookBearingDeg());
  commsLog.push({
    speaker: 'LOOKOUT',
    text: `Visual contact bearing ${brg} — ${e.name || 'unknown'}, ${(e.domain || '').toLowerCase()}, classified ${(e.iff || '').toLowerCase()}.`,
    urgency: e.iff === 'HOSTILE' ? 'warning' : 'normal',
  });
  weapons.selectedTargetId = e.id;
  audio.playUiConfirm();
}

function formatBearingSafe(deg) {
  const d = Math.round(((deg % 360) + 360) % 360);
  return String(d).padStart(3, '0');
}

function findSightedContact() {
  const camDir = new THREE.Vector3();
  camera.getWorldDirection(camDir);
  const origin = camera.position;
  let best = null;
  let bestScore = 0.82; // cos angle threshold
  const sources = [...world.entities, ...Object.values(ships).filter((s) => s !== localShip)];
  for (const e of sources) {
    if (!e || e.destroyed || e.alive === false) continue;
    const pos = e.position || e.group?.position;
    if (!pos) continue;
    const to = pos.clone().sub(origin);
    const dist = to.length();
    if (dist < 40 || dist > 5000) continue;
    to.normalize();
    const align = camDir.dot(to);
    if (align > bestScore) {
      bestScore = align;
      best = {
        entity: e,
        name: e.name,
        domain: e.domain,
        iff: e.iff,
        distanceM: dist,
        reported: !!e.visualId,
      };
    }
  }
  return best;
}

function fireSelectedWeapon() {
  const mpts = localShip.mountPoints;
  const targetEntity = world.entities.find((e) => e.id === weapons.selectedTargetId && e.alive);
  const selected = lastContacts.find((c) => c.id === weapons.selectedTargetId);
  let targetInfo = null;
  if (selected) {
    targetInfo = {
      distanceM: Math.hypot(selected.x, selected.z),
      bearing: ((THREE.MathUtils.radToDeg(Math.atan2(selected.x, selected.z)) % 360) + 360) % 360,
      domain: selected.domain,
      iff: selected.iff,
    };
  }
  const sol = evaluateFireSolution(targetEntity || null, targetInfo);
  if (!sol.ok && weapons.selectedWeapon !== 'gun') {
    return;
  }

  let fromLocal = mpts.gunBarrelTip;
  if (weapons.selectedWeapon === 'missile') fromLocal = mpts.missileTubes[0];
  else if (weapons.selectedWeapon === 'torpedo') fromLocal = mpts.missileTubes[2] || mpts.missileTubes[0];
  const from = localShip.getMountWorld(fromLocal, new THREE.Vector3());

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

  const key = weapons.selectedWeapon;
  const fired = weapons.firePlayerWeapon(from, targetPos, targetEntity || null);
  if (fired && mp.inSession) {
    mp.net.sendWeaponFire({
      type: { gun: 'playerShell', missile: 'playerMissile', torpedo: 'playerTorpedo', drone: 'drone' }[key],
      from: { x: from.x, y: from.y, z: from.z },
      target: { x: targetPos.x, y: targetPos.y, z: targetPos.z },
      targetEntityId: targetEntity?.id ?? null,
    });
  }
}

// ============================ RESIZE / DEBUG ============================
window.GAME = {
  pipeline, sky, ocean, camera, scene, renderer, THREE, ships, localShipId, cameraRig, playerController,
  weapons, radar, world, mission, audio, hud, tacRadar, mainMenu, pauseMenu, settings, commsLog,
  damageVignette, island, islet, stationOverlay, Station, mp, lobby, dynamicOps, taskForce, coopPanel,
};
const frameDumper = installFrameDumper(renderer);
window.GAME.dumpFrames = frameDumper.dumpFrames;

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
// Debug-only FPS readout — hidden by default (toggle with the backtick key), not a
// permanent on-screen element in the shipping experience.
const fpsEl = document.createElement('div');
fpsEl.style.cssText = 'position:fixed;top:8px;left:8px;color:#7fffb0;font:12px monospace;z-index:100;background:rgba(0,0,0,0.4);padding:4px 8px;border-radius:4px;display:none;';
document.body.appendChild(fpsEl);
window.addEventListener('keydown', (e) => {
  if (e.code === 'Backquote') fpsEl.style.display = fpsEl.style.display === 'none' ? 'block' : 'none';
});

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  const elapsed = clock.elapsedTime;

  // world/ship simulation also runs during the patrol-intro cinematic (so escorts
  // are visibly holding formation, ocean/buoyancy is live, etc. during the sweep) —
  // only the player's own WALK-state camera control waits for gameStarted, since it
  // would otherwise stomp the in-progress CameraRig transition every frame.
  const active = (gameStarted || introPlaying) && !paused && !gameOver;
  const getWaveHeight = (x, z, t) => ocean.getHeightAt(x, z, t);

  if (active) {
    if (gameStarted && playerController.state === Station.HELM) {
      const k = playerController.keys;
      // Continuous nudge still available alongside telegraph notches
      throttleCmd = THREE.MathUtils.clamp(
        throttleCmd + ((k.has('KeyW') ? 1 : 0) - (k.has('KeyS') ? 1 : 0)) * dt * 0.55,
        -1, 1
      );
      if (headingHold && mission.currentWaypoint) {
        const wp = mission.currentWaypoint;
        const dx = wp.x - localShip.group.position.x;
        const dz = wp.z - localShip.group.position.z;
        let err = Math.atan2(dx, dz) - localShip.physics.heading;
        while (err > Math.PI) err -= Math.PI * 2;
        while (err < -Math.PI) err += Math.PI * 2;
        rudderCmd = THREE.MathUtils.clamp(err * 1.35, -1, 1);
      } else {
        rudderCmd = (k.has('KeyD') ? 1 : 0) - (k.has('KeyA') ? 1 : 0);
      }
    }

    for (const [shipId, ship] of Object.entries(ships)) {
      ship.networked = !mp.iSimulateShip(shipId);
      if (!ship.networked) {
        const helmHuman = mp.helmIsHuman(shipId); // if true here, it's always the local human (see MultiplayerSession)
        if (helmHuman) {
          // Keep last telegraph/rudder while the local helm player is at another
          // station or walking the bridge — otherwise leaving HELM kills way and
          // the force drifts dead in the water mid-fight.
          if (ship === localShip) ship.setCommand(throttleCmd, rudderCmd);
        } else {
          const engageEnt = taskForce.sharedTargetId
            ? world.entities.find((e) => e.id === taskForce.sharedTargetId && !e.destroyed)
            : null;
          autopilots[shipId].updateHelm(dt, {
            anchorShip: ships.player,
            waypoint: mission.currentWaypoint,
            engageWorldPos: engageEnt?.position || null,
          });
        }
        if (!mp.weaponsIsHuman(shipId)) {
          autopilots[shipId].updateWeapons(dt, {
            hostiles: world.hostiles,
            fireWeapon: fireFriendlyWeapon,
            onEngage: (autoShip, target) => announceAiEngagement(autoShip, target),
            onDisengage: (autoShip) => announceAiDisengagement(autoShip),
            weaponsPolicy: taskForce.weaponsPolicy,
            sharedTargetId: taskForce.sharedTargetId,
          });
        }
      }
      // networked ships still need update() every frame — it's what lerps the
      // physics transform toward the last received network state and applies it
      // to the group; skipping it (as an earlier version of this loop did) left
      // replicated ships visually frozen at their spawn position forever, even
      // though the network state was arriving and being stored correctly.
      ship.update(dt, elapsed, getWaveHeight);
      if (!ship.networked) {
        // Damage Control doctrine hook: only the LOCAL human's actively-held key
        // speeds up suppression, and only for whichever ship they're actually
        // standing on — every ship still gets the slow passive AI baseline so a
        // fire on an escort nobody's aboard doesn't just burn forever unchecked.
        const fighting = ship === localShip && gameStarted && playerController.keys.has('KeyX');
        ship.updateDamageControl(dt, { fighting });
      }
    }
    mp.tick(dt);

    if (gameStarted) playerController.update(dt);
  }
  cameraRig.update(dt);

  if (shakeMag > 0.001) {
    camera.position.x += (Math.random() - 0.5) * shakeMag;
    camera.position.y += (Math.random() - 0.5) * shakeMag;
    camera.position.z += (Math.random() - 0.5) * shakeMag;
    shakeMag *= 0.88;
  } else shakeMag = 0;

  sky.setFollowTarget(localShip.group.position);
  sky.update(camera, elapsed);
  ocean.setShipState(localShip);
  ocean.update(dt, elapsed, camera);

  // lighthouse beacon pulse
  const beaconPulse = 1.6 + Math.max(0, Math.sin(elapsed * 0.9)) * 2.2;
  island.lamp.material.emissiveIntensity = beaconPulse;
  island.beaconLight.intensity = beaconPulse * 3.2;

  if (active) {
    radar.update(dt);
    if (gameStarted) {
      dynamicOps.update(dt);
      updateAiCoordination();
      coopPanel.update(taskForce.status);
    }
    world.update(dt, {
      playerPos: ships.player.group.position,
      playerShip: ships.player,
      elapsed,
      fireWeapon: fireHostileWeapon,
      getWaveHeight,
      ...radar.sonarContext,
    });
    weapons.update(dt, { ships: Object.values(ships), enemies: world.entities, elapsed, camera });

    const wp = mission.currentWaypoint;
    if (wp && ships.player.group.position.distanceTo(wp) < 500) mission.flag('nearWaypoint0');
    const spawnReq = mission.consumeSpawnRequest();
    if (spawnReq) { world.spawnWave(spawnReq, wp || ships.player.group.position); hostileWaveSpawned = true; }
    if (hostileWaveSpawned && world.hostiles.length === 0) {
      mission.flag('wave1Cleared'); mission.flag('subCleared'); mission.flag('airWaveCleared');
    }

    audio.setListenerPosition(camera.position.x, camera.position.y, camera.position.z);
    const camFwd = new THREE.Vector3(); camera.getWorldDirection(camFwd);
    audio.setListenerOrientation(camFwd, new THREE.Vector3(0, 1, 0));
    audio._engineHum?.setRpm?.(Math.abs(throttleCmd));

    const heading = ((THREE.MathUtils.radToDeg(localShip.physics.heading) % 360) + 360) % 360;
    const w = weapons.getWeaponInfo();
    const navTarget = wp || mission.waypoints[0];
    const navName = (wp === mission.waypoints[1]) ? 'FORMATION' : 'VIGIL';
    const nav = waypointNav(ships.player.group.position, navTarget, navName);
    const objBearing = nav ? nav.bearing : null;
    const displayObjective = opsObjective || currentObjective;
    hud.update({
      heading,
      speedKnots: localShip.physics.speedKnots,
      throttleFraction: throttleCmd,
      hullPct: (localShip.health / localShip.maxHealth) * 100,
      subsystems: { engine: 'nominal', radar: 'nominal', weapons: 'nominal' },
      objective: displayObjective ? {
        text: displayObjective.text,
        bearing: objBearing,
        distanceM: nav ? Math.round(nav.distanceM) : null,
      } : null,
      selectedWeapon: { name: w.name, ammo: w.ammo === Infinity ? 999 : w.ammo, maxAmmo: w.maxAmmo === Infinity ? 999 : w.maxAmmo, ready: w.ready },
    });
    damageVignette.setHullPct((localShip.health / localShip.maxHealth) * 100);

    const burning = localShip.fireIntensity > 0.02;
    fireAlertEl.style.display = burning ? 'block' : 'none';
    if (burning && !localShipWasBurning) {
      commsLog.push({ speaker: 'DC CENTRAL', text: `Fire aboard ${localShip.name} — all hands, hold X to fight it.`, urgency: 'critical' });
      audio.playAlarmKlaxon?.();
    } else if (!burning && localShipWasBurning) {
      commsLog.push({ speaker: 'DC CENTRAL', text: 'Fire out. Good work — resuming normal operations.', urgency: 'normal' });
    }
    localShipWasBurning = burning;
    ewAlertEl.style.display = performance.now() / 1000 < ewWarningUntil ? 'block' : 'none';

    // Escorts show up on radar/tactical plot as friendly contacts alongside hostiles —
    // exclude whichever ship the local human is actually standing on (no need for a
    // radar blip of yourself), same as single-player never showing the player ship.
    const radarSources = [...world.entities, ...Object.values(ships).filter((s) => s !== localShip)];
    lastContacts = radar.buildContacts(localShip.group.position, radarSources, weapons.selectedTargetId);

    // Patrol station / formation as a persistent nav mark on the plot + HUD.
    if (nav) {
      lastContacts.push({
        id: navName === 'FORMATION' ? 'nav:formation' : 'nav:vigil',
        x: nav.x,
        z: nav.z,
        domain: 'NAV',
        iff: 'NAV',
        name: navName,
        selected: false,
        distanceM: Math.round(nav.distanceM),
        isWaypoint: true,
      });
    }

    const inbound = getInboundThreats();
    for (const t of inbound) {
      lastContacts.push({
        id: t.id,
        x: t.x,
        z: t.z,
        domain: 'INBOUND',
        iff: 'INBOUND',
        name: t.name,
        selected: false,
        distanceM: Math.round(t.distanceM),
        isInbound: true,
      });
    }

    const filteredContacts = lastContacts.filter((c) => {
      if (radarFilter === 'ALL') return true;
      if (radarFilter === 'NAV') return c.isWaypoint || c.domain === 'NAV';
      if (radarFilter === 'SURFACE') return c.domain === 'SURFACE' || c.domain === 'surface';
      if (radarFilter === 'AIR') return c.domain === 'AIR' || c.domain === 'air';
      if (radarFilter === 'SUBSURFACE') return c.domain === 'SUBSURFACE' || c.domain === 'subsurface';
      return true;
    });

    tacRadar.update({
      rangeM: radar.rangeM,
      playerHeading: heading,
      contacts: filteredContacts.map((c) => ({
        id: c.id, x: c.x, z: c.z,
        domain: String(c.domain).toLowerCase(),
        iff: String(c.iff).toLowerCase(),
        name: c.name,
        selected: c.selected || c.id === weapons.selectedTargetId,
      })),
    });

    // Weapons director camera tracks the designated live entity.
    const trackEnt = world.entities.find((e) => e.id === weapons.selectedTargetId && e.alive);
    playerController.trackTargetPos = trackEnt ? trackEnt.position.clone() : null;

    // Station overlay instruments — only when seated so we don't burn DOM writes while walking.
    if (STATION_DEFS[playerController.state]) {
      const selected = lastContacts.find((c) => c.id === weapons.selectedTargetId && !c.isWaypoint && !c.isInbound) || null;
      const targetEntity = selected
        ? world.entities.find((e) => e.id === selected.id)
        : null;
      let targetInfo = null;
      if (selected) {
        const dx = selected.x;
        const dz = selected.z;
        const dist = Math.hypot(dx, dz);
        const bearing = ((THREE.MathUtils.radToDeg(Math.atan2(dx, dz)) % 360) + 360) % 360;
        targetInfo = {
          name: selected.name,
          domain: selected.domain,
          iff: selected.iff,
          distanceM: dist,
          bearing,
        };
      }
      const fireSolution = evaluateFireSolution(targetEntity || null, targetInfo);
      const sighted = playerController.state === Station.LOOKOUT ? findSightedContact() : null;
      stationOverlay.update({
        heading,
        speedKnots: localShip.physics.speedKnots,
        throttleFraction: throttleCmd,
        rudder: rudderCmd,
        headingHold,
        waypoint: nav,
        selectedWeapon: weapons.selectedWeapon,
        ammo: { ...weapons.ammo },
        weaponReady: weapons.canFireSelected(),
        target: targetInfo,
        fireSolution,
        trackLock: playerController.weaponsTrackLock,
        inbound,
        contacts: filteredContacts.map((c) => ({
          id: c.id,
          name: c.name,
          iff: c.iff,
          domain: c.domain,
          distanceM: Math.hypot(c.x, c.z),
          isWaypoint: !!c.isWaypoint,
        })),
        // Unfiltered — Sonar (subsurface only) and TAO (everything) each need a view
        // independent of whatever filter Radar's own operator happens to have set.
        allContacts: lastContacts.map((c) => ({
          id: c.id,
          name: c.name,
          iff: c.iff,
          domain: c.domain,
          distanceM: Math.hypot(c.x, c.z),
          isWaypoint: !!c.isWaypoint,
        })),
        selectedTargetId: weapons.selectedTargetId,
        filter: radarFilter,
        rangeM: radar.rangeM,
        navWaypoint: nav,
        lookoutZoom: playerController.lookoutZoom,
        lookBearing: playerController.getLookBearingDeg(),
        sighted,
        taskForceStatus: taskForce.status,
      });
    }
  }

  pipeline.render(elapsed);

  frameCount++; fpsAccum += dt;
  if (fpsAccum >= 0.5) { fpsEl.textContent = `${Math.round(frameCount / fpsAccum)} fps`; frameCount = 0; fpsAccum = 0; }
}

animate();

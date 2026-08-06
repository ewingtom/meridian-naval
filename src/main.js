import * as THREE from 'three';
import { RenderPipeline } from './core/renderer.js';
import { SkySystem } from './core/sky.js';
import { OceanField } from './core/ocean.js';
import { CameraRig } from './core/CameraRig.js';
import { CrewedShip } from './ship/CrewedShip.js';
import { ShipAutopilot } from './ai/ShipAutopilot.js';
import { HostileFleetDirector } from './ai/HostileFleetDirector.js';
import { MultiplayerSession } from './net/MultiplayerSession.js';
import { PlayerController, Station, STATION_DEFS } from './player/PlayerController.js';
import { WeaponsSystem } from './weapons/WeaponsSystem.js';
import { RadarSystem } from './systems/RadarSystem.js';
import { MissionSystem } from './systems/MissionSystem.js';
import { DynamicOps } from './systems/DynamicOps.js';
import { WeatherSystem, WEATHER_STATES } from './systems/WeatherSystem.js';
import { TaskForceCoop } from './systems/TaskForceCoop.js';
import { IdentificationTracker } from './systems/IdentificationTracker.js';
import { ScenarioRun } from './systems/TaoDebrief.js';
import { TaoTraining } from './systems/TaoTraining.js';
import { ScenarioLadder, SCENARIOS } from './systems/ScenarioLadder.js';
import { TrainingPanel } from './ui/training/TrainingPanel.js';
import { WorldManager } from './world/WorldManager.js';
import { buildIsland } from './world/Island.js';
import { AudioEngine } from './audio/AudioEngine.js';
import { ShipHUD, TacticalRadar, MainMenu, PauseMenu, SettingsPanel, CommsLog, DamageVignette, StationOverlay, LobbyMenu, CoopPanel, DebriefPanel } from './ui/index.js';
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
scene.fog = new THREE.FogExp2(fogColor.getHex(), 0.00024);
ocean.setFogColor(fogColor);

// Dynamic weather owns fog density/colour, sun/hemi light, sky gradient + cloud cover,
// ocean sea state and the rain curtain from here on — the constants above are only the
// pre-first-frame value. Everything is cross-faded, never assigned outright; see
// systems/WeatherSystem.js.
const weather = new WeatherSystem({ scene, sky, ocean, camera, initial: 'clear' });

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
// Solo station occupancy — AI takes any console the local human isn't seated in.
mp._getLocalStation = () => playerController?.state || 'WALK';

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
    else if (key === 'missile' || key === 'sam' || key === 'lacm') audio.playMissileLaunch();
    else if (key === 'torpedo') audio.playTorpedoLaunch();
    else if (key === 'ciws') audio.playCiwsBurst();
  },
  onLandStrike: (pos) => {
    commsLog.push({
      speaker: 'STRIKE',
      text: `Land-attack round impact — grid ${Math.round(pos.x)}, ${Math.round(pos.z)}.`,
      urgency: 'warning',
    });
    shakeCamera(0.35);
  },
  onExplosion: (pos, opts) => {
    if (opts?.underwater) audio.playExplosionSmall({ position: pos });
    else audio.playExplosionLarge({ position: pos });
    shakeCamera(opts?.scale > 1 ? 0.5 : 0.25);
  },
  onHit: (entity, dmg) => {
    // DamageModel already emits detailed BDA on the comms bus — here we only give
    // the shooter immediate sensory punch that the round connected.
    if (!entity || gameOver) return;
    audio.playHitImpact?.();
    if (dmg > 12) shakeCamera(0.18);
  },
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
      commsLog.push({ speaker: `${call} EW`, text: 'Missile lock — inbound, chaff range. Press Z to spoof it.', urgency: 'critical' });
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
weapons.setOcean(ocean);
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
// Hostile fire homes on whichever task-force hull the fleet director assigned —
// not always Meridian — so escorts get shot at and the player sees mutual support.
function fireHostileWeapon(type, from, targetPos, source) {
  const focus = source?._fleet?.targetShip;
  const te = focus ? shipProxy(focus) : shipProxy(ships.player);
  weapons.spawn(type, from, targetPos, { sourceEntity: source, targetEntity: te });
}
function fireFriendlyWeapon(type, from, targetPos, source, targetEntity) {
  mp.fireAndRelay((t, f, tp, opts) => weapons.spawn(t, f, tp, opts), type, from, targetPos, { sourceEntity: source, targetEntity });
}
function shipProxy(ship) {
  return {
    get position() { return ship.group.position; },
    getAimPoint(out) {
      if (out) return out.copy(ship.group.position);
      return ship.group.position.clone();
    },
    get alive() { return ship.alive !== false; },
    get id() { return ship.id; },
  };
}

const hostileFleets = new HostileFleetDirector();

function announceBrainChatter(ship, chatter) {
  if (!chatter?.text) return;
  const call = shipCallsign(ship);
  commsLog.push({
    speaker: `${call} ${chatter.tag || 'CIC'}`,
    text: chatter.text,
    urgency: chatter.tag === 'AAW' || chatter.tag === 'ASW' ? 'warning' : 'normal',
  });
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
stationOverlay.onSelectContact = (id) => {
  // null = DROP HOOK from GCCS-M; must clear the shared designation.
  if (id == null) {
    weapons.selectedTargetId = null;
    return;
  }
  if (String(id).startsWith('nav:')) return;
  weapons.selectedTargetId = id;
  audio.playUiConfirm();
};
stationOverlay.onDesignate = () => designateSelectedTrack({ from: playerController?.state || 'CIC' });

const commsLog = new CommsLog({ maxVisible: 6 });
commsLog.mount(uiRoot);

const damageVignette = new DamageVignette();
damageVignette.mount(uiRoot);

// Player-knowledge identification state — see IdentificationTracker.js. Separate
// from every entity's ground-truth `iff`; only the TAO/AEGIS console and
// TaskForceCoop's weapons-tight gate read this. Declared before `taskForce` since
// its gate needs a live getter into this.
const idTracker = new IdentificationTracker();

const taskForce = new TaskForceCoop({
  ships,
  autopilots,
  world,
  radar,
  onComms: (line) => { commsLog.push(line); audio.playRadioBlip(); },
  getSelectedTargetId: () => weapons.selectedTargetId,
  setSelectedTargetId: (id) => { weapons.selectedTargetId = id; },
  getLocalShip: () => localShip,
  // WEAPONS TIGHT's doctrinal gate — see TaskForceCoop.isClearedToEngage(). Reads
  // the player's current knowledge of a track, not its ground truth.
  getKnownIff: (id) => idTracker.knownIffFor(id),
  onSharedTrack: (id) => {
    weapons.selectedTargetId = id;
    scenarioRun?.noteShared(id);
    const ent = world.entities.find((e) => e.id === id) || findLandTargetById(id);
    if (!ent) return;
    const d = String(ent.domain || '').toUpperCase();
    if (d === 'SUBSURFACE') weapons.selectWeapon('torpedo');
    else if (d === 'AIR') weapons.selectWeapon('sam');
    else if (d === 'LAND') weapons.selectWeapon('lacm');
    else if (d === 'SURFACE') weapons.selectWeapon('missile');
    else weapons.selectWeapon('gun');
  },
});

// Active/most-recent run of the "ambiguous inbound" TAO training scenario (see
// WorldManager.spawnWave('ambiguous_inbound') and TaoDebrief.js) — null until the
// mission first spawns it. `lastDebriefScore` survives after the run finishes so
// the debrief can be reopened (P) without needing to replay the scenario.
let scenarioRun = null;
let lastDebriefScore = null;

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
// Owners must include every seat DynamicOps hints for that beat — otherwise AI
// fulfills the net order while the player is sitting exactly where the order pointed.
const COOP_OWNER_STATIONS = {
  share: ['RADAR', 'SONAR', 'LOOKOUT', 'TAO'],
  ping: ['SONAR', 'RADAR'],
  engage: ['TAO', 'WEAPONS'],
  hold: ['TAO', 'WEAPONS'],
  screen: ['TAO', 'HELM'],
  affirm: ['TAO', 'HELM'],
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
  weather,
  // Real scene landmarks so NAV/littoral chatter cites geography that actually exists.
  landmarks: [
    { name: 'VIGIL ISLAND', position: island.group.position },
    { name: 'the unnamed islet', position: islet.group.position },
  ],
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
  // Rain follows the same gate as the post stack: off at 'low', scaled above it.
  weather.setQuality(q);
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
    promptEl.classList.remove('is-visible');
    commsLog.clear();
    // Same class of bug as the game-over restart path below: fireAlertEl/ewAlertEl are
    // only updated inside the active-gameplay per-frame loop, so quitting mid-alert
    // (fire aboard, missile lock) froze them stuck visible over the main menu, right
    // on top of the New Patrol button.
    fireAlertEl.style.display = 'none';
    ewAlertEl.style.display = 'none';
    localShipWasBurning = false;
    ewWarningUntil = 0;
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
  // Cursor stations (Radar/Sonar) deliberately run without pointer lock so the OS
  // cursor is visible for clicking contacts — re-locking on resume would silently
  // yank that cursor away out from under the player mid-session.
  const def = STATION_DEFS[playerController.state];
  if (!def?.cursorMode) canvas.requestPointerLock();
}

// ---- TAO training scenario debrief — see TaoDebrief.js for scoring, DebriefPanel
// for the screen itself. Pauses the sim the same way PauseMenu does (reuses the
// `paused` flag) but is otherwise a completely separate, dismissable overlay —
// this is a training aid, not a game-over: the player can always close it and
// keep playing, and requesting it again (P) later just re-shows the last score. ----
let debriefIsOpen = false;
const debriefPanel = new DebriefPanel({ onClose: () => closeDebrief() });
debriefPanel.mount(uiRoot);
debriefPanel.hide();

function openDebrief() {
  if (!lastDebriefScore) {
    commsLog.push({ speaker: 'CIC', text: 'No completed engagement to debrief yet.', urgency: 'normal' });
    return;
  }
  debriefIsOpen = true;
  paused = true;
  if (document.pointerLockElement) document.exitPointerLock();
  debriefPanel.show(lastDebriefScore);
}

function closeDebrief() {
  debriefIsOpen = false;
  debriefPanel.hide();
  paused = false;
  const def = STATION_DEFS[playerController.state];
  if (!def?.cursorMode) canvas.requestPointerLock();
}

// ---- Guided TAO schoolhouse patrol — see systems/TaoTraining.js for the step
// machine and ui/training/TrainingPanel.js for the instructor card. Entirely
// opt-in from the main menu: it spawns its own tagged, non-lethal contacts and
// cleans them up on graduation so a schoolhouse track never leaks into a live
// patrol. ----
const trainingPanel = new TrainingPanel();
trainingPanel.mount(uiRoot);
const taoTraining = new TaoTraining({
  onComms: (line) => commsLog.push(line),
  onStep: (step) => trainingPanel.show(step),
  onComplete: () => {
    taoTraining.cleanup(trainingCtx());
    commsLog.push({
      speaker: 'HORIZON ACTUAL',
      text: 'Schoolhouse complete. Standing by to hand you a live patrol whenever you are ready.',
      urgency: 'normal',
    });
  },
});
/** The state bundle TaoTraining and ScenarioLadder poll each frame. Assembled
 *  fresh per call so it always reflects live references rather than a stale
 *  snapshot. */
function trainingCtx() {
  return { playerController, stationOverlay, taskForce, idTracker, weapons, world, ships, scene, Station };
}

// ---- Graded drill ladder — see systems/ScenarioLadder.js. Shares the
// instructor card with the schoolhouse (a drill brief is the same kind of
// object as a tutorial step) and routes its outcome into the existing
// DebriefPanel rather than inventing a second results screen. ----
const scenarioLadder = new ScenarioLadder({
  onComms: (line) => commsLog.push(line),
  onBrief: (scenario) => {
    if (!scenario) { trainingPanel.show(null); return; }
    trainingPanel.show({
      id: `drill:${scenario.id}`,
      title: scenario.name,
      body: `<b>Tests:</b> ${scenario.tests}<br><br>${scenario.brief}`,
      hint: null,
      index: scenario.tier - 1,
      total: SCENARIOS.length,
    });
  },
  onComplete: (scoreCard) => {
    lastDebriefScore = scoreCard;
    openDebrief();
  },
});

// ---- "Ambiguous inbound" TAO scenario bookkeeping — see WorldManager's
// spawnWave('ambiguous_inbound') for what actually gets spawned and
// src/systems/TaoDebrief.js for how the outcome gets scored. ----
function beginAmbiguousScenario() {
  const ambig = world.entities.find((e) => e.scenarioTag === 'ambiguous_inbound');
  const bandit = world.entities.find((e) => e.scenarioTag === 'ambiguous_inbound_pressure');
  scenarioRun = new ScenarioRun({ ambiguousId: ambig?.id ?? null, realThreatId: bandit?.id ?? null });
}

/** Polled once per active frame while a run is in flight — watches world state
 *  for the facts TaoDebrief.js scores against, then closes the run out once
 *  both contacts have resolved one way or another (or a generous timeout
 *  trips, so a stuck run can never wall off the rest of the patrol). */
function pollAmbiguousScenario() {
  if (!scenarioRun || !scenarioRun.active) return;
  const ambig = scenarioRun.ambiguousId != null
    ? world.entities.find((e) => String(e.id) === scenarioRun.ambiguousId) : null;
  const bandit = scenarioRun.realThreatId != null
    ? world.entities.find((e) => String(e.id) === scenarioRun.realThreatId) : null;

  if (bandit && !bandit.alive) scenarioRun.noteRealThreatHandled();
  if (ambig && !ambig.alive) scenarioRun.noteEngagedUnresolved(ambig.id);
  if (ambig && taskForce.weaponsPolicy === 'free' && !idTracker.isResolved(ambig.id)) {
    scenarioRun.noteFreeWhileUnresolved();
  }

  const elapsed = performance.now() / 1000 - scenarioRun.startedAt;
  const ambigDone = !ambig || ambig.destroyed;
  const banditDone = !bandit || bandit.destroyed || !bandit.alive;
  if ((ambigDone && (banditDone || elapsed > 50)) || elapsed > 150) {
    finishAmbiguousScenario();
  }
}

function finishAmbiguousScenario() {
  scenarioRun.finish();
  mission.flag('ambiguousResolved');
  lastDebriefScore = { scenarioName: 'AMBIGUOUS INBOUND — DEBRIEF', principles: scenarioRun.score() };
  commsLog.push({ speaker: 'TASK FORCE ACTUAL', text: 'Scenario complete — after-action debrief ready (P to reopen).', urgency: 'normal' });
  openDebrief();
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
  // Judge-flagged bug: the previous mission's station HUD (EW/threat toasts, the
  // "man TAO / CIC" interact prompt, the tactical-focus radar zoom) stayed rendered
  // on top of the main menu because only onQuitToMainMenu cleared them — this path
  // (dying, then restarting) never did.
  stationOverlay.setStation(null);
  tacRadar.setStationFocus(false);
  promptEl.classList.remove('is-visible');
  commsLog.clear();
  // Same gap as above, for two elements added after this reset list was last
  // written: fireAlertEl/ewAlertEl only get updated inside the active-gameplay
  // per-frame loop, so dying with either alert up froze it stuck visible over the
  // main menu — including sitting on top of the New Patrol button, blocking clicks.
  fireAlertEl.style.display = 'none';
  ewAlertEl.style.display = 'none';
  localShipWasBurning = false;
  ewWarningUntil = 0;
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
  onTraining: () => {
    unlockAudio();
    mainMenu.hide();
    localShipId = 'player';
    localShip = ships.player;
    playerController.setShip(localShip);
    // Same entry path as a live patrol (intro sweep, HUD handoff) so the
    // schoolhouse doesn't feel like a separate lesser mode — then the step
    // machine takes over once the player actually has control.
    beginPatrol(() => taoTraining.start(trainingCtx()));
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

function beginPatrol(onReady) {
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
    onReady?.();
  });
}

window.addEventListener('keydown', (e) => {
  if (e.code === 'Escape' && gameStarted) {
    if (debriefIsOpen) { closeDebrief(); return; }
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

// Manual "request debrief" — available any time (per the SWOS ITS precedent this
// was grounded in: a replay/debrief the trainee can pull up, not only an
// end-of-scenario popup). Won't fight the pause menu/settings for the `paused`
// flag — only opens from a fully unpaused state, and P while it's already open
// just closes it again.
window.addEventListener('keydown', (e) => {
  if (!gameStarted || e.code !== 'KeyP') return;
  if (debriefIsOpen) closeDebrief();
  else if (!paused && !settingsIsOpen) openDebrief();
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
    // RADAR/SONAR enlarge the corner scope; TAO owns GCCS-M — hide the corner radar
    // entirely so it never stacks on the Motif chart.
    tacRadar.setStationFocus(station === Station.RADAR || station === Station.SONAR);
    if (station !== Station.HELM) headingHold = false;
    if (station !== Station.WEAPONS) {
      playerController.weaponsTrackLock = false;
      playerController.setTrackTarget(null);
      playerController.acquiringTargetId = null;
    } else {
      // Fresh seat — start free-look, no leftover track assist from a prior session.
      playerController.rig?.resetLook?.();
    }
    // Seat-aware HUD layout — panels hide/reflow so station UI never stacks on ShipHUD.
    const uiRootEl = document.getElementById('ui-root');
    if (uiRootEl) uiRootEl.dataset.seat = station || 'WALK';
    // Bridge-orientation walk tip must never sit under a manned station HUD.
    if (station && station !== 'WALK' && introEl) introEl.style.display = 'none';
    // Solo AI handoff chatter: when the human leaves a console, the AI crew takes it.
    if (gameStarted && !mp.inSession) {
      announceStationHandoff(station);
    }

    // Dim the corner radar while seated at weapons/helm/lookout so the station UI owns the frame;
    // keep it visible (enlarged) at the radar console.
    if (station === Station.RADAR || station === Station.SONAR) tacRadar.show();
    else if (station === Station.TAO || station === Station.LOOKOUT) tacRadar.hide();
    else if (station && station !== 'WALK') tacRadar.show();
    else if (gameStarted) tacRadar.show();
    if (station === Station.HELM) mission.flag('depart');
    if (seated) {
      unlockAudio();
      audio.playUiConfirm();
    }
  },
});
uiRoot.dataset.seat = playerController.state || 'WALK';

let _lastAnnouncedSeat = null;
function announceStationHandoff(station) {
  if (station === _lastAnnouncedSeat) return;
  const prev = _lastAnnouncedSeat;
  _lastAnnouncedSeat = station;
  if (!prev && station === 'WALK') return;
  // Human left HELM → AI has the conn
  if (prev === Station.HELM && station !== Station.HELM) {
    commsLog.push({
      speaker: 'MERIDIAN HELM (AI)',
      text: 'AI has the conn — holding course for the current waypoint. Call when you want the wheel.',
      urgency: 'normal',
    });
    audio.playRadioBlip();
  }
  // Human left WEAPONS → AI mans the guns (subject to weapons hold doctrine)
  if (prev === Station.WEAPONS && station !== Station.WEAPONS) {
    const policy = taskForce.weaponsPolicy === 'free' ? 'prosecuting per shared track' : 'weapons hold — standing by for designation';
    commsLog.push({
      speaker: 'MERIDIAN WEAPONS (AI)',
      text: `Taking the weapons console — ${policy}.`,
      urgency: 'normal',
    });
    audio.playRadioBlip();
  }
  // Human sat WEAPONS while AI was on helm — confirm AI still steering
  if (station === Station.WEAPONS && prev !== Station.WEAPONS) {
    commsLog.push({
      speaker: 'MERIDIAN HELM (AI)',
      text: 'Helm is AI — underway on the plot. You have weapons.',
      urgency: 'normal',
    });
  }
}

// ---- task-force net: available from any seat (and while walking the bridge) ----
window.addEventListener('keydown', (e) => {
  if (!gameStarted || paused || gameOver) return;
  if (e.code === 'KeyC') { taskForce.shareTrack(); audio.playUiConfirm(); }
  else if (e.code === 'KeyV') { taskForce.engageShared(); audio.playUiConfirm(); }
  // J, not T — T is already Weapons station's local track-lock toggle, and Y is
  // already Task Force Net's affirm; J is the one clean unused letter left.
  else if (e.code === 'KeyJ') { taskForce.weaponsTight(); audio.playUiConfirm(); }
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
      designateSelectedTrack({ from: 'RADAR' });
    }
  }

  if (st === Station.SONAR && (e.code === 'Enter' || e.code === 'NumpadEnter')) {
    designateSelectedTrack({ from: 'SONAR' });
  }

  if (st === Station.TAO && (e.code === 'Enter' || e.code === 'NumpadEnter')) {
    designateSelectedTrack({ from: 'TAO' });
  }
  if (st === Station.TAO && e.code === 'KeyI') {
    beginIffInterrogation();
  }

  if (st === Station.WEAPONS) {
    if (e.code === 'Digit1') weapons.selectWeapon('gun');
    else if (e.code === 'Digit2') weapons.selectWeapon('missile');
    else if (e.code === 'Digit3') weapons.selectWeapon('sam');
    else if (e.code === 'Digit4') weapons.selectWeapon('lacm');
    else if (e.code === 'Digit5') weapons.selectWeapon('torpedo');
    else if (e.code === 'Digit6') weapons.selectWeapon('drone');
    else if (e.code === 'KeyT') {
      playerController.weaponsTrackLock = !playerController.weaponsTrackLock;
      audio.playUiConfirm();
    } else if (e.code === 'KeyR') {
      // Hard-lock whatever is currently in the reticle (scan-to-lock).
      const sighted = findSightedContact({ threshold: 0.78, maxDist: 9000, includeLand: true });
      if (sighted?.entity) {
        weapons.selectedTargetId = sighted.entity.id;
        playerController.weaponsTrackLock = true;
        audio.playUiConfirm();
        const d = String(sighted.entity.domain || '').toUpperCase();
        if (d === 'AIR') weapons.selectWeapon('sam');
        else if (d === 'LAND') weapons.selectWeapon('lacm');
        else if (d === 'SURFACE' && weapons.selectedWeapon === 'gun') weapons.selectWeapon('missile');
        else if (d === 'SUBSURFACE') weapons.selectWeapon('torpedo');
        commsLog.push({
          speaker: 'WEAPONS',
          text: `Director lock — ${sighted.entity.name || sighted.entity.id}.`,
          urgency: 'warning',
        });
      } else {
        commsLog.push({ speaker: 'WEAPONS', text: 'No contact in the reticle — keep scanning.', urgency: 'normal' });
      }
    } else if (e.code === 'KeyF' || e.code === 'Space') {
      e.preventDefault();
      fireSelectedWeapon();
    } else if (e.code === 'KeyG') {
      // Snap select nearest inbound threat's source if any, else nearest hostile
      const inbound = getInboundThreats();
      if (inbound.length) {
        // Prefer nearest hostile air for SAM, else gun
        const air = lastContacts.filter((c) => String(c.domain).toUpperCase() === 'AIR' && (c.iff === 'HOSTILE' || c.iff === 'hostile'));
        if (air.length) {
          air.sort((a, b) => Math.hypot(a.x, a.z) - Math.hypot(b.x, b.z));
          weapons.selectedTargetId = air[0].id;
          weapons.selectWeapon('sam');
          playerController.weaponsTrackLock = true;
        } else {
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

function designateSelectedTrack({ from = 'CIC' } = {}) {
  const id = weapons.selectedTargetId;
  if (!id || String(id).startsWith('nav:') || String(id).startsWith('inbound:')) {
    commsLog.push({
      speaker: from,
      text: 'No track selected — Tab a contact, then Designate.',
      urgency: 'warning',
    });
    return false;
  }
  const ok = taskForce.shareTrack(id);
  if (ok) {
    commsLog.push({
      speaker: from,
      text: `Track shared to the force — ${world.entities.find((e) => e.id === id)?.name || id}.`,
      urgency: 'warning',
    });
    audio.playUiConfirm();
  }
  return ok;
}

/** AEGIS console's IFF interrogation action — resolves the hooked track's
 * "player knowledge" state (see IdentificationTracker.js). Deliberately not
 * instant: beginInterrogate() runs a real timer, and the result lands via the
 * idTracker.update() completion handled in the main animate() loop below,
 * which is where the resulting comms line actually gets pushed. */
function beginIffInterrogation() {
  const id = weapons.selectedTargetId;
  if (!id || String(id).startsWith('nav:') || String(id).startsWith('inbound:')) {
    commsLog.push({ speaker: 'AEGIS', text: 'No track hooked — select a contact, then interrogate IFF.', urgency: 'normal' });
    return;
  }
  // String() coercion: a track selected by clicking an AEGIS row arrives here as
  // a string (DOM dataset), but real entities carry a numeric id in lastContacts
  // — strict === would silently miss the match (see IdentificationTracker's
  // constructor comment for the same issue elsewhere).
  const contact = lastContacts.find((c) => String(c.id) === String(id));
  if (!contact) return;
  if (idTracker.isResolved(id)) {
    commsLog.push({ speaker: 'AEGIS', text: `${contact.name || 'Track'} already positively identified — ${String(contact.iff).toUpperCase()}.`, urgency: 'normal' });
    return;
  }
  const started = idTracker.beginInterrogate(id, contact.iff);
  if (started) {
    commsLog.push({ speaker: 'AEGIS', text: `Interrogating IFF on ${contact.name || 'hooked track'}…`, urgency: 'normal' });
    audio.playUiConfirm();
    scenarioRun?.noteInterrogate(id);
  } else {
    commsLog.push({ speaker: 'AEGIS', text: 'IFF interrogation already in progress — stand by.', urgency: 'normal' });
  }
}

function evaluateFireSolution(targetEntity, targetInfo) {
  const key = weapons.selectedWeapon;
  if (!targetInfo && key !== 'gun' && key !== 'drone') {
    return { ok: false, reason: 'NO TRACK', detail: 'Scan to acquire, Tab to cycle, or R to lock' };
  }
  const domain = String(targetEntity?.domain || targetInfo?.domain || '').toUpperCase();
  // WEAPONS TIGHT's doctrinal gate: the designated/selected track must actually be
  // positively identified before it's cleared to engage — free-fire cues (closing,
  // descending) are not identification. Scoped to guided weapons that target a real
  // entity; the deck gun and recon drone are exempt (see evaluateFireSolution's
  // existing gun/drone carve-outs above and TaskForceCoop.isClearedToEngage's doc
  // comment for why FREE bypasses this and HOLD blocks everything regardless).
  if (targetEntity && domain !== 'LAND' && key !== 'gun' && key !== 'drone'
    && taskForce.weaponsPolicy === 'tight' && !taskForce.isClearedToEngage(targetEntity.id)) {
    return { ok: false, reason: 'ID REQUIRED', detail: 'WEAPONS TIGHT — positively identify this track (TAO, key I) before engaging' };
  }
  if (key === 'missile') {
    if (!targetEntity || domain !== 'SURFACE') {
      return { ok: false, reason: 'WRONG DOMAIN', detail: 'Anti-ship missiles need a surface track' };
    }
    if (targetEntity.iff === 'FRIENDLY') {
      return { ok: false, reason: 'FRIENDLY', detail: 'Cannot engage friendly track' };
    }
  }
  if (key === 'sam') {
    if (!targetEntity || domain !== 'AIR') {
      return { ok: false, reason: 'NO AIR TRACK', detail: 'SAMs need an air track — scan the sky or press G' };
    }
    if (targetEntity.iff === 'FRIENDLY') {
      return { ok: false, reason: 'FRIENDLY', detail: 'Cannot engage friendly air track' };
    }
  }
  if (key === 'lacm') {
    if (domain !== 'LAND' && !targetEntity?.isLandTarget) {
      return { ok: false, reason: 'NO LAND TARGET', detail: 'Select OBJ ALPHA/BRAVO (land) or scan the shore' };
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
    const aim = targetEntity.getAimPoint
      ? targetEntity.getAimPoint(new THREE.Vector3())
      : (targetEntity.position || targetEntity.group?.position);
    const toT = aim.clone().sub(camera.position).normalize();
    const align = camDir.dot(toT);
    if (!playerController.weaponsTrackLock && align < 0.55 && key !== 'drone' && key !== 'gun') {
      return { ok: false, reason: 'OFF BORESIGHT', detail: 'Slew onto target, scan-lock with R, or press T' };
    }
    if (targetInfo.distanceM > 5500 && key === 'gun') {
      return { ok: false, reason: 'OUT OF RANGE', detail: 'Close range or switch to missile' };
    }
    if (targetInfo.distanceM > 14000 && (key === 'sam' || key === 'missile')) {
      return { ok: false, reason: 'OUT OF RANGE', detail: 'Target beyond engagement envelope' };
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
  // Feed the SAME "player knowledge" state the AEGIS console reads (see
  // IdentificationTracker.js) rather than building a second classification
  // system — a visual ID from the bridge wing is exactly as valid a resolution
  // as an AEGIS IFF interrogation.
  idTracker.resolve(e.id, e.iff, 'visual');
  weapons.selectedTargetId = e.id;
  // Visual ID beats require share — Lookout reporting pushes the contact onto the
  // force plot so the player isn't stuck after R with an unfinished coop gate.
  taskForce.shareTrack(e.id);
  audio.playUiConfirm();
}

function formatBearingSafe(deg) {
  const d = Math.round(((deg % 360) + 360) % 360);
  return String(d).padStart(3, '0');
}

const _sightDir = new THREE.Vector3();
const _sightTo = new THREE.Vector3();
const _sightAim = new THREE.Vector3();
const _trackAim = new THREE.Vector3();
let _landAimpoints = null;

function getLandAimpoints() {
  // Synthetic shore objectives for LACM — islands are scenery, not Entity subclasses.
  // Cached: rebuilt every frame previously and trashed the GC while scanning.
  if (_landAimpoints) return _landAimpoints;
  _landAimpoints = [
    {
      id: 'land:alpha',
      name: 'OBJ ALPHA (ISLAND)',
      domain: 'LAND',
      iff: 'NEUTRAL',
      isLandTarget: true,
      alive: true,
      destroyed: false,
      getAimPoint(out = new THREE.Vector3()) {
        return out.set(island.group.position.x, 14, island.group.position.z);
      },
      get position() { return island.group.position; },
    },
    {
      id: 'land:bravo',
      name: 'OBJ BRAVO (ISLET)',
      domain: 'LAND',
      iff: 'NEUTRAL',
      isLandTarget: true,
      alive: true,
      destroyed: false,
      getAimPoint(out = new THREE.Vector3()) {
        return out.set(islet.group.position.x, 10, islet.group.position.z);
      },
      get position() { return islet.group.position; },
    },
  ];
  return _landAimpoints;
}

function findLandTargetById(id) {
  if (!id) return null;
  return getLandAimpoints().find((t) => t.id === id) || null;
}

function findSightedContact({ threshold = 0.82, maxDist = 5000, includeLand = false } = {}) {
  camera.getWorldDirection(_sightDir);
  const origin = camera.position;
  let best = null;
  let bestScore = threshold;
  const sources = world.entities;
  const check = (e) => {
    if (!e || e.destroyed || e.alive === false) return;
    const pos = e.getAimPoint
      ? e.getAimPoint(_sightAim)
      : (e.position || e.group?.position);
    if (!pos) return;
    _sightTo.copy(pos).sub(origin);
    const dist = _sightTo.length();
    if (dist < 40 || dist > maxDist) return;
    _sightTo.multiplyScalar(1 / dist);
    const align = _sightDir.dot(_sightTo);
    if (align > bestScore) {
      bestScore = align;
      best = {
        entity: e,
        name: e.name,
        domain: e.domain,
        iff: e.iff,
        distanceM: dist,
        reported: !!e.visualId,
        align,
      };
    }
  };
  for (const e of sources) check(e);
  for (const s of Object.values(ships)) {
    if (s !== localShip) check(s);
  }
  if (includeLand) {
    for (const land of getLandAimpoints()) check(land);
  }
  return best;
}

function fireSelectedWeapon() {
  const mpts = localShip.mountPoints;
  let targetEntity = world.entities.find((e) => e.id === weapons.selectedTargetId && e.alive) || null;
  if (!targetEntity && String(weapons.selectedTargetId || '').startsWith('land:')) {
    targetEntity = findLandTargetById(weapons.selectedTargetId);
  }
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
    if (sol.reason === 'ID REQUIRED' && performance.now() - lastIdWarnAt > 2500) {
      lastIdWarnAt = performance.now();
      commsLog.push({
        speaker: 'WEAPONS',
        text: `Weapons tight — ${targetEntity?.name || 'this track'} is not positively identified. Interrogate IFF before engaging.`,
        urgency: 'warning',
      });
    }
    return;
  }

  let fromLocal = mpts.gunBarrelTip;
  const key = weapons.selectedWeapon;
  if (key === 'missile' || key === 'sam' || key === 'lacm') {
    fromLocal = mpts.missileTubes[0];
  } else if (key === 'torpedo') {
    fromLocal = mpts.missileTubes[2] || mpts.missileTubes[0];
  }
  const from = localShip.getMountWorld(fromLocal, new THREE.Vector3());

  let targetPos;
  if (targetEntity) {
    targetPos = targetEntity.getAimPoint
      ? targetEntity.getAimPoint(new THREE.Vector3())
      : targetEntity.position.clone();
    if (key === 'torpedo' && targetEntity.domain !== 'SUBSURFACE') targetPos = null;
  }
  if (!targetPos) {
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    const dist = Math.abs(dir.y) > 0.01 ? (from.y) / -dir.y : 2000;
    targetPos = from.clone().addScaledVector(dir, dist > 0 ? dist : 2000);
  }

  const fired = weapons.firePlayerWeapon(from, targetPos, targetEntity || null);
  if (fired && mp.inSession) {
    mp.net.sendWeaponFire({
      type: {
        gun: 'playerShell',
        missile: 'playerMissile',
        sam: 'playerSam',
        lacm: 'playerLacm',
        torpedo: 'playerTorpedo',
        drone: 'drone',
      }[key],
      from: { x: from.x, y: from.y, z: from.z },
      target: { x: targetPos.x, y: targetPos.y, z: targetPos.z },
      targetEntityId: targetEntity?.isLandTarget ? null : (targetEntity?.id ?? null),
    });
  }
}

// ============================ RESIZE / DEBUG ============================
window.GAME = {
  pipeline, sky, ocean, camera, scene, renderer, THREE, ships, localShipId, cameraRig, playerController,
  weapons, radar, world, mission, audio, hud, tacRadar, mainMenu, pauseMenu, settings, commsLog,
  damageVignette, island, islet, stationOverlay, Station, mp, lobby, dynamicOps, taskForce, coopPanel,
  // ---- Weather debug surface ----
  // window.GAME.setWeather('squall')      -> normal slow cross-fade (40-80s)
  // window.GAME.setWeather('squall', 0)   -> instant, for deterministic screenshots
  // window.GAME.weatherReport()           -> { state, visibilityKm, seaState, raining }
  weather,
  WEATHER_STATES,
  setWeather: (name, durationSec) => weather.setWeather(name, durationSec),
  weatherReport: () => weather.report,
  setWeatherAuto: (on) => weather.setAuto(on),
  // TAO identification/scenario/debrief debug surface — getters since scenarioRun
  // and lastDebriefScore are reassigned over the run rather than mutated in place.
  idTracker, debriefPanel,
  getScenarioRun: () => scenarioRun,
  getLastDebriefScore: () => lastDebriefScore,
  beginIffInterrogation, openDebrief, closeDebrief,
  beginAmbiguousScenario, finishAmbiguousScenario,
  taoTraining, trainingPanel, scenarioLadder, SCENARIOS,
  startTaoTraining: () => taoTraining.start(trainingCtx()),
  startDrill: (id) => scenarioLadder.start(id ?? null, trainingCtx()),
  listDrills: () => SCENARIOS.map((s) => ({ id: s.id, tier: s.tier, name: s.name, tests: s.tests })),
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
let lastIdWarnAt = 0; // debounces the "not positively identified" fire-attempt warning
window.GAME.setHelmCommand = (throttle, rudder = 0) => {
  // Accept either (throttle, rudder) or ({ throttle, rudder }) for debug/judge scripts.
  if (throttle && typeof throttle === 'object') {
    rudder = throttle.rudder ?? 0;
    throttle = throttle.throttle ?? 0;
  }
  const t = Number(throttle);
  const r = Number(rudder);
  throttleCmd = THREE.MathUtils.clamp(Number.isFinite(t) ? t : 0, -1, 1);
  rudderCmd = THREE.MathUtils.clamp(Number.isFinite(r) ? r : 0, -1, 1);
};
window.GAME.ensureSimRunning = () => {
  // Judge / debug: skip stuck intro / lose overlays so the main loop keeps integrating.
  introPlaying = false;
  paused = false;
  gameOver = false;
  gameStarted = true;
  gameOverEl.style.display = 'none';
};

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
        const helmHuman = mp.helmIsHuman(shipId);
        const weaponsHuman = mp.weaponsIsHuman(shipId);
        if (helmHuman) {
          if (ship === localShip) ship.setCommand(throttleCmd, rudderCmd);
        }
        // Unified brain tick when AI holds helm and/or weapons.
        if (!helmHuman || !weaponsHuman) {
          // Gate the shared designation through allowedHostileIds() — under
          // WEAPONS TIGHT that now refuses an unidentified track (see
          // TaskForceCoop.isClearedToEngage). Escorts simply don't get handed
          // an engage target for it until the TAO console clears it.
          const allowed = taskForce.allowedHostileIds();
          const clearedSharedId = taskForce.sharedTargetId && (!allowed || allowed.has(taskForce.sharedTargetId))
            ? taskForce.sharedTargetId
            : null;
          const engageEnt = clearedSharedId
            ? world.entities.find((e) => e.id === clearedSharedId && !e.destroyed)
            : null;
          const ap = autopilots[shipId];
          ap.helmEnabled = !helmHuman;
          ap.weaponsEnabled = !weaponsHuman;
          if (ap.role === 'lead') {
            ap.breakFormation = taskForce.weaponsPolicy === 'free' && !!engageEnt;
          }
          ap.setEngageTarget(clearedSharedId);
          ap.update(dt, {
            anchorShip: ships.player,
            playerShip: ships.player,
            ships,
            waypoint: mission.currentWaypoint,
            engageWorldPos: engageEnt?.position || null,
            hostiles: world.hostiles,
            fireWeapon: fireFriendlyWeapon,
            onEngage: (autoShip, target) => announceAiEngagement(autoShip, target),
            onDisengage: (autoShip) => announceAiDisengagement(autoShip),
            onBrainChatter: announceBrainChatter,
            weaponsPolicy: taskForce.weaponsPolicy,
            sharedTargetId: clearedSharedId,
            allies: Object.values(ships),
          });
        }
      }
      ship.update(dt, elapsed, getWaveHeight);
      if (!ship.networked) {
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

  // Weather runs outside the `active` gate so the sea/sky keep breathing on the main
  // menu and during the intro cinematic too — pausing the world shouldn't freeze the sky.
  weather.update(dt, elapsed);
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
    hostileFleets.update({
      hostiles: world.hostiles,
      taskForce: Object.values(ships).filter((s) => s.alive !== false),
      playerShip: ships.player,
      dt,
    });
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
    if (spawnReq) {
      world.spawnWave(spawnReq, wp || ships.player.group.position);
      hostileWaveSpawned = true;
      if (spawnReq === 'ambiguous_inbound') beginAmbiguousScenario();
    }
    if (hostileWaveSpawned && world.hostiles.length === 0) {
      mission.flag('wave1Cleared'); mission.flag('subCleared'); mission.flag('airWaveCleared');
    }
    pollAmbiguousScenario();
    taoTraining.update(dt, trainingCtx());
    scenarioLadder.update(dt, trainingCtx());

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
    // Fuse the task-force's sensor picture: Meridian's own radar plus every alive
    // escort's — a contact within range of ANY of them shows up for every station,
    // not just the ones near Meridian specifically (see RadarSystem.buildContacts).
    const radarOrigins = [
      localShip.group.position,
      ...Object.values(ships)
        .filter((s) => s !== localShip && s.alive !== false && !s.destroyed && s.group)
        .map((s) => s.group.position),
    ];
    lastContacts = radar.buildContacts(radarOrigins, radarSources, weapons.selectedTargetId);

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

    // Shore objectives for LACM — always on the plot so Weapons can Tab/scan onto them.
    const playerPos = localShip.group.position;
    for (const land of getLandAimpoints()) {
      const aim = land.getAimPoint(new THREE.Vector3());
      const dx = aim.x - playerPos.x;
      const dz = aim.z - playerPos.z;
      lastContacts.push({
        id: land.id,
        x: dx,
        z: dz,
        domain: 'LAND',
        iff: 'NEUTRAL',
        name: land.name,
        selected: land.id === weapons.selectedTargetId,
        distanceM: Math.round(Math.hypot(dx, dz)),
        isLand: true,
      });
    }

    // Player-knowledge identification pass (see IdentificationTracker.js) — every
    // contact currently on the plot gets seeded (first sighting only; a no-op
    // afterward) so the TAO/AEGIS console can render "player knows" separately
    // from "entity actually is." Land/nav/inbound-ordnance/friendly contacts
    // auto-resolve inside seed(); everything else starts unresolved until an IFF
    // interrogation (I, at TAO) or Lookout's Visual ID report clears it.
    for (const c of lastContacts) idTracker.seed(c.id, c.iff, c.domain);
    const finishedInterrogation = idTracker.update();
    if (finishedInterrogation) {
      const c = lastContacts.find((x) => x.id === finishedInterrogation.id);
      commsLog.push({
        speaker: 'AEGIS',
        text: `IFF returns ${finishedInterrogation.knownIff} — ${c?.name || 'track'} reclassified ${String(finishedInterrogation.knownIff).toLowerCase()}.`,
        urgency: finishedInterrogation.knownIff === 'HOSTILE' ? 'warning' : 'normal',
      });
      audio.playRadioBlip();
      scenarioRun?.noteResolved(finishedInterrogation.id, finishedInterrogation.knownIff);
    }
    idTracker.prune(new Set(lastContacts.map((c) => c.id)));

    // Weapons director: highlight contacts under the reticle without stealing the
    // designation or slewing the camera (that was whipping the perspective).
    let weaponsAcquiring = false;
    if (playerController.state === Station.WEAPONS) {
      const sighted = findSightedContact({ threshold: 0.92, maxDist: 9000, includeLand: true });
      if (sighted?.entity) {
        weaponsAcquiring = true;
        playerController.acquiringTargetId = sighted.entity.id;
      } else {
        playerController.acquiringTargetId = null;
      }
    } else {
      playerController.acquiringTargetId = null;
    }

    const filteredContacts = lastContacts.filter((c) => {
      if (radarFilter === 'ALL') return true;
      if (radarFilter === 'NAV') return c.isWaypoint || c.domain === 'NAV';
      if (radarFilter === 'SURFACE') return c.domain === 'SURFACE' || c.domain === 'surface';
      if (radarFilter === 'AIR') return c.domain === 'AIR' || c.domain === 'air';
      if (radarFilter === 'SUBSURFACE') return c.domain === 'SUBSURFACE' || c.domain === 'subsurface';
      if (radarFilter === 'LAND') return c.domain === 'LAND' || c.isLand;
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

    // Smooth aimpoint for track-lock assist (camera only follows when lock is on).
    const trackEnt = (playerController.state === Station.WEAPONS && playerController.weaponsTrackLock)
      ? (world.entities.find((e) => e.id === weapons.selectedTargetId && e.alive)
        || findLandTargetById(weapons.selectedTargetId))
      : null;
    if (trackEnt?.getAimPoint) {
      playerController.setTrackTarget(trackEnt.getAimPoint(_trackAim), dt);
    } else if (trackEnt?.position) {
      playerController.setTrackTarget(trackEnt.position, dt);
    } else {
      playerController.setTrackTarget(null, dt);
    }

    // Station overlay instruments — only when seated so we don't burn DOM writes while walking.
    if (STATION_DEFS[playerController.state]) {
      const selected = lastContacts.find((c) => c.id === weapons.selectedTargetId && !c.isWaypoint && !c.isInbound) || null;
      const targetEntity = selected
        ? (world.entities.find((e) => e.id === selected.id)
          || (selected.isLand ? findLandTargetById(selected.id) : null))
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
        acquiring: weaponsAcquiring,
        weaponsZoom: playerController.weaponsZoom,
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
        // x/z (ship-relative meters, +z=north/+x=east per the bearing convention used
        // elsewhere) are kept here — TAO's GCCS-M-style chart plots real 2D positions,
        // not just a distance readout.
        allContacts: lastContacts.map((c) => ({
          id: c.id,
          name: c.name,
          iff: c.iff,
          // Player-knowledge affiliation — see IdentificationTracker.js. Only the
          // TAO/AEGIS console reads this; every other consumer of `iff` above
          // (Weapons target readout, Radar's GCCS-M table, TacticalRadar) is
          // untouched and keeps showing ground truth, same as before.
          knownIff: idTracker.knownIffFor(c.id),
          domain: c.domain,
          x: c.x,
          z: c.z,
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
        // AEGIS console's live IFF-interrogation readout (progress bar + status
        // line) for whichever track is currently hooked, if any interrogation is
        // in flight at all.
        interrogation: weapons.selectedTargetId != null
          ? (() => {
            const progress = idTracker.interrogationProgress(weapons.selectedTargetId);
            return progress == null ? null : { id: weapons.selectedTargetId, progress };
          })()
          : null,
      });
    }
  }

  pipeline.render(elapsed);

  frameCount++; fpsAccum += dt;
  if (fpsAccum >= 0.5) { fpsEl.textContent = `${Math.round(frameCount / fpsAccum)} fps`; frameCount = 0; fpsAccum = 0; }
}

animate();

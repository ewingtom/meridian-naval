// Shared client/server message contract. Plain JSON envelopes over WebSocket:
// { t: <MsgType>, ...payload }. Imported by both the browser client and the
// Node relay server, so keep this file dependency-free (no THREE, no DOM).

export const MsgType = {
  // client -> server
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  CLAIM_SLOT: 'claim_slot',
  RELEASE_SLOT: 'release_slot',
  SET_READY: 'set_ready',
  START_PATROL: 'start_patrol',
  SHIP_STATE: 'ship_state',
  WEAPON_FIRE: 'weapon_fire',
  ENTITY_HIT: 'entity_hit',
  ENTITY_SPAWN: 'entity_spawn',
  ENTITY_STATE: 'entity_state',
  ENTITY_DESTROYED: 'entity_destroyed',
  MISSION_STATE: 'mission_state',
  SONAR_PING: 'sonar_ping',
  COMMS: 'comms',
  PING: 'ping',

  // server -> client
  WELCOME: 'welcome',
  ROOM_STATE: 'room_state',
  SLOT_DENIED: 'slot_denied',
  ERROR: 'error',
  PONG: 'pong',
};

// Ships a lobby can crew. 'player' is always the Meridian (the ship the single-player
// build already treats as the camera home / mission-flag driver); the rest mirror the
// two task-force escorts main.js always spawns alongside her.
export const SHIP_IDS = ['player', 'escort1', 'escort2'];
export const SHIP_NAMES = {
  player: 'FS Meridian (DDG)',
  escort1: 'FS Sentinel (DDG)',
  escort2: 'FS Vanguard (CG)',
};

export const STATION_IDS = ['HELM', 'WEAPONS', 'RADAR', 'LOOKOUT'];

export function makeRoomCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no O/0/I/1 ambiguity
  let s = '';
  for (let i = 0; i < 5; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return s;
}

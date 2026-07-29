import { WebSocketServer } from 'ws';
import { randomUUID } from 'node:crypto';
import { MsgType, SHIP_IDS, STATION_IDS, makeRoomCode } from '../src/net/protocol.js';

// ---- Thin relay + arbitration server ----
// Deliberately does NOT simulate ship physics, weapons, or AI — every client runs the
// same world simulation it already runs in single-player. This server's only jobs are:
//   1. lobby bookkeeping (rooms, players, ready state, host designation)
//   2. first-come-first-served station/ship claim arbitration (so two players can't
//      both end up "driving" the same helm)
//   3. broadcasting relay: rebroadcast ship/weapon/entity/mission messages to every
//      other player in the room so each client's local simulation stays in sync.
// One player per room is "host" — the client that runs AI simulation for any
// ship/station nobody has claimed, and broadcasts its results like any other client
// would broadcast its own ship. Host migrates to the next-longest-connected player
// on disconnect so the room never stalls.

class Room {
  constructor(code) {
    this.code = code;
    /** @type {Map<string, Player>} */
    this.players = new Map();
    this.hostId = null;
    this.started = false;
    // slotKey `${shipId}:${station}` -> playerId
    this.slots = new Map();
  }

  broadcast(msg, exceptId = null) {
    const data = JSON.stringify(msg);
    for (const p of this.players.values()) {
      if (p.id === exceptId) continue;
      if (p.ws.readyState === 1) p.ws.send(data);
    }
  }

  send(playerId, msg) {
    const p = this.players.get(playerId);
    if (p && p.ws.readyState === 1) p.ws.send(JSON.stringify(msg));
  }

  roster() {
    return [...this.players.values()].map((p) => ({
      id: p.id, name: p.name, shipId: p.shipId, station: p.station, ready: p.ready,
    }));
  }

  syncAll() {
    this.broadcast({ t: MsgType.ROOM_STATE, code: this.code, hostId: this.hostId, started: this.started, players: this.roster() });
  }

  releaseSlotsFor(playerId) {
    for (const [key, pid] of this.slots) {
      if (pid === playerId) this.slots.delete(key);
    }
  }

  removePlayer(playerId) {
    this.players.delete(playerId);
    this.releaseSlotsFor(playerId);
    if (this.hostId === playerId) {
      const next = this.players.keys().next();
      this.hostId = next.done ? null : next.value;
    }
  }
}

class Player {
  constructor(id, ws, name) {
    this.id = id;
    this.ws = ws;
    this.name = name;
    this.shipId = null;
    this.station = null;
    this.ready = false;
    this.roomCode = null;
  }
}

export function attachWarshipRelay(httpServer, { path = '/ws-relay' } = {}) {
  /** @type {Map<string, Room>} */
  const rooms = new Map();
  const wss = new WebSocketServer({ noServer: true });

  function getOrCreateRoom(code) {
    let room = code && rooms.get(code);
    if (!room) {
      const newCode = code || makeRoomCode();
      room = new Room(newCode);
      rooms.set(newCode, room);
    }
    return room;
  }

  httpServer.on('upgrade', (req, socket, head) => {
    let url;
    try { url = new URL(req.url, 'http://localhost'); } catch { return; }
    if (url.pathname !== path) return; // let other listeners (e.g. Vite HMR) handle it
    wss.handleUpgrade(req, socket, head, (ws) => wss.emit('connection', ws, req));
  });

  wss.on('connection', (ws) => {
    const playerId = randomUUID();
    let player = null;
    let room = null;

    ws.on('message', (raw) => {
      let msg;
      try { msg = JSON.parse(raw.toString()); } catch { return; }

      switch (msg.t) {
        case MsgType.JOIN_ROOM: {
          if (room) return;
          const code = typeof msg.code === 'string' ? msg.code.trim().toUpperCase() : '';
          room = getOrCreateRoom(code || undefined);
          player = new Player(playerId, ws, (msg.name || 'Officer').slice(0, 24));
          player.roomCode = room.code;
          room.players.set(playerId, player);
          if (!room.hostId) room.hostId = playerId;
          ws.send(JSON.stringify({ t: MsgType.WELCOME, playerId, code: room.code }));
          room.syncAll();
          break;
        }
        case MsgType.LEAVE_ROOM: {
          if (!room || !player) return;
          room.removePlayer(playerId);
          room.syncAll();
          room = null; player = null;
          break;
        }
        case MsgType.CLAIM_SLOT: {
          if (!room || !player) return;
          const { shipId, station } = msg;
          if (!SHIP_IDS.includes(shipId) || !STATION_IDS.includes(station)) return;
          const key = `${shipId}:${station}`;
          const heldBy = room.slots.get(key);
          if (heldBy && heldBy !== playerId) {
            room.send(playerId, { t: MsgType.SLOT_DENIED, shipId, station });
            return;
          }
          room.releaseSlotsFor(playerId);
          room.slots.set(key, playerId);
          player.shipId = shipId;
          player.station = station;
          room.syncAll();
          break;
        }
        case MsgType.RELEASE_SLOT: {
          if (!room || !player) return;
          room.releaseSlotsFor(playerId);
          player.shipId = null;
          player.station = null;
          room.syncAll();
          break;
        }
        case MsgType.SET_READY: {
          if (!room || !player) return;
          player.ready = !!msg.ready;
          room.syncAll();
          break;
        }
        case MsgType.START_PATROL: {
          if (!room || !player || player.id !== room.hostId) return;
          room.started = true;
          room.syncAll();
          room.broadcast({ t: MsgType.START_PATROL });
          break;
        }
        case MsgType.SHIP_STATE:
        case MsgType.WEAPON_FIRE:
        case MsgType.ENTITY_HIT:
        case MsgType.ENTITY_SPAWN:
        case MsgType.ENTITY_STATE:
        case MsgType.ENTITY_DESTROYED:
        case MsgType.MISSION_STATE:
        case MsgType.SONAR_PING:
        case MsgType.COMMS: {
          if (!room || !player) return;
          // NOT `msg.from` — weapon_fire already uses `from` for the shot's own
          // {x,y,z} origin, and clobbering it here silently corrupted every relayed
          // shot's firing position down to (0,0,0) on the receiving end.
          msg.senderId = playerId;
          room.broadcast(msg, playerId);
          break;
        }
        case MsgType.PING: {
          ws.send(JSON.stringify({ t: MsgType.PONG, at: msg.at }));
          break;
        }
        default:
          break;
      }
    });

    ws.on('close', () => {
      if (room && player) {
        room.removePlayer(playerId);
        room.syncAll();
        if (room.players.size === 0) rooms.delete(room.code);
      }
    });
  });

  return wss;
}

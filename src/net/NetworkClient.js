import { MsgType } from './protocol.js';

/** Minimal typed pub/sub over a single WebSocket. Keeps the rest of the game decoupled
 * from raw message shapes — callers do `net.on('room_state', cb)` / `net.send(...)`. */
export class NetworkClient {
  constructor() {
    this.ws = null;
    this.playerId = null;
    this.roomCode = null;
    this.hostId = null;
    this.started = false;
    this.players = [];
    this._listeners = new Map();
    this.connected = false;
  }

  on(type, cb) {
    if (!this._listeners.has(type)) this._listeners.set(type, new Set());
    this._listeners.get(type).add(cb);
    return () => this._listeners.get(type)?.delete(cb);
  }

  _emit(type, payload) {
    for (const cb of this._listeners.get(type) || []) cb(payload);
  }

  get isHost() {
    return !!this.playerId && this.playerId === this.hostId;
  }

  get me() {
    return this.players.find((p) => p.id === this.playerId) || null;
  }

  /** Resolves once the socket is open (not once a room is joined). */
  connect(url) {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url);
      this.ws = ws;
      ws.addEventListener('open', () => { this.connected = true; resolve(); });
      ws.addEventListener('error', (e) => { if (!this.connected) reject(e); });
      ws.addEventListener('close', () => {
        this.connected = false;
        this._emit('disconnected', null);
      });
      ws.addEventListener('message', (ev) => {
        let msg;
        try { msg = JSON.parse(ev.data); } catch { return; }
        this._handle(msg);
      });
    });
  }

  _handle(msg) {
    switch (msg.t) {
      case MsgType.WELCOME:
        this.playerId = msg.playerId;
        this.roomCode = msg.code;
        this._emit('welcome', msg);
        break;
      case MsgType.ROOM_STATE:
        this.roomCode = msg.code;
        this.hostId = msg.hostId;
        this.started = msg.started;
        this.players = msg.players;
        this._emit('room_state', msg);
        break;
      case MsgType.SLOT_DENIED:
        this._emit('slot_denied', msg);
        break;
      case MsgType.START_PATROL:
        this.started = true;
        this._emit('start_patrol', msg);
        break;
      default:
        // gameplay relay messages pass through under their own type name
        this._emit(msg.t, msg);
        break;
    }
  }

  send(t, payload = {}) {
    if (!this.ws || this.ws.readyState !== 1) return;
    this.ws.send(JSON.stringify({ t, ...payload }));
  }

  joinRoom(code, name) { this.send(MsgType.JOIN_ROOM, { code, name }); }
  leaveRoom() { this.send(MsgType.LEAVE_ROOM); }
  claimSlot(shipId, station) { this.send(MsgType.CLAIM_SLOT, { shipId, station }); }
  releaseSlot() { this.send(MsgType.RELEASE_SLOT); }
  setReady(ready) { this.send(MsgType.SET_READY, { ready }); }
  startPatrol() { this.send(MsgType.START_PATROL); }

  sendShipState(state) { this.send(MsgType.SHIP_STATE, state); }
  sendWeaponFire(state) { this.send(MsgType.WEAPON_FIRE, state); }
  sendEntityHit(state) { this.send(MsgType.ENTITY_HIT, state); }
  sendEntitySpawn(state) { this.send(MsgType.ENTITY_SPAWN, state); }
  sendEntityState(state) { this.send(MsgType.ENTITY_STATE, state); }
  sendEntityDestroyed(state) { this.send(MsgType.ENTITY_DESTROYED, state); }
  sendMissionState(state) { this.send(MsgType.MISSION_STATE, state); }
  sendSonarPing(state) { this.send(MsgType.SONAR_PING, state); }
  sendComms(state) { this.send(MsgType.COMMS, state); }

  close() {
    if (this.ws) this.ws.close();
  }
}

export function relayUrl() {
  const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${proto}//${location.host}/ws-relay`;
}

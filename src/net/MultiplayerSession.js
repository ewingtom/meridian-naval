import * as THREE from 'three';
import { NetworkClient, relayUrl } from './NetworkClient.js';

/**
 * Sits between the game loop and NetworkClient: answers "who's actually driving this
 * ship/station right now" and handles the periodic state broadcast/replication so the
 * rest of main.js doesn't need to know about sockets. In single-player (no session
 * started) every query answers as if the local client owns everything, so none of this
 * changes solo behavior — multiplayer is strictly additive.
 */
export class MultiplayerSession {
  constructor({ ships, name }) {
    this.ships = ships; // { shipId: CrewedShip }
    this.localName = name;
    this.net = null;
    this.active = false;
    this._sendAccum = 0;
    // Solo play: station occupancy is live (see helmIsHuman / getLocalStation) — Meridian
    // AI takes any console the local human is not currently seated at.
    this.soloShipId = 'player';
    this._getLocalStation = null; // () => Station string — wired from main.js
    this.onRoomState = null; // (players, hostId, code) => void, for the lobby UI
    this.onStartPatrol = null;
    this.onEntitySpawn = null; // (msg) => void — host-authoritative hostile spawns, non-host mirrors
    this.onEntityState = null;
    this.onEntityDestroyed = null;
    this.onMissionState = null; // (msg) => void, non-host mirrors host's mission flags/objective
    this.onDisconnected = null; // () => void — fires only if the connection drops mid-patrol
    this.onComms = null;
    this.onShipHitRemote = null; // (shipId, dmg) => void
    this._weaponSpawners = null; // set by main.js: (type, from, targetPos, opts) => Projectile
  }

  async start({ code, name }) {
    this.net = new NetworkClient();
    await this.net.connect(relayUrl());
    this.localName = name || this.localName;
    this.net.on('room_state', (msg) => this.onRoomState?.(msg));
    this.net.on('start_patrol', () => { this.active = true; this.onStartPatrol?.(); });
    this.net.on('ship_state', (msg) => this._applyRemoteShipState(msg));
    this.net.on('weapon_fire', (msg) => this._applyRemoteWeaponFire(msg));
    this.net.on('entity_hit', (msg) => { if (msg.localTargetShipId) this.onShipHitRemote?.(msg.localTargetShipId, msg.damage); });
    this.net.on('entity_spawn', (msg) => this.onEntitySpawn?.(msg));
    this.net.on('entity_state', (msg) => this.onEntityState?.(msg));
    this.net.on('entity_destroyed', (msg) => this.onEntityDestroyed?.(msg));
    this.net.on('mission_state', (msg) => this.onMissionState?.(msg));
    this.net.on('comms', (msg) => this.onComms?.(msg));
    this.net.on('disconnected', () => {
      // Dropped connection mid-patrol: rather than leaving every ship this client
      // didn't directly control frozen forever at its last received position (still
      // `networked`, with no one left to send updates), fall back to solo semantics —
      // `iSimulateShip` etc. all key off `this.net`, so clearing it makes every ship
      // locally-simulated again. Ships that were remotely driven will just continue
      // from wherever they were, un-crewed, rather than statue-freezing.
      const wasActive = this.active;
      this.net = null;
      this.active = false;
      if (wasActive) this.onDisconnected?.();
    });
    this.net.joinRoom(code, this.localName);
  }

  leave() {
    if (this.net) { this.net.leaveRoom(); this.net.close(); }
    this.net = null;
    this.active = false;
  }

  get inSession() {
    return !!this.net;
  }

  get isHost() {
    return !this.net || this.net.isHost; // solo play: local client is de facto host
  }

  get players() {
    return this.net ? this.net.players : [];
  }

  /** Who (if anyone) currently holds a given ship+station slot. Returns a player row
   * or null. In solo play there's no roster at all, so this always returns null and
   * callers fall back to their normal solo logic. */
  slotHolder(shipId, station) {
    if (!this.net) return null;
    return this.net.players.find((p) => p.shipId === shipId && p.station === station) || null;
  }

  isLocalSlot(shipId, station) {
    const holder = this.slotHolder(shipId, station);
    return !!holder && holder.id === this.net.playerId;
  }

  /** Does THIS client run physics for this ship this frame? Yes if: I hold its HELM,
   * or nobody holds its HELM and I'm host (solo play is always both). */
  iSimulateShip(shipId) {
    if (!this.net) return true;
    const helmHolder = this.slotHolder(shipId, 'HELM');
    if (helmHolder) return helmHolder.id === this.net.playerId;
    return this.isHost;
  }

  /** Does a human occupy this ship's helm at all (local or remote)? Autopilot yields
   * helm control whenever this is true, even if the human is on another client.
   * Solo: only while the local player is actually seated at HELM — otherwise AI takes
   * the conn (weapons seat / radar / walk must not freeze the ship at last rudder). */
  helmIsHuman(shipId) {
    if (!this.net) {
      if (shipId !== this.soloShipId) return false;
      return this.getLocalStation() === 'HELM';
    }
    return !!this.slotHolder(shipId, 'HELM');
  }

  /** Same station-gated rule for weapons: solo AI mans the guns unless the player is
   * in the WEAPONS seat. */
  weaponsIsHuman(shipId) {
    if (!this.net) {
      if (shipId !== this.soloShipId) return false;
      return this.getLocalStation() === 'WEAPONS';
    }
    return !!this.slotHolder(shipId, 'WEAPONS');
  }

  /** Overridden from main.js to read PlayerController.state in solo. */
  getLocalStation() {
    return this._getLocalStation?.() || 'WALK';
  }

  claimSlot(shipId, station) { this.net?.claimSlot(shipId, station); }
  releaseSlot() { this.net?.releaseSlot(); }
  setReady(ready) { this.net?.setReady(ready); }
  startPatrol() { this.net?.startPatrol(); }

  /** Call once per frame after ship physics have been stepped for anything this client
   * simulates. Broadcasts ~15x/sec (not every frame — plenty for a lerp-smoothed
   * remote view) and applies any state already received for ships this client doesn't
   * simulate is handled reactively in _applyRemoteShipState as messages arrive. */
  tick(dt) {
    if (!this.net) return;
    this._sendAccum += dt;
    if (this._sendAccum < 1 / 15) return;
    this._sendAccum = 0;
    for (const [shipId, ship] of Object.entries(this.ships)) {
      if (!this.iSimulateShip(shipId)) continue;
      this.net.sendShipState({
        shipId,
        pos: { x: ship.physics.position.x, y: ship.physics.position.y, z: ship.physics.position.z },
        heading: ship.physics.heading,
        speed: ship.physics.speed,
        roll: ship.physics.roll,
        pitch: ship.physics.pitch,
        health: ship.health,
      });
    }
  }

  _applyRemoteShipState(msg) {
    const ship = this.ships[msg.shipId];
    if (!ship) return;
    if (this.iSimulateShip(msg.shipId)) return; // I'm authoritative, ignore stale echoes
    ship.networked = true;
    ship.applyNetworkState(msg);
    if (typeof msg.health === 'number') ship.health = msg.health;
  }

  /** Wrap a locally-fired shot: spawns it (via the caller-supplied spawner) and, in a
   * multiplayer session, broadcasts it so every other client spawns the same effect. */
  fireAndRelay(spawnFn, type, fromPos, targetPos, opts = {}) {
    const p = spawnFn(type, fromPos, targetPos, opts);
    if (this.net) {
      this.net.sendWeaponFire({
        type, from: { x: fromPos.x, y: fromPos.y, z: fromPos.z },
        target: { x: targetPos.x, y: targetPos.y, z: targetPos.z },
        targetEntityId: opts.targetEntity?.id ?? null,
      });
    }
    return p;
  }

  _applyRemoteWeaponFire(msg) {
    if (!this._weaponSpawners) return;
    const from = new THREE.Vector3(msg.from.x, msg.from.y, msg.from.z);
    const target = new THREE.Vector3(msg.target.x, msg.target.y, msg.target.z);
    const targetEntity = msg.targetEntityId != null ? this._weaponSpawners.findEntity(msg.targetEntityId) : null;
    this._weaponSpawners.spawn(msg.type, from, target, { targetEntity });
  }

  setWeaponHooks({ spawn, findEntity }) {
    this._weaponSpawners = { spawn, findEntity };
  }
}

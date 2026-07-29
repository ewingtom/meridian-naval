/**
 * lobby/LobbyMenu.js
 *
 * Multiplayer front-end: name/room-code entry, then a room screen showing the roster,
 * a 3-ship x 4-station claim grid (click an open slot to crew it, click your own to
 * stand down), a ready toggle, and — host only — Start Patrol. Any slot nobody claims
 * gets crewed by AI once the patrol starts (see ShipAutopilot), so the grid doubles as
 * "who's flying this seat, human or machine" at a glance.
 *
 * Usage:
 *   const lobby = new LobbyMenu({
 *     onConnect: (name) => ..., onCreateRoom: (name) => ..., onJoinRoom: (code, name) => ...,
 *     onClaim: (shipId, station) => ..., onRelease: () => ..., onReady: (ready) => ...,
 *     onStart: () => ..., onLeave: () => ...,
 *   });
 *   lobby.mount(uiRoot); lobby.show();
 *   lobby.showRoom();                 // after WELCOME
 *   lobby.update({ code, hostId, players, localPlayerId });
 */

import './lobby.css';
import { el } from '../lib/utils.js';
import { SHIP_IDS, SHIP_NAMES, STATION_IDS } from '../../net/protocol.js';

const STATION_LABELS = { HELM: 'Helm', WEAPONS: 'Weapons', RADAR: 'Radar/Sonar', LOOKOUT: 'Lookout' };

export class LobbyMenu {
  constructor(options = {}) {
    this.options = options;
    this.root = null;
    this._mounted = false;
    this._state = { code: null, hostId: null, players: [], localPlayerId: null };
  }

  mount(container = document.getElementById('ui-root')) {
    if (this._mounted) return this.root;
    this.root = el('div', { class: 'meridian-menu lobby-menu menu-hidden' });
    this.root.innerHTML = `
      <div class="menu-bg-fallback">
        <div class="menu-grid"></div>
        <div class="menu-horizon-glow"></div>
      </div>
      <div class="hud-scanlines"></div>
      <div class="menu-content">
        <div class="menu-title-block">
          <div class="menu-eyebrow hud-label">Task Force Command</div>
          <h1 class="menu-title" style="font-size:44px;">MULTIPLAYER</h1>
          <div class="menu-title-rule"></div>
        </div>
        <div class="lobby-entry-screen"></div>
        <div class="lobby-room-screen" style="display:none;"></div>
      </div>
    `;
    container.appendChild(this.root);
    this._renderEntry();
    this._mounted = true;
    return this.root;
  }

  _renderEntry() {
    const wrap = this.root.querySelector('.lobby-entry-screen');
    wrap.innerHTML = `
      <div class="lobby-entry-form">
        <div>
          <label>Callsign</label>
          <input type="text" class="lobby-name-input" maxlength="24" placeholder="Officer name" value="${localStorage.getItem('warship-name') || ''}" />
        </div>
        <div>
          <label>Room Code (leave blank to create one)</label>
          <input type="text" class="lobby-code-input" maxlength="5" placeholder="e.g. ABCDE" style="text-transform:uppercase;" />
        </div>
      </div>
      <div class="lobby-entry-row">
        <button class="meridian-btn" data-action="go" style="--i:0">
          <span class="meridian-btn-index">01</span>
          <span class="meridian-btn-label">Create / Join</span>
        </button>
        <button class="meridian-btn" data-action="back" style="--i:1">
          <span class="meridian-btn-index">02</span>
          <span class="meridian-btn-label">Back</span>
        </button>
      </div>
    `;
    const nameInput = wrap.querySelector('.lobby-name-input');
    const codeInput = wrap.querySelector('.lobby-code-input');
    wrap.querySelector('[data-action="go"]').addEventListener('click', () => {
      const name = (nameInput.value || 'Officer').trim().slice(0, 24) || 'Officer';
      localStorage.setItem('warship-name', name);
      const code = (codeInput.value || '').trim().toUpperCase();
      this.options.onJoin?.(code, name);
    });
    wrap.querySelector('[data-action="back"]').addEventListener('click', () => this.options.onLeave?.());
  }

  showRoom() {
    this.root.querySelector('.lobby-entry-screen').style.display = 'none';
    this.root.querySelector('.lobby-room-screen').style.display = '';
    this._renderRoom();
  }

  showEntry() {
    this.root.querySelector('.lobby-entry-screen').style.display = '';
    this.root.querySelector('.lobby-room-screen').style.display = 'none';
  }

  /** state: { code, hostId, players: [{id,name,shipId,station,ready}], localPlayerId } */
  update(state) {
    this._state = { ...this._state, ...state };
    if (this.root?.querySelector('.lobby-room-screen')?.style.display !== 'none') this._renderRoom();
  }

  _renderRoom() {
    const wrap = this.root.querySelector('.lobby-room-screen');
    const { code, hostId, players, localPlayerId } = this._state;
    const me = players.find((p) => p.id === localPlayerId);
    const isHost = localPlayerId === hostId;

    const slotHtml = () => {
      let rows = `<div class="lobby-grid-head"></div>`;
      for (const st of STATION_IDS) rows += `<div class="lobby-grid-head">${STATION_LABELS[st]}</div>`;
      for (const shipId of SHIP_IDS) {
        rows += `<div class="lobby-ship-label">${SHIP_NAMES[shipId]}</div>`;
        for (const st of STATION_IDS) {
          const holder = players.find((p) => p.shipId === shipId && p.station === st);
          const mine = holder && holder.id === localPlayerId;
          const cls = mine ? 'mine' : holder ? 'taken' : '';
          const label = holder ? holder.name : (st === 'HELM' || st === 'WEAPONS' ? 'AI crewed' : 'Unmanned');
          const aiCls = !holder ? 'ai' : '';
          rows += `<div class="lobby-slot ${cls} ${aiCls}" data-ship="${shipId}" data-station="${st}">${label}</div>`;
        }
      }
      return rows;
    };

    const rosterHtml = players.map((p) => `
      <div class="lobby-roster-row ${p.ready ? 'ready' : ''}">
        <span class="dot"></span>
        <span>${p.name}</span>
        ${p.id === hostId ? '<span class="host-tag">HOST</span>' : ''}
        <span style="margin-left:auto; color:var(--c-text-faint);">${p.shipId ? `${SHIP_NAMES[p.shipId]} · ${STATION_LABELS[p.station]}` : 'Unassigned'}</span>
      </div>
    `).join('');

    wrap.innerHTML = `
      <div class="lobby-room-header">
        <div><span class="lobby-room-code-label">Room Code</span><span class="lobby-room-code">${code || '-----'}</span></div>
        <div class="hud-label">${players.length} officer${players.length === 1 ? '' : 's'} aboard</div>
      </div>
      <div class="lobby-grid">${slotHtml()}</div>
      <div class="lobby-roster">${rosterHtml}</div>
      <div class="lobby-actions">
        <button class="meridian-btn" data-action="ready">
          <span class="meridian-btn-index">01</span>
          <span class="meridian-btn-label">${me?.ready ? 'Not Ready' : 'Ready'}</span>
        </button>
        <button class="meridian-btn ${isHost ? '' : 'disabled'}" data-action="start">
          <span class="meridian-btn-index">02</span>
          <span class="meridian-btn-label">${isHost ? 'Start Patrol' : 'Waiting for Host'}</span>
        </button>
        <button class="meridian-btn meridian-btn-danger" data-action="leave">
          <span class="meridian-btn-index">03</span>
          <span class="meridian-btn-label">Leave</span>
        </button>
      </div>
    `;

    wrap.querySelectorAll('.lobby-slot').forEach((elm) => {
      elm.addEventListener('click', () => {
        const shipId = elm.dataset.ship, station = elm.dataset.station;
        const holder = players.find((p) => p.shipId === shipId && p.station === station);
        if (holder && holder.id === localPlayerId) this.options.onRelease?.();
        else if (!holder) this.options.onClaim?.(shipId, station);
      });
    });
    wrap.querySelector('[data-action="ready"]').addEventListener('click', () => this.options.onReady?.(!me?.ready));
    wrap.querySelector('[data-action="start"]').addEventListener('click', () => { if (isHost) this.options.onStart?.(); });
    wrap.querySelector('[data-action="leave"]').addEventListener('click', () => this.options.onLeave?.());
  }

  show() {
    if (!this.root) return;
    this.root.classList.remove('menu-hidden');
    this.root.classList.remove('menu-play-in');
    void this.root.offsetWidth; // force reflow so the entrance animation replays
    this.root.classList.add('menu-play-in');
    this.showEntry();
  }

  hide() {
    if (this.root) this.root.classList.add('menu-hidden');
  }

  dispose() {
    if (this.root && this.root.parentElement) this.root.parentElement.removeChild(this.root);
    this.root = null;
    this._mounted = false;
  }
}

/**
 * Persistent task-force cooperation strip — one-click orders that force/enable
 * working with escorts and other stations without leaving the current seat.
 */
import './coop.css';
import { el } from '../lib/utils.js';

const ACTIONS = [
  { id: 'share', key: 'C', label: 'Share Track' },
  { id: 'engage', key: 'V', label: 'Weapons Free' },
  { id: 'hold', key: 'B', label: 'Check Fire' },
  { id: 'ping', key: 'N', label: 'Request Ping' },
  { id: 'screen', key: 'M', label: 'Resume Screen' },
  { id: 'affirm', key: 'Y', label: 'Wilco' },
];

export class CoopPanel {
  constructor({ onAction } = {}) {
    this.onAction = onAction || (() => {});
    this.root = null;
    this._mounted = false;
  }

  mount(container = document.getElementById('ui-root')) {
    if (this._mounted) return this.root;
    this.root = el('div', { class: 'coop-panel hud-panel coop-hidden' });
    this.root.hidden = true;
    this.root.innerHTML = `
      <div class="hud-corners"></div>
      <div class="coop-head">
        <span class="hud-label">Task Force Net</span>
        <span class="coop-policy" data-coop="policy">WEAPONS HOLD</span>
      </div>
      <div class="coop-track" data-coop="track">NO SHARED TRACK</div>
      <div class="coop-hint" data-coop="hint"></div>
      <div class="coop-actions">
        ${ACTIONS.map((a) => `
          <button type="button" class="coop-btn" data-action="${a.id}">
            <kbd>${a.key}</kbd><span>${a.label}</span>
          </button>`).join('')}
      </div>
    `;
    container.appendChild(this.root);
    this._policy = this.root.querySelector('[data-coop="policy"]');
    this._track = this.root.querySelector('[data-coop="track"]');
    this._hint = this.root.querySelector('[data-coop="hint"]');
    this.root.querySelector('.coop-actions').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      this.onAction(btn.dataset.action);
    });
    this._mounted = true;
    return this.root;
  }

  show() {
    this.root?.classList.remove('coop-hidden');
    if (this.root) this.root.hidden = false;
  }
  hide() {
    this.root?.classList.add('coop-hidden');
    if (this.root) this.root.hidden = true;
  }

  update(status = {}) {
    if (!this._mounted) return;
    const free = status.weaponsPolicy === 'free';
    this._policy.textContent = free ? 'WEAPONS FREE' : 'WEAPONS HOLD';
    this._policy.classList.toggle('is-free', free);
    this._track.textContent = status.sharedName
      ? `SHARED · ${status.sharedName}`
      : 'NO SHARED TRACK';
    const hint = status.pendingHint;
    if (hint) {
      const map = {
        share: 'Required: Share a track to the force (C)',
        engage: 'Required: Release escorts weapons free (V)',
        ping: 'Required: Request escort sonar ping (N)',
        affirm: 'Required: Acknowledge tasking (Y)',
        screen: 'Required: Return escorts to screen (M)',
      };
      this._hint.textContent = map[hint.kind] || 'Cooperate with the task force';
      this._hint.classList.add('is-required');
    } else {
      this._hint.textContent = 'C share · V free · B hold · N ping · M screen · Y wilco';
      this._hint.classList.remove('is-required');
    }
  }
}

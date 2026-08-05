/**
 * debrief/DebriefPanel.js
 *
 * After-action debrief screen for the TAO training scenario(s) — see
 * src/systems/TaoDebrief.js for the scoring rules this renders. Shares
 * MainMenu/PauseMenu's visual language (menus/menus.css: .meridian-menu,
 * .menu-content, .meridian-btn) rather than inventing a new modal style, per
 * the same "match existing patterns" rule the rest of this UI kit follows.
 *
 * Deliberately NOT a hard stop — see hide()/onClose: the player can always
 * dismiss this and keep playing (or the scenario replays later in the
 * patrol). A training pilot that locks the player out on a "bad" run would
 * undercut the point of a debrief.
 *
 * ---------------------------------------------------------------------
 * Usage
 *   const debrief = new DebriefPanel({ onClose: () => ... });
 *   debrief.mount(document.getElementById('ui-root'));
 *   debrief.show({ scenarioName, principles }); // principles: [{name, describe, result, rationale}]
 *   debrief.hide();
 */

import '../menus/menus.css';
import './debrief.css';
import { el } from '../lib/utils.js';

const RESULT_LABEL = { pass: 'PASS', fail: 'FAIL', partial: 'PARTIAL' };

export class DebriefPanel {
  constructor(options = {}) {
    this.options = options;
    this.root = null;
    this._mounted = false;
  }

  mount(container = document.getElementById('ui-root')) {
    if (this._mounted) return this.root;
    this.root = el('div', { class: 'meridian-menu debrief-panel menu-hidden' });
    this.root.innerHTML = `
      <div class="pause-scrim debrief-scrim"></div>
      <div class="menu-content debrief-content">
        <div class="menu-title-block pause-title-block">
          <div class="menu-eyebrow hud-label" data-debrief="eyebrow">After-Action Debrief</div>
          <h2 class="pause-title" data-debrief="title">SCENARIO DEBRIEF</h2>
          <div class="menu-title-rule"></div>
          <div class="debrief-summary" data-debrief="summary"></div>
        </div>
        <div class="debrief-list" data-debrief="list"></div>
        <div class="debrief-note">
          This pilot claims fidelity to the real TAO decision cycle, the real
          weapons-control vocabulary, and a documented failure-mode case study —
          not procedure-exact PQS/ROE accuracy (that material isn't public).
        </div>
        <nav class="menu-nav debrief-nav">
          <button class="meridian-btn" data-action="close" style="--i:0">
            <span class="meridian-btn-index">01</span>
            <span class="meridian-btn-label">Return to Patrol</span>
          </button>
        </nav>
      </div>
    `;
    container.appendChild(this.root);
    this._title = this.root.querySelector('[data-debrief="title"]');
    this._summary = this.root.querySelector('[data-debrief="summary"]');
    this._list = this.root.querySelector('[data-debrief="list"]');
    this.root.querySelector('[data-action="close"]').addEventListener('click', () => this.options.onClose?.());
    this._mounted = true;
    return this.root;
  }

  /** No dynamic per-frame state; provided for API consistency with other components. */
  update() {}

  show({ scenarioName = 'AMBIGUOUS INBOUND', principles = [] } = {}) {
    if (!this._mounted) return;
    this._title.textContent = scenarioName;
    const passCount = principles.filter((p) => p.result === 'pass').length;
    this._summary.textContent = `${passCount} / ${principles.length} principles met`;
    this._list.innerHTML = principles.map((p) => `
      <div class="debrief-row debrief-${p.result}">
        <div class="debrief-row-head">
          <span class="debrief-badge">${RESULT_LABEL[p.result] || '—'}</span>
          <span class="debrief-name">${escapeHtml(p.name)}</span>
        </div>
        <div class="debrief-rationale">${escapeHtml(p.rationale || p.describe || '')}</div>
      </div>
    `).join('');

    this.root.classList.remove('menu-hidden');
    this.root.classList.remove('menu-play-in');
    void this.root.offsetWidth;
    this.root.classList.add('menu-play-in');
  }

  hide() {
    if (this.root) this.root.classList.add('menu-hidden');
  }

  get isVisible() {
    return !!this.root && !this.root.classList.contains('menu-hidden');
  }

  dispose() {
    if (this.root && this.root.parentElement) this.root.parentElement.removeChild(this.root);
    this.root = null;
    this._mounted = false;
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (ch) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

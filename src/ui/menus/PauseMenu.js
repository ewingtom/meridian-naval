/**
 * menus/PauseMenu.js
 *
 * In-game pause overlay: dims/blurs the game behind it (backdrop-filter
 * blur on a translucent scrim) and presents Resume / Settings / Quit to
 * Main Menu. Shares MainMenu's visual language (menus/menus.css).
 *
 * ---------------------------------------------------------------------
 * Usage
 *   const pause = new PauseMenu({
 *     onResume: () => ...,
 *     onSettings: () => ...,
 *     onQuitToMainMenu: () => ...,
 *   });
 *   pause.mount(document.getElementById('ui-root'));
 *   pause.show(); // e.g. on Escape keydown
 *   pause.hide(); // e.g. on Resume
 *
 * Constructor options:
 *   onResume, onSettings, onQuitToMainMenu — click callbacks, no args.
 */

import './menus.css';
import { el } from '../lib/utils.js';

export class PauseMenu {
  constructor(options = {}) {
    this.options = options;
    this.root = null;
    this._mounted = false;
  }

  mount(container = document.getElementById('ui-root')) {
    if (this._mounted) return this.root;
    this.root = el('div', { class: 'meridian-menu pause-menu menu-hidden' });
    this.root.innerHTML = `
      <div class="pause-scrim"></div>
      <div class="menu-content pause-content">
        <div class="menu-title-block pause-title-block">
          <div class="menu-eyebrow hud-label">Task Paused</div>
          <h2 class="pause-title">STANDING BY</h2>
          <div class="menu-title-rule"></div>
        </div>
        <nav class="menu-nav">
          <button class="meridian-btn" data-action="resume" style="--i:0">
            <span class="meridian-btn-index">01</span>
            <span class="meridian-btn-label">Resume</span>
          </button>
          <button class="meridian-btn" data-action="settings" style="--i:1">
            <span class="meridian-btn-index">02</span>
            <span class="meridian-btn-label">Settings</span>
          </button>
          <button class="meridian-btn meridian-btn-danger" data-action="quit" style="--i:2">
            <span class="meridian-btn-index">03</span>
            <span class="meridian-btn-label">Quit to Main Menu</span>
          </button>
        </nav>
      </div>
    `;
    container.appendChild(this.root);

    this.root.querySelector('[data-action="resume"]').addEventListener('click', () => this.options.onResume?.());
    this.root.querySelector('[data-action="settings"]').addEventListener('click', () => this.options.onSettings?.());
    this.root.querySelector('[data-action="quit"]').addEventListener('click', () => this.options.onQuitToMainMenu?.());

    this._mounted = true;
    return this.root;
  }

  /** No dynamic state; provided for API consistency with other components. */
  update() {}

  show() {
    if (!this.root) return;
    this.root.classList.remove('menu-hidden');
    this.root.classList.remove('menu-play-in');
    void this.root.offsetWidth;
    this.root.classList.add('menu-play-in');
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

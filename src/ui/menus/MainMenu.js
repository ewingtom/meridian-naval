/**
 * menus/MainMenu.js
 *
 * Full-screen main menu: title treatment, primary navigation, and a slot
 * for a live animated background (e.g. a Three.js canvas rendering an
 * ocean/ship scene behind the UI).
 *
 * ---------------------------------------------------------------------
 * Background injection — two supported approaches, pick whichever suits
 * the integrator:
 *   1. Pass `backgroundCanvas` (any DOM element, typically a <canvas>)
 *      to the constructor. MainMenu absorbs it into its background layer
 *      and takes ownership of positioning (fills the menu, behind content).
 *   2. Or just grab `mainMenu.bgSlot` (a plain `<div class="menu-bg-slot">`,
 *      always present) after mount() and append/position your own canvas
 *      into it — MainMenu never touches it in this case.
 * If neither is provided the slot is left empty and a procedural CSS
 * gradient/grid backdrop is shown so the menu still looks intentional.
 *
 * ---------------------------------------------------------------------
 * Usage
 *   const menu = new MainMenu({
 *     onNewPatrol: () => ...,
 *     onContinue:  () => ...,
 *     onSettings:  () => ...,
 *     onCredits:   () => ...,
 *     continueEnabled: true, // optional, default true; false greys out Continue
 *   });
 *   menu.mount(document.getElementById('ui-root'));
 *   menu.show();
 *
 * Constructor options:
 *   onNewPatrol, onContinue, onSettings, onCredits — click callbacks, no args.
 *   continueEnabled: boolean — disables the Continue button when false.
 *   backgroundCanvas: HTMLElement — optional, see above.
 */

import './menus.css';
import { el } from '../lib/utils.js';

export class MainMenu {
  constructor(options = {}) {
    this.options = options;
    this.root = null;
    this.bgSlot = null;
    this._mounted = false;
  }

  mount(container = document.getElementById('ui-root')) {
    if (this._mounted) return this.root;
    this.root = el('div', { class: 'meridian-menu main-menu' });
    this.root.innerHTML = `
      <div class="menu-bg-slot"></div>
      <div class="menu-bg-fallback">
        <div class="menu-grid"></div>
        <div class="menu-horizon-glow"></div>
      </div>
      <div class="hud-scanlines"></div>

      <div class="menu-content">
        <div class="menu-title-block">
          <div class="menu-eyebrow hud-label">Naval Task Force</div>
          <h1 class="menu-title">MERIDIAN</h1>
          <div class="menu-title-rule"></div>
        </div>

        <nav class="menu-nav">
          <button class="meridian-btn" data-action="newPatrol" style="--i:0">
            <span class="meridian-btn-index">01</span>
            <span class="meridian-btn-label">New Patrol</span>
          </button>
          <button class="meridian-btn" data-action="continue" style="--i:1">
            <span class="meridian-btn-index">02</span>
            <span class="meridian-btn-label">Continue</span>
          </button>
          <button class="meridian-btn" data-action="settings" style="--i:2">
            <span class="meridian-btn-index">03</span>
            <span class="meridian-btn-label">Settings</span>
          </button>
          <button class="meridian-btn" data-action="credits" style="--i:3">
            <span class="meridian-btn-index">04</span>
            <span class="meridian-btn-label">Credits</span>
          </button>
        </nav>

        <div class="menu-footer hud-label">Task Force Command &middot; Build 1.0</div>
      </div>
    `;
    container.appendChild(this.root);

    this.bgSlot = this.root.querySelector('.menu-bg-slot');
    if (this.options.backgroundCanvas) {
      this.bgSlot.appendChild(this.options.backgroundCanvas);
      this.options.backgroundCanvas.classList.add('menu-bg-injected');
      this.root.querySelector('.menu-bg-fallback').style.display = 'none';
    }

    const continueBtn = this.root.querySelector('[data-action="continue"]');
    if (this.options.continueEnabled === false) {
      continueBtn.classList.add('disabled');
      continueBtn.setAttribute('aria-disabled', 'true');
    }

    this.root.querySelector('[data-action="newPatrol"]').addEventListener('click', () => this.options.onNewPatrol?.());
    continueBtn.addEventListener('click', () => {
      if (this.options.continueEnabled === false) return;
      this.options.onContinue?.();
    });
    this.root.querySelector('[data-action="settings"]').addEventListener('click', () => this.options.onSettings?.());
    this.root.querySelector('[data-action="credits"]').addEventListener('click', () => this.options.onCredits?.());

    this._mounted = true;
    return this.root;
  }

  /** MainMenu has no dynamic readouts, but update() is provided for API consistency
   *  and accepts { continueEnabled } to toggle the Continue button post-mount. */
  update(data = {}) {
    if (!this._mounted) return;
    if (typeof data.continueEnabled === 'boolean') {
      const btn = this.root.querySelector('[data-action="continue"]');
      btn.classList.toggle('disabled', !data.continueEnabled);
      this.options.continueEnabled = data.continueEnabled;
    }
  }

  show() {
    if (!this.root) return;
    this.root.classList.remove('menu-hidden');
    this.root.classList.remove('menu-play-in');
    // force reflow so the entrance animation replays every time show() is called
    void this.root.offsetWidth;
    this.root.classList.add('menu-play-in');
  }

  hide() {
    if (this.root) this.root.classList.add('menu-hidden');
  }

  dispose() {
    if (this.root && this.root.parentElement) this.root.parentElement.removeChild(this.root);
    this.root = null;
    this.bgSlot = null;
    this._mounted = false;
  }
}

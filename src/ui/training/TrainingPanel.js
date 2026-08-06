/**
 * training/TrainingPanel.js
 *
 * The on-screen instructor card for the guided TAO schoolhouse patrol (see
 * src/systems/TaoTraining.js for the step machine that drives it).
 *
 * Deliberately non-modal and non-blocking: it docks in a corner and never
 * takes pointer events, because every single tutorial step requires the player
 * to be actively driving the console underneath it. A tutorial that has to be
 * dismissed before you can do the thing it is asking for teaches nothing.
 *
 * Reuses the HUD panel language (hud.css `.hud-panel`/`.hud-label`) rather
 * than inventing new chrome, so it reads as part of the ship's own systems.
 *
 * ---------------------------------------------------------------------
 * Usage
 *   const tp = new TrainingPanel();
 *   tp.mount(document.getElementById('ui-root'));
 *   tp.show({ title, body, hint, index, total });  // null hides it
 */

import './training.css';
import { el } from '../lib/utils.js';

export class TrainingPanel {
  constructor(options = {}) {
    this.options = options;
    this.root = null;
    this._mounted = false;
    this._lastId = null;
  }

  mount(container = document.getElementById('ui-root')) {
    if (this._mounted) return this.root;
    this.root = el('div', { class: 'training-panel is-hidden' });
    this.root.innerHTML = `
      <div class="training-head">
        <span class="training-eyebrow hud-label">TAO Schoolhouse</span>
        <span class="training-progress" data-tr="progress">--/--</span>
      </div>
      <div class="training-bar"><i data-tr="bar"></i></div>
      <h3 class="training-title" data-tr="title"></h3>
      <div class="training-body" data-tr="body"></div>
      <div class="training-hint is-hidden" data-tr="hint"></div>
    `;
    container.appendChild(this.root);
    this._title = this.root.querySelector('[data-tr="title"]');
    this._body = this.root.querySelector('[data-tr="body"]');
    this._hint = this.root.querySelector('[data-tr="hint"]');
    this._progress = this.root.querySelector('[data-tr="progress"]');
    this._bar = this.root.querySelector('[data-tr="bar"]');
    this._mounted = true;
    return this.root;
  }

  /** Pass a step object to show it, or null/undefined to hide the panel. */
  show(step) {
    if (!this._mounted) return;
    if (!step) {
      this.root.classList.add('is-hidden');
      this._lastId = null;
      return;
    }
    const isNewStep = step.id !== this._lastId;
    this._lastId = step.id;

    this._title.textContent = step.title || '';
    // Step copy is authored in this repo (see TaoTraining.js STEPS) and
    // intentionally carries <b>/<kbd> markup for keycaps and emphasis — it is
    // never player- or network-supplied, so innerHTML is safe here.
    this._body.innerHTML = step.body || '';
    this._progress.textContent = `${String(step.index + 1).padStart(2, '0')}/${String(step.total).padStart(2, '0')}`;
    this._bar.style.width = `${((step.index) / Math.max(1, step.total - 1)) * 100}%`;

    if (step.hint) {
      this._hint.innerHTML = step.hint;
      this._hint.classList.remove('is-hidden');
    } else {
      this._hint.classList.add('is-hidden');
    }

    this.root.classList.remove('is-hidden');
    if (isNewStep) {
      this.root.classList.remove('training-advance');
      void this.root.offsetWidth; // reflow so the advance flash replays
      this.root.classList.add('training-advance');
    }
  }

  hide() {
    if (this.root) this.root.classList.add('is-hidden');
  }

  get isVisible() {
    return !!this.root && !this.root.classList.contains('is-hidden');
  }

  dispose() {
    if (this.root?.parentElement) this.root.parentElement.removeChild(this.root);
    this.root = null;
    this._mounted = false;
  }
}

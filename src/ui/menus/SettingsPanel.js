/**
 * menus/SettingsPanel.js
 *
 * Modal settings panel: volume sliders, mouse sensitivity, graphics
 * quality segmented control, invert-Y toggle. Purely presentational —
 * it holds no persistence logic itself; the integrator listens to
 * onChange and does whatever it wants (write to localStorage, apply to
 * the renderer, etc). Shares MainMenu's visual language (menus/menus.css).
 *
 * ---------------------------------------------------------------------
 * Usage
 *   const settings = new SettingsPanel({
 *     onChange: (key, value) => { ... },
 *     onClose: () => { ... },        // optional, called by the Back button
 *     initialValues: {
 *       masterVolume: 80, musicVolume: 60, sfxVolume: 90,
 *       mouseSensitivity: 50, graphicsQuality: 'high', invertY: false,
 *     },
 *   });
 *   settings.mount(document.getElementById('ui-root'));
 *   settings.show();
 *   settings.setValues({ masterVolume: 40 }); // update controls without emitting onChange
 *
 * onChange(key, value) is called once per user-driven control change, where:
 *   key: 'masterVolume' | 'musicVolume' | 'sfxVolume'  -> value: number 0-100
 *   key: 'mouseSensitivity'                             -> value: number 0-100
 *   key: 'graphicsQuality'                               -> value: 'low'|'medium'|'high'|'ultra'
 *   key: 'invertY'                                       -> value: boolean
 *
 * Constructor options:
 *   onChange(key, value), onClose(), initialValues: {...} (see above, all optional,
 *   sensible defaults are used for any field omitted).
 */

import './menus.css';
import { el } from '../lib/utils.js';

const DEFAULTS = {
  masterVolume: 80,
  musicVolume: 70,
  sfxVolume: 85,
  mouseSensitivity: 50,
  graphicsQuality: 'medium',
  invertY: false,
};

const QUALITY_LEVELS = ['low', 'medium', 'high', 'ultra'];

export class SettingsPanel {
  constructor(options = {}) {
    this.options = options;
    this.values = { ...DEFAULTS, ...(options.initialValues || {}) };
    this.root = null;
    this._mounted = false;
  }

  mount(container = document.getElementById('ui-root')) {
    if (this._mounted) return this.root;
    this.root = el('div', { class: 'meridian-menu settings-panel menu-hidden' });
    this.root.innerHTML = `
      <div class="pause-scrim"></div>
      <div class="menu-content settings-content hud-panel">
        <div class="hud-corners"></div>
        <div class="settings-header">
          <div>
            <div class="menu-eyebrow hud-label">System</div>
            <h2 class="settings-title">SETTINGS</h2>
          </div>
          <button class="settings-close" data-action="close" aria-label="Close settings">&times;</button>
        </div>
        <div class="menu-title-rule"></div>

        <div class="settings-body">
          <div class="settings-group">
            <div class="hud-label settings-group-title">Audio</div>
            ${this._sliderRow('masterVolume', 'Master Volume')}
            ${this._sliderRow('musicVolume', 'Music Volume')}
            ${this._sliderRow('sfxVolume', 'SFX Volume')}
          </div>

          <div class="settings-group">
            <div class="hud-label settings-group-title">Controls</div>
            ${this._sliderRow('mouseSensitivity', 'Mouse Sensitivity')}
            ${this._toggleRow('invertY', 'Invert Y-Axis')}
          </div>

          <div class="settings-group">
            <div class="hud-label settings-group-title">Graphics</div>
            <div class="settings-row">
              <label class="settings-row-label">Quality</label>
              <div class="settings-segmented" data-key="graphicsQuality">
                ${QUALITY_LEVELS.map((lvl) => `<button class="settings-seg-btn" data-value="${lvl}">${lvl}</button>`).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    container.appendChild(this.root);
    this._wire();
    this._syncControls();
    this._mounted = true;
    return this.root;
  }

  _sliderRow(key, label) {
    return `
      <div class="settings-row" data-key="${key}">
        <label class="settings-row-label">${label}</label>
        <div class="settings-slider-wrap">
          <input type="range" min="0" max="100" step="1" class="settings-slider" data-key="${key}" />
          <span class="settings-slider-val" data-key-val="${key}">0</span>
        </div>
      </div>
    `;
  }

  _toggleRow(key, label) {
    return `
      <div class="settings-row" data-key="${key}">
        <label class="settings-row-label">${label}</label>
        <button class="settings-toggle" data-key="${key}" role="switch" aria-checked="false">
          <span class="settings-toggle-knob"></span>
        </button>
      </div>
    `;
  }

  _wire() {
    this.root.querySelectorAll('.settings-slider').forEach((slider) => {
      slider.addEventListener('input', () => {
        const key = slider.dataset.key;
        const value = Number(slider.value);
        this.values[key] = value;
        this.root.querySelector(`[data-key-val="${key}"]`).textContent = value;
        this.options.onChange?.(key, value);
      });
    });

    this.root.querySelectorAll('.settings-toggle').forEach((toggle) => {
      toggle.addEventListener('click', () => {
        const key = toggle.dataset.key;
        const value = !this.values[key];
        this.values[key] = value;
        toggle.classList.toggle('on', value);
        toggle.setAttribute('aria-checked', String(value));
        this.options.onChange?.(key, value);
      });
    });

    const seg = this.root.querySelector('.settings-segmented');
    seg.querySelectorAll('.settings-seg-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const value = btn.dataset.value;
        this.values.graphicsQuality = value;
        seg.querySelectorAll('.settings-seg-btn').forEach((b) => b.classList.toggle('active', b === btn));
        this.options.onChange?.('graphicsQuality', value);
      });
    });

    this.root.querySelector('[data-action="close"]').addEventListener('click', () => this.options.onClose?.());
  }

  _syncControls() {
    for (const key of ['masterVolume', 'musicVolume', 'sfxVolume', 'mouseSensitivity']) {
      const slider = this.root.querySelector(`.settings-slider[data-key="${key}"]`);
      slider.value = this.values[key];
      this.root.querySelector(`[data-key-val="${key}"]`).textContent = this.values[key];
    }
    const invertToggle = this.root.querySelector('.settings-toggle[data-key="invertY"]');
    invertToggle.classList.toggle('on', !!this.values.invertY);
    invertToggle.setAttribute('aria-checked', String(!!this.values.invertY));

    const seg = this.root.querySelector('.settings-segmented');
    seg.querySelectorAll('.settings-seg-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.value === this.values.graphicsQuality);
    });
  }

  /** Update displayed control values without emitting onChange (e.g. loading persisted settings). */
  setValues(values = {}) {
    this.values = { ...this.values, ...values };
    if (this._mounted) this._syncControls();
  }

  /** Alias for update(), kept for API consistency with other components. */
  update(values = {}) {
    this.setValues(values);
  }

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

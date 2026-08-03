/**
 * notifications/CommsLog.js
 *
 * "Radio chatter" toast/subtitle system. Short-lived stacked cards slide
 * in, hold, then fade out — styled like intercepted task-force comms
 * (e.g. "TASK FORCE ACTUAL: New contact bearing 240, designate Master 3").
 *
 * ---------------------------------------------------------------------
 * Usage
 *   const comms = new CommsLog();
 *   comms.mount(document.getElementById('ui-root'));
 *   comms.push({ speaker: 'CIC', text: 'New contact bearing 240, designate Master 3.' });
 *   comms.push({ speaker: 'BRIDGE', text: 'Taking on water, damage control to deck 2.', urgency: 'critical' });
 *
 * push(entry) -> returns a string id you can pass to dismiss(id).
 * entry shape:
 * {
 *   speaker: string,           // e.g. "CIC", "BRIDGE", "TASK FORCE ACTUAL"
 *   text: string,              // message body
 *   urgency: 'normal'|'warning'|'critical', // default 'normal'
 *   durationMs: number,        // optional. Defaults: normal=4500, warning=6000,
 *                              // critical=Infinity (persists until dismissed or
 *                              // an explicit durationMs is given).
 * }
 *
 * dismiss(id) — manually remove a card early (also called by its own close button).
 * clear() — remove all cards immediately.
 *
 * Constructor takes no required options. Pass { maxVisible } to cap the
 * stack (oldest is dropped first); default 6.
 */

import './comms.css';
import { el } from '../lib/utils.js';

const DEFAULT_DURATIONS = { normal: 4500, warning: 6000, critical: Infinity };
let _uid = 0;

export class CommsLog {
  constructor(options = {}) {
    this.options = { maxVisible: 6, ...options };
    this.root = null;
    this.stack = null;
    this._mounted = false;
    this._timers = new Map(); // id -> timeoutId
    this._recentKeys = new Map(); // speaker|text -> timestamp
    this._dedupeMs = options.dedupeMs ?? 12000;
  }

  mount(container = document.getElementById('ui-root')) {
    if (this._mounted) return this.root;
    this.root = el('div', { class: 'comms-log' });
    this.stack = el('div', { class: 'comms-stack' });
    this.root.appendChild(this.stack);
    container.appendChild(this.root);
    this._mounted = true;
    return this.root;
  }

  /** update() is a no-op alias kept for API consistency; use push() to add entries. */
  update() {}

  push(entry = {}) {
    if (!this._mounted) return null;
    const speaker = entry.speaker || 'COMMS';
    const text = entry.text || '';
    const key = `${speaker}|${text}`;
    const now = performance.now();
    if (this._recentKeys.get(key) > now - this._dedupeMs) return null;
    if (this.stack) {
      for (const card of this.stack.querySelectorAll('.comms-card')) {
        const cardSpeaker = card.querySelector('.comms-speaker')?.textContent || '';
        const cardText = card.querySelector('.comms-text')?.textContent || '';
        if (cardSpeaker === speaker && cardText === text) return null;
      }
    }
    this._recentKeys.set(key, now);
    if (this._recentKeys.size > 48) {
      for (const [k, t] of this._recentKeys) {
        if (t <= now - this._dedupeMs) this._recentKeys.delete(k);
      }
    }

    const id = `comms-${++_uid}`;
    const urgency = entry.urgency || 'normal';
    const duration = entry.durationMs ?? DEFAULT_DURATIONS[urgency] ?? DEFAULT_DURATIONS.normal;

    const card = el('div', { class: `comms-card urgency-${urgency}`, attrs: { 'data-id': id } });
    card.innerHTML = `
      <div class="comms-card-accent"></div>
      <div class="comms-card-body">
        <div class="comms-meta">
          <span class="comms-speaker">${this._escape(speaker)}</span>
          ${urgency !== 'normal' ? `<span class="comms-urgency-tag">${urgency}</span>` : ''}
        </div>
        <div class="comms-text">${this._escape(text)}</div>
      </div>
      <button class="comms-dismiss" aria-label="Dismiss">&times;</button>
    `;
    card.querySelector('.comms-dismiss').addEventListener('click', () => this.dismiss(id));

    this.stack.appendChild(card);
    requestAnimationFrame(() => card.classList.add('comms-in'));

    if (Number.isFinite(duration)) {
      const t = setTimeout(() => this.dismiss(id), duration);
      this._timers.set(id, t);
    }

    this._trimOverflow();
    return id;
  }

  _trimOverflow() {
    const cards = this.stack.querySelectorAll('.comms-card');
    const overflow = cards.length - this.options.maxVisible;
    for (let i = 0; i < overflow; i++) {
      const id = cards[i].dataset.id;
      this.dismiss(id);
    }
  }

  dismiss(id) {
    const card = this.stack?.querySelector(`[data-id="${id}"]`);
    if (!card) return;
    const timer = this._timers.get(id);
    if (timer) { clearTimeout(timer); this._timers.delete(id); }
    card.classList.remove('comms-in');
    card.classList.add('comms-out');
    card.addEventListener('animationend', () => card.remove(), { once: true });
    // fallback removal in case animationend doesn't fire (e.g. reduced-motion)
    setTimeout(() => card.remove(), 500);
  }

  clear() {
    if (!this.stack) return;
    for (const t of this._timers.values()) clearTimeout(t);
    this._timers.clear();
    this._recentKeys.clear();
    this.stack.innerHTML = '';
  }

  _escape(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  show() { if (this.root) this.root.classList.remove('comms-hidden'); }
  hide() { if (this.root) this.root.classList.add('comms-hidden'); }

  dispose() {
    this.clear();
    if (this.root && this.root.parentElement) this.root.parentElement.removeChild(this.root);
    this.root = null;
    this.stack = null;
    this._mounted = false;
  }
}

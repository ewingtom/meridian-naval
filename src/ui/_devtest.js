// Throwaway visual test harness — see _devtest.html. Not part of the real app.
import {
  ShipHUD, TacticalRadar, MainMenu, PauseMenu, SettingsPanel, CommsLog, DamageVignette,
} from './index.js';

const root = document.getElementById('ui-root');
const controls = document.getElementById('devtest-controls');

function btn(label, fn) {
  const b = document.createElement('button');
  b.textContent = label;
  b.onclick = fn;
  controls.appendChild(b);
}

// ---- ShipHUD ----
const hud = new ShipHUD();
hud.mount(root);
let heading = 0;
let hull = 100;
setInterval(() => {
  heading = (heading + 1.4) % 360;
  hud.update({
    heading,
    speedKnots: 18.4,
    throttleFraction: 0.6,
    hullPct: hull,
    subsystems: { engine: 'nominal', radar: 'damaged', weapons: 'destroyed' },
    objective: { text: 'Escort convoy to rally point Bravo', bearing: (heading + 40) % 360, distanceM: 4300 },
    selectedWeapon: { name: 'MK-45 5IN/62', ammo: 12, maxAmmo: 20, ready: true },
  });
}, 50);
btn('Toggle Reticle', (() => { let on = false; return () => { on = !on; hud.setAiming(on); }; })());
btn('Damage Hull -10', () => { hull = Math.max(0, hull - 10); vignette.setHullPct(hull); });
btn('HUD show/hide', (() => { let shown = true; return () => { shown = !shown; shown ? hud.show() : hud.hide(); }; })());

// ---- TacticalRadar ----
const radar = new TacticalRadar({ onSelectContact: (id) => comms.push({ speaker: 'CIC', text: `Selected contact ${id}` }) });
radar.mount(root);
const contacts = [
  { id: 'm1', x: 1200, z: 800, domain: 'surface', iff: 'hostile', name: 'MASTER 1' },
  { id: 'm2', x: -600, z: 2200, domain: 'air', iff: 'unknown', name: 'MASTER 2' },
  { id: 'm3', x: -1800, z: -900, domain: 'subsurface', iff: 'hostile', name: 'MASTER 3' },
  { id: 'f1', x: 300, z: -1500, domain: 'surface', iff: 'friendly', name: 'CG-71' },
];
setInterval(() => {
  radar.update({ rangeM: 8000, playerHeading: heading, contacts });
}, 100);
btn('Add radar contact', () => {
  const id = 'c' + Math.random().toString(36).slice(2, 6);
  contacts.push({ id, x: (Math.random() - 0.5) * 6000, z: (Math.random() - 0.5) * 6000, domain: ['surface', 'air', 'subsurface'][Math.floor(Math.random() * 3)], iff: ['friendly', 'hostile', 'unknown'][Math.floor(Math.random() * 3)], name: id.toUpperCase() });
});
btn('Toggle North-up', (() => { let nu = false; return () => { nu = !nu; radar.setNorthUp(nu); }; })());

// ---- CommsLog ----
const comms = new CommsLog();
comms.mount(root);
btn('Push normal comm', () => comms.push({ speaker: 'CIC', text: 'New contact bearing 240, designate Master 3.' }));
btn('Push warning comm', () => comms.push({ speaker: 'BRIDGE', text: 'Radar array degraded, switching to backup.', urgency: 'warning' }));
btn('Push critical comm', () => comms.push({ speaker: 'TASK FORCE ACTUAL', text: 'Incoming missile, brace for impact!', urgency: 'critical' }));

// ---- DamageVignette ----
const vignette = new DamageVignette();
vignette.mount(root);
vignette.setHullPct(100);
btn('Flash hit', () => vignette.flashHit(0.7));

// ---- MainMenu ----
const mainMenu = new MainMenu({
  onNewPatrol: () => comms.push({ speaker: 'COMMAND', text: 'New Patrol clicked' }),
  onContinue: () => comms.push({ speaker: 'COMMAND', text: 'Continue clicked' }),
  onSettings: () => settingsPanel.show(),
  onCredits: () => comms.push({ speaker: 'COMMAND', text: 'Credits clicked' }),
});
mainMenu.mount(root);
btn('Show MainMenu', () => mainMenu.show());
btn('Hide MainMenu', () => mainMenu.hide());

// ---- PauseMenu ----
const pauseMenu = new PauseMenu({
  onResume: () => pauseMenu.hide(),
  onSettings: () => settingsPanel.show(),
  onQuitToMainMenu: () => { pauseMenu.hide(); mainMenu.show(); },
});
pauseMenu.mount(root);
btn('Show PauseMenu', () => pauseMenu.show());

// ---- SettingsPanel ----
const settingsPanel = new SettingsPanel({
  onChange: (key, value) => comms.push({ speaker: 'SYS', text: `${key} -> ${value}`, durationMs: 1500 }),
  onClose: () => settingsPanel.hide(),
});
settingsPanel.mount(root);
btn('Show Settings', () => settingsPanel.show());

mainMenu.show();

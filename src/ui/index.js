/**
 * src/ui/index.js
 *
 * Barrel export for the MERIDIAN UI layer. Import everything from here:
 *   import { ShipHUD, TacticalRadar, MainMenu, PauseMenu, SettingsPanel,
 *            CommsLog, DamageVignette } from './ui/index.js';
 *
 * Each component's CSS must be linked once, wherever your app links
 * stylesheets (index.html or dynamically). See src/ui/README.md for the
 * exact file list and full API contracts.
 */

export { ShipHUD } from './hud/ShipHUD.js';
export { TacticalRadar } from './radar/TacticalRadar.js';
export { MainMenu } from './menus/MainMenu.js';
export { PauseMenu } from './menus/PauseMenu.js';
export { SettingsPanel } from './menus/SettingsPanel.js';
export { CommsLog } from './notifications/CommsLog.js';
export { DamageVignette } from './notifications/DamageVignette.js';
export { StationOverlay } from './stations/StationOverlay.js';
export { LobbyMenu } from './lobby/LobbyMenu.js';

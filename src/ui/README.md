# MERIDIAN UI Layer

Everything here lives under `src/ui/` and is framework-free vanilla JS + CSS.
Import from the barrel file:

```js
import {
  ShipHUD, TacticalRadar, MainMenu, PauseMenu, SettingsPanel,
  CommsLog, DamageVignette,
} from './ui/index.js';
```

## Conventions shared by every component

- Every component is a class with `mount(container)`, `update(data)`,
  `show()`, `hide()`, and `dispose()`. `mount()` defaults to
  `document.getElementById('ui-root')` if you call it with no argument.
- Components are DOM-append-only: `mount()` creates their root element and
  appends it to `container`. Nothing queries or mutates the DOM outside
  that root.
- Each component's own CSS is imported directly by its `.js` file (e.g.
  `hud/ShipHUD.js` does `import './hud.css'`). Vite bundles this
  automatically — **you do not need to add `<link>` tags**; just importing
  the component is enough. `src/ui/styles.css` (already linked in
  `index.html`) provides the shared design tokens (colors, fonts, the
  `.hud-panel` / `.hud-corners` / `.hud-scanlines` utility classes) that
  every component's own stylesheet builds on.
- `show()` / `hide()` toggle a CSS class (opacity + pointer-events); they
  don't unmount. `dispose()` removes the root element from the DOM and
  tears down timers/animation frames/listeners. Call `dispose()` if you
  need to fully discard an instance (e.g. hot-reload, leaving a scene).
- Hidden components are click-through by design — see "pointer-events
  gotcha" below if you add new interactive elements inside them.
- `update(data)` merges/patches — pass only the fields that changed where
  documented; omitted fields keep their last known value (exception:
  `TacticalRadar.update()` replaces the full `contacts` array each call —
  see below).

### pointer-events gotcha (read this before adding new markup)

`src/ui/styles.css` (base file, not owned by this layer) sets:

```css
#ui-root * { pointer-events: auto; }
```

so that interactive panels work without every component having to opt
back in. That means any element that is meant to be **click-through**
(full-screen decorative overlays, hidden-but-still-mounted panels, the
passive `ShipHUD`) must override it with a selector specific enough to
win — a plain `.my-class { pointer-events: none }` will lose to
`#ui-root *`. The pattern used throughout this codebase is:

```css
.my-overlay,
.my-overlay * {
  pointer-events: none !important;
}
```

`ShipHUD` (fully passive), `DamageVignette` (fully passive), and every
`.menu-hidden` / `.tac-radar-hidden` / `.comms-hidden` state use this
pattern already. If you add new always-passive markup, follow the same
pattern or it will silently eat clicks meant for the 3D canvas.

---

## `hud/ShipHUD.js`

In-world piloting HUD: compass ribbon, objective ticker, hull integrity +
subsystem status, speed/throttle, weapon/ammo readout, aiming reticle.
Purely a readout — no clickable elements, fully click-through.

```js
const hud = new ShipHUD({ compassSpan: 120 }); // compassSpan optional, default 120 (degrees visible on the ribbon)
hud.mount(document.getElementById('ui-root'));
hud.update({ ... });   // call every frame or on state change
hud.setAiming(true);   // show/hide the center reticle
hud.show(); hud.hide(); hud.dispose();
```

**`update(state)` shape** (all fields optional; omitted fields keep last value):

```js
{
  heading: 47,                 // degrees, 0-360, 0 = North, animated smoothly on the ribbon
  speedKnots: 18.4,
  throttleFraction: 0.6,       // -1..1 (reverse..full ahead); bar fills from center
  hullPct: 72,                 // 0-100; bar recolors green->amber(<=50)->red(<=25, pulses)
  subsystems: {
    engine: 'nominal',         // 'nominal' | 'damaged' | 'destroyed', per key
    radar: 'damaged',
    weapons: 'destroyed',
  },
  objective: {
    text: 'Escort convoy to rally point Bravo',
    bearing: 240,               // degrees, or null to hide the nav arrow
    distanceM: 4300,            // meters; formatted as "4.3km" (>=1000m) or "NNNm"
  },
  selectedWeapon: {
    name: 'MK-45 5IN/62',
    ammo: 12,
    maxAmmo: 20,                // ammo pips are capped visually at 24 for very large magazines
    ready: true,                // false shows "RELOADING" and pulses amber
  },
}
```

No callbacks — `ShipHUD` is display-only.

---

## `radar/TacticalRadar.js`

Circular sweep radar, corner panel, procedural `<canvas>` (no images).
Rotating sweep with fading trail, labeled range rings, contact blips by
domain/IFF, appear/ping/fade-out animation, click-to-select.

```js
const radar = new TacticalRadar({
  onSelectContact: (id) => { ... },  // called when a blip is clicked
  northUp: false,                     // optional, default false (heading-up)
  size: 260,                          // optional, panel diameter in px, default 260
});
radar.mount(document.getElementById('ui-root'));
radar.update({ rangeM: 8000, playerHeading: 47, contacts: [...] });
radar.setNorthUp(true);  // flip orientation mode at runtime; also toggleable by
                          // clicking the "HDG UP"/"NORTH UP" label in the panel header
```

**Coordinate contract (important):** contacts carry `x`/`z` in **meters
relative to the player**, where `+x = east of player` and `+z = north of
player` — this is a simplified nav convention, deliberately independent
of whatever axes the Three.js scene uses. Convert your engine's world
coordinates into this convention before calling `update()`. Internally,
bearing is `atan2(x, z)` in degrees (0 = north, clockwise), and screen
angle is that bearing rotated by `-playerHeading` in heading-up mode (0
rotation in north-up mode).

**`update(data)` shape:**

```js
{
  rangeM: 8000,               // outer ring radius in meters
  playerHeading: 47,          // degrees, drives heading-up rotation + own-ship glyph
  contacts: [
    {
      id: 'm3',                       // stable id — required for selection + animation tracking
      x: -1800, z: -900,              // meters, see convention above
      domain: 'subsurface',           // 'surface' | 'air' | 'subsurface'
      iff: 'hostile',                 // 'friendly' | 'hostile' | 'unknown'
      name: 'MASTER 3',               // optional label drawn next to the blip
      selected: false,                // optional, draws a white selection ring
    },
    // ...
  ],
}
```

Note: `contacts` is treated as the full current set on every call — a
contact id missing from a later `update()` call is animated out
(fade+shrink) and then dropped; a new id triggers a fade-in + expanding
ping ring. Diffing is by `id`, done internally — you don't need to
pre-diff yourself, just always pass the current full list.

Glyphs: surface = triangle, air = diamond, subsurface = dashed circle.
Colors: friendly = green (`--c-green`), hostile = red (`--c-red`),
unknown = amber (`--c-amber`).

---

## `menus/MainMenu.js`

Full-screen main menu: title treatment, primary nav, background slot.

```js
const menu = new MainMenu({
  onNewPatrol: () => { ... },
  onContinue:  () => { ... },
  onSettings:  () => { ... },
  onCredits:   () => { ... },
  continueEnabled: true,        // optional, default true; false greys out + disables Continue
  backgroundCanvas: someCanvasEl, // optional, see below
});
menu.mount(document.getElementById('ui-root'));
menu.show();  // also (re)plays the staggered entrance animation every time it's called
menu.update({ continueEnabled: false }); // toggle Continue post-mount without a full remount
```

**Background injection — two options, pick one:**
1. Pass `backgroundCanvas` (any element, typically a `<canvas>`) to the
   constructor. `MainMenu` appends it into its internal background slot
   and sizes it to fill the menu, behind all content.
2. Or read `menu.bgSlot` after `mount()` — it's a plain
   `<div class="menu-bg-slot">`, always present — and append/position your
   own canvas into it yourself. `MainMenu` never touches it in this case.

If neither is used, a procedural CSS starfield/grid-horizon backdrop is
shown so the menu still looks intentional on its own.

No `update()` data is required in normal use beyond the optional
`continueEnabled` toggle described above.

---

## `menus/PauseMenu.js`

In-game pause overlay. Blurs/dims the game behind it via
`backdrop-filter: blur()` on a translucent scrim. Same visual language as
`MainMenu` (shares `menus/menus.css`).

```js
const pause = new PauseMenu({
  onResume: () => { ... },
  onSettings: () => { ... },
  onQuitToMainMenu: () => { ... },
});
pause.mount(document.getElementById('ui-root'));
pause.show();  // e.g. on Escape keydown
pause.hide();  // e.g. from your onResume handler
```

`update()` is a no-op (kept only for API consistency — PauseMenu has no
dynamic readouts).

---

## `menus/SettingsPanel.js`

Modal settings panel: audio sliders, mouse sensitivity, graphics quality
segmented control, invert-Y toggle. Holds no persistence logic — purely
emits changes via `onChange`.

```js
const settings = new SettingsPanel({
  onChange: (key, value) => { ... },
  onClose: () => { ... },           // called by the panel's own close (X) button
  initialValues: {                   // optional, all keys optional, see defaults below
    masterVolume: 80, musicVolume: 70, sfxVolume: 85,
    mouseSensitivity: 50, graphicsQuality: 'high', invertY: false,
  },
});
settings.mount(document.getElementById('ui-root'));
settings.show();
settings.setValues({ masterVolume: 40 }); // update controls WITHOUT emitting onChange
                                            // (e.g. loading persisted settings)
settings.update({ masterVolume: 40 });     // alias for setValues()
```

**`onChange(key, value)` is called once per user-driven change:**

| key                 | value type                              |
|---------------------|------------------------------------------|
| `masterVolume`      | number 0-100                              |
| `musicVolume`       | number 0-100                              |
| `sfxVolume`         | number 0-100                              |
| `mouseSensitivity`  | number 0-100                              |
| `graphicsQuality`   | `'low' \| 'medium' \| 'high' \| 'ultra'`  |
| `invertY`           | boolean                                   |

Defaults (used for any field omitted from `initialValues`): masterVolume
80, musicVolume 70, sfxVolume 85, mouseSensitivity 50, graphicsQuality
`'high'`, invertY `false`.

---

## `notifications/CommsLog.js`

"Radio chatter" toast stack: cards slide in from the left, hold, then
fade out. Naval-radio phrasing is up to your call sites, e.g.
`"TASK FORCE ACTUAL: New contact bearing 240, designate Master 3."`

```js
const comms = new CommsLog({ maxVisible: 6 }); // optional, default 6 (oldest dropped past this)
comms.mount(document.getElementById('ui-root'));
const id = comms.push({
  speaker: 'CIC',
  text: 'New contact bearing 240, designate Master 3.',
  urgency: 'normal',      // 'normal' | 'warning' | 'critical', default 'normal'
  durationMs: 4500,        // optional, see defaults below
});
comms.dismiss(id);  // manually remove early
comms.clear();       // remove everything immediately
```

Default `durationMs` by urgency: `normal` = 4500, `warning` = 6000,
`critical` = **persists indefinitely** until `dismiss()` is called or the
card's own close (×) button is clicked — unless you pass an explicit
`durationMs` for a critical entry, in which case it auto-dismisses after
that.

`push()` returns the card's `id` (string) so you can `dismiss()` it
later. Newest cards appear at the top of the stack.

---

## `notifications/DamageVignette.js`

Full-screen damage-flash overlay: persistent red vignette that
intensifies as hull % drops, plus a one-shot flash pulse per hit. Pure
CSS overlay, always click-through. Styles live in
`notifications/comms.css` alongside `CommsLog`.

```js
const vignette = new DamageVignette();
vignette.mount(document.getElementById('ui-root'));
vignette.setHullPct(72);     // call whenever hull % changes; ramps in below 60%,
                               // starts a slow critical pulse at <=25%
vignette.flashHit(0.6);      // call on every hit taken; intensityFraction 0-1
vignette.update({ hullPct: 72 }); // alias for setHullPct
```

No callbacks.

---

## Visual language reference (for keeping the rest of the game consistent)

Design tokens live in `src/ui/styles.css` as CSS custom properties on
`:root` — reuse these rather than hardcoding new colors elsewhere:

- **Accents:** cyan `#4de8ff` (primary/friendly-neutral UI), amber
  `#ffb02e` (warnings/objectives/unknown IFF), green `#3dffa0`
  (nominal/friendly), red `#ff4444` (critical/hostile/damage). Each has a
  `-dim` variant (for gradients/borders) and a `-soft` variant (for
  translucent hover fills): `--c-cyan`, `--c-cyan-dim`, `--c-cyan-soft`,
  etc.
- **Surfaces:** near-black translucent panels, `--c-bg-panel: rgba(7,16,20,0.82)`,
  with `backdrop-filter: blur(6px)`; borders `--c-border: rgba(120,210,230,0.28)`.
- **Type:** `--font-mono` (`'JetBrains Mono', ui-monospace, 'SF Mono', ...`)
  for all data readouts/labels/buttons; `--font-display`
  (`'Bahnschrift', 'Arial Narrow', ...`) for large title treatments only
  (menu titles). Both are system-font stacks — no webfonts are loaded, so
  there's no network dependency; if a real display font is added later,
  swap the `--font-display` value in one place.
- **Shapes:** angled-corner panels via the shared `.hud-panel` class
  (`clip-path: polygon(...)`, 12px corner cuts) + `.hud-corners` for the
  glowing corner-bracket decoration. No rounded rectangles, no drop
  shadows — glows are done via `box-shadow`/`text-shadow`/`filter:
  drop-shadow()` using the accent colors, on dark glass panels.
  `.hud-scanlines` adds a faint repeating-gradient scanline texture where used.
  Reuse `.hud-panel` / `.hud-corners` / `.hud-scanlines` / `.hud-label` /
  `.hud-glow-text` for any new panels so they match.
- **Motion:** `--ease-hud: cubic-bezier(0.16, 1, 0.3, 1)` (snappy
  ease-out, used for entrances/fills) and `--ease-hud-in` (ease-in, used
  for exits). Nothing pops in/out instantly — everything fades/slides/scales.

## Files

```
src/ui/
  styles.css              (base reset — pre-existing — extended with design tokens/utilities)
  index.js                 barrel export
  README.md                this file
  lib/utils.js              internal helpers (clamp, lerp, DOM builder, formatters) — not part of the public API
  hud/ShipHUD.js  hud/hud.css
  radar/TacticalRadar.js  radar/radar.css
  menus/MainMenu.js  menus/PauseMenu.js  menus/SettingsPanel.js  menus/menus.css
  notifications/CommsLog.js  notifications/DamageVignette.js  notifications/comms.css
  _devtest.html  _devtest.js   (throwaway visual test harness, not wired into index.html/main.js — safe to delete)
```

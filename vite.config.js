import { defineConfig } from 'vite';
import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

// Embeds the multiplayer relay (lobby/station arbitration + message broadcast) directly
// in the Vite dev server's own HTTP server, on a distinct WS path so it coexists with
// Vite's own HMR websocket. Keeps `npm run dev` a single process/port in dev; the
// standalone server/index.js entry point covers running the relay in production.
//
// Important: do NOT statically import ./server/relay.js at the top of this file.
// Vite bundles the config with esbuild for every command (including `vite build`),
// so a top-level import fails CI/static hosts when that module graph can't resolve.
// configureServer only runs for `vite` / `vite dev`, so a runtime dynamic import is enough.
function warshipRelayPlugin() {
  return {
    name: 'warship-relay',
    async configureServer(server) {
      if (!server.httpServer) return;
      const relayPath = path.join(rootDir, 'server', 'relay.js');
      if (!existsSync(relayPath)) {
        console.warn('[warship-relay] server/relay.js missing; skipping WS relay plugin');
        return;
      }
      const { attachWarshipRelay } = await import(pathToFileURL(relayPath).href);
      attachWarshipRelay(server.httpServer, { path: '/ws-relay' });
    },
  };
}

export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/meridian-naval/' : '/',
  plugins: [warshipRelayPlugin()],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    target: 'es2022',
    sourcemap: true,
  },
});

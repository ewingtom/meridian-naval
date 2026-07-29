import { defineConfig } from 'vite';
import { attachWarshipRelay } from './server/relay.js';

// Embeds the multiplayer relay (lobby/station arbitration + message broadcast) directly
// in the Vite dev server's own HTTP server, on a distinct WS path so it coexists with
// Vite's own HMR websocket. Keeps `npm run dev` a single process/port in dev; the
// standalone server/index.js entry point covers running the relay in production.
function warshipRelayPlugin() {
  return {
    name: 'warship-relay',
    configureServer(server) {
      if (!server.httpServer) return;
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

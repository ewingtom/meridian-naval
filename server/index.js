import { createServer } from 'node:http';
import { attachWarshipRelay } from './relay.js';

// Standalone entry point for production (`node server/index.js`), separate from the
// Vite dev server which instead embeds attachWarshipRelay() directly — see
// vite.config.js. Both share the exact same relay/room logic.
const PORT = process.env.WARSHIP_WS_PORT ? Number(process.env.WARSHIP_WS_PORT) : 8787;

const httpServer = createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/plain' });
  res.end('warship relay server ok\n');
});

attachWarshipRelay(httpServer, { path: '/ws-relay' });

httpServer.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[warship-relay] listening on ws://localhost:${PORT}/ws-relay`);
});

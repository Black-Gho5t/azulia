import { startServer } from './dist/server/entry.mjs';

try {
  await startServer();
  console.log('[azulia] Server started successfully');
} catch (err) {
  console.error('[azulia] Failed to start server:', err);
  process.exit(1);
}

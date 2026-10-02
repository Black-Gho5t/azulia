import { writeFileSync } from 'node:fs';

const startContent = `import { startServer } from './server/entry.mjs';
await startServer();
`;

writeFileSync('dist/start.mjs', startContent);
console.log('[postbuild] dist/start.mjs created successfully');

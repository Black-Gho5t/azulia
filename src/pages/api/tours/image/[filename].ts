import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const TOURS_DIR = path.resolve('uploads/tours');

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const filename = params.filename;
    if (!filename) {
      return new Response(JSON.stringify({ error: 'Filename missing' }), { status: 400 });
    }

    const safeFilename = path.basename(filename);
    const filePath = path.join(TOURS_DIR, safeFilename);

    if (!existsSync(filePath)) {
      return new Response('Not found', { status: 404 });
    }

    const data = await readFile(filePath);
    return new Response(data, {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
};

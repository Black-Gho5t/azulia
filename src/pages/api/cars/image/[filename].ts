import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const CARS_DIR = path.resolve('uploads/cars');
const CARS_TRASH_DIR = path.resolve('uploads/cars-trash');

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const filename = params.filename;
    if (!filename) {
      return new Response(JSON.stringify({ error: 'Filename missing' }), { status: 400 });
    }

    const safeFilename = path.basename(filename);
    let filePath = path.join(CARS_DIR, safeFilename);

    if (!existsSync(filePath)) {
      filePath = path.join(CARS_TRASH_DIR, safeFilename);
    }

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

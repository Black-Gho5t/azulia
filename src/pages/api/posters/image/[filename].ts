import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const POSTERS_DIR = path.resolve('uploads/posters');
const TRASH_DIR = path.resolve('uploads/posters-trash');

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const filename = params.filename;
    if (!filename) {
      return new Response(JSON.stringify({ error: 'Filename requerido' }), { status: 400 });
    }

    const safeName = path.basename(filename);
    const srcPath = path.join(POSTERS_DIR, safeName);
    const trashPath = path.join(TRASH_DIR, safeName);

    let filePath: string;
    if (existsSync(srcPath)) {
      filePath = srcPath;
    } else if (existsSync(trashPath)) {
      filePath = trashPath;
    } else {
      return new Response(JSON.stringify({ error: 'Imagen no encontrada' }), { status: 404 });
    }

    const fileData = await readFile(filePath);
    return new Response(fileData, {
      status: 200,
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });

  } catch (err: any) {
    console.error('[api/posters/image]', err);
    return new Response(JSON.stringify({ error: err.message || 'Error al servir imagen' }), { status: 500 });
  }
};

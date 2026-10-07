import type { APIRoute } from 'astro';
import path from 'node:path';
import { serveLocalImage } from '../../../../lib/image-response';

const POSTERS_DIR = path.resolve('uploads/posters');
const TRASH_DIR = path.resolve('uploads/posters-trash');

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
  const filename = params.filename;
  if (!filename) {
    return new Response(JSON.stringify({ error: 'Filename requerido' }), { status: 400 });
  }

  const safeName = path.basename(filename);
  const srcPath = path.join(POSTERS_DIR, safeName);
  const trashPath = path.join(TRASH_DIR, safeName);

  return serveLocalImage(request, [srcPath, trashPath], 'image/webp');
};

import type { APIRoute } from 'astro';
import path from 'node:path';
import { serveLocalImage } from '../../../../lib/image-response';

const CARS_DIR = path.resolve('uploads/cars');
const CARS_TRASH_DIR = path.resolve('uploads/cars-trash');

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
  const filename = params.filename;
  if (!filename) {
    return new Response(JSON.stringify({ error: 'Filename missing' }), { status: 400 });
  }

  const safeFilename = path.basename(filename);
  const srcPath = path.join(CARS_DIR, safeFilename);
  const trashPath = path.join(CARS_TRASH_DIR, safeFilename);

  return serveLocalImage(request, [srcPath, trashPath], 'image/webp');
};

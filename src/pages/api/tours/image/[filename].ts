import type { APIRoute } from 'astro';
import path from 'node:path';
import { serveLocalImage } from '../../../../lib/image-response';

const TOURS_DIR = path.resolve('uploads/tours');

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
  const filename = params.filename;
  if (!filename) {
    return new Response(JSON.stringify({ error: 'Filename missing' }), { status: 400 });
  }

  const safeFilename = path.basename(filename);
  const filePath = path.join(TOURS_DIR, safeFilename);

  return serveLocalImage(request, [filePath], 'image/webp');
};

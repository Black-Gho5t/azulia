import type { APIRoute } from 'astro';
import sharp from 'sharp';
import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const UPLOADS_DIR = path.resolve('uploads/hotels');
const MAX_SIZE_MB = 20;

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const hotelId = (formData.get('hotelId') as string || '').trim();

    if (!file) {
      return new Response(JSON.stringify({ ok: false, error: 'No se envió ningún archivo' }), { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return new Response(JSON.stringify({ ok: false, error: 'Formato no soportado' }), { status: 400 });
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return new Response(JSON.stringify({ ok: false, error: `El archivo supera los ${MAX_SIZE_MB} MB` }), { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    const webpBuffer = await sharp(inputBuffer)
      .webp({ lossless: true, quality: 100 })
      .toBuffer();

    if (!existsSync(UPLOADS_DIR)) {
      await mkdir(UPLOADS_DIR, { recursive: true });
    }

    const safeName = (hotelId || 'hotel')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 60);
    const filename = `${Date.now()}_${safeName}.webp`;
    const filePath = path.join(UPLOADS_DIR, filename);

    await writeFile(filePath, webpBuffer);

    return new Response(JSON.stringify({
      ok: true,
      filename,
      url: `/api/hotels/image/${filename}`,
    }), { status: 200 });

  } catch (err: any) {
    console.error('[api/hotels/upload]', err);
    return new Response(JSON.stringify({ ok: false, error: err.message || 'Error al subir' }), { status: 500 });
  }
};

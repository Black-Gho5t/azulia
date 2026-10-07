import type { APIRoute } from 'astro';
import { verifyAdminRequest } from '../../../lib/firebase-admin';
import { serverCache } from '../../../lib/server-cache';
import sharp from 'sharp';
import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const UPLOADS_DIR = path.resolve('uploads/tours');
const MAX_SIZE_MB = 20;

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const auth = await verifyAdminRequest(request);
  if (!auth.ok) {
    return new Response(JSON.stringify({ ok: false, error: auth.error }), { status: auth.status });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const tourId = (formData.get('tourId') as string || '').trim();

    if (!file) {
      return new Response(JSON.stringify({ ok: false, error: 'No se envió ningún archivo' }), { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return new Response(JSON.stringify({ ok: false, error: 'El formato de archivo no es soportado. Por favor selecciona una imagen válida (JPG, PNG, etc.).' }), { status: 400 });
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return new Response(JSON.stringify({ ok: false, error: `La imagen supera el límite permitido de ${MAX_SIZE_MB} MB.` }), { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    const webpBuffer = await sharp(inputBuffer)
      .rotate()
      .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85, effort: 5 })
      .toBuffer();

    if (!existsSync(UPLOADS_DIR)) {
      await mkdir(UPLOADS_DIR, { recursive: true });
    }

    const safeName = (tourId || 'tour')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 60);
    const filename = `${Date.now()}_${safeName}.webp`;
    const filePath = path.join(UPLOADS_DIR, filename);

    await writeFile(filePath, webpBuffer);

    serverCache.invalidate('tours');

    return new Response(JSON.stringify({
      ok: true,
      filename,
      url: `/api/tours/image/${filename}`,
    }), { status: 200 });
  } catch (err: any) {
    console.error('[api/tours/upload POST]', err);
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500 });
  }
};

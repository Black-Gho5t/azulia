import type { APIRoute } from 'astro';
import { getAdminDb, verifyAdminRequest, withFirestoreRetry } from '../../../lib/firebase-admin';
import { serverCache } from '../../../lib/server-cache';
import sharp from 'sharp';
import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const UPLOADS_DIR = path.resolve('uploads/posters');
const MAX_POSTERS = 10;
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
    const name = (formData.get('name') as string || '').trim();

    if (!file) {
      return new Response(JSON.stringify({ error: 'No se envió ningún archivo' }), { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return new Response(JSON.stringify({ error: 'Formato no soportado' }), { status: 400 });
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return new Response(JSON.stringify({ error: `El archivo supera los ${MAX_SIZE_MB} MB` }), { status: 400 });
    }

    const countSnap = await withFirestoreRetry(async (db) => db.collection('posters').count().get());
    if (countSnap.data().count >= MAX_POSTERS) {
      return new Response(JSON.stringify({ error: `Límite de ${MAX_POSTERS} posters alcanzado. Elimina uno primero.` }), { status: 400 });
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

    const safeName = (name || 'poster')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 60);
    const filename = `${Date.now()}_${safeName}.webp`;
    const filePath = path.join(UPLOADS_DIR, filename);

    await writeFile(filePath, webpBuffer);

    const docRef = await withFirestoreRetry(async (db) => {
      return db.collection('posters').add({
        name: name || 'Poster',
        filename,
        createdAt: new Date().toISOString(),
      });
    });

    serverCache.invalidate('posters');

    return new Response(JSON.stringify({
      ok: true,
      id: docRef.id,
      name: name || 'Poster',
      filename,
      url: `/api/posters/image/${filename}`,
    }), { status: 200 });

  } catch (err: any) {
    console.error('[api/posters/upload]', err);
    return new Response(JSON.stringify({ error: err.message || 'Error al subir' }), { status: 500 });
  }
};

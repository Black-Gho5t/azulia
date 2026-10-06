import type { APIRoute } from 'astro';
import { getAdminDb, verifyAdminRequest, withFirestoreRetry } from '../../../lib/firebase-admin';
import { unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const POSTERS_TRASH_DIR = path.resolve('uploads/posters-trash');
const HOTELS_TRASH_DIR = path.resolve('uploads/hotels-trash');
const CARS_TRASH_DIR = path.resolve('uploads/cars-trash');

export const prerender = false;

export const DELETE: APIRoute = async ({ params, request }) => {
  const auth = await verifyAdminRequest(request);
  if (!auth.ok) {
    return new Response(JSON.stringify({ ok: false, error: auth.error }), { status: auth.status });
  }

  try {
    const id = params.id;
    if (!id) return new Response(JSON.stringify({ error: 'ID requerido' }), { status: 400 });

    const db = getAdminDb();
    const docRef = db.collection('trash').doc(id);
    const doc = await withFirestoreRetry(async () => docRef.get());

    if (!doc.exists) {
      return new Response(JSON.stringify({ error: 'Elemento no encontrado' }), { status: 404 });
    }

    const data = doc.data()!;

    if (data.type === 'poster' && data.data?.filename) {
      const filePath = path.join(POSTERS_TRASH_DIR, data.data.filename);
      if (existsSync(filePath)) {
        await unlink(filePath).catch(() => {});
      }
    }

    if (data.type === 'hotel' && Array.isArray(data.data?.movedFilenames)) {
      for (const filename of data.data.movedFilenames) {
        const filePath = path.join(HOTELS_TRASH_DIR, filename);
        if (existsSync(filePath)) {
          await unlink(filePath).catch(() => {});
        }
      }
    }

    if (data.type === 'car' && Array.isArray(data.data?.movedFilenames)) {
      for (const filename of data.data.movedFilenames) {
        const filePath = path.join(CARS_TRASH_DIR, filename);
        if (existsSync(filePath)) {
          await unlink(filePath).catch(() => {});
        }
      }
    }

    await withFirestoreRetry(async () => docRef.delete());

    return new Response(JSON.stringify({ ok: true }), { status: 200 });

  } catch (err: any) {
    console.error('[api/trash DELETE]', err);
    return new Response(JSON.stringify({ error: err.message || 'Error al eliminar' }), { status: 500 });
  }
};

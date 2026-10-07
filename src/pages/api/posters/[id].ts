import type { APIRoute } from 'astro';
import { getAdminDb, verifyAdminRequest, withFirestoreRetry } from '../../../lib/firebase-admin';
import { serverCache } from '../../../lib/server-cache';
import { Timestamp } from 'firebase-admin/firestore';
import { rename, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const POSTERS_DIR = path.resolve('uploads/posters');
const TRASH_DIR = path.resolve('uploads/posters-trash');

export const prerender = false;

export const PUT: APIRoute = async ({ params, request }) => {
  const auth = await verifyAdminRequest(request);
  if (!auth.ok) {
    return new Response(JSON.stringify({ ok: false, error: auth.error }), { status: auth.status });
  }

  try {
    const id = params.id;
    if (!id) return new Response(JSON.stringify({ error: 'ID requerido' }), { status: 400 });

    const { name } = await request.json();
    if (!name || !name.trim()) {
      return new Response(JSON.stringify({ error: 'El nombre es obligatorio' }), { status: 400 });
    }

    const db = getAdminDb();
    const docRef = db.collection('posters').doc(id);
    const doc = await withFirestoreRetry(async () => docRef.get());
    if (!doc.exists) {
      return new Response(JSON.stringify({ error: 'Poster no encontrado' }), { status: 404 });
    }

    await withFirestoreRetry(async () => docRef.update({ name: name.trim() }));
    serverCache.invalidate('posters');
    return new Response(JSON.stringify({ ok: true }), { status: 200 });

  } catch (err: any) {
    console.error('[api/posters PUT]', err);
    return new Response(JSON.stringify({ error: err.message || 'Error al actualizar' }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ params, request }) => {
  const auth = await verifyAdminRequest(request);
  if (!auth.ok) {
    return new Response(JSON.stringify({ ok: false, error: auth.error }), { status: auth.status });
  }

  try {
    const id = params.id;
    if (!id) return new Response(JSON.stringify({ error: 'ID requerido' }), { status: 400 });

    const db = getAdminDb();
    const docRef = db.collection('posters').doc(id);
    const doc = await withFirestoreRetry(async () => docRef.get());
    if (!doc.exists) {
      return new Response(JSON.stringify({ error: 'Poster no encontrado' }), { status: 404 });
    }

    const data = doc.data()!;
    const filename = data.filename;

    if (!existsSync(TRASH_DIR)) {
      await mkdir(TRASH_DIR, { recursive: true });
    }

    const srcPath = path.join(POSTERS_DIR, filename);
    const destPath = path.join(TRASH_DIR, filename);
    if (existsSync(srcPath)) {
      await rename(srcPath, destPath);
    }

    const now = Date.now();
    await withFirestoreRetry(async (d) => {
      await d.collection('trash').add({
        type: 'poster',
        originalId: id,
        data: { name: data.name, filename },
        deletedAt: new Date().toISOString(),
        expiresAt: new Timestamp(Math.floor(now / 1000) + 30 * 86400, 0),
      });

      await docRef.delete();
    });

    serverCache.invalidate('posters');
    return new Response(JSON.stringify({ ok: true }), { status: 200 });

  } catch (err: any) {
    console.error('[api/posters DELETE]', err);
    return new Response(JSON.stringify({ error: err.message || 'Error al eliminar' }), { status: 500 });
  }
};

import type { APIRoute } from 'astro';
import { getAdminDb, verifyAdminRequest, withFirestoreRetry } from '../../../../lib/firebase-admin';
import { serverCache } from '../../../../lib/server-cache';
import { rename } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const POSTERS_DIR = path.resolve('uploads/posters');
const TRASH_DIR = path.resolve('uploads/posters-trash');
const MAX_POSTERS = 10;

export const prerender = false;

export const POST: APIRoute = async ({ params, request }) => {
  const auth = await verifyAdminRequest(request);
  if (!auth.ok) {
    return new Response(JSON.stringify({ ok: false, error: auth.error }), { status: auth.status });
  }

  try {
    const id = params.id;
    if (!id) return new Response(JSON.stringify({ error: 'ID requerido' }), { status: 400 });

    const db = getAdminDb();

    const trashDoc = await withFirestoreRetry(async () => db.collection('trash').doc(id).get());
    if (!trashDoc.exists) {
      return new Response(JSON.stringify({ error: 'Elemento no encontrado en papelera' }), { status: 404 });
    }

    const trashData = trashDoc.data()!;
    if (trashData.type !== 'poster') {
      return new Response(JSON.stringify({ error: 'Este elemento no es un poster' }), { status: 400 });
    }

    const countSnap = await withFirestoreRetry(async () => db.collection('posters').count().get());
    if (countSnap.data().count >= MAX_POSTERS) {
      return new Response(JSON.stringify({ error: `No se puede restaurar: ya hay ${MAX_POSTERS} posters activos. Elimina uno primero.` }), { status: 400 });
    }

    const filename = trashData.data.filename;
    const srcPath = path.join(TRASH_DIR, filename);
    const destPath = path.join(POSTERS_DIR, filename);

    if (existsSync(srcPath)) {
      await rename(srcPath, destPath);
    } else {
      return new Response(JSON.stringify({ error: 'Archivo no encontrado en papelera' }), { status: 404 });
    }

    await withFirestoreRetry(async () => {
      await db.collection('posters').doc(trashData.originalId).set({
        name: trashData.data.name,
        filename,
        createdAt: new Date().toISOString(),
      });

      await db.collection('trash').doc(id).delete();
    });

    serverCache.invalidate('posters');

    return new Response(JSON.stringify({ ok: true }), { status: 200 });

  } catch (err: any) {
    console.error('[api/posters/restore]', err);
    return new Response(JSON.stringify({ error: err.message || 'Error al restaurar' }), { status: 500 });
  }
};

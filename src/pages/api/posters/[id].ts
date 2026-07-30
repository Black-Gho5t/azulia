import type { APIRoute } from 'astro';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { rename, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const POSTERS_DIR = path.resolve('uploads/posters');
const TRASH_DIR = path.resolve('uploads/posters-trash');

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];
  const sa = import.meta.env.FIREBASE_SERVICE_ACCOUNT;
  if (!sa) throw new Error('FIREBASE_SERVICE_ACCOUNT no configurado');
  return initializeApp({ credential: cert(JSON.parse(sa)) });
}

export const prerender = false;

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const id = params.id;
    if (!id) return new Response(JSON.stringify({ error: 'ID requerido' }), { status: 400 });

    const { name } = await request.json();
    if (!name || !name.trim()) {
      return new Response(JSON.stringify({ error: 'El nombre es obligatorio' }), { status: 400 });
    }

    const app = getAdminApp();
    const db = getFirestore(app);
    const docRef = db.collection('posters').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return new Response(JSON.stringify({ error: 'Poster no encontrado' }), { status: 404 });
    }

    await docRef.update({ name: name.trim() });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });

  } catch (err: any) {
    console.error('[api/posters PUT]', err);
    return new Response(JSON.stringify({ error: err.message || 'Error al actualizar' }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const id = params.id;
    if (!id) return new Response(JSON.stringify({ error: 'ID requerido' }), { status: 400 });

    const app = getAdminApp();
    const db = getFirestore(app);
    const docRef = db.collection('posters').doc(id);
    const doc = await docRef.get();
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
    await db.collection('trash').add({
      type: 'poster',
      originalId: id,
      data: { name: data.name, filename },
      deletedAt: new Date().toISOString(),
      expiresAt: new Timestamp(Math.floor(now / 1000) + 30 * 86400, 0),
    });

    await docRef.delete();

    return new Response(JSON.stringify({ ok: true }), { status: 200 });

  } catch (err: any) {
    console.error('[api/posters DELETE]', err);
    return new Response(JSON.stringify({ error: err.message || 'Error al eliminar' }), { status: 500 });
  }
};

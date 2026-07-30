import type { APIRoute } from 'astro';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const TRASH_DIR = path.resolve('uploads/posters-trash');

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];
  const sa = import.meta.env.FIREBASE_SERVICE_ACCOUNT;
  if (!sa) throw new Error('FIREBASE_SERVICE_ACCOUNT no configurado');
  return initializeApp({ credential: cert(JSON.parse(sa)) });
}

export const prerender = false;

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const id = params.id;
    if (!id) return new Response(JSON.stringify({ error: 'ID requerido' }), { status: 400 });

    const app = getAdminApp();
    const db = getFirestore(app);
    const docRef = db.collection('trash').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return new Response(JSON.stringify({ error: 'Elemento no encontrado' }), { status: 404 });
    }

    const data = doc.data()!;

    if (data.type === 'poster' && data.data?.filename) {
      const filePath = path.join(TRASH_DIR, data.data.filename);
      if (existsSync(filePath)) {
        await unlink(filePath);
      }
    }

    await docRef.delete();

    return new Response(JSON.stringify({ ok: true }), { status: 200 });

  } catch (err: any) {
    console.error('[api/trash DELETE]', err);
    return new Response(JSON.stringify({ error: err.message || 'Error al eliminar' }), { status: 500 });
  }
};

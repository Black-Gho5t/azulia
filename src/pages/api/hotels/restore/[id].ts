import type { APIRoute } from 'astro';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { rename, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const HOTELS_DIR = path.resolve('uploads/hotels');
const HOTELS_TRASH_DIR = path.resolve('uploads/hotels-trash');

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];
  const sa = import.meta.env.FIREBASE_SERVICE_ACCOUNT;
  if (!sa) throw new Error('FIREBASE_SERVICE_ACCOUNT no configurado');
  return initializeApp({ credential: cert(JSON.parse(sa)) });
}

export const prerender = false;

export const POST: APIRoute = async ({ params }) => {
  try {
    const trashId = params.id;
    if (!trashId) {
      return new Response(JSON.stringify({ ok: false, error: 'ID requerido' }), { status: 400 });
    }

    const app = getAdminApp();
    const db = getFirestore(app);
    const trashDoc = await db.collection('trash').doc(trashId).get();

    if (!trashDoc.exists) {
      return new Response(JSON.stringify({ ok: false, error: 'Elemento no encontrado en papelera' }), { status: 404 });
    }

    const trashData = trashDoc.data()!;

    if (trashData.type !== 'hotel') {
      return new Response(JSON.stringify({ ok: false, error: 'Este elemento no es un hotel' }), { status: 400 });
    }

    const data = trashData.data || {};
    const movedFilenames: string[] = Array.isArray(data.movedFilenames) ? data.movedFilenames : [];

    if (!existsSync(HOTELS_DIR)) {
      await mkdir(HOTELS_DIR, { recursive: true });
    }

    for (const filename of movedFilenames) {
      const src = path.join(HOTELS_TRASH_DIR, filename);
      const dest = path.join(HOTELS_DIR, filename);
      if (existsSync(src)) {
        await rename(src, dest);
      }
    }

    const originalId = trashData.originalId;
    await db.collection('hotels').doc(originalId).set({
      name: data.name || '',
      zone: data.zone || '',
      price: data.price || 0,
      score: data.score || 0,
      description: data.description || '',
      images: Array.isArray(data.images) ? data.images : [],
      imageFiles: Array.isArray(data.imageFiles) ? data.imageFiles : [],
      coverIndex: data.coverIndex || 0,
      perks: Array.isArray(data.perks) ? data.perks : [],
      createdAt: new Date(),
    });

    await db.collection('trash').doc(trashId).delete();

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    console.error('[api/hotels/restore]', err);
    return new Response(JSON.stringify({ ok: false, error: err.message || 'Error al restaurar' }), { status: 500 });
  }
};

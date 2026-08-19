import type { APIRoute } from 'astro';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];
  const sa = import.meta.env.FIREBASE_SERVICE_ACCOUNT;
  if (!sa) throw new Error('FIREBASE_SERVICE_ACCOUNT no configurado');
  return initializeApp({ credential: cert(JSON.parse(sa)) });
}

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const app = getAdminApp();
    const db = getFirestore(app);
    const snap = await db.collection('posters').orderBy('createdAt', 'desc').get();
    const posters = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        name: data.name || 'Poster',
        filename: data.filename || '',
        url: `/api/posters/image/${data.filename}`,
        createdAt: data.createdAt || null,
      };
    });
    return new Response(JSON.stringify({ ok: true, posters }), { status: 200 });
  } catch (err: any) {
    console.error('[api/posters GET]', err);
    return new Response(JSON.stringify({ ok: false, error: err.message, posters: [] }), { status: 500 });
  }
};

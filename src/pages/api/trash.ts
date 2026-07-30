import type { APIRoute } from 'astro';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

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

    const snap = await db.collection('trash').get();
    const now = Date.now();

    const items = snap.docs
      .map((d) => {
        const data = d.data();
        let expiresAt: string | null = null;
        if (data.expiresAt) {
          if (data.expiresAt instanceof Timestamp) {
            expiresAt = data.expiresAt.toDate().toISOString();
          } else if (typeof data.expiresAt === 'string') {
            expiresAt = data.expiresAt;
          }
        }
        let deletedAt: string | null = null;
        if (data.deletedAt) {
          if (data.deletedAt instanceof Timestamp) {
            deletedAt = data.deletedAt.toDate().toISOString();
          } else if (typeof data.deletedAt === 'string') {
            deletedAt = data.deletedAt;
          }
        }
        return {
          id: d.id,
          type: data.type || 'unknown',
          originalId: data.originalId || '',
          data: data.data || {},
          deletedAt,
          expiresAt,
        };
      })
      .filter((item) => {
        if (!item.expiresAt) return true;
        return new Date(item.expiresAt).getTime() > now;
      })
      .sort((a, b) => {
        const da = a.deletedAt ? new Date(a.deletedAt).getTime() : 0;
        const db2 = b.deletedAt ? new Date(b.deletedAt).getTime() : 0;
        return db2 - da;
      });

    return new Response(JSON.stringify({ ok: true, items }), { status: 200 });

  } catch (err: any) {
    console.error('[api/trash]', err);
    return new Response(JSON.stringify({ ok: false, error: err.message || 'Error al obtener papelera', items: [] }), { status: 500 });
  }
};

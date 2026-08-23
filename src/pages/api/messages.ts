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
    const snap = await db.collection('messages').orderBy('createdAt', 'desc').get();
    const messages = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    return new Response(JSON.stringify({ ok: true, messages }), { status: 200 });
  } catch (err: any) {
    console.error('[api/messages GET]', err);
    return new Response(JSON.stringify({ ok: false, error: err.message, messages: [] }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, services, date, people, message } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return new Response(JSON.stringify({ ok: false, error: 'Nombre requerido' }), { status: 400 });
    }

    const app = getAdminApp();
    const db = getFirestore(app);

    await db.collection('messages').add({
      name: name.trim(),
      services: Array.isArray(services) ? services : [],
      date: date || null,
      people: people ? Number(people) : null,
      message: (message || '').trim(),
      createdAt: new Date().toISOString(),
      status: 'unread',
      source: 'web',
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    console.error('[api/messages POST]', err);
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500 });
  }
};

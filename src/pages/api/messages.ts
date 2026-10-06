import type { APIRoute } from 'astro';
import { getAdminDb, verifyAdminRequest, withFirestoreRetry } from '../../lib/firebase-admin';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const auth = await verifyAdminRequest(request);
  if (!auth.ok) {
    return new Response(JSON.stringify({ ok: false, error: auth.error, messages: [] }), { status: auth.status });
  }

  try {
    const messages = await withFirestoreRetry(async (db) => {
      const snap = await db.collection('messages').orderBy('createdAt', 'desc').get();
      return snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
    });
    return new Response(JSON.stringify({ ok: true, messages }), { status: 200 });
  } catch (err: any) {
    console.error('[api/messages GET]', err);
    return new Response(JSON.stringify({ ok: false, error: err.message, messages: [] }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, services, date, people, contactType, contactInfo, message } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return new Response(JSON.stringify({ ok: false, error: 'Nombre requerido' }), { status: 400 });
    }

    await withFirestoreRetry(async (db) => {
      await db.collection('messages').add({
        name: name.trim(),
        services: Array.isArray(services) ? services : [],
        date: date || null,
        people: people ? Number(people) : null,
        contactType: contactType || null,
        contactInfo: (contactInfo || '').trim() || null,
        message: (message || '').trim(),
        createdAt: new Date().toISOString(),
        status: 'unread',
        source: 'web',
      });
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    console.error('[api/messages POST]', err);
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500 });
  }
};

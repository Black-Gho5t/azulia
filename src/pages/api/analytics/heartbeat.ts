import type { APIRoute } from 'astro';
import { getAdminDb } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ ok: false, error: 'Cuerpo inválido' }), { status: 400 });
    }

    const { sessionId, path, isNewVisit } = body;
    if (!sessionId || typeof sessionId !== 'string') {
      return new Response(JSON.stringify({ ok: false, error: 'sessionId requerido' }), { status: 400 });
    }

    const db = getAdminDb();
    const now = Date.now();

    // 1. Update presence
    await db.collection('site_presence').doc(sessionId).set({
      sessionId,
      path: typeof path === 'string' ? path.slice(0, 150) : '/',
      lastSeen: now,
    }, { merge: true });

    // 2. Increment daily visit count if this is a new visit
    if (isNewVisit) {
      const today = new Date().toISOString().split('T')[0];
      await db.collection('site_daily_visits').doc(today).set({
        date: today,
        count: FieldValue.increment(1),
        lastUpdated: now,
      }, { merge: true });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    console.error('[api/analytics/heartbeat POST]', err);
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500 });
  }
};

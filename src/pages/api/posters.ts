import type { APIRoute } from 'astro';
import { getAdminDb } from '../../lib/firebase-admin';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const db = getAdminDb();
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

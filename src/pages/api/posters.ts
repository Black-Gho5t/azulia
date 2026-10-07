import type { APIRoute } from 'astro';
import { getAdminDb, withFirestoreRetry } from '../../lib/firebase-admin';
import { serverCache } from '../../lib/server-cache';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const cachedPosters = serverCache.get<any[]>('posters:all');
    if (cachedPosters) {
      return new Response(JSON.stringify({ ok: true, posters: cachedPosters }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
          'X-Cache': 'HIT',
        },
      });
    }

    const posters = await withFirestoreRetry(async (db) => {
      const snap = await db.collection('posters').orderBy('createdAt', 'desc').get();
      return snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: data.name || 'Poster',
          filename: data.filename || '',
          url: `/api/posters/image/${data.filename}`,
          createdAt: data.createdAt || null,
        };
      });
    });

    serverCache.set('posters:all', posters, 120);

    return new Response(JSON.stringify({ ok: true, posters }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
        'X-Cache': 'MISS',
      },
    });
  } catch (err: any) {
    console.error('[api/posters GET]', err);
    return new Response(JSON.stringify({ ok: false, error: err.message, posters: [] }), { status: 500 });
  }
};

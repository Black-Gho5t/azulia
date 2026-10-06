import type { APIRoute } from 'astro';
import { getAdminDb, verifyAdminRequest, withFirestoreRetry } from '../../../lib/firebase-admin';
import { hotelsData } from '../../../components/data/hotels/hotels_data';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const auth = await verifyAdminRequest(request);
  if (!auth.ok) {
    return new Response(JSON.stringify({ ok: false, error: auth.error }), { status: auth.status });
  }

  try {
    const snap = await withFirestoreRetry(async (db) => db.collection('hotels').get());
    const existingIds = new Set(snap.docs.map(d => d.id));

    let seeded = 0;
    for (const hotel of hotelsData) {
      if (existingIds.has(hotel.id)) continue;
      await withFirestoreRetry(async (db) => {
        await db.collection('hotels').doc(hotel.id).set({
          name: hotel.name,
          zone: hotel.zone,
          price: hotel.price,
          score: hotel.score,
          description: hotel.description,
          images: hotel.images,
          imageFiles: [],
          coverIndex: hotel.coverIndex,
          perks: hotel.perks,
          createdAt: new Date(),
        });
      });
      seeded++;
    }

    return new Response(JSON.stringify({ ok: true, seeded, total: hotelsData.length }), { status: 200 });
  } catch (err: any) {
    console.error('[api/hotels/seed]', err);
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500 });
  }
};

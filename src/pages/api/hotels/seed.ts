import type { APIRoute } from 'astro';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { hotelsData } from '../../../components/data/hotels/hotels_data';

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];
  const sa = import.meta.env.FIREBASE_SERVICE_ACCOUNT;
  if (!sa) throw new Error('FIREBASE_SERVICE_ACCOUNT no configurado');
  return initializeApp({ credential: cert(JSON.parse(sa)) });
}

export const prerender = false;

export const POST: APIRoute = async () => {
  try {
    const app = getAdminApp();
    const db = getFirestore(app);

    const snap = await db.collection('hotels').get();
    const existingIds = new Set(snap.docs.map(d => d.id));

    let seeded = 0;
    for (const hotel of hotelsData) {
      if (existingIds.has(hotel.id)) continue;
      await db.collection('hotels').doc(hotel.id).set({
        name: hotel.name,
        zone: hotel.zone,
        price: hotel.price,
        score: hotel.score,
        description: hotel.description,
        image: hotel.image,
        perks: hotel.perks,
        createdAt: new Date(),
      });
      seeded++;
    }

    return new Response(JSON.stringify({ ok: true, seeded, total: hotelsData.length }), { status: 200 });
  } catch (err: any) {
    console.error('[api/hotels/seed]', err);
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500 });
  }
};

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
    const snap = await db.collection('hotels').orderBy('name').get();
    const hotels = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return new Response(JSON.stringify({ ok: true, hotels }), { status: 200 });
  } catch (err: any) {
    console.error('[api/hotels GET]', err);
    return new Response(JSON.stringify({ ok: false, error: err.message, hotels: [] }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, zone, price, score, description, image, perks } = body;

    if (!name || !zone || price == null || !description) {
      return new Response(JSON.stringify({ ok: false, error: 'Faltan campos requeridos' }), { status: 400 });
    }

    const app = getAdminApp();
    const db = getFirestore(app);
    const docRef = await db.collection('hotels').add({
      name,
      zone,
      price: Number(price),
      score: Number(score) || 0,
      description,
      image: image || '',
      perks: Array.isArray(perks) ? perks : [],
      createdAt: new Date(),
    });

    return new Response(JSON.stringify({ ok: true, id: docRef.id }), { status: 201 });
  } catch (err: any) {
    console.error('[api/hotels POST]', err);
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500 });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return new Response(JSON.stringify({ ok: false, error: 'Falta el id' }), { status: 400 });
    }

    if (data.price != null) data.price = Number(data.price);
    if (data.score != null) data.score = Number(data.score);

    const app = getAdminApp();
    const db = getFirestore(app);
    await db.collection('hotels').doc(id).update(data);

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    console.error('[api/hotels PUT]', err);
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return new Response(JSON.stringify({ ok: false, error: 'Falta el id' }), { status: 400 });
    }

    const app = getAdminApp();
    const db = getFirestore(app);
    await db.collection('hotels').doc(id).delete();

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    console.error('[api/hotels DELETE]', err);
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500 });
  }
};

import type { APIRoute } from 'astro';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { rename, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const HOTELS_DIR = path.resolve('uploads/hotels');
const HOTELS_TRASH_DIR = path.resolve('uploads/hotels-trash');

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
    const { name, zone, price, score, description, images, imageFiles, coverIndex, perks } = body;

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
      images: Array.isArray(images) ? images : [],
      imageFiles: Array.isArray(imageFiles) ? imageFiles : [],
      coverIndex: Number(coverIndex) || 0,
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
    const doc = await db.collection('hotels').doc(id).get();

    if (!doc.exists) {
      return new Response(JSON.stringify({ ok: false, error: 'Hotel no encontrado' }), { status: 404 });
    }

    const hotelData = doc.data()!;
    const images: string[] = Array.isArray(hotelData.images) ? hotelData.images : [];
    const imageFiles: string[] = Array.isArray(hotelData.imageFiles) ? hotelData.imageFiles : [];

    if (!existsSync(HOTELS_TRASH_DIR)) {
      await mkdir(HOTELS_TRASH_DIR, { recursive: true });
    }

    const movedFilenames: string[] = [];
    for (const filename of imageFiles) {
      const src = path.join(HOTELS_DIR, filename);
      const dest = path.join(HOTELS_TRASH_DIR, filename);
      if (existsSync(src)) {
        await rename(src, dest);
        movedFilenames.push(filename);
      }
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    await db.collection('trash').add({
      type: 'hotel',
      originalId: id,
      data: {
        name: hotelData.name || '',
        zone: hotelData.zone || '',
        price: hotelData.price || 0,
        score: hotelData.score || 0,
        description: hotelData.description || '',
        images: images,
        imageFiles: imageFiles,
        coverIndex: hotelData.coverIndex || 0,
        perks: hotelData.perks || [],
        movedFilenames,
      },
      deletedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    });

    await db.collection('hotels').doc(id).delete();

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    console.error('[api/hotels DELETE]', err);
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500 });
  }
};

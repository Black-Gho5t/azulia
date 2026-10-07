import type { APIRoute } from 'astro';
import { getAdminDb, verifyAdminRequest, withFirestoreRetry } from '../../lib/firebase-admin';
import { serverCache } from '../../lib/server-cache';
import { rename, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const HOTELS_DIR = path.resolve('uploads/hotels');
const HOTELS_TRASH_DIR = path.resolve('uploads/hotels-trash');

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const cachedHotels = serverCache.get<any[]>('hotels:all');
    if (cachedHotels) {
      return new Response(JSON.stringify({ ok: true, hotels: cachedHotels }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
          'X-Cache': 'HIT',
        },
      });
    }

    const hotels = await withFirestoreRetry(async (db) => {
      const snap = await db.collection('hotels').orderBy('name').get();
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    });

    serverCache.set('hotels:all', hotels, 120);

    return new Response(JSON.stringify({ ok: true, hotels }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
        'X-Cache': 'MISS',
      },
    });
  } catch (err: any) {
    console.error('[api/hotels GET]', err);
    return new Response(JSON.stringify({ ok: false, error: err.message, hotels: [] }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  const auth = await verifyAdminRequest(request);
  if (!auth.ok) {
    return new Response(JSON.stringify({ ok: false, error: auth.error }), { status: auth.status });
  }

  try {
    const body = await request.json();
    const { name, zone, price, score, description, images, imageFiles, coverIndex, perks } = body;

    if (!name || !zone || price == null || !description) {
      return new Response(JSON.stringify({ ok: false, error: 'Faltan campos requeridos' }), { status: 400 });
    }

    const docId = await withFirestoreRetry(async (db) => {
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
      return docRef.id;
    });

    serverCache.invalidate('hotels');

    return new Response(JSON.stringify({ ok: true, id: docId }), { status: 201 });
  } catch (err: any) {
    console.error('[api/hotels POST]', err);
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500 });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  const auth = await verifyAdminRequest(request);
  if (!auth.ok) {
    return new Response(JSON.stringify({ ok: false, error: auth.error }), { status: auth.status });
  }

  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return new Response(JSON.stringify({ ok: false, error: 'Falta el id' }), { status: 400 });
    }

    if (data.price != null) data.price = Number(data.price);
    if (data.score != null) data.score = Number(data.score);

    await withFirestoreRetry(async (db) => {
      await db.collection('hotels').doc(id).update(data);
    });

    serverCache.invalidate('hotels');

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    console.error('[api/hotels PUT]', err);
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  const auth = await verifyAdminRequest(request);
  if (!auth.ok) {
    return new Response(JSON.stringify({ ok: false, error: auth.error }), { status: auth.status });
  }

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return new Response(JSON.stringify({ ok: false, error: 'Falta el id' }), { status: 400 });
    }

    const doc = await withFirestoreRetry(async (d) => d.collection('hotels').doc(id).get());

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

    await withFirestoreRetry(async (d) => {
      await d.collection('trash').add({
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

      await d.collection('hotels').doc(id).delete();
    });

    serverCache.invalidate('hotels');

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    console.error('[api/hotels DELETE]', err);
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500 });
  }
};

import type { APIRoute } from 'astro';
import { getAdminDb, verifyAdminRequest, withFirestoreRetry } from '../../lib/firebase-admin';
import { serverCache } from '../../lib/server-cache';
import { rename, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const CARS_DIR = path.resolve('uploads/cars');
const CARS_TRASH_DIR = path.resolve('uploads/cars-trash');

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const cachedCars = serverCache.get<any[]>('cars:all');
    if (cachedCars) {
      return new Response(JSON.stringify({ ok: true, cars: cachedCars }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
          'X-Cache': 'HIT',
        },
      });
    }

    const cars = await withFirestoreRetry(async (db) => {
      const snap = await db.collection('cars').orderBy('model').get();
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    });

    serverCache.set('cars:all', cars, 120);

    return new Response(JSON.stringify({ ok: true, cars }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
        'X-Cache': 'MISS',
      },
    });
  } catch (err: any) {
    console.error('[api/cars GET]', err);
    return new Response(JSON.stringify({ ok: false, error: err.message, cars: [] }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  const auth = await verifyAdminRequest(request);
  if (!auth.ok) {
    return new Response(JSON.stringify({ ok: false, error: auth.error }), { status: auth.status });
  }

  try {
    const body = await request.json();
    const {
      model, year, type, transmission, seats, doors, engine, fuel,
      consumption, luggage, drivetrain, topSpeed, pricePerDay, rating,
      shortDescription, highlight, features, images, imageFiles,
    } = body;

    if (!model || !year || !type || pricePerDay == null) {
      return new Response(JSON.stringify({ ok: false, error: 'Faltan campos requeridos' }), { status: 400 });
    }

    const docId = await withFirestoreRetry(async (db) => {
      const docRef = await db.collection('cars').add({
        model,
        year: Number(year),
        type,
        transmission: transmission || 'Automatica',
        seats: Number(seats) || 5,
        doors: Number(doors) || 4,
        engine: engine || '',
        fuel: fuel || 'Gasolina',
        consumption: consumption || '',
        luggage: luggage || '',
        drivetrain: drivetrain || 'FWD',
        topSpeed: topSpeed || '',
        pricePerDay: Number(pricePerDay),
        rating: Number(rating) || 0,
        shortDescription: shortDescription || '',
        highlight: highlight || '',
        features: Array.isArray(features) ? features : [],
        images: Array.isArray(images) ? images : [],
        imageFiles: Array.isArray(imageFiles) ? imageFiles : [],
        createdAt: new Date(),
      });
      return docRef.id;
    });

    serverCache.invalidate('cars');

    return new Response(JSON.stringify({ ok: true, id: docId }), { status: 201 });
  } catch (err: any) {
    console.error('[api/cars POST]', err);
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

    if (data.pricePerDay != null) data.pricePerDay = Number(data.pricePerDay);
    if (data.rating != null) data.rating = Number(data.rating);
    if (data.year != null) data.year = Number(data.year);
    if (data.seats != null) data.seats = Number(data.seats);
    if (data.doors != null) data.doors = Number(data.doors);

    await withFirestoreRetry(async (db) => {
      await db.collection('cars').doc(id).update(data);
    });

    serverCache.invalidate('cars');

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    console.error('[api/cars PUT]', err);
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

    const doc = await withFirestoreRetry(async (db) => db.collection('cars').doc(id).get());

    if (!doc.exists) {
      return new Response(JSON.stringify({ ok: false, error: 'Auto no encontrado' }), { status: 404 });
    }

    const carData = doc.data()!;
    const images: string[] = Array.isArray(carData.images) ? carData.images : [];
    const imageFiles: string[] = Array.isArray(carData.imageFiles) ? carData.imageFiles : [];

    if (!existsSync(CARS_TRASH_DIR)) {
      await mkdir(CARS_TRASH_DIR, { recursive: true });
    }

    const movedFilenames: string[] = [];
    for (const filename of imageFiles) {
      const src = path.join(CARS_DIR, filename);
      const dest = path.join(CARS_TRASH_DIR, filename);
      if (existsSync(src)) {
        await rename(src, dest);
        movedFilenames.push(filename);
      }
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    await withFirestoreRetry(async (db) => {
      await db.collection('trash').add({
        type: 'car',
        originalId: id,
        data: {
          model: carData.model || '',
          year: carData.year || 0,
          type: carData.type || '',
          transmission: carData.transmission || '',
          seats: carData.seats || 5,
          doors: carData.doors || 4,
          engine: carData.engine || '',
          fuel: carData.fuel || '',
          consumption: carData.consumption || '',
          luggage: carData.luggage || '',
          drivetrain: carData.drivetrain || '',
          topSpeed: carData.topSpeed || '',
          pricePerDay: carData.pricePerDay || 0,
          rating: carData.rating || 0,
          shortDescription: carData.shortDescription || '',
          highlight: carData.highlight || '',
          features: carData.features || [],
          images,
          imageFiles,
          movedFilenames,
        },
        deletedAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
      });

      await db.collection('cars').doc(id).delete();
    });

    serverCache.invalidate('cars');

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    console.error('[api/cars DELETE]', err);
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500 });
  }
};

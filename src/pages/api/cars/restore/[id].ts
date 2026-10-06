import type { APIRoute } from 'astro';
import { getAdminDb, verifyAdminRequest, withFirestoreRetry } from '../../../../lib/firebase-admin';
import { rename, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const CARS_DIR = path.resolve('uploads/cars');
const CARS_TRASH_DIR = path.resolve('uploads/cars-trash');

export const prerender = false;

export const POST: APIRoute = async ({ params, request }) => {
  const auth = await verifyAdminRequest(request);
  if (!auth.ok) {
    return new Response(JSON.stringify({ ok: false, error: auth.error }), { status: auth.status });
  }

  try {
    const trashId = params.id;
    if (!trashId) {
      return new Response(JSON.stringify({ ok: false, error: 'ID requerido' }), { status: 400 });
    }

    const db = getAdminDb();
    const trashDoc = await withFirestoreRetry(async () => db.collection('trash').doc(trashId).get());

    if (!trashDoc.exists) {
      return new Response(JSON.stringify({ ok: false, error: 'Elemento no encontrado en papelera' }), { status: 404 });
    }

    const trashData = trashDoc.data()!;

    if (trashData.type !== 'car') {
      return new Response(JSON.stringify({ ok: false, error: 'Este elemento no es un auto' }), { status: 400 });
    }

    const data = trashData.data || {};
    const movedFilenames: string[] = Array.isArray(data.movedFilenames) ? data.movedFilenames : [];

    if (!existsSync(CARS_DIR)) {
      await mkdir(CARS_DIR, { recursive: true });
    }

    for (const filename of movedFilenames) {
      const src = path.join(CARS_TRASH_DIR, filename);
      const dest = path.join(CARS_DIR, filename);
      if (existsSync(src)) {
        await rename(src, dest);
      }
    }

    const originalId = trashData.originalId;
    await withFirestoreRetry(async () => {
      await db.collection('cars').doc(originalId).set({
        model: data.model || '',
        year: data.year || 0,
        type: data.type || '',
        transmission: data.transmission || '',
        seats: data.seats || 5,
        doors: data.doors || 4,
        engine: data.engine || '',
        fuel: data.fuel || '',
        consumption: data.consumption || '',
        luggage: data.luggage || '',
        drivetrain: data.drivetrain || '',
        topSpeed: data.topSpeed || '',
        pricePerDay: data.pricePerDay || 0,
        rating: data.rating || 0,
        shortDescription: data.shortDescription || '',
        highlight: data.highlight || '',
        features: Array.isArray(data.features) ? data.features : [],
        images: Array.isArray(data.images) ? data.images : [],
        imageFiles: Array.isArray(data.imageFiles) ? data.imageFiles : [],
        createdAt: new Date(),
      });

      await db.collection('trash').doc(trashId).delete();
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    console.error('[api/cars/restore]', err);
    return new Response(JSON.stringify({ ok: false, error: err.message || 'Error al restaurar' }), { status: 500 });
  }
};

import type { APIRoute } from 'astro';
import { getAdminDb, verifyAdminRequest } from '../../lib/firebase-admin';
import { initialToursCatalog } from '../../components/data/tours/all_tours_catalog';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const subpageParam = url.searchParams.get('subpage')?.toLowerCase()?.trim();

    const db = getAdminDb();
    const snap = await db.collection('tours').get();

    // If database collection is empty or missing initial catalog tours, seed missing ones
    if (snap.size < initialToursCatalog.length) {
      const existingIds = new Set(snap.docs.map((d) => d.id));
      const batch = db.batch();
      let seededCount = 0;

      for (const tour of initialToursCatalog) {
        if (!existingIds.has(tour.id)) {
          const docRef = db.collection('tours').doc(tour.id);
          batch.set(docRef, {
            ...tour,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          seededCount++;
        }
      }

      if (seededCount > 0) {
        await batch.commit();
      }

      // Re-fetch all documents
      const freshSnap = await db.collection('tours').get();
      let allDocs = freshSnap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
      allDocs.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

      if (subpageParam && subpageParam !== 'todos') {
        allDocs = allDocs.filter((t) => t.subpage === subpageParam);
      }

      return new Response(
        JSON.stringify({ ok: true, tours: allDocs, count: allDocs.length, seeded: seededCount }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let tours = snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
    tours.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

    if (subpageParam && subpageParam !== 'todos') {
      tours = tours.filter((t) => t.subpage === subpageParam);
    }

    return new Response(
      JSON.stringify({ ok: true, tours, count: tours.length }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('[api/tours GET]', err);
    // Graceful fallback to static catalog
    let fallback = initialToursCatalog;
    const url = new URL(request.url);
    const subpageParam = url.searchParams.get('subpage')?.toLowerCase()?.trim();
    if (subpageParam && subpageParam !== 'todos') {
      fallback = fallback.filter((t) => t.subpage === subpageParam);
    }
    return new Response(
      JSON.stringify({ ok: true, tours: fallback, count: fallback.length, fallback: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
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
      name,
      subpage,
      description,
      icon,
      image,
      imageFiles,
      order,
      modalTitle,
      modalImages,
      schedule,
      price,
      text,
      rating,
      duration,
      capacity,
      ageRange,
      includes,
      nearby,
      status,
    } = body;

    if (!name || !subpage || !description) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Faltan campos obligatorios (nombre, subpágina, descripción)' }),
        { status: 400 }
      );
    }

    const db = getAdminDb();
    const docRef = await db.collection('tours').add({
      name: name.trim(),
      subpage: String(subpage).toLowerCase().trim(),
      description: description.trim(),
      icon: (icon || 'explore').trim(),
      image: (image || '').trim(),
      imageFiles: Array.isArray(imageFiles) ? imageFiles : [],
      order: Number(order) || 99,
      modalTitle: (modalTitle || name).trim(),
      modalImages: Array.isArray(modalImages) ? modalImages : (image ? [image] : []),
      schedule: (schedule || '').trim(),
      price: (price || '').trim(),
      text: (text || description).trim(),
      rating: (rating || '4.8 de 5.0').trim(),
      duration: Array.isArray(duration) ? duration : [],
      capacity: (capacity || '').trim(),
      ageRange: (ageRange || '').trim(),
      includes: Array.isArray(includes) ? includes : [],
      nearby: Array.isArray(nearby) ? nearby : [],
      status: status || 'activo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ ok: true, id: docRef.id }), { status: 201 });
  } catch (err: any) {
    console.error('[api/tours POST]', err);
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
    const { id, ...updates } = body;

    if (!id) {
      return new Response(JSON.stringify({ ok: false, error: 'ID del tour requerido' }), { status: 400 });
    }

    const db = getAdminDb();
    const docRef = db.collection('tours').doc(id);
    const existing = await docRef.get();
    if (!existing.exists) {
      return new Response(JSON.stringify({ ok: false, error: 'Tour no encontrado' }), { status: 404 });
    }

    await docRef.set(
      {
        ...updates,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return new Response(JSON.stringify({ ok: true, id }), { status: 200 });
  } catch (err: any) {
    console.error('[api/tours PUT]', err);
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  const auth = await verifyAdminRequest(request);
  if (!auth.ok) {
    return new Response(JSON.stringify({ ok: false, error: auth.error }), { status: auth.status });
  }

  try {
    let id: string | null = null;
    const url = new URL(request.url);
    id = url.searchParams.get('id');

    if (!id) {
      try {
        const body = await request.json();
        id = body.id;
      } catch {}
    }

    if (!id) {
      return new Response(JSON.stringify({ ok: false, error: 'ID requerido para eliminar' }), { status: 400 });
    }

    const db = getAdminDb();
    const docRef = db.collection('tours').doc(id);
    const snap = await docRef.get();
    if (!snap.exists) {
      return new Response(JSON.stringify({ ok: false, error: 'Tour no encontrado' }), { status: 404 });
    }

    // Move to trash collection for safe retention
    await db.collection('trash').add({
      type: 'tour',
      originalId: id,
      data: snap.data(),
      deletedAt: new Date().toISOString(),
    });

    await docRef.delete();

    return new Response(JSON.stringify({ ok: true, deleted: id }), { status: 200 });
  } catch (err: any) {
    console.error('[api/tours DELETE]', err);
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500 });
  }
};

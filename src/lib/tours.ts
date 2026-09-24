import { getAdminDb } from './firebase-admin';
import { initialToursCatalog, type TourRecord } from '../components/data/tours/all_tours_catalog';

export interface FormattedTourCard {
  id: string;
  name: string;
  description: string;
  image: { src: string };
  icon: string;
}

export interface FormattedModalEntry {
  id: string;
  title: string;
  images: string[];
  text: string;
  schedule: string;
  price: string;
  rating?: string;
  duration?: string[];
  capacity?: string;
  ageRange?: string;
  includes?: string[];
  nearby?: string[];
}

export interface SubpageToursResult {
  tours: FormattedTourCard[];
  modals: FormattedModalEntry[];
}

/**
 * Fetch tours and modals for a given subpage directly from Firestore,
 * with automatic fallback to initial catalog to ensure 100% uptime.
 */
export async function getToursForSubpage(subpage: string): Promise<SubpageToursResult> {
  const normSub = subpage.toLowerCase().trim();

  try {
    const db = getAdminDb();
    const snap = await db
      .collection('tours')
      .where('subpage', '==', normSub)
      .get();

    if (!snap.empty) {
      const records = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<TourRecord, 'id'>),
      }));

      // Sort by order ascending
      records.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

      const tours: FormattedTourCard[] = records
        .filter((r) => r.status !== 'inactivo')
        .map((r) => ({
          id: r.id,
          name: r.name,
          description: r.description,
          image: { src: r.image || '' },
          icon: r.icon || 'explore',
        }));

      const modals: FormattedModalEntry[] = records
        .filter((r) => r.status !== 'inactivo')
        .map((r) => ({
          id: r.id,
          title: r.modalTitle || r.name,
          images: Array.isArray(r.modalImages) && r.modalImages.length ? r.modalImages : [r.image],
          text: r.text || r.description,
          schedule: r.schedule || '',
          price: r.price || '',
          rating: r.rating || '4.8 de 5.0',
          duration: Array.isArray(r.duration) ? r.duration : [],
          capacity: r.capacity || '',
          ageRange: r.ageRange || '',
          includes: Array.isArray(r.includes) ? r.includes : [],
          nearby: Array.isArray(r.nearby) ? r.nearby : [],
        }));

      if (tours.length > 0) {
        return { tours, modals };
      }
    }
  } catch (err) {
    console.warn(`[getToursForSubpage] Fallback a catálogo para subpágina "${subpage}":`, err);
  }

  // Fallback to static catalog if DB is empty or fails
  const catalogSubset = initialToursCatalog.filter((t) => t.subpage === normSub);
  return {
    tours: catalogSubset.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      image: { src: r.image },
      icon: r.icon,
    })),
    modals: catalogSubset.map((r) => ({
      id: r.id,
      title: r.modalTitle,
      images: r.modalImages,
      text: r.text,
      schedule: r.schedule,
      price: r.price,
      rating: r.rating,
      duration: r.duration,
      capacity: r.capacity,
      ageRange: r.ageRange,
      includes: r.includes,
      nearby: r.nearby,
    })),
  };
}

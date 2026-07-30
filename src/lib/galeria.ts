import { db } from './firebase';
import { collection, doc, deleteDoc, getDoc, getDocs, query, orderBy, serverTimestamp, addDoc, Timestamp, setDoc, updateDoc } from 'firebase/firestore';

export interface UploadProgress {
  progress: number;
  id?: string;
  name?: string;
  filename?: string;
  error?: string;
}

export function uploadPoster(
  file: File,
  name: string,
  onProgress: (state: UploadProgress) => void,
): { cancel: () => void } {
  const controller = new AbortController();
  let cancelled = false;

  (async () => {
    try {
      onProgress({ progress: 10 });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name);

      onProgress({ progress: 30 });

      const resp = await fetch('/api/posters/upload', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      onProgress({ progress: 90 });

      const result = await resp.json();
      if (!resp.ok || !result.ok) {
        throw new Error(result.error || 'Error al subir');
      }

      onProgress({ progress: 100, id: result.id, name: result.name, filename: result.filename });
    } catch (err: any) {
      if (err.name !== 'AbortError' && !cancelled) {
        onProgress({ progress: 0, error: err.message || 'Error al subir' });
      }
    }
  })();

  return {
    cancel: () => {
      cancelled = true;
      controller.abort();
    },
  };
}

export async function deletePoster(id: string): Promise<void> {
  const resp = await fetch(`/api/posters/${id}`, { method: 'DELETE' });
  if (!resp.ok) {
    const result = await resp.json();
    throw new Error(result.error || 'Error al eliminar');
  }
}

export async function renamePoster(id: string, name: string): Promise<void> {
  const resp = await fetch(`/api/posters/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!resp.ok) {
    const result = await resp.json();
    throw new Error(result.error || 'Error al renombrar');
  }
}

export async function getPostersFromDisk(): Promise<{ id: string; name: string; filename: string; url: string; createdAt: Date | null }[]> {
  const q = query(collection(db, 'posters'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const raw = d.data();
    let created: Date | null = null;
    if (raw.createdAt) {
      if (typeof raw.createdAt === 'string') created = new Date(raw.createdAt);
      else if (raw.createdAt?.toDate) created = raw.createdAt.toDate();
    }
    return { id: d.id, name: raw.name, filename: raw.filename, url: `/api/posters/image/${raw.filename}`, createdAt: created };
  });
}

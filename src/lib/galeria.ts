import { db, storage } from './firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, doc, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

export interface UploadProgress {
  progress: number;
  url?: string;
  error?: string;
}

export function uploadPoster(
  file: File,
  name: string,
  onProgress: (state: UploadProgress) => void,
): { cancel: () => void } {
  const ext = file.name.split('.').pop() || 'webp';
  const filename = `${Date.now()}_${name.replace(/[^a-zA-Z0-9_-]/g, '_')}.${ext}`;
  const storageRef = ref(storage, `posters/${filename}`);
  const task = uploadBytesResumable(storageRef, file);

  task.on(
    'state_changed',
    (snap) => {
      const progress = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
      onProgress({ progress });
    },
    (error) => {
      onProgress({ progress: 0, error: error.message });
    },
    async () => {
      const url = await getDownloadURL(task.snapshot.ref);
      await addDoc(collection(db, 'posters'), {
        name,
        url,
        storagePath: `posters/${filename}`,
        createdAt: serverTimestamp(),
      });
      onProgress({ progress: 100, url });
    },
  );

  return { cancel: () => task.cancel() };
}

export async function deletePoster(id: string, storagePath: string): Promise<void> {
  await deleteObject(ref(storage, storagePath));
  await deleteDoc(doc(db, 'posters', id));
}

import { db } from './firebase';
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';

export interface MessageData {
  id?: string;
  name: string;
  contact: string;
  interests: string[];
  message: string;
  status: 'nuevo' | 'pendiente' | 'leido';
  createdAt: Date | null;
}

export interface AdminProfile {
  email: string;
  name: string;
  role: 'admin' | 'superadmin';
  status: 'active' | 'disabled' | 'pending';
  createdAt: Date | null;
}

export interface PosterData {
  id?: string;
  name: string;
  url: string;
  storagePath: string;
  createdAt: Date | null;
}

export interface TrashItem {
  id?: string;
  type: 'message' | 'admin' | 'poster';
  originalId: string;
  data: Record<string, unknown>;
  deletedAt: Date | null;
  expiresAt: Date | null;
}

export async function getMessages(): Promise<MessageData[]> {
  const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate() ?? null } as MessageData));
}

export async function updateMessageStatus(id: string, status: 'nuevo' | 'pendiente' | 'leido'): Promise<void> {
  await updateDoc(doc(db, 'messages', id), { status });
}

export async function trashMessage(id: string): Promise<void> {
  const ref = doc(db, 'messages', id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data();
  const now = Date.now();
  await addDoc(collection(db, 'trash'), {
    type: 'message',
    originalId: id,
    data,
    deletedAt: serverTimestamp(),
    expiresAt: new Timestamp(Math.floor(now / 1000) + 30 * 86400, 0),
  });
  await deleteDoc(ref);
}

export async function getAdmins(): Promise<AdminProfile[]> {
  const q = query(collection(db, 'admins'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ email: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate() ?? null } as AdminProfile));
}

export async function toggleAdminStatus(email: string, currentStatus: string): Promise<void> {
  const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
  await updateDoc(doc(db, 'admins', email), { status: newStatus });
  if (newStatus === 'disabled') {
    const now = Date.now();
    await addDoc(collection(db, 'trash'), {
      type: 'admin',
      originalId: email,
      data: { email, previousStatus: currentStatus },
      deletedAt: serverTimestamp(),
      expiresAt: new Timestamp(Math.floor(now / 1000) + 30 * 86400, 0),
    });
  }
}

export async function getPosters(): Promise<PosterData[]> {
  const q = query(collection(db, 'posters'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate() ?? null } as PosterData));
}

export async function trashPoster(id: string): Promise<void> {
  const ref = doc(db, 'posters', id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data();
  const now = Date.now();
  await addDoc(collection(db, 'trash'), {
    type: 'poster',
    originalId: id,
    data,
    deletedAt: serverTimestamp(),
    expiresAt: new Timestamp(Math.floor(now / 1000) + 30 * 86400, 0),
  });
  await deleteDoc(ref);
}

export async function getTrashItems(): Promise<TrashItem[]> {
  const now = Timestamp.now();
  const q = query(collection(db, 'trash'), where('expiresAt', '>', now), orderBy('expiresAt', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data(), deletedAt: d.data().deletedAt?.toDate() ?? null, expiresAt: d.data().expiresAt?.toDate() ?? null } as TrashItem));
}

export async function restoreFromTrash(id: string, type: string, originalId: string, data: Record<string, unknown>): Promise<void> {
  if (type === 'message') {
    await setDoc(doc(db, 'messages', originalId), { ...data, status: 'nuevo' });
  } else if (type === 'admin') {
    await updateDoc(doc(db, 'admins', originalId), { status: 'active' });
  } else if (type === 'poster') {
    await setDoc(doc(db, 'posters', originalId), data);
  }
  await deleteDoc(doc(db, 'trash', id));
}



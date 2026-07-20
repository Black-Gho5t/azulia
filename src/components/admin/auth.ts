import { auth, db } from '../../lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';

export interface AdminUser {
  email: string;
  name: string;
  role: 'admin' | 'superadmin';
  createdAt: string;
}

export interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
}

function generateConfirmToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

async function buildAuthState(email: string): Promise<AuthState> {
  const docSnap = await getDoc(doc(db, 'admins', email));
  if (!docSnap.exists() || docSnap.data().status !== 'active') {
    return { user: null, isAuthenticated: false };
  }
  const data = docSnap.data();
  return {
    user: {
      email,
      name: data.name,
      role: data.role,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || '',
    },
    isAuthenticated: true,
  };
}

export function getAuthState(): Promise<AuthState> {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      unsub();
      if (!user?.email) return resolve({ user: null, isAuthenticated: false });
      resolve(await buildAuthState(user.email.toLowerCase()));
    });
    setTimeout(() => resolve({ user: null, isAuthenticated: false }), 4000);
  });
}

export function onAuthChange(cb: (state: AuthState) => void): () => void {
  return onAuthStateChanged(auth, async (user) => {
    if (!user?.email) return cb({ user: null, isAuthenticated: false });
    cb(await buildAuthState(user.email.toLowerCase()));
  });
}

export async function signIn(email: string, password: string): Promise<{ user: AdminUser } | { error: string; pending?: boolean }> {
  const normalizedEmail = email.toLowerCase().trim();

  try {
    const cred = await signInWithEmailAndPassword(auth, normalizedEmail, password);
    const adminRef = doc(db, 'admins', normalizedEmail);
    const adminSnap = await getDoc(adminRef);

    // First login for manually-created auth user (eg default admin)
    if (!adminSnap.exists()) {
      const newUser = {
        name: cred.user.displayName || 'Administrador',
        role: 'superadmin' as const,
        status: 'active',
        uid: cred.user.uid,
        createdAt: serverTimestamp(),
      };
      await setDoc(adminRef, newUser);
      return {
        user: { email: normalizedEmail, name: newUser.name, role: newUser.role, createdAt: new Date().toISOString() },
      };
    }

    const data = adminSnap.data();
    if (data.status === 'pending') {
      await fbSignOut(auth);
      return { error: 'Cuenta pendiente de confirmación. Revisa tu correo.', pending: true };
    }
    if (data.status !== 'active') {
      await fbSignOut(auth);
      return { error: 'Cuenta deshabilitada. Contacta al administrador.' };
    }

    return {
      user: {
        email: normalizedEmail,
        name: data.name,
        role: data.role,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || '',
      },
    };
  } catch (err: any) {
    const code = err.code;
    if (code?.includes('user-not-found') || code?.includes('wrong-password') || code?.includes('invalid-credential')) {
      return { error: 'Credenciales incorrectas. Verifica tu correo y contraseña.' };
    }
    if (code === 'auth/too-many-requests') {
      return { error: 'Demasiados intentos. Intenta más tarde.' };
    }
    return { error: 'Error de conexión. Intenta nuevamente.' };
  }
}

export async function signOut(): Promise<void> {
  await fbSignOut(auth);
}

export async function registerUser(
  email: string,
  password: string,
  name: string
): Promise<{ pendingToken: string; email: string; name: string } | { error: string }> {
  const normalizedEmail = email.toLowerCase().trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return { error: 'Correo inválido' };
  if (password.length < 8) return { error: 'La contraseña debe tener al menos 8 caracteres' };
  if (name.trim().length < 2) return { error: 'El nombre debe tener al menos 2 caracteres' };

  try {
    const cred = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
    const token = generateConfirmToken();
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

    await setDoc(doc(db, 'admins', normalizedEmail), {
      name: name.trim(),
      role: 'admin',
      status: 'pending',
      uid: cred.user.uid,
      createdAt: serverTimestamp(),
    });

    await setDoc(doc(db, 'confirm_tokens', token), {
      email: normalizedEmail,
      expiresAt,
    });

    await fbSignOut(auth);
    return { pendingToken: token, email: normalizedEmail, name: name.trim() };
  } catch (err: any) {
    const code = err.code;
    if (code === 'auth/email-already-in-use') return { error: 'Este correo ya está registrado' };
    if (code === 'auth/weak-password') return { error: 'La contraseña es demasiado débil' };
    return { error: 'Error al registrar. Intenta de nuevo.' };
  }
}

export async function confirmUser(token: string, email: string): Promise<{ success: true; name: string } | { error: string }> {
  const normalizedEmail = email.toLowerCase().trim();

  try {
    const tokenRef = doc(db, 'confirm_tokens', token);
    const tokenSnap = await getDoc(tokenRef);

    if (!tokenSnap.exists()) return { error: 'Enlace inválido o ya fue usado.' };
    if (tokenSnap.data().email !== normalizedEmail) return { error: 'Token no corresponde a este correo.' };
    if (Date.now() > tokenSnap.data().expiresAt) {
      await deleteDoc(tokenRef);
      return { error: 'El enlace ha expirado (24h). Regístrate de nuevo.' };
    }

    const adminRef = doc(db, 'admins', normalizedEmail);
    const adminSnap = await getDoc(adminRef);
    if (!adminSnap.exists()) return { error: 'Cuenta no encontrada.' };

    await updateDoc(adminRef, { status: 'active' });
    await deleteDoc(tokenRef);

    return { success: true, name: adminSnap.data().name };
  } catch (err: any) {
    console.error('[confirmUser] Error:', err);
    const msg = err?.code ? `Error ${err.code}` : (err?.message || 'Error desconocido');
    return { error: `Error al confirmar: ${msg}. Verifica la consola (F12) para más detalles.` };
  }
}

import { initializeApp, cert, getApps, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';

let _app: App | null = null;
let _db: Firestore | null = null;
let _auth: Auth | null = null;

export function getAdminApp(): App {
  if (_app) return _app;
  if (getApps().length > 0) {
    _app = getApps()[0];
    return _app;
  }

  const sa = import.meta.env.FIREBASE_SERVICE_ACCOUNT;
  if (!sa) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT no está configurado en las variables de entorno.');
  }

  let creds: any;
  try {
    creds = typeof sa === 'string' ? JSON.parse(sa) : sa;
  } catch (err: any) {
    throw new Error(`Error al parsear FIREBASE_SERVICE_ACCOUNT: ${err.message}`);
  }

  // Ensure newlines in private key are correctly interpreted
  if (creds.private_key && typeof creds.private_key === 'string' && creds.private_key.includes('\\n')) {
    creds.private_key = creds.private_key.replace(/\\n/g, '\n');
  }

  _app = initializeApp({ credential: cert(creds) });
  return _app;
}

export function getAdminDb(): Firestore {
  if (!_db) {
    _db = getFirestore(getAdminApp());
  }
  return _db;
}

export function getAdminAuth(): Auth {
  if (!_auth) {
    _auth = getAuth(getAdminApp());
  }
  return _auth;
}

export const adminDb = {
  get instance() {
    return getAdminDb();
  },
  collection: (name: string) => getAdminDb().collection(name),
  doc: (path: string) => getAdminDb().doc(path),
};

export interface AdminAuthResult {
  ok: boolean;
  status: number;
  error?: string;
  user?: {
    uid: string;
    email: string;
    role?: string;
  };
}

/**
 * Validates that an incoming HTTP request has a valid Firebase ID Token
 * and that the token belongs to an active administrator.
 */
export async function verifyAdminRequest(request: Request): Promise<AdminAuthResult> {
  try {
    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { ok: false, status: 401, error: 'No autorizado: Token de sesión ausente' };
    }

    const token = authHeader.substring(7).trim();
    if (!token) {
      return { ok: false, status: 401, error: 'No autorizado: Token vacío' };
    }

    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(token);

    if (!decoded.email) {
      return { ok: false, status: 403, error: 'Token no contiene correo electrónico' };
    }

    const normalizedEmail = decoded.email.toLowerCase().trim();
    const db = getAdminDb();
    const adminDoc = await db.collection('admins').doc(normalizedEmail).get();

    if (!adminDoc.exists) {
      return { ok: false, status: 403, error: 'Usuario no registrado como administrador' };
    }

    const adminData = adminDoc.data();
    if (adminData?.status !== 'active') {
      return { ok: false, status: 403, error: 'Cuenta de administrador inactiva o deshabilitada' };
    }

    return {
      ok: true,
      status: 200,
      user: {
        uid: decoded.uid,
        email: normalizedEmail,
        role: adminData?.role || 'admin',
      },
    };
  } catch (err: any) {
    console.error('[verifyAdminRequest error]', err.message);
    return { ok: false, status: 401, error: 'Token inválido o sesión expirada' };
  }
}

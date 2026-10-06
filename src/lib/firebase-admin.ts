import { initializeApp, cert, getApps, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';

let _app: App | null = null;
let _db: Firestore | null = null;
let _auth: Auth | null = null;

/**
 * Normaliza y analiza las credenciales del Service Account de Firebase.
 * Soporta JSON plano, variables con saltos de línea escapados (comunes en Windows/.env),
 * y formato Base64.
 */
function parseServiceAccount(rawSa: unknown): Record<string, any> {
  if (typeof rawSa === 'object' && rawSa !== null) {
    return rawSa as Record<string, any>;
  }

  if (typeof rawSa !== 'string') {
    throw new Error('FIREBASE_SERVICE_ACCOUNT no está configurado o tiene un tipo no válido.');
  }

  const trimmed = rawSa.trim();

  // Intento 1: Parseo directo de JSON
  try {
    const parsed = JSON.parse(trimmed);
    if (parsed.private_key && typeof parsed.private_key === 'string' && parsed.private_key.includes('\\n')) {
      parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
    }
    return parsed;
  } catch (_) {
    // Si falla, verificar si está en Base64
    try {
      const decoded = Buffer.from(trimmed, 'base64').toString('utf-8');
      const parsed = JSON.parse(decoded);
      if (parsed.private_key && typeof parsed.private_key === 'string' && parsed.private_key.includes('\\n')) {
        parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
      }
      return parsed;
    } catch (_) {
      // Si aún falla, intentar reparar saltos de línea sin escapar
      try {
        const cleaned = trimmed.replace(/\r?\n/g, '\\n');
        const parsed = JSON.parse(cleaned);
        if (parsed.private_key && typeof parsed.private_key === 'string' && parsed.private_key.includes('\\n')) {
          parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
        }
        return parsed;
      } catch (finalErr: any) {
        throw new Error(`Error al procesar FIREBASE_SERVICE_ACCOUNT: ${finalErr.message}`);
      }
    }
  }
}

export function getAdminApp(): App {
  if (_app) return _app;
  if (getApps().length > 0) {
    _app = getApps()[0];
    return _app;
  }

  const rawSa =
    import.meta.env.FIREBASE_SERVICE_ACCOUNT ||
    (typeof process !== 'undefined' ? process.env?.FIREBASE_SERVICE_ACCOUNT : undefined);

  if (!rawSa) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT no está configurado en las variables de entorno.');
  }

  const saConfig = parseServiceAccount(rawSa);
  _app = initializeApp({ credential: cert(saConfig) });
  return _app;
}

export function getAdminDb(): Firestore {
  if (!_db) {
    const db = getFirestore(getAdminApp());
    try {
      db.settings({
        ignoreUndefinedProperties: true,
      });
    } catch (_) {
      // Si ya fue configurado por otra llamada previa, se ignora
    }
    _db = db;
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

/**
 * Reintenta operaciones de Firestore en el servidor ante microcortes o errores transitorios de gRPC.
 */
export async function withFirestoreRetry<T>(
  operation: (db: Firestore) => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 500
): Promise<T> {
  const db = getAdminDb();
  let attempt = 0;

  while (true) {
    try {
      return await operation(db);
    } catch (err: any) {
      attempt++;
      const code = err?.code;
      const isTransient =
        code === 14 || // UNAVAILABLE
        code === 4 ||  // DEADLINE_EXCEEDED
        code === 'unavailable' ||
        err?.message?.includes('ETIMEDOUT') ||
        err?.message?.includes('ECONNRESET') ||
        err?.message?.includes('socket hang up');

      if (attempt >= maxRetries || !isTransient) {
        throw err;
      }

      console.warn(`[Firestore Admin] Error transitorio detectado (${err.message}). Reintento ${attempt}/${maxRetries}...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs * Math.pow(1.5, attempt - 1)));
    }
  }
}

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

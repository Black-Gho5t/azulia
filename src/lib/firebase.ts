import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  memoryLocalCache,
  enableNetwork,
  getFirestore,
  type Firestore,
} from 'firebase/firestore';
import { getAuth, browserLocalPersistence, setPersistence, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID || '',
};

// 1. Singleton pattern para FirebaseApp (previene app/duplicate-app error)
export const app: FirebaseApp = getApps().length > 0 
  ? getApp() 
  : initializeApp(firebaseConfig);

// 2. Inicialización blindada de Firestore con caché persistente offline
function createFirestoreInstance(): Firestore {
  if (typeof window !== 'undefined') {
    try {
      return initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      });
    } catch (err) {
      console.warn('[Firebase] Fallback a caché en memoria para Firestore:', err);
      try {
        return initializeFirestore(app, {
          localCache: memoryLocalCache(),
        });
      } catch {
        return getFirestore(app);
      }
    }
  }
  return getFirestore(app);
}

export const db: Firestore = createFirestoreInstance();

// 3. Inicialización de Firebase Auth con persistencia local
export const auth: Auth = getAuth(app);
if (typeof window !== 'undefined') {
  try {
    setPersistence(auth, browserLocalPersistence).catch((err) => {
      console.warn('[Firebase] No se pudo establecer persistencia local de sesión:', err);
    });
  } catch (err) {
    console.warn('[Firebase Auth]:', err);
  }
}

// 4. Inicialización de Firebase Storage
export const storage: FirebaseStorage = getStorage(app);

// 5. Monitoreo y reconexión automática ante caídas de red en el cliente
if (typeof window !== 'undefined') {
  window.addEventListener('online', async () => {
    try {
      await enableNetwork(db);
      console.info('[Firebase] Conexión restaurada exitosamente.');
    } catch (err) {
      console.warn('[Firebase] Error al reactivar red Firestore:', err);
    }
  });

  window.addEventListener('offline', () => {
    console.info('[Firebase] Modo sin conexión activado (usando caché local).');
  });
}

/**
 * Fuerza la verificación y reconexión con los servidores de Firestore.
 */
export async function ensureOnline(): Promise<boolean> {
  if (typeof window === 'undefined') return true;
  try {
    await enableNetwork(db);
    return true;
  } catch {
    return false;
  }
}

/**
 * Ejecuta una operación de Firestore con reintentos automáticos y backoff exponencial.
 * Protege contra microcortes de red temporales.
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 800
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await operation();
    } catch (err: any) {
      attempt++;
      const isTransient =
        err?.code === 'unavailable' ||
        err?.code === 'deadline-exceeded' ||
        err?.message?.includes('offline') ||
        err?.message?.includes('network');

      if (attempt >= maxRetries || !isTransient) {
        throw err;
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs * Math.pow(1.5, attempt - 1)));
      if (typeof window !== 'undefined') {
        try {
          await enableNetwork(db);
        } catch (_) {}
      }
    }
  }
}


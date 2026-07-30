import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { unlink, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const TRASH_DIR = path.resolve('uploads/posters-trash');

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];
  const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!sa) throw new Error('FIREBASE_SERVICE_ACCOUNT no configurado');
  return initializeApp({ credential: cert(JSON.parse(sa)) });
}

async function cleanup() {
  const app = getAdminApp();
  const db = getFirestore(app);

  const now = Timestamp.now();
  const expiredSnap = await db.collection('trash')
    .where('expiresAt', '<=', now)
    .get();

  console.log(`Encontrados ${expiredSnap.size} elementos expirados`);

  for (const doc of expiredSnap.docs) {
    const data = doc.data();
    if (data.type === 'poster' && data.data?.filename) {
      const filePath = path.join(TRASH_DIR, data.data.filename);
      if (existsSync(filePath)) {
        await unlink(filePath);
        console.log(`  Eliminado archivo: ${data.data.filename}`);
      }
    }
    await doc.ref.delete();
    console.log(`  Eliminado trash entry: ${doc.id}`);
  }

  // Limpiar archivos huérfanos en trash que no tienen entrada en Firestore
  if (existsSync(TRASH_DIR)) {
    const files = await readdir(TRASH_DIR);
    const trashDocs = await db.collection('trash').where('type', '==', 'poster').get();
    const knownFilenames = new Set(trashDocs.docs.map(d => d.data().data?.filename).filter(Boolean));

    for (const file of files) {
      if (!knownFilenames.has(file)) {
        await unlink(path.join(TRASH_DIR, file));
        console.log(`  Eliminado archivo huérfano: ${file}`);
      }
    }
  }

  console.log('Limpieza completada');
}

cleanup().catch((err) => {
  console.error('Error en limpieza:', err);
  process.exit(1);
});

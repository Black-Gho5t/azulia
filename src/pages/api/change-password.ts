import type { APIRoute } from 'astro';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const FIREBASE_API_KEY = import.meta.env.PUBLIC_FIREBASE_API_KEY;

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];
  const sa = import.meta.env.FIREBASE_SERVICE_ACCOUNT;
  if (!sa) throw new Error('FIREBASE_SERVICE_ACCOUNT no configurado');
  return initializeApp({ credential: cert(JSON.parse(sa)) });
}

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { targetEmail, newPassword, adminEmail, adminPassword } = await request.json();

    if (!targetEmail || !newPassword || !adminEmail || !adminPassword) {
      return new Response(JSON.stringify({ error: 'Faltan campos' }), { status: 400 });
    }

    if (newPassword.length < 8) {
      return new Response(JSON.stringify({ error: 'La contraseña debe tener al menos 8 caracteres' }), { status: 400 });
    }

    const verifyRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword, returnSecureToken: false }),
      }
    );

    if (!verifyRes.ok) {
      return new Response(JSON.stringify({ error: 'Contraseña incorrecta' }), { status: 401 });
    }

    const app = getAdminApp();
    const auth = getAuth(app);

    const userRecord = await auth.getUserByEmail(targetEmail);
    await auth.updateUser(userRecord.uid, { password: newPassword });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    console.error('[api/change-password]', err);
    return new Response(JSON.stringify({ error: err.message || 'Error interno' }), { status: 500 });
  }
};

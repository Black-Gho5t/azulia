import { auth } from './firebase';

/**
 * Returns authorization headers containing the current admin user's Firebase ID Token.
 */
export async function getAdminAuthHeader(): Promise<Record<string, string>> {
  let user = auth.currentUser;
  if (!user) {
    await new Promise<void>((resolve) => {
      const unsub = auth.onAuthStateChanged((u) => {
        unsub();
        user = u;
        resolve();
      });
      setTimeout(resolve, 2500);
    });
  }

  if (!user) return {};
  try {
    const token = await user.getIdToken();
    return { 'Authorization': `Bearer ${token}` };
  } catch {
    return {};
  }
}

/**
 * Custom fetch wrapper that automatically injects the Bearer ID Token for admin endpoints.
 */
export async function adminFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const authHeader = await getAdminAuthHeader();
  const headers = new Headers(init.headers || {});
  for (const [key, value] of Object.entries(authHeader)) {
    headers.set(key, value);
  }
  return fetch(url, { ...init, headers });
}

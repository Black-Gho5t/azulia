const AUTH_KEY = 'azulia_admin_auth';
const TOKEN_KEY = 'azulia_admin_token';
const USERS_KEY = 'azulia_active_users';
const PENDING_KEY = 'azulia_pending_users';
const CONFIRM_EXPIRY_MS = 24 * 60 * 60 * 1000;

export interface AdminUser {
  email: string;
  name: string;
  role: 'admin' | 'superadmin';
  createdAt: string;
}

export interface AuthState {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface UserRecord extends AdminUser {
  password: string;
}

interface PendingUser {
  email: string;
  name: string;
  password: string;
  token: string;
  createdAt: number;
}

function generateSessionToken(): string {
  return btoa(JSON.stringify({
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    iat: Date.now(),
    nonce: Math.random().toString(36).substring(2, 10)
  }));
}

function generateConfirmToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

function parseToken(token: string): { exp: number } | null {
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
}

export function isTokenValid(token: string): boolean {
  const payload = parseToken(token);
  if (!payload) return false;
  return payload.exp > Date.now();
}

export function getAuthState(): AuthState {
  if (typeof window === 'undefined') {
    return { user: null, token: null, isAuthenticated: false };
  }
  const token = localStorage.getItem(TOKEN_KEY);
  const userStr = localStorage.getItem(AUTH_KEY);
  if (!token || !userStr) {
    return { user: null, token: null, isAuthenticated: false };
  }
  if (!isTokenValid(token)) {
    clearAuth();
    return { user: null, token: null, isAuthenticated: false };
  }
  try {
    const user = JSON.parse(userStr) as AdminUser;
    return { user, token, isAuthenticated: true };
  } catch {
    clearAuth();
    return { user: null, token: null, isAuthenticated: false };
  }
}

export function setAuth(user: AdminUser, token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export function requireAuth(redirectTo = '/admin/login'): AuthState {
  const auth = getAuthState();
  if (!auth.isAuthenticated && typeof window !== 'undefined') {
    window.location.href = redirectTo;
  }
  return auth;
}

export function redirectIfAuthenticated(redirectTo = '/admin'): void {
  const auth = getAuthState();
  if (auth.isAuthenticated && typeof window !== 'undefined') {
    window.location.href = redirectTo;
  }
}

// --- Active users ---

function loadActiveUsers(): Map<string, UserRecord> {
  if (typeof window === 'undefined') return new Map();
  try {
    const stored = localStorage.getItem(USERS_KEY);
    if (stored) {
      const arr = JSON.parse(stored);
      return new Map(arr.map((u: any) => [u.email, u]));
    }
  } catch {}
  return new Map();
}

function saveActiveUsers(users: Map<string, UserRecord>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(Array.from(users.values())));
}

// --- Pending users ---

function loadPendingUsers(): Map<string, PendingUser> {
  if (typeof window === 'undefined') return new Map();
  try {
    const stored = localStorage.getItem(PENDING_KEY);
    if (stored) {
      const arr = JSON.parse(stored);
      return new Map(arr.map((u: any) => [u.email, u]));
    }
  } catch {}
  return new Map();
}

function savePendingUsers(users: Map<string, PendingUser>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PENDING_KEY, JSON.stringify(Array.from(users.values())));
}

function cleanExpiredPending(): void {
  const now = Date.now();
  const pending = loadPendingUsers();
  let changed = false;
  for (const [email, user] of pending) {
    if (now - user.createdAt > CONFIRM_EXPIRY_MS) {
      pending.delete(email);
      changed = true;
    }
  }
  if (changed) savePendingUsers(pending);
}

// --- Default admin ---

if (typeof window !== 'undefined' && !localStorage.getItem('azulia_admin_seeded')) {
  const users = loadActiveUsers();
  if (!users.has('admin@azulia.com')) {
    users.set('admin@azulia.com', {
      email: 'admin@azulia.com',
      name: 'Administrador Principal',
      role: 'superadmin',
      createdAt: new Date().toISOString(),
      password: 'azulia2024'
    });
    saveActiveUsers(users);
  }
  localStorage.setItem('azulia_admin_seeded', 'true');
}

// --- Public API ---

export async function authenticateUser(
  email: string,
  password: string
): Promise<{ user: AdminUser; token: string } | null | { pending: true }> {
  const users = loadActiveUsers();
  const normalizedEmail = email.toLowerCase();
  const record = users.get(normalizedEmail);

  if (!record || record.password !== password) {
    // Check if user is pending confirmation
    cleanExpiredPending();
    const pending = loadPendingUsers();
    if (pending.has(normalizedEmail)) {
      return { pending: true };
    }
    return null;
  }

  const { password: _, ...user } = record;
  return { user, token: generateSessionToken() };
}

export async function registerUser(
  email: string,
  password: string,
  name: string
): Promise<{ pendingToken: string; email: string; name: string } | { error: string }> {
  const normalizedEmail = email.toLowerCase().trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return { error: 'Correo inválido' };
  }
  if (password.length < 8) {
    return { error: 'La contraseña debe tener al menos 8 caracteres' };
  }
  if (name.trim().length < 2) {
    return { error: 'El nombre debe tener al menos 2 caracteres' };
  }

  // Check active users
  const active = loadActiveUsers();
  if (active.has(normalizedEmail)) {
    return { error: 'Este correo ya está registrado' };
  }

  // Check pending users (remove old pending entry if exists)
  cleanExpiredPending();
  const pending = loadPendingUsers();
  if (pending.has(normalizedEmail)) {
    pending.delete(normalizedEmail);
  }

  const token = generateConfirmToken();
  pending.set(normalizedEmail, {
    email: normalizedEmail,
    name: name.trim(),
    password,
    token,
    createdAt: Date.now()
  });
  savePendingUsers(pending);

  return { pendingToken: token, email: normalizedEmail, name: name.trim() };
}

export function confirmUser(token: string, email: string): { success: true; name: string } | { error: string } {
  cleanExpiredPending();
  const pending = loadPendingUsers();
  const normalizedEmail = email.toLowerCase().trim();
  const record = pending.get(normalizedEmail);

  if (!record) {
    return { error: 'Solicitud no encontrada o ya procesada' };
  }
  if (record.token !== token) {
    return { error: 'Token de confirmación inválido' };
  }
  if (Date.now() - record.createdAt > CONFIRM_EXPIRY_MS) {
    pending.delete(normalizedEmail);
    savePendingUsers(pending);
    return { error: 'El enlace ha expirado (24h). Regístrate de nuevo.' };
  }

  // Move from pending to active
  const active = loadActiveUsers();
  if (active.has(normalizedEmail)) {
    pending.delete(normalizedEmail);
    savePendingUsers(pending);
    return { error: 'Este correo ya está registrado' };
  }

  active.set(normalizedEmail, {
    email: normalizedEmail,
    name: record.name,
    role: 'admin',
    createdAt: new Date().toISOString(),
    password: record.password
  });
  saveActiveUsers(active);
  pending.delete(normalizedEmail);
  savePendingUsers(pending);

  return { success: true, name: record.name };
}

export function getPendingByToken(token: string): { email: string; name: string } | null {
  cleanExpiredPending();
  const pending = loadPendingUsers();
  for (const [, record] of pending) {
    if (record.token === token) {
      return { email: record.email, name: record.name };
    }
  }
  return null;
}

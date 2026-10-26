/**
 * Authentication & Session Management using Web Crypto API
 */

import type { D1Database, DbSession, DbUser, PublicUser } from './types.ts';

const SESSION_COOKIE_NAME = 'econverse_session';
const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days
const PBKDF2_ITERATIONS = 100000;

/**
 * Hash password using Web Crypto PBKDF2 with SHA-256 and a 16-byte random salt.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    passwordKey,
    256
  );

  const hexSalt = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  const hexHash = Array.from(new Uint8Array(derivedBits))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return `pbkdf2$${PBKDF2_ITERATIONS}$${hexSalt}$${hexHash}`;
}

/**
 * Verify password against stored PBKDF2 hash using constant-time check.
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  try {
    const parts = storedHash.split('$');
    if (parts.length !== 4 || parts[0] !== 'pbkdf2') {
      return false;
    }

    const iterations = parseInt(parts[1], 10);
    const hexSalt = parts[2];
    const expectedHexHash = parts[3];

    const salt = new Uint8Array(
      hexSalt.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
    );

    const encoder = new TextEncoder();
    const passwordKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt,
        iterations,
        hash: 'SHA-256',
      },
      passwordKey,
      256
    );

    const derivedHexHash = Array.from(new Uint8Array(derivedBits))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    if (derivedHexHash.length !== expectedHexHash.length) {
      return false;
    }

    let diff = 0;
    for (let i = 0; i < derivedHexHash.length; i++) {
      diff |= derivedHexHash.charCodeAt(i) ^ expectedHexHash.charCodeAt(i);
    }

    return diff === 0;
  } catch {
    return false;
  }
}

/**
 * Generate cryptographically secure random session token.
 */
export function generateSessionToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Hash session token with SHA-256 for database storage.
 */
export async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    encoder.encode(token)
  );
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Create a new user session in D1 and return raw token + expiration.
 */
export async function createSession(
  db: D1Database,
  userId: string
): Promise<{ token: string; expiresAt: string }> {
  const token = generateSessionToken();
  const tokenHash = await hashToken(token);
  const sessionId = 'sess_' + crypto.randomUUID().replace(/-/g, '');
  const now = new Date();
  const expiresAtDate = new Date(now.getTime() + SESSION_MAX_AGE_SECONDS * 1000);
  const nowIso = now.toISOString();
  const expiresAtIso = expiresAtDate.toISOString();

  await db
    .prepare(
      `INSERT INTO sessions (id, user_id, token_hash, expires_at, created_at, last_used_at, revoked_at)
       VALUES (?, ?, ?, ?, ?, ?, NULL)`
    )
    .bind(sessionId, userId, tokenHash, expiresAtIso, nowIso, nowIso)
    .run();

  return { token, expiresAt: expiresAtIso };
}

/**
 * Parse session cookie from request.
 */
export function getSessionTokenFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';');
  for (const cookie of cookies) {
    const [name, ...rest] = cookie.trim().split('=');
    if (name === SESSION_COOKIE_NAME) {
      try { return decodeURIComponent(rest.join('=')); } catch { return null; }
    }
  }

  return null;
}

/**
 * Authenticate incoming request by resolving session and user from D1.
 */
export async function authenticateRequest(
  db: D1Database,
  request: Request
): Promise<{ user: DbUser; session: DbSession } | null> {
  const token = getSessionTokenFromRequest(request);
  if (!token) return null;

  const tokenHash = await hashToken(token);
  const nowIso = new Date().toISOString();

  const row = await db
    .prepare(
      `SELECT 
         u.id as user_id, u.email, u.password_hash, u.display_name, u.created_at, u.updated_at, u.last_login_at, u.is_active, u.role,
         s.id as session_id, s.token_hash, s.expires_at, s.created_at as session_created_at, s.last_used_at, s.revoked_at
       FROM sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.token_hash = ? AND u.is_active = 1`
    )
    .bind(tokenHash)
    .first<any>();

  if (!row) return null;

  if (row.revoked_at !== null) {
    return null;
  }

  if (!Number.isFinite(Date.parse(row.expires_at)) || new Date(row.expires_at) <= new Date()) {
    return null;
  }

  // Fire and forget updating last_used_at
  db.prepare('UPDATE sessions SET last_used_at = ? WHERE id = ?')
    .bind(nowIso, row.session_id)
    .run()
    .catch(() => {});

  const user: DbUser = {
    role: row.role,
    id: row.user_id,
    email: row.email,
    password_hash: row.password_hash,
    display_name: row.display_name,
    created_at: row.created_at,
    updated_at: row.updated_at,
    last_login_at: row.last_login_at,
    is_active: row.is_active,
  };

  const session: DbSession = {
    id: row.session_id,
    user_id: row.user_id,
    token_hash: row.token_hash,
    expires_at: row.expires_at,
    created_at: row.session_created_at,
    last_used_at: row.last_used_at,
    revoked_at: row.revoked_at,
  };

  return { user, session };
}

/**
 * Revoke session in D1.
 */
export async function revokeSession(
  db: D1Database,
  token: string
): Promise<boolean> {
  const tokenHash = await hashToken(token);
  const nowIso = new Date().toISOString();
  const res = await db
    .prepare('UPDATE sessions SET revoked_at = ? WHERE token_hash = ? AND revoked_at IS NULL')
    .bind(nowIso, tokenHash)
    .run();
  return res.success;
}

/**
 * Create HttpOnly Set-Cookie string for session token.
 */
export function buildSessionCookie(token: string, isSecure = true): string {
  const secureFlag = isSecure ? '; Secure' : '';
  return `${SESSION_COOKIE_NAME}=${encodeURIComponent(
    token
  )}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SECONDS}${secureFlag}`;
}

/**
 * Create HttpOnly Set-Cookie string to clear/expire session cookie.
 */
export function buildLogoutCookie(isSecure = true): string {
  const secureFlag = isSecure ? '; Secure' : '';
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${secureFlag}`;
}

/**
 * Convert DbUser to PublicUser (omitting password_hash and internal fields).
 */
export function toPublicUser(user: DbUser): PublicUser {
  return {
    role: user.role,
    id: user.id,
    email: user.email,
    displayName: user.display_name,
    createdAt: user.created_at,
    lastLoginAt: user.last_login_at,
  };
}

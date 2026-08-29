/**
 * Input Validation Utilities
 */

export function normalizeEmail(email?: unknown): string | null {
  if (typeof email !== 'string') return null;
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed) || trimmed.length > 254) {
    return null;
  }
  return trimmed;
}

export function validatePassword(password?: unknown): boolean {
  if (typeof password !== 'string') return false;
  return password.length >= 8 && password.length <= 128;
}

export function sanitizeDisplayName(displayName?: unknown): string | null {
  if (typeof displayName !== 'string') return null;
  const trimmed = displayName.trim();
  if (trimmed.length < 1 || trimmed.length > 64) {
    return null;
  }
  return trimmed;
}

export function validateIdempotencyKey(key?: unknown): string | null {
  if (typeof key !== 'string') return null;
  const trimmed = key.trim();
  if (trimmed.length < 8 || trimmed.length > 128) {
    return null;
  }
  return trimmed;
}

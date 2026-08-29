import type { PagesFunction, DbUser } from '../../lib/types.ts';
import { verifyPassword, createSession, buildSessionCookie, toPublicUser } from '../../lib/auth.ts';
import { normalizeEmail } from '../../lib/validation.ts';
import { jsonError, jsonResponse, ErrorCodes } from '../../lib/errors.ts';

export const onRequestPost: PagesFunction = async (context) => {
  const { request, env } = context;
  const db = env.DB;

  let body: any;
  try {
    body = await request.json();
  } catch {
    return jsonError(ErrorCodes.VALIDATION_ERROR, 'Dữ liệu yêu cầu không đúng định dạng JSON.');
  }

  const email = normalizeEmail(body.email);
  const password = typeof body.password === 'string' ? body.password : '';

  if (!email || !password) {
    return jsonError(
      ErrorCodes.INVALID_CREDENTIALS,
      'Email hoặc mật khẩu không chính xác.',
      401
    );
  }

  const user = await db
    .prepare('SELECT * FROM users WHERE email = ?')
    .bind(email)
    .first<DbUser>();

  if (!user || user.is_active !== 1) {
    return jsonError(
      ErrorCodes.INVALID_CREDENTIALS,
      'Email hoặc mật khẩu không chính xác.',
      401
    );
  }

  const isValidPassword = await verifyPassword(password, user.password_hash);
  if (!isValidPassword) {
    return jsonError(
      ErrorCodes.INVALID_CREDENTIALS,
      'Email hoặc mật khẩu không chính xác.',
      401
    );
  }

  const nowIso = new Date().toISOString();
  await db
    .prepare('UPDATE users SET last_login_at = ?, updated_at = ? WHERE id = ?')
    .bind(nowIso, nowIso, user.id)
    .run();

  const { token } = await createSession(db, user.id);
  const isSecure = request.url.startsWith('https:') || env.ENVIRONMENT === 'production';
  const cookieHeader = buildSessionCookie(token, isSecure);

  return jsonResponse(
    {
      user: toPublicUser({
        ...user,
        last_login_at: nowIso,
      }),
    },
    200,
    { 'Set-Cookie': cookieHeader }
  );
};

import type { PagesFunction } from '../../lib/types.ts';
import { hashPassword, createSession, buildSessionCookie, toPublicUser } from '../../lib/auth.ts';
import { normalizeEmail, validatePassword, sanitizeDisplayName } from '../../lib/validation.ts';
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
  const isPasswordValid = validatePassword(body.password);
  const displayName = sanitizeDisplayName(body.displayName);

  if (!email) {
    return jsonError(ErrorCodes.VALIDATION_ERROR, 'Địa chỉ email không hợp lệ.');
  }
  if (!isPasswordValid) {
    return jsonError(ErrorCodes.VALIDATION_ERROR, 'Mật khẩu phải có độ dài từ 8 đến 128 ký tự.');
  }
  if (!displayName) {
    return jsonError(ErrorCodes.VALIDATION_ERROR, 'Tên hiển thị không được để trống.');
  }

  // Check if email exists
  const existingUser = await db
    .prepare('SELECT id FROM users WHERE email = ?')
    .bind(email)
    .first();

  if (existingUser) {
    return jsonError(
      ErrorCodes.EMAIL_ALREADY_EXISTS,
      'Địa chỉ email này đã được đăng ký tài khoản.',
      409
    );
  }

  const userId = 'usr_' + crypto.randomUUID().replace(/-/g, '');
  const passwordHash = await hashPassword(body.password);
  const nowIso = new Date().toISOString();

  // Create user, default gamification, default pet
  await db.batch([
    db.prepare(
      `INSERT INTO users (id, email, password_hash, display_name, created_at, updated_at, last_login_at, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`
    ).bind(userId, email, passwordHash, displayName, nowIso, nowIso, nowIso),
    db.prepare(
      `INSERT INTO gamification (user_id, total_xp, level, current_streak, longest_streak, updated_at)
       VALUES (?, 0, 1, 0, 0, ?)`
    ).bind(userId, nowIso),
    db.prepare(
      `INSERT INTO user_pets (user_id, pet_id, is_active, unlocked_at)
       VALUES (?, 'pet-bear', 1, ?)`
    ).bind(userId, nowIso),
  ]);

  // Create session
  const { token } = await createSession(db, userId);
  const isSecure = request.url.startsWith('https:') || env.ENVIRONMENT === 'production';
  const cookieHeader = buildSessionCookie(token, isSecure);

  const newUser = {
    id: userId,
    email,
    password_hash: passwordHash,
    display_name: displayName,
    created_at: nowIso,
    updated_at: nowIso,
    last_login_at: nowIso,
    is_active: 1,
  };

  return jsonResponse(
    {
      user: toPublicUser(newUser),
    },
    201,
    { 'Set-Cookie': cookieHeader }
  );
};

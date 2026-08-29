import type { PagesFunction } from '../../lib/types.ts';
import { getSessionTokenFromRequest, revokeSession, buildLogoutCookie } from '../../lib/auth.ts';
import { jsonResponse } from '../../lib/errors.ts';

export const onRequestPost: PagesFunction = async (context) => {
  const { request, env } = context;
  const db = env.DB;

  const token = getSessionTokenFromRequest(request);
  if (token) {
    await revokeSession(db, token);
  }

  const isSecure = request.url.startsWith('https:') || env.ENVIRONMENT === 'production';
  const cookieHeader = buildLogoutCookie(isSecure);

  return jsonResponse(
    {
      success: true,
    },
    200,
    { 'Set-Cookie': cookieHeader }
  );
};

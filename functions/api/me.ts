import type { PagesFunction } from '../lib/types.ts';
import { authenticateRequest, toPublicUser } from '../lib/auth.ts';
import { jsonError, jsonResponse, ErrorCodes } from '../lib/errors.ts';

export const onRequestGet: PagesFunction = async (context) => {
  const { request, env } = context;
  const db = env.DB;

  const auth = await authenticateRequest(db, request);
  if (!auth) {
    return jsonError(
      ErrorCodes.UNAUTHORIZED,
      'Yêu cầu đăng nhập để truy cập thông tin.',
      401
    );
  }

  return jsonResponse({
    user: toPublicUser(auth.user),
  });
};

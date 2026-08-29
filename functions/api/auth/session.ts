import type { PagesFunction } from '../../lib/types.ts';
import { authenticateRequest, toPublicUser } from '../../lib/auth.ts';
import { jsonResponse } from '../../lib/errors.ts';

export const onRequestGet: PagesFunction = async (context) => {
  const { request, env } = context;
  const db = env.DB;

  const auth = await authenticateRequest(db, request);
  if (!auth) {
    return jsonResponse({
      authenticated: false,
    });
  }

  return jsonResponse({
    authenticated: true,
    user: toPublicUser(auth.user),
  });
};

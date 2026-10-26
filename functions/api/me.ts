import type { PagesFunction } from '../lib/types.ts';
import { authenticateRequest, toPublicUser } from '../lib/auth.ts';
import { jsonError, jsonResponse, ErrorCodes } from '../lib/errors.ts';
import { requireUser, readJson, safe, fail } from '../lib/http.ts';
import { sanitizeDisplayName } from '../lib/validation.ts';

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

export const onRequestPatch: PagesFunction = safe(async ({request,env}) => {
  const user=await requireUser(env.DB,request),body=await readJson(request),name=sanitizeDisplayName(body.displayName);
  if(!name) fail(400,'VALIDATION_ERROR','Display name must be 1–64 characters.');
  await env.DB.prepare('UPDATE users SET display_name=?,updated_at=? WHERE id=?').bind(name,new Date().toISOString(),user.id).run();
  return jsonResponse({user:toPublicUser({...user,display_name:name})});
});

import type { PagesFunction } from '../../lib/types.ts';
import { authenticateRequest } from '../../lib/auth.ts';
import { jsonError, jsonResponse, ErrorCodes } from '../../lib/errors.ts';

export const onRequestGet: PagesFunction = async (context) => {
  const { request, env } = context;
  const db = env.DB;

  const auth = await authenticateRequest(db, request);
  if (!auth) {
    return jsonError(
      ErrorCodes.UNAUTHORIZED,
      'Yêu cầu đăng nhập để xem thông tin pet.',
      401
    );
  }

  const rows = await db
    .prepare(
      `SELECT p.id, p.name, p.stage, p.metadata_json, up.is_active, up.unlocked_at
       FROM user_pets up
       JOIN pets p ON up.pet_id = p.id
       WHERE up.user_id = ?`
    )
    .bind(auth.user.id)
    .all<any>();

  const userPets = (rows.results || []).map((r) => ({
    id: r.id,
    name: r.name,
    stage: r.stage,
    isActive: Boolean(r.is_active),
    unlockedAt: r.unlocked_at,
    metadata: r.metadata_json ? JSON.parse(r.metadata_json) : null,
  }));

  const activePet = userPets.find((p) => p.isActive) || userPets[0] || null;

  return jsonResponse({
    activePet,
    pets: userPets,
  });
};

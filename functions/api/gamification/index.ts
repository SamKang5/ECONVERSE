import type { PagesFunction, DbGamification } from '../../lib/types.ts';
import { authenticateRequest } from '../../lib/auth.ts';
import { jsonError, jsonResponse, ErrorCodes } from '../../lib/errors.ts';

export const onRequestGet: PagesFunction = async (context) => {
  const { request, env } = context;
  const db = env.DB;

  const auth = await authenticateRequest(db, request);
  if (!auth) {
    return jsonError(
      ErrorCodes.UNAUTHORIZED,
      'Yêu cầu đăng nhập để xem thông tin gamification.',
      401
    );
  }

  const gamificationRow = await db
    .prepare('SELECT total_xp, level, current_streak, longest_streak, updated_at FROM gamification WHERE user_id = ?')
    .bind(auth.user.id)
    .first<DbGamification>();

  if (!gamificationRow) {
    return jsonResponse({
      totalXp: 0,
      level: 1,
      currentStreak: 0,
      longestStreak: 0,
      updatedAt: new Date().toISOString(),
    });
  }

  return jsonResponse({
    totalXp: gamificationRow.total_xp,
    level: Math.floor(gamificationRow.total_xp / 300) + 1,
    currentStreak: gamificationRow.current_streak,
    longestStreak: gamificationRow.longest_streak,
    updatedAt: gamificationRow.updated_at,
  });
};

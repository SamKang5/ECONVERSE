import type { PagesFunction, DbLessonProgress, DbGamification } from '../../lib/types.ts';
import { authenticateRequest } from '../../lib/auth.ts';
import { jsonError, jsonResponse, ErrorCodes } from '../../lib/errors.ts';

export const onRequestGet: PagesFunction = async (context) => {
  const { request, env } = context;
  const db = env.DB;

  const auth = await authenticateRequest(db, request);
  if (!auth) {
    return jsonError(
      ErrorCodes.UNAUTHORIZED,
      'Yêu cầu đăng nhập để xem tiến độ.',
      401
    );
  }

  const progressRows = await db
    .prepare('SELECT lesson_id, status, completed_at, updated_at FROM lesson_progress WHERE user_id = ? ORDER BY updated_at DESC, lesson_id ASC')
    .bind(auth.user.id)
    .all<DbLessonProgress>();

  const gamificationRow = await db
    .prepare('SELECT total_xp, level, current_streak FROM gamification WHERE user_id = ?')
    .bind(auth.user.id)
    .first<DbGamification>();

  const lessons = (progressRows.results || []).map((p) => ({
    lessonId: p.lesson_id,
    status: p.status,
    completedAt: p.completed_at,
    updatedAt: p.updated_at,
  }));

  const gamification = gamificationRow
    ? {
        totalXp: gamificationRow.total_xp,
        level: gamificationRow.level,
        currentStreak: gamificationRow.current_streak,
      }
    : {
        totalXp: 0,
        level: 1,
        currentStreak: 0,
      };

  return jsonResponse({
    lessons,
    gamification,
  });
};

import type { PagesFunction, DbQuizAttempt } from '../../../lib/types.ts';
import { authenticateRequest } from '../../../lib/auth.ts';
import { jsonError, jsonResponse, ErrorCodes } from '../../../lib/errors.ts';

export const onRequestGet: PagesFunction<'lessonId'> = async (context) => {
  const { request, env, params } = context;
  const db = env.DB;

  const auth = await authenticateRequest(db, request);
  if (!auth) {
    return jsonError(
      ErrorCodes.UNAUTHORIZED,
      'Yêu cầu đăng nhập để xem lịch sử quiz.',
      401
    );
  }

  const lessonId = params.lessonId;
  if (!lessonId || typeof lessonId !== 'string') {
    return jsonError(ErrorCodes.VALIDATION_ERROR, 'ID bài học không hợp lệ.');
  }

  const attemptsResult = await db
    .prepare(
      `SELECT id, score, total_questions, correct_count, xp_awarded, submitted_at
       FROM quiz_attempts
       WHERE user_id = ? AND lesson_id = ?
       ORDER BY submitted_at DESC`
    )
    .bind(auth.user.id, lessonId)
    .all<DbQuizAttempt>();

  const attempts = (attemptsResult.results || []).map((a) => ({
    id: a.id,
    score: a.score,
    totalQuestions: a.total_questions,
    correctCount: a.correct_count,
    xpAwarded: a.xp_awarded,
    submittedAt: a.submitted_at,
  }));

  return jsonResponse({
    lessonId,
    attempts,
  });
};

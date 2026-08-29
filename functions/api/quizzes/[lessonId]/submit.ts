import type { PagesFunction, DbLesson, DbQuizQuestion, DbQuizAttempt } from '../../../lib/types.ts';
import { authenticateRequest } from '../../../lib/auth.ts';
import { validateIdempotencyKey } from '../../../lib/validation.ts';
import { jsonError, jsonResponse, ErrorCodes } from '../../../lib/errors.ts';

function parseOptionIndex(val: unknown): number | null {
  if (typeof val === 'number' && Number.isInteger(val)) {
    return val;
  }
  if (typeof val === 'string') {
    const trimmed = val.trim().toUpperCase();
    if (trimmed === 'A') return 0;
    if (trimmed === 'B') return 1;
    if (trimmed === 'C') return 2;
    if (trimmed === 'D') return 3;
    const parsed = parseInt(trimmed, 10);
    if (!isNaN(parsed)) return parsed;
  }
  return null;
}

export const onRequestPost: PagesFunction<'lessonId'> = async (context) => {
  const { request, env, params } = context;
  const db = env.DB;

  const auth = await authenticateRequest(db, request);
  if (!auth) {
    return jsonError(
      ErrorCodes.UNAUTHORIZED,
      'Yêu cầu đăng nhập để nộp bài quiz.',
      401
    );
  }

  const lessonId = params.lessonId;
  if (!lessonId || typeof lessonId !== 'string') {
    return jsonError(ErrorCodes.VALIDATION_ERROR, 'ID bài học không hợp lệ.');
  }

  const lesson = await db
    .prepare('SELECT id, points_reward FROM lessons WHERE id = ? AND is_active = 1')
    .bind(lessonId)
    .first<DbLesson>();

  if (!lesson) {
    return jsonError(
      ErrorCodes.LESSON_NOT_FOUND,
      'Bài học không tồn tại.',
      404
    );
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return jsonError(ErrorCodes.VALIDATION_ERROR, 'Dữ liệu yêu cầu không đúng định dạng JSON.');
  }

  const idempotencyKey = validateIdempotencyKey(body.idempotencyKey);
  if (!idempotencyKey) {
    return jsonError(
      ErrorCodes.VALIDATION_ERROR,
      'Idempotency key không hợp lệ hoặc bị thiếu.'
    );
  }

  // Idempotency Check: Return existing result if duplicate idempotency key is submitted
  const existingAttempt = await db
    .prepare('SELECT * FROM quiz_attempts WHERE idempotency_key = ? AND user_id = ?')
    .bind(idempotencyKey, auth.user.id)
    .first<DbQuizAttempt>();

  if (existingAttempt) {
    return jsonResponse({
      attemptId: existingAttempt.id,
      score: existingAttempt.score,
      totalQuestions: existingAttempt.total_questions,
      correctCount: existingAttempt.correct_count,
      xpAwarded: existingAttempt.xp_awarded,
      lessonCompleted: existingAttempt.correct_count === existingAttempt.total_questions,
    });
  }

  const userAnswers = body.answers;
  if (!userAnswers || typeof userAnswers !== 'object') {
    return jsonError(
      ErrorCodes.INVALID_QUIZ_SUBMISSION,
      'Đáp án nộp không hợp lệ.'
    );
  }

  const questionsResult = await db
    .prepare(
      `SELECT id, correct_option
       FROM quiz_questions
       WHERE lesson_id = ? AND is_active = 1
       ORDER BY question_order ASC`
    )
    .bind(lessonId)
    .all<DbQuizQuestion>();

  const questions = questionsResult.results || [];
  if (questions.length === 0) {
    return jsonError(
      ErrorCodes.QUIZ_NOT_FOUND,
      'Không tìm thấy câu hỏi quiz cho bài học này.',
      404
    );
  }

  let correctCount = 0;
  for (const q of questions) {
    const rawAnswer = userAnswers[q.id];
    const parsed = parseOptionIndex(rawAnswer);
    if (parsed !== null && parsed === q.correct_option) {
      correctCount++;
    }
  }

  const totalQuestions = questions.length;
  const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const isPerfect = correctCount === totalQuestions;

  // Check if lesson was already completed by user
  const priorProgress = await db
    .prepare('SELECT status FROM lesson_progress WHERE user_id = ? AND lesson_id = ?')
    .bind(auth.user.id, lessonId)
    .first<{ status: string }>();

  const alreadyCompleted = priorProgress?.status === 'completed';

  // XP is awarded only for perfect score on first completion
  const xpToAward = isPerfect && !alreadyCompleted ? lesson.points_reward : 0;

  const attemptId = 'att_' + crypto.randomUUID().replace(/-/g, '');
  const nowIso = new Date().toISOString();

  // Prepare atomic batch operations
  const batchStatements = [
    // 1. Insert quiz attempt
    db.prepare(
      `INSERT INTO quiz_attempts (id, user_id, lesson_id, score, total_questions, correct_count, xp_awarded, submitted_at, idempotency_key)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      attemptId,
      auth.user.id,
      lessonId,
      score,
      totalQuestions,
      correctCount,
      xpToAward,
      nowIso,
      idempotencyKey
    ),
  ];

  // 2. If XP awarded, insert ledger transaction and update gamification total_xp & level
  if (xpToAward > 0) {
    const txId = 'tx_' + crypto.randomUUID().replace(/-/g, '');
    batchStatements.push(
      db.prepare(
        `INSERT INTO xp_transactions (id, user_id, amount, reason, reference_type, reference_id, created_at)
         VALUES (?, ?, ?, ?, 'quiz_completion', ?, ?)`
      ).bind(txId, auth.user.id, xpToAward, `Hoàn thành bài học: ${lessonId}`, attemptId, nowIso),
      db.prepare(
        `UPDATE gamification
         SET total_xp = total_xp + ?,
             level = CAST(((total_xp + ?) / 300) AS INTEGER) + 1,
             updated_at = ?
         WHERE user_id = ?`
      ).bind(xpToAward, xpToAward, nowIso, auth.user.id)
    );
  }

  // 3. If perfect score, update lesson_progress to completed
  if (isPerfect) {
    batchStatements.push(
      db.prepare(
        `INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at, updated_at)
         VALUES (?, ?, 'completed', ?, ?, ?)
         ON CONFLICT(user_id, lesson_id) DO UPDATE SET
           status = 'completed',
           completed_at = CASE WHEN lesson_progress.completed_at IS NULL THEN excluded.completed_at ELSE lesson_progress.completed_at END,
           updated_at = excluded.updated_at`
      ).bind(auth.user.id, lessonId, nowIso, nowIso, nowIso)
    );
  }

  // Execute all in atomic D1 batch
  await db.batch(batchStatements);

  return jsonResponse({
    attemptId,
    score,
    totalQuestions,
    correctCount,
    xpAwarded: xpToAward,
    lessonCompleted: isPerfect,
  });
};

import type { PagesFunction, DbLesson } from '../../lib/types.ts';
import { authenticateRequest } from '../../lib/auth.ts';
import { jsonError, jsonResponse, ErrorCodes } from '../../lib/errors.ts';

export const onRequestPut: PagesFunction<'lessonId'> = async (context) => {
  const { request, env, params } = context;
  const db = env.DB;

  const auth = await authenticateRequest(db, request);
  if (!auth) {
    return jsonError(
      ErrorCodes.UNAUTHORIZED,
      'Yêu cầu đăng nhập để cập nhật tiến độ.',
      401
    );
  }

  const lessonId = params.lessonId;
  if (!lessonId || typeof lessonId !== 'string') {
    return jsonError(ErrorCodes.VALIDATION_ERROR, 'ID bài học không hợp lệ.');
  }

  const lesson = await db
    .prepare('SELECT id FROM lessons WHERE id = ? AND is_active = 1')
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

  const status = body.status;
  if (!['not_started', 'in_progress', 'completed'].includes(status)) {
    return jsonError(
      ErrorCodes.VALIDATION_ERROR,
      'Trạng thái tiến độ phải là not_started, in_progress hoặc completed.'
    );
  }

  const nowIso = new Date().toISOString();
  const completedAt = status === 'completed' ? nowIso : null;

  await db
    .prepare(
      `INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id, lesson_id) DO UPDATE SET
         status = excluded.status,
         completed_at = CASE 
           WHEN excluded.status = 'completed' AND lesson_progress.completed_at IS NULL THEN excluded.completed_at 
           ELSE lesson_progress.completed_at 
         END,
         updated_at = excluded.updated_at`
    )
    .bind(auth.user.id, lessonId, status, nowIso, completedAt, nowIso)
    .run();

  return jsonResponse({
    success: true,
    lessonId,
    status,
  });
};

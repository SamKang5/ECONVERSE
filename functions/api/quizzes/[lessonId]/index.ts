import type { PagesFunction, DbLesson, DbQuizQuestion } from '../../../lib/types.ts';
import { jsonError, jsonResponse, ErrorCodes } from '../../../lib/errors.ts';

export const onRequestGet: PagesFunction<'lessonId'> = async (context) => {
  const { env, params } = context;
  const db = env.DB;

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

  const questionsResult = await db
    .prepare(
      `SELECT id, question_order, question_text, options_json
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

  // Strictly omit correct_option and explanation from client payload!
  const sanitizedQuestions = questions.map((q) => ({
    id: q.id,
    questionOrder: q.question_order,
    questionText: q.question_text,
    options: JSON.parse(q.options_json),
  }));

  return jsonResponse({
    lessonId,
    questions: sanitizedQuestions,
  });
};

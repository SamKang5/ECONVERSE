// One-time migration authoring input. The learner application never imports these sources.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { COURSE_MODULES } from '../src/learnData.ts';

const quote = value => `'${String(value).replaceAll("'", "''")}'`;
const sql = [
  '-- 0005: Preserve all 13 historical lesson IDs; move original written content into D1.',
  '-- No learner records or legacy quiz rows are modified. Videos awaiting sources remain explicit.',
  '-- Answer keys are read from the existing database, preserving owner edits to legacy quizzes.',
];
let count = 0;
for (const module of COURSE_MODULES) {
  for (const lesson of module.lessons) {
    const { quiz: _quiz, id: lessonId, ...original } = lesson;
    const content = {
      ...original,
      moduleId: module.id,
      moduleTitle: module.title,
      moduleDescription: module.description,
      category: module.category,
      unitCode: module.id.replace('module-', ''),
      episodeCode: String(lesson.order),
      videoUrl: original.videoUrl === 'placeholder' ? '' : original.videoUrl || '',
      quiz: [],
    };
    const revision = `seed:${lessonId}:1`;
    sql.push(`
INSERT OR IGNORE INTO lesson_revisions
  (id, lesson_id, version, lock_version, status, content_json, created_by, created_at, updated_at, feedback)
SELECT ${quote(revision)}, l.id, 1, 1, 'published',
  json_set(${quote(JSON.stringify(content))}, '$.title', l.title, '$.pointsReward', l.points_reward,
    '$.quiz', json(COALESCE((SELECT json_group_array(json_object(
      'id', q.id, 'question', q.question_text, 'options', json(q.options_json),
      'correctAnswer', q.correct_option, 'explanation', q.explanation))
      FROM (SELECT * FROM quiz_questions WHERE lesson_id = l.id AND is_active = 1 ORDER BY question_order) q), '[]'))),
  NULL, strftime('%Y-%m-%dT%H:%M:%fZ','now'), strftime('%Y-%m-%dT%H:%M:%fZ','now'), ''
FROM lessons l WHERE l.id = ${quote(lessonId)} AND l.published_revision_id IS NULL
  AND NOT EXISTS (SELECT 1 FROM lesson_revisions r WHERE r.lesson_id = l.id);
UPDATE lessons SET published_revision_id = ${quote(revision)}
WHERE id = ${quote(lessonId)} AND published_revision_id IS NULL AND is_active = 1
  AND EXISTS (SELECT 1 FROM lesson_revisions WHERE id = ${quote(revision)} AND status = 'published');
`);
    count++;
  }
}
writeFileSync(fileURLToPath(new URL('../migrations/0005_migrate_legacy_content.sql', import.meta.url)), sql.join('\n'));
console.log(`Authored migration for ${count} historical lessons from ${COURSE_MODULES.length} modules.`);

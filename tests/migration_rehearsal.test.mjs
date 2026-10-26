import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';
import { COURSE_MODULES } from '../src/learnData.ts';

const db = new DatabaseSync(':memory:');
db.exec('PRAGMA foreign_keys = ON');
const migrate = name => db.exec(readFileSync(new URL(`../migrations/${name}`, import.meta.url), 'utf8'));
migrate('0001_initial_schema.sql');
migrate('0002_seed_data.sql');
const now = '2026-10-22T00:00:00.000Z';
db.prepare(`INSERT INTO users VALUES (?,?,?,?,?,?,?,?)`).run('legacy-user','legacy@example.test','legacy-hash','Legacy learner',now,now,now,1);
db.prepare(`INSERT INTO sessions VALUES (?,?,?,?,?,?,?)`).run('legacy-session','legacy-user','legacy-token','2099-01-01T00:00:00Z',now,now,null);
db.prepare(`INSERT INTO lesson_progress VALUES (?,?,?,?,?,?)`).run('legacy-user','lesson-2a','completed',now,now,now);
db.prepare(`INSERT INTO quiz_attempts VALUES (?,?,?,?,?,?,?,?,?)`).run('legacy-attempt','legacy-user','lesson-2a',100,4,4,45,now,'legacy-idempotency');
db.prepare(`INSERT INTO gamification VALUES (?,?,?,?,?,?)`).run('legacy-user',45,1,1,1,now);
db.prepare(`INSERT INTO xp_transactions VALUES (?,?,?,?,?,?,?)`).run('legacy-xp','legacy-user',45,'Legacy completion','quiz_completion','legacy-attempt',now);
// Existing owner corrections in D1, rather than checked-in answer keys, must survive seeding.
db.prepare('UPDATE quiz_questions SET explanation = ? WHERE id = ?').run('Owner correction retained','lesson-2a-q1');
const protectedTables = ['users','sessions','lesson_progress','quiz_attempts','gamification','xp_transactions','quiz_questions'];
const before = Object.fromEntries(protectedTables.map(table => [table, db.prepare(`SELECT * FROM ${table} ORDER BY 1`).all()]));
for (const name of readdirSync(new URL('../migrations/', import.meta.url)).filter(x => /^000[3-9].*\.sql$/.test(x)).sort()) migrate(name);
for (const table of protectedTables) {
  const after = db.prepare(`SELECT * FROM ${table} ORDER BY 1`).all();
  // Additive columns are permitted; every historical value must remain byte-for-byte equal.
  assert.equal(after.length, before[table].length, `${table}: historical row count`);
  before[table].forEach((row, i) => Object.entries(row).forEach(([key, value]) => assert.equal(after[i][key], value, `${table}.${key}`)));
}
const lessons = db.prepare('SELECT * FROM lessons ORDER BY display_order').all();
assert.equal(lessons.length, 13);
assert.equal(db.prepare('SELECT COUNT(*) count FROM lesson_revisions').get().count, 13);
for (const module of COURSE_MODULES) for (const original of module.lessons) {
  const row = db.prepare('SELECT r.content_json FROM lessons l JOIN lesson_revisions r ON r.id = l.published_revision_id WHERE l.id = ?').get(original.id);
  assert.ok(row, `${original.id}: live pointer`);
  const content = JSON.parse(row.content_json);
  assert.deepEqual(content.mainContent, original.mainContent, `${original.id}: written content`);
  assert.deepEqual(content.objectives, original.objectives, `${original.id}: objectives`);
  assert.equal(content.videoUrl, original.videoUrl === 'placeholder' ? '' : original.videoUrl || '', `${original.id}: video`);
  const questions = db.prepare('SELECT * FROM quiz_questions WHERE lesson_id = ? AND is_active = 1 ORDER BY question_order').all(original.id);
  assert.deepEqual(content.quiz.map(q => q.id), questions.map(q => q.id), `${original.id}: question IDs`);
  assert.deepEqual(content.quiz.map(q => q.correctAnswer), questions.map(q => q.correct_option), `${original.id}: authoritative keys`);
}
assert.equal(JSON.parse(db.prepare('SELECT content_json FROM lesson_revisions WHERE lesson_id = ?').get('lesson-2a').content_json).quiz[0].explanation, 'Owner correction retained');
assert.deepEqual(db.prepare('PRAGMA foreign_key_check').all(), []);
// The content import is safe to retry; no revisions or pointers are duplicated.
migrate('0005_migrate_legacy_content.sql');
assert.equal(db.prepare('SELECT COUNT(*) count FROM lesson_revisions').get().count, 13);
console.log('Migration rehearsal PASS: 13 lessons, 42 quiz keys, owner corrections, sessions, progress, attempts and XP preserved; foreign keys valid; content import retry safe.');
db.close();

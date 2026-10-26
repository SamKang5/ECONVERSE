-- All legacy lessons/questions/attempts/progress/XP rows are retained.
ALTER TABLE lessons ADD COLUMN published_revision_id TEXT REFERENCES lesson_revisions(id);
CREATE TABLE lesson_revisions (
 id TEXT PRIMARY KEY,
 lesson_id TEXT NOT NULL REFERENCES lessons(id),
 version INTEGER NOT NULL,
 lock_version INTEGER NOT NULL DEFAULT 1,
 status TEXT NOT NULL CHECK(status IN ('draft','in_review','published','archived')),
 content_json TEXT NOT NULL CHECK(json_valid(content_json)),
 created_by TEXT REFERENCES users(id),
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL,
 feedback TEXT NOT NULL DEFAULT '',
 mutation_token TEXT,
 UNIQUE(lesson_id,version)
);
CREATE INDEX idx_revisions_status ON lesson_revisions(status,updated_at DESC);
CREATE INDEX idx_revisions_owner ON lesson_revisions(created_by,lesson_id);
CREATE TRIGGER immutable_revision_content BEFORE UPDATE OF content_json ON lesson_revisions
WHEN OLD.status IN ('published','archived')
BEGIN SELECT RAISE(ABORT,'PUBLISHED_CONTENT_IMMUTABLE'); END;
CREATE TRIGGER immutable_revision_delete BEFORE DELETE ON lesson_revisions
WHEN OLD.status IN ('published','archived')
BEGIN SELECT RAISE(ABORT,'PUBLISHED_CONTENT_IMMUTABLE'); END;
ALTER TABLE quiz_attempts ADD COLUMN revision_id TEXT REFERENCES lesson_revisions(id);
ALTER TABLE quiz_attempts ADD COLUMN request_hash TEXT;
ALTER TABLE quiz_attempts ADD COLUMN result_json TEXT;
CREATE TABLE lesson_rewards (
 user_id TEXT NOT NULL REFERENCES users(id), lesson_id TEXT NOT NULL REFERENCES lessons(id),
 attempt_id TEXT, amount INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL,
 PRIMARY KEY(user_id,lesson_id)
);
-- A historical completion or prior rewarded attempt must never earn XP again.
INSERT OR IGNORE INTO lesson_rewards(user_id,lesson_id,attempt_id,amount,created_at)
SELECT user_id,lesson_id,NULL,0,COALESCE(completed_at,updated_at) FROM lesson_progress WHERE status='completed';
INSERT OR IGNORE INTO lesson_rewards(user_id,lesson_id,attempt_id,amount,created_at)
SELECT user_id,lesson_id,id,0,submitted_at FROM quiz_attempts WHERE xp_awarded>0;

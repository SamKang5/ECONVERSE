-- ============================================================================
-- ECONVERSE D1 DATABASE MIGRATION 0001: INITIAL SCHEMA
-- Relational schema for Users, Auth, Sessions, Lessons, Quizzes, Gamification
-- ============================================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  last_login_at TEXT,
  is_active INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. SESSIONS TABLE
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token_hash TEXT UNIQUE NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  last_used_at TEXT NOT NULL,
  revoked_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- 3. LESSONS TABLE
CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  unit_code TEXT NOT NULL,
  episode_code TEXT NOT NULL,
  title TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  points_reward INTEGER NOT NULL DEFAULT 45,
  is_active INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_lessons_unit_code ON lessons(unit_code);
CREATE INDEX IF NOT EXISTS idx_lessons_display_order ON lessons(display_order);

-- 4. LESSON PROGRESS TABLE
CREATE TABLE IF NOT EXISTS lesson_progress (
  user_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed')),
  started_at TEXT NOT NULL,
  completed_at TEXT,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (user_id, lesson_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id ON lesson_progress(lesson_id);

-- 5. QUIZ QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS quiz_questions (
  id TEXT PRIMARY KEY,
  lesson_id TEXT NOT NULL,
  question_order INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  options_json TEXT NOT NULL,
  correct_option INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_quiz_questions_lesson_id ON quiz_questions(lesson_id);

-- 6. QUIZ ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_count INTEGER NOT NULL,
  xp_awarded INTEGER NOT NULL DEFAULT 0,
  submitted_at TEXT NOT NULL,
  idempotency_key TEXT UNIQUE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_lesson_id ON quiz_attempts(lesson_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_quiz_attempts_idempotency ON quiz_attempts(idempotency_key);

-- 7. GAMIFICATION TABLE
CREATE TABLE IF NOT EXISTS gamification (
  user_id TEXT PRIMARY KEY,
  total_xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. XP TRANSACTIONS TABLE (LEDGER)
CREATE TABLE IF NOT EXISTS xp_transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  reference_type TEXT,
  reference_id TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_xp_transactions_user_id ON xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_created_at ON xp_transactions(created_at);

-- 9. PETS CATALOG
CREATE TABLE IF NOT EXISTS pets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  stage INTEGER NOT NULL DEFAULT 1,
  required_xp INTEGER NOT NULL DEFAULT 0,
  metadata_json TEXT,
  is_active INTEGER NOT NULL DEFAULT 1
);

-- 10. USER PETS
CREATE TABLE IF NOT EXISTS user_pets (
  user_id TEXT NOT NULL,
  pet_id TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 0,
  unlocked_at TEXT NOT NULL,
  PRIMARY KEY (user_id, pet_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_pets_user_id ON user_pets(user_id);

-- 11. INVENTORY ITEMS CATALOG
CREATE TABLE IF NOT EXISTS inventory_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  item_type TEXT NOT NULL,
  cost_xp INTEGER NOT NULL DEFAULT 0,
  metadata_json TEXT,
  is_active INTEGER NOT NULL DEFAULT 1
);

-- 12. USER INVENTORY
CREATE TABLE IF NOT EXISTS user_inventory (
  user_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (user_id, item_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_inventory_user_id ON user_inventory(user_id);

-- Additive: existing accounts and sessions remain valid, with learner privileges.
ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'learner' CHECK(role IN ('learner','editor','admin'));
CREATE INDEX idx_users_role_active ON users(role,is_active);
CREATE TRIGGER users_keep_last_admin_update BEFORE UPDATE OF role,is_active ON users
WHEN OLD.role='admin' AND OLD.is_active=1 AND (NEW.role!='admin' OR NEW.is_active!=1)
AND (SELECT COUNT(*) FROM users WHERE role='admin' AND is_active=1)=1
BEGIN SELECT RAISE(ABORT,'LAST_ACTIVE_ADMIN'); END;
CREATE TRIGGER users_keep_last_admin_delete BEFORE DELETE ON users
WHEN OLD.role='admin' AND OLD.is_active=1
AND (SELECT COUNT(*) FROM users WHERE role='admin' AND is_active=1)=1
BEGIN SELECT RAISE(ABORT,'LAST_ACTIVE_ADMIN'); END;

CREATE TABLE audit_log (
 id TEXT PRIMARY KEY, actor_id TEXT REFERENCES users(id), action TEXT NOT NULL,
 target_id TEXT NOT NULL, metadata_json TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL
);
CREATE INDEX idx_audit_created ON audit_log(created_at DESC);
CREATE TRIGGER audit_no_update BEFORE UPDATE ON audit_log BEGIN SELECT RAISE(ABORT,'AUDIT_IMMUTABLE'); END;
CREATE TRIGGER audit_no_delete BEFORE DELETE ON audit_log BEGIN SELECT RAISE(ABORT,'AUDIT_IMMUTABLE'); END;
CREATE TABLE auth_rate_limits (bucket TEXT PRIMARY KEY, count INTEGER NOT NULL, window_start INTEGER NOT NULL);
-- Bootstrap is an owner-only database operation, never an HTTP API. A single
-- insert atomically grants the first administrator and records the audit event.
CREATE TABLE admin_bootstrap (
 id INTEGER PRIMARY KEY CHECK(id=1), user_id TEXT NOT NULL REFERENCES users(id), created_at TEXT NOT NULL
);
CREATE TRIGGER bootstrap_validate BEFORE INSERT ON admin_bootstrap
WHEN EXISTS(SELECT 1 FROM users WHERE role='admin' AND is_active=1)
 OR NOT EXISTS(SELECT 1 FROM users WHERE id=NEW.user_id AND is_active=1)
BEGIN SELECT RAISE(ABORT,'BOOTSTRAP_REQUIRES_EXISTING_ACTIVE_USER_AND_NO_ADMIN'); END;
CREATE TRIGGER bootstrap_apply AFTER INSERT ON admin_bootstrap BEGIN
 UPDATE users SET role='admin',updated_at=NEW.created_at WHERE id=NEW.user_id;
 INSERT INTO audit_log(id,actor_id,action,target_id,metadata_json,created_at)
 VALUES('initial-admin-bootstrap',NEW.user_id,'admin.bootstrap',NEW.user_id,'{}',NEW.created_at);
END;
CREATE TRIGGER bootstrap_no_update BEFORE UPDATE ON admin_bootstrap BEGIN SELECT RAISE(ABORT,'BOOTSTRAP_IMMUTABLE'); END;
CREATE TRIGGER bootstrap_no_delete BEFORE DELETE ON admin_bootstrap BEGIN SELECT RAISE(ABORT,'BOOTSTRAP_IMMUTABLE'); END;

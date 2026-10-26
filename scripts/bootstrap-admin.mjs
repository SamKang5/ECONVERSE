// Produces SQL only. The owner chooses where to execute it after review.
// Usage: node scripts/bootstrap-admin.mjs EXISTING_ACTIVE_USER_ID > bootstrap.sql
const userId=process.argv[2];
if(!userId||!/^[a-zA-Z0-9][a-zA-Z0-9_:-]{0,149}$/.test(userId)||process.argv.length!==3) {
 console.error('Usage: node scripts/bootstrap-admin.mjs EXISTING_ACTIVE_USER_ID');
 process.exit(1);
}
console.log('-- OWNER REVIEW REQUIRED before applying to shared or production D1.');
console.log('-- This one-time statement requires an existing active account and no active admin.');
console.log(`INSERT INTO admin_bootstrap(id,user_id,created_at) VALUES(1,'${userId}',strftime('%Y-%m-%dT%H:%M:%fZ','now'));`);

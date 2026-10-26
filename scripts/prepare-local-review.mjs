// Creates disposable local accounts. Deliberately refuses any non-loopback HTTP target.
import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const base = process.env.BASE_URL || 'http://127.0.0.1:8788';
const url = new URL(base);
assert.ok(url.protocol === 'http:' && ['127.0.0.1','localhost','[::1]'].includes(url.hostname), 'Local review accepts loopback HTTP only');
if(existsSync('.local-review/accounts.json')) {
  const prior=JSON.parse(readFileSync('.local-review/accounts.json','utf8'));
  assert.equal(prior.base,base,'Existing review accounts belong to another local server; preserve them and review manually.');
  console.log('Reusing local-only accounts in ignored .local-review/accounts.json.');
  process.exit(0);
}
const suffix = Date.now().toString(36);
const accounts = {};
for (const role of ['admin', 'editor']) {
  const account = { email: `${role}-${suffix}@review.invalid`, password: crypto.randomUUID() + 'aA1!', displayName: role === 'admin' ? 'Review Admin' : 'Review Editor' };
  const response = await fetch(`${base}/api/auth/register`, { method: 'POST', headers: { 'Content-Type':'application/json', Origin: url.origin }, body: JSON.stringify(account) });
  const data = await response.json();
  assert.equal(response.status, 201, JSON.stringify(data));
  assert.equal(data.user.role, 'learner', 'Public registration must assign learner');
  accounts[role] = { ...account, id: data.user.id };
}
mkdirSync('.local-review', { recursive: true });
const sqlQuote = x => `'${x.replaceAll("'", "''")}'`;
const sql = ['-- Disposable isolated local review accounts; no production account is touched.'];
for (const role of ['admin', 'editor']) {
  const account = accounts[role];
  sql.push(`UPDATE users SET role=${sqlQuote(role)} WHERE id=${sqlQuote(account.id)} AND email=${sqlQuote(account.email)};`);
  sql.push(`INSERT INTO audit_log(id,actor_id,action,target_id,metadata_json,created_at) VALUES (${sqlQuote(crypto.randomUUID())},NULL,'local_review_setup',${sqlQuote(account.id)},'{}',strftime('%Y-%m-%dT%H:%M:%fZ','now'));`);
}
writeFileSync('.local-review/review-users.sql', sql.join('\n'));
const localBin = fileURLToPath(new URL('../node_modules/wrangler/bin/wrangler.js', import.meta.url));
const bin = process.env.WRANGLER_BIN || (existsSync(localBin) ? localBin : null);
const args = ['d1','execute','econverse-db','--local','--persist-to','.local-review/d1','--file','.local-review/review-users.sql'];
const options = { stdio:'inherit', env:{...process.env,WRANGLER_SEND_METRICS:'false',WRANGLER_LOG_PATH:fileURLToPath(new URL('../.local-review/wrangler.log',import.meta.url))} };
const result = bin ? spawnSync(process.execPath,[bin,...args],options) : spawnSync(process.platform === 'win32'?'npx.cmd':'npx',['--yes','wrangler@4.127.1',...args],{...options,shell:process.platform === 'win32'});
assert.equal(result.status,0,'Local D1 account provisioning');
writeFileSync('.local-review/accounts.json',JSON.stringify({base,accounts},null,2),{mode:0o600});
console.log('Local-only Admin/Editor accounts saved in ignored .local-review/accounts.json.');

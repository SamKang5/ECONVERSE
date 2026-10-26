import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import { onRequest as studio } from '../functions/api/studio/[[path]].ts';
import { onRequest as admin } from '../functions/api/admin/[[path]].ts';
import { onRequest as middleware } from '../functions/api/_middleware.ts';
import { hashPassword, createSession } from '../functions/lib/auth.ts';
import { onRequestGet as courses } from '../functions/api/courses.ts';
import { onRequestGet as getQuiz } from '../functions/api/quizzes/[lessonId]/index.ts';
import { onRequestPost as submitQuiz } from '../functions/api/quizzes/[lessonId]/submit.ts';
import { onRequestPut as progress } from '../functions/api/progress/[lessonId].ts';
import { onRequestPost as register } from '../functions/api/auth/register.ts';

class Statement {
  constructor(db, sql, values = []) { Object.assign(this, { db, sql, values }); }
  bind(...values) { return new Statement(this.db, this.sql, values); }
  async first(col) { const row = this.db.prepare(this.sql).get(...this.values); return col ? row?.[col] ?? null : row ?? null; }
  async all() { return { success: true, results: this.db.prepare(this.sql).all(...this.values) }; }
  async run() { const r = this.db.prepare(this.sql).run(...this.values); return { success: true, meta: { changes: r.changes } }; }
}
export class LocalD1 {
  constructor() { this.sqlite = new DatabaseSync(':memory:'); this.sqlite.exec('PRAGMA foreign_keys=ON'); this.queue=Promise.resolve(); }
  prepare(sql) { return new Statement(this.sqlite, sql); }
  async batch(stmts) { if(this.beforeBatch) await this.beforeBatch(stmts); const task=this.queue.then(async()=>{this.sqlite.exec('BEGIN'); try { const r = []; for (const s of stmts) r.push(await s.run()); this.sqlite.exec('COMMIT'); return r; } catch (e) { this.sqlite.exec('ROLLBACK'); throw e; }});this.queue=task.catch(()=>{});return task; }
  async exec(sql) { this.sqlite.exec(sql); }
}

const db = new LocalD1();
for (const file of fs.readdirSync(new URL('../migrations/', import.meta.url)).filter(x => x.endsWith('.sql')).sort()) {
  db.sqlite.exec(fs.readFileSync(new URL('../migrations/' + file, import.meta.url), 'utf8'));
}
const password = await hashPassword('LocalTestPass123');
const now = new Date().toISOString();
for (const role of ['learner', 'editor', 'admin', 'editor2']) {
  db.sqlite.prepare('INSERT INTO users(id,email,password_hash,display_name,created_at,updated_at,role) VALUES(?,?,?,?,?,?,?)').run(role, role + '@test.local', password, role, now, now, role==='editor2'?'editor':role);
  db.sqlite.prepare('INSERT INTO gamification(user_id,updated_at) VALUES(?,?)').run(role, now);
}
const tokens = {};
for (const role of ['learner', 'editor', 'admin', 'editor2']) tokens[role] = (await createSession(db, role)).token;
let checks = 0;
const check = (actual, expected, message) => { assert.deepEqual(actual, expected, message); checks++; console.log('PASS:', message); };
async function call(handler, path, role, method = 'GET', body, headers = {}) {
  const request = new Request('https://econverse.test/api/' + path, { method, headers: { 'Content-Type': 'application/json', Origin: 'https://econverse.test', ...(role ? { Cookie: 'econverse_session=' + tokens[role] } : {}), ...headers }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
  const context = { request, env: { DB: db }, params: { path: path.split('/').slice(1), lessonId: path.split('/')[1] }, data: {}, waitUntil() {}, next: () => handler(context) };
  const response = await middleware(context);
  return { status: response.status, data: await response.json() };
}

check((await call(studio, 'studio/lessons', null)).status, 401, 'Anonymous cannot access Studio');
check((await call(studio, 'studio/lessons', 'learner')).status, 403, 'Learner cannot access Studio');
check((await call(admin, 'admin/users', 'editor')).status, 403, 'Editor cannot view users');
check((await call(admin, 'admin/analytics', 'editor')).status, 403, 'Editor cannot view analytics');
check((await call(admin, 'admin/audit', 'editor')).status, 403, 'Editor cannot view audit');
check((await call(admin, 'admin/users/admin', 'admin', 'PATCH', { role: 'learner' })).status, 409, 'Last active Admin cannot be demoted');
check((await call(admin, 'admin/users/admin', 'admin', 'PATCH', { isActive: false })).status, 409, 'Last active Admin cannot be deactivated');
check(db.sqlite.prepare("SELECT COUNT(*) n FROM audit_log WHERE action='user.update' AND target_id='admin'").get().n,0,'Rejected last-admin mutations leave no successful-change audit records');
check((await call(admin, 'admin/users/editor', 'admin', 'PATCH', { role: 'learner' }, { Origin: 'https://hostile.test' })).status, 403, 'CSRF origin rejected');

const catalog=await call(courses,'courses',null);
check(catalog.data.courses.flatMap(c=>c.lessons).length,13,'D1 catalog preserves all 13 historical lessons');
check(JSON.stringify(catalog.data).includes('correctAnswer'),false,'Catalog never exposes answer keys');
check(JSON.stringify(catalog.data).includes('explanation'),false,'Catalog never exposes quiz explanations');
check(catalog.data.courses[0].lessons.some(l=>'quiz' in l),false,'Catalog omits private quiz arrays');
const publicQuiz=await call(getQuiz,'quizzes/lesson-2a',null);
check((await call(studio,'studio/revisions/'+encodeURIComponent(publicQuiz.data.revisionId),'editor')).status,200,'Encoded historical revision identifiers can be previewed');
check(publicQuiz.data.questions.length,4,'Published quiz retains historical questions');
check(JSON.stringify(publicQuiz.data).includes('correctAnswer'),false,'Quiz GET never exposes answer keys');
const base=JSON.parse(db.sqlite.prepare("SELECT content_json FROM lesson_revisions WHERE lesson_id='lesson-2a'").get().content_json);
const create=await call(studio,'studio/lessons','editor','POST',{lessonId:'lesson-security-test',content:{...base,title:'',videoUrl:'',mainContent:[],objectives:[]}});
check(create.status,201,'Editor can persist an incomplete draft');
let revision=create.data.revision;
check((await call(studio,'studio/lessons?status=','editor')).data.revisions.some(r=>r.id===revision.id),true,'Empty All statuses filter includes owned drafts');
check((await call(studio,'studio/lessons?status=','editor2')).data.revisions.some(r=>r.id===revision.id),false,'Empty status filter still excludes another editor private draft');
check((await call(studio,`studio/revisions/${revision.id}`,'editor2')).status,404,'Editors cannot read another editor’s private draft');
check((await call(studio,'studio/lessons/lesson-security-test/revisions','editor2','POST',{})).status,404,'Editors cannot clone another editor’s unpublished content');
check((await call(studio,'studio/lessons','editor2')).data.revisions.some(r=>r.id===revision.id),false,'Editor listing excludes another editor’s private draft');
check((await call(getQuiz,'quizzes/lesson-security-test',null)).status,404,'Draft quiz is not publicly visible');
check((await call(admin,`admin/revisions/${revision.id}/publish`,'editor','POST',{lockVersion:1})).status,403,'Editor cannot publish');
check((await call(admin,'admin/users/learner','editor','PATCH',{role:'admin'})).status,403,'Editor cannot change roles');
check((await call(studio,`studio/revisions/${revision.id}/submit-review`,'editor','POST',{lockVersion:1})).status,400,'Incomplete draft cannot be submitted');
const content={...base,title:'Security workflow lesson'};
const saved=await call(studio,`studio/revisions/${revision.id}`,'editor','PATCH',{lockVersion:1,content});
check(saved.status,200,'Editor can save complete lesson and quiz');revision=saved.data.revision;
check((await call(studio,`studio/revisions/${revision.id}`,'editor','PATCH',{lockVersion:1,content})).status,409,'Stale simultaneous draft edits are rejected');
check((await call(studio,`studio/revisions/${revision.id}`,'learner')).status,403,'Learner cannot preview a private draft');
check((await call(studio,`studio/revisions/${revision.id}`,'editor')).data.revision.content.quiz.length,4,'Authorized preview includes draft quiz');
let submitted=await call(studio,`studio/revisions/${revision.id}/submit-review`,'editor','POST',{lockVersion:revision.lockVersion});
check(submitted.status,200,'Editor submits draft for review');revision=submitted.data.revision;
check((await call(studio,`studio/revisions/${revision.id}`,'editor','PATCH',{lockVersion:revision.lockVersion,content})).status,409,'Submitted revision is frozen during review');
let rejected=await call(admin,`admin/revisions/${revision.id}/reject`,'admin','POST',{lockVersion:revision.lockVersion,feedback:'Please clarify the examples.'});
check(rejected.status,200,'Admin can reject with feedback');revision=rejected.data.revision;
check(revision.feedback,'Please clarify the examples.','Rejection feedback is persisted');
submitted=await call(studio,`studio/revisions/${revision.id}/submit-review`,'editor','POST',{lockVersion:revision.lockVersion});revision=submitted.data.revision;
const published=await call(admin,`admin/revisions/${revision.id}/publish`,'admin','POST',{lockVersion:revision.lockVersion});
check(published.status,200,'Admin publishes reviewed revision');revision=published.data.revision;
check((await call(courses,'courses',null)).data.courses.flatMap(c=>c.lessons).some(l=>l.id==='lesson-security-test'),true,'Published lesson becomes learner-visible');
check((await call(studio,`studio/revisions/${revision.id}`,'editor','PATCH',{lockVersion:revision.lockVersion,content:{...content,title:'Unauthorized live edit'}})).status,409,'Published content cannot be edited in place');
const cloned=await call(studio,'studio/lessons/lesson-security-test/revisions','editor','POST',{});
check(cloned.status,201,'Editor creates a separate revision of published content');
let clone=cloned.data.revision;
await call(studio,`studio/revisions/${clone.id}`,'editor','PATCH',{lockVersion:clone.lockVersion,content:{...content,title:'New private title'}});
check((await call(courses,'courses',null)).data.courses.flatMap(c=>c.lessons).find(l=>l.id==='lesson-security-test').title,'Security workflow lesson','Draft changes do not alter live lesson');
const answers=Object.fromEntries(base.quiz.map(q=>[q.id,q.correctAnswer]));
const first=await call(submitQuiz,'quizzes/lesson-2a/submit','learner','POST',{answers,idempotencyKey:'security-first-quiz',revisionId:publicQuiz.data.revisionId});
check(first.status,200,'Learner submits server-scored quiz');
check(first.data.xpAwarded,45,'First perfect completion awards authoritative XP');
check(first.data.feedback.length,4,'Answer explanations appear only after submission');
check((await call(submitQuiz,'quizzes/lesson-2a/submit','learner','POST',{answers:{...answers,[base.quiz[0].id]:(base.quiz[0].correctAnswer+1)%base.quiz[0].options.length},idempotencyKey:'security-first-quiz',revisionId:publicQuiz.data.revisionId})).status,409,'Idempotency key reuse with changed answers is rejected');
check((await call(submitQuiz,'quizzes/lesson-2a/submit','learner','POST',{answers,idempotencyKey:'security-stale-quiz',revisionId:'old-revision'})).status,409,'Submission rejects stale quiz revision');
check((await call(progress,'progress/lesson-2a','learner','PUT',{status:'in_progress'})).status,200,'Progress update remains compatible');
check(db.sqlite.prepare("SELECT status FROM lesson_progress WHERE user_id='learner' AND lesson_id='lesson-2a'").get().status,'completed','Completed progress cannot be regressed');
check((await call(progress,'progress/lesson-2b','learner','PUT',{status:'completed'})).status,400,'Browser cannot forge completion');
const concurrentAnswers=Object.fromEntries(base.quiz.map(q=>[q.id,q.correctAnswer]));
const parallel=await Promise.all(['a','b'].map(suffix=>call(submitQuiz,'quizzes/lesson-security-test/submit','learner','POST',{answers:concurrentAnswers,idempotencyKey:'parallel-security-'+suffix})));
check(parallel.map(r=>r.status),[200,200],'Simultaneous perfect submissions both produce valid attempts');
check(parallel.reduce((n,r)=>n+r.data.xpAwarded,0),45,'Simultaneous submissions award XP exactly once');
check(db.sqlite.prepare("SELECT total_xp FROM gamification WHERE user_id='learner'").get().total_xp,90,'XP total equals one reward per completed lesson');
const audit=await call(admin,'admin/audit','admin');
check(audit.data.entries.some(e=>e.action==='revision.publish'),true,'Admin audit records publication');
const unpublish=await call(admin,`admin/revisions/${revision.id}/unpublish`,'admin','POST',{lockVersion:revision.lockVersion});
check(unpublish.status,200,'Admin can unpublish content');
check((await call(getQuiz,'quizzes/lesson-security-test',null)).status,404,'Unpublished lesson quiz is hidden');
await call(admin,'admin/users/editor','admin','PATCH',{role:'learner'});
check((await call(studio,'studio/lessons','editor')).status,403,'Demotion takes effect immediately on an existing session');
await call(admin,'admin/users/editor','admin','PATCH',{role:'editor',isActive:false});
check((await call(studio,'studio/lessons','editor')).status,401,'Deactivated account loses existing session access');
await call(admin,'admin/users/editor','admin','PATCH',{isActive:true});
check((await call(studio,'studio/lessons','editor')).status,200,'Admin can reactivate account');
// Both requests must read the old account before either transaction begins.
// Explicitly order their transactions: middleware body/crypto awaits can otherwise
// reverse Promise.all's request order and invalidate the response/audit expectations.
async function runAccountPatchRace(firstPatch,secondPatch) {
 let waiting=0,releaseBoth,releaseSecond;
 const bothRead=new Promise(resolve=>{releaseBoth=resolve;});
 const firstFinished=new Promise(resolve=>{releaseSecond=resolve;});
 db.beforeBatch=async statements=>{
  const update=statements.find(statement=>/^UPDATE users SET /.test(statement.sql));
  if(!update) return;
  waiting++;if(waiting===2) releaseBoth();await bothRead;
  const firstActive=firstPatch.isActive===undefined?null:Number(firstPatch.isActive);
  if(update.values[0] !== (firstPatch.role??null)||update.values[1] !== firstActive) await firstFinished;
 };
 try {
  const first=call(admin,'admin/users/editor2','admin','PATCH',firstPatch).finally(()=>releaseSecond());
  const second=call(admin,'admin/users/editor2','admin','PATCH',secondPatch);
  return await Promise.all([first,second]);
 } finally {db.beforeBatch=null;}
}
const userRacers=await runAccountPatchRace({role:'learner'},{isActive:false});
check(userRacers.map(response=>response.status),[200,200],'Concurrent independent account patches both succeed');
const concurrentUser=db.sqlite.prepare("SELECT role,is_active FROM users WHERE id='editor2'").get();
check({...concurrentUser},{role:'learner',is_active:0},'Concurrent role-only and deactivation-only patches preserve both changes');
const userAudits=db.sqlite.prepare("SELECT metadata_json FROM audit_log WHERE action='user.update' AND target_id='editor2' ORDER BY rowid").all().map(row=>JSON.parse(row.metadata_json));
check(userAudits.length,2,'Concurrent account changes each retain an atomic audit record');
check(userAudits[1].previousRole,'learner','Account audit reads the previous role inside its own transaction');
check(userRacers[1].data.user.role,'learner','Account patch response returns the persisted current role');
check(userRacers[1].data.user.isActive,false,'Account patch response returns the persisted activation state');
await call(admin,'admin/users/editor2','admin','PATCH',{role:'editor',isActive:true});
const reverseRacers=await runAccountPatchRace({isActive:false},{role:'learner'});
check(reverseRacers.map(response=>response.status),[200,200],'Reverse-order independent account patches both succeed');
check({...db.sqlite.prepare("SELECT role,is_active FROM users WHERE id='editor2'").get()},{role:'learner',is_active:0},'Role patch cannot reactivate an account concurrently deactivated');
check(reverseRacers[1].data.user.isActive,false,'Role-only response reports the persisted inactive state');
const lastUserAudit=JSON.parse(db.sqlite.prepare("SELECT metadata_json FROM audit_log WHERE action='user.update' AND target_id='editor2' ORDER BY rowid DESC LIMIT 1").get().metadata_json);
check(lastUserAudit.previousIsActive,false,'Atomic role audit observes the preceding deactivation');
const registration=await call(register,'auth/register',null,'POST',{email:'role-attack@test.local',password:'TestPassword123',displayName:'Public learner',role:'admin'});
check(registration.status,201,'Public registration succeeds');
check(registration.data.user.role,'learner','Registration cannot assign browser-supplied privileges');
const oversize=new Request('https://econverse.test/api/studio/lessons',{method:'POST',headers:{Origin:'https://econverse.test','Content-Type':'application/json'},body:JSON.stringify({text:'a'.repeat(300000)})});
const sizeResponse=await Promise.race([middleware({request:oversize,env:{DB:db},next:()=>{throw Error('Oversized body reached handler');}}),new Promise((_,reject)=>setTimeout(()=>reject(Error('Oversized request hung')),1000))]);
check(sizeResponse.status,413,'Oversized request returns promptly without tee cancellation deadlock');
const boot=new LocalD1();for(const file of fs.readdirSync(new URL('../migrations/',import.meta.url)).filter(x=>x.endsWith('.sql')).sort()) boot.sqlite.exec(fs.readFileSync(new URL('../migrations/'+file,import.meta.url),'utf8'));
boot.sqlite.prepare('INSERT INTO users(id,email,password_hash,display_name,created_at,updated_at) VALUES(?,?,?,?,?,?)').run('owner','owner@test.local',password,'Owner',now,now);
boot.sqlite.prepare('INSERT INTO admin_bootstrap(id,user_id,created_at) VALUES(1,?,?)').run('owner',now);
check(boot.sqlite.prepare("SELECT role FROM users WHERE id='owner'").get().role,'admin','Offline bootstrap promotes explicit existing owner');
check(boot.sqlite.prepare("SELECT COUNT(*) n FROM audit_log WHERE action='admin.bootstrap'").get().n,1,'Bootstrap grant is audited atomically');
assert.throws(()=>boot.sqlite.prepare('INSERT INTO admin_bootstrap(id,user_id,created_at) VALUES(1,?,?)').run('owner',now));checks++;console.log('PASS: Admin bootstrap cannot run twice');
console.log(`${checks} security and workflow checks passed`);

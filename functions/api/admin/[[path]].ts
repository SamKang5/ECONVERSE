import type { PagesFunction, DbUser } from '../../lib/types.ts';
import { toPublicUser } from '../../lib/auth.ts';
import { requireUser,readJson,pagination,fail,safe,decodePathSegment } from '../../lib/http.ts';
import { idValue,validateContent,revisionDto,type RevisionRow } from '../../lib/content.ts';
import { jsonResponse } from '../../lib/errors.ts';

export const onRequest:PagesFunction=safe(async ({request,env})=> {
 const db=env.DB,user=await requireUser(db,request,['admin']),url=new URL(request.url);
 const parts=url.pathname.replace(/^\/api\/admin\/?/,'').split('/').filter(Boolean).map(decodePathSegment);
 if(parts[0]==='users'&&parts.length===1&&request.method==='GET') {
  const p=pagination(url),search=url.searchParams.get('search')??'';if(search.length>254) fail(400,'VALIDATION_ERROR','Search too long.');
  const where=`WHERE email LIKE ? OR display_name LIKE ?`,args=['%'+search+'%','%'+search+'%'];
  const total=await db.prepare(`SELECT COUNT(*) n FROM users ${where}`).bind(...args).first<number>('n');
  const rows=await db.prepare(`SELECT * FROM users ${where} ORDER BY created_at DESC,id LIMIT ? OFFSET ?`).bind(...args,p.pageSize,p.offset).all<DbUser>();
  return jsonResponse({users:(rows.results??[]).map(row=>({...toPublicUser(row),isActive:row.is_active===1})),total:total??0,page:p.page,pageSize:p.pageSize});
 }
 if(parts[0]==='users'&&parts.length===2&&request.method==='PATCH') {
  const id=idValue(parts[1]),body=await readJson(request),row=await db.prepare('SELECT * FROM users WHERE id=?').bind(id).first<DbUser>();
  if(!row) fail(404,'NOT_FOUND','User not found.');
  if(body.role!==undefined&&!['learner','editor','admin'].includes(body.role)) fail(400,'VALIDATION_ERROR','Invalid role.');
  if(body.isActive!==undefined&&typeof body.isActive!=='boolean') fail(400,'VALIDATION_ERROR','isActive must be boolean.');
  if(body.role===undefined&&body.isActive===undefined) fail(400,'VALIDATION_ERROR','Provide role or isActive.');
  const role=body.role??null,active=body.isActive===undefined?null:Number(body.isActive),now=new Date().toISOString();
  await db.batch([
   // Read the previous values inside the same transaction as the mutation.
   // A failed last-admin trigger rolls back this audit record with the update.
   db.prepare(`INSERT INTO audit_log(id,actor_id,action,target_id,metadata_json,created_at)
    SELECT ?,?,'user.update',id,json_object('previousRole',role,'role',COALESCE(?,role),
      'previousIsActive',json(CASE WHEN is_active=1 THEN 'true' ELSE 'false' END),
      'isActive',json(CASE WHEN COALESCE(?,is_active)=1 THEN 'true' ELSE 'false' END)),?
    FROM users WHERE id=?`).bind(crypto.randomUUID(),user.id,role,active,now,id),
   // Omitted fields use the database's current value, not the earlier read.
   db.prepare('UPDATE users SET role=COALESCE(?,role),is_active=COALESCE(?,is_active),updated_at=? WHERE id=?').bind(role,active,now,id)
  ]);
  const current=await db.prepare('SELECT * FROM users WHERE id=?').bind(id).first<DbUser>();
  if(!current) fail(404,'NOT_FOUND','User not found.');
  return jsonResponse({user:{...toPublicUser(current),isActive:current.is_active===1}});
 }
 if(parts[0]==='analytics'&&parts.length===1&&request.method==='GET') {
  const scalar=async (sql:string)=>(await db.prepare(sql).first<number>('n'))??0;
  const [users,activeUsers,publishedLessons,completedLessons,quizAttempts,totalXp,roles]=await Promise.all([
   scalar('SELECT COUNT(*) n FROM users'),scalar('SELECT COUNT(*) n FROM users WHERE is_active=1'),
   scalar(`SELECT COUNT(*) n FROM lessons l JOIN lesson_revisions r ON l.published_revision_id=r.id WHERE l.is_active=1 AND r.status='published'`),
   scalar(`SELECT COUNT(*) n FROM lesson_progress WHERE status='completed'`),scalar('SELECT COUNT(*) n FROM quiz_attempts'),scalar('SELECT COALESCE(SUM(total_xp),0) n FROM gamification'),
   db.prepare('SELECT role,COUNT(*) n FROM users GROUP BY role').all<{role:string;n:number}>()
  ]);
  const roleCounts={learner:0,editor:0,admin:0};for(const row of roles.results??[]) roleCounts[row.role as keyof typeof roleCounts]=row.n;
  return jsonResponse({users,activeUsers,publishedLessons,completedLessons,quizAttempts,totalXp,roles:roleCounts});
 }
 if(parts[0]==='audit'&&parts.length===1&&request.method==='GET') {
  const p=pagination(url),total=(await db.prepare('SELECT COUNT(*) n FROM audit_log').first<number>('n'))??0;
  const rows=await db.prepare('SELECT * FROM audit_log ORDER BY created_at DESC,id DESC LIMIT ? OFFSET ?').bind(p.pageSize,p.offset).all<any>();
  return jsonResponse({entries:(rows.results??[]).map(row=>({id:row.id,actorId:row.actor_id,action:row.action,targetId:row.target_id,metadata:JSON.parse(row.metadata_json),createdAt:row.created_at})),total,page:p.page,pageSize:p.pageSize});
 }
 if(parts[0]==='revisions'&&parts.length===3&&request.method==='POST'&&['publish','reject','unpublish'].includes(parts[2])) {
  const id=idValue(parts[1]),action=parts[2],body=await readJson(request),row=await db.prepare('SELECT * FROM lesson_revisions WHERE id=?').bind(id).first<RevisionRow>();
  if(!row) fail(404,'NOT_FOUND','Revision not found.');
  if(!Number.isInteger(body.lockVersion)) fail(400,'VALIDATION_ERROR','lockVersion is required.');
  const required=action==='unpublish'?'published':'in_review';
  if(row.lock_version!==body.lockVersion||row.status!==required) fail(409,'CONFLICT','Revision changed or cannot make this transition.');
  if(action==='reject'&&(typeof body.feedback!=='string'||!body.feedback.trim()||body.feedback.length>4000)) fail(400,'VALIDATION_ERROR','Rejection feedback is required (maximum 4000 characters).');
  const content=action==='publish'?validateContent(JSON.parse(row.content_json),true):JSON.parse(row.content_json);
  const now=new Date().toISOString(),token=crypto.randomUUID(),status=action==='publish'?'published':action==='reject'?'draft':'archived';
  const batch=[db.prepare('UPDATE lesson_revisions SET status=?,lock_version=lock_version+1,feedback=?,updated_at=?,mutation_token=? WHERE id=? AND lock_version=? AND status=?')
   .bind(status,action==='reject'?body.feedback.trim():'',now,token,id,body.lockVersion,required)];
  if(action==='publish') {
   batch.push(
    db.prepare(`UPDATE lesson_revisions SET status='archived',lock_version=lock_version+1,updated_at=? WHERE lesson_id=? AND status='published' AND id!=? AND EXISTS(SELECT 1 FROM lesson_revisions WHERE id=? AND mutation_token=?)`).bind(now,row.lesson_id,id,id,token),
    db.prepare(`UPDATE lessons SET published_revision_id=?,is_active=1,title=?,unit_code=?,episode_code=?,points_reward=? WHERE id=? AND EXISTS(SELECT 1 FROM lesson_revisions WHERE id=? AND mutation_token=?)`).bind(id,content.title,content.unitCode,content.episodeCode,content.pointsReward,row.lesson_id,id,token)
   );
  } else if(action==='unpublish') batch.push(db.prepare(`UPDATE lessons SET published_revision_id=NULL,is_active=0 WHERE id=? AND published_revision_id=? AND EXISTS(SELECT 1 FROM lesson_revisions WHERE id=? AND mutation_token=?)`).bind(row.lesson_id,id,id,token));
  batch.push(db.prepare(`INSERT INTO audit_log(id,actor_id,action,target_id,metadata_json,created_at) SELECT ?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM lesson_revisions WHERE id=? AND mutation_token=?)`).bind(crypto.randomUUID(),user.id,'revision.'+action,id,JSON.stringify({lessonId:row.lesson_id,version:row.version,...(action==='reject'?{feedback:body.feedback.trim()}: {})}),now,id,token));
  const result=await db.batch(batch);if(!result[0].meta?.changes) fail(409,'CONFLICT','Revision changed. Refresh and retry.');
  return jsonResponse({revision:revisionDto((await db.prepare('SELECT * FROM lesson_revisions WHERE id=?').bind(id).first<RevisionRow>())!)});
 }
 fail(404,'NOT_FOUND','Admin route not found.');
});

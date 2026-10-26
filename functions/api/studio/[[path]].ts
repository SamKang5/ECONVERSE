import type { PagesFunction } from '../../lib/types.ts';
import { requireUser,readJson,pagination,fail,safe,audit,decodePathSegment } from '../../lib/http.ts';
import { idValue,validateContent,revisionDto,type RevisionRow } from '../../lib/content.ts';
import { jsonResponse } from '../../lib/errors.ts';

export const onRequest:PagesFunction=safe(async ({request,env})=> {
 const db=env.DB,user=await requireUser(db,request,['editor','admin']);
 const url=new URL(request.url),parts=url.pathname.replace(/^\/api\/studio\/?/,'').split('/').filter(Boolean).map(decodePathSegment);
 if(parts[0]==='lessons'&&parts.length===1&&request.method==='GET') {
  const p=pagination(url);const status=url.searchParams.get('status')||null;
  if(status&&!['draft','in_review','published','archived'].includes(status)) fail(400,'VALIDATION_ERROR','Invalid status.');
  const where=`WHERE (?='admin' OR created_by=? OR status='published') AND (? IS NULL OR status=?)`,args=[user.role,user.id,status,status];
  const total=await db.prepare(`SELECT COUNT(*) n FROM lesson_revisions ${where}`).bind(...args).first<number>('n');
  const rows=await db.prepare(`SELECT * FROM lesson_revisions ${where} ORDER BY updated_at DESC,id LIMIT ? OFFSET ?`).bind(...args,p.pageSize,p.offset).all<RevisionRow>();
  return jsonResponse({revisions:(rows.results??[]).map(revisionDto),total:total??0,page:p.page,pageSize:p.pageSize});
 }
 if(parts[0]==='lessons'&&request.method==='POST'&&(parts.length===1||(parts.length===3&&parts[2]==='revisions'))) {
  const body=await readJson(request),lessonId=idValue(parts[1]??body.lessonId);let content:any;
  const exists=await db.prepare('SELECT id FROM lessons WHERE id=?').bind(lessonId).first();
  if(parts.length===1) {if(exists) fail(409,'CONFLICT','Lesson already exists; create a new revision.');content=validateContent(body.content);}
  else {
   if(!exists) fail(404,'LESSON_NOT_FOUND','Lesson not found.');
   const base=await db.prepare(`SELECT * FROM lesson_revisions WHERE lesson_id=? AND (?='admin' OR created_by=? OR status='published') ORDER BY version DESC LIMIT 1`).bind(lessonId,user.role,user.id).first<RevisionRow>();
   if(!base) fail(404,'NOT_FOUND','No authorized content to revise.');content=JSON.parse(base.content_json);
  }
  const version=(await db.prepare('SELECT COALESCE(MAX(version),0)+1 n FROM lesson_revisions WHERE lesson_id=?').bind(lessonId).first<number>('n'))!;
  const id='rev_'+crypto.randomUUID(),now=new Date().toISOString();const batch=[];
  if(!exists) batch.push(db.prepare('INSERT INTO lessons(id,unit_code,episode_code,title,display_order,points_reward,is_active) VALUES(?,?,?,?,?, ?,0)').bind(lessonId,content.unitCode,content.episodeCode,content.title,99999,content.pointsReward));
  batch.push(db.prepare(`INSERT INTO lesson_revisions(id,lesson_id,version,lock_version,status,content_json,created_by,created_at,updated_at) VALUES(?,?,?,1,'draft',?,?,?,?)`).bind(id,lessonId,version,JSON.stringify(content),user.id,now,now),audit(db,user.id,'revision.create',id,{lessonId,version}));
  await db.batch(batch);
  return jsonResponse({revision:revisionDto((await db.prepare('SELECT * FROM lesson_revisions WHERE id=?').bind(id).first<RevisionRow>())!)},201);
 }
 if(parts[0]==='revisions'&&parts[1]) {
  const id=idValue(parts[1]);const row=await db.prepare('SELECT * FROM lesson_revisions WHERE id=?').bind(id).first<RevisionRow>();
  if(!row||(user.role!=='admin'&&row.created_by!==user.id&&row.status!=='published')) fail(404,'NOT_FOUND','Revision not found.');
  if(parts.length===2&&request.method==='GET') return jsonResponse({revision:revisionDto(row)});
  if(user.role!=='admin'&&row.created_by!==user.id) fail(403,'FORBIDDEN','Create your own draft to edit this lesson.');
  const isSave=parts.length===2&&request.method==='PATCH',isSubmit=parts.length===3&&parts[2]==='submit-review'&&request.method==='POST';
  if(isSave||isSubmit) {
   const body=await readJson(request);if(!Number.isInteger(body.lockVersion)) fail(400,'VALIDATION_ERROR','lockVersion is required.');
   if(row.status!=='draft'||body.lockVersion!==row.lock_version) fail(409,'CONFLICT','Revision changed or is not editable. Refresh and retry.');
   const content=validateContent(isSave?body.content:JSON.parse(row.content_json),isSubmit),token=crypto.randomUUID(),now=new Date().toISOString();
   const result=await db.batch([
    db.prepare(`UPDATE lesson_revisions SET content_json=?,status=?,lock_version=lock_version+1,updated_at=?,mutation_token=? WHERE id=? AND lock_version=? AND status='draft'`).bind(JSON.stringify(content),isSubmit?'in_review':'draft',now,token,id,body.lockVersion),
    db.prepare(`INSERT INTO audit_log(id,actor_id,action,target_id,metadata_json,created_at) SELECT ?,?,?,?,'{}',? WHERE EXISTS(SELECT 1 FROM lesson_revisions WHERE id=? AND mutation_token=?)`).bind(crypto.randomUUID(),user.id,isSubmit?'revision.submit':'revision.save',id,now,id,token)
   ]);
   if(!result[0].meta?.changes) fail(409,'CONFLICT','Revision changed. Refresh and retry.');
   return jsonResponse({revision:revisionDto((await db.prepare('SELECT * FROM lesson_revisions WHERE id=?').bind(id).first<RevisionRow>())!)});
  }
 }
 fail(404,'NOT_FOUND','Studio route not found.');
});

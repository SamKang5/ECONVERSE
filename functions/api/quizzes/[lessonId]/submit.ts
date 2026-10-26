import type { PagesFunction } from '../../../lib/types.ts';
import { hashToken } from '../../../lib/auth.ts';
import { validateIdempotencyKey } from '../../../lib/validation.ts';
import { jsonResponse } from '../../../lib/errors.ts';
import { getPublished,idValue,type RevisionContent } from '../../../lib/content.ts';
import { requireUser,readJson,fail,safe } from '../../../lib/http.ts';

function parseOption(value:unknown):number|null {
 if(typeof value==='number'&&Number.isInteger(value)) return value;
 if(typeof value==='string') {const s=value.trim().toUpperCase();if(/^[A-H]$/.test(s)) return s.charCodeAt(0)-65;if(/^\d+$/.test(s)) return Number(s);}
 return null;
}
export const onRequestPost:PagesFunction<'lessonId'>=safe(async ({request,env,params})=> {
 const db=env.DB,user=await requireUser(db,request),lessonId=idValue(params.lessonId),body=await readJson(request);
 const key=validateIdempotencyKey(body.idempotencyKey);if(!key) fail(400,'VALIDATION_ERROR','A valid idempotencyKey is required.');
 if(!body.answers||typeof body.answers!=='object'||Array.isArray(body.answers)) fail(400,'INVALID_QUIZ_SUBMISSION','Answers must be an object.');
 if(body.revisionId!==undefined&&typeof body.revisionId!=='string') fail(400,'VALIDATION_ERROR','Invalid revisionId.');
 const canonicalAnswers=Object.entries(body.answers).sort(([a],[b])=>a.localeCompare(b));
 const requestHash=await hashToken(JSON.stringify({lessonId,revisionId:body.revisionId??null,answers:canonicalAnswers}));
 const replay=async()=> {
  const prior=await db.prepare('SELECT * FROM quiz_attempts WHERE idempotency_key=? AND user_id=?').bind(key,user.id).first<any>();
  if(!prior) return null;
  if(prior.lesson_id!==lessonId||(prior.request_hash&&prior.request_hash!==requestHash)) fail(409,'IDEMPOTENCY_CONFLICT','This key was already used for a different submission.');
  return prior.result_json?JSON.parse(prior.result_json):{attemptId:prior.id,score:prior.score,totalQuestions:prior.total_questions,correctCount:prior.correct_count,xpAwarded:prior.xp_awarded,lessonCompleted:prior.correct_count===prior.total_questions,feedback:[]};
 };
 const prior=await replay();if(prior) return jsonResponse(prior);
 const revision=await getPublished(db,lessonId);if(!revision) fail(404,'LESSON_NOT_FOUND','Lesson not found.');
 if(body.revisionId!==undefined&&body.revisionId!==revision.id) fail(409,'STALE_REVISION','This quiz changed. Reload the lesson before submitting.');
 const content=JSON.parse(revision.content_json) as RevisionContent,questions=content.quiz;
 if(!questions.length) fail(404,'QUIZ_NOT_FOUND','No quiz is available.');
 if(Object.keys(body.answers).length!==questions.length||questions.some(q=>{const answer=parseOption(body.answers[q.id]);return answer===null||answer<0||answer>=q.options.length;})) fail(400,'INVALID_QUIZ_SUBMISSION','Answer every question using a valid option.');
 const correctCount=questions.filter(q=>parseOption(body.answers[q.id])===q.correctAnswer).length;
 const perfect=correctCount===questions.length,score=Math.round(correctCount/questions.length*100),attemptId='att_'+crypto.randomUUID(),now=new Date().toISOString();
 const result={attemptId,score,totalQuestions:questions.length,correctCount,xpAwarded:0,lessonCompleted:perfect,feedback:questions.map(q=>({id:q.id,correctAnswer:q.correctAnswer,explanation:q.explanation}))};
 const batch=[];
 // Durable per-lesson claim is the authority, including across simultaneous submissions.
 if(perfect) batch.push(db.prepare(`INSERT OR IGNORE INTO lesson_rewards(user_id,lesson_id,attempt_id,amount,created_at)
  SELECT ?,?,?,?,? WHERE EXISTS(SELECT 1 FROM lessons WHERE id=? AND published_revision_id=? AND is_active=1)
  AND NOT EXISTS(SELECT 1 FROM lesson_progress WHERE user_id=? AND lesson_id=? AND status='completed')`).bind(user.id,lessonId,attemptId,content.pointsReward,now,lessonId,revision.id,user.id,lessonId));
 batch.push(db.prepare(`INSERT INTO quiz_attempts(id,user_id,lesson_id,score,total_questions,correct_count,xp_awarded,submitted_at,idempotency_key,revision_id,request_hash,result_json)
  SELECT ?,?,?,?,?,?,COALESCE((SELECT amount FROM lesson_rewards WHERE attempt_id=?),0),?,?,?,?,json_set(?, '$.xpAwarded',COALESCE((SELECT amount FROM lesson_rewards WHERE attempt_id=?),0))
  WHERE EXISTS(SELECT 1 FROM lessons WHERE id=? AND published_revision_id=? AND is_active=1)`).bind(attemptId,user.id,lessonId,score,questions.length,correctCount,attemptId,now,key,revision.id,requestHash,JSON.stringify(result),attemptId,lessonId,revision.id));
 if(perfect) batch.push(
  db.prepare(`INSERT INTO xp_transactions(id,user_id,amount,reason,reference_type,reference_id,created_at) SELECT ?,user_id,amount,?,'quiz_completion',?,? FROM lesson_rewards WHERE attempt_id=? AND amount>0`).bind('tx_'+crypto.randomUUID(),'Hoàn thành bài học: '+lessonId,attemptId,now,attemptId),
  db.prepare(`UPDATE gamification SET total_xp=total_xp+COALESCE((SELECT amount FROM lesson_rewards WHERE attempt_id=?),0),
   level=CAST((total_xp+COALESCE((SELECT amount FROM lesson_rewards WHERE attempt_id=?),0))/300 AS INTEGER)+1,
   current_streak=CASE WHEN substr(updated_at,1,10)=substr(?,1,10) THEN MAX(1,current_streak) WHEN date(substr(updated_at,1,10))=date(?,'-1 day') THEN current_streak+1 ELSE 1 END,
   longest_streak=MAX(longest_streak,CASE WHEN substr(updated_at,1,10)=substr(?,1,10) THEN MAX(1,current_streak) WHEN date(substr(updated_at,1,10))=date(?,'-1 day') THEN current_streak+1 ELSE 1 END),updated_at=?
   WHERE user_id=? AND EXISTS(SELECT 1 FROM lesson_rewards WHERE attempt_id=? AND amount>0)`).bind(attemptId,attemptId,now,now,now,now,now,user.id,attemptId),
  db.prepare(`INSERT INTO lesson_progress(user_id,lesson_id,status,started_at,completed_at,updated_at)
   SELECT ?,?,'completed',?,?,? WHERE EXISTS(SELECT 1 FROM quiz_attempts WHERE id=?)
   ON CONFLICT(user_id,lesson_id) DO UPDATE SET status='completed',completed_at=COALESCE(lesson_progress.completed_at,excluded.completed_at),updated_at=excluded.updated_at`).bind(user.id,lessonId,now,now,now,attemptId)
 );
 try {await db.batch(batch);} catch(error) {
  if(String(error).includes('UNIQUE constraint')) {const response=await replay();if(response) return jsonResponse(response);fail(409,'IDEMPOTENCY_CONFLICT','This submission key is already in use.');}throw error;
 }
 const completed=await db.prepare('SELECT result_json FROM quiz_attempts WHERE id=?').bind(attemptId).first<string>('result_json');
 if(!completed) fail(409,'STALE_REVISION','This quiz changed. Reload before submitting.');
 return jsonResponse(JSON.parse(completed));
});

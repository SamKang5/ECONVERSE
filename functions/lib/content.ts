import type { D1Database } from './types.ts';
import { fail } from './http.ts';

export interface RevisionRow {
 id:string; lesson_id:string; version:number; lock_version:number;
 status:'draft'|'in_review'|'published'|'archived'; content_json:string; created_by:string|null;
 created_at:string; updated_at:string; feedback:string;
}
export interface QuizQuestion {id:string;question:string;options:string[];correctAnswer:number;explanation:string}
export interface RevisionContent {
 moduleId:string;moduleTitle:string;moduleDescription:string;category:'economics'|'finance';unitCode:string;episodeCode:string;
 title:string;shortDescription:string;duration:string;videoUrl:string;youtubeId?:string;
 overview:string;mainContentTitle:string;mainContent:string[];objectives:string[];
 summary?:{title:string;points:string[]};pointsReward:number;quiz:QuizQuestion[];
}
export function idValue(value:unknown):string {
 if(typeof value!=='string'||!value.match(/^[a-zA-Z0-9][a-zA-Z0-9_:-]{0,149}$/)) fail(400,'VALIDATION_ERROR','Invalid identifier.'); return value;
}
export function validateContent(input:unknown,complete=false):RevisionContent {
 if(!input||typeof input!=='object'||Array.isArray(input)) fail(400,'VALIDATION_ERROR','Content must be an object.');
 const raw=input as Record<string,unknown>;
 const string=(value:unknown,name:string,max=20000) => {if(typeof value!=='string'||value.length>max) fail(400,'VALIDATION_ERROR',`Invalid ${name}.`);return value.trim();};
 const list=(value:unknown,name:string,max=100) => {if(!Array.isArray(value)||value.length>max) fail(400,'VALIDATION_ERROR',`Invalid ${name}.`);return value.map(x=>string(x,name));};
 const fields=['moduleId','moduleTitle','moduleDescription','unitCode','episodeCode','title','shortDescription','duration','videoUrl','overview','mainContentTitle'];
 const c:any={}; for(const name of fields) c[name]=string(raw[name]??'',name,name==='title'?240:20000);
 if(!['economics','finance'].includes(String(raw.category))) fail(400,'VALIDATION_ERROR','Invalid category.'); c.category=raw.category;
 c.mainContent=list(raw.mainContent??[],'mainContent');c.objectives=list(raw.objectives??[],'objectives');
 if(typeof raw.pointsReward!=='number'||!Number.isInteger(raw.pointsReward)||raw.pointsReward<0||raw.pointsReward>1000) fail(400,'VALIDATION_ERROR','Reward must be an integer from 0 to 1000.');c.pointsReward=raw.pointsReward;
 if(raw.youtubeId!==undefined) {c.youtubeId=string(raw.youtubeId,'youtubeId',20);if(c.youtubeId&&!/^[A-Za-z0-9_-]{11}$/.test(c.youtubeId)) fail(400,'VALIDATION_ERROR','Invalid YouTube identifier.');}
 if(raw.summary!==undefined) {const s=raw.summary as any;if(!s||typeof s!=='object') fail(400,'VALIDATION_ERROR','Invalid summary.');c.summary={title:string(s.title??'','summary title'),points:list(s.points??[],'summary points')};}
 if(!Array.isArray(raw.quiz)||raw.quiz.length>50) fail(400,'VALIDATION_ERROR','Quiz must have at most 50 questions.');
 const ids=new Set<string>();
 c.quiz=raw.quiz.map((question:any)=> {
  if(!question||typeof question!=='object') fail(400,'VALIDATION_ERROR','Invalid question.');
  const id=idValue(question.id);if(ids.has(id)) fail(400,'VALIDATION_ERROR','Question IDs must be unique.');ids.add(id);
  const options=list(question.options,'options',8);
  if(options.length<2||typeof question.correctAnswer!=='number'||!Number.isInteger(question.correctAnswer)||question.correctAnswer<0||question.correctAnswer>=options.length) fail(400,'VALIDATION_ERROR','Invalid correct answer or options.');
  const q={id,question:string(question.question,'question'),options,correctAnswer:question.correctAnswer,explanation:string(question.explanation??'','explanation')};
  if(complete&&(!q.question||q.options.some(x=>!x)||!q.explanation)) fail(400,'VALIDATION_ERROR','Questions, options and explanations are required.');return q;
 });
 if(c.videoUrl&&!youtubeId(c.videoUrl)) fail(400,'VALIDATION_ERROR','Use a valid YouTube video URL.');
 if(complete) {
  for(const field of ['moduleId','moduleTitle','unitCode','episodeCode','title','shortDescription','duration','videoUrl','overview','mainContentTitle']) if(!c[field]) fail(400,'VALIDATION_ERROR',`${field} is required before review.`);
  if(!c.mainContent.length||c.mainContent.some((x:string)=>!x)||!c.objectives.length||c.objectives.some((x:string)=>!x)||!c.quiz.length) fail(400,'VALIDATION_ERROR','Lesson text, objectives and quiz are required before review.');
 }
 return c;
}
export function youtubeId(url:string):string|null {
 try {const u=new URL(url);if(u.protocol!=='https:'||u.username||u.password||u.port) return null;
  let id:string|null=null;
  if(u.hostname==='youtu.be') id=u.pathname.slice(1);
  else if(['youtube.com','www.youtube.com','m.youtube.com','www.youtube-nocookie.com'].includes(u.hostname)) id=u.pathname==='/watch'?u.searchParams.get('v'):u.pathname.match(/^\/(?:embed|shorts)\/([^/]+)$/)?.[1]??null;
  return id&&/^[A-Za-z0-9_-]{11}$/.test(id)?id:null;
 }catch{return null;}
}
export function revisionDto(row:RevisionRow) {return {id:row.id,lessonId:row.lesson_id,version:row.version,lockVersion:row.lock_version,status:row.status,content:JSON.parse(row.content_json),createdBy:row.created_by,updatedAt:row.updated_at,feedback:row.feedback};}
export async function getPublished(db:D1Database,id:string):Promise<RevisionRow|null> {
 return db.prepare(`SELECT r.* FROM lessons l JOIN lesson_revisions r ON r.id=l.published_revision_id AND r.lesson_id=l.id WHERE l.id=? AND l.is_active=1 AND r.status='published'`).bind(id).first<RevisionRow>();
}
export function publicLesson(row:RevisionRow) {
 const c=JSON.parse(row.content_json) as RevisionContent;
 return {id:row.lesson_id,revisionId:row.id,order:c.episodeCode,title:c.title,shortDescription:c.shortDescription,duration:c.duration,videoUrl:c.videoUrl,youtubeId:youtubeId(c.videoUrl)||(c.youtubeId&&/^[A-Za-z0-9_-]{11}$/.test(c.youtubeId)?c.youtubeId:undefined),overview:c.overview,mainContentTitle:c.mainContentTitle,mainContent:c.mainContent,objectives:c.objectives,summary:c.summary,pointsReward:c.pointsReward};
}

import type { PagesFunction } from '../../../lib/types.ts';
import { jsonResponse } from '../../../lib/errors.ts';
import { getPublished, idValue, type RevisionContent } from '../../../lib/content.ts';
import { fail, safe } from '../../../lib/http.ts';

export const onRequestGet:PagesFunction<'lessonId'>=safe(async ({env,params})=> {
 const lessonId=idValue(params.lessonId),revision=await getPublished(env.DB,lessonId);
 if(!revision) fail(404,'LESSON_NOT_FOUND','Lesson not found.');
 const content=JSON.parse(revision.content_json) as RevisionContent;
 if(!content.quiz.length) fail(404,'QUIZ_NOT_FOUND','No quiz is available.');
 return jsonResponse({lessonId,revisionId:revision.id,questions:content.quiz.map((q,i)=>({id:q.id,questionOrder:i+1,questionText:q.question,options:q.options}))});
});

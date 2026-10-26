import type { PagesFunction } from '../../lib/types.ts';
import { getPublished, publicLesson, idValue } from '../../lib/content.ts';
import { fail, safe } from '../../lib/http.ts';
import { jsonResponse } from '../../lib/errors.ts';
export const onRequestGet:PagesFunction<'lessonId'>=safe(async ({env,params})=> {
 const row=await getPublished(env.DB,idValue(params.lessonId));if(!row) fail(404,'LESSON_NOT_FOUND','Lesson not found.');return jsonResponse({lesson:publicLesson(row)});
});

import type { PagesFunction } from '../lib/types.ts';
import { jsonResponse } from '../lib/errors.ts';
import { publicLesson, type RevisionRow } from '../lib/content.ts';
import { safe } from '../lib/http.ts';
export const onRequestGet:PagesFunction=safe(async ({env})=> {
 const rows=await env.DB.prepare(`SELECT r.* FROM lessons l JOIN lesson_revisions r ON r.id=l.published_revision_id AND r.lesson_id=l.id WHERE l.is_active=1 AND r.status='published' ORDER BY l.display_order,l.id`).all<RevisionRow>();
 const courses:any[]=[];
 for(const row of rows.results??[]) {const c=JSON.parse(row.content_json);let course=courses.find(x=>x.id===c.moduleId);if(!course) {course={id:c.moduleId,title:c.moduleTitle,description:c.moduleDescription,category:c.category,icon:c.category==='finance'?'PiggyBank':'TrendingUp',lessons:[]};courses.push(course);}course.lessons.push(publicLesson(row));}
 return jsonResponse({courses});
});

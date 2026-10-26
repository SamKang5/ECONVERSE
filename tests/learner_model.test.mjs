import assert from 'node:assert/strict';
import { filterCourses, findResumeLesson, sortProgressByRecency, youtubeEmbedUrl } from '../src/learnerModel.ts';

const courses = [{id:'module-2',title:'Unit 2',description:'Co giãn',category:'economics',icon:'TrendingUp',lessons:[{id:'lesson-2a',title:'PED',order:'2A'},{id:'lesson-2b',title:'YED',order:'2B'}]}];
assert.equal(findResumeLesson(courses, [{lessonId:'lesson-2a',status:'completed'},{lessonId:'lesson-2b',status:'in_progress'}]).lesson.id, 'lesson-2b');
assert.equal(findResumeLesson(courses, [{lessonId:'lesson-2a',status:'completed'}]).lesson.id, 'lesson-2b');
assert.equal(filterCourses(courses,'finance','').length,0);
assert.equal(filterCourses(courses,'all','yed')[0].lessons[0].id,'lesson-2b');
assert.equal(youtubeEmbedUrl('https://youtu.be/dQw4w9WgXcQ'),'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
assert.equal(youtubeEmbedUrl('https://evil.test/watch?v=dQw4w9WgXcQ'),null);
assert.equal(youtubeEmbedUrl('javascript:alert(1)'),null);
assert.equal(youtubeEmbedUrl('placeholder'),null);
const visits = [
  {lessonId:'lesson-2a',status:'in_progress',updatedAt:'2026-10-22T03:00:00.000Z'},
  {lessonId:'lesson-2b',status:'in_progress',updatedAt:'2026-10-22T03:05:00.000Z'},
];
assert.equal(findResumeLesson(courses, visits).lesson.id, 'lesson-2b', 'Resume the latest view, not the first lesson in course order');
assert.deepEqual(sortProgressByRecency(visits).map(item => item.lessonId), ['lesson-2b','lesson-2a'], 'Recent lessons use view timestamps');
assert.deepEqual(visits.map(item => item.lessonId), ['lesson-2a','lesson-2b'], 'Sorting does not mutate server state');
assert.equal(findResumeLesson(courses, [visits[0], {...visits[1],status:'completed'}]).lesson.id, 'lesson-2a', 'Resume continues an unfinished lesson even after revisiting a completed one');
assert.deepEqual(sortProgressByRecency([{lessonId:'missing'}, {lessonId:'invalid',updatedAt:'invalid'}, visits[1]]).map(item => item.lessonId), ['lesson-2b','missing','invalid'], 'Missing legacy timestamps stay stable behind dated views');
console.log('Learner model: 13 assertions passed');

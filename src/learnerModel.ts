import type { PublishedCourse } from './services/content.ts';
import type { LessonProgressItem } from './services/api.ts';

export function sortProgressByRecency(progress: LessonProgressItem[]) {
  return [...progress].sort((a, b) => (Date.parse(b.updatedAt ?? '') || 0) - (Date.parse(a.updatedAt ?? '') || 0));
}

export function findResumeLesson(courses: PublishedCourse[], progress: LessonProgressItem[]) {
  const entries = courses.flatMap(course => course.lessons.map(lesson => ({ course, lesson })));
  const recent = sortProgressByRecency(progress);
  return recent.filter(item => item.status === 'in_progress').map(item => entries.find(entry => entry.lesson.id === item.lessonId)).find(Boolean)
    ?? entries.find(entry => !progress.some(item => item.lessonId === entry.lesson.id && item.status === 'completed'))
    ?? entries[0] ?? null;
}

export function filterCourses(courses: PublishedCourse[], category: string, query: string) {
  const normalized = query.trim().toLocaleLowerCase('vi');
  return courses.filter(course => category === 'all' || course.category === category).map(course => ({ ...course,
    lessons: course.lessons.filter(lesson => !normalized || `${course.title} ${lesson.title} ${lesson.order} ${lesson.shortDescription}`.toLocaleLowerCase('vi').includes(normalized)),
  })).filter(course => course.lessons.length > 0);
}

export function youtubeEmbedUrl(source?: string, youtubeId?: string): string | null {
  if (youtubeId && /^[\w-]{11}$/.test(youtubeId)) return `https://www.youtube-nocookie.com/embed/${youtubeId}`;
  if (!source) return null;
  try {
    const url = new URL(source);
    if (url.protocol !== 'https:') return null;
    let id: string | null = null;
    if (url.hostname === 'youtu.be') id = url.pathname.slice(1);
    if (['youtube.com', 'www.youtube.com', 'www.youtube-nocookie.com'].includes(url.hostname)) {
      id = url.searchParams.get('v') || url.pathname.match(/^\/(?:embed|shorts)\/([\w-]{11})$/)?.[1] || null;
    }
    return id && /^[\w-]{11}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  } catch { return null; }
}

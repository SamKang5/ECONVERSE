export interface PublishedLesson {
  id: string;
  revisionId: string;
  order?: string | number;
  title: string;
  shortDescription: string;
  duration: string;
  videoUrl?: string;
  youtubeId?: string;
  overview?: string;
  mainContentTitle?: string;
  mainContent?: string[];
  objectives?: string[];
  summary?: { title: string; points: string[]; infographicUrl?: string };
  pointsReward: number;
}

export interface PublishedCourse {
  id: string;
  title: string;
  description: string;
  category: 'economics' | 'finance';
  icon: string;
  lessons: PublishedLesson[];
}

export async function getCourses(): Promise<PublishedCourse[]> {
  const response = await fetch('/api/courses', { credentials: 'include', headers: { Accept: 'application/json' } });
  const body = await response.json().catch(() => null);
  if (!response.ok || !Array.isArray(body?.courses)) throw new Error(body?.error?.message || 'Không thể tải thư viện. Vui lòng thử lại.');
  return body.courses;
}

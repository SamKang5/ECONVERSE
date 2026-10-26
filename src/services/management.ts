import type { PublicUser } from './api';

export type RevisionStatus = 'draft' | 'in_review' | 'published' | 'archived';
export interface DraftQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
export interface RevisionContent {
  moduleId: string;
  moduleTitle: string;
  moduleDescription: string;
  category: 'economics' | 'finance';
  unitCode: string;
  episodeCode: string;
  title: string;
  shortDescription: string;
  duration: string;
  videoUrl: string;
  overview: string;
  mainContentTitle: string;
  mainContent: string[];
  objectives: string[];
  summary: { title: string; points: string[] };
  pointsReward: number;
  quiz: DraftQuestion[];
  [key: string]: unknown;
}
export interface Revision {
  id: string;
  lessonId: string;
  version: number;
  lockVersion: number;
  status: RevisionStatus;
  content: RevisionContent;
  createdBy: string | null;
  updatedAt: string;
  feedback: string | null;
}
export interface ManagedUser extends PublicUser { isActive: boolean }
export interface AuditEntry {
  id: string;
  actorId: string | null;
  action: string;
  targetId: string;
  metadata: unknown;
  createdAt: string;
}
export interface Analytics {
  users: number;
  activeUsers: number;
  publishedLessons: number;
  completedLessons: number;
  quizAttempts: number;
  totalXp: number;
  roles: Record<'learner' | 'editor' | 'admin', number>;
}
export interface Page { total: number; page: number; pageSize: number }

export class ManagementError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

async function request<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
  const response = await fetch(`/api/${path}`, {
    method,
    credentials: 'include',
    cache: 'no-store',
    headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ManagementError(response.status, data?.error?.message || `Request failed (${response.status}).`);
  }
  if (!data || typeof data !== 'object') throw new ManagementError(502, 'The server returned an invalid response.');
  return data as T;
}

const id = encodeURIComponent;
export const managementApi = {
  listRevisions: (status = '', page = 1) => request<Page & { revisions: Revision[] }>(
    `studio/lessons?status=${id(status)}&page=${page}&pageSize=25`),
  getRevision: (revisionId: string) => request<{ revision: Revision }>(`studio/revisions/${id(revisionId)}`),
  create: (lessonId: string, content: RevisionContent) => request<{ revision: Revision }>(
    'studio/lessons', 'POST', { lessonId, content }),
  branch: (lessonId: string) => request<{ revision: Revision }>(`studio/lessons/${id(lessonId)}/revisions`, 'POST', {}),
  save: (revisionId: string, lockVersion: number, content: RevisionContent) => request<{ revision: Revision }>(
    `studio/revisions/${id(revisionId)}`, 'PATCH', { lockVersion, content }),
  submit: (revisionId: string, lockVersion: number) => request<{ revision: Revision }>(
    `studio/revisions/${id(revisionId)}/submit-review`, 'POST', { lockVersion }),
  review: (revisionId: string, action: 'publish' | 'reject' | 'unpublish', lockVersion: number, feedback?: string) =>
    request<{ revision: Revision }>(`admin/revisions/${id(revisionId)}/${action}`, 'POST', { lockVersion, ...(feedback ? { feedback } : {}) }),
  users: (search = '', page = 1) => request<Page & { users: ManagedUser[] }>(
    `admin/users?search=${id(search)}&page=${page}&pageSize=25`),
  updateUser: (userId: string, patch: { role?: PublicUser['role']; isActive?: boolean }) => request<{ user: ManagedUser }>(
    `admin/users/${id(userId)}`, 'PATCH', patch),
  analytics: () => request<Analytics>('admin/analytics'),
  audit: (page = 1) => request<Page & { entries: AuditEntry[] }>(`admin/audit?page=${page}&pageSize=25`),
};

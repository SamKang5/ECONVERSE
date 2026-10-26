/**
 * ECONVERSE API Client Service
 * Typed client for Cloudflare Pages Functions backend with cookie credentials
 */

export interface ApiErrorPayload {
  code: string;
  message: string;
}

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

export interface PublicUser {
  id: string;
  email: string;
  displayName: string;
  role: 'learner' | 'editor' | 'admin';
  createdAt?: string;
  lastLoginAt?: string | null;
}

export interface SessionResponse {
  authenticated: boolean;
  user?: PublicUser;
}

export interface LessonProgressItem {
  lessonId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completedAt: string | null;
  updatedAt?: string;
}

export interface GamificationSnapshot {
  totalXp: number;
  level: number;
  currentStreak: number;
  longestStreak?: number;
  updatedAt?: string;
}

export interface ProgressResponse {
  lessons: LessonProgressItem[];
  gamification: GamificationSnapshot;
}

export interface SanitizedQuestion {
  id: string;
  questionOrder: number;
  questionText: string;
  options: string[];
}

export interface QuizQuestionsResponse {
  lessonId: string;
  revisionId?: string;
  questions: SanitizedQuestion[];
}

export interface QuizSubmitPayload {
  answers: Record<string, number | string>;
  idempotencyKey: string;
  revisionId?: string;
}

export interface QuizSubmitResponse {
  attemptId: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  xpAwarded: number;
  lessonCompleted: boolean;
  feedback?: { id: string; correctAnswer: number; explanation: string }[];
}

export interface QuizAttemptRecord {
  id: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  xpAwarded: number;
  submittedAt: string;
}

export interface QuizHistoryResponse {
  lessonId: string;
  attempts: QuizAttemptRecord[];
}

export interface XpTransactionRecord {
  id: string;
  amount: number;
  reason: string;
  referenceType: string | null;
  referenceId: string | null;
  createdAt: string;
}

export interface XpHistoryResponse {
  transactions: XpTransactionRecord[];
}

export interface PetRecord {
  id: string;
  name: string;
  stage: number;
  requiredXp: number;
  metadata: {
    species?: string;
    description?: string;
  } | null;
}

export interface UserPetRecord extends PetRecord {
  isActive: boolean;
  unlockedAt: string;
}

export interface PetsMeResponse {
  activePet: UserPetRecord | null;
  pets: UserPetRecord[];
}

export interface InventoryItemRecord {
  id: string;
  name: string;
  itemType: string;
  costXp: number;
  metadata: {
    svgItem?: string;
    cssStyle?: string;
  } | null;
  owned: boolean;
  quantity: number;
}

export interface InventoryResponse {
  inventory: InventoryItemRecord[];
}

async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    credentials: 'include', // Include HttpOnly cookies
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const res = await fetch(url, config);

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // Non-JSON response
  }

  if (!res.ok) {
    const errorCode = data?.error?.code || 'UNKNOWN_ERROR';
    const errorMessage =
      data?.error?.message || `Yêu cầu thất bại với mã lỗi ${res.status}.`;
    throw new ApiError(errorCode, errorMessage, res.status);
  }

  return data as T;
}

export const apiClient = {
  auth: {
    getSession: () => request<SessionResponse>('/api/auth/session', { method: 'GET' }),
    register: (payload: { email: string; password: string; displayName: string }) =>
      request<{ user: PublicUser }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    login: (payload: { email: string; password: string }) =>
      request<{ user: PublicUser }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    logout: () => request<{ success: boolean }>('/api/auth/logout', { method: 'POST' }),
  },

  me: {
    get: () => request<{ user: PublicUser }>('/api/me', { method: 'GET' }),
    update: (displayName: string) => request<{ user: PublicUser }>('/api/me', { method: 'PATCH', body: JSON.stringify({ displayName }) }),
  },

  progress: {
    get: () => request<ProgressResponse>('/api/progress', { method: 'GET' }),
    update: (lessonId: string, status: 'not_started' | 'in_progress' | 'completed') =>
      request<{ success: boolean; lessonId: string; status: string }>(
        `/api/progress/${encodeURIComponent(lessonId)}`,
        {
          method: 'PUT',
          body: JSON.stringify({ status }),
        }
      ),
  },

  quizzes: {
    get: (lessonId: string) =>
      request<QuizQuestionsResponse>(`/api/quizzes/${encodeURIComponent(lessonId)}`, {
        method: 'GET',
      }),
    submit: (lessonId: string, payload: QuizSubmitPayload) =>
      request<QuizSubmitResponse>(`/api/quizzes/${encodeURIComponent(lessonId)}/submit`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    getHistory: (lessonId: string) =>
      request<QuizHistoryResponse>(
        `/api/quizzes/${encodeURIComponent(lessonId)}/history`,
        { method: 'GET' }
      ),
  },

  gamification: {
    get: () => request<GamificationSnapshot>('/api/gamification', { method: 'GET' }),
    getXpHistory: () =>
      request<XpHistoryResponse>('/api/gamification/xp-history', { method: 'GET' }),
  },

  pets: {
    getAll: () => request<{ pets: PetRecord[] }>('/api/pets', { method: 'GET' }),
    getMe: () => request<PetsMeResponse>('/api/pets/me', { method: 'GET' }),
  },

  inventory: {
    getAll: () => request<InventoryResponse>('/api/inventory', { method: 'GET' }),
  },
};

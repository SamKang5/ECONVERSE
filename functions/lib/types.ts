/**
 * Cloudflare D1 & Pages Function Type Definitions
 */

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<D1ExecResult>;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  all<T = unknown>(): Promise<D1Result<T>>;
  run<T = unknown>(): Promise<D1Result<T>>;
}

export interface D1Result<T = unknown> {
  results?: T[];
  success: boolean;
  meta?: Record<string, unknown>;
  error?: string;
}

export interface D1ExecResult {
  count: number;
  duration: number;
}

export interface Env {
  DB: D1Database;
  ENVIRONMENT?: string;
}

export type PagesFunction<
  TParams extends string = any,
  TEnv = Env,
  TData extends Record<string, unknown> = Record<string, unknown>
> = (
  context: EventContext<TEnv, TParams, TData>
) => Response | Promise<Response>;

export interface EventContext<TEnv, TParams extends string, TData> {
  request: Request;
  functionPath: string;
  waitUntil: (promise: Promise<unknown>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  env: TEnv;
  params: Record<TParams, string | string[]>;
  data: TData;
}

// Database Models
export interface DbUser {
  id: string;
  email: string;
  password_hash: string;
  display_name: string;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
  is_active: number;
}

export interface DbSession {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: string;
  created_at: string;
  last_used_at: string;
  revoked_at: string | null;
}

export interface DbLesson {
  id: string;
  unit_code: string;
  episode_code: string;
  title: string;
  display_order: number;
  points_reward: number;
  is_active: number;
}

export interface DbLessonProgress {
  user_id: string;
  lesson_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  started_at: string;
  completed_at: string | null;
  updated_at: string;
}

export interface DbQuizQuestion {
  id: string;
  lesson_id: string;
  question_order: number;
  question_text: string;
  options_json: string;
  correct_option: number;
  explanation: string;
  is_active: number;
}

export interface DbQuizAttempt {
  id: string;
  user_id: string;
  lesson_id: string;
  score: number;
  total_questions: number;
  correct_count: number;
  xp_awarded: number;
  submitted_at: string;
  idempotency_key: string;
}

export interface DbGamification {
  user_id: string;
  total_xp: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  updated_at: string;
}

export interface DbXpTransaction {
  id: string;
  user_id: string;
  amount: number;
  reason: string;
  reference_type: string | null;
  reference_id: string | null;
  created_at: string;
}

export interface DbPet {
  id: string;
  name: string;
  stage: number;
  required_xp: number;
  metadata_json: string | null;
  is_active: number;
}

export interface DbUserPet {
  user_id: string;
  pet_id: string;
  is_active: number;
  unlocked_at: string;
}

export interface DbInventoryItem {
  id: string;
  name: string;
  item_type: string;
  cost_xp: number;
  metadata_json: string | null;
  is_active: number;
}

export interface DbUserInventory {
  user_id: string;
  item_id: string;
  quantity: number;
  updated_at: string;
}

// Public API DTOs
export interface PublicUser {
  id: string;
  email: string;
  displayName: string;
  createdAt?: string;
  lastLoginAt?: string | null;
}

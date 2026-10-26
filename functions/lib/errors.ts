/**
 * Standardized Error Handling & Response Helpers
 */

export const ErrorCodes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  LESSON_NOT_FOUND: 'LESSON_NOT_FOUND',
  QUIZ_NOT_FOUND: 'QUIZ_NOT_FOUND',
  INVALID_QUIZ_SUBMISSION: 'INVALID_QUIZ_SUBMISSION',
  DUPLICATE_REQUEST: 'DUPLICATE_REQUEST',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

export function jsonError(
  code: ErrorCode,
  message: string,
  status = 400,
  headers: Record<string, string> = {}
): Response {
  return new Response(
    JSON.stringify({
      error: {
        code,
        message,
      },
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        ...headers,
      },
    }
  );
}

export function jsonResponse<T>(
  data: T,
  status = 200,
  headers: Record<string, string> = {}
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...headers,
    },
  });
}

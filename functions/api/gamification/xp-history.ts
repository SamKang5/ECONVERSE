import type { PagesFunction, DbXpTransaction } from '../../lib/types.ts';
import { authenticateRequest } from '../../lib/auth.ts';
import { jsonError, jsonResponse, ErrorCodes } from '../../lib/errors.ts';

export const onRequestGet: PagesFunction = async (context) => {
  const { request, env } = context;
  const db = env.DB;

  const auth = await authenticateRequest(db, request);
  if (!auth) {
    return jsonError(
      ErrorCodes.UNAUTHORIZED,
      'Yêu cầu đăng nhập để xem lịch sử XP.',
      401
    );
  }

  const txResult = await db
    .prepare(
      `SELECT id, amount, reason, reference_type, reference_id, created_at
       FROM xp_transactions
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 50`
    )
    .bind(auth.user.id)
    .all<DbXpTransaction>();

  const transactions = (txResult.results || []).map((t) => ({
    id: t.id,
    amount: t.amount,
    reason: t.reason,
    referenceType: t.reference_type,
    referenceId: t.reference_id,
    createdAt: t.created_at,
  }));

  return jsonResponse({
    transactions,
  });
};

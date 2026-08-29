import type { PagesFunction, DbInventoryItem, DbUserInventory } from '../../lib/types.ts';
import { authenticateRequest } from '../../lib/auth.ts';
import { jsonError, jsonResponse, ErrorCodes } from '../../lib/errors.ts';

export const onRequestGet: PagesFunction = async (context) => {
  const { request, env } = context;
  const db = env.DB;

  const auth = await authenticateRequest(db, request);
  if (!auth) {
    return jsonError(
      ErrorCodes.UNAUTHORIZED,
      'Yêu cầu đăng nhập để xem kho đồ.',
      401
    );
  }

  const itemsResult = await db
    .prepare('SELECT id, name, item_type, cost_xp, metadata_json FROM inventory_items WHERE is_active = 1')
    .all<DbInventoryItem>();

  const userInventoryResult = await db
    .prepare('SELECT item_id, quantity, updated_at FROM user_inventory WHERE user_id = ?')
    .bind(auth.user.id)
    .all<DbUserInventory>();

  const ownedMap = new Map(
    (userInventoryResult.results || []).map((ui) => [ui.item_id, ui.quantity])
  );

  const inventory = (itemsResult.results || []).map((item) => ({
    id: item.id,
    name: item.name,
    itemType: item.item_type,
    costXp: item.cost_xp,
    metadata: item.metadata_json ? JSON.parse(item.metadata_json) : null,
    owned: ownedMap.has(item.id),
    quantity: ownedMap.get(item.id) || 0,
  }));

  return jsonResponse({
    inventory,
  });
};

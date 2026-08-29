import type { PagesFunction, DbPet } from '../../lib/types.ts';
import { jsonResponse } from '../../lib/errors.ts';

export const onRequestGet: PagesFunction = async (context) => {
  const { env } = context;
  const db = env.DB;

  const petsResult = await db
    .prepare('SELECT id, name, stage, required_xp, metadata_json FROM pets WHERE is_active = 1')
    .all<DbPet>();

  const pets = (petsResult.results || []).map((p) => ({
    id: p.id,
    name: p.name,
    stage: p.stage,
    requiredXp: p.required_xp,
    metadata: p.metadata_json ? JSON.parse(p.metadata_json) : null,
  }));

  return jsonResponse({
    pets,
  });
};

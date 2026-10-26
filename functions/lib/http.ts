import type { D1Database, DbUser, PagesFunction } from './types.ts';
import { authenticateRequest } from './auth.ts';
import { jsonResponse } from './errors.ts';

export class HttpError extends Error {
  status:number;
  code:string;
  constructor(status: number, code: string, message: string) { super(message); this.status=status; this.code=code; }
}
export function fail(status: number, code: string, message: string): never { throw new HttpError(status,code,message); }
export async function requireUser(db: D1Database, request: Request, roles?: string[]): Promise<DbUser> {
  const auth = await authenticateRequest(db, request);
  if (!auth) fail(401,'UNAUTHORIZED','Please sign in.');
  if (roles && !roles.includes(auth.user.role)) fail(403,'FORBIDDEN','You do not have permission for this action.');
  return auth.user;
}
export async function readJson(request: Request): Promise<Record<string, any>> {
  let body: any;
  try { body = await request.json(); } catch { fail(400,'VALIDATION_ERROR','Expected a JSON object.'); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) fail(400,'VALIDATION_ERROR','Expected a JSON object.');
  return body;
}
export function pagination(url: URL) {
  const number = (name: string, fallback: number, max: number) => {
    const raw=url.searchParams.get(name); if(raw===null) return fallback;
    const n=Number(raw); if(!Number.isInteger(n)||n<1||n>max) fail(400,'VALIDATION_ERROR',`Invalid ${name}.`); return n;
  };
  const page=number('page',1,100000), pageSize=number('pageSize',25,100);
  return {page,pageSize,offset:(page-1)*pageSize};
}
export function decodePathSegment(segment:string):string {
  try {return decodeURIComponent(segment);}catch {fail(400,'VALIDATION_ERROR','Invalid URL encoding.');}
}
export function safe(handler: PagesFunction): PagesFunction {
  return async context => {
    try { return await handler(context); }
    catch(error) {
      if(error instanceof HttpError) return jsonResponse({error:{code:error.code,message:error.message}},error.status);
      if(String(error).includes('LAST_ACTIVE_ADMIN')) return jsonResponse({error:{code:'LAST_ACTIVE_ADMIN',message:'At least one active administrator is required.'}},409);
      if(String(error).includes('UNIQUE constraint')) return jsonResponse({error:{code:'CONFLICT',message:'This record already exists or changed. Refresh and retry.'}},409);
      console.error('API request failed',error instanceof Error?error.name:'unknown');
      return jsonResponse({error:{code:'INTERNAL_ERROR',message:'Unable to complete the request.'}},500);
    }
  };
}
export function audit(db: D1Database, actor: string | null, action: string, target: string, metadata: Record<string,unknown> = {}) {
  return db.prepare('INSERT INTO audit_log(id,actor_id,action,target_id,metadata_json,created_at) VALUES(?,?,?,?,?,?)')
    .bind(crypto.randomUUID(),actor,action,target,JSON.stringify(metadata),new Date().toISOString());
}

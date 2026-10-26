import type { PagesFunction } from '../lib/types.ts';
import { fail, safe } from '../lib/http.ts';
import { hashToken } from '../lib/auth.ts';

export const onRequest: PagesFunction = safe(async context => {
  const { request } = context;
  if (!['GET','HEAD','OPTIONS'].includes(request.method)) {
    const origin=request.headers.get('Origin');
    if(origin ? origin !== new URL(request.url).origin : request.headers.get('Sec-Fetch-Site') !== 'same-origin') fail(403,'FORBIDDEN','Same-origin requests are required.');
    if(request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase()!=='application/json') fail(415,'UNSUPPORTED_MEDIA_TYPE','Use application/json.');
    // Measure actual body, not only the client-controlled Content-Length header.
    const reader=request.clone().body?.getReader(); let size=0;
    if(reader) { while(true) { const {done,value}=await reader.read(); if(done) break; size+=value.byteLength; if(size>262144) { void reader.cancel().catch(()=>{}); fail(413,'PAYLOAD_TOO_LARGE','Request exceeds 256 KiB.'); } } }
    if(size>0) {let body:unknown;try {body=await request.clone().json();}catch {fail(400,'VALIDATION_ERROR','Expected JSON.');}if(!body||typeof body!=='object'||Array.isArray(body)) fail(400,'VALIDATION_ERROR','Expected a JSON object.');}
    if(/^\/api\/auth\/(login|register)\/?$/.test(new URL(request.url).pathname)) {
      const now=Math.floor(Date.now()/1000),windowStart=Math.floor(now/900)*900;
      const bucket=await hashToken('auth:'+String(request.headers.get('CF-Connecting-IP')??'local'));
      const rate=await context.env.DB.prepare(`INSERT INTO auth_rate_limits(bucket,count,window_start) VALUES(?,1,?)
        ON CONFLICT(bucket) DO UPDATE SET count=CASE WHEN window_start=excluded.window_start THEN count+1 ELSE 1 END,window_start=excluded.window_start RETURNING count`)
        .bind(bucket,windowStart).first<number>('count');
      if((rate??0)>30) fail(429,'RATE_LIMITED','Too many authentication attempts. Try again in 15 minutes.');
    }
  }
  const response=await context.next();
  const headers=new Headers(response.headers);
  headers.set('Cache-Control','no-store');
  headers.set('X-Content-Type-Options','nosniff');
  headers.set('Referrer-Policy','same-origin');
  return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
});

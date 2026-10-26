// Hide only this implementation's disposable published QA lessons; preserve every row/history.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const {base,accounts}=JSON.parse(readFileSync('.local-review/accounts.json','utf8'));
const origin=new URL(base);
assert.ok(origin.protocol==='http:'&&['127.0.0.1','localhost'].includes(origin.hostname),'Local review only');
const login=await fetch(base+'/api/auth/login',{method:'POST',headers:{Origin:origin.origin,'Content-Type':'application/json'},body:JSON.stringify(accounts.admin)});
assert.equal(login.status,200,'Local review Admin login');
const cookie=login.headers.get('set-cookie')?.split(';')[0];
assert.ok(cookie);
let page=1,hidden=0;
while(true) {
 const response=await fetch(`${base}/api/studio/lessons?status=published&page=${page}&pageSize=100`,{headers:{Cookie:cookie}});
 assert.equal(response.status,200);
 const data=await response.json();
 const fixtures=data.revisions.filter(item=>/^review-[0-9a-f-]{36}$/.test(item.lessonId)&&item.content.title.startsWith('Local review lesson')||/^browser-[a-z0-9]+$/.test(item.lessonId)&&item.content.title.startsWith('Browser reviewed economics lesson'));
 for(const revision of fixtures) {
  const unpublished=await fetch(`${base}/api/admin/revisions/${encodeURIComponent(revision.id)}/unpublish`,{method:'POST',headers:{Cookie:cookie,Origin:origin.origin,'Content-Type':'application/json'},body:JSON.stringify({lockVersion:revision.lockVersion})});
  assert.equal(unpublished.status,200,'Unpublish disposable QA fixture');hidden++;
 }
 if(fixtures.length) {page=1;continue;}
 if(page*data.pageSize>=data.total) break;
 page++;
}
console.log(`Unpublished ${hidden} disposable QA lessons from the local learner library. All lesson rows, attempts, progress, revisions, XP and audit history remain preserved.`);

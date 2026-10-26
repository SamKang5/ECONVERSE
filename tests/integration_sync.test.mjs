import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { integrationPath, isOwned } from '../scripts/sync-integration.mjs';

for(const name of ['tests/e2e/run_motion_review.mjs','tests/e2e/motion_polish.js','tests/e2e/final_integration.js','tests/e2e/motion_performance.js','tests/e2e/motion_lifecycle.js','tests/e2e/motion_touch.js','MOTION_POLISH_REPORT.md','FINAL_INTEGRATION_REVIEW.md']) {
 assert.equal(isOwned('frontend',name),true,`frontend review artifact must synchronize: ${name}`);
}
for(const name of ['.motion-review/journeys.js','.qa-review/accounts.json','.local-review/accounts.json','tests/e2e/motion-evidence/private.json','package.json','.gitignore']) {
 assert.equal(isOwned('frontend',name),false,`frontend must not overwrite shared configuration or copy private/generated output: ${name}`);
}
assert.equal(isOwned('backend','.gitignore'),true,'backend owns the combined ignore rules');
assert.equal(isOwned('backend','package.json'),true,'backend owns test scripts');
assert.equal(isOwned('backend','src/App.tsx'),false,'backend must not overwrite frontend source');
const target=resolve('integration-sync-test-target');
assert.equal(integrationPath(target,'tests/e2e/motion_polish.js'),resolve(target,'tests/e2e/motion_polish.js'));
for(const name of ['../outside.txt','tests/../../outside.txt',resolve(target,'../outside.txt')]) {
 assert.throws(()=>integrationPath(target,name),/Path outside integration worktree/,`reject traversal: ${name}`);
}
console.log('Integration sync ownership/path checks PASS; no worktree or D1 files were written.');

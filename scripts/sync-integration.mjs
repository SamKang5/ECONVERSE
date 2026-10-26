// Combine uncommitted owned files without commits, merges, resets, or changes to source worktrees.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { dirname, resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
const frontendReviewFiles=new Set([
 'index.html','tests/learner_model.test.mjs','tests/e2e/econverse2_journeys.js',
 'tests/e2e/run_motion_review.mjs','tests/e2e/motion_polish.js','tests/e2e/final_integration.js',
 'tests/e2e/motion_performance.js','tests/e2e/motion_lifecycle.js','tests/e2e/motion_touch.js',
 'MOTION_POLISH_REPORT.md','FINAL_INTEGRATION_REVIEW.md','design-qa.md',
]);
export const isOwned=(source,name)=>source==='backend'
 ? /^(functions\/|migrations\/|scripts\/|public\/|docs\/|tests\/)/.test(name)||['package.json','package-lock.json','vite.config.ts','.gitignore','README.md'].includes(name)
 : source==='frontend'&&(/^src\//.test(name)||frontendReviewFiles.has(name));
export function integrationPath(target,name) {
 const to=resolve(target,name),inside=relative(target,to);
 if(inside.startsWith('..')||isAbsolute(inside)) throw new Error('Path outside integration worktree.');
 return to;
}
export function syncIntegration(siblings=resolve(dirname(fileURLToPath(import.meta.url)),'../..')) {
const target=resolve(siblings,'integration');
const git=(root,args)=>execFileSync('git',['-C',root,...args],{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
if(!existsSync(resolve(target,'.git'))) throw new Error('Create the detached integration worktree first; see docs/LOCAL_REVIEW.md.');
if(git(target,['branch','--show-current'])) throw new Error('Integration must remain detached.');
const statePath=resolve(target,'.local-review/sync-state.json');
const previous=existsSync(statePath)?JSON.parse(readFileSync(statePath,'utf8')):{};
const digest=file=>existsSync(file)?createHash('sha256').update(readFileSync(file)).digest('hex'):null;
const next={};
const sources=[
 {folder:'backend',branch:'feat/econverse2-backend'},
 {folder:'frontend',branch:'feat/econverse2-frontend'},
];
for(const source of sources) {
 const root=resolve(siblings,source.folder);
 if(git(root,['branch','--show-current'])!==source.branch) throw new Error(`Unexpected source branch: ${root}`);
 if(git(root,['rev-parse','HEAD'])!==git(target,['rev-parse','HEAD'])) throw new Error('Source and integration baselines differ; review manually.');
 const files=new Set([...git(root,['diff','--name-only','HEAD']).split('\n'),...git(root,['ls-files','--others','--exclude-standard']).split('\n')].filter(Boolean));
 for(const name of [...files].sort()) {
  if(!isOwned(source.folder,name)) continue;
  const from=resolve(root,name),to=integrationPath(target,name);
  if(!existsSync(from)) throw new Error(`Deleted source requires manual review: ${name}`);
  const incoming=digest(from),current=digest(to);
  if(current&&current!==incoming&&previous[name]&&current!==previous[name]) throw new Error(`Integration file was edited independently; preserve and review it: ${name}`);
  if(current&&current!==incoming&&!previous[name]) {
   let baseline=null;try{baseline=createHash('sha256').update(execFileSync('git',['-C',target,'show',`HEAD:${name}`],{stdio:['ignore','pipe','pipe']})).digest('hex');}catch{}
   // Git CRLF checkout conversion is normalized for the first sync only.
   const normal=buffer=>buffer.toString('utf8').replaceAll('\r\n','\n');
   let initial=false;try{initial=normal(readFileSync(to))===normal(execFileSync('git',['-C',target,'show',`HEAD:${name}`],{stdio:['ignore','pipe','pipe']}));}catch{}
   if(current!==baseline&&!initial) throw new Error(`Untracked integration edits require review before first sync: ${name}`);
  }
  mkdirSync(dirname(to),{recursive:true});if(current!==incoming) copyFileSync(from,to);next[name]=incoming;
 }
}
mkdirSync(dirname(statePath),{recursive:true});writeFileSync(statePath,JSON.stringify({...previous,...next},null,2));
console.log(`Combined ${Object.keys(next).length} owned files into ${target}. Source branches remain uncommitted and untouched.`);
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) syncIntegration();

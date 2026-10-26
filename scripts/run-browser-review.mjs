import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { DatabaseSync } from 'node:sqlite';
const fixture = JSON.parse(readFileSync('.local-review/accounts.json','utf8'));
if (!['127.0.0.1','localhost'].includes(new URL(fixture.base).hostname)) throw new Error('Only isolated localhost review is permitted.');
const cli = process.env.PLAYWRIGHT_CLI || join(process.env.APPDATA || '', 'npm/node_modules/@playwright/cli/playwright-cli.js');
if (!existsSync(cli)) throw new Error('Install @playwright/cli globally or set PLAYWRIGHT_CLI to its playwright-cli.js path.');
const db = new DatabaseSync(':memory:');
db.exec(readFileSync('migrations/0001_initial_schema.sql','utf8'));
db.exec(readFileSync('migrations/0002_seed_data.sql','utf8'));
const questions = db.prepare('SELECT id,correct_option FROM quiz_questions WHERE lesson_id=? ORDER BY question_order').all('lesson-2a');
db.close();
const config={...fixture,answers:questions.map(q=>q.correct_option),suffix:Date.now().toString(36),evidence:resolve('tests/e2e/econverse2-evidence')};
mkdirSync(config.evidence,{recursive:true});
copyFileSync('node_modules/axe-core/axe.min.js','dist/__review-axe.js');
const script=readFileSync('tests/e2e/econverse2_journeys.js','utf8').replace('__REVIEW_CONFIG__',JSON.stringify(config));
writeFileSync('.local-review/browser-journeys.js',script,{mode:0o600});
function run(args) {
 const result=spawnSync(process.execPath,[cli,'-s=econverse-review',...args],{encoding:'utf8',maxBuffer:5*1024*1024});
 if(result.stdout) process.stdout.write(result.stdout);
 if(result.stderr) process.stderr.write(result.stderr);
 if(result.error) throw result.error;
 if(result.status!==0 || /### Error/.test(result.stdout)) throw new Error(`Playwright CLI failed: ${args[0]}`);
 return result.stdout;
}
let failed=false;
try {
 run(['open',fixture.base]);
 run(['snapshot','--filename=tests/e2e/econverse2-evidence/initial.yml']);
 const output=run(['--raw','run-code','--filename=.local-review/browser-journeys.js']);
 mkdirSync('tests/results',{recursive:true});
 writeFileSync('tests/results/browser-review.txt',output);
 if(!/"passed"\s*:\s*true/.test(output)) throw new Error('Browser journey did not return a successful result. See CLI output.');
} catch(error) {failed=true;console.error(error.message);}
finally {try{run(['close']);}catch{}}
process.exitCode=failed?1:0;

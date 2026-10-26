import {copyFileSync,existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve,join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {DatabaseSync} from 'node:sqlite';

// Reuse the project's isolated D1 preview. Never target a shared environment.
const sourceRoot=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const sibling=resolve(sourceRoot,'../integration');
const integration=process.env.INTEGRATION_ROOT ? resolve(process.env.INTEGRATION_ROOT)
  : existsSync(join(sourceRoot,'.local-review/accounts.json')) ? sourceRoot
  : existsSync(join(sibling,'.local-review/accounts.json')) ? sibling : sourceRoot;
const evidence=resolve(sourceRoot,process.env.MOTION_EVIDENCE_DIR || 'tests/e2e/motion-evidence');
if(process.argv.includes('--check-paths')){console.log(JSON.stringify({sourceRoot,integration,evidence}));process.exit(0);}
if(!existsSync(join(integration,'.local-review/accounts.json')))throw new Error('Prepare localhost review accounts first: npm run review:accounts in the integrated checkout.');
const fixture=JSON.parse(readFileSync(join(integration,'.local-review/accounts.json'),'utf8'));
if(new URL(fixture.base).protocol!=='http:'||!['localhost','127.0.0.1'].includes(new URL(fixture.base).hostname))throw new Error('Local HTTP preview required.');
const db=new DatabaseSync(':memory:');
db.exec(readFileSync(join(integration,'migrations/0001_initial_schema.sql'),'utf8'));
db.exec(readFileSync(join(integration,'migrations/0002_seed_data.sql'),'utf8'));
const answers=db.prepare('SELECT correct_option FROM quiz_questions WHERE lesson_id=? ORDER BY question_order').all('lesson-2a').map(q=>q.correct_option);
db.close();
const working=join(sourceRoot,'.motion-review');
mkdirSync(evidence,{recursive:true});mkdirSync(working,{recursive:true});
copyFileSync(join(integration,'node_modules/axe-core/axe.min.js'),join(integration,'dist/__review-axe.js'));
const config={...fixture,answers,evidence,suffix:Date.now().toString(36)};
const record=process.env.MOTION_RECORD_VIDEO!=='0';
const browser=process.env.MOTION_BROWSER || 'chrome';
if(!['chrome','firefox','webkit','msedge'].includes(browser))throw new Error('Unsupported review browser.');
const scenario=process.argv.find(arg=>arg.startsWith('--scenario='))?.slice('--scenario='.length) || 'motion_polish.js';
if(!['motion_polish.js','final_integration.js'].includes(scenario))throw new Error('Unknown review scenario.');
const script=readFileSync(join(sourceRoot,'tests/e2e',scenario),'utf8').replace('__MOTION_CONFIG__',JSON.stringify(config));
const scriptPath=join(working,`journeys-${browser}.js`);
writeFileSync(scriptPath,script);
const cli=process.env.PLAYWRIGHT_CLI || join(process.env.APPDATA,'npm/node_modules/@playwright/cli/playwright-cli.js');
if(!existsSync(cli))throw new Error('Playwright CLI is required.');
function run(args) {
  const result=spawnSync(process.execPath,[cli,`-s=econverse-motion-qa-${browser}`,'--raw',...args],{cwd:sourceRoot,encoding:'utf8',maxBuffer:8*1024*1024});
  if(result.status!==0 || /### Error/.test(result.stdout))throw new Error(result.stderr || result.stdout);
  return result.stdout;
}
try {
  run(['open',fixture.base,'--browser='+browser]);
  run(['snapshot','--filename='+join(evidence,'initial.yml')]);
  if(record)run(['video-start',join(evidence,'motion-interactions.webm')]);
  const output=run(['run-code','--filename='+scriptPath]);
  writeFileSync(join(evidence,scenario==='motion_polish.js'?'motion-results.json':'final-integration-results.json'),output);
  console.log(output);
  if(JSON.parse(output).passed!==true)process.exitCode=1;
} catch(error) {console.error(String(error));process.exitCode=1;}
finally {if(record){try{console.log(run(['video-stop']));}catch{}}try{run(['close']);}catch{}}

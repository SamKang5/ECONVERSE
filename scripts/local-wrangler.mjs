// Reproducible local-only Wrangler commands. Never accepts a remote/deploy operation.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const mode = process.argv[2];
const commands = {
  migrate: ['d1', 'migrations', 'apply', 'econverse-db', '--local', '--persist-to', '.local-review/d1'],
  preview: ['pages', 'dev', 'dist', '--port', '8788', '--ip', '127.0.0.1', '--persist-to', '.local-review/d1'],
};
if (!commands[mode]) throw new Error('Use migrate or preview. Both operate on isolated local storage.');
const localBin = fileURLToPath(new URL('../node_modules/wrangler/bin/wrangler.js', import.meta.url));
const override = process.env.WRANGLER_BIN;
const bin = override || (existsSync(localBin) ? localBin : null);
const options = { stdio: 'inherit', env: { ...process.env, WRANGLER_SEND_METRICS: 'false', WRANGLER_LOG_PATH: fileURLToPath(new URL('../.local-review/wrangler.log', import.meta.url)) } };
const result = bin
  ? spawnSync(process.execPath, [bin, ...commands[mode]], options)
  : spawnSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['--yes', 'wrangler@4.127.1', ...commands[mode]], { ...options, shell: process.platform === 'win32' });
if (result.error) throw result.error;
process.exit(result.status ?? 1);

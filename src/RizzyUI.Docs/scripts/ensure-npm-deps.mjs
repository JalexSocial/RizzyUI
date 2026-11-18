// Runs `npm ci` in each given package folder only when its node_modules is missing or older than its
// package-lock.json, so an ordinary docs build neither reinstalls packages nor touches tracked files.
//
// Usage: node scripts/ensure-npm-deps.mjs <package-dir>...
import { spawnSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const npmCli = process.env.npm_execpath;

for (const dir of process.argv.slice(2).map(arg => resolve(arg))) {
  const lockFile = join(dir, 'package-lock.json');
  const installed = join(dir, 'node_modules', '.package-lock.json');

  const upToDate = existsSync(installed) && statSync(installed).mtimeMs >= statSync(lockFile).mtimeMs;
  if (upToDate) {
    continue;
  }

  console.log(`[ensure-npm-deps] npm ci in ${dir}`);
  // Run npm through node (npm_execpath) rather than a shell, as packages/rizzyui/build/utils.mjs does.
  const result = npmCli
    ? spawnSync(process.execPath, [npmCli, 'ci', '--no-audit', '--no-fund'], { cwd: dir, stdio: 'inherit' })
    : spawnSync('npm', ['ci', '--no-audit', '--no-fund'], { cwd: dir, stdio: 'inherit', shell: process.platform === 'win32' });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

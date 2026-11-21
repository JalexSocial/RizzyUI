// Unit tests for the Alpine code-behind modules (*.razor.js / *.razor.ts), run in Node with
// happy-dom and @jalexsocial/rizzyui/testing.
//
// esbuild bundles every module into .test-build/ first (the same bundling the build does, without
// minification), so TypeScript modules and modules with imports are tested as the browser runs them.
// Tests live in tests/codebehind/*.test.mjs and import from .test-build/.
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { build } from 'esbuild';

const projectRoot = resolve(import.meta.dirname, '..');
const outDir = join(projectRoot, '.test-build');
const skip = new Set(['node_modules', 'bin', 'obj', 'wwwroot', '.test-build', 'tests']);

function findModules(dir) {
  const found = [];
  for (const name of readdirSync(dir)) {
    if (skip.has(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) found.push(...findModules(path));
    else if (name.endsWith('.razor.ts') || name.endsWith('.razor.js')) found.push(path);
  }
  return found;
}

rmSync(outDir, { recursive: true, force: true });
const entryPoints = findModules(projectRoot);
if (entryPoints.length > 0) {
  await build({
    entryPoints: entryPoints.map(path => relative(projectRoot, path)),
    absWorkingDir: projectRoot,
    bundle: true,
    format: 'esm',
    platform: 'browser',
    target: 'es2020',
    outbase: '.',
    outdir: outDir,
    logLevel: 'warning',
  });
}

const testDir = join(projectRoot, 'tests', 'codebehind');
if (!existsSync(testDir)) {
  console.log('No code-behind tests yet.');
  process.exit(0);
}

const result = spawnSync(process.execPath, ['--test', testDir], { cwd: projectRoot, stdio: 'inherit' });
process.exit(result.status ?? 1);

import path from 'node:path';
import { run, logStep } from './utils.mjs';
import { packageRoot, srcJsRoot, distJsRoot } from './paths.mjs';

async function buildAntiforgery() {
    logStep('Minifying antiforgery snippet...');
    await run('npx', [
        'esbuild',
        path.join(srcJsRoot, 'antiforgerySnippet.js'),
        '--minify',
        `--outfile=${path.join(distJsRoot, 'antiforgerySnippet.min.js')}`,
    ], { cwd: packageRoot });
}

await buildAntiforgery();

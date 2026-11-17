import path from 'node:path';
import { build } from 'esbuild';
import { logStep } from './utils.mjs';
import { srcJsRoot, distJsRoot } from './paths.mjs';

async function buildAntiforgery() {
    logStep('Minifying antiforgery snippet...');
    await build({
        entryPoints: [path.join(srcJsRoot, 'antiforgerySnippet.js')],
        minify: true,
        outfile: path.join(distJsRoot, 'antiforgerySnippet.min.js'),
        logLevel: 'info',
    });
}

await buildAntiforgery();

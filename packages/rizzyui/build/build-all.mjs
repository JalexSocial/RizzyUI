import path from 'node:path';
import { logStep, runNode } from './utils.mjs';
import { packageRoot, buildRoot } from './paths.mjs';

async function buildAll() {
    // 1) Remove old generated assets locally and downstream to avoid stale hashed chunks.
    await runNode(path.join(buildRoot, 'clean-generated.mjs'), [], { cwd: packageRoot });

    // 2) Build JS bundles (dev and minified variants).
    await runNode(path.join(buildRoot, 'build-js.mjs'), [], { cwd: packageRoot });

    // 3) Copy static package assets into dist.
    await runNode(path.join(buildRoot, 'build-assets.mjs'), [], { cwd: packageRoot });

    // 4) Build minified antiforgery snippet.
    await runNode(path.join(buildRoot, 'build-antiforgery.mjs'), [], { cwd: packageRoot });

    // 5) Build CSS outputs.
    await runNode(path.join(buildRoot, 'build-css.mjs'), [], { cwd: packageRoot });

    // 6) Generate safelist from built CSS.
    logStep('Generating safelist...');
    await runNode(path.join(buildRoot, 'parse-tailwind-css.js'), [], { cwd: packageRoot });

    // 7-8) Clean downstream generated targets and copy dist output.
    await runNode(path.join(buildRoot, 'copy-dist.mjs'), [], { cwd: packageRoot });
}

await buildAll();

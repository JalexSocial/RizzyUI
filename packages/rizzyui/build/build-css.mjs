import path from 'node:path';
import { runPackageBin, logStep } from './utils.mjs';
import { packageRoot, distCssRoot, tailwindInputPath } from './paths.mjs';

async function buildCss() {
    const cssOutput = path.join(distCssRoot, 'rizzyui.css');
    const cssMinOutput = path.join(distCssRoot, 'rizzyui.min.css');

    logStep('Building Tailwind CSS...');
    await runPackageBin('@tailwindcss/cli', ['-i', tailwindInputPath, '-o', cssOutput], { cwd: packageRoot });

    logStep('Building minified Tailwind CSS...');
    await runPackageBin('@tailwindcss/cli', ['-i', tailwindInputPath, '-o', cssMinOutput, '--minify'], {
        cwd: packageRoot,
    });
}

await buildCss();

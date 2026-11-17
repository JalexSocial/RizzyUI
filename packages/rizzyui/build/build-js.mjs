import { runPackageBin, logStep } from './utils.mjs';
import { packageRoot, viteConfigPath } from './paths.mjs';

async function buildJs() {
    logStep('Building JavaScript bundles (development)...');
    await runPackageBin('vite', ['build', '--mode', 'development', '--config', viteConfigPath], {
        cwd: packageRoot,
        env: { MINIFY: 'false' },
    });

    logStep('Building JavaScript bundles (minified)...');
    await runPackageBin('vite', ['build', '--config', viteConfigPath], {
        cwd: packageRoot,
        env: { MINIFY: 'true' },
    });
}

await buildJs();

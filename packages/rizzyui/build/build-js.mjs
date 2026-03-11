import { run, logStep } from './utils.mjs';
import { packageRoot, viteConfigPath } from './paths.mjs';

async function buildJs() {
    logStep('Building JavaScript bundles (development)...');
    await run('npx', ['vite', 'build', '--mode', 'development', '--config', viteConfigPath], {
        cwd: packageRoot,
        env: { MINIFY: 'false' },
    });

    logStep('Building JavaScript bundles (minified)...');
    await run('npx', ['vite', 'build', '--config', viteConfigPath], {
        cwd: packageRoot,
        env: { MINIFY: 'true' },
    });
}

await buildJs();

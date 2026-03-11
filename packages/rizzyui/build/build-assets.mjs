import path from 'node:path';
import { srcCssRoot, srcJsRoot, distCssRoot, distJsRoot } from './paths.mjs';
import { copyFileOrDir, logStep } from './utils.mjs';

async function buildAssets() {
    logStep('Copying package assets into dist...');
    await copyFileOrDir(path.join(srcJsRoot, 'lib'), path.join(distJsRoot, 'lib'));
    await copyFileOrDir(path.join(srcCssRoot, 'rizzyui-theme.css'), path.join(distCssRoot, 'rizzyui-theme.css'));
    await copyFileOrDir(path.join(srcCssRoot, 'rizzyui-plugin-dist.css'), path.join(distCssRoot, 'rizzyui-plugin.css'));
    await copyFileOrDir(path.join(srcJsRoot, 'antiforgerySnippet.js'), path.join(distJsRoot, 'antiforgerySnippet.js'));
}

await buildAssets();

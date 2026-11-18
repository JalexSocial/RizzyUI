import path from 'node:path';
import { srcCssRoot, srcJsRoot, distCssRoot, distJsRoot } from './paths.mjs';
import { copyFileOrDir, logStep } from './utils.mjs';

function isShippedLibFile(relativePath) {
    return relativePath.endsWith('.css') || relativePath.startsWith('highlightjs-plugin/');
}

async function buildAssets() {
    logStep('Copying package assets into dist...');
    // Component sources are bundled into chunks; only files loaded by URL ship from lib/: the
    // stylesheets rizzyui-theme.css imports and the highlight.js Razor grammar (RZUI-056).
    await copyFileOrDir(path.join(srcJsRoot, 'lib'), path.join(distJsRoot, 'lib'), isShippedLibFile);
    await copyFileOrDir(path.join(srcCssRoot, 'rizzyui-theme.css'), path.join(distCssRoot, 'rizzyui-theme.css'));
    await copyFileOrDir(path.join(srcCssRoot, 'rizzyui-plugin-dist.css'), path.join(distCssRoot, 'rizzyui-plugin.css'));
    await copyFileOrDir(path.join(srcJsRoot, 'antiforgerySnippet.js'), path.join(distJsRoot, 'antiforgerySnippet.js'));
}

await buildAssets();

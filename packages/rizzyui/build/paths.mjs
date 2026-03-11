import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const packageRoot = path.resolve(__dirname, '..');
export const buildRoot = path.resolve(packageRoot, 'build');
export const srcRoot = path.resolve(packageRoot, 'src');
export const distRoot = path.resolve(packageRoot, 'dist');
export const distJsRoot = path.resolve(distRoot, 'js');
export const distCssRoot = path.resolve(distRoot, 'css');

export const srcJsRoot = path.resolve(srcRoot, 'js');
export const srcCssRoot = path.resolve(srcRoot, 'css');

export const downstreamWwwrootRoot = path.resolve(packageRoot, '../../src/RizzyUI/wwwroot');
export const downstreamJsRoot = path.resolve(downstreamWwwrootRoot, 'js');
export const downstreamCssRoot = path.resolve(downstreamWwwrootRoot, 'css');

export const generatedJsEntryFiles = [
    'rizzyui.js',
    'rizzyui.min.js',
    'rizzyui.es.js',
    'rizzyui.min.es.js',
    'rizzyui.js.map',
    'rizzyui.es.js.map',
    'rizzyui-csp.js',
    'rizzyui-csp.min.js',
    'rizzyui-csp.es.js',
    'rizzyui-csp.min.es.js',
    'rizzyui-csp.js.map',
    'rizzyui-csp.es.js.map',
    'antiforgerySnippet.js',
    'antiforgerySnippet.min.js',
    'safelist.js',
];

export const generatedCssFiles = [
    'rizzyui.css',
    'rizzyui.min.css',
    'rizzyui-plugin.css',
    'rizzyui-theme.css',
];

export const generatedTopLevelFiles = ['stats.html'];

export const generatedJsFolders = ['chunks', 'assets', 'lib'];

export const viteConfigPath = path.resolve(packageRoot, 'vite.config.js');
export const tailwindInputPath = path.resolve(srcCssRoot, 'rizzyui-plugin.css');

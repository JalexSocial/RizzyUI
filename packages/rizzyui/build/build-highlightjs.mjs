// Builds the highlight.js bundle RizzyUI serves at _content/RizzyUI/vendor/highlightjs/highlight.min.js
// (asset key HighlightJsCore): the highlight.js core with its "common" languages plus a few that
// .NET and web projects use often. Other languages ship as separate files in
// vendor/highlightjs/languages/*.min.js and can be added with an asset key (see the README there).
//
// This is not part of `npm run build`: the vendored file changes only when highlight.js is
// upgraded or the language set changes. Run `npm run build:highlightjs` and commit the result.
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
import { downstreamWwwrootRoot, packageRoot } from './paths.mjs';
import { logStep } from './utils.mjs';

// In addition to highlight.js/lib/common (bash, c, cpp, csharp, css, diff, go, graphql, ini, java,
// javascript, json, kotlin, less, lua, makefile, markdown, objectivec, perl, php, php-template,
// plaintext, python, python-repl, r, ruby, rust, scss, shell, sql, swift, typescript, vbnet, wasm,
// xml, yaml).
export const extraLanguages = ['powershell', 'dockerfile', 'fsharp', 'http', 'nginx', 'properties'];

const require = createRequire(import.meta.url);
const version = require('highlight.js/package.json').version;
const outputDir = path.join(downstreamWwwrootRoot, 'vendor', 'highlightjs');

const entry = [
    "import hljs from 'highlight.js/lib/common';",
    ...extraLanguages.map((name, i) => `import lang${i} from 'highlight.js/lib/languages/${name}';`),
    ...extraLanguages.map((name, i) => `hljs.registerLanguage('${name}', lang${i});`),
    'globalThis.hljs = hljs;',
].join('\n');

logStep(`Building highlight.js ${version} (common + ${extraLanguages.join(', ')})...`);
await build({
    stdin: { contents: entry, resolveDir: packageRoot, loader: 'js' },
    bundle: true,
    minify: true,
    format: 'iife',
    target: 'es2020',
    legalComments: 'none',
    banner: {
        js: `/*! Highlight.js v${version} | BSD-3-Clause | (c) 2006-2024 Josh Goebel and other contributors | RizzyUI build: common + ${extraLanguages.join(', ')} */`,
    },
    outfile: path.join(outputDir, 'highlight.min.js'),
    logLevel: 'warning',
});

const stats = await fs.stat(path.join(outputDir, 'highlight.min.js'));
logStep(`Wrote vendor/highlightjs/highlight.min.js (${(stats.size / 1024).toFixed(1)} KB).`);

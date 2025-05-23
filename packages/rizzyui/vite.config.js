import { defineConfig } from 'vite';
import path from 'node:path';
import copy from 'rollup-plugin-copy';

const ROOT           = __dirname;
const SRC_DIR        = path.resolve(ROOT, 'src/js');
const DIST_DIR       = path.resolve(ROOT, 'dist/js');
const TARGET_WWWROOT = path.resolve(ROOT, '../../src/RizzyUI/wwwroot/');

const entryName   = process.env.ENTRY || 'rizzyui';          // 'rizzyui' | 'rizzyui-csp'
const isMinified  = process.env.MINIFY === 'true';

export default defineConfig({
    build: {
        emptyOutDir: !isMinified && entryName === 'rizzyui',                    // clean only on the first pass
        outDir: DIST_DIR,
        sourcemap: !isMinified,
        minify:   isMinified ? 'esbuild' : false,
        target:   'es2020',

        lib: {
            entry: path.resolve(SRC_DIR, `${entryName}.js`),
            name:  entryName === 'rizzyui' ? 'RizzyUI' : 'RizzyUICsp',
            fileName: fmt => `${entryName}${isMinified ? '.min' : ''}.${fmt}.js`,
            formats: ['es', 'umd']                               // legal now that we have ONE entry
        },

        rollupOptions: {
            external: ['alpinejs', 'htmx.org'],
            output: {
                globals: { alpinejs: 'Alpine', 'htmx.org': 'htmx' }
            },
            plugins: [
                copy({
                    targets: [{ src: `${DIST_DIR}/*`, dest: TARGET_WWWROOT }],
                    hook: 'writeBundle',
                    overwrite: true
                })
            ]
        }
    }
});

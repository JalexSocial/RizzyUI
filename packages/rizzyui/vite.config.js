import { defineConfig } from 'vite';
import path from 'node:path';

const ROOT = __dirname;
const SRC_DIR = path.resolve(ROOT, 'src/js');
const DIST_DIR = path.resolve(ROOT, 'dist/js');
const isMinified = process.env.MINIFY === 'true';

export default defineConfig({
    base: './',
    build: {
        emptyOutDir: !isMinified,
        outDir: DIST_DIR,
        sourcemap: !isMinified,
        minify: isMinified ? 'esbuild' : false,
        target: 'es2020',
        rollupOptions: {
            input: {
                rizzyui: path.resolve(SRC_DIR, 'rizzyui.js'),
                'rizzyui-csp': path.resolve(SRC_DIR, 'rizzyui-csp.js'),
            },
            external: ['htmx.org'],
            output: {
                globals: { 'htmx.org': 'htmx' },
                entryFileNames: `[name]${isMinified ? '.min' : ''}.js`,
                chunkFileNames: `chunks/[name]-[hash]${isMinified ? '.min' : ''}.js`,
                assetFileNames: `assets/[name]-[hash][extname]`,
            },
        },
    },
});

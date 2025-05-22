// packages/rizzyui/vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

const entries = {
    rizzyui: resolve(__dirname, 'src/js/rizzyui.js'),
    'rizzyui-csp': resolve(__dirname, 'src/js/rizzyui-csp.js'),
    antiforgerySnippet: resolve(__dirname, 'src/js/antiforgerySnippet.js'),
};

export default defineConfig({
    build: {
        outDir: resolve(__dirname, 'dist/js'),
        emptyOutDir: true,
        sourcemap: true,
        target: 'esnext',
        // No lib option here, we use rollupOptions directly for more control
        rollupOptions: {
            input: entries,
            external: ['htmx.org'],
            output: [
                // ES Module Output
                {
                    format: 'es',
                    dir: resolve(__dirname, 'dist/js'),
                    entryFileNames: '[name].es.js',
                    // When preserveModules is true, inlineDynamicImports is implicitly false
                    // but being explicit can sometimes help.
                    inlineDynamicImports: false,
                    preserveModules: true,
                    preserveModulesRoot: 'src/js',
                    // Let's try 'strict' to be very explicit, or remove it to see if Rollup's default 'exports-only' works better via Vite
                    preserveEntrySignatures: 'strict', // Changed from 'exports-only' to 'strict' for testing
                },
                // UMD Output
                {
                    format: 'umd',
                    dir: resolve(__dirname, 'dist/js'),
                    entryFileNames: (chunkInfo) => {
                        if (chunkInfo.name === 'antiforgerySnippet') {
                            return '[name].min.js';
                        }
                        return '[name].umd.js';
                    },
                    name: (chunkInfo) => {
                        if (chunkInfo.name === 'rizzyui') return 'RizzyUI';
                        if (chunkInfo.name === 'rizzyui-csp') return 'RizzyUICSP';
                        return undefined;
                    },
                    globals: {
                        'htmx.org': 'htmx',
                    },
                    // inlineDynamicImports: false, // Generally not needed for UMD single files per entry
                },
            ],
        },
    },
    plugins: [
        visualizer({
            filename: resolve(__dirname, 'dist/stats.html'),
            open: false,
            gzipSize: true,
            brotliSize: true,
        }),
    ],
});
/**
 * Bundle loader registry shared by both shell entrypoints.
 *
 * Keep both `rizzyui.js` and `rizzyui-csp.js` in one multi-entry build graph so
 * these async chunks are emitted once and reused by both shells.
 */
export const bundleLoaderRegistry = Object.freeze({
    'core-common': () => import('../bundles/core-common.js'),
    'command-runtime': () => import('../bundles/command-runtime.js'),
    'advanced-input-runtime': () => import('../bundles/advanced-input-runtime.js'),
    'calendar-runtime': () => import('../bundles/calendar-runtime.js'),
    'table-runtime': () => import('../bundles/table-runtime.js'),
    'color-runtime': () => import('../bundles/color-runtime.js'),
    'content-visual-runtime': () => import('../bundles/content-visual-runtime.js'),
    'dialogs-panels-runtime': () => import('../bundles/dialogs-panels-runtime.js'),
    'menu-runtime': () => import('../bundles/menu-runtime.js'),
    'popover-tooltip-runtime': () => import('../bundles/popover-tooltip-runtime.js'),
    'docs-runtime': () => import('../bundles/docs-runtime.js'),
    'effects-runtime': () => import('../bundles/effects-runtime.js'),
});

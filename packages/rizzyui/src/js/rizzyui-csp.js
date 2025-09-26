
/**
 * @file RizzyUI CSP-Compliant Entry Point
 * @module rizzyui-csp
 * @description This is the main entry point for the CSP-compliant build of RizzyUI's client-side library.
 * It initializes Alpine.js in CSP mode, integrates the AsyncAlpine v2 plugin for dynamic component loading,
 * and registers all core RizzyUI components and directives.
 */

import Alpine from '@alpinejs/csp';
import AsyncAlpine from 'async-alpine';
import collapse from '@alpinejs/collapse';
import intersect from '@alpinejs/intersect';
import focus from '@alpinejs/focus';
import toast from "./lib/notify/toast";
import { registerComponents, require } from './lib/components.js';
import $data from './lib/alpineData.js';
import props from './lib/alpineProps.js';
import registerMobileDirective from './lib/directives/mobile.js';
import registerSyncDirective from './lib/directives/sync-prop.js'

// Register standard Alpine.js plugins
Alpine.plugin(collapse);
Alpine.plugin(intersect);
Alpine.plugin(focus);

// Register AsyncAlpine as a native Alpine plugin (v2 syntax)
Alpine.plugin(AsyncAlpine);

// Register all synchronous RizzyUI components and custom directives
registerComponents(Alpine);
registerMobileDirective(Alpine);
registerSyncDirective(Alpine);

/**
 * @global
 * @namespace Rizzy
 * @description The global namespace for RizzyUI utilities, exposed on the `window` object.
 */
const RizzyUI = {
    Alpine,
    require,
    toast,
    $data,
    props
};

// Expose Alpine and RizzyUI utilities globally for debugging and advanced integration.
window.Alpine = Alpine;
window.Rizzy = { ...(window.Rizzy || {}), ...RizzyUI };

// Start the main Alpine.js initialization process.
// Alpine will now automatically handle the async components registered via `Alpine.asyncData`.
Alpine.start();

export default RizzyUI;
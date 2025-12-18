
import collapse from '@alpinejs/collapse';
import intersect from '@alpinejs/intersect';
import focus from '@alpinejs/focus';
import AsyncAlpine from 'async-alpine';

import toast from "./notify/toast";
import { registerComponents, require } from './components.js';
import $data from './alpineData.js';
import props from './alpineProps.js';
import registerAsyncComponent from './alpineModuleRegistrar.js';
import registerMobileDirective from './directives/mobile.js';
import registerSyncDirective from './directives/sync-prop.js'
import { themeController } from './theme.js';
import { registerStores } from './stores.js';

// Cache the constructed global object to prevent double-booting/re-initialization
let cachedRizzyUI = null;

/**
 * Shared bootstrapping logic for RizzyUI.
 * Registers all plugins, stores, components, and directives.
 *
 * @param {object} Alpine - The Alpine.js instance (Standard or CSP).
 * @returns {object} The configured RizzyUI global object.
 */
export function bootstrapRizzyUI(Alpine) {
    // Return existing global if already bootstrapped to prevent duplicate listeners
    if (cachedRizzyUI) return cachedRizzyUI;

    // 1. Register Plugins
    Alpine.plugin(collapse);
    Alpine.plugin(intersect);
    Alpine.plugin(focus);
    Alpine.plugin(AsyncAlpine); // v2 syntax

    // 2. Register Global Stores
    // Guard registration to ensure we are in a browser environment
    if (typeof document !== 'undefined') {
        // We register inside alpine:init to ensure Alpine is ready
        document.addEventListener('alpine:init', () => {
            registerStores(Alpine);
        });
    }

    // 3. Register Components & Directives
    registerComponents(Alpine);
    registerMobileDirective(Alpine);
    registerSyncDirective(Alpine);

    // 4. Construct the Global Object
    cachedRizzyUI = {
        Alpine,
        require,
        toast,
        $data,
        props,
        registerAsyncComponent,
        theme: themeController
    };

    // 5. Initialize Theme & Expose Globals (Browser Guarded)
    if (typeof window !== 'undefined') {
        // We call init() here to ensure listeners (like matchMedia) are active immediately,
        // even before Alpine starts. init() is idempotent.
        themeController.init();
        
        window.Alpine = Alpine;
        window.Rizzy = { ...(window.Rizzy || {}), ...cachedRizzyUI };

        // 7. Dispatch Init Event
        document.dispatchEvent(new CustomEvent("rz:init", {
            detail: { Rizzy: window.Rizzy }
        }));
    }

    return cachedRizzyUI;
}
import collapse from '@alpinejs/collapse';
import focus from '@alpinejs/focus';
import AsyncAlpine from 'async-alpine';
import intersect from '@alpinejs/intersect';
import toast from './notify/toast.js';
import $data from './alpineData.js';
import props, { registerPropsMagic } from './alpineProps.js';
import registerMobileDirective from './directives/mobile.js';
import registerSyncDirective from './directives/sync-prop.js';
import registerIndeterminateDirective from './directives/indeterminate.js';
import registerValidateDirective, { initializeValidation } from './directives/validate.js';
import { createFlexRenderPlugin } from './directives/flexrender.js';
import { themeController } from './theme.js';
import { registerStores } from './stores.js';
import {
    registerAsyncBundleComponents,
    loadComponentDefinition
} from '../runtime/asyncBundleRegistrar.js';
import { require } from '../runtime/rizzyRequire.js';
import { registerAsyncComponent } from '../runtime/asyncComponentRegistrar.js';
import { installCodeBehindLoader } from '../runtime/codeBehindLoader.js';
import { mergeIntoRizzyGlobal } from '../runtime/rizzyGlobal.js';
import { installHtmxTeleportBridge } from '../runtime/htmxTeleportBridge.js';
import { installAlpineOrphanCleanup } from '../runtime/alpineOrphanCleanup.js';

let cachedRizzyUI;

export function bootstrapRizzyUI(Alpine) {
    if (cachedRizzyUI) {
        return cachedRizzyUI;
    }

    Alpine.plugin(collapse);
    Alpine.plugin(intersect);
    Alpine.plugin(focus);
    Alpine.plugin(AsyncAlpine);
    // Code-behind modules (x-load-src) load through RizzyUI's loader: fallback URL, clear errors.
    installCodeBehindLoader(Alpine);
    Alpine.plugin(createFlexRenderPlugin());

    if (typeof document !== 'undefined') {
        document.addEventListener('alpine:init', () => {
            registerStores(Alpine);
        }, { once: true });
    }

    registerAsyncBundleComponents(Alpine);
    registerMobileDirective(Alpine);
    registerSyncDirective(Alpine);
    registerIndeterminateDirective(Alpine);
    registerPropsMagic(Alpine);

    let validationInstance;
    registerValidateDirective(Alpine, validation => {
        validationInstance = validation;
    });

    let resolveReady;
    const ready = new Promise(resolve => {
        resolveReady = resolve;
    });

    cachedRizzyUI = {
        Alpine,
        require,
        toast,
        $data,
        props,
        ready,
        theme: themeController,
        loadComponent: componentName => loadComponentDefinition(Alpine, componentName),
        registerAsyncComponent,
        ensureValidation: async () => {
            validationInstance = await initializeValidation();
            return validationInstance;
        },
        get validation() {
            return validationInstance;
        },
    };

    if (typeof window !== 'undefined') {
        themeController.init();

        // RizzyUI bundles and starts Alpine. A second copy (for example from a CDN script tag)
        // would initialize the same DOM twice (RZUI-058).
        if (window.Alpine && window.Alpine !== Alpine) {
            console.warn('[RizzyUI] Another Alpine.js instance is already on the page. RizzyUI includes and starts Alpine; remove the separate Alpine script so components are not initialized twice.');
        }
        window.Alpine = Alpine;
        window.Rizzy = mergeIntoRizzyGlobal(window.Rizzy, cachedRizzyUI);
        installHtmxTeleportBridge(window);
        installAlpineOrphanCleanup(window, Alpine);

        document.dispatchEvent(new CustomEvent('rz:init', {
            detail: { Rizzy: window.Rizzy },
        }));
    }

    resolveReady(cachedRizzyUI);

    return cachedRizzyUI;
}

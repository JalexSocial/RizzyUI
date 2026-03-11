import collapse from '@alpinejs/collapse';
import focus from '@alpinejs/focus';
import AsyncAlpine from 'async-alpine';
import intersect from '@alpinejs/intersect';
import toast from './notify/toast.js';
import $data from './alpineData.js';
import props from './alpineProps.js';
import registerMobileDirective from './directives/mobile.js';
import registerSyncDirective from './directives/sync-prop.js';
import registerValidateDirective, { initializeValidation } from './directives/validate.js';
import { themeController } from './theme.js';
import { registerStores } from './stores.js';
import {
    registerAsyncBundleComponents,
    loadComponentDefinition
} from '../runtime/asyncBundleRegistrar.js';
import { require } from '../runtime/rizzyRequire.js';
import { registerAsyncComponent } from '../runtime/asyncComponentRegistrar.js';

let cachedRizzyUI;

export function bootstrapRizzyUI(Alpine) {
    if (cachedRizzyUI) {
        return cachedRizzyUI;
    }

    Alpine.plugin(collapse);
    Alpine.plugin(intersect);
    Alpine.plugin(focus);
    Alpine.plugin(AsyncAlpine);

    if (typeof document !== 'undefined') {
        document.addEventListener('alpine:init', () => {
            registerStores(Alpine);
        }, { once: true });
    }

    registerAsyncBundleComponents(Alpine);
    registerMobileDirective(Alpine);
    registerSyncDirective(Alpine);

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

        window.Alpine = Alpine;
        window.Rizzy = { ...(window.Rizzy || {}), ...cachedRizzyUI };

        document.dispatchEvent(new CustomEvent('rz:init', {
            detail: { Rizzy: window.Rizzy },
        }));
    }

    resolveReady(cachedRizzyUI);

    return cachedRizzyUI;
}

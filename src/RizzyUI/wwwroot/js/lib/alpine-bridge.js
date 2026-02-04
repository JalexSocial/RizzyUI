/**
 * @file RizzyUI Alpine.js Bridge
 * @module alpine-bridge
 * @description This file provides the core integration layer between RizzyUI's server-rendered
 * components and client-side interactivity powered by Alpine.js. It handles the dynamic,
 * on-demand loading and registration of co-located JavaScript modules as Alpine components,
 * ensuring CSP compliance and efficient asset loading.
 */

window.RizzyUI = window.RizzyUI || {};
window.RizzyUI.registeredModules = window.RizzyUI.registeredModules || new Set();

/**
 * Registers custom RizzyUI directives with Alpine.js.
 * @param {import('alpinejs').Alpine} Alpine The global Alpine instance.
 */
function registerRizzyDirectives(Alpine) {
    /**
     * @directive x-rz-init
     * @description An Alpine.js directive that passes initial data from a server-rendered
     * Blazor component to its co-located Alpine.js module. It calls the `__initData`
     * method on the Alpine component instance with the parsed JSON payload.
     */
    Alpine.directive('rz-init', (el) => {
        queueMicrotask(() => {
            if (el.__rzInitRan) return;

            const comp = el.__rzComponent;
            if (!comp || typeof comp.__initData !== 'function') {
                // This might happen if the module is still loading; the component's init
                // will handle this case by checking for the attribute itself.
                return;
            }

            let data = {};
            try {
                data = JSON.parse(el.getAttribute('x-rz-init') || '{}');
            } catch (e) {
                console.warn('[RizzyUI] x-rz-init: JSON parse failed. Initializing with empty data.', { error: e, element: el });
            }

            comp.__initData(data);
            el.__rzInitRan = true;
        });
    });
}

/**
 * Asynchronously loads a JavaScript module and then synchronously registers it
 * as an Alpine.js component. This ensures that all component properties and methods
 * are defined before Alpine attempts to evaluate any `x-` attributes.
 *
 * @param {string} name The name for the Alpine component (used in `x-data`).
 * @param {string} path The root-relative URL path to the JavaScript module.
 */
window.RizzyUI.registerModuleOnce = async (name, path) => {
    if (window.RizzyUI.registeredModules.has(name)) return;
    window.RizzyUI.registeredModules.add(name);

    try {
        // 1. PRE-EMPTIVE LOADING: Load the module first.
        const module = await import(path);
        const userFactory = module && module.default;

        if (typeof userFactory !== 'function') {
            console.error(`[RizzyUI] Module at '${path}' for component '${name}' did not export a default function.`);
            return;
        }

        // 2. SYNCHRONOUS REGISTRATION:
        // After the module is loaded, register the component with Alpine.
        // The factory function passed to Alpine.data runs synchronously for each
        // component instance.
        Alpine.data(name, () => {
            // Create the initial component object from the user's factory.
            // We pass an empty object because the real data from x-rz-init is not yet available.
            const component = userFactory({});

            /**
             * @private
             * A function to hydrate the component with server-provided data.
             * This will be called by the x-rz-init directive.
             * @param {object} payload The data from the server.
             */
            component.__initData = function(payload) {
                // Re-run the user's factory with the actual payload.
                const hydratedComponent = userFactory(payload ?? {});

                // Merge the hydrated properties into the live component instance.
                // This updates the state without replacing the object Alpine is tracking.
                for (const key in hydratedComponent) {
                    if (Object.prototype.hasOwnProperty.call(hydratedComponent, key)) {
                        this[key] = hydratedComponent[key];
                    }
                }

                // Call the user's `init` function, if it exists.
                if (typeof this.init === 'function') {
                    queueMicrotask(() => this.init.call(this));
                }
            };

            // Associate the component instance with the DOM element for the directive.
            queueMicrotask(() => {
                if (component.$el) {
                    component.$el.__rzComponent = component;
                }
            });

            return component;
        });

    } catch (e) {
        console.error(`[RizzyUI] Failed to load or register module '${name}' from '${path}'.`, e);
    }
};

export { registerRizzyDirectives };
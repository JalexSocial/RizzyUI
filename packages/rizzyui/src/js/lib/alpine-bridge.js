/**
 * @file RizzyUI Alpine.js Bridge
 * @module alpine-bridge
 * @description This file provides the core integration layer between RizzyUI's server-rendered
 * components and client-side interactivity powered by Alpine.js. It handles the dynamic,
 * on-demand loading and registration of co-located JavaScript modules as Alpine components,
 * ensuring CSP compliance and efficient asset loading.
 */

// Ensure the global RizzyUI namespace and module registry exist.
// This prevents re-initialization and allows multiple bundles to coexist.
window.RizzyUI = window.RizzyUI || {};
window.RizzyUI.registeredModules = window.RizzyUI.registeredModules || new Set();

/**
 * Registers custom RizzyUI directives with Alpine.js.
 * This function is intended to be called once during Alpine's initialization.
 * @param {import('alpinejs').Alpine} Alpine The global Alpine instance.
 */
function registerRizzyDirectives(Alpine) {
    /**
     * @directive x-rz-init
     * @description An Alpine.js directive that facilitates passing initial data from a
     * server-rendered Blazor component to its co-located Alpine.js module.
     * The directive's value is a JSON string. It locates the Alpine component instance
     * on its element and calls the `__initData` method with the parsed JSON payload.
     * This process is deferred with `queueMicrotask` to ensure the Alpine component
     * has fully initialized.
     */
    Alpine.directive('rz-init', (el) => {
        queueMicrotask(() => {
            // Prevent multiple executions on the same element.
            if (el.__rzInitRan) return;

            // The Alpine component instance is expected to be stored on the element.
            const comp = el.__rzComponent;
            if (!comp || typeof comp.__initData !== 'function') {
                // This can happen if the module fails to load or if the directive is misplaced.
                // A warning is logged by the module loader in case of failure.
                return;
            }

            let data = {};
            try {
                // Safely parse the JSON payload from the attribute.
                data = JSON.parse(el.getAttribute('x-rz-init') || '{}');
            }
            catch (e) {
                console.warn('[RizzyUI] x-rz-init: JSON parse failed. Initializing with empty data.', { error: e, element: el });
            }

            // Pass the data to the Alpine component's hydration function.
            comp.__initData(data);
            el.__rzInitRan = true;
        });
    });
}

/**
 * Registers a co-located JavaScript module as an Alpine.js component, but only once.
 * This function implements a "synchronous registration, asynchronous hydration" pattern
 * to prevent race conditions with Alpine's initialization process.
 *
 * @param {string} name The name for the Alpine component (used in `x-data`).
 * @param {string} path The root-relative URL path to the JavaScript module.
 */
window.RizzyUI.registerModuleOnce = (name, path) => {
    // Prevent re-registration of the same module.
    if (window.RizzyUI.registeredModules.has(name)) return;
    window.RizzyUI.registeredModules.add(name);

    // 1. SYNCHRONOUS REGISTRATION:
    // Register a lightweight "shim" component immediately. This ensures that when Alpine
    // scans the DOM, it finds a registered component for `x-data="name"` and does not
    // throw an error. The actual module loading is deferred until this component is
    // initialized by Alpine on an element.
    Alpine.data(name, () => ({
        /** @private Indicates this is a temporary shim object. */
        __isShim: true,
        /** @private Prevents re-running initialization logic. */
        __rzInitRan: false,

        /**
         * The `init` method of the shim, called by Alpine when it encounters
         * an element with `x-data` matching this component's `name`.
         * @this {import('alpinejs').AlpineComponent}
         */
        async init() {
            const self = this; // `this` is the Alpine component instance (the shim).
            self.$el.__rzComponent = self; // Associate instance with the DOM element for the directive.

            try {
                // 2. ASYNCHRONOUS HYDRATION (Part 1 - Loading):
                // Dynamically import the actual component module. The `import()` function
                // natively handles root-relative paths.
                const module = await import(path);
                const userFactory = module && module.default;

                if (typeof userFactory !== 'function') {
                    console.error(`[RizzyUI] Module at '${path}' for component '${name}' did not export a default function.`);
                    return;
                }

                /**
                 * @private
                 * Defines the hydration function on the shim instance. This function will be called
                 * either by the `x-rz-init` directive or by the logic below if the directive is absent.
                 * It creates the real component logic and merges it into the shim.
                 * @param {object} payload The data payload from the `x-rz-init` directive.
                 */
                self.__initData = (payload) => {
                    if (self.__rzInitRan) return;

                    // Create the real component object using the factory from the imported module.
                    const userObj = userFactory(payload ?? {});

                    // 3. HYDRATION:
                    // Merge the real component's properties and methods onto this shim instance,
                    // effectively replacing the shim with the fully-featured component.
                    Object.assign(self, userObj);
                    delete self.__isShim; // The component is no longer a shim.

                    // If the user's component has its own `init` function, call it.
                    // This is deferred to ensure the DOM is fully patched and ready.
                    if (typeof userObj.init === 'function') {
                        queueMicrotask(() => userObj.init.call(self));
                    }

                    self.__rzInitRan = true;
                };

                // 4. TRIGGER HYDRATION:
                // Check if the `x-rz-init` directive is present. We use a microtask to ensure
                // this check runs after Alpine has had a chance to initialize its directives.
                queueMicrotask(() => {
                    if (!self.$el.hasAttribute('x-rz-init')) {
                        // If the directive is NOT present, we must manually trigger hydration
                        // with an empty payload to complete the component's setup.
                        self.__initData({});
                    }
                    // If the directive IS present, we do nothing here; the directive itself
                    // is responsible for calling `__initData`.
                });

            } catch (e) {
                console.error(`[RizzyUI] Failed to load or initialize module '${name}' from '${path}'.`, e);
            }
        }
    }));
};

export { registerRizzyDirectives };
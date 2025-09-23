/**
 * @file RizzyUI Alpine.js Bridge
 * @module alpine-bridge
 * @description This file provides the core integration layer between RizzyUI's server-rendered
 * components and client-side interactivity powered by Alpine.js. It handles the dynamic,
 * on-demand loading and registration of co-located JavaScript modules as Alpine components,
 * ensuring CSP compliance and efficient asset loading.
 */

// Ensure the global RizzyUI namespace and module registry exist.
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
        // The directive's logic is deferred to a microtask to ensure the Alpine
        // component's `init()` has had a chance to run first.
        queueMicrotask(() => {
            if (el.__rzInitRan) return;

            const comp = el.__rzComponent;
            if (!comp || typeof comp.__initData !== 'function') {
                // This is an expected condition if the module is still loading.
                // The component's init() will handle retrieving the data later.
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
 * Registers a co-located JavaScript module as an Alpine.js component, but only once.
 * This function implements a "synchronous registration, asynchronous hydration" pattern
 * to prevent race conditions with Alpine's initialization process.
 *
 * @param {string} name The name for the Alpine component (used in `x-data`).
 * @param {string} path The root-relative URL path to the JavaScript module.
 */
window.RizzyUI.registerModuleOnce = (name, path) => {
    if (window.RizzyUI.registeredModules.has(name)) return;
    window.RizzyUI.registeredModules.add(name);

    // 1. SYNCHRONOUS REGISTRATION:
    // Register a lightweight "shim" component immediately. This ensures Alpine
    // recognizes the component name during its initial scan.
    Alpine.data(name, () => ({
        /** @private A promise that resolves with the payload from x-rz-init. */
        _initDataPromise: null,
        /** @private A function to resolve the init data promise. */
        _resolveInitData: null,

        /**
         * @private
         * A placeholder `__initData` function is defined synchronously on the shim.
         * The `x-rz-init` directive can call this at any time. It captures the payload
         * and resolves the promise that the main `init()` method is awaiting.
         * @param {object} payload The data from the server.
         */
        __initData(payload) {
            // If the promise resolver is available, resolve it.
            // Otherwise, store the payload to be used when the promise is created.
            if (this._resolveInitData) {
                this._resolveInitData(payload);
            } else {
                // The directive ran before init(), so we create a pre-resolved promise.
                this._initDataPromise = Promise.resolve(payload);
            }
        },

        /**
         * The `init` method of the shim, called by Alpine when it encounters
         * an element with `x-data` matching this component's `name`.
         * @this {import('alpinejs').AlpineComponent}
         */
        async init() {
            const self = this;
            self.$el.__rzComponent = self;

            try {
                let payload;

                // 2. WAIT FOR DATA:
                // Check if the directive has already run and provided the data.
                if (self._initDataPromise) {
                    // The directive ran first, the promise is already created (and likely resolved).
                    payload = await self._initDataPromise;
                } else {
                    // The directive has not run yet. Create a pending promise and store its resolver.
                    // The `__initData` function will use this resolver when the directive executes.
                    self._initDataPromise = new Promise(resolve => {
                        self._resolveInitData = resolve;
                    });

                    // If x-rz-init is not on the element at all, we must resolve the promise
                    // ourselves to prevent an infinite wait.
                    queueMicrotask(() => {
                        if (!self.$el.hasAttribute('x-rz-init')) {
                            self._resolveInitData({});
                        }
                    });

                    payload = await self._initDataPromise;
                }

                // 3. ASYNCHRONOUS HYDRATION:
                // Now that we have the payload, we can load the module.
                const module = await import(path);
                const userFactory = module && module.default;

                if (typeof userFactory !== 'function') {
                    console.error(`[RizzyUI] Module at '${path}' for component '${name}' did not export a default function.`);
                    return;
                }

                // Create the real component object using the factory and the resolved payload.
                const userObj = userFactory(payload ?? {});

                // 4. HYDRATE:
                // Merge the real component's properties and methods onto this shim instance.
                Object.assign(self, userObj);

                // The original __initData and promise helpers are no longer needed.
                delete self._initDataPromise;
                delete self._resolveInitData;

                // If the user's component has its own `init` function, call it.
                if (typeof userObj.init === 'function') {
                    // The main `init` has already completed, so we don't need to queue this.
                    // It can be called directly, but queueMicrotask is safer for DOM readiness.
                    queueMicrotask(() => userObj.init.call(self));
                }

            } catch (e) {
                console.error(`[RizzyUI] Failed to load or initialize module '${name}' from '${path}'.`, e);
            }
        }
    }));
};

export { registerRizzyDirectives };
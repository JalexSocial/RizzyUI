window.RizzyUI = window.RizzyUI || {};
window.RizzyUI.registeredModules = window.RizzyUI.registeredModules || new Set();

function registerRizzyDirectives(Alpine) {
    Alpine.directive('rz-init', (el) => {
        queueMicrotask(() => {
            if (el.__rzInitRan) return;
            const comp = el.__rzComponent;
            if (!comp || typeof comp.__initData !== 'function') return;

            let data = {};
            try { data = JSON.parse(el.getAttribute('x-rz-init') || '{}'); }
            catch (e) { console.warn('[RizzyUI] x-rz-init JSON parse failed.', e, el); }

            comp.__initData(data);
            el.__rzInitRan = true;
        });
    });
}

window.RizzyUI.registerModuleOnce = (name, path) => {
    if (window.RizzyUI.registeredModules.has(name)) return;
    window.RizzyUI.registeredModules.add(name);

    // Register a lightweight "shim" component synchronously.
    // This ensures Alpine recognizes the component name immediately during its initial scan.
    Alpine.data(name, () => ({
        __isShim: true,
        __rzInitRan: false, // Flag to ensure init logic runs only once

        // The init() method of the shim is called by Alpine when it finds an element with x-data="name" on the page.
        async init() {
            // This is the component instance (the shim object itself).
            const self = this;
            self.$el.__rzComponent = self; // Associate with the DOM element

            try {
                // Async import the user's component factory from the specified path.'
                const module = await import(path);
                const userFactory = module && module.default;

                if (typeof userFactory !== 'function') {
                    console.error(`[RizzyUI] '${path}' did not export a default function.`);
                    return;
                }

                //  The __initData function will be called by the x-rz-init directive.
                //    It receives the payload from C# and uses the user's factory
                //    to create the real component logic.
                self.__initData = (payload) => {
                    if (self.__rzInitRan) return;

                    // Create the real component object using the factory from the imported module.
                    const userObj = userFactory(payload ?? {});

                    // 5. Hydrate the shim: Merge the real component's properties and methods
                    //    onto this shim instance, effectively replacing it.
                    Object.assign(self, userObj);
                    delete self.__isShim; // No longer a shim

                    // Call the real component's init() method, if it exists.
                    if (typeof userObj.init === 'function') {
                        // Use queueMicrotask to ensure the DOM is fully patched and ready.
                        queueMicrotask(() => userObj.init.call(self));
                    }

                    self.__rzInitRan = true;
                };

                // After defining __initData, check if x-rz-init has already run.
                // This handles a race condition where the directive might execute
                // before the import() promise resolves.
                if (self.$el.hasAttribute('x-rz-init')) {
                    const initAttr = self.$el.getAttribute('x-rz-init');
                    let data = {};
                    try { data = JSON.parse(initAttr || '{}'); }
                    catch (e) { console.warn('[RizzyUI] x-rz-init JSON parse failed during hydration.', e, self.$el); }
                    self.__initData(data);
                }

            } catch (e) {
                console.error(`[RizzyUI] Failed to load/register '${name}' from '${path}'.`, e);
            }
        }
    }));
};

export { registerRizzyDirectives };
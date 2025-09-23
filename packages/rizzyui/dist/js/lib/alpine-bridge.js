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

    Alpine.data(name, () => ({
        __isShim: true,
        __rzInitRan: false,

        async init() {
            const self = this;
            self.$el.__rzComponent = self;

            try {
                const module = await import(path);
                const userFactory = module && module.default;

                if (typeof userFactory !== 'function') {
                    console.error(`[RizzyUI] '${path}' did not export a default function.`);
                    return;
                }

                // 1. DEFINE the hydration function. It will be called either by the
                //    x-rz-init directive or by the logic below if the directive is absent.
                self.__initData = (payload) => {
                    if (self.__rzInitRan) return;

                    const userObj = userFactory(payload ?? {});

                    Object.assign(self, userObj);
                    delete self.__isShim;

                    if (typeof userObj.init === 'function') {
                        queueMicrotask(() => userObj.init.call(self));
                    }

                    self.__rzInitRan = true;
                };

                // 2. CHECK if the x-rz-init directive is present.
                //    Use a microtask to ensure this check runs after Alpine has had a chance
                //    to initialize its directives on the element.
                queueMicrotask(() => {
                    if (!self.$el.hasAttribute('x-rz-init')) {
                        // 3. If the directive is NOT present, call __initData ourselves
                        //    with an empty payload to complete the component initialization.
                        self.__initData({});
                    }
                    // If the directive IS present, we do nothing here and let it
                    // call __initData when it's ready.
                });

            } catch (e) {
                console.error(`[RizzyUI] Failed to load/register '${name}' from '${path}'.`, e);
            }
        }
    }));
};

export { registerRizzyDirectives };
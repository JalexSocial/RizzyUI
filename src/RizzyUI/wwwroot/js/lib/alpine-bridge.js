
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

    window.RizzyUI.registerModuleOnce = async (name, path) => {
      if (window.RizzyUI.registeredModules.has(name)) return;
      window.RizzyUI.registeredModules.add(name);

      try {
        const url = new URL(path, document.baseURI).toString();
        const module = await import(url);
        const userFactory = module && module.default;

        if (typeof userFactory !== 'function') {
          console.error(`[RizzyUI] '${path}' did not export a default function.`);
          return;
        }

        const shimFactory = (argsFromXData) => {
          if (argsFromXData !== undefined) {
            return userFactory(argsFromXData);
          }
          return {
            __inited: false,
            __initData(payload) {
              if (this.__inited) return;
              const userObj = userFactory(payload ?? {});
              Object.assign(this, userObj);
              if (typeof userObj.init === 'function') {
                queueMicrotask(() => userObj.init.call(this));
              }
              this.__inited = true;
            },
            init() { this.$el.__rzComponent = this; }
          };
        };

        Alpine.data(name, shimFactory);
      } catch (e) {
        console.error(`[RizzyUI] Failed to load/register '${name}' from '${path}'.`, e);
      }
    };

    export { registerRizzyDirectives };
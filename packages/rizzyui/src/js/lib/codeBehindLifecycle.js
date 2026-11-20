/**
 * @file The `ready()` hook of Alpine code-behind modules.
 *
 * Alpine runs a component's `init()` before its children start, and RizzyUI components inside it
 * (a dialog, a dropdown) load their code on demand, so a child's data is not there yet during
 * `init()`. A module can define `ready()` instead: it runs after `init()` (and its promise, if
 * `init()` is async) and after every child that loads immediately (`x-load="eager"`, RizzyUI's
 * default) has started, including components whose root was teleported elsewhere and is reached
 * through an `<rz-proxy>` (dialogs, sheets, popovers). Children with a lazy strategy (`visible`, `idle`, `media`, `event`) are not
 * waited for, because they may start much later or never.
 *
 * ```js
 * export default () => ({
 *   dialog: null,
 *   ready() { this.dialog = Rizzy.$data(this.$refs.dialog); },
 *   open() { this.dialog.openModal(); },
 * });
 * ```
 */

const READY_TIMEOUT_MS = 3000;
const POLL_MS = 16;

function nextTick() {
    const Alpine = globalThis.Alpine;
    return Alpine && typeof Alpine.nextTick === 'function'
        ? new Promise(resolve => Alpine.nextTick(resolve))
        : Promise.resolve();
}

function isLoadingNow(element) {
    if (!element || !element.hasAttribute('x-load')) return false;
    const strategy = (element.getAttribute('x-load') || 'eager').trim();
    return strategy === 'eager' && element._x_async !== 'loaded';
}

function escapeAttribute(value) {
    return typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
        ? CSS.escape(value)
        : String(value).replace(/["\\]/g, '\\$&');
}

/**
 * The child components `root` depends on: its descendants with `x-load`, plus the roots that
 * `<rz-proxy data-for>` elements inside it stand for. Dialogs, sheets and popovers teleport their
 * root out of the component (for example to `<body>`) and leave a proxy where `x-ref` points.
 * @param {Element} root
 */
function childComponents(root) {
    const children = [...root.querySelectorAll('[x-load]')];
    for (const proxy of root.querySelectorAll('rz-proxy[data-for], [data-for]')) {
        const id = proxy.getAttribute('data-for');
        if (!id) continue;
        const target = document.querySelector(`[data-alpine-root="${escapeAttribute(id)}"][x-data]`)
            || document.getElementById(id);
        if (target && !root.contains(target)) children.push(target);
    }
    return children;
}

/**
 * Resolves when the children of `root` that load immediately have started, or after
 * {@link READY_TIMEOUT_MS} with a warning.
 * @param {Element} root
 * @param {string} name Data name, for the warning.
 */
async function childrenStarted(root, name) {
    await nextTick();
    if (!root || typeof root.querySelectorAll !== 'function') return;

    const deadline = Date.now() + READY_TIMEOUT_MS;
    for (;;) {
        const pending = childComponents(root).filter(isLoadingNow);
        if (pending.length === 0) break;
        if (Date.now() > deadline) {
            console.warn(`[RizzyUI] '${name}': ready() is running before ${pending.length} child component(s) finished loading.`, pending);
            break;
        }
        await new Promise(resolve => setTimeout(resolve, POLL_MS));
    }
    await nextTick();
}

/**
 * Wraps a code-behind module's factory so that a `ready()` method on the data it returns runs
 * once the component and its children have started. Factories without `ready()` are unchanged.
 * The promise of the pending `ready()` call is on the root element as `_rz_ready` (used by the
 * test helper).
 * @template {(...args: any[]) => any} T
 * @param {T} factory
 * @param {string} [name]
 * @returns {T}
 */
export function withCodeBehindLifecycle(factory, name = 'code-behind component') {
    if (typeof factory !== 'function' || factory.__rzLifecycle) return factory;

    const wrapped = function (...args) {
        const data = factory.apply(this, args);
        if (!data || typeof data !== 'object' || typeof data.ready !== 'function') return data;

        const init = data.init;
        data.init = function (...initArgs) {
            const result = typeof init === 'function' ? init.apply(this, initArgs) : undefined;
            const root = this.$el;
            const ready = Promise.resolve(result)
                .then(() => childrenStarted(root, name))
                .then(() => this.ready());
            ready.catch(error => console.error(`[RizzyUI] '${name}': ready() failed.`, error));
            if (root) root._rz_ready = ready;
            return result;
        };
        return data;
    };
    wrapped.__rzLifecycle = true;
    return /** @type {T} */ (wrapped);
}

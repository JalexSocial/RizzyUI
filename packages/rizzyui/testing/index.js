/**
 * @file Test helper for Alpine code-behind modules (`Component.razor.js` / `.razor.ts`).
 *
 * Mounts a module's default export on a DOM element the way `RzAlpineComponent` renders it
 * (`x-data`, `data-rz-props`), with Alpine and RizzyUI's `$props` magic, so the module's logic can
 * be tested in Node without a browser or a server.
 *
 * Needs a DOM: run the tests under happy-dom or jsdom (for example `GlobalRegistrator.register()`
 * from `@happy-dom/global-registrator`, or a test runner's DOM environment) before importing this.
 *
 * ```js
 * import { mountCodeBehind } from '@jalexsocial/rizzyui/testing';
 * import counter from '../Components/Counter.razor.js';
 *
 * const { data, root, nextTick } = await mountCodeBehind(counter, {
 *   props: { initialCount: 10 },
 *   html: '<span x-text="count"></span>',
 * });
 * data.increment();
 * await nextTick();
 * assert.equal(root.querySelector('span').textContent, '11');
 * ```
 */
import AlpineModule from 'alpinejs';
import { registerPropsMagic } from '../src/js/lib/alpineProps.js';

// Node resolves alpinejs to its CommonJS build, which exposes the instance as `default`.
const Alpine = AlpineModule.default ?? AlpineModule;

let started = false;
let counter = 0;

function ensureStarted() {
    if (started) return;
    if (typeof document === 'undefined' || typeof window === 'undefined') {
        throw new Error('mountCodeBehind needs a DOM: register happy-dom or jsdom globals before using it.');
    }
    window.Alpine = Alpine;
    window.Rizzy = window.Rizzy || {};
    registerPropsMagic(Alpine);
    Alpine.start();
    started = true;
}

/**
 * Mounts a code-behind module on a new element appended to `document.body`.
 *
 * @template {Record<string, any>} TProps
 * @param {() => Record<string, any>} factory The module's default export.
 * @param {{ props?: TProps, html?: string, name?: string, attributes?: Record<string, string> }} [options]
 *   `props` become `this.$props`; `html` is the component's inner markup; `attributes` are added
 *   to the root element.
 * @returns {Promise<{ root: HTMLElement, data: any, nextTick: () => Promise<void>, destroy: () => void }>}
 */
export async function mountCodeBehind(factory, options = {}) {
    if (typeof factory !== 'function') {
        throw new TypeError('mountCodeBehind expects the module\'s default export (a function that returns the data object).');
    }
    ensureStarted();

    const name = options.name ?? `rzcbTest${++counter}`;
    Alpine.data(name, factory);

    const root = document.createElement('div');
    root.setAttribute('x-data', name);
    root.setAttribute('x-load-src', `test:${name}`);
    root.setAttribute('data-rz-props', JSON.stringify(options.props ?? {}));
    for (const [attribute, value] of Object.entries(options.attributes ?? {})) {
        root.setAttribute(attribute, value);
    }
    root.innerHTML = options.html ?? '';
    document.body.appendChild(root);

    Alpine.initTree(root);
    await Alpine.nextTick();

    return {
        root,
        data: Alpine.$data(root),
        nextTick: () => Alpine.nextTick(),
        destroy: () => {
            Alpine.destroyTree(root);
            root.remove();
        },
    };
}

export { Alpine };

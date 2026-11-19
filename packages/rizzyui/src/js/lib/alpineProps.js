/**
 * @file RizzyUI Alpine props
 * @module alpineProps
 * @description Reads the props that `RzAlpineComponent` passes to an Alpine code-behind module.
 *
 * `RzAlpineComponent` serializes its `Props` parameter (camelCase) into `data-rz-props` on the
 * component root. Modules read them with the `$props` magic (`this.$props.initialCount` in a
 * method, `$props.title` in markup), or with `Rizzy.props(this.$el)`.
 */

const ROOT_SELECTOR = '[x-load-src], [data-rz-props], [data-props-id]';
const cache = new WeakMap();

function parse(element, raw, source) {
    const cached = cache.get(element);
    if (cached && cached.raw === raw) return cached.value;

    let value = {};
    try {
        value = raw ? JSON.parse(raw) : {};
    } catch (error) {
        console.error(`[Rizzy.props] Failed to parse the props in ${source}.`, error);
    }
    cache.set(element, { raw, value });
    return value;
}

/**
 * The code-behind root for `element`: the element itself or its nearest ancestor rendered by
 * `RzAlpineComponent`.
 * @param {Element} element
 * @returns {Element | null}
 */
export function findCodeBehindRoot(element) {
    return element instanceof Element ? element.closest(ROOT_SELECTOR) : null;
}

/**
 * Returns the props of the code-behind component that contains `element` (usually `this.$el`).
 * The object is parsed once per element and value and shared, so treat it as read-only.
 * Returns `{}` when the component has no props.
 *
 * @param {Element} element An element inside (or the root of) the component.
 * @returns {Record<string, any>}
 */
function props(element) {
    if (!(element instanceof Element)) {
        console.warn('[Rizzy.props] Invalid input. Expected an element, usually this.$el.');
        return {};
    }

    const root = findCodeBehindRoot(element);
    if (!root) return {};

    if (root.hasAttribute('data-rz-props')) {
        return parse(root, root.getAttribute('data-rz-props'), 'data-rz-props');
    }

    // Props rendered by RizzyUI 1.0.0-preview.2 and earlier: a JSON script referenced by id.
    const scriptId = root.getAttribute('data-props-id');
    if (!scriptId) return {};
    const script = document.getElementById(scriptId);
    if (!script) {
        console.warn(`[Rizzy.props] Could not find the props script with id '${scriptId}'.`);
        return {};
    }
    return parse(root, script.textContent || '{}', `#${scriptId}`);
}

/**
 * Registers the `$props` magic: the props of the code-behind component the expression or data
 * object belongs to. Works with the standard and the CSP build of Alpine.
 * @param {any} Alpine
 */
export function registerPropsMagic(Alpine) {
    Alpine.magic('props', el => props(el));
}

export default props;

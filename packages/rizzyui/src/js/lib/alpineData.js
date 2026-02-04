/**
 * Helper function to retrieve the Alpine.js x-data state object associated with a component.
 *
 * This version is teleport-safe and proxy-aware:
 * - It accepts either a component **ID** (string) or a **DOM Element**.
 * - If the element is an `<rz-proxy data-for="...">`, it resolves that proxy to the real
 *   teleported Alpine root (`[data-alpine-root="<id>"]`) before calling `Alpine.$data`.
 * - If a string ID is provided, it searches under the local wrapper (if present) and then
 *   falls back to a **document-wide** lookup, which works even when the root was teleported.
 *
 * @prerequisites
 *   - Alpine.js (v3+) loaded and initialized globally as `Alpine`.
 *   - For string input:
 *       The component wrapper SHOULD have `id="<Id>"`, and the Alpine root element SHOULD have
 *       `data-alpine-root="<Id>"`. When teleport moves the root, the global fallback will still find it.
 *   - For element input:
 *       - If the element is an `<rz-proxy data-for="<Id>">`, `$data` will resolve `<Id>`
 *         to the actual Alpine root before querying Alpine.
 *       - If the element is any other node, `$data` will attempt to read the scope on that
 *         element, then fall back to the closest `[x-data]` ancestor.
 *
 * @param {string | Element} idOrElement
 *   - A **string** component ID (the wrapper/root id used by `data-alpine-root`), OR
 *   - An **Element** (can be the Alpine root, a descendant, or an `<rz-proxy>`).
 *
 * @returns {object | undefined}
 *   The Alpine x-data state object if found and initialized, otherwise `undefined`.
 *   (Mirrors `Alpine.$data` semantics.)
 */
function $data(idOrElement) {
    // ── Prerequisite check ───────────────────────────────────────────────────────
    if (typeof Alpine === 'undefined' || typeof Alpine.$data !== 'function') {
        console.error(
            'Rizzy.$data: Alpine.js context (Alpine.$data) is not available. ' +
            'Ensure Alpine is loaded and started before calling $data.'
        );
        return undefined;
    }

    // ── Element path (supports proxies & teleports) ─────────────────────────────
    if (idOrElement instanceof Element) {
        const target = resolveProxy(idOrElement) || idOrElement;

        // Ask Alpine for the scope bound to this element
        let alpineData = Alpine.$data(target);

        // If the element itself isn't an Alpine root, try nearest [x-data] ancestor
        if (alpineData === undefined) {
            const nearest = target.closest?.('[x-data]');
            if (nearest) {
                alpineData = Alpine.$data(nearest);
            }
        }

        if (alpineData === undefined) {
            warnDataUndefined('element', target);
        }
        return alpineData;
    }

    // ── String ID path (local → global fallback for teleports) ──────────────────
    if (typeof idOrElement === 'string') {
        const componentId = idOrElement.trim();
        if (!componentId) {
            console.warn('Rizzy.$data: Invalid componentId provided (empty string).');
            return undefined;
        }

        const selector = `[data-alpine-root="${cssEscapeSafe(componentId)}"]`;
        let root = null;

        // 1) Try the wrapper by id, then search inside (classic local layout)
        const wrapper = document.getElementById(componentId);
        if (wrapper) {
            root = wrapper.matches(selector) ? wrapper : wrapper.querySelector(selector);
        }

        // 2) Global fallback (supports x-teleport to <body> or elsewhere)
        if (!root) {
            root = findAlpineRootById(componentId);
        }

        if (!root) {
            console.warn(
                `Rizzy.$data: Could not locate an Alpine root using ${selector} ` +
                `locally or globally. Verify that the teleported root rendered and ` +
                `that 'data-alpine-root="${componentId}"' is present.`
            );
            return undefined;
        }

        const alpineData = Alpine.$data(root);
        if (alpineData === undefined) {
            warnDataUndefined(`data-alpine-root="${componentId}"`, root);
        }
        return alpineData;
    }

    // ── Invalid input ────────────────────────────────────────────────────────────
    console.warn('Rizzy.$data: Expected a non-empty string id or an Element.');
    return undefined;
}

/**
 * Wait until the Alpine root for a given component ID exists and has an initialized x-data.
 *
 * Useful when calling early (e.g., right after navigation) and you need to defer
 * until the teleported/modal root is in the DOM and Alpine has started.
 *
 * @param {string} componentId - The id used in `data-alpine-root="<componentId>"`.
 * @param {{ timeout?: number, interval?: number }} [options]
 *   - timeout: max time to wait in ms (default 3000ms)
 *   - interval: poll interval in ms (default 50ms)
 *
 * @returns {Promise<Element|null>}
 *   Resolves with the Alpine root Element when ready, or `null` on timeout.
 *
 * @example
 * const root = await waitForRoot('myModalId');
 * if (root) {
 *   const modal = Alpine.$data(root);
 *   modal?.openModal?.();
 * }
 */
async function waitForRoot(componentId, { timeout = 3000, interval = 50 } = {}) {
    const start = performance.now();

    while (performance.now() - start < timeout) {
        const root = findAlpineRootById(componentId);
        if (root) {
            const data = Alpine.$data(root);
            if (data !== undefined) return root;
        }
        await sleep(interval);
    }
    return null;
}

// ──────────────────────────── Internals ───────────────────────────────────────

/**
 * Resolve an `<rz-proxy data-for="...">` element (or any element carrying `data-for`)
 * to the *actual* Alpine root for that component id. Non-proxy elements are returned as-is.
 *
 * @param {Element} el
 * @returns {Element|null} The resolved Alpine root element, the original element, or null if not found.
 */
function resolveProxy(el) {
    if (!(el instanceof Element)) return null;

    const isProxyTag = el.tagName?.toLowerCase?.() === 'rz-proxy';
    const proxyFor = el.getAttribute?.('data-for');

    if (isProxyTag || proxyFor) {
        const id = proxyFor || '';
        if (!id) return el; // malformed proxy, fall back to the element itself
        const root = findAlpineRootById(id);
        if (!root) {
            console.warn(
                `Rizzy.$data: Proxy element could not resolve Alpine root for id "${id}". ` +
                `Ensure the teleported root rendered with data-alpine-root="${id}".`
            );
            return null;
        }
        return root; // success: return the real Alpine root
    }

    return el; // not a proxy
}

/**
 * Locate the Alpine root element for a given component id anywhere in document.
 * Prefers nodes that actually carry `x-data`.
 *
 * @param {string} id
 * @returns {Element|null}
 */
function findAlpineRootById(id) {
    const sel = `[data-alpine-root="${cssEscapeSafe(id)}"]`;
    const candidates = document.querySelectorAll(sel);

    // Prefer a node that actually has x-data (the real Alpine root)
    for (const n of candidates) {
        if (n.hasAttribute('x-data')) return n;
    }
    // Fallback: return the first candidate if any
    if (candidates.length > 0) return candidates[0];

    // Last resort: an element whose id matches (helps in edge layouts)
    return document.getElementById(id) || null;
}

/**
 * Escape a string for safe use inside a CSS attribute selector.
 * Falls back to a minimal escape when CSS.escape is unavailable.
 *
 * @param {string} s
 * @returns {string}
 */
function cssEscapeSafe(s) {
    try {
        if (window.CSS && typeof window.CSS.escape === 'function') {
            return window.CSS.escape(s);
        }
    } catch (_) { /* noop */ }
    // Minimal escape for double quotes inside ["..."]
    return String(s).replace(/"/g, '\\"');
}

/**
 * Log a helpful warning when Alpine.$data returned undefined for a target.
 *
 * @param {string} origin - A description of how the target was selected (e.g., 'element' or 'data-alpine-root="id"').
 * @param {Element} target
 */
function warnDataUndefined(origin, target) {
    const desc =
        `${target.tagName?.toLowerCase?.() || 'node'}` +
        `${target.id ? '#' + target.id : ''}` +
        `${target.classList?.length ? '.' + Array.from(target.classList).join('.') : ''}`;

    console.warn(
        `Rizzy.$data: Located target via ${origin} (${desc}), but Alpine.$data returned undefined. ` +
        `Ensure this element (or its nearest [x-data] ancestor) has an initialized Alpine component.`
    );
}

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

// Default ES Module export
export default $data;

// Named export for the waiter
export { waitForRoot };

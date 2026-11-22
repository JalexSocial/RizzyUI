/**
 * Events for components that have not started yet (Summit SF-039).
 *
 * RizzyUI components load their code on demand, so a window event sent right after the page loads
 * (a dialog's EventTriggerName from HX-Trigger, Ctrl+K pressed at once) can arrive before the
 * component that listens for it exists. The buffer listens for every EventTriggerName on the page
 * and keeps the last event a component has not handled yet; the component replays it when it starts
 * (takeBufferedEvent). componentsReady() resolves once the page's eager components have started, and
 * the document gets an `rz:ready` event the first time.
 */

// Shared through globalThis: component bundles may carry their own copy of this module.
const pending = (globalThis.__rzPendingEvents ??= new Map());
const MAX_AGE_MS = 10000;

let installed = null;

function hasStartedListener(doc, name) {
    for (const el of doc.querySelectorAll('[data-event-trigger-name]')) {
        if (el.dataset.eventTriggerName === name && el._x_dataStack) return true;
    }
    return false;
}

/**
 * Starts listening for the EventTriggerName of every component on the page (and of components added
 * later). Idempotent.
 * @param {Window} win The window.
 * @returns {() => void} Uninstalls the buffer.
 */
export function installLazyEventBuffer(win) {
    if (installed) return installed;
    const doc = win.document;
    const listeners = new Map();

    const listen = (name) => {
        if (!name || listeners.has(name)) return;
        const listener = (event) => {
            if (hasStartedListener(doc, name)) return;
            pending.set(name, { detail: event.detail, time: Date.now() });
        };
        listeners.set(name, listener);
        win.addEventListener(name, listener);
    };

    const scan = (root) => {
        if (!root || typeof root.querySelectorAll !== 'function') return;
        if (root.dataset?.eventTriggerName) listen(root.dataset.eventTriggerName);
        for (const el of root.querySelectorAll('[data-event-trigger-name]')) listen(el.dataset.eventTriggerName);
    };

    scan(doc);
    let observer = null;
    if (typeof win.MutationObserver === 'function' && doc.body) {
        observer = new win.MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) scan(node);
                }
            }
        });
        observer.observe(doc.body, { childList: true, subtree: true });
    }

    installed = () => {
        observer?.disconnect();
        for (const [name, listener] of listeners) win.removeEventListener(name, listener);
        listeners.clear();
        pending.clear();
        installed = null;
    };
    return installed;
}

/**
 * The last unhandled event of that name, if it is recent; removes it.
 * @param {string} name The event name (a component's EventTriggerName).
 * @returns {{ detail: any } | null} The buffered event.
 */
export function takeBufferedEvent(name) {
    const entry = name ? pending.get(name) : null;
    if (!entry) return null;
    pending.delete(name);
    return Date.now() - entry.time <= MAX_AGE_MS ? { detail: entry.detail } : null;
}

/** Eager components (x-data without a deferred x-load) that have not started yet. */
export function pendingComponents(doc) {
    return [...doc.querySelectorAll('[x-data]')].filter((el) =>
        !el.closest('template') && (el.getAttribute('x-load') ?? 'eager') === 'eager' && !el._x_dataStack);
}

/**
 * Resolves when every eager component on the page has started (or after the timeout).
 * @param {Window} win The window.
 * @param {number} timeoutMs Give up after this long.
 * @returns {Promise<boolean>} True when all started, false on timeout.
 */
export function componentsReady(win, timeoutMs = 10000) {
    const doc = win.document;
    const start = Date.now();
    const frame = typeof win.requestAnimationFrame === 'function' ? win.requestAnimationFrame.bind(win) : (fn) => setTimeout(fn, 16);
    return new Promise((resolve) => {
        const check = () => {
            if (pendingComponents(doc).length === 0) return resolve(true);
            if (Date.now() - start > timeoutMs) return resolve(false);
            frame(check);
        };
        check();
    });
}

/**
 * Dispatches `rz:ready` on the document once the page's eager components have started.
 * @param {Window} win The window.
 */
export function announceReady(win) {
    componentsReady(win).then((ok) => {
        if (ok) win.document.dispatchEvent(new CustomEvent('rz:ready', { detail: { Rizzy: win.Rizzy } }));
    });
}

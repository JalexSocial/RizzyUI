/**
 * Destroys Alpine components that are removed inside an element Alpine never initialized.
 *
 * Alpine's own MutationObserver only cleans up a removed element that it marked during
 * initialization (`_x_marker`). Alpine marks the trees under `x-data` roots, not the plain
 * elements around them, so removing a wrapper (an htmx swap of a `<section>`, or a RizzyUI
 * component whose `x-data` sits on an inner element) skips every component inside: their
 * `destroy()` never runs, and their listeners and third-party instances (Chart.js, Tom Select,
 * flatpickr) stay alive (Summit SF-062).
 *
 * This observer handles exactly the removals Alpine skips: an element without a marker that is no
 * longer in the document when the records are delivered (a node that was moved is connected again
 * by then and is left alone).
 *
 * @param {Window} win The window to install into.
 * @param {object} Alpine The Alpine instance (needs `destroyTree`).
 * @returns {() => void} Disconnects the observer.
 */
export function installAlpineOrphanCleanup(win = typeof window !== 'undefined' ? window : undefined, Alpine = win?.Alpine) {
    const doc = win?.document;
    const Observer = win?.MutationObserver;
    if (!doc?.documentElement || typeof Observer !== 'function' || typeof Alpine?.destroyTree !== 'function') {
        return () => {};
    }

    if (doc.documentElement.__rizzyUIOrphanCleanup) {
        return doc.documentElement.__rizzyUIOrphanCleanup;
    }

    const observer = new Observer(records => destroyOrphanedTrees(Alpine, records));
    observer.observe(doc.documentElement, { childList: true, subtree: true });

    const disconnect = () => {
        observer.disconnect();
        delete doc.documentElement.__rizzyUIOrphanCleanup;
    };
    doc.documentElement.__rizzyUIOrphanCleanup = disconnect;
    return disconnect;
}

/**
 * Runs `Alpine.destroyTree` on each removed element that Alpine's observer skips.
 * Exported for tests.
 *
 * @returns {number} How many removed trees were destroyed.
 */
export function destroyOrphanedTrees(Alpine, records) {
    let destroyed = 0;
    for (const record of records) {
        for (const node of record.removedNodes ?? []) {
            if (node?.nodeType !== 1) continue;
            // Alpine cleans up elements it marked; a connected node was moved, not removed.
            if (node._x_marker || node.isConnected) continue;
            Alpine.destroyTree(node);
            destroyed++;
        }
    }
    return destroyed;
}

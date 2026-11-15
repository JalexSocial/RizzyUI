/**
 * Lets htmx see hx-* markup that Alpine teleports into the document after htmx has initialized.
 *
 * Dialog, sheet, popover and dropdown content is rendered inside `<template x-teleport="body">`.
 * Alpine clones that content into <body> when the owning component initializes. RizzyUI loads
 * those components asynchronously (x-load), so this usually happens after htmx processed the
 * page on DOMContentLoaded, and htmx (which has no DOM observer of its own) never wires the
 * teleported hx-* elements: a form with hx-post would submit natively instead.
 *
 * The bridge watches only the direct children of <body> (where every RizzyUI teleport lands) and
 * calls `htmx.process()` on each added element. `htmx.process` skips elements it has already
 * initialized, so content that htmx swapped in itself is not processed twice.
 *
 * @param {Window} win The window to install into.
 * @returns {() => void} Disconnects the observer.
 */
export function installHtmxTeleportBridge(win = typeof window !== 'undefined' ? window : undefined) {
    const doc = win?.document;
    const Observer = win?.MutationObserver;
    if (!doc?.body || typeof Observer !== 'function') {
        return () => {};
    }

    if (doc.body.__rizzyUIHtmxBridge) {
        return doc.body.__rizzyUIHtmxBridge;
    }

    const observer = new Observer(records => processAddedElements(win, records));
    observer.observe(doc.body, { childList: true });

    const disconnect = () => {
        observer.disconnect();
        delete doc.body.__rizzyUIHtmxBridge;
    };
    doc.body.__rizzyUIHtmxBridge = disconnect;
    return disconnect;
}

/**
 * Calls htmx.process for every element node in the mutation records.
 * Exported for tests.
 */
export function processAddedElements(win, records) {
    const htmx = win?.htmx;
    if (typeof htmx?.process !== 'function') {
        return 0;
    }

    let processed = 0;
    for (const record of records) {
        for (const node of record.addedNodes ?? []) {
            if (node?.nodeType === 1) {
                htmx.process(node);
                processed++;
            }
        }
    }
    return processed;
}

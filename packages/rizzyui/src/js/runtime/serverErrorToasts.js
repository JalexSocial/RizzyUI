/**
 * Shows an error toast when an htmx request fails, for pages whose RzToastProvider has
 * ServerErrorToasts on (Summit SF-041). Rizzy's UseHtmxErrorHandling answers a 5xx on an htmx
 * request with an `rz:server-error` event instead of swapping the error page, and htmx 4 raises
 * `htmx:error` when a request cannot be sent at all; without a listener the user sees nothing.
 *
 * The provider writes the (localized) messages into its config as `serverErrors`; without them
 * (the option is off, or no provider is on the page) nothing is shown.
 *
 * @param {Window} win The window to install into.
 * @param {{ error: (text: string, title?: string) => unknown }} toast The toast facade.
 * @returns {() => void} Removes the listeners.
 */
export function installServerErrorToasts(win = typeof window !== 'undefined' ? window : undefined, toast) {
    const doc = win?.document;
    if (!doc || typeof doc.addEventListener !== 'function' || typeof toast?.error !== 'function') {
        return () => {};
    }

    if (doc.__rizzyUIServerErrorToasts) {
        return doc.__rizzyUIServerErrorToasts;
    }

    const onServerError = () => showServerErrorToast(doc, toast, 'server');
    const onNetworkError = () => showServerErrorToast(doc, toast, 'network');
    doc.addEventListener('rz:server-error', onServerError);
    doc.addEventListener('htmx:error', onNetworkError);

    const uninstall = () => {
        doc.removeEventListener('rz:server-error', onServerError);
        doc.removeEventListener('htmx:error', onNetworkError);
        delete doc.__rizzyUIServerErrorToasts;
    };
    doc.__rizzyUIServerErrorToasts = uninstall;
    return uninstall;
}

/**
 * Reads the provider's `serverErrors` messages and shows the toast for `kind`. Exported for tests.
 *
 * @param {Document} doc
 * @param {{ error: (text: string, title?: string) => unknown }} toast
 * @param {'server' | 'network'} kind
 * @returns {boolean} Whether a toast was shown.
 */
export function showServerErrorToast(doc, toast, kind) {
    const messages = readMessages(doc);
    if (!messages) return false;

    const text = kind === 'network' ? messages.networkText : messages.text;
    if (!text) return false;

    toast.error(text, messages.title || undefined);
    return true;
}

function readMessages(doc) {
    const config = doc.querySelector?.('[data-rz-toast-config]');
    if (!config) return null;
    try {
        return JSON.parse(config.textContent || '{}').serverErrors ?? null;
    } catch {
        return null;
    }
}

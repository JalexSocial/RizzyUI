/**
 * @file Loader for Alpine code-behind modules (`Component.razor.js`).
 *
 * `RzAlpineComponent` renders `x-data="<name>" x-load="<strategy>" x-load-src="<module URL>"`.
 * async-alpine reads `x-load-src` and calls `Alpine.asyncUrl(name, url)`; RizzyUI replaces that
 * function so every code-behind module goes through one loader that:
 *
 * - loads each name once and warns when the same name is used for a different URL;
 * - retries once with the plain URL (`data-rz-module-fallback`) when the fingerprinted URL fails,
 *   which happens on a page left open across a deployment that removed the old file;
 * - reports a failure once, names the module, dispatches `rz:module-error` on `document`, and
 *   registers an inert data object so the rest of the page keeps working.
 */

const loaders = new Map();

function absoluteUrl(url) {
    try {
        return new URL(url, document.baseURI).href;
    } catch {
        return url;
    }
}

function findFallbackUrl(url) {
    if (typeof document === 'undefined') return null;
    for (const element of document.querySelectorAll('[data-rz-module-fallback]')) {
        if (element.getAttribute('x-load-src') === url) {
            return element.getAttribute('data-rz-module-fallback');
        }
    }
    return null;
}

function failedModule(name) {
    return {
        default: () => ({
            _error: true,
            _errorMessage: `Module '${name}' failed to load.`,
        }),
    };
}

/**
 * Imports a code-behind module, with the fallback and error handling described above. Exported for
 * `Rizzy.registerAsyncComponent`, which registers modules by name from script.
 * @param {string} name Alpine data name.
 * @param {string} url Module URL.
 * @param {string | null} [fallbackUrl] URL to try when `url` fails.
 */
export async function importCodeBehindModule(name, url, fallbackUrl = null) {
    try {
        return await import(/* @vite-ignore */ absoluteUrl(url));
    } catch (error) {
        const fallback = fallbackUrl ?? findFallbackUrl(url);
        if (fallback && fallback !== url) {
            try {
                const module = await import(/* @vite-ignore */ absoluteUrl(fallback));
                console.warn(`[RizzyUI] Loaded '${name}' from ${fallback} because ${url} failed to load. ` +
                    'The page is probably older than the current deployment; reload it to get matching markup and modules.');
                return module;
            } catch {
                // Report the original failure below.
            }
        }

        console.error(`[RizzyUI] Could not load the code-behind module for '${name}' from ${url}` +
            (fallback && fallback !== url ? ` (or ${fallback})` : '') +
            '. Check that the .razor.js file exists next to the component and is published as a static web asset.', error);
        if (typeof document !== 'undefined') {
            document.dispatchEvent(new CustomEvent('rz:module-error', {
                detail: { name, url, fallbackUrl: fallback ?? null, error },
            }));
        }
        return failedModule(name);
    }
}

/**
 * Registers `name` to load from `url` through {@link importCodeBehindModule}. The first URL
 * registered for a name wins, as in async-alpine; a different URL for the same name is reported.
 * @param {import('alpinejs').Alpine & { asyncData: Function }} Alpine
 * @param {string} name
 * @param {string} url
 * @param {string | null} [fallbackUrl]
 * @returns {boolean} Whether the name is registered for this URL.
 */
export function registerCodeBehindModule(Alpine, name, url, fallbackUrl = null) {
    if (!name || !url) return false;

    const previous = loaders.get(name);
    if (previous) {
        if (previous !== url) {
            console.warn(`[RizzyUI] Two code-behind modules use the Alpine name '${name}'. ` +
                `Keeping ${previous} and ignoring ${url}. Give the components different Name values, or leave Name unset so RizzyUI generates unique names.`);
            return false;
        }
        return true;
    }

    loaders.set(name, url);
    Alpine.asyncData(name, () => importCodeBehindModule(name, url, fallbackUrl));
    return true;
}

/**
 * Routes async-alpine's `x-load-src` (and any `Alpine.asyncUrl` call) through
 * {@link registerCodeBehindModule}. Call after `Alpine.plugin(AsyncAlpine)`.
 * @param {any} Alpine
 */
export function installCodeBehindLoader(Alpine) {
    if (typeof Alpine.asyncData !== 'function') return;
    Alpine.asyncUrl = (name, url) => {
        registerCodeBehindModule(Alpine, name, url);
    };
}

/** For tests: forget registered names. */
export function resetCodeBehindLoaderForTests() {
    loaders.clear();
}

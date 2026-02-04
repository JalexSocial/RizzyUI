/**
 * @file RizzyUI Alpine Async Module Registrar (ESM, no globals)
 * @description Idempotent registration for AsyncAlpine:
 *  - Safe to call repeatedly (same name/path → no duplicates).
 *  - Coalesces imports so a path loads only once.
 *  - Handles pre/post `alpine:init` cleanly with a single one-time listener.
 */

/** Module-scoped state (reset if the module is reloaded). */
const _registered = new Map(); // name -> { path, loaderSet: boolean }
const _importCache = new Map(); // path -> Promise(module)
let _onAlpineInitAttached = false;

/** Import a module once per path; retry allowed after a failure. */
function onceImport(path) {
    if (!_importCache.has(path)) {
        _importCache.set(
            path,
            import(path).catch(err => {
                // Allow a later retry if this one failed.
                _importCache.delete(path);
                throw err;
            })
        );
    }
    return _importCache.get(path);
}

function setAsyncLoader(name, path) {
    const Alpine = globalThis.Alpine;
    if (!(Alpine && typeof Alpine.asyncData === "function")) {
        console.error(
            `[RizzyUI] Could not register async component '${name}'. AsyncAlpine not available.`
        );
        return false;
    }

    Alpine.asyncData(name, () =>
        onceImport(path).catch(error => {
            console.error(
                `[RizzyUI] Failed to load Alpine module '${name}' from '${path}'.`,
                error
            );
            // Return a minimal component to avoid Alpine errors on undefined.
            return () => ({
                _error: true,
                _errorMessage: `Module '${name}' failed to load.`,
            });
        })
    );

    return true;
}

/**
 * Registers an async Alpine component. Safe to call many times.
 * - If Alpine is live, register immediately (last write wins on path changes).
 * - If Alpine isn't ready, defer until `alpine:init` (single listener).
 *
 * @param {string} name - Alpine async component name (used in x-data).
 * @param {string} path - URL to the JS module to import via dynamic import().
 */
function registerAsyncComponent(name, path) {
    if (!name || !path) {
        console.error("[RizzyUI] registerAsyncComponent requires both name and path.");
        return;
    }

    const prev = _registered.get(name);
    if (prev && prev.path !== path) {
        console.warn(
            `[RizzyUI] Re-registering '${name}' with a different path.\n` +
            `  Previous: ${prev.path}\n  New:      ${path}`
        );
    }

    const Alpine = globalThis.Alpine;

    // If Alpine is already running, register (idempotent).
    if (Alpine && Alpine.version) {
        const changedPath = !prev || prev.path !== path;
        const alreadySet = prev && prev.loaderSet && !changedPath;

        if (!alreadySet) {
            const ok = setAsyncLoader(name, path);
            _registered.set(name, { path, loaderSet: ok });
        }
        return;
    }

    // Alpine not ready — stash and attach a single alpine:init listener if needed.
    _registered.set(name, { path, loaderSet: false });

    if (!_onAlpineInitAttached) {
        _onAlpineInitAttached = true;
        document.addEventListener(
            "alpine:init",
            () => {
                for (const [n, info] of _registered) {
                    if (!info.loaderSet) {
                        const ok = setAsyncLoader(n, info.path);
                        info.loaderSet = ok;
                    }
                }
            },
            { once: true }
        );
    }
}

export default registerAsyncComponent;
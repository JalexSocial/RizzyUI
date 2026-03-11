const registered = new Map();
const importCache = new Map();
let onAlpineInitAttached = false;

function onceImport(path) {
    if (!importCache.has(path)) {
        importCache.set(
            path,
            import(path).catch(error => {
                importCache.delete(path);
                throw error;
            })
        );
    }

    return importCache.get(path);
}

function setAsyncLoader(name, path) {
    const Alpine = globalThis.Alpine;

    if (!(Alpine && typeof Alpine.asyncData === 'function')) {
        console.error(`[RizzyUI] Could not register async component '${name}'. AsyncAlpine not available.`);
        return false;
    }

    Alpine.asyncData(name, () =>
        onceImport(path).catch(error => {
            console.error(`[RizzyUI] Failed to load Alpine module '${name}' from '${path}'.`, error);
            return () => ({
                _error: true,
                _errorMessage: `Module '${name}' failed to load.`,
            });
        })
    );

    return true;
}

function ensurePendingAsyncComponentsAreRegistered() {
    for (const [name, info] of registered) {
        if (info.loaderSet) {
            continue;
        }

        info.loaderSet = setAsyncLoader(name, info.path);
    }
}

export function registerAsyncComponent(name, path) {
    if (!name || !path) {
        console.error('[RizzyUI] registerAsyncComponent requires both name and path.');
        return;
    }

    const previous = registered.get(name);

    if (previous && previous.path !== path) {
        console.warn(`[RizzyUI] Re-registering '${name}' with a different path.\nPrevious: ${previous.path}\nNew:      ${path}`);
    }

    const Alpine = globalThis.Alpine;

    if (Alpine && Alpine.version) {
        const changedPath = !previous || previous.path !== path;
        const alreadySet = previous && previous.loaderSet && !changedPath;

        if (!alreadySet) {
            const loaderSet = setAsyncLoader(name, path);
            registered.set(name, { path, loaderSet });
        }

        return;
    }

    registered.set(name, { path, loaderSet: false });

    if (!onAlpineInitAttached) {
        onAlpineInitAttached = true;

        document.addEventListener('alpine:init', () => {
            ensurePendingAsyncComponentsAreRegistered();
        }, { once: true });
    }
}

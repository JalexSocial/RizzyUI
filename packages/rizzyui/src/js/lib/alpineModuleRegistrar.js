
/**
 * @file RizzyUI Alpine Async Module Registrar
 * @module alpineModuleRegistrar
 * @description Provides a centralized function for registering co-located JavaScript modules
 * with AsyncAlpine, correctly handling the alpine:init race condition.
 */

/**
 * Registers an async Alpine component. It checks if Alpine is already initialized.
 * If so, it registers the component immediately. If not, it waits for the 'alpine:init'
 * event before registering. This ensures registration happens at the correct time,
 * regardless of script execution order.
 *
 * @param {string} name - The name to register the Alpine component with (used in x-data).
 * @param {string} path - The URL path to the JavaScript module to import.
 */
function registerAsyncComponent(name, path) {
    const register = () => {
        if (window.Alpine && typeof window.Alpine.asyncData === 'function') {
            window.Alpine.asyncData(name, () =>
                import(path).catch(error => {
                    console.error(`[RizzyUI] Failed to load Alpine module '${name}' from '${path}'.`, error);
                    // Return a dummy module to prevent Alpine from breaking on an undefined component.
                    return () => ({
                        _error: true,
                        _errorMessage: `Module '${name}' failed to load.`
                    });
                })
            );
        } else {
            console.error(`[RizzyUI] Could not register async component '${name}'. Alpine.js or the AsyncAlpine plugin was not available when 'alpine:init' fired.`);
        }
    };

    if (window.Alpine && window.Alpine.version) {
        register();
    } else {
        document.addEventListener('alpine:init', register, { once: true });
    }
}

export default registerAsyncComponent;
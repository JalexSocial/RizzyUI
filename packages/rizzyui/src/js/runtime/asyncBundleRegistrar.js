import { bundleLoaderRegistry } from './bundleLoaderRegistry.js';
import { componentBundleManifest } from './componentBundleManifest.js';

/**
 * Creates a component-factory loader over a bundle registry. Each bundle is imported once and the
 * promise is shared; a failed import is evicted so the next use of any of its components retries
 * it instead of failing from the cache (RZUI-031).
 * @param {Record<string, () => Promise<object>>} registry bundle name → dynamic import
 * @param {Record<string, string>} manifest component name → bundle name
 */
export function createComponentFactoryLoader(registry, manifest) {
    const loadedBundles = new Map();

    function loadBundle(bundleName, componentName) {
        if (!loadedBundles.has(bundleName)) {
            const loader = registry[bundleName];
            if (!loader) {
                throw new Error(`[RizzyUI] Bundle loader '${bundleName}' is missing.`);
            }

            const pending = Promise.resolve()
                .then(() => loader())
                .catch(error => {
                    if (loadedBundles.get(bundleName) === pending) {
                        loadedBundles.delete(bundleName);
                    }
                    console.error(`[RizzyUI] Failed to load bundle '${bundleName}' for component '${componentName}'. It will be retried the next time it is needed.`, error);
                    throw error;
                });
            loadedBundles.set(bundleName, pending);
        }

        return loadedBundles.get(bundleName);
    }

    return async function loadComponentFactory(componentName) {
        const bundleName = manifest[componentName];
        if (!bundleName) {
            throw new Error(`[RizzyUI] No owning bundle was found for component '${componentName}'.`);
        }

        const bundleModule = await loadBundle(bundleName, componentName);
        const factory = bundleModule[componentName];

        if (!factory) {
            throw new Error(`[RizzyUI] Component '${componentName}' is not exported by bundle '${bundleName}'.`);
        }

        return factory;
    };
}

const loadComponentFactory = createComponentFactoryLoader(bundleLoaderRegistry, componentBundleManifest);

export function registerAsyncBundleComponents(Alpine) {
    for (const componentName of Object.keys(componentBundleManifest)) {
        // async-alpine accepts a function returning a Promise that resolves to the component factory
        Alpine.asyncData(componentName, () => loadComponentFactory(componentName));
    }
}

export async function preloadBundlesForDocument(Alpine, root = document) {
    if (!root || typeof root.querySelectorAll !== 'function') {
        return;
    }

    const componentNames = new Set();
    const xDataNodes = root.querySelectorAll('[x-data]');

    for (const node of xDataNodes) {
        const expression = node.getAttribute('x-data');
        if (!expression) continue;
        const parsedName = expression.trim().split(/[({]/)[0]?.trim();
        
        if (parsedName && componentBundleManifest[parsedName]) {
            componentNames.add(parsedName);
        }
    }

    // Await the loading of the factories for all detected components
    await Promise.all([...componentNames].map(name => loadComponentFactory(name)));
}

export async function loadComponentDefinition(Alpine, componentName) {
    return await loadComponentFactory(componentName);
}

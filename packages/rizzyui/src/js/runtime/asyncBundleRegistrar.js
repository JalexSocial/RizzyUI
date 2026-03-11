import { bundleLoaderRegistry } from './bundleLoaderRegistry.js';
import { componentBundleManifest } from './componentBundleManifest.js';

// Cache the promises so we only fetch a bundle once
const loadedBundles = new Map();

async function loadComponentFactory(componentName) {
    const bundleName = componentBundleManifest[componentName];
    if (!bundleName) {
        throw new Error(`[RizzyUI] No owning bundle was found for component '${componentName}'.`);
    }

    if (!loadedBundles.has(bundleName)) {
        const loader = bundleLoaderRegistry[bundleName];
        if (!loader) {
            throw new Error(`[RizzyUI] Bundle loader '${bundleName}' is missing.`);
        }
        loadedBundles.set(bundleName, loader());
    }

    const bundleModule = await loadedBundles.get(bundleName);
    const factory = bundleModule[componentName];
    
    if (!factory) {
        throw new Error(`[RizzyUI] Component '${componentName}' is not exported by bundle '${bundleName}'.`);
    }

    return factory;
}

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

import { registerCodeBehindModule } from './codeBehindLoader.js';

// `Rizzy.registerAsyncComponent(name, path)`: registers an Alpine data name that loads from a module
// URL on first use (with `x-load` on the element). RzAlpineComponent no longer needs it (it renders
// `x-load-src`), but scripts can still register modules by name. Calls made before Alpine starts
// are queued until `alpine:init`.

const pending = new Map();
let onAlpineInitAttached = false;

function alpineWithAsyncData() {
    const Alpine = globalThis.Alpine;
    return Alpine && typeof Alpine.asyncData === 'function' ? Alpine : null;
}

function flushPending() {
    const Alpine = alpineWithAsyncData();
    if (!Alpine) {
        console.error('[RizzyUI] Could not register async components: async-alpine is not available.');
        return;
    }
    for (const [name, path] of pending) {
        registerCodeBehindModule(Alpine, name, path);
    }
    pending.clear();
}

export function registerAsyncComponent(name, path) {
    if (!name || !path) {
        console.error('[RizzyUI] registerAsyncComponent requires both name and path.');
        return;
    }

    const Alpine = alpineWithAsyncData();
    if (Alpine && Alpine.version) {
        registerCodeBehindModule(Alpine, name, path);
        return;
    }

    pending.set(name, path);
    if (!onAlpineInitAttached && typeof document !== 'undefined') {
        onAlpineInitAttached = true;
        document.addEventListener('alpine:init', flushPending, { once: true });
    }
}

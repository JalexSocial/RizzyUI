import { toastInputEvents, getAllowedStatuses, getAllowedPositions } from './rzToastDefaults.js';

// The toast facade (`Rizzy.toast`) is part of the eager bundle; the toast runtime (manager,
// renderer, normalization, about 7 KB gzipped) is loaded on first use, or when the browser is idle
// on a page that renders an RzToastProvider (RZUI-056). Calls made before it has loaded are queued
// and run in order once it has, and they return a handle with the same id the toast will get.
// `Rizzy.toast.ready()` resolves when the runtime has loaded; after that every call is synchronous.

const providerSelector = '[data-rz-toast-provider]';
const defaultConfig = {};
const pendingEvents = [];
const seenEvents = new WeakSet();
// Id a queued call returned → id the toast actually got (a duplicate merged into an existing toast).
const mergedIds = new Map();

let manager = null;
let loading = null;

function createId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }

    return `rz-toast-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function hasStatusValue(options) {
    return Object.prototype.hasOwnProperty.call(options, 'status') && String(options.status ?? '').trim() !== '';
}

function resolveId(id) {
    if (id === undefined || id === null) {
        return id;
    }

    const key = String(id);
    return mergedIds.get(key) ?? key;
}

function onInputEvent(event) {
    if (seenEvents.has(event)) {
        return;
    }

    seenEvents.add(event);
    pendingEvents.push(event);
    load().catch(() => {});
}

function setInputListeners(add) {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        return;
    }

    toastInputEvents.forEach(name => {
        const method = add ? 'addEventListener' : 'removeEventListener';
        [window, document].forEach(target => {
            if (typeof target[method] === 'function') {
                target[method](name, onInputEvent);
            }
        });
    });
}

function load() {
    if (!loading) {
        loading = import('./rzToastManager.js')
            .then(module => {
                manager = module.toastManager;
                setInputListeners(false);
                // The manager listens from now on; hand it the events that arrived while loading.
                pendingEvents.splice(0).forEach(event => manager.handleInputEvent(event));
                return manager;
            })
            .catch(error => {
                // Retried by the next call (as lazy component bundles are, RZUI-031).
                loading = null;
                console.error('[RizzyUI] The toast runtime failed to load; toasts were not shown.', error);
                throw error;
            });
    }

    return loading;
}

function whenLoaded(action) {
    load().then(action).catch(() => {});
}

function handleFor(id) {
    return {
        id,
        update: options => Toast.update(id, options),
        dismiss: () => Toast.dismiss(id),
    };
}

function show(options = {}) {
    const request = {
        ...defaultConfig,
        ...options,
    };

    if (!hasStatusValue(options)) {
        request.status = 'default';
    }

    if (manager) {
        return manager.show(request);
    }

    const id = String(request.id || createId());
    request.id = id;
    whenLoaded(loaded => {
        const handle = loaded.show(request);
        if (handle && handle.id !== id) {
            mergedIds.set(id, handle.id);
        }
    });
    return handleFor(id);
}

function preloadWhenAProviderIsPresent() {
    if (typeof document === 'undefined' || typeof window === 'undefined') {
        return;
    }

    const check = () => {
        if (!manager && document.querySelector(providerSelector)) {
            load().catch(() => {});
        }
    };
    const schedule = () => (typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback(check, { timeout: 2000 })
        : window.setTimeout(check, 200));

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', schedule, { once: true });
    } else {
        schedule();
    }
}

const Toast = {
    show,

    custom(options = {}) {
        return show(options);
    },

    success(text, title = 'Success', options = {}) {
        return show({
            status: 'success',
            title,
            text,
            ...options,
        });
    },

    error(text, title = 'Error', options = {}) {
        return show({
            status: 'error',
            title,
            text,
            ...options,
        });
    },

    warning(text, title = 'Warning', options = {}) {
        return show({
            status: 'warning',
            title,
            text,
            ...options,
        });
    },

    info(text, title = 'Info', options = {}) {
        return show({
            status: 'info',
            title,
            text,
            ...options,
        });
    },

    loading(text, title = 'Loading', options = {}) {
        return show({
            status: 'loading',
            title,
            text,
            autoclose: false,
            progress: false,
            ...options,
        });
    },

    /** Returns the toast's handle; while the runtime is loading, the call is queued. */
    update(id, options = {}) {
        if (manager) {
            return manager.update(resolveId(id), options);
        }

        whenLoaded(loaded => loaded.update(resolveId(id), options));
        return handleFor(id);
    },

    /** Returns whether a toast was dismissed; `undefined` while the runtime is loading (queued). */
    dismiss(id) {
        if (manager) {
            return manager.dismiss(resolveId(id));
        }

        whenLoaded(loaded => loaded.dismiss(resolveId(id)));
        return undefined;
    },

    clear() {
        if (manager) {
            return manager.clear();
        }

        whenLoaded(loaded => loaded.clear());
        return undefined;
    },

    /** Returns the toast manager once the runtime has loaded; this facade while it is loading. */
    configure(providerOrConfig) {
        if (manager) {
            return manager.configure(providerOrConfig);
        }

        whenLoaded(loaded => loaded.configure(providerOrConfig));
        return Toast;
    },

    registerProvider(providerElement) {
        if (manager) {
            return manager.registerProvider(providerElement);
        }

        whenLoaded(loaded => loaded.registerProvider(providerElement));
        return Toast;
    },

    setDefaults(newDefaults = {}) {
        Object.assign(defaultConfig, newDefaults);
    },

    /** Resolves with this facade once the toast runtime has loaded. */
    ready() {
        return load().then(() => Toast);
    },

    get allowedStatuses() {
        return getAllowedStatuses(manager?.config);
    },

    get allowedPositions() {
        return getAllowedPositions(manager?.config);
    },
};

setInputListeners(true);
preloadWhenAProviderIsPresent();

export default Toast;

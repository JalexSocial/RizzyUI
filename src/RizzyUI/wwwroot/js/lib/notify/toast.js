import { toastManager } from './rzToastManager.js';
import { getAllowedPositions, getAllowedStatuses } from './rzToastNormalize.js';

const defaultConfig = {};

function hasStatusValue(options) {
    return Object.prototype.hasOwnProperty.call(options, 'status') && String(options.status ?? '').trim() !== '';
}

function show(options = {}) {
    const request = {
        ...defaultConfig,
        ...options,
    };

    if (!hasStatusValue(options)) {
        request.status = 'default';
    }

    return toastManager.show(request);
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

    update(id, options = {}) {
        return toastManager.update(id, options);
    },

    dismiss(id) {
        return toastManager.dismiss(id);
    },

    clear() {
        return toastManager.clear();
    },

    configure(providerOrConfig) {
        return toastManager.configure(providerOrConfig);
    },

    registerProvider(providerElement) {
        return toastManager.registerProvider(providerElement);
    },

    setDefaults(newDefaults = {}) {
        Object.assign(defaultConfig, newDefaults);
    },

    get allowedStatuses() {
        return getAllowedStatuses(toastManager.config);
    },

    get allowedPositions() {
        return getAllowedPositions(toastManager.config);
    },
};

export default Toast;

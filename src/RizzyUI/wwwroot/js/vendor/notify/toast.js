import Notify from 'simple-notify'

// Valid statuses and positions
const allowedStatuses = ['success', 'error', 'warning', 'info'];
const allowedPositions = [
    'right top', 'right bottom',
    'left top', 'left bottom',
    'center top', 'center bottom'
];

// Default configuration
const defaultConfig = {
    status: 'info',
    title: 'Notification',
    text: '',
    effect: 'fade',
    speed: 300,
    autoclose: true,
    autotimeout: 4000,
    position: 'right top',
};

// Internal handler for all toasts
function renderToast(options = {}) {
    const config = {
        ...defaultConfig,
        ...options,
    };

    if (!allowedStatuses.includes(config.status)) {
        console.warn(`Invalid status '${config.status}' passed to Toast. Defaulting to 'info'.`);
        config.status = 'info';
    }

    if (!allowedPositions.includes(config.position)) {
        console.warn(`Invalid position '${config.position}' passed to Toast. Defaulting to 'right top'.`);
        config.position = 'right top';
    }

    new Notify(config);
}

// Toast API
const Toast = {
    custom: renderToast,

    success(text, title = 'Success', options = {}) {
        renderToast({
            status: 'success',
            title,
            text,
            ...options
        });
    },

    error(text, title = 'Error', options = {}) {
        renderToast({
            status: 'error',
            title,
            text,
            ...options
        });
    },

    warning(text, title = 'Warning', options = {}) {
        renderToast({
            status: 'warning',
            title,
            text,
            ...options
        });
    },

    info(text, title = 'Info', options = {}) {
        renderToast({
            status: 'info',
            title,
            text,
            ...options
        });
    },

    setDefaults(newDefaults = {}) {
        Object.assign(defaultConfig, newDefaults);
    },

    get allowedStatuses() {
        return [...allowedStatuses];
    },

    get allowedPositions() {
        return [...allowedPositions];
    }
};

export default Toast;
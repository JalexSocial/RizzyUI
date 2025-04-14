import Notify from 'simple-notify'

// Valid statuses and positions
const allowedStatuses = ['success', 'error', 'warning', 'info'];
const allowedPositions = [
    // Standard Corners
    'right top',
    'top right', 
    'right bottom',
    'bottom right', 
    'left top',
    'top left', 
    'left bottom',
    'bottom left', 

    // Centered Horizontally
    'center top',
    'x-center top', 
    'center bottom',
    'x-center bottom', 

    // Centered Vertically
    'left center',
    'left y-center', 
    'y-center left', 
    'right center',
    'right y-center', 
    'y-center right', 

    // Aliases for Centered Horizontally (already covered but good for robustness)
    'top center',
    'top x-center',
    'bottom center',
    'bottom x-center',

    // Absolute Center
    'center'
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
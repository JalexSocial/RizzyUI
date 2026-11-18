// Small constants the eager toast facade (toast.js) needs before the toast runtime loads.
// Everything else in the toast system is loaded on first use.

export const toastInputEvents = ['rz:toast', 'rz:toast:show', 'rz:toast:update', 'rz:toast:dismiss', 'rz:toast:clear', 'rz:toast:batch'];

export const fallbackStatuses = ['default', 'info', 'success', 'warning', 'error', 'loading'];
export const fallbackPositions = [
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
    'center',
    'left-center',
    'right-center',
];

const fallbackAliases = {
    statuses: {
        destructive: 'error',
    },
    positions: {
        'right top': 'top-right',
        'top right': 'top-right',
        'left top': 'top-left',
        'top left': 'top-left',
        'right bottom': 'bottom-right',
        'bottom right': 'bottom-right',
        'left bottom': 'bottom-left',
        'bottom left': 'bottom-left',
        'top center': 'top-center',
        'center top': 'top-center',
        'x-center top': 'top-center',
        'top x-center': 'top-center',
        'bottom center': 'bottom-center',
        'center bottom': 'bottom-center',
        'x-center bottom': 'bottom-center',
        'bottom x-center': 'bottom-center',
        center: 'center',
        'left center': 'left-center',
        'left y-center': 'left-center',
        'y-center left': 'left-center',
        'right center': 'right-center',
        'right y-center': 'right-center',
        'y-center right': 'right-center',
    },
    types: {
        filled: 'solid',
        outline: 'outline',
    },
    effects: {
        fade: 'fade',
        slide: 'slide',
    },
};

export function getAliasMap(config, name) {
    return {
        ...(fallbackAliases[name] || {}),
        ...((config && config.aliases && config.aliases[name]) || {}),
    };
}

export function getAllowedStatuses(config = {}) {
    const statuses = Object.keys(config.statuses || {});
    return statuses.length ? statuses : [...fallbackStatuses];
}

export function getAllowedPositions(config = {}) {
    const aliases = Object.keys(getAliasMap(config, 'positions'));
    return [...new Set([...fallbackPositions, ...aliases])];
}

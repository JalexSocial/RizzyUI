import { fallbackStatuses, fallbackPositions, getAliasMap, getAllowedStatuses, getAllowedPositions } from './rzToastDefaults.js';

const fallbackTones = ['subtle', 'solid', 'outline', 'ghost'];
const fallbackAnimations = ['fade', 'slide', 'none'];


const roleMap = {
    default: { role: 'status', ariaLive: 'polite' },
    info: { role: 'status', ariaLive: 'polite' },
    success: { role: 'status', ariaLive: 'polite' },
    warning: { role: 'status', ariaLive: 'polite' },
    error: { role: 'alert', ariaLive: 'assertive' },
    loading: { role: 'status', ariaLive: 'polite' },
};

function normalizeKey(value) {
    return typeof value === 'string' ? value.trim().toLowerCase() : '';
}


function canonicalize(value, allowed, aliases, fallback, kind) {
    const raw = normalizeKey(value);
    const canonical = aliases[raw] || raw;

    if (allowed.includes(canonical)) {
        return canonical;
    }

    if (raw) {
        console.warn(`[RizzyUI] Invalid toast ${kind} '${value}'. Defaulting to '${fallback}'.`);
    }

    return fallback;
}

function toBoolean(value, fallback) {
    return typeof value === 'boolean' ? value : fallback;
}

function toPositiveNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) && number >= 0 ? number : fallback;
}

function normalizeClassNames(options) {
    const classNames = { ...(options.classNames || {}) };
    const rootClass = options.customClass ?? options.className;

    if (rootClass) {
        classNames.toast = rootClass;
    }

    return classNames;
}

function isElement(value) {
    return typeof HTMLElement !== 'undefined' && value instanceof HTMLElement;
}

export function normalizeToastOptions(options = {}, config = {}, defaultsOverride = {}) {
    const defaults = {
        status: 'info',
        position: 'top-right',
        tone: 'subtle',
        animation: 'fade',
        duration: 4000,
        speed: 300,
        dismissible: true,
        showIcon: true,
        pauseOnHover: true,
        pauseOnFocus: true,
        pauseOnWindowBlur: false,
        closeOnEscape: true,
        preventDuplicates: false,
        progress: true,
        maxVisible: 5,
        newestOnTop: true,
        overflowStrategy: 'dismiss-oldest',
        closeButtonAriaLabel: 'Dismiss notification',
        ...(config.defaults || {}),
        ...defaultsOverride,
    };

    const statusSource = options.status ?? options.variant ?? defaults.status;
    const toneSource = options.tone ?? options.type ?? defaults.tone;
    const animationSource = options.animation ?? options.effect ?? defaults.animation;
    const durationSource = options.duration ?? options.autotimeout ?? defaults.duration;
    const statusKeys = Object.keys(config.statuses || {});
    const positionKeys = Object.keys(config.positions || {});
    const toneKeys = Object.keys(config.tones || {});
    const animationKeys = Object.keys(config.animations || {});
    const allowedStatuses = statusKeys.length ? statusKeys : fallbackStatuses;
    const allowedPositions = positionKeys.length ? positionKeys : fallbackPositions;
    const allowedTones = toneKeys.length ? toneKeys : fallbackTones;
    const allowedAnimations = animationKeys.length ? animationKeys : fallbackAnimations;
    const status = canonicalize(statusSource, allowedStatuses, getAliasMap(config, 'statuses'), defaults.status || 'info', 'status');
    const position = canonicalize(options.position ?? defaults.position, allowedPositions, getAliasMap(config, 'positions'), defaults.position || 'top-right', 'position');
    const tone = canonicalize(toneSource, allowedTones, getAliasMap(config, 'types'), defaults.tone || 'subtle', 'tone');
    const animation = canonicalize(animationSource, allowedAnimations, getAliasMap(config, 'effects'), defaults.animation || 'fade', 'animation');
    const text = options.text ?? options.message ?? options.description ?? '';
    const autoclose = options.autoclose ?? (status === 'loading' ? false : undefined);
    const normalizedAutoclose = typeof autoclose === 'boolean' ? autoclose : toPositiveNumber(durationSource, defaults.duration) > 0;
    const progress = options.progress ?? (status === 'loading' ? false : defaults.progress);
    const roleDefaults = roleMap[status] || roleMap.info;
    const duration = toPositiveNumber(durationSource, defaults.duration);

    return {
        id: options.id ? String(options.id) : undefined,
        status,
        tone,
        animation,
        title: options.title ?? '',
        text,
        html: isElement(options.html) ? options.html : undefined,
        showIcon: options.icon === false ? false : toBoolean(options.showIcon, defaults.showIcon),
        icon: options.icon,
        customIcon: isElement(options.customIcon) ? options.customIcon : undefined,
        dismissible: toBoolean(options.dismissible ?? options.showCloseButton, defaults.dismissible),
        classNames: normalizeClassNames(options),
        speed: toPositiveNumber(options.speed, defaults.speed),
        autoclose: normalizedAutoclose,
        duration,
        position,
        action: options.action && typeof options.action === 'object' ? options.action : undefined,
        pauseOnHover: toBoolean(options.pauseOnHover, defaults.pauseOnHover),
        pauseOnFocus: toBoolean(options.pauseOnFocus, defaults.pauseOnFocus),
        pauseOnWindowBlur: toBoolean(options.pauseOnWindowBlur, defaults.pauseOnWindowBlur),
        progress: Boolean(progress) && normalizedAutoclose && duration > 0 && (status !== 'loading' || options.progress === true),
        role: options.role || roleDefaults.role,
        ariaLive: options.ariaLive || roleDefaults.ariaLive,
        dedupeKey: options.dedupeKey ? String(options.dedupeKey) : undefined,
        incrementCount: Boolean(options.incrementCount),
        data: options.data,
        closeOnEscape: toBoolean(options.closeOnEscape, defaults.closeOnEscape),
        preventDuplicates: toBoolean(options.preventDuplicates, defaults.preventDuplicates),
        maxVisible: toPositiveNumber(options.maxVisible, defaults.maxVisible),
        newestOnTop: toBoolean(options.newestOnTop, defaults.newestOnTop),
        overflowStrategy: options.overflowStrategy || defaults.overflowStrategy || 'dismiss-oldest',
        closeButtonAriaLabel: defaults.closeButtonAriaLabel || 'Dismiss notification',
    };
}

export { getAllowedStatuses, getAllowedPositions };

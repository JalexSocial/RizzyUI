import { normalizeToastOptions } from './rzToastNormalize.js';
import { applyToastClasses, createToastDom, updateToastDom } from './rzToastRenderer.js';

const providerSelector = '[data-rz-toast-provider]';
const configSelector = '[data-rz-toast-config]';
const stackSelector = '[data-rz-toast-stack][data-toast-position]';
const inputEvents = ['rz:toast', 'rz:toast:show', 'rz:toast:update', 'rz:toast:dismiss', 'rz:toast:clear', 'rz:toast:batch'];

function createId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }

    return `rz-toast-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function isDevelopment() {
    return typeof process === 'undefined' || process.env?.NODE_ENV !== 'production';
}

function isElement(value) {
    return typeof HTMLElement !== 'undefined' && value instanceof HTMLElement;
}

function scheduleFrame(callback) {
    if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(callback);
        return;
    }

    window.setTimeout(callback, 0);
}

function forceLayout(element) {
    if (!element) {
        return;
    }

    if (typeof element.getBoundingClientRect === 'function') {
        element.getBoundingClientRect();
        return;
    }

    void element.offsetHeight;
}

function getElementTop(element) {
    return typeof element.getBoundingClientRect === 'function' ? element.getBoundingClientRect().top : 0;
}

function getStackItems(stack) {
    return Array.from(stack.children || []).filter(child => child.hasAttribute?.('data-rz-toast-item'));
}

function getLifecycleDetail(toast, reason) {
    const detail = {
        id: toast.id,
        status: toast.options.status,
        reason,
    };

    if (toast.count > 1) {
        detail.count = toast.count;
    }

    if (toast.options.data !== undefined) {
        detail.data = toast.options.data;
    }

    return detail;
}

export class RzToastManager {
    constructor() {
        this.provider = null;
        this.config = {};
        this.defaults = {};
        this.stacks = new Map();
        this.toasts = new Map();
        this.dedupeIndex = new Map();
        this.initialized = false;
        this.warnedNoProvider = false;
        this.warnedMultipleProviders = false;
        this.boundWindowBlur = this.pauseWindowTimers.bind(this);
        this.boundWindowFocus = this.resumeWindowTimers.bind(this);
        this.seenInputEvents = new WeakSet();
        this.nextSequence = 0;
        this.installInputEventListeners();
    }

    configure(providerOrConfig) {
        if (providerOrConfig === undefined) {
            return this;
        }

        if (isElement(providerOrConfig)) {
            return this.registerProvider(providerOrConfig);
        }

        this.config = providerOrConfig || {};
        this.defaults = { ...(this.config.defaults || {}) };
        this.initialized = true;
        return this;
    }

    registerProvider(providerElement) {
        if (!isElement(providerElement)) {
            return this;
        }

        const configElement = providerElement.querySelector(configSelector);
        const config = this.parseConfig(configElement);
        this.provider = providerElement;
        this.config = config;
        this.defaults = { ...(config.defaults || {}) };
        this.stacks.clear();

        providerElement.querySelectorAll(stackSelector).forEach(stack => {
            this.stacks.set(stack.dataset.toastPosition, stack);
        });

        window.removeEventListener('blur', this.boundWindowBlur);
        window.removeEventListener('focus', this.boundWindowFocus);
        window.addEventListener('blur', this.boundWindowBlur);
        window.addEventListener('focus', this.boundWindowFocus);
        this.initialized = true;
        return this;
    }

    show(options = {}) {
        if (!this.ensureProvider()) {
            return null;
        }

        const normalized = normalizeToastOptions(options, this.config, this.defaults);
        const existing = this.findExisting(normalized);
        if (existing) {
            return this.update(existing.id, normalized);
        }

        const stack = this.getStackForPosition(normalized.position);
        if (!stack) {
            console.warn(`[RizzyUI] Toast stack '${normalized.position}' was not found.`);
            return null;
        }

        if (!this.enforceMaxVisible(normalized.position, normalized)) {
            this.dispatchLifecycle('rz:toast:dismissed', {
                id: normalized.id || '',
                status: normalized.status,
                reason: 'ignore-newest',
                data: normalized.data,
            });
            return null;
        }

        const toast = this.createRecord(normalized);
        const element = createToastDom(toast, this.config);
        const previousStackPositions = this.captureStackPositions(stack);
        this.bindToastEvents(toast);
        this.insertToast(stack, element, normalized.newestOnTop);
        this.animateStackShift(stack, previousStackPositions, element, normalized.speed);
        forceLayout(element);
        this.toasts.set(toast.id, toast);
        if (toast.dedupeKey) {
            this.dedupeIndex.set(toast.dedupeKey, toast.id);
        }

        scheduleFrame(() => {
            toast.state = 'visible';
            applyToastClasses(element, toast, this.config);
            this.startTimer(toast);
            this.startProgress(toast);
            this.dispatchLifecycle('rz:toast:shown', getLifecycleDetail(toast));
        });

        return this.createHandle(toast.id);
    }

    update(id, options = {}) {
        const toast = this.toasts.get(String(id));
        if (!toast) {
            return null;
        }

        this.clearTimer(toast);
        const previousDedupeKey = toast.dedupeKey;
        const normalized = normalizeToastOptions({ ...toast.options, ...options, id: toast.id }, this.config, this.defaults);
        toast.options = normalized;
        toast.dedupeKey = normalized.dedupeKey || (normalized.preventDuplicates ? this.createDedupeKey(normalized) : undefined);
        toast.count = normalized.incrementCount ? toast.count + 1 : toast.count;
        toast.remaining = normalized.duration;
        toast.startedAt = 0;
        toast.paused = false;

        updateToastDom(toast, this.config);
        this.bindToastEvents(toast);
        this.moveToastIfNeeded(toast);

        if (previousDedupeKey && previousDedupeKey !== toast.dedupeKey) {
            this.dedupeIndex.delete(previousDedupeKey);
        }

        if (toast.dedupeKey) {
            this.dedupeIndex.set(toast.dedupeKey, toast.id);
        }

        this.startTimer(toast);
        this.startProgress(toast);
        this.dispatchLifecycle('rz:toast:updated', getLifecycleDetail(toast));
        return this.createHandle(toast.id);
    }

    dismiss(id, reason = 'api') {
        const toast = id ? this.toasts.get(String(id)) : this.getMostRecent();
        if (!toast || toast.dismissed) {
            return false;
        }

        toast.dismissed = true;
        toast.state = 'leaving';
        this.clearTimer(toast);

        if (toast.elements?.root) {
            if (toast.elements.root.contains(document.activeElement) && typeof document.activeElement.blur === 'function') {
                document.activeElement.blur();
            }

            applyToastClasses(toast.elements.root, toast, this.config);
        }

        window.setTimeout(() => this.removeToast(toast, reason), toast.options.speed);
        return true;
    }

    clear() {
        const toasts = Array.from(this.toasts.values());
        toasts.forEach(toast => {
            toast.dismissed = true;
            this.removeToast(toast, 'clear');
        });
        this.dispatchLifecycle('rz:toast:cleared', { ids: toasts.map(toast => toast.id), reason: 'clear' });
    }

    get(id) {
        return this.toasts.get(String(id));
    }

    getAll() {
        return Array.from(this.toasts.values());
    }

    parseConfig(configElement) {
        if (!configElement) {
            return {};
        }

        try {
            return JSON.parse(configElement.textContent || '{}');
        } catch (error) {
            console.warn('[RizzyUI] Failed to parse toast provider configuration.', error);
            return {};
        }
    }

    ensureProvider() {
        if (this.initialized && this.provider) {
            return true;
        }

        if (typeof document === 'undefined') {
            return false;
        }

        const providers = Array.from(document.querySelectorAll(providerSelector));
        if (!providers.length) {
            if (!this.warnedNoProvider) {
                console.warn('[RizzyUI] No RzToastProvider found. Add <RzToastProvider /> to the root layout before showing toasts.');
                this.warnedNoProvider = true;
            }
            return false;
        }

        if (providers.length > 1 && isDevelopment() && !this.warnedMultipleProviders) {
            console.warn('[RizzyUI] Multiple RzToastProvider elements found. The first provider will be used.');
            this.warnedMultipleProviders = true;
        }

        this.registerProvider(providers[0]);
        return true;
    }

    createRecord(options) {
        const id = options.id || createId();
        const dedupeKey = options.dedupeKey || (options.preventDuplicates ? this.createDedupeKey({ ...options, id }) : undefined);

        return {
            id,
            dedupeKey,
            options: { ...options, id },
            state: 'entering',
            createdAt: Date.now(),
            sequence: ++this.nextSequence,
            count: 1,
            remaining: options.duration,
            startedAt: 0,
            timerId: null,
            paused: false,
            dismissed: false,
            elements: null,
        };
    }

    findExisting(options) {
        if (options.id && this.toasts.has(options.id)) {
            return this.toasts.get(options.id);
        }

        const dedupeKey = options.dedupeKey || (options.preventDuplicates ? this.createDedupeKey(options) : undefined);
        return dedupeKey && this.dedupeIndex.has(dedupeKey) ? this.toasts.get(this.dedupeIndex.get(dedupeKey)) : null;
    }

    createDedupeKey(options) {
        return [options.status, options.title, options.text, options.position].join('|');
    }

    enforceMaxVisible(position, options) {
        const visible = Array.from(this.toasts.values()).filter(toast => toast.options.position === position && !toast.dismissed);
        if (!options.maxVisible || visible.length < options.maxVisible) {
            return true;
        }

        if (options.overflowStrategy === 'ignore-newest') {
            return false;
        }

        const oldest = visible.sort((a, b) => a.createdAt - b.createdAt)[0];
        if (oldest) {
            this.dismiss(oldest.id, 'viewport-limit');
        }

        return true;
    }

    insertToast(stack, element, newestOnTop) {
        if (newestOnTop && stack.firstChild) {
            stack.insertBefore(element, stack.firstChild);
            return;
        }

        stack.appendChild(element);
    }

    captureStackPositions(stack) {
        const positions = new Map();
        getStackItems(stack).forEach(item => positions.set(item, getElementTop(item)));
        return positions;
    }

    animateStackShift(stack, previousPositions, insertedElement, speed) {
        if (!previousPositions?.size) {
            return;
        }

        getStackItems(stack).forEach(item => {
            if (item === insertedElement || !previousPositions.has(item)) {
                return;
            }

            const delta = previousPositions.get(item) - getElementTop(item);
            if (!delta) {
                return;
            }

            item.style.transition = 'none';
            item.style.transform = `translate3d(0, ${delta}px, 0)`;
            forceLayout(item);
            scheduleFrame(() => {
                item.style.transition = `transform ${speed}ms cubic-bezier(0.22, 1, 0.36, 1)`;
                item.style.transform = '';
            });
            window.setTimeout(() => {
                if (item.style.transition?.includes('cubic-bezier(0.22, 1, 0.36, 1)')) {
                    item.style.transition = '';
                }

                if (item.style.transform?.startsWith('translate3d(0,')) {
                    item.style.transform = '';
                }
            }, speed);
        });
    }

    getStackForPosition(position) {
        const stack = this.stacks.get(position);
        if (stack) {
            return stack;
        }

        const fallback = this.stacks.get('top-right');
        if (fallback) {
            console.warn(`[RizzyUI] Toast stack '${position}' was not found. Falling back to 'top-right'.`);
            return fallback;
        }

        return null;
    }

    moveToastIfNeeded(toast) {
        const stack = this.getStackForPosition(toast.options.position);
        const element = toast.elements?.root;
        if (!stack || !element || element.parentElement === stack) {
            return;
        }

        const previousStackPositions = this.captureStackPositions(stack);
        this.insertToast(stack, element, toast.options.newestOnTop);
        this.animateStackShift(stack, previousStackPositions, element, toast.options.speed);
    }

    bindToastEvents(toast) {
        const element = toast.elements?.root;
        if (!element) {
            return;
        }

        const closeButton = element.querySelector('[data-slot="toast-close-button"]');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.dismiss(toast.id, 'close-button'));
        }

        const actionButton = element.querySelector('[data-slot="toast-action-button"]');
        if (actionButton) {
            actionButton.addEventListener('click', () => this.invokeAction(toast));
        }

        if (toast.options.pauseOnHover) {
            element.addEventListener('mouseenter', () => this.pauseTimer(toast));
            element.addEventListener('mouseleave', () => this.resumeTimer(toast));
        }

        if (toast.options.pauseOnFocus) {
            element.addEventListener('focusin', () => this.pauseTimer(toast));
            element.addEventListener('focusout', () => this.resumeTimer(toast));
        }

        element.addEventListener('keydown', event => {
            if (event.key === 'Escape' && toast.options.closeOnEscape && element.contains(document.activeElement)) {
                event.stopPropagation();
                this.dismiss(toast.id, 'escape');
            }
        });
    }

    invokeAction(toast) {
        const action = toast.options.action;
        const dismissOnClick = action.dismissOnClick !== false;

        try {
            if (typeof action.onClick === 'function') {
                action.onClick(this.createHandle(toast.id));
            } else if (typeof action.eventName === 'string' && action.eventName.trim()) {
                window.dispatchEvent(new CustomEvent(action.eventName, {
                    detail: action.detail ?? {
                        id: toast.id,
                        status: toast.options.status,
                        data: toast.options.data,
                    },
                }));
            }
        } catch (error) {
            console.error('[RizzyUI] Toast action failed.', error);
        }

        if (dismissOnClick) {
            this.dismiss(toast.id, 'api');
        }
    }

    startTimer(toast) {
        if (!toast.options.autoclose || toast.remaining <= 0 || toast.dismissed) {
            return;
        }

        toast.startedAt = Date.now();
        toast.timerId = window.setTimeout(() => this.dismiss(toast.id, 'timeout'), toast.remaining);
    }

    clearTimer(toast) {
        if (toast.timerId) {
            window.clearTimeout(toast.timerId);
            toast.timerId = null;
        }
    }

    pauseTimer(toast) {
        if (!toast.timerId || toast.paused) {
            return;
        }

        const elapsed = Date.now() - toast.startedAt;
        toast.remaining = Math.max(0, toast.remaining - elapsed);
        toast.paused = true;
        this.clearTimer(toast);
        this.pauseProgress(toast);
    }

    resumeTimer(toast) {
        if (!toast.paused || toast.dismissed) {
            return;
        }

        toast.paused = false;
        this.startTimer(toast);
        this.startProgress(toast);
    }

    pauseWindowTimers() {
        this.toasts.forEach(toast => {
            if (toast.options.pauseOnWindowBlur) {
                this.pauseTimer(toast);
            }
        });
    }

    resumeWindowTimers() {
        this.toasts.forEach(toast => {
            if (toast.options.pauseOnWindowBlur) {
                this.resumeTimer(toast);
            }
        });
    }

    startProgress(toast) {
        const indicator = toast.elements?.root?.querySelector('[data-slot="toast-progress-indicator"]');
        if (!indicator || !toast.options.progress || toast.paused) {
            return;
        }

        indicator.style.transitionDuration = `${toast.remaining}ms`;
        scheduleFrame(() => {
            indicator.style.transform = 'scaleX(0)';
        });
    }

    pauseProgress(toast) {
        const indicator = toast.elements?.root?.querySelector('[data-slot="toast-progress-indicator"]');
        if (!indicator) {
            return;
        }

        const computed = window.getComputedStyle(indicator).transform;
        indicator.style.transitionDuration = '0ms';
        indicator.style.transform = computed === 'none' ? 'scaleX(1)' : computed;
    }

    removeToast(toast, reason, animateRemoval = reason !== 'clear') {
        this.clearTimer(toast);

        const root = toast.elements?.root;
        const stack = root?.parentElement;
        const previousStackPositions = animateRemoval && stack ? this.captureStackPositions(stack) : null;

        if (root && stack) {
            stack.removeChild(root);

            if (previousStackPositions) {
                this.animateStackShift(stack, previousStackPositions, null, toast.options.speed);
            }
        }

        this.toasts.delete(toast.id);
        if (toast.dedupeKey) {
            this.dedupeIndex.delete(toast.dedupeKey);
        }

        this.dispatchLifecycle('rz:toast:dismissed', getLifecycleDetail(toast, reason));
    }

    getMostRecent() {
        return Array.from(this.toasts.values()).sort((a, b) => (b.createdAt - a.createdAt) || (b.sequence - a.sequence))[0];
    }

    createHandle(id) {
        return {
            id,
            update: options => this.update(id, options),
            dismiss: () => this.dismiss(id),
        };
    }

    dispatchLifecycle(name, detail) {
        window.dispatchEvent(new CustomEvent(name, { detail }));
    }


    processBatch(detail) {
        const commands = detail?.commands;
        if (!Array.isArray(commands)) {
            return;
        }

        commands.forEach(command => {
            if (!command || typeof command !== 'object') {
                return;
            }

            switch (command.type) {
                case 'show':
                    this.show(command.options || {});
                    break;
                case 'update':
                    if (command.id) {
                        this.update(command.id, command.options || {});
                    }
                    break;
                case 'dismiss':
                    this.dismiss(command.id, 'api');
                    break;
                case 'clear':
                    this.clear();
                    break;
                default:
                    console.warn(`[RizzyUI] Unsupported toast batch command '${command.type}'.`);
                    break;
            }
        });
    }

    installInputEventListeners() {
        if (typeof window === 'undefined' || typeof document === 'undefined') {
            return;
        }

        const listener = event => {
            if (this.seenInputEvents.has(event)) {
                return;
            }

            this.seenInputEvents.add(event);
            const detail = event.detail || {};

            if (event.type === 'rz:toast' || event.type === 'rz:toast:show') {
                this.show(detail);
            } else if (event.type === 'rz:toast:update') {
                this.update(detail.id, detail.options || detail);
            } else if (event.type === 'rz:toast:dismiss') {
                this.dismiss(detail.id, 'api');
            } else if (event.type === 'rz:toast:clear') {
                this.clear();
            } else if (event.type === 'rz:toast:batch') {
                this.processBatch(detail);
            }
        };

        inputEvents.forEach(name => {
            window.addEventListener(name, listener);
            document.addEventListener(name, listener);
        });
    }
}

export const toastManager = new RzToastManager();

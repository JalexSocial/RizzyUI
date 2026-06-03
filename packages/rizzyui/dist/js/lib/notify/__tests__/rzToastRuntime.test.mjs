import assert from 'node:assert/strict';
import test from 'node:test';
import Toast from '../toast.js';
import { RzToastManager } from '../rzToastManager.js';
import { normalizeToastOptions } from '../rzToastNormalize.js';
import { createToastDom } from '../rzToastRenderer.js';

const positions = [
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

const positionAliases = {
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
};

class FakeEvent {
    constructor(type, options = {}) {
        this.type = type;
        this.detail = options.detail;
        this.key = options.key;
        this.defaultPrevented = false;
        this.propagationStopped = false;
    }

    stopPropagation() {
        this.propagationStopped = true;
    }
}

class FakeElement {
    constructor(tagName, ownerDocument) {
        this.tagName = tagName.toUpperCase();
        this.ownerDocument = ownerDocument;
        this.parentElement = null;
        this.children = [];
        this.attributes = new Map();
        this.listeners = new Map();
        this.style = {};
        this.textContent = '';
        this.className = '';
        this._dataset = {};
        this.dataset = new Proxy(this._dataset, {
            set: (target, property, value) => {
                target[property] = String(value);
                this.attributes.set(`data-${toKebabCase(property)}`, String(value));
                return true;
            },
            get: (target, property) => target[property],
        });
    }

    get firstChild() {
        return this.children[0] || null;
    }

    get firstElementChild() {
        return this.firstChild;
    }

    get id() {
        return this.getAttribute('id') || '';
    }

    set id(value) {
        this.setAttribute('id', value);
    }

    get type() {
        return this.getAttribute('type') || '';
    }

    set type(value) {
        this.setAttribute('type', value);
    }

    get classList() {
        return this.className.split(/\s+/).filter(Boolean);
    }

    setAttribute(name, value) {
        this.attributes.set(name, String(value));
        if (name === 'class') {
            this.className = String(value);
        }

        if (name === 'id') {
            this.attributes.set('id', String(value));
        }

        if (name.startsWith('data-')) {
            this._dataset[toCamelCase(name.slice(5))] = String(value);
        }
    }

    getAttribute(name) {
        if (name === 'class') {
            return this.className || null;
        }

        return this.attributes.get(name) ?? null;
    }

    hasAttribute(name) {
        return this.attributes.has(name);
    }

    removeAttribute(name) {
        this.attributes.delete(name);
        if (name === 'class') {
            this.className = '';
        }
    }

    appendChild(child) {
        if (child.parentElement) {
            child.parentElement.removeChild(child);
        }

        child.parentElement = this;
        this.children.push(child);
        return child;
    }

    append(child) {
        return this.appendChild(child);
    }

    insertBefore(child, before) {
        if (child.parentElement) {
            child.parentElement.removeChild(child);
        }

        child.parentElement = this;
        const index = this.children.indexOf(before);
        if (index === -1) {
            this.children.push(child);
        } else {
            this.children.splice(index, 0, child);
        }

        return child;
    }

    replaceChild(newChild, oldChild) {
        const index = this.children.indexOf(oldChild);
        if (index === -1) {
            return oldChild;
        }

        if (newChild.parentElement) {
            newChild.parentElement.removeChild(newChild);
        }

        oldChild.parentElement = null;
        newChild.parentElement = this;
        this.children[index] = newChild;
        return oldChild;
    }

    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index !== -1) {
            this.children.splice(index, 1);
            child.parentElement = null;
        }

        return child;
    }

    contains(node) {
        return node === this || this.children.some(child => child.contains(node));
    }

    cloneNode(deep = false) {
        const clone = new FakeElement(this.tagName, this.ownerDocument);
        clone.className = this.className;
        clone.textContent = this.textContent;
        for (const [name, value] of this.attributes) {
            clone.setAttribute(name, value);
        }

        if (deep) {
            this.children.forEach(child => clone.appendChild(child.cloneNode(true)));
        }

        return clone;
    }

    addEventListener(type, listener) {
        const listeners = this.listeners.get(type) || [];
        listeners.push(listener);
        this.listeners.set(type, listeners);
    }

    dispatchEvent(event) {
        for (const listener of this.listeners.get(event.type) || []) {
            listener(event);
        }
    }

    focus() {
        this.ownerDocument.activeElement = this;
    }

    blur() {
        if (this.ownerDocument.activeElement === this) {
            this.ownerDocument.activeElement = this.ownerDocument.body;
        }
    }

    querySelector(selector) {
        return this.querySelectorAll(selector)[0] || null;
    }

    querySelectorAll(selector) {
        const matches = [];
        const visit = node => {
            for (const child of node.children) {
                if (matchesSelector(child, selector)) {
                    matches.push(child);
                }
                visit(child);
            }
        };

        visit(this);
        return matches;
    }
}

class FakeDocument {
    constructor() {
        this.body = new FakeElement('body', this);
        this.activeElement = this.body;
        this.listeners = new Map();
    }

    createElement(tagName) {
        return new FakeElement(tagName, this);
    }

    createElementNS(_namespace, tagName) {
        return new FakeElement(tagName, this);
    }

    querySelector(selector) {
        return this.body.querySelector(selector);
    }

    querySelectorAll(selector) {
        return this.body.querySelectorAll(selector);
    }

    addEventListener(type, listener) {
        const listeners = this.listeners.get(type) || [];
        listeners.push(listener);
        this.listeners.set(type, listeners);
    }

    dispatchEvent(event) {
        for (const listener of this.listeners.get(event.type) || []) {
            listener(event);
        }
    }
}

function toKebabCase(value) {
    return String(value).replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
}

function toCamelCase(value) {
    return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function matchesSelector(element, selector) {
    const tagMatch = selector.match(/^[a-z]+/i);
    if (tagMatch && element.tagName.toLowerCase() !== tagMatch[0].toLowerCase()) {
        return false;
    }

    const attributeMatches = [...selector.matchAll(/\[([^\]=]+)(?:="([^"]*)")?\]/g)];
    return attributeMatches.every(([, name, value]) => {
        if (!element.hasAttribute(name)) {
            return false;
        }

        return value === undefined || element.getAttribute(name) === value;
    });
}

function createFakeWindow(document) {
    const listeners = new Map();
    const timers = new Map();
    let nextTimerId = 1;
    let now = 0;

    return {
        document,
        listeners,
        timers,
        addEventListener(type, listener) {
            const entries = listeners.get(type) || [];
            entries.push(listener);
            listeners.set(type, entries);
        },
        removeEventListener(type, listener) {
            listeners.set(type, (listeners.get(type) || []).filter(entry => entry !== listener));
        },
        dispatchEvent(event) {
            for (const listener of listeners.get(event.type) || []) {
                listener(event);
            }
        },
        setTimeout(callback, delay = 0) {
            const id = nextTimerId++;
            timers.set(id, { callback, due: now + delay, cleared: false });
            return id;
        },
        clearTimeout(id) {
            const timer = timers.get(id);
            if (timer) {
                timer.cleared = true;
            }
        },
        tick(ms) {
            now += ms;
            const due = [...timers.entries()].filter(([, timer]) => !timer.cleared && timer.due <= now);
            for (const [id, timer] of due) {
                timers.delete(id);
                timer.callback();
            }
        },
        getComputedStyle(element) {
            return { transform: element.style.transform || 'none' };
        },
        DateNow() {
            return now;
        },
    };
}

function installDom() {
    const previous = {
        document: globalThis.document,
        window: globalThis.window,
        HTMLElement: globalThis.HTMLElement,
        CustomEvent: globalThis.CustomEvent,
        requestAnimationFrame: globalThis.requestAnimationFrame,
        dateNow: Date.now,
        consoleWarn: console.warn,
        consoleError: console.error,
    };

    const document = new FakeDocument();
    const window = createFakeWindow(document);

    globalThis.document = document;
    globalThis.window = window;
    globalThis.HTMLElement = FakeElement;
    globalThis.CustomEvent = FakeEvent;
    globalThis.requestAnimationFrame = callback => callback();
    Date.now = () => window.DateNow();

    return {
        document,
        window,
        restore() {
            globalThis.document = previous.document;
            globalThis.window = previous.window;
            globalThis.HTMLElement = previous.HTMLElement;
            globalThis.CustomEvent = previous.CustomEvent;
            globalThis.requestAnimationFrame = previous.requestAnimationFrame;
            Date.now = previous.dateNow;
            console.warn = previous.consoleWarn;
            console.error = previous.consoleError;
        },
    };
}

function createConfig(overrides = {}) {
    const slotClasses = {
        toast: 'base-toast',
        innerContainer: 'base-inner',
        iconContainer: 'base-icon',
        iconPulse: 'base-pulse',
        loadingIndicator: 'base-loading',
        contentContainer: 'base-content',
        title: 'base-title',
        description: 'base-description',
        actionContainer: 'base-action-container',
        actionButton: 'base-action-button',
        closeButton: 'base-close',
        closeButtonIcon: 'base-close-icon',
        progressTrack: 'base-progress-track',
        progressIndicator: 'base-progress-indicator',
    };

    return {
        version: 1,
        providerId: 'provider',
        defaults: {
            status: 'info',
            position: 'top-right',
            tone: 'subtle',
            animation: 'fade',
            duration: 1000,
            speed: 0,
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
            ...overrides.defaults,
        },
        slots: slotClasses,
        statuses: {
            default: { toast: 'status-default' },
            info: { toast: 'status-info' },
            success: { toast: 'status-success' },
            warning: { toast: 'status-warning' },
            error: { toast: 'status-error' },
            loading: { toast: 'status-loading' },
        },
        positions: Object.fromEntries(positions.map(position => [position, { toast: `position-${position}`, viewport: `viewport-${position}`, stack: `stack-${position}` }])),
        tones: {
            subtle: { toast: 'tone-subtle' },
            solid: { toast: 'tone-solid' },
            outline: { toast: 'tone-outline' },
            ghost: { toast: 'tone-ghost' },
        },
        animations: {
            fade: { toast: 'animation-fade' },
            slide: { toast: 'animation-slide' },
            none: { toast: 'animation-none' },
        },
        states: {
            entering: { toast: 'state-entering' },
            visible: { toast: 'state-visible' },
            leaving: { toast: 'state-leaving' },
        },
        aliases: {
            positions: positionAliases,
            statuses: { destructive: 'error' },
            types: { filled: 'solid', outline: 'outline' },
            effects: { fade: 'fade', slide: 'slide' },
        },
    };
}

function createProvider(document, config = createConfig(), selectedPositions = positions) {
    const provider = document.createElement('div');
    provider.setAttribute('data-rz-toast-provider', '');

    for (const position of selectedPositions) {
        const stack = document.createElement('div');
        stack.setAttribute('data-rz-toast-stack', '');
        stack.setAttribute('data-toast-position', position);
        provider.appendChild(stack);
    }

    const script = document.createElement('script');
    script.setAttribute('data-rz-toast-config', '');
    script.textContent = JSON.stringify(config);
    provider.appendChild(script);
    document.body.appendChild(provider);
    return provider;
}

function setupManager(config = createConfig(), selectedPositions = positions) {
    const env = installDom();
    createProvider(env.document, config, selectedPositions);
    const manager = new RzToastManager();
    return { ...env, manager };
}

function toastItems(stack) {
    return stack.children.filter(child => child.hasAttribute('data-rz-toast-item'));
}

test('normalizes legacy and modern toast options', () => {
    const config = createConfig();

    assert.equal(normalizeToastOptions({ variant: 'destructive' }, config).status, 'error');
    assert.equal(normalizeToastOptions({ message: 'Message' }, config).text, 'Message');
    assert.equal(normalizeToastOptions({ description: 'Description' }, config).text, 'Description');
    assert.equal(normalizeToastOptions({ autotimeout: 123 }, config).duration, 123);
    assert.equal(normalizeToastOptions({ effect: 'slide' }, config).animation, 'slide');
    assert.equal(normalizeToastOptions({ type: 'filled' }, config).tone, 'solid');
    assert.equal(normalizeToastOptions({ type: 'outline' }, config).tone, 'outline');

    for (const [alias, position] of Object.entries(positionAliases)) {
        assert.equal(normalizeToastOptions({ position: alias }, config).position, position);
    }
});

test('invalid status and position warn and fallback', () => {
    const warnings = [];
    const previousWarn = console.warn;
    console.warn = message => warnings.push(message);

    try {
        const normalized = normalizeToastOptions({ status: 'unknown', position: 'elsewhere' }, createConfig());
        assert.equal(normalized.status, 'info');
        assert.equal(normalized.position, 'top-right');
        assert.equal(warnings.length, 2);
    } finally {
        console.warn = previousWarn;
    }
});

test('registers provider stacks and warns once when provider is missing', () => {
    const env = installDom();
    const warnings = [];
    console.warn = message => warnings.push(message);

    try {
        const missing = new RzToastManager();
        assert.equal(missing.show({ text: 'No provider' }), null);
        assert.equal(missing.show({ text: 'Still no provider' }), null);
        assert.equal(warnings.length, 1);

        createProvider(env.document);
        const manager = new RzToastManager();
        assert.equal(manager.ensureProvider(), true);
        assert.equal(manager.stacks.size, 9);
    } finally {
        env.restore();
    }
});

test('multiple providers use the first provider and warn in development', () => {
    const env = installDom();
    const warnings = [];
    console.warn = message => warnings.push(message);

    try {
        const first = createProvider(env.document);
        createProvider(env.document);
        const manager = new RzToastManager();

        assert.equal(manager.ensureProvider(), true);
        assert.equal(manager.provider, first);
        assert.equal(warnings.length, 1);
    } finally {
        env.restore();
    }
});

test('facade and manager methods create, update, move, dismiss, and clear toasts', () => {
    const env = setupManager();

    try {
        Toast.registerProvider(env.document.querySelector('[data-rz-toast-provider]'));
        const handle = Toast.success('Saved', 'Success', { id: 'saved', position: 'bottom-left', autoclose: false });
        const bottomLeft = Toast.configure().stacks.get('bottom-left');

        assert.equal(handle.id, 'saved');
        assert.equal(toastItems(bottomLeft).length, 1);
        assert.equal(toastItems(bottomLeft)[0].querySelector('[data-slot="toast-description"]').textContent, 'Saved');

        Toast.update('saved', { status: 'error', text: 'Failed', position: 'top-center' });
        const topCenter = Toast.configure().stacks.get('top-center');
        assert.equal(toastItems(bottomLeft).length, 0);
        assert.equal(toastItems(topCenter).length, 1);
        assert.equal(toastItems(topCenter)[0].getAttribute('data-toast-status'), 'error');
        assert.equal(toastItems(topCenter)[0].querySelector('[data-slot="toast-description"]').textContent, 'Failed');

        Toast.error('Error text', 'Error', { id: 'error-toast', autoclose: false });
        Toast.warning('Warning text', 'Warning', { id: 'warning-toast', autoclose: false });
        Toast.info('Info text', 'Info', { id: 'info-toast', autoclose: false });
        Toast.custom({ id: 'custom-toast', text: 'Custom', autoclose: false });
        Toast.show({ id: 'show-toast', text: 'Show', autoclose: false });
        const loading = Toast.loading('Loading text', 'Loading', { id: 'loading-toast' });
        assert.equal(Toast.configure().get(loading.id).options.autoclose, false);

        assert.equal(Toast.dismiss('saved'), true);
        env.window.tick(0);
        assert.equal(Toast.configure().get('saved'), undefined);

        Toast.dismiss();
        env.window.tick(0);
        assert.equal(Toast.configure().get('loading-toast'), undefined);

        Toast.clear();
        assert.equal(Toast.configure().getAll().length, 0);
    } finally {
        env.restore();
    }
});

test('dedupe, duplicate ids, and overflow strategies are enforced per stack', () => {
    const env = setupManager(createConfig({ defaults: { maxVisible: 2 } }));

    try {
        const manager = env.manager;
        manager.show({ id: 'same', text: 'One', autoclose: false });
        manager.show({ id: 'same', text: 'Two', autoclose: false });
        assert.equal(manager.getAll().length, 1);
        assert.equal(manager.get('same').options.text, 'Two');

        manager.show({ dedupeKey: 'item', text: 'A', autoclose: false });
        manager.show({ dedupeKey: 'item', text: 'B', autoclose: false });
        assert.equal(manager.getAll().length, 2);
        assert.equal(manager.getAll().find(toast => toast.dedupeKey === 'item').options.text, 'B');

        manager.show({ text: 'Unique', title: 'Same', preventDuplicates: true, autoclose: false });
        manager.show({ text: 'Unique', title: 'Same', preventDuplicates: true, autoclose: false });
        assert.equal(manager.getAll().length, 3);

        manager.clear();
        manager.show({ id: 'oldest', text: 'Oldest', position: 'top-left', maxVisible: 2, autoclose: false });
        manager.show({ id: 'middle', text: 'Middle', position: 'top-left', maxVisible: 2, autoclose: false });
        manager.show({ id: 'newest', text: 'Newest', position: 'top-left', maxVisible: 2, autoclose: false });
        env.window.tick(0);
        assert.equal(manager.get('oldest'), undefined);
        assert.equal(manager.get('newest').options.text, 'Newest');

        manager.clear();
        manager.show({ id: 'kept-1', text: 'Kept 1', position: 'top-left', maxVisible: 1, autoclose: false });
        const ignored = manager.show({ id: 'ignored', text: 'Ignored', position: 'top-left', maxVisible: 1, overflowStrategy: 'ignore-newest', autoclose: false });
        assert.equal(ignored, null);
        assert.equal(manager.get('ignored'), undefined);
        assert.equal(manager.get('kept-1').options.text, 'Kept 1');
    } finally {
        env.restore();
    }
});

test('renderer applies only class-map classes plus caller custom classes', () => {
    const env = installDom();

    try {
        const toast = {
            id: 'rendered',
            state: 'visible',
            remaining: 1000,
            options: normalizeToastOptions({
                status: 'success',
                tone: 'outline',
                animation: 'slide',
                position: 'bottom-right',
                title: 'Title',
                text: 'Text',
                autoclose: false,
                customClass: 'caller-root',
                classNames: { title: 'caller-title' },
            }, createConfig()),
        };

        const element = createToastDom(toast, createConfig());
        assert.deepEqual(element.classList, ['base-toast', 'position-bottom-right', 'status-success', 'tone-outline', 'animation-slide', 'state-visible', 'caller-root']);
        assert.equal(element.querySelector('[data-slot="toast-title"]').className, 'base-title caller-title');
        assert.equal(element.querySelector('[data-slot="toast-title"]').textContent, 'Title');
        assert.equal(element.querySelector('[data-slot="toast-description"]').textContent, 'Text');
    } finally {
        env.restore();
    }
});

test('actions, accessibility attributes, and focused Escape dismissal work', () => {
    const env = setupManager();
    let actionCalls = 0;
    const errors = [];
    console.error = (...args) => errors.push(args);

    try {
        const focusedBefore = env.document.createElement('button');
        env.document.body.appendChild(focusedBefore);
        focusedBefore.focus();

        env.manager.show({
            id: 'action',
            status: 'error',
            title: 'Delete',
            text: 'Deleted',
            autoclose: false,
            action: {
                label: 'Undo',
                onClick: handle => {
                    actionCalls += 1;
                    assert.equal(handle.id, 'action');
                },
            },
        });

        const element = env.manager.get('action').elements.root;
        assert.equal(env.document.activeElement, focusedBefore);
        assert.equal(element.getAttribute('role'), 'alert');
        assert.equal(element.getAttribute('aria-live'), 'assertive');
        assert.equal(element.getAttribute('aria-atomic'), 'true');
        assert.equal(element.querySelector('[data-slot="toast-close-button"]').getAttribute('type'), 'button');
        assert.equal(element.querySelector('[data-slot="toast-close-button"]').getAttribute('aria-label'), 'Dismiss notification');

        element.querySelector('[data-slot="toast-action-button"]').dispatchEvent(new FakeEvent('click'));
        env.window.tick(0);
        assert.equal(actionCalls, 1);
        assert.equal(env.manager.get('action'), undefined);

        env.manager.show({
            id: 'bad-action',
            text: 'Bad action',
            autoclose: false,
            action: { label: 'Run', onClick: () => { throw new Error('boom'); } },
        });
        env.manager.get('bad-action').elements.root.querySelector('[data-slot="toast-action-button"]').dispatchEvent(new FakeEvent('click'));
        assert.equal(errors.length, 1);

        env.manager.show({ id: 'escape', text: 'Escape', autoclose: false });
        const escapeToast = env.manager.get('escape').elements.root;
        escapeToast.querySelector('[data-slot="toast-close-button"]').focus();
        escapeToast.dispatchEvent(new FakeEvent('keydown', { key: 'Escape' }));
        env.window.tick(0);
        assert.equal(env.manager.get('escape'), undefined);
        assert.equal(env.document.activeElement.parentElement, null);
    } finally {
        env.restore();
    }
});

test('timers autoclose and pause on hover, focus, and window blur', () => {
    const env = setupManager();

    try {
        env.manager.show({ id: 'timer', text: 'Timer', duration: 100, speed: 0 });
        env.window.tick(99);
        assert.notEqual(env.manager.get('timer'), undefined);
        env.window.tick(1);
        env.window.tick(0);
        assert.equal(env.manager.get('timer'), undefined);

        env.manager.show({ id: 'hover', text: 'Hover', duration: 100, speed: 0, pauseOnHover: true });
        const hoverToast = env.manager.get('hover').elements.root;
        env.window.tick(40);
        hoverToast.dispatchEvent(new FakeEvent('mouseenter'));
        env.window.tick(100);
        assert.notEqual(env.manager.get('hover'), undefined);
        hoverToast.dispatchEvent(new FakeEvent('mouseleave'));
        env.window.tick(60);
        env.window.tick(0);
        assert.equal(env.manager.get('hover'), undefined);

        env.manager.show({ id: 'focus', text: 'Focus', duration: 100, speed: 0, pauseOnFocus: true });
        const focusToast = env.manager.get('focus').elements.root;
        env.window.tick(30);
        focusToast.dispatchEvent(new FakeEvent('focusin'));
        env.window.tick(100);
        assert.notEqual(env.manager.get('focus'), undefined);
        focusToast.dispatchEvent(new FakeEvent('focusout'));
        env.window.tick(70);
        env.window.tick(0);
        assert.equal(env.manager.get('focus'), undefined);

        env.manager.show({ id: 'blur', text: 'Blur', duration: 100, speed: 0, pauseOnWindowBlur: true });
        env.window.tick(30);
        env.window.dispatchEvent(new FakeEvent('blur'));
        env.window.tick(100);
        assert.notEqual(env.manager.get('blur'), undefined);
        env.window.dispatchEvent(new FakeEvent('focus'));
        env.window.tick(70);
        env.window.tick(0);
        assert.equal(env.manager.get('blur'), undefined);
    } finally {
        env.restore();
    }
});

test('input and lifecycle events use serializable stable details', () => {
    const env = setupManager();
    const lifecycle = [];

    try {
        ['rz:toast:shown', 'rz:toast:updated', 'rz:toast:dismissed', 'rz:toast:cleared'].forEach(name => {
            env.window.addEventListener(name, event => lifecycle.push({ name, detail: event.detail }));
        });

        env.window.dispatchEvent(new FakeEvent('rz:toast', { detail: { id: 'evented', text: 'Shown', data: { source: 'test' }, autoclose: false } }));
        assert.equal(env.manager.get('evented').options.text, 'Shown');
        assert.equal(lifecycle.at(-1).detail.id, 'evented');
        assert.equal(lifecycle.at(-1).detail.data.source, 'test');

        env.window.dispatchEvent(new FakeEvent('rz:toast:update', { detail: { id: 'evented', text: 'Updated' } }));
        assert.equal(env.manager.get('evented').options.text, 'Updated');

        env.window.dispatchEvent(new FakeEvent('rz:toast:show', { detail: { id: 'shown-event', text: 'Shown event', autoclose: false } }));
        assert.notEqual(env.manager.get('shown-event'), undefined);

        env.window.dispatchEvent(new FakeEvent('rz:toast:dismiss', { detail: { id: 'evented' } }));
        env.window.tick(0);
        assert.equal(env.manager.get('evented'), undefined);

        env.window.dispatchEvent(new FakeEvent('rz:toast:clear'));
        assert.equal(env.manager.getAll().length, 0);
        assert.equal(lifecycle.at(-1).name, 'rz:toast:cleared');
    } finally {
        env.restore();
    }
});

test('missing normalized stack falls back to top-right when available', () => {
    const env = setupManager(createConfig(), ['top-right']);
    const warnings = [];
    console.warn = message => warnings.push(message);

    try {
        env.manager.show({ id: 'fallback', text: 'Fallback', position: 'bottom-left', autoclose: false });
        const topRight = env.manager.stacks.get('top-right');
        assert.equal(toastItems(topRight).length, 1);
        assert.match(warnings[0], /Falling back to 'top-right'/);
    } finally {
        env.restore();
    }
});

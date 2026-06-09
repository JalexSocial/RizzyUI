import assert from 'node:assert/strict';
import test from 'node:test';
import Toast from '../toast.js';
import { RzToastManager } from '../rzToastManager.js';
import { normalizeToastOptions } from '../rzToastNormalize.js';
import { createToastDom, dedupeClasses } from '../rzToastRenderer.js';

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

    getBoundingClientRect() {
        this._rectReadCount = (this._rectReadCount || 0) + 1;
        const index = this.parentElement ? this.parentElement.children.indexOf(this) : 0;
        const top = index >= 0 ? index * 48 : 0;
        return { top, bottom: top + 40, height: 40, left: 0, right: 320, width: 320 };
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
        slots: { ...slotClasses, ...overrides.slots },
        statuses: {
            default: { toast: 'status-default', title: 'text-accent-foreground' },
            info: { toast: 'status-info bg-[color-mix(in_oklab,var(--background)_90%,var(--info)_10%)]', title: 'text-info' },
            success: { toast: 'status-success', title: 'text-success' },
            warning: { toast: 'status-warning', title: 'text-warning' },
            error: { toast: 'status-error', title: 'text-destructive' },
            loading: { toast: 'status-loading', title: 'text-info' },
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


function assertClassTokenCount(className, token, expected) {
    assert.equal(className.split(/\s+/).filter(value => value === token).length, expected, `${token} count in ${className}`);
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
        Toast.show({ id: 'empty-status-toast', status: '', text: 'Empty status', autoclose: false });
        const loading = Toast.loading('Loading text', 'Loading', { id: 'loading-toast' });
        assert.equal(Toast.configure().get('custom-toast').options.status, 'default');
        assert.equal(Toast.configure().get('show-toast').options.status, 'default');
        assert.equal(Toast.configure().get('empty-status-toast').options.status, 'default');
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


test('toast insertion flushes initial state and animates existing stack items into place', () => {
    const env = setupManager(createConfig({ defaults: { speed: 250 } }));

    try {
        env.manager.show({ id: 'first', title: 'First', text: 'First toast', autoclose: false });
        const first = env.manager.get('first').elements.root;
        assert.ok(first._rectReadCount > 0);

        env.manager.show({ id: 'second', title: 'Second', text: 'Second toast', autoclose: false });
        const stack = env.manager.stacks.get('top-right');
        assert.equal(toastItems(stack)[0].dataset.toastId, 'second');
        assert.equal(toastItems(stack)[1].dataset.toastId, 'first');
        assert.equal(first.style.transform, '');
        assert.equal(first.style.transition, 'transform 250ms cubic-bezier(0.22, 1, 0.36, 1)');
        assert.ok(first._rectReadCount > 1);
    } finally {
        env.restore();
    }
});

test('dedupeClasses preserves first-seen tokens and arbitrary color-mix utilities', () => {
    assert.equal(
        dedupeClasses(
            null,
            undefined,
            '',
            '   ',
            ['relative rounded-lg border', ['relative border text-sm']],
            'custom-class bg-[color-mix(in_oklab,var(--background)_90%,var(--info)_10%)] custom-class'
        ),
        'relative rounded-lg border text-sm custom-class bg-[color-mix(in_oklab,var(--background)_90%,var(--info)_10%)]'
    );
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
        assert.equal(element.querySelector('[data-slot="toast-title"]').className, 'base-title text-success caller-title');
        assert.equal(element.querySelector('[data-slot="toast-title"]').textContent, 'Title');
        assert.equal(element.querySelector('[data-slot="toast-description"]').textContent, 'Text');
    } finally {
        env.restore();
    }
});


test('renderer de-duplicates slot classes while preserving status title colors and custom classes', () => {
    const env = installDom();

    try {
        const config = createConfig({
            slots: {
                toast: 'not-prose pointer-events-auto relative rounded-lg border',
                innerContainer: 'flex items-start gap-x-3',
                title: 'font-medium tracking-tight line-clamp-1',
                description: 'text-sm text-foreground/90',
                closeButton: 'rounded-full p-1 opacity-70',
            },
        });
        config.positions['top-right'] = { toast: 'relative border position-top-right', innerContainer: 'flex gap-x-3' };
        config.statuses.info = {
            toast: 'border-info bg-[color-mix(in_oklab,var(--background)_90%,var(--info)_10%)] pointer-events-auto',
            title: 'text-info font-medium',
            description: 'text-foreground/90',
            closeButton: 'rounded-full',
        };
        config.statuses.success.title = 'text-success font-medium';
        config.statuses.warning.title = 'text-warning font-medium';
        config.statuses.error.title = 'text-destructive font-medium';
        config.statuses.default.title = 'text-accent-foreground font-medium';
        config.tones.subtle = { toast: 'border tone-subtle' };
        config.animations.fade = { toast: 'transition-opacity animation-fade' };
        config.states.visible = { toast: 'transition-opacity state-visible' };

        const toast = {
            id: 'dedupe-rendered',
            state: 'visible',
            remaining: 1000,
            options: normalizeToastOptions({
                status: 'info',
                position: 'top-right',
                tone: 'subtle',
                animation: 'fade',
                title: 'Saved',
                text: 'Done',
                autoclose: false,
                classNames: {
                    toast: 'caller-root relative',
                    innerContainer: 'caller-inner flex',
                    title: 'caller-title text-info',
                    description: 'caller-description text-sm',
                    closeButton: 'caller-close rounded-full',
                },
            }, config),
        };

        const element = createToastDom(toast, config);
        const inner = element.querySelector('[data-slot="toast-inner-container"]');
        const title = element.querySelector('[data-slot="toast-title"]');
        const description = element.querySelector('[data-slot="toast-description"]');
        const closeButton = element.querySelector('[data-slot="toast-close-button"]');

        assertClassTokenCount(element.className, 'not-prose', 1);
        assertClassTokenCount(element.className, 'pointer-events-auto', 1);
        assertClassTokenCount(element.className, 'relative', 1);
        assertClassTokenCount(element.className, 'border', 1);
        assertClassTokenCount(inner.className, 'flex', 1);
        assertClassTokenCount(inner.className, 'gap-x-3', 1);
        assertClassTokenCount(title.className, 'font-medium', 1);
        assertClassTokenCount(title.className, 'text-info', 1);
        assertClassTokenCount(description.className, 'text-sm', 1);
        assertClassTokenCount(description.className, 'text-foreground/90', 1);
        assertClassTokenCount(closeButton.className, 'rounded-full', 1);
        assert.ok(element.className.includes('bg-[color-mix(in_oklab,var(--background)_90%,var(--info)_10%)]'));
        assert.ok(element.classList.includes('caller-root'));
        assert.ok(inner.classList.includes('caller-inner'));
        assert.ok(title.classList.includes('caller-title'));
        assert.ok(description.classList.includes('caller-description'));
        assert.ok(closeButton.classList.includes('caller-close'));
        assert.ok(element.classList.includes('position-top-right'));
        assert.ok(element.classList.includes('tone-subtle'));
        assert.ok(element.classList.includes('animation-fade'));
        assert.ok(element.classList.includes('state-visible'));

        toast.options = normalizeToastOptions({ status: 'default', title: 'Default', text: 'No icon', autoclose: false }, config);
        const defaultElement = createToastDom(toast, config);
        assert.equal(defaultElement.querySelector('[data-slot="toast-icon-container"]'), null);

        for (const [status, expectedTitleClass] of Object.entries({
            default: 'text-accent-foreground',
            info: 'text-info',
            success: 'text-success',
            warning: 'text-warning',
            error: 'text-destructive',
            loading: 'text-info',
        })) {
            toast.options = normalizeToastOptions({ status, title: status, text: 'Text', autoclose: false }, config);
            const statusElement = createToastDom(toast, config);
            assert.ok(statusElement.querySelector('[data-slot="toast-title"]').classList.includes(expectedTitleClass));
        }
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

import test from 'node:test';
import assert from 'node:assert/strict';

// Minimal document: base URI, the fallback lookup and dispatched events.
const fallbackElements = [];
const events = [];
globalThis.document = {
    baseURI: 'http://localhost/',
    querySelectorAll: () => fallbackElements,
    dispatchEvent: event => events.push(event),
};
globalThis.CustomEvent = class CustomEvent {
    constructor(type, init) { this.type = type; this.detail = init?.detail; }
};

const {
    importCodeBehindModule,
    registerCodeBehindModule,
    installCodeBehindLoader,
    resetCodeBehindLoaderForTests,
} = await import('../codeBehindLoader.js');

const workingModule = 'data:text/javascript,export default () => ({ loaded: true });';
const failingModule = 'data:text/javascript,throw new Error("boom");';

function createAlpine() {
    const data = new Map();
    return {
        data,
        asyncData(name, download) { data.set(name, download); },
        asyncUrl() { throw new Error('async-alpine asyncUrl must be replaced'); },
    };
}

function captureConsole(method) {
    const messages = [];
    const original = console[method];
    console[method] = (...args) => messages.push(args.map(String).join(' '));
    return { messages, restore: () => { console[method] = original; } };
}

test('x-load-src registrations go through the RizzyUI loader', async () => {
    resetCodeBehindLoaderForTests();
    const Alpine = createAlpine();
    installCodeBehindLoader(Alpine);

    Alpine.asyncUrl('rzcb_Counter_1', workingModule);

    const download = Alpine.data.get('rzcb_Counter_1');
    assert.equal(typeof download, 'function');
    const module = await download();
    assert.deepEqual(module.default(), { loaded: true });
});

test('module factories are wrapped for the ready() hook', async () => {
    const module = await importCodeBehindModule('rzcb_Named_5', 'data:text/javascript,export const rzcb_Named_5 = () => ({ named: true }); export default () => ({ named: false });');
    assert.equal(module.default.__rzLifecycle, true);
    // async-alpine prefers an export named like the component; the wrapper keeps that choice.
    assert.deepEqual(module.default(), { named: true });
});

test('a second URL for the same name is ignored with a warning', () => {
    resetCodeBehindLoaderForTests();
    const Alpine = createAlpine();
    const warn = captureConsole('warn');
    try {
        assert.equal(registerCodeBehindModule(Alpine, 'counter', '/a/Counter.razor.js'), true);
        assert.equal(registerCodeBehindModule(Alpine, 'counter', '/a/Counter.razor.js'), true);
        assert.equal(registerCodeBehindModule(Alpine, 'counter', '/b/Counter.razor.js'), false);
    } finally {
        warn.restore();
    }
    assert.equal(warn.messages.length, 1);
    assert.match(warn.messages[0], /Two code-behind modules use the Alpine name 'counter'/);
});

test('falls back to the plain URL when the fingerprinted URL fails', async () => {
    const warn = captureConsole('warn');
    let module;
    try {
        module = await importCodeBehindModule('rzcb_Counter_2', failingModule, workingModule);
    } finally {
        warn.restore();
    }
    assert.deepEqual(module.default(), { loaded: true });
    assert.match(warn.messages[0], /because .* failed to load/);
});

test('finds the fallback URL on the element that references the module', async () => {
    fallbackElements.length = 0;
    fallbackElements.push({
        getAttribute: name => (name === 'x-load-src' ? failingModule : workingModule),
    });
    const warn = captureConsole('warn');
    let module;
    try {
        module = await importCodeBehindModule('rzcb_Counter_3', failingModule);
    } finally {
        warn.restore();
        fallbackElements.length = 0;
    }
    assert.deepEqual(module.default(), { loaded: true });
});

test('a module that cannot load is reported once and replaced by an inert component', async () => {
    events.length = 0;
    const error = captureConsole('error');
    let module;
    try {
        module = await importCodeBehindModule('rzcb_Missing_4', failingModule);
    } finally {
        error.restore();
    }
    assert.equal(error.messages.length, 1);
    assert.match(error.messages[0], /Could not load the code-behind module for 'rzcb_Missing_4'/);
    assert.deepEqual(module.default(), { _error: true, _errorMessage: "Module 'rzcb_Missing_4' failed to load." });
    assert.equal(events.length, 1);
    assert.equal(events[0].type, 'rz:module-error');
    assert.equal(events[0].detail.name, 'rzcb_Missing_4');
});

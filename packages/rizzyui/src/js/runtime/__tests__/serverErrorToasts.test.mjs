import test from 'node:test';
import assert from 'node:assert/strict';
import { installServerErrorToasts, showServerErrorToast } from '../serverErrorToasts.js';

function fakeDocument(config) {
    const listeners = {};
    return {
        listeners,
        addEventListener: (type, fn) => { listeners[type] = fn; },
        removeEventListener: (type, fn) => { if (listeners[type] === fn) delete listeners[type]; },
        querySelector: () => (config === undefined ? null : { textContent: JSON.stringify(config) }),
    };
}

function fakeToast() {
    const shown = [];
    return { shown, error: (text, title) => shown.push({ text, title }) };
}

const messages = { serverErrors: { title: 'Something went wrong', text: 'Server failed.', networkText: 'Offline.' } };

test('a server error shows the provider\'s server message', () => {
    const toast = fakeToast();
    assert.equal(showServerErrorToast(fakeDocument(messages), toast, 'server'), true);
    assert.deepEqual(toast.shown, [{ text: 'Server failed.', title: 'Something went wrong' }]);
});

test('a network error shows the network message', () => {
    const toast = fakeToast();
    showServerErrorToast(fakeDocument(messages), toast, 'network');
    assert.deepEqual(toast.shown, [{ text: 'Offline.', title: 'Something went wrong' }]);
});

test('nothing is shown without serverErrors in the config or without a provider', () => {
    const toast = fakeToast();
    assert.equal(showServerErrorToast(fakeDocument({}), toast, 'server'), false);
    assert.equal(showServerErrorToast(fakeDocument(undefined), toast, 'server'), false);
    assert.deepEqual(toast.shown, []);
});

test('installs the two document listeners once and removes them', () => {
    const doc = fakeDocument(messages);
    const toast = fakeToast();
    const uninstall = installServerErrorToasts({ document: doc }, toast);
    assert.equal(installServerErrorToasts({ document: doc }, toast), uninstall);
    assert.deepEqual(Object.keys(doc.listeners).sort(), ['htmx:error', 'rz:server-error']);

    doc.listeners['rz:server-error']();
    doc.listeners['htmx:error']();
    assert.equal(toast.shown.length, 2);

    uninstall();
    assert.deepEqual(Object.keys(doc.listeners), []);
});

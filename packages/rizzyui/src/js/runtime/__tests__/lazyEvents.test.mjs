import test from 'node:test';
import assert from 'node:assert/strict';
import { installLazyEventBuffer, takeBufferedEvent, pendingComponents } from '../lazyEvents.js';

function fakeWindow(elements) {
    const listeners = {};
    const doc = {
        body: null,
        querySelectorAll: (selector) => selector === '[data-event-trigger-name]' ? elements.filter(e => e.dataset.eventTriggerName) : elements,
    };
    return {
        document: doc,
        listeners,
        addEventListener: (type, fn) => { listeners[type] = fn; },
        removeEventListener: (type) => { delete listeners[type]; },
    };
}

test('an open event sent before the dialog started is kept and replayed once', () => {
    const dialog = { dataset: { eventTriggerName: 'app:open' } };
    const win = fakeWindow([dialog]);
    const uninstall = installLazyEventBuffer(win);
    win.listeners['app:open']({ detail: { id: 1 } });
    assert.deepEqual(takeBufferedEvent('app:open'), { detail: { id: 1 } });
    assert.equal(takeBufferedEvent('app:open'), null);
    uninstall();
});

test('an event a started dialog handled is not buffered', () => {
    const dialog = { dataset: { eventTriggerName: 'app:open' }, _x_dataStack: [{}] };
    const win = fakeWindow([dialog]);
    const uninstall = installLazyEventBuffer(win);
    win.listeners['app:open']({ detail: null });
    assert.equal(takeBufferedEvent('app:open'), null);
    uninstall();
});

test('pending components are eager x-data elements that have not started', () => {
    const started = { closest: () => null, getAttribute: () => null, _x_dataStack: [{}] };
    const waiting = { closest: () => null, getAttribute: () => null };
    const deferred = { closest: () => null, getAttribute: (name) => (name === 'x-load' ? 'visible' : null) };
    const doc = { querySelectorAll: () => [started, waiting, deferred] };
    assert.deepEqual(pendingComponents(doc), [waiting]);
});

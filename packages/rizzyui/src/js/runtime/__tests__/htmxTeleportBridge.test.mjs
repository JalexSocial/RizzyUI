import test from 'node:test';
import assert from 'node:assert/strict';
import { installHtmxTeleportBridge, processAddedElements } from '../htmxTeleportBridge.js';

function createFakeWindow() {
    const observers = [];
    class FakeObserver {
        constructor(callback) {
            this.callback = callback;
            this.disconnected = false;
            observers.push(this);
        }
        observe(target, options) {
            this.target = target;
            this.options = options;
        }
        disconnect() {
            this.disconnected = true;
        }
    }

    const processed = [];
    const win = {
        document: { body: {} },
        MutationObserver: FakeObserver,
        htmx: { process: node => processed.push(node) },
    };
    return { win, observers, processed };
}

test('observes only the direct children of body', () => {
    const { win, observers } = createFakeWindow();

    installHtmxTeleportBridge(win);

    assert.equal(observers.length, 1);
    assert.equal(observers[0].target, win.document.body);
    assert.deepEqual(observers[0].options, { childList: true });
});

test('processes teleported elements with htmx and ignores text nodes', () => {
    const { win, observers, processed } = createFakeWindow();
    installHtmxTeleportBridge(win);

    const teleported = { nodeType: 1, id: 'teleported-dialog-panel' };
    observers[0].callback([{ addedNodes: [{ nodeType: 3 }, teleported] }]);

    assert.deepEqual(processed, [teleported]);
});

test('is installed once per document', () => {
    const { win, observers } = createFakeWindow();

    const first = installHtmxTeleportBridge(win);
    const second = installHtmxTeleportBridge(win);

    assert.equal(observers.length, 1);
    assert.equal(first, second);
});

test('does nothing when htmx is not loaded', () => {
    assert.equal(processAddedElements({}, [{ addedNodes: [{ nodeType: 1 }] }]), 0);
});

test('disconnect stops observing', () => {
    const { win, observers } = createFakeWindow();
    const disconnect = installHtmxTeleportBridge(win);

    disconnect();

    assert.equal(observers[0].disconnected, true);
});

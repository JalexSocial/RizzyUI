import test from 'node:test';
import assert from 'node:assert/strict';
import { destroyOrphanedTrees, installAlpineOrphanCleanup } from '../alpineOrphanCleanup.js';

function fakeAlpine() {
    const destroyed = [];
    return { destroyed, destroyTree: node => destroyed.push(node) };
}

const element = (props = {}) => ({ nodeType: 1, isConnected: false, ...props });

test('destroys a removed element that Alpine did not mark', () => {
    const Alpine = fakeAlpine();
    const wrapper = element();
    assert.equal(destroyOrphanedTrees(Alpine, [{ removedNodes: [wrapper] }]), 1);
    assert.deepEqual(Alpine.destroyed, [wrapper]);
});

test('leaves elements Alpine marked (its own observer cleans them up)', () => {
    const Alpine = fakeAlpine();
    destroyOrphanedTrees(Alpine, [{ removedNodes: [element({ _x_marker: 3 })] }]);
    assert.deepEqual(Alpine.destroyed, []);
});

test('leaves moved elements (connected again when the records arrive) and text nodes', () => {
    const Alpine = fakeAlpine();
    destroyOrphanedTrees(Alpine, [{ removedNodes: [element({ isConnected: true }), { nodeType: 3 }] }]);
    assert.deepEqual(Alpine.destroyed, []);
});

test('installs one observer on the document element and can disconnect it', () => {
    const observers = [];
    class FakeObserver {
        constructor(callback) { this.callback = callback; observers.push(this); }
        observe(target, options) { this.target = target; this.options = options; }
        disconnect() { this.disconnected = true; }
    }
    const documentElement = {};
    const win = { document: { documentElement }, MutationObserver: FakeObserver };
    const Alpine = fakeAlpine();

    const disconnect = installAlpineOrphanCleanup(win, Alpine);
    assert.equal(installAlpineOrphanCleanup(win, Alpine), disconnect);
    assert.equal(observers.length, 1);
    assert.equal(observers[0].target, documentElement);
    assert.deepEqual(observers[0].options, { childList: true, subtree: true });

    observers[0].callback([{ removedNodes: [element()] }]);
    assert.equal(Alpine.destroyed.length, 1);

    disconnect();
    assert.equal(observers[0].disconnected, true);
});

test('does nothing without destroyTree or MutationObserver', () => {
    assert.equal(typeof installAlpineOrphanCleanup({ document: { documentElement: {} } }, fakeAlpine()), 'function');
    assert.equal(typeof installAlpineOrphanCleanup({ document: { documentElement: {} }, MutationObserver: class {} }, {}), 'function');
});

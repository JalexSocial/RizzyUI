import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeIntoRizzyGlobal } from '../rizzyGlobal.js';

test('keeps the existing window.Rizzy object that rizzy.js holds a reference to', () => {
    // rizzy.js (Rizzy 6) runs `const root = window.Rizzy = window.Rizzy || {}` and stores its API on root.
    const rizzyRoot = { diagnostics: { clientMajor: 6 }, nonce: {}, confirm() { return 'native'; } };

    const merged = mergeIntoRizzyGlobal(rizzyRoot, { toast: () => 'toast', theme: {} });

    assert.equal(merged, rizzyRoot, 'the same object must be returned, not a copy');
    assert.equal(merged.diagnostics.clientMajor, 6);
    assert.equal(merged.confirm(), 'native');
    assert.equal(merged.toast(), 'toast');
});

test('later additions by rizzy.js remain visible through the merged global', () => {
    const rizzyRoot = {};
    const merged = mergeIntoRizzyGlobal(rizzyRoot, { toast() {} });

    rizzyRoot.confirm = () => 'added later';

    assert.equal(merged.confirm(), 'added later');
});

test('creates a new object when no global exists yet', () => {
    const merged = mergeIntoRizzyGlobal(undefined, { ready: Promise.resolve() });

    assert.ok(merged.ready instanceof Promise);
});

test('accessor properties stay live instead of being copied as values', () => {
    let validation;
    const api = {
        get validation() {
            return validation;
        },
    };

    const merged = mergeIntoRizzyGlobal({}, api);
    assert.equal(merged.validation, undefined);

    validation = { name: 'validator' };
    assert.equal(merged.validation?.name, 'validator');
});

test('re-merging (for example a second bundle load) does not throw', () => {
    const target = {};
    mergeIntoRizzyGlobal(target, { get validation() { return 1; } });

    assert.doesNotThrow(() => mergeIntoRizzyGlobal(target, { get validation() { return 2; } }));
    assert.equal(target.validation, 2);
});

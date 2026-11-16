import test from 'node:test';
import assert from 'node:assert/strict';

// A minimal document: records appended elements and fires `load` on them.
const appended = [];
function createElement(tagName) {
    const listeners = {};
    return {
        tagName,
        attributes: {},
        relList: {},
        setAttribute(name, value) { this.attributes[name] = value; },
        addEventListener(type, listener) { listeners[type] = listener; },
        fire(type) { listeners[type]?.({ type }); },
    };
}
globalThis.document = {
    createElement,
    head: {
        appendChild(element) {
            appended.push(element);
            queueMicrotask(() => element.fire('load'));
        },
    },
};

const { require } = await import('../rizzyRequire.js');

const findBySrc = src => appended.find(element => element.src === src || element.href === src);

test('accepts plain URL strings without integrity', async () => {
    await require(['https://cdn.example.test/plain.js'], 'nonce-1');

    const script = findBySrc('https://cdn.example.test/plain.js');
    assert.ok(script);
    assert.equal(script.integrity, undefined);
    assert.equal(script.crossOrigin, undefined);
    assert.equal(script.attributes.nonce, 'nonce-1');
});

test('sets integrity and crossorigin for { src, integrity } entries', async () => {
    await require([
        { src: 'https://cdn.example.test/pinned.js', integrity: 'sha256-abc=' },
        { src: 'https://cdn.example.test/pinned.css', integrity: 'sha256-def=' },
    ], 'nonce-2');

    const script = findBySrc('https://cdn.example.test/pinned.js');
    assert.equal(script.tagName, 'script');
    assert.equal(script.integrity, 'sha256-abc=');
    assert.equal(script.crossOrigin, 'anonymous');

    const link = findBySrc('https://cdn.example.test/pinned.css');
    assert.equal(link.tagName, 'link');
    assert.equal(link.integrity, 'sha256-def=');
    assert.equal(link.crossOrigin, 'anonymous');
});

test('mixes strings and objects, and ignores invalid entries', async () => {
    await require([
        'https://cdn.example.test/mixed-a.js',
        { src: 'https://cdn.example.test/mixed-b.js' },
        null,
        { integrity: 'sha256-orphan=' },
        '',
    ]);

    assert.equal(findBySrc('https://cdn.example.test/mixed-a.js').integrity, undefined);
    assert.equal(findBySrc('https://cdn.example.test/mixed-b.js').integrity, undefined);
    assert.equal(appended.filter(element => !element.src && !element.href).length, 0);
});

test('an entry with integrity shares the bundle of the same URL as a string', async () => {
    const before = appended.length;
    const first = await require([{ src: 'https://cdn.example.test/shared.js', integrity: 'sha256-x=' }]);
    const second = await require(['https://cdn.example.test/shared.js']);

    assert.equal(first.bundleId, second.bundleId);
    assert.equal(appended.length, before + 1);
});

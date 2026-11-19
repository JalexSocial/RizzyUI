import test from 'node:test';
import assert from 'node:assert/strict';

// Minimal Element: attributes, a parent chain and closest() for the selectors alpineProps uses.
class FakeElement {
    constructor(attributes = {}, parent = null) {
        this.attributes = attributes;
        this.parent = parent;
    }
    hasAttribute(name) { return Object.hasOwn(this.attributes, name); }
    getAttribute(name) { return this.hasAttribute(name) ? this.attributes[name] : null; }
    closest(selector) {
        const names = [...selector.matchAll(/\[([^\]]+)\]/g)].map(match => match[1]);
        for (let element = this; element; element = element.parent) {
            if (names.some(name => element.hasAttribute(name))) return element;
        }
        return null;
    }
}
globalThis.Element = FakeElement;
const scripts = new Map();
globalThis.document = { getElementById: id => scripts.get(id) ?? null };

const { default: props, registerPropsMagic, findCodeBehindRoot } = await import('../alpineProps.js');

test('reads data-rz-props from the component root', () => {
    const root = new FakeElement({ 'x-load-src': '/Counter.razor.js', 'data-rz-props': '{"initialCount":10}' });
    assert.deepEqual(props(root), { initialCount: 10 });
});

test('reads the props of the nearest code-behind root from a nested element', () => {
    const outer = new FakeElement({ 'x-load-src': '/Outer.razor.js', 'data-rz-props': '{"name":"outer"}' });
    const inner = new FakeElement({ 'x-load-src': '/Inner.razor.js' }, outer);
    const button = new FakeElement({}, inner);

    assert.equal(findCodeBehindRoot(button), inner);
    // The inner component has no props: it must not see its parent's.
    assert.deepEqual(props(button), {});
    assert.deepEqual(props(new FakeElement({}, outer)), { name: 'outer' });
});

test('parses once per element and value', () => {
    const root = new FakeElement({ 'x-load-src': '/A.razor.js', 'data-rz-props': '{"a":1}' });
    assert.equal(props(root), props(root));
    root.attributes['data-rz-props'] = '{"a":2}';
    assert.deepEqual(props(root), { a: 2 });
});

test('still reads the props script referenced by data-props-id', () => {
    scripts.set('legacy-props', { textContent: '{"step":2}' });
    const root = new FakeElement({ 'data-props-id': 'legacy-props' });
    assert.deepEqual(props(root), { step: 2 });
});

test('invalid JSON returns an empty object', () => {
    const original = console.error;
    console.error = () => {};
    try {
        assert.deepEqual(props(new FakeElement({ 'data-rz-props': '{oops' })), {});
    } finally {
        console.error = original;
    }
});

test('$props magic resolves from the element it is evaluated on', () => {
    let magic;
    registerPropsMagic({ magic: (name, callback) => { assert.equal(name, 'props'); magic = callback; } });
    const root = new FakeElement({ 'x-load-src': '/B.razor.js', 'data-rz-props': '{"title":"Hi"}' });
    assert.deepEqual(magic(new FakeElement({}, root)), { title: 'Hi' });
});

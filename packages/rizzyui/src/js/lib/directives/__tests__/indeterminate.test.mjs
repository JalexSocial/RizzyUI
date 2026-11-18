import assert from 'node:assert/strict';
import test from 'node:test';
import registerIndeterminateDirective from '../indeterminate.js';

// A minimal Alpine stand-in: records the directive, and lets the test drive evaluate/effect.
function createAlpine() {
    const directives = {};
    return {
        directives,
        directive(name, handler) {
            directives[name] = handler;
        },
    };
}

function run(handler, el, expression, values) {
    let current = values[0];
    let rerun = null;
    handler(el, { expression }, {
        evaluateLater: () => callback => callback(current),
        effect: fn => {
            rerun = fn;
            fn();
        },
    });
    return next => {
        current = next;
        rerun();
    };
}

test('x-indeterminate sets the indeterminate property from the expression (CSP-safe: read only)', () => {
    const Alpine = createAlpine();
    registerIndeterminateDirective(Alpine);
    assert.equal(typeof Alpine.directives.indeterminate, 'function');

    const el = { indeterminate: false };
    const update = run(Alpine.directives.indeterminate, el, 'selection.somePageRowsSelected()', [true]);
    assert.equal(el.indeterminate, true);

    update(0);
    assert.equal(el.indeterminate, false, 'falsy values clear it');

    update('yes');
    assert.equal(el.indeterminate, true, 'truthy values set it');
});

test('x-indeterminate without an expression does nothing', () => {
    const Alpine = createAlpine();
    registerIndeterminateDirective(Alpine);
    const el = { indeterminate: true };
    Alpine.directives.indeterminate(el, { expression: '' }, {
        evaluateLater: () => assert.fail('must not evaluate'),
        effect: () => assert.fail('must not create an effect'),
    });
    assert.equal(el.indeterminate, true);
});

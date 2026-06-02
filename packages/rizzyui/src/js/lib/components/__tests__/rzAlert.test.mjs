import assert from 'node:assert/strict';
import test from 'node:test';
import rzAlert from '../rzAlert.js';

test('rzAlert init finds its parent live-region element by data-alpine-root', () => {
    const parent = { id: 'alert-1', style: { display: '' } };
    const component = rzAlert();
    const previousDocument = globalThis.document;

    globalThis.document = {
        getElementById(id) {
            return id === 'alert-1' ? parent : null;
        }
    };

    try {
        component.$el = {
            dataset: { alpineRoot: 'alert-1' },
            closest() {
                throw new Error('closest should not be needed when data-alpine-root is present');
            }
        };

        component.init();

        assert.equal(component.parentElement, parent);
        assert.equal(component.showAlert, true);
    } finally {
        globalThis.document = previousDocument;
    }
});

test('rzAlert dismiss hides without moving focus', () => {
    const parent = { style: { display: '' } };
    const focusedElement = { focusCalls: 0, focus() { this.focusCalls += 1; } };
    const previousSetTimeout = globalThis.setTimeout;
    const previousDocument = globalThis.document;
    let delay;

    globalThis.setTimeout = (callback, timeout) => {
        delay = timeout;
        callback();
        return 1;
    };
    globalThis.document = { activeElement: focusedElement };

    try {
        const component = rzAlert();
        component.parentElement = parent;

        component.dismiss();

        assert.equal(component.showAlert, false);
        assert.equal(delay, 205);
        assert.equal(parent.style.display, 'none');
        assert.equal(globalThis.document.activeElement, focusedElement);
        assert.equal(focusedElement.focusCalls, 0);
    } finally {
        globalThis.setTimeout = previousSetTimeout;
        globalThis.document = previousDocument;
    }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import rzModal from '../rzModal.js';

function withWindow(fn) {
    const previousWindow = globalThis.window;
    const previousDocument = globalThis.document;
    const target = new EventTarget();
    globalThis.window = target;
    globalThis.document = { activeElement: null, body: { nodeType: 1 } };
    try {
        return fn(target);
    } finally {
        globalThis.window = previousWindow;
        globalThis.document = previousDocument;
    }
}

function createModal() {
    const modal = rzModal();
    const dispatched = [];
    modal.$el = { dispatchEvent: (event) => { dispatched.push(event); return true; } };
    return { modal, dispatched };
}

test('openFromTrigger raises the configured window event with the trigger as invoker', () => {
    withWindow((win) => {
        const { modal } = createModal();
        modal.eventTriggerName = 'open-account-dialog';

        let received;
        win.addEventListener('open-account-dialog', (event) => { received = event; });

        const trigger = { nodeType: 1, id: 'trigger' };
        modal.openFromTrigger({ currentTarget: trigger });

        assert.ok(received, 'the window event that other dialogs and app code listen for is still raised');
        assert.equal(received.detail.invoker, trigger);
    });
});

test('openModal records the trigger from the event detail so focus can return to it', () => {
    withWindow(() => {
        const { modal } = createModal();
        const trigger = { nodeType: 1, id: 'trigger' };

        // Window events have window as their target, which is not an element.
        modal.openModal({ target: globalThis.window, detail: { invoker: trigger } });

        assert.equal(modal._lastInvoker, trigger);
        assert.equal(modal.modalOpen, true);
    });
});

test('openModal falls back to the focused element for app-raised window events', () => {
    withWindow(() => {
        const { modal } = createModal();
        const focused = { nodeType: 1, id: 'focused' };
        globalThis.document.activeElement = focused;

        modal.openModal(new CustomEvent('open-account-dialog'));

        assert.equal(modal._lastInvoker, focused);
    });
});

test('openFromTrigger without an event name opens the modal directly', () => {
    withWindow(() => {
        const { modal } = createModal();
        const trigger = { nodeType: 1 };

        modal.openFromTrigger({ currentTarget: trigger, target: trigger });

        assert.equal(modal.modalOpen, true);
        assert.equal(modal._lastInvoker, trigger);
    });
});

test('closing returns focus to the trigger when the scope would restore into the closing panel', () => {
    withWindow(() => {
        const { modal } = createModal();
        let focused = null;
        const closeButton = { nodeType: 1 };
        const trigger = { nodeType: 1, isConnected: true, focus() { focused = trigger; } };
        const panel = { contains: (node) => node === closeButton };
        modal.$refs = { rzModalPanel: panel };
        modal._lastInvoker = trigger;
        // x-trap had already focused the close button when the focus scope was activated.
        modal._focusScope = { deactivate: () => closeButton };

        modal._deactivateAccessibility();

        assert.equal(focused, trigger);
    });
});

test('the teleported panel is resolved through $refs before falling back to the component root', () => {
    const { modal } = createModal();
    const panel = { id: 'panel' };
    modal.$refs = { rzModalPanel: panel };
    modal.$el.querySelector = () => null;

    assert.equal(modal._resolveDialogElement(), panel);
});

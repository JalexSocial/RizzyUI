import test from 'node:test';
import assert from 'node:assert/strict';
import { registerDismissableLayer } from '../dismissableLayer.js';

class FakeCustomEvent {
  constructor(type, init = {}) {
    this.type = type;
    this.detail = init.detail;
    this.bubbles = !!init.bubbles;
    this.cancelable = !!init.cancelable;
    this.defaultPrevented = false;
  }
  preventDefault() {
    if (this.cancelable) {
      this.defaultPrevented = true;
    }
  }
}

class FakeElement {
  constructor(name, doc) {
    this.name = name;
    this.nodeType = 1;
    this.ownerDocument = doc;
    this.parentElement = null;
    this.children = [];
    this.listeners = new Map();
  }

  append(child) {
    child.parentElement = this;
    this.children.push(child);
  }

  contains(element) {
    return element === this || this.children.some((child) => child.contains(element));
  }

  addEventListener(type, listener) {
    const list = this.listeners.get(type) ?? [];
    list.push(listener);
    this.listeners.set(type, list);
  }

  dispatchEvent(event) {
    const list = this.listeners.get(event.type) ?? [];
    list.forEach((listener) => listener(event));
    return !event.defaultPrevented;
  }
}

function createDocument() {
  return {
    listeners: new Map(),
    addEventListener(type, handler) {
      this.listeners.set(type, handler);
    },
    removeEventListener(type) {
      this.listeners.delete(type);
    }
  };
}

function createKeyboardEvent(key) {
  return {
    key,
    defaultPrevented: false,
    preventDefault() {
      this.defaultPrevented = true;
    }
  };
}

function createPointerEvent(target) {
  return {
    target,
    defaultPrevented: false,
    preventDefault() {
      this.defaultPrevented = true;
    },
    composedPath() {
      const path = [];
      let current = target;
      while (current) {
        path.push(current);
        current = current.parentElement;
      }
      return path;
    }
  };
}

test.beforeEach(() => {
  globalThis.document = createDocument();
  globalThis.CustomEvent = FakeCustomEvent;
});

test.afterEach(() => {
  delete globalThis.document;
  delete globalThis.CustomEvent;
});

test('registering one layer attaches listeners and handles escape/outside pointer dismissal', () => {
  const doc = globalThis.document;
  const root = new FakeElement('root', doc);
  const inside = new FakeElement('inside', doc);
  const outside = new FakeElement('outside', doc);
  root.append(inside);

  const reasons = [];
  const unregister = registerDismissableLayer({
    root,
    onDismiss: ({ reason }) => reasons.push(reason)
  });

  assert.equal(doc.listeners.has('keydown'), true);
  assert.equal(doc.listeners.has('pointerdown'), true);
  assert.equal(doc.listeners.has('focusin'), true);

  doc.listeners.get('keydown')(createKeyboardEvent('Escape'));
  doc.listeners.get('pointerdown')(createPointerEvent(inside));
  doc.listeners.get('pointerdown')(createPointerEvent(outside));

  assert.deepEqual(reasons, ['escape', 'outside-pointer']);

  unregister();
  assert.equal(doc.listeners.size, 0);
});

test('stack semantics: only topmost layer receives escape and outside interactions', () => {
  const doc = globalThis.document;
  const outerRoot = new FakeElement('outer', doc);
  const innerRoot = new FakeElement('inner', doc);
  const outside = new FakeElement('outside', doc);

  const events = [];

  const unregisterOuter = registerDismissableLayer({
    root: outerRoot,
    onDismiss: ({ reason }) => events.push(`outer:${reason}`)
  });

  const unregisterInner = registerDismissableLayer({
    root: innerRoot,
    onDismiss: ({ reason }) => events.push(`inner:${reason}`)
  });

  doc.listeners.get('keydown')(createKeyboardEvent('Escape'));
  doc.listeners.get('pointerdown')(createPointerEvent(outside));

  unregisterInner();

  doc.listeners.get('keydown')(createKeyboardEvent('Escape'));

  assert.deepEqual(events, ['inner:escape', 'inner:outside-pointer', 'outer:escape']);

  unregisterOuter();
});

test('rz:dismiss preventDefault cancels dismissal callback', () => {
  const doc = globalThis.document;
  const root = new FakeElement('root', doc);
  const outside = new FakeElement('outside', doc);

  root.addEventListener('rz:dismiss', (event) => {
    event.preventDefault();
  });

  let dismissCount = 0;
  const unregister = registerDismissableLayer({
    root,
    onDismiss: () => {
      dismissCount += 1;
    }
  });

  doc.listeners.get('pointerdown')(createPointerEvent(outside));

  assert.equal(dismissCount, 0);

  unregister();
});

test('outside focus dismissal is optional via dismissOnOutsideFocus', () => {
  const doc = globalThis.document;
  const root = new FakeElement('root', doc);
  const outside = new FakeElement('outside', doc);
  const reasons = [];

  const unregister = registerDismissableLayer({
    root,
    dismissOnOutsideFocus: true,
    onDismiss: ({ reason }) => reasons.push(reason)
  });

  const focusEvent = createPointerEvent(outside);
  doc.listeners.get('focusin')(focusEvent);

  assert.deepEqual(reasons, ['outside-focus']);

  unregister();
});

import assert from 'node:assert/strict';
import test from 'node:test';
import rzEmbeddedPreview from '../rzEmbeddedPreview.js';
import rzNumberTicker from '../rzNumberTicker.js';

// RZUI-029: components removed by an htmx swap must release observers, timers and listeners in
// destroy(), which Alpine calls.

function installResizeObserver() {
  const observers = [];
  globalThis.ResizeObserver = class {
    constructor(callback) {
      this.callback = callback;
      this.disconnected = false;
      observers.push(this);
    }
    observe() {}
    disconnect() { this.disconnected = true; }
  };
  return observers;
}

// rzProgress no longer observes layout: it holds state and the markup binds to it (see
// rzProgress.test.mjs), so it has nothing to release.

test('rzEmbeddedPreview keeps one retry, and destroy() clears it and disconnects', () => {
  const observers = installResizeObserver();
  const timers = new Set();
  let nextId = 1;
  const previous = { setTimeout: globalThis.setTimeout, clearTimeout: globalThis.clearTimeout, window: globalThis.window };
  globalThis.setTimeout = () => { const id = nextId++; timers.add(id); return id; };
  globalThis.clearTimeout = id => timers.delete(id);
  globalThis.window = { addEventListener() {}, removeEventListener() {} };

  try {
    // An iframe whose document has no body yet.
    const iframe = { contentDocument: { body: null }, style: {} };
    const component = rzEmbeddedPreview();
    component.$refs = { iframe };
    component.init();

    // Repeated attempts while the body is missing schedule a single retry, not one timer each.
    component.resizeIframe(iframe);
    component.resizeIframe(iframe);
    assert.equal(timers.size, 1);

    component.destroy();
    assert.equal(timers.size, 0);
    assert.equal(observers[0].disconnected, true);
  } finally {
    globalThis.setTimeout = previous.setTimeout;
    globalThis.clearTimeout = previous.clearTimeout;
    globalThis.window = previous.window;
  }
});

test('rzNumberTicker destroy() runs its cleanup', () => {
  const component = rzNumberTicker();
  let disconnected = false;
  let cancelled = false;
  component.observer = { disconnect: () => { disconnected = true; } };
  component.cleanupAnimation = () => { cancelled = true; };

  component.destroy();

  assert.equal(disconnected, true);
  assert.equal(cancelled, true);
  assert.equal(component.observer, null);
});

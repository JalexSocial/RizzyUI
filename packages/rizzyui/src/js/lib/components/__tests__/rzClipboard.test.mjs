import test from 'node:test';
import assert from 'node:assert/strict';
import registerRzClipboard from '../rzClipboard.js';

function setNavigator(value) {
  Object.defineProperty(globalThis, 'navigator', { value, configurable: true, writable: true });
}

function setWindow(value) {
  Object.defineProperty(globalThis, 'window', { value, configurable: true, writable: true });
}

function createFactory() {
  let factory = null;
  const Alpine = {
    data(name, fn) {
      if (name === 'rzClipboard') factory = fn;
    },
  };
  registerRzClipboard(Alpine);
  assert.ok(factory, 'rzClipboard factory should be registered');
  return factory;
}

function createComponent(factory, datasetOverrides = {}) {
  const events = [];
  const cmp = factory();
  cmp.$el = {
    dataset: {
      alpineRoot: 'clipboard-1',
      copyValue: '',
      targetSelector: '',
      preferValue: 'false',
      feedbackDuration: '1200',
      useFallback: 'true',
      disabled: 'false',
      ...datasetOverrides,
    },
  };
  cmp.$dispatch = (name, detail) => events.push({ name, detail });
  cmp.init();
  return { cmp, events };
}

test('uses preferValue when both source options exist', () => {
  const factory = createFactory();
  const target = { value: 'from-target' };
  global.document = { querySelector: () => target };

  const { cmp } = createComponent(factory, {
    copyValue: 'from-value',
    targetSelector: '#target',
    preferValue: 'true',
  });

  assert.equal(cmp.getTextToCopy(), 'from-value');
});

test('dispatches copy-failed when text is empty', async () => {
  const factory = createFactory();
  setNavigator({ clipboard: { writeText: async () => {} } });
  setWindow({ isSecureContext: true });

  const { cmp, events } = createComponent(factory, { copyValue: '   ' });

  await cmp.copy();

  assert.equal(events.length, 1);
  assert.equal(events[0].name, 'rz:copy-failed');
  assert.equal(events[0].detail.reason, 'empty-text');
});

test('dispatches copy-failed when clipboard API rejects', async () => {
  const factory = createFactory();
  const err = new Error('denied');
  setNavigator({ clipboard: { writeText: async () => { throw err; } } });
  setWindow({ isSecureContext: true });

  const { cmp, events } = createComponent(factory, { copyValue: 'abc' });

  await cmp.copy();

  assert.equal(events.length, 1);
  assert.equal(events[0].name, 'rz:copy-failed');
  assert.equal(events[0].detail.reason, 'permission-denied');
  assert.equal(events[0].detail.error, err);
});

test('isolates copied state across multiple instances', async () => {
  const factory = createFactory();
  setNavigator({ clipboard: { writeText: async () => {} } });
  setWindow({ isSecureContext: true });

  const first = createComponent(factory, { alpineRoot: 'clipboard-a', copyValue: 'one' });
  const second = createComponent(factory, { alpineRoot: 'clipboard-b', copyValue: 'two' });

  await first.cmp.copy();

  assert.equal(first.cmp.copied, true);
  assert.equal(second.cmp.copied, false);
  assert.equal(first.events[0].name, 'rz:copy');
  assert.equal(first.events[0].detail.id, 'clipboard-a');
});

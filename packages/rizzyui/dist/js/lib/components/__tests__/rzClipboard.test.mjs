import test, { afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { resolveRegisteredComponentFactoryForTest } from './componentFactoryTestHelpers.mjs';

const globalKeys = ['document', 'navigator', 'window'];
const originalDescriptors = new Map(globalKeys.map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
const createdComponents = new Set();

function setGlobal(key, value) {
  Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
}

function setNavigator(value) {
  setGlobal('navigator', value);
}

function setWindow(value) {
  setGlobal('window', value);
}

function restoreGlobal(key) {
  const descriptor = originalDescriptors.get(key);

  if (descriptor) {
    Object.defineProperty(globalThis, key, descriptor);
  } else {
    delete globalThis[key];
  }
}

afterEach(() => {
  for (const component of createdComponents) {
    if (component.timeoutHandle) {
      clearTimeout(component.timeoutHandle);
      component.timeoutHandle = null;
    }
  }

  createdComponents.clear();

  for (const key of globalKeys) {
    restoreGlobal(key);
  }
});

async function createFactory() {
  return await resolveRegisteredComponentFactoryForTest('rzClipboard');
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
  createdComponents.add(cmp);
  return { cmp, events };
}

test('uses preferValue when both source options exist', async () => {
  const factory = await createFactory();
  const target = { value: 'from-target' };
  setGlobal('document', { querySelector: () => target });

  const { cmp } = createComponent(factory, {
    copyValue: 'from-value',
    targetSelector: '#target',
    preferValue: 'true',
  });

  assert.equal(cmp.getTextToCopy(), 'from-value');
});

test('dispatches copy-failed when text is empty', async () => {
  const factory = await createFactory();
  setNavigator({ clipboard: { writeText: async () => {} } });
  setWindow({ isSecureContext: true });

  const { cmp, events } = createComponent(factory, { copyValue: '   ' });

  await cmp.copy();

  assert.equal(events.length, 1);
  assert.equal(events[0].name, 'rz:copy-failed');
  assert.equal(events[0].detail.reason, 'empty-text');
});

test('dispatches copy-failed when clipboard API rejects', async () => {
  const factory = await createFactory();
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
  const factory = await createFactory();
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

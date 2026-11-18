import test, { afterEach, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import loadjs from '../../loadjs/loadjs.js';
import { getBundleId } from '../../../runtime/rizzyRequire.js';
import { toFlatpickrOptions } from '../rzDateEdit.js';
import { resolveRegisteredComponentFactoryForTest } from './componentFactoryTestHelpers.mjs';

const FLATPICKR_URL = 'https://cdn.example.test/flatpickr.js';
const globalKeys = ['document', 'window'];
const originalDescriptors = new Map(globalKeys.map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));

function setGlobal(key, value) {
  Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
}

// rizzyRequire skips loading a bundle that loadjs already knows. Registering the bundle as loaded
// lets the success callback run without a DOM.
function markAssetsLoaded(paths) {
  const bundleId = getBundleId(paths);
  loadjs([], bundleId);
  loadjs.done(bundleId);
}

function installFakeFlatpickr() {
  const calls = [];
  const instances = [];
  const flatpickr = (element, options) => {
    const instance = { element, options, destroyed: false, destroy() { this.destroyed = true; } };
    calls.push({ element, options });
    instances.push(instance);
    return instance;
  };
  return { flatpickr, calls, instances };
}

const inputs = new Map();

function createComponent(factory, { config, assets = JSON.stringify([FLATPICKR_URL]), uid = 'rzdate-1', inputId } = {}) {
  const input = { id: inputId ?? `${uid}-input` };
  inputs.set(input.id, input);
  setGlobal('document', { getElementById: (id) => inputs.get(id) ?? null });
  const component = factory();
  component.$el = {
    dataset: {
      config: config === undefined ? JSON.stringify({ options: { dateFormat: 'd/m/Y', minDate: '2026-01-01', locale: 'en' }, placeholder: 'Pick a date', prependText: 'On' }) : config,
      uid,
      ...(inputId === undefined ? {} : { inputId }),
      ...(assets === null ? {} : { assets }),
      nonce: 'nonce-1',
    },
  };
  return { component, input };
}

// rizzyRequire resolves asynchronously, so wait on time, not ticks.
async function waitFor(predicate, message, timeoutMs = 2000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (predicate()) return;
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
  assert.fail(message);
}

beforeEach(async () => {
  loadjs.reset();
  await markAssetsLoaded([FLATPICKR_URL]);
});

afterEach(() => {
  loadjs.reset();
  inputs.clear();
  for (const key of globalKeys) {
    const descriptor = originalDescriptors.get(key);
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else delete globalThis[key];
  }
});

test('rzDateEdit passes the server options to flatpickr on its input', async () => {
  const fake = installFakeFlatpickr();
  setGlobal('window', { flatpickr: fake.flatpickr });
  const factory = await resolveRegisteredComponentFactoryForTest('rzDateEdit');
  const { component, input } = createComponent(factory);

  component.init();
  await waitFor(() => fake.calls.length === 1, 'flatpickr was not initialized');

  assert.equal(fake.calls[0].element, input);
  const { minDate, ...rest } = fake.calls[0].options;
  assert.deepEqual(rest, { dateFormat: 'd/m/Y', locale: 'en' });
  assert.ok(minDate instanceof Date);
  assert.deepEqual([minDate.getFullYear(), minDate.getMonth(), minDate.getDate()], [2026, 0, 1]);
  assert.equal(component.placeholder, 'Pick a date');
  assert.equal(component.prependText, 'On');
});

test('rzDateEdit gives each instance its own copy of the options', async () => {
  const fake = installFakeFlatpickr();
  setGlobal('window', { flatpickr: fake.flatpickr });
  const factory = await resolveRegisteredComponentFactoryForTest('rzDateEdit');
  const { component } = createComponent(factory);

  component.init();
  await waitFor(() => fake.calls.length === 1, 'flatpickr was not initialized');
  fake.calls[0].options.dateFormat = 'mutated';

  assert.equal(component.options.dateFormat, 'd/m/Y');
});

test('destroy() destroys the flatpickr instance', async () => {
  const fake = installFakeFlatpickr();
  setGlobal('window', { flatpickr: fake.flatpickr });
  const factory = await resolveRegisteredComponentFactoryForTest('rzDateEdit');
  const { component } = createComponent(factory);

  component.init();
  await waitFor(() => fake.instances.length === 1, 'flatpickr was not initialized');
  assert.equal(typeof component.destroy, 'function');
  component.destroy();
  component.destroy();

  assert.equal(fake.instances[0].destroyed, true);
});

test('destroy() before the assets load prevents a late flatpickr instance', async () => {
  const fake = installFakeFlatpickr();
  setGlobal('window', { flatpickr: fake.flatpickr });
  const factory = await resolveRegisteredComponentFactoryForTest('rzDateEdit');
  const { component } = createComponent(factory);

  // A second instance that is not destroyed shows when the shared asset bundle has resolved.
  const { component: witness } = createComponent(factory, { uid: 'rzdate-2' });
  component.init();
  component.destroy();
  witness.init();
  await waitFor(() => fake.calls.length === 1, 'the witness instance was not initialized');

  assert.equal(fake.calls.length, 1);
  assert.equal(fake.calls[0].element.id, 'rzdate-2-input');
});

test('rzDateEdit tolerates missing or invalid data attributes', async () => {
  const fake = installFakeFlatpickr();
  setGlobal('window', { flatpickr: fake.flatpickr });
  const factory = await resolveRegisteredComponentFactoryForTest('rzDateEdit');
  const originalError = console.error;
  const errors = [];
  console.error = (...args) => errors.push(args);
  try {
    // No asset list: flatpickr was loaded by the application, so it is used directly.
    const { component } = createComponent(factory, { config: '{not json', assets: null });
    assert.doesNotThrow(() => component.init());
    await waitFor(() => fake.calls.length === 1, 'flatpickr was not initialized without assets');
    assert.deepEqual(fake.calls[0].options, {});
    assert.ok(errors.length >= 1, 'invalid JSON is reported');
  } finally {
    console.error = originalError;
  }
});

test('toFlatpickrOptions converts the server ISO dates so custom date formats cannot misread them', () => {
  const local = (y, m, d, h = 0, mi = 0) => new Date(y, m - 1, d, h, mi).getTime();
  const input = {
    dateFormat: 'd/m/Y',
    defaultDate: '2026-11-20',
    minDate: '2026-11-01T00:00:00',
    maxDate: '2026-12-31T00:00:00',
    disable: [{ from: '2026-11-10T00:00:00', to: '2026-11-12T00:00:00' }, '2026-11-25'],
    minTime: '0001-01-01T09:30:00',
    locale: 'en',
    enableTime: true,
  };

  const result = toFlatpickrOptions(input);

  assert.equal(result.defaultDate.getTime(), local(2026, 11, 20));
  assert.equal(result.minDate.getTime(), local(2026, 11, 1));
  assert.equal(result.maxDate.getTime(), local(2026, 12, 31));
  assert.equal(result.disable[0].from.getTime(), local(2026, 11, 10));
  assert.equal(result.disable[0].to.getTime(), local(2026, 11, 12));
  assert.equal(result.disable[1].getTime(), local(2026, 11, 25));
  assert.equal(result.minTime, '09:30');
  assert.equal(result.dateFormat, 'd/m/Y');
  assert.equal(result.locale, 'en');
  assert.equal(result.enableTime, true);
  // Non-ISO values are passed through, and the input is not changed.
  assert.equal(toFlatpickrOptions({ minDate: 'today' }).minDate, 'today');
  assert.equal(input.minDate, '2026-11-01T00:00:00');
});

test('rzDateEdit finds its input by data-input-id (the form field id)', async () => {
  const fake = installFakeFlatpickr();
  setGlobal('window', { flatpickr: fake.flatpickr });
  const factory = await resolveRegisteredComponentFactoryForTest('rzDateEdit');
  const { component, input } = createComponent(factory, { inputId: 'StartDate-x1' });

  component.init();
  await waitFor(() => fake.calls.length === 1, 'flatpickr was not initialized');

  assert.equal(input.id, 'StartDate-x1');
  assert.equal(fake.calls[0].element, input);
});

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

async function loadDefaultFactory(path, exportedName) {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  const executableSource = `${source.replace(`export default function ${exportedName}()`, `function ${exportedName}()`)}\nreturn ${exportedName};`;
  return new Function(executableSource)();
}

function createTrigger(value, options = {}) {
  const attrs = new Map(Object.entries(options.attrs ?? {}));
  if (options.disabled) {
    attrs.set('aria-disabled', 'true');
  }

  return {
    dataset: { value },
    disabled: options.nativeDisabled ?? false,
    focused: false,
    getAttribute(name) {
      return attrs.has(name) ? attrs.get(name) : null;
    },
    hasAttribute(name) {
      return attrs.has(name);
    },
    focus() {
      this.focused = true;
    }
  };
}

function createTabsInstance(rzTabs, triggers, defaultValue = '') {
  const tabs = rzTabs();
  tabs.$el = {
    dataset: { defaultValue },
    querySelectorAll(selector) {
      return selector === '[role="tab"]' ? triggers : [];
    }
  };
  tabs.$dispatch = (name, detail) => {
    tabs.dispatched.push({ name, detail });
  };
  tabs.$nextTick = (callback) => callback();
  tabs.dispatched = [];
  return tabs;
}

function withMutationObserver(callback) {
  const original = globalThis.MutationObserver;
  globalThis.MutationObserver = class {
    observe() { }
    disconnect() { this.disconnected = true; }
  };

  try {
    callback();
  } finally {
    globalThis.MutationObserver = original;
  }
}

test('rzTabs initializes to default value or first enabled tab', async () => {
  const rzTabs = await loadDefaultFactory('../src/js/lib/components/rzTabs.js', 'rzTabs');
  const triggers = [createTrigger('account'), createTrigger('password'), createTrigger('billing')];

  withMutationObserver(() => {
    const defaultTabs = createTabsInstance(rzTabs, triggers, 'password');
    defaultTabs.init();
    assert.equal(defaultTabs.selectedTab, 'password');

    const fallbackTabs = createTabsInstance(rzTabs, [createTrigger('disabled', { disabled: true }), createTrigger('enabled')], 'missing');
    fallbackTabs.init();
    assert.equal(fallbackTabs.selectedTab, 'enabled');
  });
});

test('rzTabs exposes selected, roving tabindex, hidden panel, and disabled attributes', async () => {
  const rzTabs = await loadDefaultFactory('../src/js/lib/components/rzTabs.js', 'rzTabs');
  const trigger = createTrigger('account');
  const disabledTrigger = createTrigger('disabled', { disabled: true });
  const activePanel = createTrigger('account');
  const inactivePanel = createTrigger('password');
  const tabs = createTabsInstance(rzTabs, [trigger, disabledTrigger], 'account');
  tabs.selectedTab = 'account';

  tabs.$el = trigger;
  assert.equal(tabs._attrAriaSelected(), 'true');
  assert.equal(tabs._attrTabIndex(), '0');
  assert.equal(tabs._attrDataState(), 'active');
  assert.equal(tabs._attrDisabled(), null);

  tabs.$el = disabledTrigger;
  assert.equal(tabs._attrAriaSelected(), 'false');
  assert.equal(tabs._attrTabIndex(), '-1');
  assert.equal(tabs._attrDataState(), 'inactive');
  assert.equal(tabs._attrDisabled(), 'true');

  tabs.$el = activePanel;
  assert.equal(tabs._attrHidden(), null);
  assert.equal(tabs._attrAriaHidden(), 'false');

  tabs.$el = inactivePanel;
  assert.equal(tabs._attrHidden(), 'true');
  assert.equal(tabs._attrAriaHidden(), 'true');
});

test('rzTabs click activation dispatches rz:tabs-change only for enabled value changes', async () => {
  const rzTabs = await loadDefaultFactory('../src/js/lib/components/rzTabs.js', 'rzTabs');
  const account = createTrigger('account');
  const password = createTrigger('password');
  const disabled = createTrigger('disabled', { disabled: true });
  const tabs = createTabsInstance(rzTabs, [account, password, disabled], 'account');
  tabs.selectedTab = 'account';

  tabs.onTriggerClick({ currentTarget: password });
  tabs.onTriggerClick({ currentTarget: password });
  tabs.onTriggerClick({ currentTarget: disabled });

  assert.equal(tabs.selectedTab, 'password');
  assert.deepEqual(tabs.dispatched, [{ name: 'rz:tabs-change', detail: { value: 'password' } }]);
});

test('rzTabs horizontal arrow, Home, and End navigation use automatic activation and skip disabled tabs', async () => {
  const rzTabs = await loadDefaultFactory('../src/js/lib/components/rzTabs.js', 'rzTabs');
  const account = createTrigger('account');
  const disabled = createTrigger('disabled', { disabled: true });
  const password = createTrigger('password');
  const billing = createTrigger('billing');
  const tabs = createTabsInstance(rzTabs, [account, disabled, password, billing], 'account');
  tabs.refreshTriggers();
  tabs.selectedTab = 'account';
  let prevented = 0;
  const list = { getAttribute: (name) => name === 'aria-orientation' ? 'horizontal' : null };

  tabs.onListKeydown({ key: 'ArrowRight', target: account, currentTarget: list, preventDefault: () => prevented += 1 });
  tabs.onListKeydown({ key: 'End', target: password, currentTarget: list, preventDefault: () => prevented += 1 });
  tabs.onListKeydown({ key: 'ArrowRight', target: billing, currentTarget: list, preventDefault: () => prevented += 1 });
  tabs.onListKeydown({ key: 'Home', target: account, currentTarget: list, preventDefault: () => prevented += 1 });
  tabs.onListKeydown({ key: 'ArrowDown', target: account, currentTarget: list, preventDefault: () => prevented += 1 });

  assert.equal(tabs.selectedTab, 'account');
  assert.equal(prevented, 4);
  assert.equal(password.focused, true);
  assert.equal(billing.focused, true);
  assert.equal(account.focused, true);
  assert.deepEqual(tabs.dispatched.map(event => event.detail.value), ['password', 'billing', 'account']);
});

test('rzTabs vertical arrow navigation ignores horizontal arrows and does not handle Tab Enter or Space', async () => {
  const rzTabs = await loadDefaultFactory('../src/js/lib/components/rzTabs.js', 'rzTabs');
  const account = createTrigger('account');
  const password = createTrigger('password');
  const tabs = createTabsInstance(rzTabs, [account, password], 'account');
  tabs.refreshTriggers();
  tabs.selectedTab = 'account';
  let prevented = 0;
  const list = { getAttribute: (name) => name === 'aria-orientation' ? 'vertical' : null };

  tabs.onListKeydown({ key: 'ArrowRight', target: account, currentTarget: list, preventDefault: () => prevented += 1 });
  tabs.onListKeydown({ key: 'Tab', target: account, currentTarget: list, preventDefault: () => prevented += 1 });
  tabs.onListKeydown({ key: 'Enter', target: account, currentTarget: list, preventDefault: () => prevented += 1 });
  tabs.onListKeydown({ key: ' ', target: account, currentTarget: list, preventDefault: () => prevented += 1 });
  tabs.onListKeydown({ key: 'ArrowDown', target: account, currentTarget: list, preventDefault: () => prevented += 1 });

  assert.equal(tabs.selectedTab, 'password');
  assert.equal(prevented, 1);
  assert.equal(password.focused, true);
});

test('rzTabs runtime name remains in the core-common bundle manifest', async () => {
  const bundleSource = await readFile(new URL('../src/js/bundles/core-common.js', import.meta.url), 'utf8');
  const manifestSource = await readFile(new URL('../src/js/runtime/componentBundleManifest.js', import.meta.url), 'utf8');

  assert.match(bundleSource, /export \{ default as rzTabs \} from '\.\.\/lib\/components\/rzTabs\.js';/);
  assert.match(manifestSource, /rzTabs:\s*'core-common'/);
});

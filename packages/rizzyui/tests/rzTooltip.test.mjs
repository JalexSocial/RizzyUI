import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

async function loadTooltipFactory() {
  const source = await readFile(new URL('../src/js/lib/components/rzTooltip.js', import.meta.url), 'utf8');
  const withoutImports = source.replace(/import \{[^}]+\} from '@floating-ui\/dom';\n/, '');
  const executableSource = `${withoutImports.replace('export default function rzTooltip()', 'function rzTooltip()')}\nreturn rzTooltip;`;
  return new Function('autoUpdate', 'computePosition', 'offset', 'flip', 'shift', 'arrow', executableSource)(
    () => () => {},
    () => Promise.resolve({ x: 0, y: 0, placement: 'top', middlewareData: {} }),
    (options) => ({ name: 'offset', options }),
    () => ({ name: 'flip' }),
    (options) => ({ name: 'shift', options }),
    (options) => ({ name: 'arrow', options })
  );
}

function createElement(dataset = {}) {
  const listeners = new Map();
  return {
    dataset,
    style: {},
    focused: false,
    addEventListener(type, callback) {
      const callbacks = listeners.get(type) ?? [];
      callbacks.push(callback);
      listeners.set(type, callbacks);
    },
    dispatch(type, event = {}) {
      for (const callback of listeners.get(type) ?? []) {
        callback(event);
      }
    },
    focus() {
      this.focused = true;
    },
    listenerCount(type) {
      return (listeners.get(type) ?? []).length;
    },
    querySelector(selector) {
      if (selector === '[data-slot="tooltip-trigger"]') return this.triggerEl ?? null;
      if (selector === '[data-slot="tooltip-content"]') return this.contentEl ?? null;
      if (selector === '[data-slot="tooltip-arrow"]') return this.arrowEl ?? null;
      return null;
    }
  };
}

function createTooltipInstance(rzTooltip, dataset = {}) {
  const root = createElement(dataset);
  const trigger = createElement({ state: 'closed' });
  const content = createElement({ state: 'closed' });
  const tooltip = rzTooltip();
  root.triggerEl = trigger;
  root.contentEl = content;
  tooltip.$el = root;
  tooltip.$refs = { trigger, content };
  tooltip.$watch = (property, callback) => {
    tooltip.watchedProperty = property;
    tooltip.watcher = callback;
  };
  tooltip.$nextTick = (callback) => callback();
  return { tooltip, root, trigger, content };
}

test('rzTooltip shows on focus and hover while preserving configured delays', async () => {
  const rzTooltip = await loadTooltipFactory();
  const { tooltip, trigger } = createTooltipInstance(rzTooltip, {
    delayDuration: '0',
    skipDelayDuration: '0',
    disableHoverableContent: 'false'
  });

  tooltip.init();
  trigger.dispatch('focus');
  tooltip.watcher(true);
  assert.equal(tooltip.open, true);
  assert.equal(tooltip.ariaHidden, 'false');
  assert.equal(tooltip.state, 'open');

  tooltip.watcher(false);
  trigger.dispatch('pointerenter');
  assert.equal(tooltip.open, true);
});

test('rzTooltip hides on blur and pointer leave without trapping focus', async () => {
  const rzTooltip = await loadTooltipFactory();
  const { tooltip, trigger } = createTooltipInstance(rzTooltip, { delayDuration: '0', skipDelayDuration: '0' });

  tooltip.init();
  trigger.dispatch('focus');
  tooltip.watcher(true);
  assert.equal(tooltip.open, true);

  trigger.dispatch('blur');
  tooltip.watcher(false);
  assert.equal(tooltip.open, false);
  assert.equal(tooltip.ariaHidden, 'true');

  trigger.dispatch('pointerenter');
  tooltip.watcher(true);
  trigger.dispatch('pointerleave');
  assert.equal(tooltip.open, false);
  assert.equal(trigger.focused, false);
});

test('rzTooltip Escape closes from trigger and content and restores trigger focus', async () => {
  const rzTooltip = await loadTooltipFactory();
  const { tooltip, trigger, content } = createTooltipInstance(rzTooltip, { delayDuration: '0', skipDelayDuration: '0' });
  let prevented = 0;

  tooltip.init();
  trigger.dispatch('focus');
  tooltip.watcher(true);
  assert.equal(tooltip.open, true);

  trigger.dispatch('keydown', { key: 'Escape', preventDefault: () => prevented += 1 });
  assert.equal(tooltip.open, false);
  assert.equal(trigger.focused, true);

  trigger.focused = false;
  tooltip.open = true;
  tooltip.watcher(true);
  content.dispatch('keydown', { key: 'Escape', preventDefault: () => prevented += 1 });
  assert.equal(tooltip.open, false);
  assert.equal(trigger.focused, true);
  assert.equal(prevented, 2);
});

test('rzTooltip preserves hoverable content unless disabled', async () => {
  const rzTooltip = await loadTooltipFactory();
  const { tooltip, trigger, content } = createTooltipInstance(rzTooltip, {
    delayDuration: '0',
    closeDelayDuration: '100',
    disableHoverableContent: 'false'
  });
  let timeoutCallbacks = [];
  const originalSetTimeout = globalThis.setTimeout;
  const originalClearTimeout = globalThis.clearTimeout;
  globalThis.window = {
    setTimeout(callback) {
      timeoutCallbacks.push(callback);
      return callback;
    },
    clearTimeout(callback) {
      timeoutCallbacks = timeoutCallbacks.filter((item) => item !== callback);
    }
  };

  try {
    tooltip.init();
    trigger.dispatch('focus');
    trigger.dispatch('blur');
    assert.equal(timeoutCallbacks.length, 1);

    content.dispatch('pointerenter');
    assert.equal(timeoutCallbacks.length, 0);

    content.dispatch('pointerleave');
    assert.equal(timeoutCallbacks.length, 1);
  } finally {
    globalThis.setTimeout = originalSetTimeout;
    globalThis.clearTimeout = originalClearTimeout;
    delete globalThis.window;
  }
});

test('rzTooltip runtime names remain in the popover tooltip bundle manifest', async () => {
  const bundleSource = await readFile(new URL('../src/js/bundles/popover-tooltip-runtime.js', import.meta.url), 'utf8');
  const manifestSource = await readFile(new URL('../src/js/runtime/componentBundleManifest.js', import.meta.url), 'utf8');
  const registrySource = await readFile(new URL('../src/js/runtime/bundleLoaderRegistry.js', import.meta.url), 'utf8');

  assert.match(bundleSource, /export \{ default as rzTooltip \} from '\.\.\/lib\/components\/rzTooltip\.js';/);
  assert.match(bundleSource, /export \{ default as rzPopover \} from '\.\.\/lib\/components\/rzPopover\.js';/);
  assert.match(manifestSource, /rzTooltip:\s*'popover-tooltip-runtime'/);
  assert.match(manifestSource, /rzPopover:\s*'popover-tooltip-runtime'/);
  assert.match(registrySource, /'popover-tooltip-runtime':\s*\(\) => import\('\.\.\/bundles\/popover-tooltip-runtime\.js'\)/);
});

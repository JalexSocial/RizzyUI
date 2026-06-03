import assert from 'node:assert/strict';
import test from 'node:test';
import accordionItem from '../accordionItem.js';
import rzFileInput from '../rzFileInput.js';
import rzSidebar from '../rzSidebar.js';
import rzTabs from '../rzTabs.js';
import rzTooltip from '../rzTooltip.js';
import { componentBundleManifest } from '../../../runtime/componentBundleManifest.js';

class ListenerTarget {
  constructor(dataset = {}) {
    this.dataset = dataset;
    this.listeners = new Map();
    this.nodeType = 1;
    this.tagName = 'DIV';
    this.isContentEditable = false;
  }

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) ?? new Set();
    listeners.add(listener);
    this.listeners.set(type, listeners);
  }

  removeEventListener(type, listener) {
    this.listeners.get(type)?.delete(listener);
  }

  listenerCount(type) {
    return this.listeners.get(type)?.size ?? 0;
  }

  dispatchEvent(event) {
    this.listeners.get(event.type)?.forEach((listener) => listener(event));
    return true;
  }
}

function withGlobals(overrides, callback) {
  const previous = new Map(Object.keys(overrides).map((key) => [key, globalThis[key]]));
  Object.assign(globalThis, overrides);

  try {
    return callback();
  } finally {
    for (const [key, value] of previous.entries()) {
      if (typeof value === 'undefined') {
        delete globalThis[key];
      } else {
        globalThis[key] = value;
      }
    }
  }
}

test('Phase 3 Alpine components remain assigned to their expected async bundles', () => {
  assert.equal(componentBundleManifest.accordionItem, 'core-common');
  assert.equal(componentBundleManifest.rzAccordion, 'core-common');
  assert.equal(componentBundleManifest.rzAlert, 'core-common');
  assert.equal(componentBundleManifest.rzTabs, 'core-common');
  assert.equal(componentBundleManifest.rzFileInput, 'advanced-input-runtime');
  assert.equal(componentBundleManifest.rzTooltip, 'popover-tooltip-runtime');
  assert.equal(componentBundleManifest.rzSidebar, 'dialogs-panels-runtime');
  assert.equal(componentBundleManifest.rzToast, undefined);
  assert.equal(componentBundleManifest.rzToggletip, undefined);
});

test('tabs keyboard handling preserves APG roving focus and change event detail', () => {
  const first = new ListenerTarget({ value: 'first' });
  const second = new ListenerTarget({ value: 'second' });
  const disabled = new ListenerTarget({ value: 'disabled' });
  first.getAttribute = (name) => (name === 'role' ? 'tab' : null);
  second.getAttribute = (name) => (name === 'role' ? 'tab' : null);
  disabled.getAttribute = (name) => (name === 'role' ? 'tab' : name === 'aria-disabled' ? 'true' : null);
  first.hasAttribute = second.hasAttribute = disabled.hasAttribute = () => false;
  let focused = null;
  first.focus = () => { focused = first; };
  second.focus = () => { focused = second; };

  const list = { getAttribute: (name) => (name === 'aria-orientation' ? 'horizontal' : null) };
  const component = rzTabs();
  const events = [];
  component.$el = { querySelectorAll: () => [first, disabled, second] };
  component.$dispatch = (name, detail) => events.push({ name, detail });
  component.$nextTick = (callback) => callback();
  component.refreshTriggers();
  component.selectedTab = 'first';

  const event = {
    key: 'ArrowRight',
    currentTarget: list,
    target: first,
    prevented: false,
    preventDefault() { this.prevented = true; },
  };

  component.onListKeydown(event);

  assert.equal(event.prevented, true);
  assert.equal(component.selectedTab, 'second');
  assert.equal(focused, second);
  assert.deepEqual(events, [{ name: 'rz:tabs-change', detail: { value: 'second' } }]);
});

test('accordion keyboard handling preserves trigger focus navigation without duplicate handlers', () => {
  const triggers = ['one', 'two', 'three'].map((id) => ({
    id,
    disabled: false,
    getAttribute(name) { return name === 'aria-disabled' ? 'false' : null; },
    focusCalls: 0,
    focus() { this.focusCalls += 1; },
  }));
  const accordion = { querySelectorAll: () => triggers };
  const component = accordionItem();
  component.$el = { closest: () => accordion };

  const event = {
    key: 'End',
    currentTarget: triggers[0],
    prevented: false,
    preventDefault() { this.prevented = true; },
  };

  component.handleKeydown(event);

  assert.equal(event.prevented, true);
  assert.equal(triggers[2].focusCalls, 1);
  assert.equal(triggers[0].focusCalls, 0);
});

test('tooltip enhanced-navigation rebind removes old hover, focus, and Escape listeners', () => {
  const trigger = new ListenerTarget();
  const content = new ListenerTarget();
  const component = rzTooltip();
  component.triggerEl = trigger;
  component.contentEl = content;

  component.bindInteractionEvents();
  component.bindInteractionEvents();

  assert.equal(trigger.listenerCount('pointerenter'), 1);
  assert.equal(trigger.listenerCount('pointerleave'), 1);
  assert.equal(trigger.listenerCount('focus'), 1);
  assert.equal(trigger.listenerCount('blur'), 1);
  assert.equal(trigger.listenerCount('keydown'), 1);
  assert.equal(content.listenerCount('pointerenter'), 1);
  assert.equal(content.listenerCount('pointerleave'), 1);
  assert.equal(content.listenerCount('keydown'), 1);

  component.destroy();

  assert.equal(trigger.listenerCount('pointerenter'), 0);
  assert.equal(trigger.listenerCount('keydown'), 0);
  assert.equal(content.listenerCount('pointerenter'), 0);
  assert.equal(content.listenerCount('keydown'), 0);
});

test('sidebar enhanced-navigation init does not leave duplicate window listeners', () => {
  const listenerCounts = new Map();
  const windowTarget = {
    innerWidth: 1024,
    addEventListener(type, listener) {
      const listeners = listenerCounts.get(type) ?? new Set();
      listeners.add(listener);
      listenerCounts.set(type, listeners);
    },
    removeEventListener(type, listener) {
      listenerCounts.get(type)?.delete(listener);
    },
  };
  const root = new ListenerTarget({
    defaultOpen: 'true',
    collapsible: 'offcanvas',
    shortcut: 'b',
    cookieName: 'sidebar_state',
    mobileBreakpoint: '768',
  });

  withGlobals({
    window: windowTarget,
    document: { cookie: '' },
    CustomEvent: class CustomEvent {
      constructor(type, options = {}) {
        this.type = type;
        this.detail = options.detail;
        this.bubbles = options.bubbles;
      }
    },
  }, () => {
    const first = rzSidebar();
    first.$el = root;
    first.$watch = () => {};
    first.init();

    const second = rzSidebar();
    second.$el = root;
    second.$watch = () => {};
    second.init();

    assert.equal(listenerCounts.get('keydown')?.size, 1);
    assert.equal(listenerCounts.get('resize')?.size, 1);

    second.destroy();

    assert.equal(listenerCounts.get('keydown')?.size ?? 0, 0);
    assert.equal(listenerCounts.get('resize')?.size ?? 0, 0);
  });
});

test('file input announces granular changes and dispatches serializable state', () => {
  const component = rzFileInput();
  const events = [];
  component.$root = { dataset: { disabled: 'false' } };
  component.$refs = { input: { files: [{ name: 'report.pdf', size: 2048, type: 'application/pdf' }] } };
  component.$dispatch = (name, detail) => events.push({ name, detail });
  component.selectedCountTemplate = '{0} file(s) selected';
  component.removedTemplate = 'Removed {0}';
  component.clearedText = 'No files selected';
  component.removeLabelTemplate = 'Remove {0}';
  component.previewAltTemplate = 'Preview of {0}';

  component.syncFromInput({ announce: true, source: 'change' });

  assert.equal(component.statusText, '1 file(s) selected');
  assert.deepEqual(events, [{
    name: 'rz:file-input:state-change',
    detail: { source: 'change', count: 1, names: ['report.pdf'] },
  }]);
});

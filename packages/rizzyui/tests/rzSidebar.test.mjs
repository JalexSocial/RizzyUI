import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

async function loadDefaultFactory(path, exportedName) {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  const executableSource = `${source.replace(`export default function ${exportedName}()`, `function ${exportedName}()`)}\nreturn ${exportedName};`;
  return new Function(executableSource)();
}

function withBrowserEnvironment(callback, options = {}) {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;
  const originalCustomEvent = globalThis.CustomEvent;
  const listeners = { keydown: [], resize: [] };
  const cookies = { value: options.cookie ?? '' };

  globalThis.CustomEvent = class {
    constructor(type, init = {}) {
      this.type = type;
      this.detail = init.detail;
      this.bubbles = init.bubbles === true;
    }
  };

  globalThis.window = {
    innerWidth: options.innerWidth ?? 1024,
    addEventListener(type, handler) {
      listeners[type] ??= [];
      listeners[type].push(handler);
    },
    removeEventListener(type, handler) {
      listeners[type] = (listeners[type] ?? []).filter((candidate) => candidate !== handler);
    },
    dispatch(type, event = {}) {
      for (const handler of [...(listeners[type] ?? [])]) {
        handler(event);
      }
    },
    listenerCount(type) {
      return (listeners[type] ?? []).length;
    }
  };

  globalThis.document = {};
  Object.defineProperty(globalThis.document, 'cookie', {
    get() {
      return cookies.value;
    },
    set(value) {
      cookies.value = value;
    }
  });

  try {
    return callback({ window: globalThis.window, document: globalThis.document, cookies });
  } finally {
    globalThis.window = originalWindow;
    globalThis.document = originalDocument;
    globalThis.CustomEvent = originalCustomEvent;
  }
}

function createElement(dataset = {}) {
  return {
    dataset,
    events: [],
    dispatchEvent(event) {
      this.events.push(event);
      return true;
    }
  };
}

function createSidebarInstance(rzSidebar, dataset = {}, options = {}) {
  const sidebar = rzSidebar();
  sidebar.$el = createElement(dataset);
  sidebar.watchers = {};
  sidebar.$watch = (name, callback) => {
    sidebar.watchers[name] = callback;
  };
  sidebar.$nextTick = (callback) => callback();
  Object.assign(sidebar, options);
  return sidebar;
}

function keyboardEvent(key, options = {}) {
  return {
    key,
    ctrlKey: options.ctrlKey === true,
    metaKey: options.metaKey === true,
    defaultPrevented: options.defaultPrevented === true,
    target: options.target ?? { nodeType: 1, tagName: 'BODY' },
    preventDefaultCalled: false,
    preventDefault() {
      this.preventDefaultCalled = true;
    }
  };
}

test('rzSidebar initializes from data attributes, cookies, and runtime bundle metadata', async () => {
  const rzSidebar = await loadDefaultFactory('../src/js/lib/components/rzSidebar.js', 'rzSidebar');

  withBrowserEnvironment(() => {
    const sidebar = createSidebarInstance(rzSidebar, {
      defaultOpen: 'false',
      collapsible: 'icon',
      shortcut: 'k',
      cookieName: 'sidebar_state',
      mobileBreakpoint: '900'
    });

    document.cookie = 'sidebar_state=true';
    sidebar.init();

    assert.equal(sidebar.open, true);
    assert.equal(sidebar.collapsible, 'icon');
    assert.equal(sidebar.shortcut, 'k');
    assert.equal(sidebar.mobileBreakpoint, 900);
    assert.equal(sidebar.isMobile, false);
  });

  const bundleSource = await readFile(new URL('../src/js/bundles/dialogs-panels-runtime.js', import.meta.url), 'utf8');
  const manifestSource = await readFile(new URL('../src/js/runtime/componentBundleManifest.js', import.meta.url), 'utf8');
  assert.match(bundleSource, /export \{ default as rzSidebar \} from '\.\.\/lib\/components\/rzSidebar\.js';/);
  assert.match(manifestSource, /rzSidebar:\s*'dialogs-panels-runtime'/);
});

test('rzSidebar shortcut toggles desktop or mobile state and persists desktop state', async () => {
  const rzSidebar = await loadDefaultFactory('../src/js/lib/components/rzSidebar.js', 'rzSidebar');

  withBrowserEnvironment(({ window }) => {
    const sidebar = createSidebarInstance(rzSidebar, { defaultOpen: 'true', shortcut: 'b', cookieName: 'sidebar_state' });
    sidebar.init();

    const desktopEvent = keyboardEvent('b', { ctrlKey: true });
    window.dispatch('keydown', desktopEvent);
    sidebar.watchers.open(sidebar.open);

    assert.equal(desktopEvent.preventDefaultCalled, true);
    assert.equal(sidebar.open, false);
    assert.equal(document.cookie, 'sidebar_state=false; path=/; max-age=604800');
    assert.equal(sidebar.triggerExpanded, 'false');

    window.innerWidth = 500;
    window.dispatch('resize', {});
    sidebar.watchers.isMobile(sidebar.isMobile);

    const mobileEvent = keyboardEvent('B', { metaKey: true });
    window.dispatch('keydown', mobileEvent);
    sidebar.watchers.openMobile(sidebar.openMobile);

    assert.equal(mobileEvent.preventDefaultCalled, true);
    assert.equal(sidebar.isMobile, true);
    assert.equal(sidebar.openMobile, true);
    assert.equal(sidebar.mobileState, 'open');
    assert.equal(sidebar.triggerExpanded, 'true');
  });
});

test('rzSidebar does not duplicate global listeners across reinitialization and removes them on destroy', async () => {
  const rzSidebar = await loadDefaultFactory('../src/js/lib/components/rzSidebar.js', 'rzSidebar');

  withBrowserEnvironment(({ window }) => {
    const element = createElement({ defaultOpen: 'true' });
    const first = createSidebarInstance(rzSidebar);
    first.$el = element;
    const second = createSidebarInstance(rzSidebar);
    second.$el = element;

    first.init();
    assert.equal(window.listenerCount('keydown'), 1);
    assert.equal(window.listenerCount('resize'), 1);

    second.init();
    assert.equal(window.listenerCount('keydown'), 1);
    assert.equal(window.listenerCount('resize'), 1);

    second.destroy();
    assert.equal(window.listenerCount('keydown'), 0);
    assert.equal(window.listenerCount('resize'), 0);
  });
});

test('rzSidebar ignores shortcuts from editable targets and closes mobile state without changing desktop state', async () => {
  const rzSidebar = await loadDefaultFactory('../src/js/lib/components/rzSidebar.js', 'rzSidebar');

  withBrowserEnvironment(({ window }) => {
    const sidebar = createSidebarInstance(rzSidebar, { defaultOpen: 'true', shortcut: 'b' });
    sidebar.init();

    const inputEvent = keyboardEvent('b', { ctrlKey: true, target: { nodeType: 1, tagName: 'INPUT' } });
    window.dispatch('keydown', inputEvent);
    assert.equal(inputEvent.preventDefaultCalled, false);
    assert.equal(sidebar.open, true);

    window.innerWidth = 500;
    window.dispatch('resize', {});
    sidebar.openMobile = true;
    sidebar.close();

    assert.equal(sidebar.open, true);
    assert.equal(sidebar.openMobile, false);
  });
});

test('rzSidebar emits serializable state events for mobile and breakpoint changes', async () => {
  const rzSidebar = await loadDefaultFactory('../src/js/lib/components/rzSidebar.js', 'rzSidebar');

  withBrowserEnvironment(({ window }) => {
    const sidebar = createSidebarInstance(rzSidebar, { defaultOpen: 'true' });
    sidebar.init();

    window.innerWidth = 500;
    window.dispatch('resize', {});
    sidebar.watchers.isMobile(sidebar.isMobile);
    sidebar.setOpenMobile(true);
    sidebar.watchers.openMobile(sidebar.openMobile);

    const eventNames = sidebar.$el.events.map((event) => event.type);
    assert.deepEqual(eventNames, ['rz:sidebar:breakpoint-change', 'rz:sidebar:mobile-open', 'rz:sidebar:state-change']);
    assert.deepEqual(sidebar.$el.events.at(-1).detail, {
      open: true,
      openMobile: true,
      isMobile: true,
      desktopState: 'expanded',
      mobileState: 'open',
      collapsible: 'offcanvas'
    });
  });
});

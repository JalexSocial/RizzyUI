import test from 'node:test';
import assert from 'node:assert/strict';
import {
  announce,
  ensureLiveRegions,
  getAnnouncementHistory,
  clearAnnouncementHistory,
  clearLiveRegions,
  destroyLiveAnnouncer,
} from '../liveAnnouncer.js';

function createFakeDocument() {
  const nodes = new Map();

  function createElement(tagName) {
    return {
      tagName,
      id: '',
      textContent: '',
      parentElement: null,
      attributes: new Map(),
      setAttribute(name, value) { this.attributes.set(name, String(value)); },
      getAttribute(name) { return this.attributes.get(name) ?? null; },
    };
  }

  const body = {
    children: [],
    append(el) { el.parentElement = this; this.children.push(el); if (el.id) nodes.set(el.id, el); },
    removeChild(el) { this.children = this.children.filter((c) => c !== el); if (el.id) nodes.delete(el.id); el.parentElement = null; },
  };

  return {
    body,
    createElement,
    getElementById(id) { return nodes.get(id) ?? null; },
  };
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test.beforeEach(() => {
  globalThis.document = createFakeDocument();
  clearAnnouncementHistory();
});

test.afterEach(() => {
  destroyLiveAnnouncer();
  delete globalThis.document;
});

test('creates and reuses live regions', () => {
  const first = ensureLiveRegions();
  const second = ensureLiveRegions();

  assert.equal(first.polite, second.polite);
  assert.equal(first.assertive, second.assertive);
  assert.equal(document.body.children.length, 2);
  assert.equal(first.polite.getAttribute('aria-live'), 'polite');
  assert.equal(first.assertive.getAttribute('aria-live'), 'assertive');
});

test('polite announcements queue by default', async () => {
  announce('First polite', 'polite', { politeIntervalMs: 30, clearDelayMs: 300 });
  announce('Second polite', 'polite', { politeIntervalMs: 30, clearDelayMs: 300 });

  await delay(25);
  const regions = ensureLiveRegions();
  assert.equal(regions.polite.textContent, 'First polite');

  await delay(60);
  assert.equal(regions.polite.textContent, 'Second polite');
});

test('assertive announcements replace previous message by default', async () => {
  announce('First assertive', 'assertive');
  announce('Second assertive', 'assertive');

  await delay(25);
  const regions = ensureLiveRegions();
  assert.equal(regions.assertive.textContent, 'Second assertive');
});

test('duplicate announcements are suppressed in dedupe window', async () => {
  const first = announce('Duplicate message', 'polite');
  const second = announce('  Duplicate   message  ', 'polite');

  assert.equal(first, true);
  assert.equal(second, false);

  await delay(30);
  const history = getAnnouncementHistory();
  assert.equal(history.length, 1);
  assert.equal(history[0].message, 'Duplicate message');
});

test('history tracks sequence and tags', async () => {
  announce('Loaded data', 'polite', { tag: 'fetch' });
  announce('Connection lost', 'assertive', { tag: 'network' });

  await delay(30);

  const history = getAnnouncementHistory();
  assert.equal(history.length, 2);
  assert.deepEqual(history.map((entry) => entry.tag), ['fetch', 'network']);
  assert.deepEqual(history.map((entry) => entry.politeness), ['polite', 'assertive']);

  clearLiveRegions();
  const regions = ensureLiveRegions();
  assert.equal(regions.polite.textContent, '');
  assert.equal(regions.assertive.textContent, '');
});

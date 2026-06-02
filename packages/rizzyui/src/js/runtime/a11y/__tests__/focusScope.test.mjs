import test from 'node:test';
import assert from 'node:assert/strict';
import { createFocusScope } from '../focusScope.js';

class FakeElement {
  constructor(name, doc, opts = {}) {
    this.name = name;
    this.nodeType = 1;
    this.ownerDocument = doc;
    this.attributes = new Map();
    this.listeners = new Map();
    this.children = [];
    this.parentElement = null;
    this.isConnected = true;
    this.disabled = !!opts.disabled;
    this.style = opts.style || {};
    this.tagName = opts.tagName || 'BUTTON';
    this.type = opts.type || '';
  }
  append(...els) { els.forEach((el) => { el.parentElement = this; this.children.push(el); }); }
  contains(el) { return el === this || this.children.some((c) => c === el || c.contains(el)); }
  querySelectorAll() { return this.children.slice(); }
  querySelector(selector) { return this.children.find((c) => c.matches?.(selector)) ?? null; }
  addEventListener(type, fn) { this.listeners.set(type, fn); }
  removeEventListener(type) { this.listeners.delete(type); }
  dispatchKeydown(key, shiftKey = false) {
    const ev = { key, shiftKey, prevented: false, preventDefault() { this.prevented = true; } };
    this.listeners.get('keydown')?.(ev);
    return ev;
  }
  focus() { this.ownerDocument.activeElement = this; }
  getAttribute(name) { return this.attributes.has(name) ? this.attributes.get(name) : null; }
  hasAttribute(name) { return this.attributes.has(name); }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  matches(selector) { return selector === this.name || selector === `[name="${this.name}"]`; }
}

function createDoc() {
  const doc = { activeElement: null, defaultView: { getComputedStyle: () => ({ display: 'block', visibility: 'visible', pointerEvents: 'auto' }) } };
  doc.body = new FakeElement('body', doc, { tagName: 'BODY' });
  return doc;
}

test('focus moves inside on activation', () => {
  const doc = createDoc();
  const opener = new FakeElement('opener', doc);
  const container = new FakeElement('container', doc, { tagName: 'DIV' });
  const first = new FakeElement('first', doc);
  container.append(first);
  opener.focus();

  const scope = createFocusScope(container);
  scope.activate();

  assert.equal(doc.activeElement, first);
});

test('tab and shift+tab wrap inside container', () => {
  const doc = createDoc();
  const container = new FakeElement('container', doc, { tagName: 'DIV' });
  const first = new FakeElement('first', doc);
  const second = new FakeElement('second', doc);
  container.append(first, second);

  const scope = createFocusScope(container);
  scope.activate();
  second.focus();
  const tabEvent = container.dispatchKeydown('Tab');
  assert.equal(tabEvent.prevented, true);
  assert.equal(doc.activeElement, first);

  first.focus();
  const shiftTabEvent = container.dispatchKeydown('Tab', true);
  assert.equal(shiftTabEvent.prevented, true);
  assert.equal(doc.activeElement, second);
});

test('deactivation restores original focus', () => {
  const doc = createDoc();
  const opener = new FakeElement('opener', doc);
  const container = new FakeElement('container', doc, { tagName: 'DIV' });
  const first = new FakeElement('first', doc);
  container.append(first);
  opener.focus();

  const scope = createFocusScope(container);
  scope.activate();
  scope.deactivate();

  assert.equal(doc.activeElement, opener);
});

test('nested scopes trap only at top scope', () => {
  const doc = createDoc();
  const outer = new FakeElement('outer', doc, { tagName: 'DIV' });
  const outerBtn = new FakeElement('outer-btn', doc);
  outer.append(outerBtn);

  const inner = new FakeElement('inner', doc, { tagName: 'DIV' });
  const innerA = new FakeElement('inner-a', doc);
  const innerB = new FakeElement('inner-b', doc);
  inner.append(innerA, innerB);

  const outerScope = createFocusScope(outer);
  outerScope.activate();
  const innerScope = createFocusScope(inner);
  innerScope.activate();

  innerB.focus();
  const innerTab = inner.dispatchKeydown('Tab');
  assert.equal(innerTab.prevented, true);
  assert.equal(doc.activeElement, innerA);

  outerBtn.focus();
  const outerTab = outer.dispatchKeydown('Tab');
  assert.equal(outerTab.prevented, false);
});

test('no focusables falls back', () => {
  const doc = createDoc();
  const container = new FakeElement('container', doc, { tagName: 'DIV' });
  container.setAttribute('tabindex', '-1');
  const fallback = new FakeElement('fallback', doc);
  container.append(fallback);

  const scope = createFocusScope(container, { initialFocus: '[name="missing"]', fallbackFocus: '[name="fallback"]' });
  scope.activate();
  assert.equal(doc.activeElement, fallback);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { createActiveDescendant } from '../activeDescendant.js';

class FakeElement {
  constructor(id, doc) {
    this.id = id;
    this.nodeType = 1;
    this.ownerDocument = doc;
    this.parentElement = null;
    this.children = [];
    this.listeners = new Map();
    this.attributes = new Map();
    this.hidden = false;
    this.scrolled = false;
  }

  append(...els) { els.forEach((el) => { el.parentElement = this; this.children.push(el); }); }
  closest() { return this.parentElement; }
  addEventListener(type, fn) { this.listeners.set(type, fn); }
  removeEventListener(type) { this.listeners.delete(type); }
  dispatch(type, event) { this.listeners.get(type)?.(event); }
  getAttribute(name) { return this.attributes.has(name) ? this.attributes.get(name) : null; }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  removeAttribute(name) { this.attributes.delete(name); }
  scrollIntoView() { this.scrolled = true; }
  focus() { this.ownerDocument.activeElement = this; }
}

function createSetup() {
  const doc = { activeElement: null };
  const list = new FakeElement('list', doc);
  const input = new FakeElement('input', doc);
  const one = new FakeElement('one', doc);
  const two = new FakeElement('two', doc);
  const three = new FakeElement('three', doc);

  list.append(input, one, two, three);
  input.focus();

  return { doc, list, input, one, two, three };
}

function keyEvent(key) {
  return { key, prevented: false, preventDefault() { this.prevented = true; } };
}

test('sets aria-activedescendant while keeping focus on controlling input', () => {
  const { doc, input, one, two, three } = createSetup();
  const active = createActiveDescendant(input, [one, two, three], { wrap: true, container: input.parentElement });

  active.setActiveIndex(1);

  assert.equal(input.getAttribute('aria-activedescendant'), 'two');
  assert.equal(active.getActiveOption(), two);
  assert.equal(doc.activeElement, input);

  active.destroy();
});

test('arrow keys move active option and wrap when enabled', () => {
  const { input, one, two, three } = createSetup();
  const active = createActiveDescendant(input, [one, two, three], { wrap: true, container: input.parentElement });

  const down = keyEvent('ArrowDown');
  active.onKeydown(down);
  assert.equal(down.prevented, true);
  assert.equal(input.getAttribute('aria-activedescendant'), 'one');

  active.onKeydown(keyEvent('ArrowDown'));
  assert.equal(input.getAttribute('aria-activedescendant'), 'two');

  active.onKeydown(keyEvent('ArrowUp'));
  assert.equal(input.getAttribute('aria-activedescendant'), 'one');

  active.onKeydown(keyEvent('ArrowUp'));
  assert.equal(input.getAttribute('aria-activedescendant'), 'three');

  active.destroy();
});

test('updateOptions clears active index when active option disappears', () => {
  const { input, one, two, three } = createSetup();
  const active = createActiveDescendant(input, [one, two, three], { container: input.parentElement });

  active.setActiveOption(two);
  assert.equal(active.getActiveIndex(), 1);

  active.updateOptions([one, three]);

  assert.equal(active.getActiveIndex(), -1);
  assert.equal(input.getAttribute('aria-activedescendant'), null);

  active.destroy();
});

test('scrolls active option into view on navigation', () => {
  const { input, one, two, three } = createSetup();
  const active = createActiveDescendant(input, [one, two, three], { container: input.parentElement });

  active.last();
  assert.equal(three.scrolled, true);

  active.first();
  assert.equal(one.scrolled, true);

  active.destroy();
});

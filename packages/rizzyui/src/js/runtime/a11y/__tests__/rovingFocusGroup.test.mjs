import test from 'node:test';
import assert from 'node:assert/strict';
import { createRovingFocusGroup } from '../rovingFocusGroup.js';

class FakeElement {
  constructor(name, doc, opts = {}) {
    this.name = name;
    this.nodeType = 1;
    this.ownerDocument = doc;
    this.parentElement = null;
    this.children = [];
    this.listeners = new Map();
    this.attributes = new Map();
    this.disabled = !!opts.disabled;
    this.style = { display: 'block', visibility: 'visible', pointerEvents: 'auto' };
    this.tagName = opts.tagName ?? 'BUTTON';
    this.type = opts.type ?? '';
  }

  append(...els) { els.forEach((el) => { el.parentElement = this; this.children.push(el); }); }
  querySelectorAll() { return this.children.slice(); }
  contains(el) { return el === this || this.children.some((child) => child.contains(el)); }
  addEventListener(type, fn) { this.listeners.set(type, fn); }
  removeEventListener(type) { this.listeners.delete(type); }
  getAttribute(name) { return this.attributes.has(name) ? this.attributes.get(name) : null; }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  hasAttribute(name) { return this.attributes.has(name); }
  focus() { this.ownerDocument.activeElement = this; }
  dispatch(type, event) { this.listeners.get(type)?.(event); }
}

function createDoc() {
  const doc = {
    activeElement: null,
    defaultView: {
      getComputedStyle: () => ({ display: 'block', visibility: 'visible', pointerEvents: 'auto' })
    }
  };
  return doc;
}

function keyEvent(key) {
  return { key, prevented: false, preventDefault() { this.prevented = true; } };
}

test('initialization and updateItems assign one tabbable item', () => {
  const doc = createDoc();
  const group = new FakeElement('group', doc, { tagName: 'DIV' });
  const one = new FakeElement('one', doc);
  const two = new FakeElement('two', doc);
  group.append(one, two);

  const roving = createRovingFocusGroup(group, { activeIndex: 1 });

  assert.equal(one.getAttribute('tabindex'), '-1');
  assert.equal(two.getAttribute('tabindex'), '0');

  const three = new FakeElement('three', doc);
  group.append(three);
  roving.updateItems();

  assert.equal(one.getAttribute('tabindex'), '-1');
  assert.equal(two.getAttribute('tabindex'), '0');
  assert.equal(three.getAttribute('tabindex'), '-1');
  roving.destroy();
});

test('arrow keys move focus and loop when enabled', () => {
  const doc = createDoc();
  const group = new FakeElement('group', doc, { tagName: 'DIV' });
  const one = new FakeElement('one', doc);
  const two = new FakeElement('two', doc);
  group.append(one, two);

  const roving = createRovingFocusGroup(group, { orientation: 'horizontal', loop: true });

  one.focus();
  roving.setActiveItem(one);
  const right = keyEvent('ArrowRight');
  group.dispatch('keydown', right);

  assert.equal(right.prevented, true);
  assert.equal(doc.activeElement, two);
  assert.equal(two.getAttribute('tabindex'), '0');

  const rightWrap = keyEvent('ArrowRight');
  group.dispatch('keydown', rightWrap);
  assert.equal(doc.activeElement, one);
  roving.destroy();
});

test('home and end move to first and last enabled items', () => {
  const doc = createDoc();
  const group = new FakeElement('group', doc, { tagName: 'DIV' });
  const one = new FakeElement('one', doc);
  const two = new FakeElement('two', doc, { disabled: true });
  const three = new FakeElement('three', doc);
  group.append(one, two, three);

  const roving = createRovingFocusGroup(group, { disabledItemPolicy: 'skip' });
  roving.setActiveItem(three, { focus: true });

  group.dispatch('keydown', keyEvent('Home'));
  assert.equal(doc.activeElement, one);

  group.dispatch('keydown', keyEvent('End'));
  assert.equal(doc.activeElement, three);
  roving.destroy();
});

test('disabled item policy skip and stop behave as configured', () => {
  const doc = createDoc();
  const groupSkip = new FakeElement('group-skip', doc, { tagName: 'DIV' });
  const s1 = new FakeElement('s1', doc);
  const s2 = new FakeElement('s2', doc, { disabled: true });
  const s3 = new FakeElement('s3', doc);
  groupSkip.append(s1, s2, s3);

  const skip = createRovingFocusGroup(groupSkip, { disabledItemPolicy: 'skip', loop: false });
  skip.setActiveItem(s1, { focus: true });
  groupSkip.dispatch('keydown', keyEvent('ArrowRight'));
  assert.equal(doc.activeElement, s3);

  const docStop = createDoc();
  const groupStop = new FakeElement('group-stop', docStop, { tagName: 'DIV' });
  const t1 = new FakeElement('t1', docStop);
  const t2 = new FakeElement('t2', docStop, { disabled: true });
  const t3 = new FakeElement('t3', docStop);
  groupStop.append(t1, t2, t3);

  const stop = createRovingFocusGroup(groupStop, { disabledItemPolicy: 'stop', loop: false });
  stop.setActiveItem(t1, { focus: true });
  groupStop.dispatch('keydown', keyEvent('ArrowRight'));
  assert.equal(docStop.activeElement, t1);

  skip.destroy();
  stop.destroy();
});

test('pointer interaction updates active index', () => {
  const doc = createDoc();
  const group = new FakeElement('group', doc, { tagName: 'DIV' });
  const one = new FakeElement('one', doc);
  const two = new FakeElement('two', doc);
  group.append(one, two);

  const roving = createRovingFocusGroup(group);
  group.dispatch('click', { target: two });

  assert.equal(roving.getActiveIndex(), 1);
  assert.equal(one.getAttribute('tabindex'), '-1');
  assert.equal(two.getAttribute('tabindex'), '0');
  roving.destroy();
});

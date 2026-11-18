import test from 'node:test';
import assert from 'node:assert/strict';
import { linkToTrigger, removeMissingReferences } from '../a11y/triggerReference.js';

function fakeElement(attributes = {}, id = '') {
  const map = new Map(Object.entries(attributes));
  return {
    id,
    getAttribute: name => (map.has(name) ? map.get(name) : null),
    setAttribute: (name, value) => map.set(name, String(value)),
    removeAttribute: name => map.delete(name),
    has: name => map.has(name),
  };
}

test('linkToTrigger points the reference at a trigger that kept its own id (RZUI-048)', () => {
  const trigger = fakeElement({}, 'save-button');
  const content = fakeElement({ 'aria-labelledby': 'rz123-trigger' });
  linkToTrigger(trigger, content);
  assert.equal(content.getAttribute('aria-labelledby'), 'save-button');
});

test('linkToTrigger gives a trigger without an id the referenced one', () => {
  const trigger = fakeElement({}, '');
  const content = fakeElement({ 'aria-labelledby': 'rz123-trigger' });
  linkToTrigger(trigger, content);
  assert.equal(trigger.id, 'rz123-trigger');
  assert.equal(content.getAttribute('aria-labelledby'), 'rz123-trigger');
});

test('linkToTrigger leaves content named another way alone', () => {
  const content = fakeElement({ 'aria-label': 'Filters' });
  linkToTrigger(fakeElement({}, 'x'), content);
  assert.equal(content.getAttribute('aria-labelledby'), null);
});

test('removeMissingReferences drops references to missing elements and keeps the rest', () => {
  const previous = globalThis.document;
  globalThis.document = { getElementById: id => (id === 'title' ? {} : null) };
  try {
    const panel = fakeElement({ 'aria-labelledby': 'title missing-title', 'aria-describedby': 'missing-description' });
    removeMissingReferences(panel);
    assert.equal(panel.getAttribute('aria-labelledby'), 'title');
    assert.equal(panel.has('aria-describedby'), false);
  } finally {
    globalThis.document = previous;
  }
});

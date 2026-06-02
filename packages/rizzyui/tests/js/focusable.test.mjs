import test from 'node:test';
import assert from 'node:assert/strict';
import { focusFirst, focusLast, getFocusableElements, isFocusable, isTabbable } from '../../src/js/runtime/a11y/focusable.js';

function createElement(tagName, options = {}) {
  const attrs = new Map(Object.entries(options.attrs ?? {}));
  const el = {
    nodeType: 1,
    tagName: tagName.toUpperCase(),
    type: options.type ?? '',
    disabled: options.disabled ?? false,
    isContentEditable: options.isContentEditable ?? false,
    parentElement: null,
    ownerDocument: { defaultView: { getComputedStyle: () => options.style ?? { display: 'block', visibility: 'visible', pointerEvents: 'auto' } } },
    getAttribute(name) { return attrs.has(name) ? attrs.get(name) : null; },
    hasAttribute(name) { return attrs.has(name); },
    focus() { this.focused = true; },
  };
  return el;
}

function createRoot(elements) {
  return {
    querySelectorAll() { return elements; },
    contains(element) { return elements.includes(element); },
  };
}

test('filters hidden and disabled elements from getFocusableElements', () => {
  const visibleButton = createElement('button');
  const hiddenInput = createElement('input', { style: { display: 'none', visibility: 'visible', pointerEvents: 'auto' } });
  const disabledButton = createElement('button', { disabled: true });
  const root = createRoot([visibleButton, hiddenInput, disabledButton]);

  const result = getFocusableElements(root);
  assert.deepEqual(result, [visibleButton]);
});

test('supports tabindex and contenteditable focusability rules', () => {
  const negativeTab = createElement('div', { attrs: { tabindex: '-1' } });
  const positiveTab = createElement('div', { attrs: { tabindex: '2' } });
  const editable = createElement('div', { isContentEditable: true });

  assert.equal(isFocusable(negativeTab), true);
  assert.equal(isTabbable(negativeTab), false);
  assert.equal(isTabbable(positiveTab), true);
  assert.equal(isFocusable(editable), true);
});

test('excludes aria-hidden and inert ancestors', () => {
  const hiddenParent = createElement('div', { attrs: { 'aria-hidden': 'true' } });
  const child = createElement('button');
  child.parentElement = hiddenParent;

  assert.equal(isFocusable(child), false);

  const inertParent = createElement('div', { attrs: { inert: '' } });
  const child2 = createElement('button');
  child2.parentElement = inertParent;

  assert.equal(isFocusable(child2), false);
});

test('focusFirst and focusLast focus expected elements', () => {
  const first = createElement('button');
  const middle = createElement('button', { attrs: { tabindex: '-1' } });
  const last = createElement('a', { attrs: { href: '#' } });
  const root = createRoot([first, middle, last]);

  const firstFocused = focusFirst(root);
  const lastFocused = focusLast(root);

  assert.equal(firstFocused, first);
  assert.equal(lastFocused, last);
  assert.equal(first.focused, true);
  assert.equal(last.focused, true);
});

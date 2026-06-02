import test from 'node:test';
import assert from 'node:assert/strict';
import rzNavigationMenu from '../rzNavigationMenu.js';

class FakeElement {
  constructor(tagName, attrs = {}) {
    this.nodeType = 1;
    this.tagName = tagName.toUpperCase();
    this.attributes = new Map(Object.entries(attrs).map(([key, value]) => [key, String(value)]));
    this.children = [];
    this.parentElement = null;
    this.ownerDocument = null;
    this.style = { display: 'block', visibility: 'visible', pointerEvents: 'auto' };
    this.dataset = {};
    this.disabled = false;
    this.isContentEditable = false;
    this.type = attrs.type ?? '';
  }

  append(...children) {
    children.forEach((child) => {
      child.parentElement = this;
      child.ownerDocument = this.ownerDocument;
      this.children.push(child);
    });
  }

  contains(candidate) {
    return candidate === this || this.children.some((child) => child.contains(candidate));
  }

  getAttribute(name) {
    return this.attributes.has(name) ? this.attributes.get(name) : null;
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  hasAttribute(name) {
    return this.attributes.has(name);
  }

  focus() {
    this.ownerDocument.activeElement = this;
  }

  getBoundingClientRect() {
    return { x: 0, y: 0, top: 0, left: 0, right: 100, bottom: 40, width: 100, height: 40 };
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] ?? null;
  }

  querySelectorAll(selector) {
    const results = [];
    const visit = (node) => {
      node.children.forEach((child) => {
        if (child.matches(selector)) results.push(child);
        visit(child);
      });
    };
    visit(this);
    return results;
  }

  closest(selector) {
    let current = this;
    while (current) {
      if (current.matches(selector)) return current;
      current = current.parentElement;
    }
    return null;
  }

  matches(selector) {
    return selector.split(',').map((part) => part.trim()).some((part) => this.matchesOne(part));
  }

  matchesOne(selector) {
    if (selector === 'button') return this.tagName === 'BUTTON';
    if (selector === 'input') return this.tagName === 'INPUT';
    if (selector === 'select') return this.tagName === 'SELECT';
    if (selector === 'textarea') return this.tagName === 'TEXTAREA';
    if (selector === 'summary') return this.tagName === 'SUMMARY';
    if (selector === 'iframe') return this.tagName === 'IFRAME';
    if (selector === 'object') return this.tagName === 'OBJECT';
    if (selector === 'embed') return this.tagName === 'EMBED';
    if (selector === 'a[href]') return this.tagName === 'A' && this.hasAttribute('href');
    if (selector === 'area[href]') return this.tagName === 'AREA' && this.hasAttribute('href');
    if (selector === '[tabindex]') return this.hasAttribute('tabindex');
    if (selector === '[contenteditable]:not([contenteditable="false"])') return this.hasAttribute('contenteditable') && this.getAttribute('contenteditable') !== 'false';

    const equals = selector.match(/^\[([^=]+)="([^"]+)"\]$/);
    if (equals) return this.getAttribute(equals[1]) === equals[2];

    const starts = selector.match(/^\[([^\^]+)\^="([^"]+)"\]$/);
    if (starts) return this.getAttribute(starts[1])?.startsWith(starts[2]) ?? false;

    return false;
  }
}

function createDocument() {
  const byId = new Map();
  return {
    activeElement: null,
    defaultView: { getComputedStyle: (element) => element.style },
    getElementById(id) { return byId.get(id) ?? null; },
    register(element) {
      element.ownerDocument = this;
      const id = element.getAttribute('id');
      if (id) byId.set(id, element);
      element.children.forEach((child) => this.register(child));
    }
  };
}

function createElement(doc, tagName, attrs = {}, children = []) {
  const element = new FakeElement(tagName, attrs);
  element.ownerDocument = doc;
  element.append(...children);
  return element;
}

function createMenuFixture() {
  const doc = createDocument();
  const internalLink = createElement(doc, 'a', { href: '/internal', 'data-slot': 'navigation-menu-link' });
  const triggerOne = createElement(doc, 'button', { id: 'item-one-trigger', 'data-slot': 'navigation-menu-trigger', 'x-ref': 'trigger_item-one', 'aria-expanded': 'false' });
  const contentOne = createElement(doc, 'div', { id: 'item-one-content', 'data-slot': 'navigation-menu-content', 'data-item-id': 'item-one' }, [internalLink]);
  const itemOne = createElement(doc, 'li', { 'data-slot': 'navigation-menu-item' }, [triggerOne, contentOne]);

  const triggerTwo = createElement(doc, 'button', { id: 'item-two-trigger', 'data-slot': 'navigation-menu-trigger', 'x-ref': 'trigger_item-two', 'aria-expanded': 'false' });
  const contentTwo = createElement(doc, 'div', { id: 'item-two-content', 'data-slot': 'navigation-menu-content', 'data-item-id': 'item-two' });
  const itemTwo = createElement(doc, 'li', { 'data-slot': 'navigation-menu-item' }, [triggerTwo, contentTwo]);

  const topLink = createElement(doc, 'a', { id: 'docs-link', href: '/docs', 'data-slot': 'navigation-menu-link' });
  const itemThree = createElement(doc, 'li', { 'data-slot': 'navigation-menu-item' }, [topLink]);

  const list = createElement(doc, 'ul', { 'data-slot': 'navigation-menu-list' }, [itemOne, itemTwo, itemThree]);
  const root = createElement(doc, 'nav', { 'data-slot': 'navigation-menu' }, [list]);
  doc.register(root);

  const menu = rzNavigationMenu();
  menu.$el = root;
  menu.$refs = { list, 'trigger_item-one': triggerOne, 'trigger_item-two': triggerTwo };
  menu.$nextTick = (callback) => callback();
  menu.list = list;

  return { doc, menu, triggerOne, triggerTwo, topLink, internalLink, contentOne, contentTwo };
}

function keyEvent(key, target) {
  return {
    key,
    target,
    prevented: false,
    preventDefault() { this.prevented = true; }
  };
}

globalThis.requestAnimationFrame = (callback) => callback();
globalThis.HTMLElement = FakeElement;
globalThis.Element = FakeElement;
globalThis.Node = FakeElement;
globalThis.window = {
  Element: FakeElement,
  HTMLElement: FakeElement,
  Node: FakeElement,
  getComputedStyle: (element) => element.style,
};

test('ArrowLeft moves among top-level controls and skips content links', () => {
  const { doc, menu, triggerOne, triggerTwo, topLink, internalLink } = createMenuFixture();
  globalThis.document = doc;

  triggerOne.focus();
  const firstLeft = keyEvent('ArrowLeft', triggerOne);
  menu.handleKeydown(firstLeft);
  assert.equal(firstLeft.prevented, true);
  assert.equal(doc.activeElement, topLink);

  const secondLeft = keyEvent('ArrowLeft', topLink);
  menu.handleKeydown(secondLeft);
  assert.equal(secondLeft.prevented, true);
  assert.equal(doc.activeElement, triggerTwo);
  assert.notEqual(doc.activeElement, internalLink);
});

test('ArrowRight moves among top-level controls and skips content links', () => {
  const { doc, menu, triggerOne, triggerTwo, topLink, internalLink } = createMenuFixture();
  globalThis.document = doc;

  triggerOne.focus();
  const firstRight = keyEvent('ArrowRight', triggerOne);
  menu.handleKeydown(firstRight);
  assert.equal(firstRight.prevented, true);
  assert.equal(doc.activeElement, triggerTwo);

  const secondRight = keyEvent('ArrowRight', triggerTwo);
  menu.handleKeydown(secondRight);
  assert.equal(secondRight.prevented, true);
  assert.equal(doc.activeElement, topLink);

  const wrapRight = keyEvent('ArrowRight', topLink);
  menu.handleKeydown(wrapRight);
  assert.equal(wrapRight.prevented, true);
  assert.equal(doc.activeElement, triggerOne);
  assert.notEqual(doc.activeElement, internalLink);
});

test('ArrowDown opens associated content and focuses first focusable descendant', () => {
  const { doc, menu, triggerOne, internalLink } = createMenuFixture();
  globalThis.document = doc;

  let openedId = null;
  menu.openMenu = (id) => {
    openedId = id;
    triggerOne.setAttribute('aria-expanded', 'true');
  };

  triggerOne.focus();
  const event = keyEvent('ArrowDown', triggerOne);
  menu.handleKeydown(event);

  assert.equal(event.prevented, true);
  assert.equal(openedId, 'item-one');
  assert.equal(triggerOne.getAttribute('aria-expanded'), 'true');
  assert.equal(doc.activeElement, internalLink);
});

test('ArrowDown focuses content container when no focusable descendants exist', () => {
  const { doc, menu, triggerTwo, contentTwo } = createMenuFixture();
  globalThis.document = doc;

  menu.openMenu = () => {};

  triggerTwo.focus();
  const event = keyEvent('ArrowDown', triggerTwo);
  menu.handleKeydown(event);

  assert.equal(event.prevented, true);
  assert.equal(contentTwo.getAttribute('tabindex'), '-1');
  assert.equal(doc.activeElement, contentTwo);
});

test('ArrowDown on top-level link without content leaves focus and default behavior unchanged', () => {
  const { doc, menu, topLink } = createMenuFixture();
  globalThis.document = doc;

  topLink.focus();
  const event = keyEvent('ArrowDown', topLink);
  menu.handleKeydown(event);

  assert.equal(event.prevented, false);
  assert.equal(doc.activeElement, topLink);
});

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button',
  'input',
  'select',
  'textarea',
  'summary',
  'iframe',
  'object',
  'embed',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]',
].join(',');

function isElementHiddenByStyle(element) {
  const view = element?.ownerDocument?.defaultView ?? globalThis;
  const getComputedStyleFn = view?.getComputedStyle;
  if (typeof getComputedStyleFn !== 'function') return false;

  const style = getComputedStyleFn(element);
  return style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse' || style.pointerEvents === 'none';
}

function isAriaOrInertHidden(element, root) {
  let current = element;
  while (current && current !== root?.parentElement) {
    if (current.getAttribute?.('aria-hidden') === 'true' || current.hasAttribute?.('inert')) {
      return true;
    }
    current = current.parentElement;
  }

  return false;
}

function isDisabled(element) {
  if ('disabled' in element && element.disabled) return true;
  if (element.getAttribute?.('aria-disabled') === 'true') return true;
  return false;
}

function isNaturallyFocusable(element) {
  const tagName = element.tagName?.toLowerCase();
  if (!tagName) return false;

  if (tagName === 'a' || tagName === 'area') return !!element.getAttribute?.('href');
  if (tagName === 'input') return element.type !== 'hidden';
  if (['button', 'select', 'textarea', 'summary', 'iframe', 'object', 'embed'].includes(tagName)) return true;
  if (element.isContentEditable) return true;

  return false;
}

/**
 * Returns whether an element can receive focus programmatically.
 * This excludes disabled controls, inert/aria-hidden branches, and elements hidden via CSS.
 * @param {Element | null | undefined} element candidate DOM element.
 * @returns {boolean} true when the element is considered focusable.
 */
export function isFocusable(element) {
  if (!element || element.nodeType !== 1) return false;
  if (isDisabled(element) || isElementHiddenByStyle(element)) return false;
  if (isAriaOrInertHidden(element)) return false;

  const tabIndexAttr = element.getAttribute?.('tabindex');
  if (tabIndexAttr !== null) {
    const parsed = Number.parseInt(tabIndexAttr, 10);
    if (!Number.isNaN(parsed)) return parsed >= -1;
  }

  return isNaturallyFocusable(element);
}

/**
 * Returns whether an element participates in sequential keyboard tab order.
 * Elements with tabindex="-1" may still be focusable, but are not tabbable.
 * @param {Element | null | undefined} element candidate DOM element.
 * @returns {boolean} true when the element is tabbable.
 */
export function isTabbable(element) {
  if (!isFocusable(element)) return false;

  const tabIndexAttr = element.getAttribute?.('tabindex');
  if (tabIndexAttr === null) return true;

  const parsed = Number.parseInt(tabIndexAttr, 10);
  if (Number.isNaN(parsed)) return true;
  return parsed >= 0;
}

/**
 * Collects focusable descendants within a root container.
 * The returned list is DOM-order, and never includes nodes outside the provided root.
 * @param {Element | DocumentFragment | null | undefined} root root container to search.
 * @returns {Element[]} focusable descendants within root.
 */
export function getFocusableElements(root) {
  if (!root || typeof root.querySelectorAll !== 'function') return [];
  const candidates = Array.from(root.querySelectorAll(FOCUSABLE_SELECTOR));
  return candidates.filter((element) => root.contains?.(element) && isFocusable(element));
}

/**
 * Focuses the first focusable element inside root.
 * @param {Element | DocumentFragment | null | undefined} root root container.
 * @returns {Element | null} the focused element, or null when none were found.
 */
export function focusFirst(root) {
  const first = getFocusableElements(root)[0] ?? null;
  first?.focus?.();
  return first;
}

/**
 * Focuses the last focusable element inside root.
 * @param {Element | DocumentFragment | null | undefined} root root container.
 * @returns {Element | null} the focused element, or null when none were found.
 */
export function focusLast(root) {
  const all = getFocusableElements(root);
  const last = all.length ? all[all.length - 1] : null;
  last?.focus?.();
  return last;
}

import { getFocusableElements, isFocusable } from './focusable.js';

const KEY_PREV = new Set(['ArrowLeft', 'ArrowUp']);
const KEY_NEXT = new Set(['ArrowRight', 'ArrowDown']);

/**
 * @typedef {'horizontal' | 'vertical' | 'both'} RovingOrientation
 * @typedef {'skip' | 'stop'} DisabledItemPolicy
 *
 * @typedef {Object} RovingFocusGroupOptions
 * @property {RovingOrientation} [orientation='horizontal'] Supported arrow key orientation.
 * @property {boolean} [loop=true] Wrap focus from end to start (and start to end) when true.
 * @property {DisabledItemPolicy} [disabledItemPolicy='skip'] Whether disabled items are skipped or stop movement.
 * @property {number} [activeIndex=0] Initial active index.
 * @property {(container: Element) => Element[]} [getItems] Optional resolver for group items.
 * @property {(item: Element) => boolean} [isItemDisabled] Optional disabled predicate for an item.
 */

function getOwnerDocument(container) {
  return container?.ownerDocument ?? globalThis.document;
}

function isDisabledByDefault(item) {
  if (!item) return true;
  if ('disabled' in item && item.disabled) return true;
  return item.getAttribute?.('aria-disabled') === 'true';
}

function clampIndex(index, count) {
  if (count <= 0) return -1;
  return Math.max(0, Math.min(index, count - 1));
}

function resolveInitialIndex(items, startIndex, isItemDisabled) {
  const candidate = clampIndex(startIndex, items.length);
  if (candidate < 0) return -1;
  if (!isItemDisabled(items[candidate])) return candidate;
  for (let i = 0; i < items.length; i += 1) {
    if (!isItemDisabled(items[i])) return i;
  }
  return -1;
}

/**
 * Creates a roving tabindex focus manager for a composite widget container.
 *
 * The group listens on the container for keyboard and pointer interactions,
 * maintains a single `tabindex="0"` item, and sets all peers to `tabindex="-1"`.
 *
 * @param {Element} container Composite widget container that owns roving items.
 * @param {RovingFocusGroupOptions} [options] Configuration options.
 * @returns {{
 *   destroy: () => void,
 *   updateItems: () => Element[],
 *   setActiveIndex: (index: number, opts?: { focus?: boolean }) => Element | null,
 *   setActiveItem: (item: Element, opts?: { focus?: boolean }) => Element | null,
 *   getItems: () => Element[],
 *   getActiveIndex: () => number,
 *   getActiveItem: () => Element | null
 * }} Roving focus controller.
 */
export function createRovingFocusGroup(container, options = {}) {
  if (!container || typeof container.addEventListener !== 'function') {
    throw new Error('createRovingFocusGroup requires a valid container element.');
  }

  const orientation = options.orientation ?? 'horizontal';
  const loop = options.loop ?? true;
  const disabledItemPolicy = options.disabledItemPolicy ?? 'skip';
  const isItemDisabled = options.isItemDisabled ?? isDisabledByDefault;
  const resolveItems = options.getItems ?? ((root) => Array.from(root.querySelectorAll?.('*') ?? []));
  const doc = getOwnerDocument(container);

  let items = [];
  let activeIndex = -1;

  function getItems() {
    return items.slice();
  }

  function getActiveIndex() {
    return activeIndex;
  }

  function getActiveItem() {
    return activeIndex >= 0 ? items[activeIndex] ?? null : null;
  }

  function applyTabIndexes() {
    items.forEach((item, index) => {
      item.setAttribute?.('tabindex', index === activeIndex ? '0' : '-1');
    });
  }

  function setActiveIndex(index, opts = {}) {
    const nextIndex = clampIndex(index, items.length);
    activeIndex = nextIndex;
    applyTabIndexes();

    const activeItem = getActiveItem();
    if (opts.focus && activeItem && typeof activeItem.focus === 'function') {
      activeItem.focus();
    }

    return activeItem;
  }

  function setActiveItem(item, opts = {}) {
    const idx = items.indexOf(item);
    if (idx < 0) return null;
    return setActiveIndex(idx, opts);
  }

  function updateItems() {
    items = resolveItems(container).filter((item) => container.contains?.(item) && (isFocusable(item) || isItemDisabled(item)));

    if (!items.length) {
      activeIndex = -1;
      return [];
    }

    const focusedIndex = items.indexOf(doc?.activeElement ?? null);
    if (focusedIndex >= 0) {
      activeIndex = focusedIndex;
    } else {
      activeIndex = resolveInitialIndex(items, activeIndex >= 0 ? activeIndex : (options.activeIndex ?? 0), isItemDisabled);
    }

    applyTabIndexes();
    return getItems();
  }

  function isPrevKey(key) {
    if (orientation === 'horizontal') return key === 'ArrowLeft';
    if (orientation === 'vertical') return key === 'ArrowUp';
    return KEY_PREV.has(key);
  }

  function isNextKey(key) {
    if (orientation === 'horizontal') return key === 'ArrowRight';
    if (orientation === 'vertical') return key === 'ArrowDown';
    return KEY_NEXT.has(key);
  }

  function findNextEnabledIndex(start, step) {
    if (!items.length || activeIndex < 0) return -1;

    let index = start;
    let visited = 0;

    while (visited < items.length) {
      index += step;

      if (index < 0 || index >= items.length) {
        if (!loop) return -1;
        index = index < 0 ? items.length - 1 : 0;
      }

      if (isItemDisabled(items[index])) {
        if (disabledItemPolicy === 'stop') return -1;
        visited += 1;
        continue;
      }

      return index;
    }

    return -1;
  }

  function findEdgeEnabledIndex(fromEnd = false) {
    const start = fromEnd ? items.length - 1 : 0;
    const end = fromEnd ? -1 : items.length;
    const step = fromEnd ? -1 : 1;

    for (let i = start; i !== end; i += step) {
      if (!isItemDisabled(items[i])) return i;
      if (disabledItemPolicy === 'stop') return -1;
    }

    return -1;
  }

  function handleKeyboard(event) {
    if (!event || !items.length || activeIndex < 0) return;
    const key = event.key;

    let nextIndex = -1;

    if (isPrevKey(key)) {
      nextIndex = findNextEnabledIndex(activeIndex, -1);
    } else if (isNextKey(key)) {
      nextIndex = findNextEnabledIndex(activeIndex, 1);
    } else if (key === 'Home') {
      nextIndex = findEdgeEnabledIndex(false);
    } else if (key === 'End') {
      nextIndex = findEdgeEnabledIndex(true);
    }

    if (nextIndex >= 0) {
      event.preventDefault?.();
      setActiveIndex(nextIndex, { focus: true });
    }
  }

  function handlePointer(event) {
    const target = event?.target;
    if (!target || !items.length) return;

    const item = items.find((candidate) => candidate === target || candidate.contains?.(target));
    if (!item) return;

    const itemIndex = items.indexOf(item);
    if (itemIndex >= 0 && !isItemDisabled(item)) {
      setActiveIndex(itemIndex, { focus: false });
    }
  }

  container.addEventListener('keydown', handleKeyboard);
  container.addEventListener('pointerdown', handlePointer);
  container.addEventListener('click', handlePointer);

  updateItems();

  return {
    destroy() {
      container.removeEventListener('keydown', handleKeyboard);
      container.removeEventListener('pointerdown', handlePointer);
      container.removeEventListener('click', handlePointer);
    },
    updateItems,
    setActiveIndex,
    setActiveItem,
    getItems,
    getActiveIndex,
    getActiveItem,
  };
}

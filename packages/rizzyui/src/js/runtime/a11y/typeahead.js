const DEFAULT_TIMEOUT_MS = 500;

function removeDiacritics(value) {
  return value.normalize?.('NFKD').replace(/[\u0300-\u036f]/g, '') ?? value;
}

function normalizeLabel(value) {
  if (value == null) return '';
  const text = String(value).trim();
  if (!text) return '';
  return removeDiacritics(text).toLocaleLowerCase();
}

function isSingleCharacterKey(key) {
  return typeof key === 'string' && key.length === 1;
}

/**
 * Creates a reusable typeahead matcher for list-like widgets.
 *
 * @template T
 * @param {Object} [options] Typeahead configuration.
 * @param {(items: T[]) => T[]} [options.getItems] Optional resolver invoked on each search.
 * @param {(item: T, index: number) => string} [options.getText] Gets the searchable label for each item.
 * @param {number} [options.timeoutMs=500] Idle timeout before the buffered query resets.
 * @param {boolean} [options.cycle=true] Enables repeated-character cycling behavior.
 * @param {() => number} [options.getActiveIndex] Current active index used as cycle/search start.
 * @param {(index: number) => void} [options.onMatch] Callback invoked when a match is found.
 * @param {(fn: () => void, delay: number) => unknown} [options.setTimer] Timer scheduler override (testing).
 * @param {(timer: unknown) => void} [options.clearTimer] Timer cleanup override (testing).
 * @returns {{
 *   search: (key: string, items: T[], opts?: { activeIndex?: number }) => number,
 *   handleKey: (event: KeyboardEvent, items: T[], opts?: { activeIndex?: number }) => number,
 *   reset: () => void,
 *   getBuffer: () => string
 * }} Typeahead controller.
 */
export function createTypeahead(options = {}) {
  const timeoutMs = Number.isFinite(options.timeoutMs) && options.timeoutMs >= 0 ? options.timeoutMs : DEFAULT_TIMEOUT_MS;
  const cycle = options.cycle ?? true;
  const getItems = options.getItems ?? ((items) => items);
  const getText = options.getText ?? ((item) => item?.textContent ?? item?.label ?? item?.text ?? '');
  const setTimer = options.setTimer ?? ((fn, delay) => globalThis.setTimeout(fn, delay));
  const clearTimer = options.clearTimer ?? ((timer) => globalThis.clearTimeout(timer));

  let buffer = '';
  let timer = null;

  function resetTimer() {
    if (timer != null) clearTimer(timer);
    timer = setTimer(() => {
      buffer = '';
      timer = null;
    }, timeoutMs);
  }

  function resolveActiveIndex(override) {
    if (Number.isInteger(override)) return override;
    if (typeof options.getActiveIndex === 'function') {
      const fromOption = options.getActiveIndex();
      if (Number.isInteger(fromOption)) return fromOption;
    }

    return -1;
  }

  function findNextMatch(items, activeIndex, query) {
    if (!items.length || !query) return -1;

    const normalizedQuery = normalizeLabel(query);
    if (!normalizedQuery) return -1;

    const normalizedLabels = items.map((item, index) => normalizeLabel(getText(item, index)));
    const start = activeIndex >= 0 ? (activeIndex + 1) % items.length : 0;

    for (let step = 0; step < items.length; step += 1) {
      const index = (start + step) % items.length;
      if (normalizedLabels[index].startsWith(normalizedQuery)) return index;
    }

    return -1;
  }

  function search(key, items, opts = {}) {
    if (!isSingleCharacterKey(key)) return -1;

    const sourceItems = getItems(Array.isArray(items) ? items : []);
    const activeIndex = resolveActiveIndex(opts.activeIndex);
    const char = normalizeLabel(key);
    if (!char) return -1;

    const repeated = buffer.length > 0 && buffer.split('').every((candidate) => candidate === char);
    const nextBuffer = repeated && cycle ? char.repeat(buffer.length + 1) : `${buffer}${char}`;

    let index = findNextMatch(sourceItems, activeIndex, nextBuffer);
    if (index < 0 && repeated && cycle) {
      index = findNextMatch(sourceItems, activeIndex, char);
    }

    buffer = index >= 0 ? nextBuffer : char;

    if (index < 0) {
      index = findNextMatch(sourceItems, activeIndex, buffer);
    }

    resetTimer();

    if (index >= 0 && typeof options.onMatch === 'function') {
      options.onMatch(index);
    }

    return index;
  }

  function handleKey(event, items, opts = {}) {
    const key = event?.key;
    if (!isSingleCharacterKey(key)) return -1;
    return search(key, items, opts);
  }

  function reset() {
    buffer = '';
    if (timer != null) {
      clearTimer(timer);
      timer = null;
    }
  }

  return {
    search,
    handleKey,
    reset,
    getBuffer: () => buffer,
  };
}

/**
 * Builds a typeahead instance that updates an active-descendant controller when matches resolve.
 *
 * @template T
 * @param {{ setActiveIndex?: (index: number) => unknown }} activeDescendant Active-descendant controller.
 * @param {Object} [options] Additional typeahead options.
 * @returns {ReturnType<typeof createTypeahead<T>>} Typeahead controller.
 */
export function createActiveDescendantTypeahead(activeDescendant, options = {}) {
  return createTypeahead({
    ...options,
    getActiveIndex: options.getActiveIndex ?? (() => activeDescendant?.getActiveIndex?.() ?? -1),
    onMatch: options.onMatch ?? ((index) => activeDescendant?.setActiveIndex?.(index)),
  });
}

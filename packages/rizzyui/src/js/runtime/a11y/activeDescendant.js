const NAV_PREV_KEYS = new Set(['ArrowUp', 'ArrowLeft']);
const NAV_NEXT_KEYS = new Set(['ArrowDown', 'ArrowRight']);

function normalizeOptions(options) {
  return {
    wrap: options.wrap ?? false,
    orientation: options.orientation ?? 'vertical',
    typeahead: options.typeahead ?? null,
    scrollBehavior: options.scrollBehavior ?? 'nearest',
    scrollBlock: options.scrollBlock ?? 'nearest',
    getOptionId: options.getOptionId ?? ((option) => option?.id ?? ''),
  };
}

function resolveContainer(controller, options) {
  return options.container ?? controller.closest?.('[role="listbox"],[data-active-descendant-container]') ?? controller.parentElement ?? null;
}

function isVisibleOption(option) {
  if (!option || option.getAttribute?.('aria-hidden') === 'true') return false;
  if ('hidden' in option && option.hidden) return false;
  return true;
}

function clampIndex(index, count) {
  if (count <= 0) return -1;
  return Math.max(0, Math.min(index, count - 1));
}

function findByTypeahead(options, search) {
  if (!search || typeof options.typeahead !== 'function') return -1;
  const index = options.typeahead(search);
  return Number.isInteger(index) ? index : -1;
}

export function createActiveDescendant(controller, initialOptions = [], userOptions = {}) {
  if (!controller || typeof controller.setAttribute !== 'function') {
    throw new Error('createActiveDescendant requires a valid controlling element.');
  }

  const options = normalizeOptions(userOptions);
  const container = resolveContainer(controller, userOptions);
  let optionElements = [];
  let activeIndex = -1;

  function getOptions() {
    return optionElements.slice();
  }

  function getActiveIndex() {
    return activeIndex;
  }

  function getActiveOption() {
    return activeIndex >= 0 ? optionElements[activeIndex] ?? null : null;
  }

  function clear() {
    activeIndex = -1;
    controller.removeAttribute('aria-activedescendant');
  }

  function validateOptions(elements) {
    const seenIds = new Set();

    return elements.filter((option) => {
      if (!option || !isVisibleOption(option)) return false;

      const id = options.getOptionId(option);
      if (!id) {
        throw new Error('Each active descendant option must have a unique id.');
      }

      if (seenIds.has(id)) {
        throw new Error(`Duplicate active descendant option id detected: ${id}`);
      }

      seenIds.add(id);
      return true;
    });
  }

  function scrollActiveOptionIntoView() {
    const activeOption = getActiveOption();
    if (!activeOption || typeof activeOption.scrollIntoView !== 'function') return;

    activeOption.scrollIntoView({ behavior: options.scrollBehavior, block: options.scrollBlock, inline: 'nearest' });
  }

  function applyActiveDescendant() {
    const activeOption = getActiveOption();
    if (!activeOption) {
      controller.removeAttribute('aria-activedescendant');
      return null;
    }

    const id = options.getOptionId(activeOption);
    controller.setAttribute('aria-activedescendant', id);
    scrollActiveOptionIntoView();

    return activeOption;
  }

  function setActiveIndex(index) {
    const nextIndex = clampIndex(index, optionElements.length);
    activeIndex = nextIndex;
    return applyActiveDescendant();
  }

  function setActiveOption(option) {
    const index = optionElements.indexOf(option);
    if (index < 0) return null;
    return setActiveIndex(index);
  }

  function move(step) {
    if (!optionElements.length) {
      clear();
      return null;
    }

    if (activeIndex < 0) {
      return setActiveIndex(step > 0 ? 0 : optionElements.length - 1);
    }

    let nextIndex = activeIndex + step;
    if (nextIndex < 0 || nextIndex >= optionElements.length) {
      if (!options.wrap) return null;
      nextIndex = nextIndex < 0 ? optionElements.length - 1 : 0;
    }

    return setActiveIndex(nextIndex);
  }

  function first() {
    return setActiveIndex(0);
  }

  function last() {
    return setActiveIndex(optionElements.length - 1);
  }

  function updateOptions(nextOptions = []) {
    const activeId = controller.getAttribute('aria-activedescendant');
    optionElements = validateOptions(Array.from(nextOptions));

    if (!optionElements.length) {
      clear();
      return [];
    }

    if (!activeId) {
      activeIndex = activeIndex < 0 ? -1 : clampIndex(activeIndex, optionElements.length);
      applyActiveDescendant();
      return getOptions();
    }

    const nextIndex = optionElements.findIndex((option) => options.getOptionId(option) === activeId);
    if (nextIndex < 0) {
      clear();
    } else {
      activeIndex = nextIndex;
      applyActiveDescendant();
    }

    return getOptions();
  }

  function isSupportedOrientationKey(key, isPrev) {
    if (options.orientation === 'vertical') return isPrev ? key === 'ArrowUp' : key === 'ArrowDown';
    if (options.orientation === 'horizontal') return isPrev ? key === 'ArrowLeft' : key === 'ArrowRight';
    return isPrev ? NAV_PREV_KEYS.has(key) : NAV_NEXT_KEYS.has(key);
  }

  function onKeydown(event) {
    if (!event) return null;

    if (isSupportedOrientationKey(event.key, true)) {
      event.preventDefault?.();
      return move(-1);
    }

    if (isSupportedOrientationKey(event.key, false)) {
      event.preventDefault?.();
      return move(1);
    }

    if (event.key === 'Home') {
      event.preventDefault?.();
      return first();
    }

    if (event.key === 'End') {
      event.preventDefault?.();
      return last();
    }

    if (event.key?.length === 1) {
      const typeaheadIndex = findByTypeahead(options, event.key);
      if (typeaheadIndex >= 0) {
        event.preventDefault?.();
        return setActiveIndex(typeaheadIndex);
      }
    }

    return null;
  }

  updateOptions(initialOptions);

  if (container?.addEventListener) {
    container.addEventListener('keydown', onKeydown);
  }

  return {
    destroy() {
      container?.removeEventListener?.('keydown', onKeydown);
    },
    clear,
    reset: clear,
    updateOptions,
    onKeydown,
    move,
    first,
    last,
    setActiveIndex,
    setActiveOption,
    getOptions,
    getActiveIndex,
    getActiveOption,
  };
}

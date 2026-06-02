import { getFocusableElements, isFocusable } from './focusable.js';

const scopeStack = [];

function resolveElement(container, value) {
  if (!value) return null;
  if (typeof value === 'string') return container.querySelector?.(value) ?? null;
  return value?.nodeType === 1 ? value : null;
}

function focusElement(target) {
  if (!target || typeof target.focus !== 'function') return false;
  target.focus();
  return true;
}

function getTopScope() {
  return scopeStack[scopeStack.length - 1] ?? null;
}

function removeFromStack(scope) {
  const index = scopeStack.lastIndexOf(scope);
  if (index >= 0) scopeStack.splice(index, 1);
}

/**
 * Creates a focus scope that traps tab navigation inside a container.
 *
 * @param {Element} container Root modal container.
 * @param {{ initialFocus?: string|Element, fallbackFocus?: string|Element, throwOnNoFocusable?: boolean }} [options]
 * @returns {{ activate: () => Element | null, deactivate: () => Element | null, isActive: () => boolean }} Scope API.
 */
export function createFocusScope(container, options = {}) {
  if (!container || container.nodeType !== 1) {
    throw new Error('[RizzyUI] createFocusScope requires a valid container element.');
  }

  const config = {
    initialFocus: options.initialFocus ?? null,
    fallbackFocus: options.fallbackFocus ?? null,
    throwOnNoFocusable: options.throwOnNoFocusable ?? false,
  };

  let active = false;
  let previouslyFocused = null;

  function focusInitialTarget() {
    const explicitInitial = resolveElement(container, config.initialFocus);
    if (explicitInitial && isFocusable(explicitInitial)) {
      focusElement(explicitInitial);
      return explicitInitial;
    }

    const tabbables = getFocusableElements(container);
    if (tabbables.length) {
      focusElement(tabbables[0]);
      return tabbables[0];
    }

    if (config.throwOnNoFocusable) {
      throw new Error('[RizzyUI] Focus scope activation failed: no focusable elements found in container.');
    }

    const fallback = resolveElement(container, config.fallbackFocus) ?? container;
    if (!isFocusable(fallback) && fallback !== container) {
      throw new Error('[RizzyUI] Focus scope fallbackFocus must resolve to a focusable element.');
    }

    focusElement(fallback);
    return fallback;
  }

  function onKeyDown(event) {
    if (!active || getTopScope() !== api || event.key !== 'Tab') return;

    const candidates = getFocusableElements(container).filter((el) => el.getAttribute?.('tabindex') !== '-1');
    if (!candidates.length) {
      event.preventDefault();
      return;
    }

    const first = candidates[0];
    const last = candidates[candidates.length - 1];
    const activeElement = container.ownerDocument?.activeElement;

    if (event.shiftKey) {
      if (activeElement === first || !container.contains(activeElement)) {
        event.preventDefault();
        focusElement(last);
      }
      return;
    }

    if (activeElement === last || !container.contains(activeElement)) {
      event.preventDefault();
      focusElement(first);
    }
  }

  const api = {
    activate() {
      if (active) return container.ownerDocument?.activeElement ?? null;

      const doc = container.ownerDocument;
      previouslyFocused = doc?.activeElement ?? null;
      active = true;
      scopeStack.push(api);
      container.addEventListener('keydown', onKeyDown, true);
      return focusInitialTarget();
    },

    deactivate() {
      if (!active) return null;

      active = false;
      container.removeEventListener('keydown', onKeyDown, true);
      removeFromStack(api);

      if (previouslyFocused && previouslyFocused.isConnected && isFocusable(previouslyFocused)) {
        focusElement(previouslyFocused);
        return previouslyFocused;
      }

      const fallback = resolveElement(container, config.fallbackFocus)
        ?? container.ownerDocument?.body
        ?? null;
      focusElement(fallback);
      return fallback;
    },

    isActive() {
      return active;
    },
  };

  return api;
}

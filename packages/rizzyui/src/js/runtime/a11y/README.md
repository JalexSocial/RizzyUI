# RizzyUI runtime accessibility primitives

This folder centralizes shared, SSR-safe accessibility runtime primitives used by multiple RizzyUI components.

## Purpose

- Provide reusable building blocks for focus management, dismissable layers, roving focus, typeahead navigation, and announcements.
- Keep accessibility behavior consistent across components without relying on Blazor interactive events.
- Preserve compatibility with both `rizzyui.js` and `rizzyui-csp.js` bundles by using static ES module imports/exports only.

## Conventions

- Use one primitive per file in this folder.
- Use descriptive file names that match the primitive name.
- Use named exports only; do not use default exports.
- Keep primitives framework-agnostic and dependency-free.
- Keep APIs serializable and stable where events are involved.


## Extended documentation

Detailed primitive guides now live in `docs/internal/runtime-primitives/`:

- `README.md` (index + accessibility contract reminder)
- `focusable.md`
- `focusScope.md`
- `dismissableLayer.md`
- `rovingFocusGroup.md`
- `activeDescendant.md`
- `typeahead.md`
- `liveAnnouncer.md`

These guides include API references, focused examples, caveats, and cross-primitive integration advice for SSR/CSP-safe component authoring.

## Planned primitives

- `focusScope.js`: Focus containment, initial focus, and focus restore helpers.
- `dismissableLayer.js`: Outside interaction + escape-key dismissal orchestration.
- `rovingFocusGroup.js`: Keyboard roving tabindex/focus movement helpers.
- `typeaheadNavigator.js`: Typeahead matching and active-item navigation.
- `liveAnnouncer.js`: Shared live-region announcement scheduling, queueing, and deduplication.
- `ariaAnnouncer.js`: Compatibility wrapper around `liveAnnouncer.js`.

- `focusable.js`: Shared helpers to evaluate focusable/tabbable elements and move focus to first/last valid target.

## focusable.js API

- `getFocusableElements(root)`: Returns focusable descendants within `root` only; skips hidden, disabled, inert, and `aria-hidden` nodes.
- `isFocusable(element)`: True when an element can receive focus programmatically (including `tabindex="-1"`).
- `isTabbable(element)`: True when an element is included in sequential Tab order (`tabindex >= 0` when set).
- `focusFirst(root)`: Focuses and returns the first focusable descendant.
- `focusLast(root)`: Focuses and returns the last focusable descendant.

Caveat: Browser-specific edge cases around details/summary and SVG focus behavior can vary slightly by engine, so these helpers intentionally enforce a conservative, cross-browser baseline.


## focusScope.js API

- `createFocusScope(container, options?)`: Creates a scope with `activate()`, `deactivate()`, and `isActive()` methods.
- `options.initialFocus`: Selector or element that receives initial focus when the scope is activated.
- `options.fallbackFocus`: Selector or element used when no focusable descendants exist or when restore target is unavailable.
- `options.throwOnNoFocusable`: When `true`, activation throws if no focusable descendants are available.

### Usage

```js
import { createFocusScope } from './focusScope.js';

const scope = createFocusScope(dialogElement, {
  initialFocus: '[data-autofocus]',
  fallbackFocus: '[data-close-button]',
});

scope.activate();

// ...later, when closing
scope.deactivate();
```

### Behavior notes

- On activation, the scope captures `document.activeElement` so focus can be restored on close.
- Tab/Shift+Tab navigation is trapped inside the container.
- Nested scopes are supported; only the most recently activated scope traps keyboard tabbing.
- On deactivation, focus restores to the opener when possible, then falls back to `fallbackFocus`, then `document.body`.


## dismissableLayer.js API

- `registerDismissableLayer(options)`: Registers a layer and returns `unregister()`.
- `options.root`: Required root element for the overlay.
- `options.onDismiss(context)`: Required callback fired when dismissal is confirmed.
- `options.onEscape(event)`: Optional hook invoked before escape-driven dismissal.
- `options.onOutsidePointer(event)`: Optional hook invoked before outside pointer dismissal.
- `options.onOutsideFocus(event)`: Optional hook invoked before outside focus dismissal.
- `options.dismissOnOutsideFocus`: Set `true` to dismiss on `focusin` transitions outside the root.
- `createDismissableLayer()`: Returns `{ registerLayer }` for consumers that want a tiny manager object.

### Public event contract

When dismissal is attempted on the active top layer, the runtime dispatches:

- `rz:dismiss` (cancelable, bubbles) on the layer root.
- `detail.reason`: one of `escape`, `outside-pointer`, or `outside-focus`.
- `detail.layerId`: the registered layer id.
- `detail.originalEvent`: the source DOM event.

Any listener can call `event.preventDefault()` on `rz:dismiss` to cancel dismissal (for example unsaved changes checks).

### Example: basic layer registration

```js
import { registerDismissableLayer } from './dismissableLayer.js';

const unregister = registerDismissableLayer({
  root: dialogElement,
  onDismiss: ({ reason }) => {
    if (reason === 'escape' || reason === 'outside-pointer') {
      closeDialog();
    }
  }
});

// when closed/disposed
unregister();
```

### Example: nested overlays

```js
const unregisterDialog = registerDismissableLayer({
  root: dialogEl,
  onDismiss: () => closeDialog()
});

const unregisterMenu = registerDismissableLayer({
  root: menuEl,
  onDismiss: () => closeMenu()
});

// Escape now dismisses menu first because it is topmost.
// After menu unregisters, Escape dismisses dialog.
```

### Example: prevent dismissal

```js
dialogElement.addEventListener('rz:dismiss', (event) => {
  if (hasUnsavedChanges()) {
    event.preventDefault();
  }
});
```


## activeDescendant.js API

- `createActiveDescendant(controller, options, config?)`: Creates an APG-style active-descendant controller for input-driven composites (combobox, command palette, listbox).
- Returned controller:
  - `updateOptions(options)`: Replaces the active option collection after filtering and clears stale `aria-activedescendant` ids.
  - `setActiveIndex(index)`, `setActiveOption(option)`: Directly set the active option.
  - `move(step)`, `first()`, `last()`: Keyboard-friendly navigation helpers.
  - `clear()`/`reset()`: Clears active option state and removes `aria-activedescendant`.
  - `onKeydown(event)`: Handles Arrow, Home, End navigation while keeping DOM focus on the controlling element.
  - `getOptions()`, `getActiveIndex()`, `getActiveOption()`: State inspection helpers for host components.

### Options

- `wrap` (default `false`): Wraps navigation at list boundaries.
- `orientation` (default `vertical`): Supports `vertical`, `horizontal`, or `both` arrow-key models.
- `container`: Element that receives keydown handling; defaults to a detected listbox/container ancestor.
- `typeahead`: Optional function hook for character-key lookup (integrates with a dedicated typeahead primitive).

### Integration guidance

- Use this primitive when APG guidance requires focus to remain on an input/trigger while visually highlighting options via `aria-activedescendant`.
- Option elements **must** have unique `id` values; initialization/update throws when ids are missing or duplicated.
- Keep list open/close and selection logic in the host component. This primitive only tracks active descendant state and viewport visibility.
- For filtering flows, call `updateOptions(filteredOptions)` immediately after DOM updates; if the current active id no longer exists, the helper clears it automatically.
- Pair this primitive with a dedicated `typeahead` helper by providing the `typeahead` callback; this keeps text search separate from active-descendant bookkeeping.


## typeahead.js API

- `createTypeahead(options?)`: Creates a buffered typeahead matcher for menus, lists, and listboxes.
- Returned controller:
  - `search(key, items, { activeIndex? }?)`: Appends a typed character to the current buffer and returns the matched index.
  - `handleKey(event, items, { activeIndex? }?)`: Event-oriented wrapper around `search`.
  - `reset()`: Clears the buffered text immediately.
  - `getBuffer()`: Returns the current normalized buffered query.

### Options

- `getItems(items)`: Optional item resolver before matching.
- `getText(item, index)`: Returns the searchable label for each item (defaults to `textContent`, `label`, then `text`).
- `timeoutMs`: Buffer reset timeout in milliseconds (default `500`).
- `cycle`: Enables repeated-key cycling (`true` by default).
- `getActiveIndex()`: Supplies the current active index for wrap/cycle behavior.
- `onMatch(index)`: Callback invoked when a match is found (for focus/selection updates).

### Behavior notes

- Matching is case-insensitive and diacritic-tolerant by normalizing text to lower-case and stripping combining marks.
- Rapid multi-character typing narrows results by prefix.
- Repeating a single key quickly (for example `a`, `a`, `a`) cycles across items beginning with that key.
- Timeout expiry resets the buffer so the next key starts a fresh search.

### Integration guidance

- For roving focus: call `search` inside key handling and then pass the returned index into `setActiveIndex(index, { focus: true })` on `createRovingFocusGroup`.
- For active descendant widgets: use `createActiveDescendantTypeahead(activeDescendant, options?)` to automatically call `activeDescendant.setActiveIndex(index)` on matches.
- Keep container focus ownership in the host primitive/component (typeahead only resolves indices).

## rovingFocusGroup.js API

- `createRovingFocusGroup(container, options?)`: Creates a roving tabindex manager for a composite widget.
- Returned controller:
  - `updateItems()`: Recomputes managed items (for dynamic DOM changes).
  - `setActiveIndex(index, { focus? })`: Updates the active roving item by index.
  - `setActiveItem(item, { focus? })`: Updates the active item by element reference.
  - `getItems()`, `getActiveIndex()`, `getActiveItem()`: State inspection helpers.
  - `destroy()`: Removes event listeners.

### Options

- `orientation`: `'horizontal' | 'vertical' | 'both'` (default `'horizontal'`).
- `loop`: Whether arrow navigation wraps at edges (default `true`).
- `disabledItemPolicy`: `'skip' | 'stop'` (default `'skip'`).
- `activeIndex`: Initial active index (default `0`).
- `getItems(container)`: Optional item resolver override (default uses `getFocusableElements`).
- `isItemDisabled(item)`: Optional disabled predicate override (`disabled` and `aria-disabled="true"` by default).

### Keyboard and pointer behavior

- Exactly one item has `tabindex="0"`; all peers are forced to `tabindex="-1"`.
- Arrow keys move according to orientation.
- `Home` and `End` move to first and last enabled items.
- Disabled-item handling follows `disabledItemPolicy`:
  - `skip`: continue searching for next enabled item.
  - `stop`: cancel movement when next candidate is disabled.
- Pointer interaction (`pointerdown` and `click`) updates roving active index so keyboard users keep context after clicking.

### Integration guidance

This primitive is intended for APG-style composite widgets where focus remains within a list of peers:

- Tabs (`tablist > tab`)
- Accordion headers (optional roving header focus mode)
- Menus and menubars
- Toolbar-like command strips

Keep activation/selection logic in each component. The roving primitive only manages focus and tabindex state.


## liveAnnouncer.js API

- `announce(message, politeness?, options?)`: Announces `message` via the polite or assertive live region.
  - `politeness`: `polite` (default) or `assertive`.
  - `options.queue`: Defaults to `true` for polite and `false` for assertive.
  - `options.tag`: Optional metadata string stored in announcement history.
  - `options.dedupe`: Suppresses back-to-back duplicate announcements when `true` (default).
  - `options.dedupeWindowMs`: Duplicate suppression window (default `1500`).
  - `options.clearDelayMs`: Milliseconds before region text is cleared (default `1000`).
  - `options.politeIntervalMs`: Delay between queued polite announcements (default `120`).
- `ensureLiveRegions()`: Creates/reuses the hidden polite (`role="status"`) and assertive (`role="alert"`) live regions.
- `clearLiveRegions()`: Clears the current text content from both live regions.
- `getAnnouncementHistory()`: Returns an array of previously announced entries (`message`, `politeness`, `tag`, `timestamp`).
- `clearAnnouncementHistory()`: Clears the in-memory history buffer.
- `destroyLiveAnnouncer()`: Tears down live regions and queue timers.

### Usage guidance

Use this helper for short status updates such as asynchronous completion notices, loading state changes, and command outcomes. Avoid using it for inline field validation text that is already represented by native form semantics and error associations.

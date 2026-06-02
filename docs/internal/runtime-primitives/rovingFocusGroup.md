## Summary

`rovingFocusGroup.js` implements roving `tabindex` behavior for peer items in composites (tabs, menus, toolbars).

Exactly one managed item is tabbable (`tabindex="0"`) at a time.

## API

```js
createRovingFocusGroup(container: HTMLElement, options?): {
  updateItems(): void;
  setActiveIndex(index: number, opts?: { focus?: boolean }): void;
  setActiveItem(item: HTMLElement, opts?: { focus?: boolean }): void;
  getItems(): HTMLElement[];
  getActiveIndex(): number;
  getActiveItem(): HTMLElement | null;
  destroy(): void;
}
```

## Examples

```js
import { createRovingFocusGroup } from './rovingFocusGroup.js';

const group = createRovingFocusGroup(tablistEl, {
  orientation: 'horizontal',
  loop: true
});

// For dynamic lists
group.updateItems();
```

## Caveats

- Roving focus manages focus index only. It does not apply selection state (`aria-selected`) for you.
- For input-owned focus models (combobox), use [`activeDescendant`](./activeDescendant.md) instead.
- Call `destroy()` on teardown to remove listeners.

## Related resources

- [APG: Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- [APG: Toolbar Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)

## Summary

`typeahead.js` implements buffered character matching for keyboard navigation in item collections.

It supports multi-character prefix matching, timeout reset, and repeated-key cycling.

## API

```js
createTypeahead(options?): {
  search(key: string, items: unknown[], context?: { activeIndex?: number }): number;
  handleKey(event: KeyboardEvent, items: unknown[], context?: { activeIndex?: number }): number;
  reset(): void;
  getBuffer(): string;
}

createActiveDescendantTypeahead(activeDescendant, options?)
```

## Examples

```js
import { createTypeahead } from './typeahead.js';

const typeahead = createTypeahead({
  getText: (item) => item.textContent ?? '',
  onMatch: (index) => roving.setActiveIndex(index, { focus: true })
});

listEl.addEventListener('keydown', (event) => {
  typeahead.handleKey(event, roving.getItems(), { activeIndex: roving.getActiveIndex() });
});
```

## Caveats

- Typeahead resolves match indices only; apply focus/selection in the host primitive/component.
- Keep labels localized and normalized consistently for expected matching.
- In combobox-style widgets, combine with [`activeDescendant`](./activeDescendant.md).

## Related resources

- [APG: Listbox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)
- [MDN: KeyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)

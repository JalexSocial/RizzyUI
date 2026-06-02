## Summary

`activeDescendant.js` manages `aria-activedescendant` for widgets where DOM focus stays on a controlling element (for example, combobox input).

## API

```js
createActiveDescendant(controller: HTMLElement, initialOptions?: HTMLElement[], userOptions?): {
  updateOptions(options: HTMLElement[]): void;
  setActiveIndex(index: number): void;
  setActiveOption(option: HTMLElement | null): void;
  move(step: number): void;
  first(): void;
  last(): void;
  clear(): void;
  reset(): void;
  onKeydown(event: KeyboardEvent): boolean;
  getOptions(): HTMLElement[];
  getActiveIndex(): number;
  getActiveOption(): HTMLElement | null;
}
```

## Examples

```js
import { createActiveDescendant } from './activeDescendant.js';

const state = createActiveDescendant(inputEl, optionEls, {
  wrap: true,
  orientation: 'vertical'
});

inputEl.addEventListener('keydown', (event) => {
  state.onKeydown(event);
});
```

## Caveats

- Option ids must be unique and stable; missing/duplicate ids are invalid.
- This primitive does not own open/close state, filtering, or selection commit.
- Often paired with [`typeahead`](./typeahead.md) for quick option lookup.

## Related resources

- [APG: Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [MDN: aria-activedescendant](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-activedescendant)

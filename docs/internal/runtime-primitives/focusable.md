## Summary

`focusable.js` provides low-level helpers to discover focusable elements and move focus to the first or last valid target.

Use it when other primitives or components need a common definition of “focusable/tabbable” in SSR-rendered DOM.

## API

```js
isFocusable(element: Element | null): boolean
isTabbable(element: Element | null): boolean
getFocusableElements(root: Element | null): HTMLElement[]
focusFirst(root: Element | null): HTMLElement | null
focusLast(root: Element | null): HTMLElement | null
```

## Examples

```js
import { getFocusableElements, focusFirst } from './focusable.js';

const items = getFocusableElements(dialogEl);
if (items.length > 0) {
  focusFirst(dialogEl);
}
```

## Caveats

- This primitive only evaluates DOM focusability. It does not enforce APG widget semantics.
- Browser edge-cases (for example, SVG or special native controls) can vary. Keep behaviors validated in component tests.
- Prefer higher-level primitives like [`focusScope`](./focusScope.md) for modal focus trapping.

## Related resources

- [MDN: tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex)
- [MDN: HTMLElement.focus()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus)

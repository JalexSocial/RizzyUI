## Summary

`focusScope.js` manages focus containment in a subtree, including initial focus and focus restoration.

Use it for modal dialogs, popovers, and overlays that must trap Tab navigation while open.

## API

```js
createFocusScope(
  container: HTMLElement,
  options?: {
    initialFocus?: string | HTMLElement | null;
    fallbackFocus?: string | HTMLElement | null;
    throwOnNoFocusable?: boolean;
  }
): {
  activate(): void;
  deactivate(): void;
  isActive(): boolean;
}
```

## Examples

```js
import { createFocusScope } from './focusScope.js';

const scope = createFocusScope(dialogEl, {
  initialFocus: '[data-autofocus]',
  fallbackFocus: '[data-close]'
});

scope.activate();
// ... on close:
scope.deactivate();
```

## Caveats

- `focusScope` handles focus, not dismissal. Pair with [`dismissableLayer`](./dismissableLayer.md) for Escape/outside interactions.
- Always call `deactivate()` on teardown; otherwise focus restoration can be incorrect.
- Nested scopes are supported, but only the top-most active scope traps Tab.

## Related resources

- [APG: Dialog (Modal) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [MDN: focusin](https://developer.mozilla.org/en-US/docs/Web/API/Element/focusin_event)

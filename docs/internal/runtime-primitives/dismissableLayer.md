## Summary

`dismissableLayer.js` coordinates stack-aware dismissal for overlays.

It listens for Escape and outside interactions, then emits a cancelable `rz:dismiss` event before invoking `onDismiss`.

## API

```js
registerDismissableLayer({
  root: HTMLElement,
  onDismiss: (context) => void,
  onEscape?: (event) => void,
  onOutsidePointer?: (event) => void,
  onOutsideFocus?: (event) => void,
  dismissOnOutsideFocus?: boolean
}): () => void

createDismissableLayer(): {
  registerLayer: typeof registerDismissableLayer
}
```

## Examples

```js
import { registerDismissableLayer } from './dismissableLayer.js';

const unregister = registerDismissableLayer({
  root: menuEl,
  onDismiss: ({ reason }) => {
    if (reason === 'escape' || reason === 'outside-pointer') closeMenu();
  }
});

menuEl.addEventListener('rz:dismiss', (event) => {
  if (hasUnsavedChanges()) event.preventDefault();
});

// cleanup
unregister();
```

## Caveats

- Always call `unregister()`; forgotten deregistration causes stale layer stack state.
- This primitive decides *when to dismiss*, not *how focus should move*. Pair with [`focusScope`](./focusScope.md).
- Payloads should remain serializable and minimal when bridged to component events.

## Related resources

- [APG: Menu Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/)
- [MDN: KeyboardEvent key values](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values)

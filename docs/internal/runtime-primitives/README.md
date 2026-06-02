# Runtime accessibility primitives

These documents describe the Phase 1 runtime accessibility primitives in `packages/rizzyui/src/js/runtime/a11y`.

RizzyUI is SSR-first and CSP-aware. These primitives are intentionally framework-agnostic and avoid dynamic code evaluation (`eval`, `new Function`, inline script generation).

## Why these primitives exist

They provide reusable building blocks for component authors who need consistent keyboard handling, focus semantics, dismissal behavior, and screen-reader announcements across multiple components.

## Accessibility contract reminder

Primitives **do not** make a component accessible by themselves. Authors must still provide:

- semantic HTML and APG-aligned structure,
- correct ARIA roles/states/properties,
- predictable focus management,
- and tests that verify keyboard behavior and announcements.

## Primitive index

- [focusable](./focusable.md)
- [focusScope](./focusScope.md)
- [dismissableLayer](./dismissableLayer.md)
- [rovingFocusGroup](./rovingFocusGroup.md)
- [activeDescendant](./activeDescendant.md)
- [typeahead](./typeahead.md)
- [liveAnnouncer](./liveAnnouncer.md)

## Related references

- [WAI-ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/)
- [MDN: Keyboard-navigable JavaScript widgets](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets)
- [MDN: ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions)

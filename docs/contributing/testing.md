# Testing in RizzyUI

## Accessibility E2E tests

RizzyUI includes Playwright-based accessibility smoke infrastructure in `src/RizzyUI.Docs/tests/accessibility`.

### Run accessibility tests

```bash
npm test --prefix src/RizzyUI.Docs
```

or:

```bash
npm run test:a11y --prefix src/RizzyUI.Docs
```

### Browser runtime note

Accessibility tests use a bundled Chromium runtime from `@sparticuz/chromium` via `tests/accessibility/scripts/run-playwright.mjs`, so Playwright CDN browser downloads are not required in restricted environments.

### Helper utilities

Use the helpers in `src/RizzyUI.Docs/tests/accessibility/helpers/accessibility-helpers.ts`:

- Tab and Shift+Tab keyboard traversal helpers.
- Keyboard helper for Arrow keys, Home/End, Enter/Escape, and Space.
- Focus assertion helper using `document.activeElement`.
- Role plus accessible-name assertion helper.
- ARIA relationship assertion helper for IDREF attributes.
- Axe scan helper with detailed violation output.

All future interactive component accessibility tests must use these helpers for keyboard navigation, focus management, ARIA semantics, and announcement-related test consistency.

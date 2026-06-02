# RizzyUI Accessibility E2E Test Infrastructure

This Playwright-based suite provides baseline helpers for SSR accessibility contract testing.

## Included helpers

- `pressTab(page)` and `pressShiftTab(page)` for keyboard traversal.
- `pressKey(page, key)` for APG-style keyboard interactions (arrows, home/end, enter/escape/space).
- `expectActiveElement(page, locator)` to assert focus ownership against `document.activeElement`.
- `expectRoleAndAccessibleName(page, role, name)` to assert ARIA role/name discoverability.
- `expectAriaRelationship(locator, attribute, expected)` for IDREF ARIA relationship checks.
- `runAxeScan(page)` to execute axe-core and fail with structured violation output.

## Running tests

From repository root:

```bash
npm test --prefix src/RizzyUI.Docs
```

Playwright runs headless by default. The test runner uses a Chromium binary from `@sparticuz/chromium` so it does not depend on Playwright CDN downloads. The Playwright config also runs `tests/accessibility/scripts/playwright-global-setup.ts` so direct `npx playwright test ...` invocations extract the same local Chromium binary instead of requiring `npx playwright install`.

All future interactive component accessibility tests should use these helpers to keep keyboard, focus, ARIA, and scan assertions consistent.

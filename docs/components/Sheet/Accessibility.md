# Sheet Accessibility Contract

## Pattern
Slide-in panel that can operate as either a **modal dialog** or **non-modal complementary region**.

- APG basis: [Dialog (Modal) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) for modal usage.
- Non-modal usage intentionally deviates by using landmark semantics (`complementary`) with no focus trap.

## Semantics
### Modal Sheet (`Modal=true`)
- `role="dialog"`
- `aria-modal="true"`
- Accessible name from `aria-labelledby` (preferred via `SheetTitle`) or `aria-label`
- Optional description via `aria-describedby` (for `SheetDescription`)

### Non-Modal Sheet (`Modal=false`)
- `role="complementary"` (or region-equivalent strategy)
- **No** `aria-modal`
- Accessible name still required (`aria-labelledby` or `aria-label`)

### Closed State
- Sheet content is marked `aria-hidden="true"` when closed so hidden panel content is not announced.

## Keyboard Interaction
| Key | Modal | Non-Modal |
|---|---|---|
| Enter / Space on trigger | Opens sheet | Opens sheet |
| Tab | Cycles within sheet (focus trap) | Proceeds through normal page tab order |
| Shift+Tab | Reverse cycles within sheet | Proceeds through normal reverse tab order |
| Escape | Closes topmost sheet | Closes topmost sheet (when dismissal enabled) |
| Enter on close button | Closes sheet | Closes sheet |

## Focus Management
- Modal sheet uses `focusScope` to:
  - move initial focus inside on open,
  - trap Tab/Shift+Tab navigation,
  - restore focus to trigger on close.
- Non-modal sheet does not create a focus trap and allows focus to move through the page naturally.

## Screen-Reader Behaviour
- Sheet always requires an accessible name.
- Preferred naming path is `SheetTitle` → `aria-labelledby` with stable generated ids.
- `AriaLabel` is supported as a fallback when no visible title is rendered.
- `SheetDescription` maps to `aria-describedby` when available.

### Live Announcements
- No dedicated live region is emitted by Sheet itself.
- If asynchronous updates happen inside the sheet, child content should use `liveAnnouncer`/`aria-live` as needed.

## SSR/Enhanced Navigation Behaviour
- Sheet is SSR-first and Alpine-managed.
- Escape/outside-pointer dismissal is handled by `dismissableLayer` (top-layer aware).
- Re-initialization after enhanced navigation relies on standard Alpine component lifecycle.

## Known Limitations
- Nested sheets are not a supported scenario yet.
- Mixed nested modal/non-modal sheet stacks are not guaranteed.
- Side choice (left/right/top/bottom) is visual only and should not alter accessibility semantics.

## Tests
- Playwright contract tests: `src/RizzyUI.Docs/tests/accessibility/sheet.a11y.spec.ts`
- Fixture: `src/RizzyUI.Docs/wwwroot/accessibility-sheet.html`
- Coverage includes:
  - modal focus trap and focus restore,
  - non-modal no-trap behavior,
  - Escape/outside click dismissal,
  - role/name and ARIA relation assertions,
  - close-button keyboard activation,
  - side invariance check,
  - Axe scan.

## Usage Examples
### Modal
```razor
<RzSheet Modal="true" DismissOnOutsideClick="true">
    <SheetTrigger AsChild>
        <RzButton>Open modal sheet</RzButton>
    </SheetTrigger>
    <SheetContent>
        <SheetHeader>
            <SheetTitle>Profile settings</SheetTitle>
            <SheetDescription>Manage account settings.</SheetDescription>
        </SheetHeader>
    </SheetContent>
</RzSheet>
```

### Non-Modal
```razor
<RzSheet Modal="false">
    <SheetTrigger AsChild>
        <RzButton Variant="ThemeVariant.Secondary">Open navigation drawer</RzButton>
    </SheetTrigger>
    <SheetContent AriaLabel="Quick links">
        <!-- Non-modal content -->
    </SheetContent>
</RzSheet>
```

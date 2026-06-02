# Popover Accessibility Contract

## Pattern
`RzPopover` implements a **disclosure popover** pattern (non-modal by default), aligned with WAI-ARIA APG disclosure guidance: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/.

It can optionally expose a more specific popup type through `AriaHasPopup` (for example `dialog`, `menu`, `listbox`) when the popover content represents one of those popup types.

## Semantics
- Trigger semantics:
  - `aria-haspopup` comes from `RzPopover.AriaHasPopup` (default `"true"`).
  - `aria-expanded` reflects open/closed state.
  - `aria-controls` references the deterministic content id (`{popoverId}-content`).
- Content semantics:
  - Content id is stable and controlled by trigger `aria-controls`.
  - Optional `Role` can be set (for example `dialog`) when content semantics require it.
  - Accessible name can be set via `AriaLabel` or `AriaLabelledBy`.
- Non-modal contract:
  - Popover does **not** use `aria-modal`.
  - Popover does **not** trap focus by default.

### Example
```razor
<RzPopover AriaHasPopup="dialog" FocusFirstElementOnOpen="false">
    <PopoverTrigger AsChild>
        <RzButton id="account-actions-trigger">Account actions</RzButton>
    </PopoverTrigger>
    <PopoverContent Role="dialog" AriaLabel="Account actions panel">
        <RzButton Variant="ThemeVariant.Ghost">View profile</RzButton>
        <RzButton Variant="ThemeVariant.Ghost">Sign out</RzButton>
    </PopoverContent>
</RzPopover>
```

## Keyboard Interaction
- **Enter / Space on trigger:** toggles popover visibility.
- **Escape (while open):** closes the top-most popover through dismissable-layer handling.
- **Tab / Shift+Tab:** natural document flow; focus can move into popover content and back out (no trap).

## Focus Management
- Default behavior preserves focus on trigger when opening (`FocusFirstElementOnOpen = false`).
- Optional behavior can move focus to first interactive content element (`FocusFirstElementOnOpen = true`).
- On close (Escape / outside pointer / toggle close), focus is restored to the trigger when connected.

## Screen-Reader Behaviour
- Trigger exposes expanded/collapsed state through `aria-expanded`.
- Trigger advertises popup relationship through `aria-haspopup` and `aria-controls`.
- Content naming is provided by `AriaLabel` or `AriaLabelledBy`.

## Live Announcements
- No dedicated live-region announcements are emitted by popover runtime.
- If popover body contains dynamic status messages, nested components should provide their own live-region semantics.

## Disabled/Readonly Behaviour
- Popover itself does not define a separate disabled model.
- Disabled behavior is handled by the trigger element/component used inside `PopoverTrigger`.

## SSR/Enhanced Navigation Behaviour
- Popover is SSR-first and uses Alpine runtime enhancement (`x-data="rzPopover"`).
- Dismissal and keyboard/outside interactions are handled client-side via shared dismissable-layer primitives.
- Behavior remains compatible with partial updates when Alpine is re-initialized on updated markup.

## Known Limitations
- Nested popover stack interactions rely on dismissable-layer order; nested scenarios require dedicated coverage and careful trigger/content hierarchy.
- Popover is non-modal by design; modal workflows should use Dialog/Sheet.

## Accessibility Tests
- `src/RizzyUI.Docs/tests/accessibility/popover.a11y.spec.ts`
  - verifies `aria-haspopup`, `aria-expanded`, `aria-controls`
  - verifies click/keyboard open-close behavior
  - verifies Escape dismissal and outside click dismissal
  - verifies non-trapped focus movement
  - verifies optional dialog semantics and no axe violations
- `src/RizzyUI.Tests/Components/Feedback/RzPopoverTests.cs`
  - verifies SSR markup wiring for trigger/content attributes and popover bindings

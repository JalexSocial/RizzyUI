# Accessibility CI and Inventory Checks

RizzyUI runs accessibility contract checks in CI for the existing interactive components that have been brought under the accessibility contract. The inventory is based on component files that actually exist under `src/RizzyUI/Components/`; it does not require dropped prompt work, overlay-search experiments, nonexistent `Toast`/`Toggletip` components, `DataGrid`, or newly invented component names.

For real assistive-technology release passes, use the manual checklist in [`docs/accessibility/manual-testing.md`](../accessibility/manual-testing.md). It records the supported OS/browser/screen-reader matrix and keeps manual scenarios tied to existing component names such as `RzAlert`, `RzTooltip`, `RzPopover`, and `RzDataTable`.

## Preservation-first hardening

Accessibility hardening work must update existing components in place unless a change request explicitly authorizes new component creation. Before editing, inspect the component's Razor/C#, JavaScript/Alpine runtime, bUnit tests, Playwright accessibility tests, and documentation page. Preserve compliant keyboard handling, focus handling, ARIA relationships, live-region behavior, id generation, `rz:` events, public parameters, data attributes, CSS hooks, slot names, localization keys, docs examples, and generated IDs.

If existing compliant behavior is not covered by tests, add characterization tests before refactoring it. Replace behavior only when it is incomplete, inconsistent, duplicated, inaccessible, untested, or incompatible with the SSR-only and CSP-safe contract. When moving component-specific behavior into shared primitives, keep component-boundary tests proving the public behavior still works.

Use real component paths when scoping inventory or hardening work:

- `src/RizzyUI/Components/Form/RzNativeSelect/`
- `src/RizzyUI/Components/Form/RzCombobox/`
- `src/RizzyUI/Components/Navigation/RzNavigationMenu/`
- `src/RizzyUI/Components/Feedback/RzAlert/`
- `src/RizzyUI/Components/Feedback/RzTooltip/`
- `src/RizzyUI/Components/DataTable/RzDataTable/`

Shared primitive docs live in [`docs/internal/runtime-primitives/README.md`](../internal/runtime-primitives/README.md), and the component documentation template lives in [`docs/templates/component-accessibility-template.md`](../templates/component-accessibility-template.md). Shared primitives should consolidate behavior deliberately; they should not be used to discard mature component architecture. For example, do not replace `RzCombobox`'s Tom Select integration unless a separate migration is approved.

## CI coverage

The GitHub Actions build runs these accessibility-related checks:

```bash
npm test --prefix src/RizzyUI
npm run check-accessibility-inventory --prefix src/RizzyUI
dotnet test src/RizzyUI.sln --configuration Release --no-build
npm run test:a11y --prefix src/RizzyUI.Docs
```

The inventory check is blocking. If an in-scope existing component is missing documentation or tests, CI fails and prints the component path plus actionable expected documentation and test paths.

## Script location

- `tools/accessibility-inventory/check-accessibility-inventory.mjs`
- Unit tests: `tools/accessibility-inventory/__tests__/check-accessibility-inventory.test.mjs`

## How inventory detection works

The check recursively scans actual `.razor` files under `src/RizzyUI/Components` and then narrows the result to explicit accessibility-contract component directories. This keeps the check tied to real source files while avoiding requirements for components that do not exist in the repository.

The default contract directories are:

- `DataTable/RzDataTable`
- `Feedback/RzAlert`
- `Feedback/RzDialog`
- `Feedback/RzPopover`
- `Feedback/RzSheet`
- `Feedback/RzSpinner`
- `Feedback/RzTooltip`
- `Form/RzCombobox`
- `Form/RzFileInput`
- `Form/RzNativeSelect`
- `Layout/RzAccordion`
- `Navigation/RzCommand`
- `Navigation/RzDropdown`
- `Navigation/RzMenubar`
- `Navigation/RzNavigationMenu`
- `Navigation/RzSidebar`
- `Navigation/RzTabs`
- `Utility/RzBackToTop`

The default explicit component exclusions are nested native-select helper components:

- `RzNativeSelectOptGroup`
- `RzNativeSelectOption`

Ignored folders include `_Internal`, `obj`, `bin`, and `node_modules`.

## Documentation matching

For each in-scope component, the inventory accepts documentation pages in `src/RizzyUI.Docs/Components/Pages/Components` using:

- `{ComponentWithoutRz}Info.razor`
- `{ComponentName}Info.razor`
- `{ParentComponentFolderWithoutRz}Info.razor` for families that share a page, such as `RzDropdownMenu` using `DropdownInfo.razor` or `RzSidebarProvider` using `SidebarInfo.razor`

## Test matching

For each in-scope component, the inventory accepts tests in both bUnit and Playwright accessibility locations:

- `src/RizzyUI.Tests/Components`
- `src/RizzyUI.Docs/tests/accessibility`

Accepted names include component-specific bUnit tests such as `RzDialogTests.cs`, accessibility-specific bUnit names such as `RzDialogA11yTests.cs`, family bUnit tests such as `RzDropdownMenuTests.cs`, and Playwright specs such as `dialog.a11y.spec.ts`.

## Local usage

From the repository root:

```bash
npm test --prefix src/RizzyUI
npm run check-accessibility-inventory --prefix src/RizzyUI
npm run test:a11y --prefix src/RizzyUI.Docs
```

From `src/RizzyUI`:

```bash
npm test
npm run check-accessibility-inventory
```

Optional overrides for temporary local validation:

```bash
node ../../tools/accessibility-inventory/check-accessibility-inventory.mjs \
  --components-dir Components \
  --docs-dir ../RizzyUI.Docs/Components/Pages/Components \
  --tests-dirs ../RizzyUI.Tests/Components,../RizzyUI.Docs/tests/accessibility \
  --contract-directories Feedback/RzDialog,Feedback/RzPopover \
  --exclude-components RzSomeIntentionalExclusion
```

Only use exclusions for components that are intentionally out of the current accessibility-contract scope. Do not use exclusions to hide missing docs/tests for a component whose accessibility contract is being added or changed.

# RizzyUI Accessibility Audit (Prompt 0.1)

## Scope and method

This audit covers root-level interactive components in `src/RizzyUI` and
related runtime, docs, and tests.

Manual assistive-technology validation for the existing component set is tracked in [`manual-testing.md`](manual-testing.md). Use that checklist for release passes and record exact OS, browser, screen reader, and version details there.

Classifications:

- **ready**
- **needs minor fixes**
- **needs runtime support**
- **needs full implementation**

Recommended primitives: `focusScope`, `dismissableLayer`,
`rovingFocusGroup`, `activeDescendant`, `typeahead`, `liveAnnouncer`.

## Cross-cutting findings

- No Playwright/E2E suite was found; coverage is bUnit-centric.
- Many interactive components depend on Alpine runtime and expose limited
  declarative ARIA semantics at root markup level.
- Modal and composite widget behavior is often runtime-managed.

## Component audit

### Dialog (`RzDialog`) — needs runtime support
- Files: `src/RizzyUI/Components/Feedback/RzDialog/RzDialog.razor`,
  `src/RizzyUI/Components/Internal/RzModalPrimitive.razor`,
  `packages/rizzyui/src/js/lib/components/rzModal.js`
- Semantics: dialog role/state not explicit at root.
- Keyboard: no root key handlers.
- Focus: likely runtime trap/restore.
- Announcement: no explicit live strategy.
- Tests: `src/RizzyUI.Tests/Components/Feedback/RzDialogTests.cs`
- Docs: `src/RizzyUI.Docs/Components/Pages/Components/DialogInfo.razor`
- Primitives: `focusScope`, `dismissableLayer`, `liveAnnouncer`

### Sheet (`RzSheet`) — needs runtime support
- Files: `src/RizzyUI/Components/Feedback/RzSheet/RzSheet.razor`,
  `packages/rizzyui/src/js/lib/components/rzSheet.js`
- Semantics: sheet/dialog mapping not explicit.
- Keyboard: escape and focus-loop behavior not explicit in markup.
- Focus: runtime-managed.
- Announcement: none explicit.
- Tests: `src/RizzyUI.Tests/Components/Feedback/RzSheetTests.cs`
- Docs: `src/RizzyUI.Docs/Components/Pages/Components/SheetInfo.razor`
- Primitives: `focusScope`, `dismissableLayer`

### Dropdown/menu (`RzDropdownMenu`) — needs runtime support
- Files: `src/RizzyUI/Components/Navigation/RzDropdown/*`,
  `packages/rizzyui/src/js/lib/components/rzDropdownMenu.js`
- Semantics: menu hierarchy exists but needs stronger explicit role/state checks.
- Keyboard: keydown exists; full arrow/home/end/typeahead parity unclear.
- Focus: custom runtime focus flow.
- Announcement: none explicit.
- Tests: `src/RizzyUI.Tests/Components/Navigation/RzDropdownMenuTests.cs`
- Docs: `src/RizzyUI.Docs/Components/Pages/Components/DropdownInfo.razor`
- Primitives: `rovingFocusGroup`, `typeahead`, `dismissableLayer`

### Command palette (`RzCommand`, `RzCommandDialog`) — needs runtime support
- Files: `src/RizzyUI/Components/Navigation/RzCommand/*`,
  `packages/rizzyui/src/js/lib/components/rzCommand*.js`
- Semantics: partial labeling; listbox/option relationship needs normalization.
- Keyboard: runtime-driven; needs stronger contract.
- Focus: active item model needs consistency.
- Announcement: result count/status announcements not explicit.
- Tests: `src/RizzyUI.Tests/Components/Navigation/RzCommandTests.cs`,
  `src/RizzyUI.Tests/Components/Navigation/RzCommandDialogTests.cs`
- Docs: `src/RizzyUI.Docs/Components/Pages/Components/CommandInfo.razor`
- Primitives: `activeDescendant`, `typeahead`, `focusScope`, `liveAnnouncer`

### Popover (`RzPopover`) — needs minor fixes
- Files: `src/RizzyUI/Components/Feedback/RzPopover/*`,
  `packages/rizzyui/src/js/lib/components/rzPopover.js`
- Semantics: labeling present; trigger-content linkage can be tightened.
- Keyboard: escape/tab handling not explicit in root markup.
- Focus: dismiss/return pattern likely runtime-managed.
- Announcement: generally not required.
- Tests: `src/RizzyUI.Tests/Components/Feedback/RzPopoverTests.cs`
- Docs: `src/RizzyUI.Docs/Components/Pages/Components/PopoverInfo.razor`
- Primitives: `dismissableLayer`, `focusScope`

### Tooltip (`RzTooltip`) — needs tests and documentation alignment
- Files: `src/RizzyUI/Components/Feedback/RzTooltip/*`,
  `packages/rizzyui/src/js/lib/components/rzTooltip.js`
- Semantics: trigger/content description relationship and `role="tooltip"` are documented and covered by tests.
- Keyboard: focus opens the tooltip; Escape closes it when visible and restores trigger focus.
- Focus: hover/focus parity and no focus trap are covered by Playwright tests.
- Announcement: non-interactive tooltip description behavior is documented; interactive disclosure points to `RzPopover`.
- Tests: `src/RizzyUI.Tests/Components/Feedback/RzTooltipTests.cs`
- Docs: `src/RizzyUI.Docs/Components/Pages/Components/TooltipInfo.razor`
- Primitives: `dismissableLayer`, `focusScope`

### Accordion (`RzAccordion`) — needs runtime support
- Files: `src/RizzyUI/Components/Layout/RzAccordion/*`,
  `packages/rizzyui/src/js/lib/components/rzAccordion.js`
- Semantics: expanded/controls relationships need explicit verification.
- Keyboard: arrow/home/end behavior not explicit in markup.
- Focus: likely runtime roving.
- Announcement: none expected.
- Tests: `src/RizzyUI.Tests/Components/Layout/RzAccordionTests.cs`
- Docs: `src/RizzyUI.Docs/Components/Pages/Components/AccordionInfo.razor`
- Primitives: `rovingFocusGroup`

### Tabs (`RzTabs`) — needs runtime support
- Files: `src/RizzyUI/Components/Navigation/RzTabs/*`,
  `packages/rizzyui/src/js/lib/components/rzTabs.js`
- Semantics: tablist/tab/tabpanel mapping should be hardened.
- Keyboard: likely runtime-driven; verify full tab key model.
- Focus: active tab focus management is JS-centric.
- Announcement: none explicit.
- Tests: `src/RizzyUI.Tests/Components/Navigation/RzTabsTests.cs`
- Docs: `src/RizzyUI.Docs/Components/Pages/Components/TabsInfo.razor`
- Primitives: `rovingFocusGroup`, `activeDescendant`

### Select (`RzNativeSelect`) — ready
- Files: `src/RizzyUI/Components/Form/RzNativeSelect/*`
- Semantics: native select semantics.
- Keyboard: native browser support.
- Focus: native behavior.
- Announcement: native AT support.
- Tests: `src/RizzyUI.Tests/Components/Form/RzNativeSelect/*Tests.cs`
- Docs: `src/RizzyUI.Docs/Components/Pages/Components/NativeSelectInfo.razor`
- Primitives: none required

### Combobox (`RzCombobox`) — needs runtime support
- Files: `src/RizzyUI/Components/Form/RzCombobox/*`,
  `packages/rizzyui/src/js/lib/components/rzCombobox.js`
- Semantics: combobox role/state contract appears incomplete.
- Keyboard: needs complete list navigation and selection behaviors.
- Focus: deterministic input/list ownership needed.
- Announcement: option count/selection messaging absent.
- Tests: `src/RizzyUI.Tests/Components/Form/RzComboboxTests.cs`
- Docs: `src/RizzyUI.Docs/Components/Pages/Components/ComboboxInfo.razor`
- Primitives: `activeDescendant`, `typeahead`, `dismissableLayer`,
  `liveAnnouncer`

### Sidebar (`RzSidebar`) — needs minor fixes
- Files: `src/RizzyUI/Components/Navigation/RzSidebar/*`,
  `packages/rizzyui/src/js/lib/components/rzSidebar.js`
- Semantics: state exposure and labeling can be clearer.
- Keyboard: some support is documented; needs consistency in nested structures.
- Focus: collapse/expand recovery should be standardized.
- Announcement: no explicit state announcement strategy.
- Tests: `src/RizzyUI.Tests/Components/Navigation/RzSidebar/*Tests.cs`
- Docs: `src/RizzyUI.Docs/Components/Pages/Components/SidebarInfo.razor`
- Primitives: `rovingFocusGroup`, `dismissableLayer`

### Navigation menu (`RzNavigationMenu`) — needs runtime support
- Files: `src/RizzyUI/Components/Navigation/RzNavigationMenu/*`,
  `packages/rizzyui/src/js/lib/components/rzNavigationMenu.js`
- Semantics: aria-label present; role/state hierarchy needs stronger guarantees.
- Keyboard: keydown present; full menubar-like behavior should be standardized.
- Focus: needs shared roving behavior.
- Announcement: expanded state exposure should be explicit.
- Tests: `src/RizzyUI.Tests/Components/Navigation/RzNavigationMenuTests.cs`
- Docs: `src/RizzyUI.Docs/Components/Pages/Components/NavigationMenuInfo.razor`
- Primitives: `rovingFocusGroup`, `typeahead`, `dismissableLayer`

### Toast/alert (`RzAlert`) — needs minor fixes
- Files: `src/RizzyUI/Components/Feedback/RzAlert/*`,
  `packages/rizzyui/src/js/lib/components/rzAlert.js`
- Semantics: `role="alert"`, `aria-live`, `aria-atomic` present.
- Keyboard: dismissal appears click-centric.
- Focus: dismiss-action focus handling should be verified.
- Announcement: live region exists.
- Tests: `src/RizzyUI.Tests/Components/Feedback/RzAlertTests.cs`
- Docs: `src/RizzyUI.Docs/Components/Pages/Components/AlertInfo.razor`
- Primitives: `liveAnnouncer`, `dismissableLayer`

### File input (`RzFileInput`) — needs runtime support
- Files: `src/RizzyUI/Components/Form/RzFileInput/*`,
  `packages/rizzyui/src/js/lib/components/rzFileInput.js`
- Semantics: basic role/labeling present; dropzone/list semantics incomplete.
- Keyboard: drag/drop flow needs keyboard equivalence.
- Focus: trigger-input-chip focus path should be formalized.
- Announcement: upload state announcements not explicit.
- Tests: `src/RizzyUI.Tests/Components/Form/RzFileInputTests.cs`
- Docs: `src/RizzyUI.Docs/Components/Pages/Components/FileInputInfo.razor`
- Primitives: `liveAnnouncer`, `focusScope`

### Data table (`RzDataTable`) — needs runtime support
- Files: `src/RizzyUI/Components/DataTable/RzDataTable/*`,
  `packages/rizzyui/src/js/lib/components/rzDataTable.js`
- Semantics: table present; sort/filter/pagination state exposure needs work.
- Keyboard: sortable headers/filter controls need a unified key model.
- Focus: dense interaction focus order needs standardization.
- Announcement: state-change announcements not explicit.
- Tests: `src/RizzyUI.Tests/Components/DataTable/RzDataTable/RzDataTableTests.cs`
- Docs: `src/RizzyUI.Docs/Components/Pages/Components/DataTableInfo.razor`
- Primitives: `liveAnnouncer`, `rovingFocusGroup`, `typeahead`

### Skip-to link analogue (`RzBackToTop`) — needs full implementation
- Files: `src/RizzyUI/Components/Utility/RzBackToTop/*`,
  `packages/rizzyui/src/js/lib/components/rzBackToTop.js`
- Semantics: back-to-top utility, not a dedicated skip-to-content primitive.
- Keyboard: activation should be explicitly validated.
- Focus: lacks classic skip-link focus relocation pattern.
- Announcement: none.
- Tests: `src/RizzyUI.Tests/Components/Utility/RzBackToTopTests.cs`
- Docs: `src/RizzyUI.Docs/Components/Pages/Components/BackToTopInfo.razor`
- Primitives: `focusScope` (or dedicated skip-link primitive)

### Busy indicator (`RzSpinner`) — ready
- Files: `src/RizzyUI/Components/Feedback/RzSpinner/*`
- Semantics: `role="status"` with labeling.
- Keyboard: not interactive.
- Focus: not applicable.
- Announcement: status role is suitable baseline.
- Tests: `src/RizzyUI.Tests/Components/Feedback/RzSpinnerTests.cs`
- Docs: `src/RizzyUI.Docs/Components/Pages/Components/SpinnerInfo.razor`
- Primitives: optional `liveAnnouncer`

### Nav group (`RzMenubar`) — needs runtime support
- Files: `src/RizzyUI/Components/Navigation/RzMenubar/*`,
  `packages/rizzyui/src/js/lib/components/rzMenubar.js`
- Semantics: root `role="menubar"` exists; child role/state consistency needed.
- Keyboard: arrow/home/end/escape/typeahead patterns need hardening.
- Focus: roving focus likely custom runtime behavior.
- Announcement: expanded-state exposure should be explicit.
- Tests: `src/RizzyUI.Tests/Components/Navigation/RzMenubarTests.cs`
- Docs: `src/RizzyUI.Docs/Components/Pages/Components/MenubarInfo.razor`
- Primitives: `rovingFocusGroup`, `typeahead`, `dismissableLayer`

## Classification summary

- ready: 2
- needs minor fixes: 3
- needs runtime support: 10
- needs full implementation: 3

Total audited components: 18.

## Suggested primitive rollout order

1. `dismissableLayer` + `focusScope`
2. `rovingFocusGroup` + `typeahead`
3. `activeDescendant` + `liveAnnouncer`

## Missing or unexpected layout notes

- No dedicated SkipToContent component found.
- No Playwright/E2E test files found.
- Prompt mentions toast; current implementation appears under `RzAlert`.

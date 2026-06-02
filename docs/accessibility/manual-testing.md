# Manual Assistive-Technology Testing Checklist

Use this checklist when validating RizzyUI components with real assistive technologies. It is intentionally tied to component names and documentation pages that exist in this repository so that the checklist can be updated without adding obligations for dropped experiments or nonexistent components.

## Scope

### In scope components

| Component | Component path | Documentation page | Primary interaction model |
| --- | --- | --- | --- |
| `RzNativeSelect` | `src/RizzyUI/Components/Form/RzNativeSelect/` | `src/RizzyUI.Docs/Components/Pages/Components/NativeSelectInfo.razor` | Native browser select and option semantics. |
| `RzCombobox` | `src/RizzyUI/Components/Form/RzCombobox/` | `src/RizzyUI.Docs/Components/Pages/Components/ComboboxInfo.razor` | Alpine/Tom Select enhanced input backed by a native `select`. |
| `RzNavigationMenu` | `src/RizzyUI/Components/Navigation/RzNavigationMenu/` | `src/RizzyUI.Docs/Components/Pages/Components/NavigationMenuInfo.razor` | Alpine disclosure navigation with trigger/content relationships. |
| `RzAccordion` | `src/RizzyUI/Components/Layout/RzAccordion/` | `src/RizzyUI.Docs/Components/Pages/Components/AccordionInfo.razor` | Alpine accordion items with button/region relationships. |
| `RzTabs` | `src/RizzyUI/Components/Navigation/RzTabs/` | `src/RizzyUI.Docs/Components/Pages/Components/TabsInfo.razor` | Alpine tablist, tab, and tabpanel relationships. |
| `RzTooltip` | `src/RizzyUI/Components/Feedback/RzTooltip/` | `src/RizzyUI.Docs/Components/Pages/Components/TooltipInfo.razor` | Non-interactive descriptive tooltip. Use `RzPopover` for interactive disclosure content. |
| `RzAlert` | `src/RizzyUI/Components/Feedback/RzAlert/` | `src/RizzyUI.Docs/Components/Pages/Components/AlertInfo.razor` | Alert/live-region messaging and optional dismissal. |
| `RzFileInput` | `src/RizzyUI/Components/Form/RzFileInput/` | `src/RizzyUI.Docs/Components/Pages/Components/FileInputInfo.razor` | Native file picker with Alpine drag/drop enhancement and status announcements. |
| `RzSidebar` | `src/RizzyUI/Components/Navigation/RzSidebar/` | `src/RizzyUI.Docs/Components/Pages/Components/SidebarInfo.razor` | Persistent desktop sidebar plus mobile sheet behavior through `RzSheet`. |
| `RzDataTable` | `src/RizzyUI/Components/DataTable/RzDataTable/` | `src/RizzyUI.Docs/Components/Pages/Components/DataTableInfo.razor` | Native table semantics with Alpine table state, selection, sorting, filtering, pagination, and status announcements. |

### Explicitly out of scope

Do not create or require manual AT scenarios for these names unless a future implementation adds real component paths and documentation pages:

- `Toast`: RizzyUI uses `RzAlert` for alert/live-region guidance in this checklist.
- `Toggletip`: use `RzTooltip` for non-interactive descriptions and `RzPopover` for interactive disclosure content.
- `DataGrid`: use `RzDataTable` and its accessibility-mode design note.
- Dropped overlay-search experiments or earlier prompt prototypes that are not present as existing components.

## Test run record

Copy this block into the issue, pull request, or release checklist for every manual AT pass.

```text
Date:
Tester:
RizzyUI commit:
Docs app URL:
Operating system and version:
Browser and version:
Screen reader / AT and version:
Browser zoom:
Reduced motion setting:
Forced colors / high contrast setting:
Keyboard layout:
Input method(s): keyboard, pointer, touch, voice control, switch control
SSR/enhanced-navigation mode tested: initial page load, enhanced navigation, browser back/forward
Components tested:
Known issues found:
Follow-up issue links:
```

## AT and browser matrix

Test at least the primary matrix before a release. Use the secondary matrix when a component has recently changed focus behavior, keyboard behavior, live-region behavior, or ARIA relationships.

### Primary release matrix

| Operating system | Browser | Assistive technology | Notes to record |
| --- | --- | --- | --- |
| Windows 11 | Chrome stable | NVDA current stable | Record NVDA speech viewer output for announcements when possible. |
| Windows 11 | Edge stable | JAWS current supported version | Record whether forms mode/application mode changes are expected or surprising. |
| macOS current and previous supported version | Safari stable | VoiceOver bundled with macOS | Record rotor landmarks/headings/form controls for each page. |
| iOS current supported version | Safari | VoiceOver bundled with iOS | Record touch exploration and hardware-keyboard differences. |
| Android current supported version | Chrome | TalkBack bundled or current stable | Record linear navigation order and touch exploration behavior. |

### Secondary matrix

| Operating system | Browser | Assistive technology | When to include |
| --- | --- | --- | --- |
| Windows 11 | Firefox stable | NVDA current stable | Include for composite widgets such as `RzCombobox`, `RzNavigationMenu`, `RzTabs`, and `RzDataTable`. |
| Windows 11 | Firefox stable | JAWS current supported version | Include when ARIA active-descendant, menu, or tab behavior changed. |
| macOS current | Chrome stable | VoiceOver | Include when Alpine runtime or enhanced-navigation loading changed. |
| Windows 11 | Chrome stable | Windows High Contrast / forced colors | Include when visible focus, disabled states, or status text styling changed. |
| Any supported desktop OS | Browser with screen reader off | Keyboard only | Include on every manual pass to isolate keyboard/focus failures from AT verbosity differences. |

## Cross-component checks

Run these checks for every component in scope.

### Semantics and naming

- Confirm the component exposes the documented role, native element, accessible name, accessible description, and state.
- Confirm ID-based relationships resolve to existing elements, including `aria-controls`, `aria-labelledby`, `aria-describedby`, `aria-activedescendant`, and table header relationships when present.
- Confirm decorative icons and preview-only visuals are hidden from assistive technologies with `aria-hidden="true"` or equivalent semantics.
- Confirm validation and disabled states are exposed with native `disabled`, `aria-disabled`, `aria-invalid`, or documented state attributes as appropriate.

### Keyboard behavior

- Use only the keyboard to reach, operate, and leave the component.
- Verify `Tab` and `Shift+Tab` order is predictable and does not trap focus unless the documented pattern requires a modal focus trap.
- Verify `Enter`, `Space`, `Escape`, arrow keys, `Home`, and `End` match the component documentation and WAI-ARIA APG pattern when a pattern applies.
- Verify disabled items do not activate and have a documented focus model.
- Verify no key is handled twice. A single keystroke should not skip items, toggle twice, or produce duplicate announcements.

### Focus behavior

- Confirm visible focus is always present in normal, dark, forced-colors, and high-contrast modes.
- Confirm focus restoration after dismiss/close flows, including `Escape`, close buttons, outside click where applicable, route changes, and browser back/forward.
- Confirm roving-focus or active-descendant patterns keep DOM focus where the component contract says it should stay.
- Confirm mobile modal/offcanvas flows restore focus to the invoking control after close.

### Announcements and live regions

- Confirm announcements occur for selection changes, state changes, errors, uploads, removals, table state changes, and alerts where documented.
- Confirm announcement politeness is appropriate: use polite status updates for routine state changes and assertive alerts only for urgent content.
- Confirm repeated state changes do not create noisy duplicate announcements.
- Confirm hidden/inactive panels, closed popups, or collapsed content are not announced as currently visible.

### SSR and enhanced navigation

- Load the page directly from the browser address bar and test the component before any client-side route change.
- Navigate to the page with enhanced navigation or HTMX-boosted links, then repeat keyboard and AT checks.
- Use browser back/forward and repeat focus, announcement, and relationship checks.
- Confirm Alpine-enhanced controls preserve useful native fallbacks during initial render and do not require Blazor interactive runtime events.
- Confirm CSP-safe behavior: no inline ad-hoc JavaScript is required beyond existing RizzyUI Alpine loading conventions.

## Component scenarios

### `RzNativeSelect`

- Confirm the control is announced as a native select/combobox/listbox according to the AT/browser combination.
- Confirm label, description, invalid state, and disabled state are announced.
- Open the select with native keyboard commands for the platform and browser.
- Change the selected option with arrow keys and confirm the value is announced.
- Confirm grouped options and disabled options are announced correctly when examples include `RzNativeSelectOptGroup` or disabled options.
- Confirm the decorative chevron icon is not announced.
- Confirm initial page load and enhanced navigation preserve native select behavior.

### `RzCombobox`

- Confirm the enhanced input receives the accessible name, description, invalid state, disabled state, and multi-select state from the backing select.
- Open the popup with the documented keyboard command and confirm expanded/collapsed state is announced.
- Navigate options with arrow keys, `Home`, `End`, and typeahead/filter text; confirm the active option and result changes are understandable.
- Select and remove values with keyboard only; confirm selected values, disabled options, and placeholder text are announced correctly.
- Confirm `Escape` closes the popup without losing the current input focus unless the documented behavior says otherwise.
- Confirm `Tab` leaves the widget predictably and does not trap focus in the popup.
- Confirm `rz:combobox:change` remains a browser `CustomEvent` with primitive detail fields when testing event instrumentation.
- Confirm direct SSR load and enhanced navigation both initialize the Alpine/Tom Select enhancement without duplicate controls.

### `RzNavigationMenu`

- Confirm the root navigation is named by `aria-label` and exposes the expected orientation.
- Confirm each trigger has `aria-haspopup`, `aria-expanded`, and `aria-controls` relationships that update when content opens and closes.
- Use pointer hover, focus, click, `Enter`, `Space`, `ArrowLeft`, `ArrowRight`, `ArrowDown`, and `Escape`; confirm each documented action is announced and focus moves predictably.
- Confirm `Escape` closes open content and restores focus to the trigger that opened it.
- Confirm moving between triggers does not leave multiple panels exposed to assistive technologies.
- Confirm content links are reachable and leave the menu without unexpected focus loss.
- Repeat after enhanced navigation to catch duplicate Alpine listeners.

### `RzAccordion`

- Confirm each header button announces its label, `aria-expanded` state, and `aria-controls` relationship.
- Confirm each panel has a `region` relationship back to its header when rendered.
- Toggle each item with `Enter` and `Space`; confirm expanded/collapsed state changes are announced.
- Verify arrow-key, `Home`, and `End` behavior documented for the accordion examples.
- Confirm single-open and multiple-open modes match the example contract.
- Confirm disabled items, if present, are skipped or announced according to the documented focus model and cannot be toggled.
- Confirm collapsed panel content is not reached by virtual cursor or sequential focus.

### `RzTabs`

- Confirm the list is announced as a `tablist` with the documented orientation.
- Confirm each trigger is announced as a `tab` with `aria-selected`, `aria-controls`, and disabled state where applicable.
- Confirm each active panel is announced as a `tabpanel` labelled by the active tab.
- Use arrow keys, `Home`, and `End` to move between tabs; confirm roving `tabindex` and selected state update correctly.
- Activate tabs with `Enter` or `Space` if the example uses manual activation; confirm automatic activation examples switch panels on focus when documented.
- Confirm inactive panels are hidden from sequential focus and virtual cursor navigation.
- Confirm focus remains in the tablist during tab navigation and moves into panel content only by normal `Tab` flow or explicit user action.

### `RzTooltip`

- Confirm the trigger remains the only focusable control; tooltip content must not contain interactive controls.
- Confirm the tooltip content has `role="tooltip"` and is connected to the trigger by the documented relationship.
- Show the tooltip with pointer hover and keyboard focus; confirm the descriptive text is available to the screen reader without moving focus into the tooltip.
- Press `Escape` while the tooltip is visible; confirm it closes and focus remains on or returns to the trigger.
- Move pointer and focus away; confirm the tooltip closes and is no longer announced.
- Confirm long, interactive, or dismissible disclosure content is documented and tested with `RzPopover` instead of creating a `Toggletip` component.

### `RzAlert`

- Confirm `RzAlert` is used for alert/live-region guidance instead of a nonexistent Toast component.
- Confirm role, `aria-live`, and atomic announcement behavior match the alert variant and urgency.
- Insert or reveal an alert and confirm the screen reader announces the title/content once.
- If the alert is dismissible, reach the close button with keyboard, confirm its accessible name, activate it with `Enter` and `Space`, and verify the alert is removed or hidden without unexpected focus loss.
- Confirm decorative alert icons are not announced.
- Confirm repeated alerts or repeated dismiss/show cycles do not produce duplicate live-region announcements after enhanced navigation.

### `RzFileInput`

- Confirm the native file input and visible trigger share the documented label and description.
- Activate the trigger with `Enter` and `Space`; confirm it opens the operating-system file picker when possible.
- Select one file and multiple files; confirm selected file count and file names are announced through the polite status region.
- Remove a file with the keyboard; confirm the remove button label includes the file name and the status announces removal.
- Confirm image previews have useful alt text and non-image previews are not announced as images.
- Confirm disabled state removes the trigger from activation and exposes disabled semantics.
- Confirm drag/drop visual state is not the only available interaction path; keyboard and AT users must be able to use the native file picker.

### `RzSidebar`

- On desktop width, confirm the sidebar behaves as persistent navigation/layout content and does not trap focus.
- Toggle collapsed/expanded state with the documented trigger or keyboard shortcut; confirm state changes are visible, announced when documented, and do not strand focus in hidden controls.
- Confirm menu links, group labels, group actions, separators, and badges have appropriate semantics and reading order.
- On mobile width, open the sidebar and confirm it behaves through `RzSheet` as a modal offcanvas panel with focus moved into the panel.
- Press `Escape`, activate the close control if available, and use outside-dismiss where documented; confirm focus returns to the invoking control.
- Confirm `rz:sidebar:state-change`, `rz:sidebar:mobile-open`, `rz:sidebar:mobile-close`, and `rz:sidebar:breakpoint-change` events remain primitive-detail browser events when instrumented.
- Repeat desktop/mobile transitions after enhanced navigation and browser back/forward.

### `RzDataTable`

- Confirm the table is announced as a native table with useful caption, headers, row headers, and cell relationships when examples provide them.
- Sort a column with keyboard only; confirm the next action is labelled, current sort state is exposed, focus remains predictable, and a polite state announcement is made.
- Use row-selection checkboxes; confirm row labels, checked/mixed/disabled state, select-all behavior, and selection announcements.
- Use filter controls and pagination controls; confirm labels, current page, disabled navigation controls, and state announcements.
- Confirm column-visibility controls, if present in the scenario, expose checked state and do not remove focused content without focus recovery.
- Confirm `rz:datatable:ready`, `rz:datatable:state-changed`, `rz:datatable:selection-changed`, `rz:datatable:page-changed`, `rz:datatable:sort-changed`, `rz:datatable:filter-changed`, `rz:datatable:column-visibility-changed`, and `rz:datatable:announcement` events remain primitive-detail browser events when instrumented.
- Confirm the native-table browsing model is preserved; do not expect or require an ARIA `grid` contract unless a future design explicitly changes `RzDataTable`.

## Known issues and follow-up log

Use this section to keep manual findings visible without changing component contracts silently.

| Date | Component | AT/browser | Issue | Severity | Mitigation | Follow-up |
| --- | --- | --- | --- | --- | --- | --- |
| _Add date_ | _Component_ | _AT/browser/version_ | _Observed behavior_ | _Blocker/High/Medium/Low_ | _Temporary guidance_ | _Issue or PR link_ |

When adding a known issue, include exact versions from the test run record and note whether the issue is a RizzyUI bug, an AT/browser quirk, or an intentional APG deviation documented by the component page.

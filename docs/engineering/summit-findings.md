# Summit findings: what building a real app on RizzyUI turned up

Summit (`samples/Summit`, plan in [summit-demo-plan.md](summit-demo-plan.md)) is built partly to
battle-test Rizzy and RizzyUI. This log records everything that got in the way while building it:
bugs, missing features, rough developer experience, documentation gaps and accessibility issues. It
is written as things happen, not reconstructed at the end.

Each entry says what happened, how Summit worked around it, and what would fix it in the library.
Entries from the planning pass (before any code) are marked **(planning)**.

The closing assessment (verdict, priorities, roadmap, adoption readiness) is in
[summit-assessment.md](summit-assessment.md).

## Categories

| Tag | Meaning |
|---|---|
| **Bug** | The library does something wrong. |
| **Gap** | Something a real app needs that the library does not offer. |
| **DX** | It works, but it was harder than it should be: friction, surprises, boilerplate. |
| **Docs** | The documentation is wrong, missing or misleading. |
| **A11y** | An accessibility problem. |
| **Perf** | A performance or payload problem. |

Severity: **High** (blocks a common use case or ships broken behavior), **Medium** (needs a
workaround a typical developer would not find quickly), **Low** (annoyance).

## How each finding is tracked

Every finding has an **owner** (Rizzy, RizzyUI, the starter template, a third-party dependency, or
Summit itself) and three independent statuses:

| Column | Values |
|---|---|
| **Application** | *Works (workaround)*: Summit's workflow works because of application code that compensates. *Works (designed around)*: Summit avoids the pattern. *Affected*: users can still hit the problem. *Not reached yet*: the workflow is not built yet (planning finding). *n/a*: documentation only. |
| **Library** | *Open* until the defect is fixed in the library and the workaround removed. A working application never makes a library defect resolved. |
| **Regression test** | Which automated test would fail if the problem came back. *(defect)*: the test detects the library problem itself. *(workflow)*: the test covers the affected user workflow (with the workaround in place). *None*: not covered. |

Every workaround in Summit's code carries a comment with its SF id, so `grep SF-0` lists them all and
each can be deleted when its library fix ships. The [integration code ledger](#integration-code-ledger)
tracks how much application code exists only to compensate.

## Index

| Id | Owner | Area | Tag | Severity | Summary | Application | Library | Regression test |
|---|---|---|---|---|---|---|---|---|
| SF-001 | RizzyUI | RzDataTable | Gap | High | Client-side only: no way to carry table state into a request, no row update | Works | Fixed in 1.0.0-preview.4 | bUnit: RzDataTableStateTests (parse, versions, model binder) and RzDataTableTests (state input rendered) (defect); e2e: attendees S-03, S-04 (workflow) |
| SF-002 | RizzyUI | RzSheet | Gap | Medium | No open/close event names (RzDialog has both); the server cannot close a sheet | Works | Fixed in 1.0.0-preview.4 | RizzyUI integration: overlay-events.spec.ts (sheet opened and closed by window events, rz:sheet:open/close), both builds (defect); e2e: attendees S-03 (workflow) |
| SF-003 | RizzyUI | RzDialog | DX | Medium | The default close event is global: closing one dialog from the server closes all of them | Works | Fixed in 1.0.0-preview.4 | RizzyUI integration: overlay-events.spec.ts (close by id, close all), both builds (defect); e2e: attendees S-04 (workflow) |
| SF-004 | RizzyUI docs | RzDialog docs | Docs | Medium | Docs name `rz:modal-close` and `Constants.Events.ModalClose`, which do not exist | n/a | Fixed in 1.0.0-preview.4 | n/a (docs) |
| SF-005 | RizzyUI | RzChart | Bug | Medium | Colors from CSS variables are not re-read on theme change | Works | Fixed in 1.0.0-preview.4 | RizzyUI integration: chart.spec.ts, both builds (defect); e2e: dashboard dark mode (workflow) |
| SF-006 | RizzyUI | RzToast | DX | Medium | Server toasts are silently dropped on non-htmx requests and redirects | Works | Fixed in 1.0.0-preview.4 | bUnit: RzToastMiddlewareLoggingTests (Warning in Development for a normal request and an htmx redirect, Debug elsewhere) (defect) |
| SF-007 | RizzyUI | RzCommandDialog | Gap | Medium | Does not pass `ItemsUrl`/`ServerFiltering` through; no Ctrl+K shortcut | Works | Fixed in 1.0.0-preview.4 | e2e: search palette, quick actions (workflow) |
| SF-008 | RizzyUI, htmx | RzFileInput | Gap | Low | No upload progress (and htmx 4's `fetch` reports none) | Works | Fixed in 1.0.0-preview.4 | n/a (docs) |
| SF-009 | RizzyUI, Rizzy | Forms | DX | High | Field names differ between components (`Country` vs `Model.Country`) | Works | Fixed in 1.0.0-preview.4 | bUnit: ModelPathNameTests (the five components post the model path like Blazor's InputText) (defect); e2e: contact upload, schedule filters (workflow) |
| SF-010 | RizzyUI | RzSidebar | DX | Low | Persisted collapse state is not read on the server: the sidebar flashes open | Works | Fixed in 1.0.0-preview.4 | bUnit: RzSidebarProviderTests (persisted state from the request cookie) (defect) |
| SF-011 | RizzyUI | RzSidebar | DX | Low | `ChildContent` is rendered twice (mobile and desktop), so fixed ids inside it collide | Works | Fixed in 1.0.0-preview.4 | n/a (docs) |
| SF-012 | RizzyUI, Rizzy | Asset URLs | DX | Medium | Widget libraries default to jsDelivr: CI depends on a CDN, strict `style-src` blocks the calendar CSS | Works | Fixed in 1.0.0-preview.4 | bUnit: LocalAssetPathTests (local URLs keep their hashes, overrides win) (defect); e2e: external-request guard (defect) |
| SF-013 | RizzyUI | RzInputOTP | Bug | Low | Inline `style` attribute breaks a strict `style-src` | Works | Fixed in 1.0.0-preview.4 | bUnit: no style attribute on the OTP input (defect); docs scan CSP build |
| SF-014 | RizzyUI | RzDateEdit | Gap | Low | `Mode.Range` cannot bind to the single `DateTime?` it requires | Works | Fixed in 1.0.0-preview.4 | n/a (docs) |
| SF-015 | RizzyUI | RzToggle | DX | Low | Posts nothing; filters built from toggles need custom code | Works | Fixed in 1.0.0-preview.4 | RizzyUI integration: directives.spec.ts (posts its value while pressed) (defect) |
| SF-016 | RizzyUI | RzCommand | Gap | Medium | Command items have no link or href: Enter on an item does nothing unless the app handles `rz:command:execute` | Works | Fixed in 1.0.0-preview.4 | RizzyUI integration: command.spec.ts (an item with Href navigates), both builds (defect); e2e: quick actions, search palette (workflow) |
| SF-017 | Rizzy, template | Asset URLs | DX | Medium | `Assets[...]` and Rizzy's default `ClientScriptUrl` are relative; without `<base href="/">` styles and scripts 404 on nested URLs, and with it in-page links break | Works | Fixed in Rizzy 6.0.0-preview.4 | Rizzy: ExtensionTests (script URL with and without a path base) (defect); template test (slice 15 adds a nested URL check) |
| SF-018 | RizzyUI, template | RzButton | Bug | High | No `AsChild`: `<RzButton AsChild><a>` renders a link inside a button (invalid, two tab stops). The starter template's 404 page and the docs do this | Works | Fixed in 1.0.0-preview.4 | bUnit: RzButtonTests.AsChild_* (defect); the starter template's 404 page (slice 10 adds a browser check) |
| SF-019 | RizzyUI docs | RzNavigationMenu docs | Docs | Medium | The docs' `ListItem` example puts `RzLink` inside `NavigationMenuLink`, which already renders an `<a>`: nested anchors | Works | Fixed in 1.0.0-preview.4 | docs scan (navigation menu page) |
| SF-020 | Rizzy, template | Rizzy + starter | Bug | High | `UseStatusCodePagesWithReExecute` (starter template) swallows `UseHtmxRedirects`' 401 + `HX-Redirect`, and turns every empty 4xx (antiforgery 400, 401, 405) into "Page not found" with status 404 | Works (workaround) | Open | Summit.Tests: htmx redirect, antiforgery 400 (defect) |
| SF-021 | Template | Starter template | Bug | High | `<body hx-boost="true">` boosts nothing in htmx 4 (no implicit inheritance): every link is a full page load | Works | Fixed in 1.0.0-preview.4 | template test: hx-boost:inherited in the markup and a Playwright check that a sidebar link navigates without a reload (defect); e2e: shell boosted navigation (workflow) |
| SF-022 | RizzyUI | RzAlert | A11y | Medium | Always a live region (`role="alert"` by default): a static callout on page load is announced as an alert | Works | Fixed in 1.0.0-preview.4 | bUnit: AccessibilityDefaultsTests (a static alert has no live region) (defect) |
| SF-023 | RizzyUI, Blazicons | Icons | Bug | Medium | Material Design icons render `id="mdi-…"`: 14 components (breadcrumb separator, nav menu trigger, pagination, checkbox indicator, …) emit duplicate ids | Works | Fixed in 1.0.0-preview.4 | bUnit: AccessibilityDefaultsTests (built-in icons render no ids) (defect); docs scan and Summit unique-id checks without the `mdi-` exception |
| SF-024 | htmx, Rizzy docs | htmx boost | DX | Low | Boosted navigation swaps only `<body>`: `<html lang>` (and anything else on `<html>`) keeps the old value after a language switch | Works (documented pattern) | Fixed in docs | n/a (documentation) |
| SF-025 | RizzyUI | RzCommand | Bug | Medium | Typing then pressing Enter quickly runs the item highlighted before the 50 ms search debounce, not the match | Works | Fixed in 1.0.0-preview.4 | RizzyUI integration: command.spec.ts (Enter right after typing), both builds (defect); e2e: quick actions without a wait (workflow) |
| SF-026 | RizzyUI | FieldError | A11y | Low | Renders an empty `role="alert"` for every field, even without errors | Works | Fixed in 1.0.0-preview.4 | bUnit: AccessibilityDefaultsTests (a field error around child content is not an alert) (defect) |
| SF-027 | RizzyUI docs | Docs | Docs | Medium | No docs page or example for `RzEmbeddedPreview`, `RzFormSection`, `RzSearchButton`, `RzDarkModeToggle`, `RzIdScope` | n/a | Fixed in 1.0.0-preview.4 | docs scan (five new pages) |
| SF-028 | RizzyUI, Rizzy | Forms | DX | Medium | Every RizzyUI input needs an `EditContext`; a GET filter form must cascade one by hand (an `EditForm` adds a token and `_handler` to the query string) | Works | Fixed in 1.0.0-preview.4 | bUnit: RzGetForm cascades an EditContext and renders a GET form (defect); e2e: schedule and speaker filters (workflow) |
| SF-029 | RizzyUI | RzCheckboxGroup | A11y | Medium | Renders a fieldset with an empty legend (a nameless group) unless `DisplayName` is set; ignores `[Display(Name)]` | Works | Fixed in 1.0.0-preview.4 | bUnit: AccessibilityDefaultsTests (a checkbox group is named by [Display]) (defect); e2e: getByRole group name (workflow) |
| SF-030 | RizzyUI | Alpine attributes | DX | Medium | A consumer's `x-on:click` on `RzToggle` (and other components that bind the same event) is silently replaced by the component's own; `RzToggle` dispatches no change event | Works | Fixed in 1.0.0-preview.4 | RizzyUI integration: directives.spec.ts (caller x-on:click and rz:toggle:change), both builds (defect); e2e: schedule level toggles (workflow) |
| SF-031 | RizzyUI | RzAvatar | A11y | Medium | Defaults to `role="img" aria-label="Avatar"`, which overrides `AvatarImage`'s alt text: every avatar is announced as "Avatar" | Works | Fixed in 1.0.0-preview.4 | bUnit: AccessibilityDefaultsTests (an avatar is named or decorative) (defect) |
| SF-032 | RizzyUI | RzSheet | A11y | Low | Initial focus goes to the first focusable element; when that is in the footer, a long sheet opens scrolled to the bottom. No initial-focus option | Works | Fixed in 1.0.0-preview.4 | RizzyUI integration: overlay-events.spec.ts (InitialFocus on a dialog and a sheet), both builds (defect); e2e: schedule session details (workflow) |
| SF-033 | RizzyUI, Rizzy | Inputs | DX | Low | A consumer `id` on `RzInputText`/`InputGroupInput` is replaced by a generated id, so a `<label for>` written by hand points at nothing (a consumer `name` is kept) | Works | Fixed in 1.0.0-preview.4 | bUnit: input-group controls keep a caller id (defect); e2e: speakers search label (workflow) |
| SF-034 | RizzyUI | RzThemeProvider | Bug | High | The theme's CSS variables are injected with `<HeadContent>`; Blazor renders only one `HeadContent`, so any other `HeadContent` on the page silently removes the whole theme | Works | Fixed in 1.0.0-preview.4 | RizzyUI integration: head-content.spec.ts (a page with its own HeadContent keeps the theme in <head>), both builds; bUnit: RzThemeProviderTests (defect); e2e: shell, theme and track colors in <head> (workflow) |
| SF-035 | RizzyUI | RzAuroraText | A11y | Low | `AriaLabel` puts `aria-label` on a role-less `span` (axe: aria-prohibited-attr); colors come from an inline `style` attribute (blocked by a strict `style-src`) | Works | Fixed in 1.0.0-preview.4 | bUnit: RzAuroraTextTests (no inline style for the defaults, label as hidden text) (defect); docs scan (home page CSP entry removed) |
| SF-036 | RizzyUI | Status colors | A11y | Medium | Soft badges and Information/Success/Warning alerts fail WCAG AA contrast (1.9 to 3.6:1) with the default status palette; themes can override it only through undocumented JSON keys | Works | Fixed in 1.0.0-preview.4 | bUnit: ThemeContrastTests (status colors on their tint and behind their foreground) (defect); docs scan |
| SF-037 | RizzyUI | RzFileInput | A11y | Medium | The dropzone is a `role="button"` named "File input" while it shows "Drag and drop files here or click to upload" (WCAG 2.5.3), and the name says nothing about which file | Works | Fixed in 1.0.0-preview.4 | bUnit: AccessibilityDefaultsTests (the dropzone is named by its text) (defect) |
| SF-038 | RizzyUI | RzItemGroup | A11y | Medium | `RzItemGroup` is `role="list"` but `RzItem` has no `listitem` role (axe: aria-required-children, critical) | Works | Fixed in 1.0.0-preview.4 | bUnit: AccessibilityDefaultsTests (items in a group are list items) (defect); axe on Summit's session pages |
| SF-039 | RizzyUI | Lazy components | DX | Low | Window events sent before a lazily loaded component has initialized are lost (a dialog's `EventTriggerName`, Ctrl+K right after load) | Works | Fixed in 1.0.0-preview.4 | node: lazyEvents.test.mjs (buffered and replayed once) (defect); RizzyUI integration: overlay-events.spec.ts (an open event at page load opens the dialog, rz:ready), both builds (defect) |
| SF-040 | RizzyUI | RzCommand | Bug | High | Data-driven items (`Items` or `ItemsUrl` with `CommandItemTemplate`) never render: `data-template-id` is always empty, so the client reports "No data template found" | Works | Fixed in 1.0.0-preview.4 | RizzyUI integration: command.spec.ts (Items and ItemsUrl with CommandItemTemplate), both builds (defect); e2e: site search (workflow) |
| SF-041 | Rizzy, RizzyUI | Error feedback | Gap | Low | `UseHtmxErrorHandling` raises `rz:server-error`, but nothing shows it: every app writes the same listener to turn it (and htmx network errors) into a toast | Works | Fixed in 1.0.0-preview.4 | RizzyUI integration: server-error-toasts.spec.ts, both builds; JS unit tests (defect); e2e: dashboard failed panels request (workflow) |
| SF-042 | RizzyUI, template | Build | DX | Medium | With `RizzyUICodeBehindBuild=esbuild`, a clean build fails (RZUI1003) when npm runs `BeforeTargets="Build"`, the starter template's pattern: the esbuild step runs earlier, in CoreBuild | Works | Fixed in 1.0.0-preview.4 | template test: a clean `dotnet new rizzyui` build (defect) |
| SF-043 | Rizzy | HtmxResponse | DX | Medium | Every `Response.Htmx()` setter throws on a non-htmx request, so an action that serves a direct page load and boosted navigation needs a guard around each header (a plain link to it returned 500) | Works (workaround) | Open (decided: D-30) | e2e: checkout entry link (workflow) |
| SF-044 | Rizzy | RzModelStateProvider | Bug | High | Server validation errors for collection items (`Model.Attendees[0].Name`) are never shown: keys containing `[` map to a non-existent root field, so a 422 for a list form displays no errors at all | Works (workaround) | Open | e2e: checkout attendees 422 (defect) |
| SF-045 | RizzyUI | Forms | Gap | Medium | Nothing moves focus to the first invalid field after a server validation response; every form needs its own script (WCAG 3.3.1 usability, keyboard users stay where they were) | Works | Fixed in 1.0.0-preview.4 | RizzyUI integration: focus moves to the first invalid field (defect); e2e: forms after a 422 (workflow) |
| SF-046 | RizzyUI, Tom Select | RzCombobox | Bug | Medium | Typing a search and pressing Enter quickly selects the option highlighted before the search (Tom Select's throttled refresh); `ComboboxOptions` cannot turn the throttle off | Works | Fixed in 1.0.0-preview.4 | e2e: checkout attendee countries without a wait (workflow) |
| SF-047 | Rizzy, RizzyUI | RzRadioGroup | Bug | Low | Every radio input renders `id=""`: Rizzy's `RzInputRadioBase` writes its `Id` (default empty) and `RadioGroupItem` never sets it | Affected (invalid HTML) | Open | e2e: unique-id check annotation (defect); docs scan (known-defect list) |
| SF-048 | RizzyUI | RzDataTable | Gap | Medium | Rows are rendered by Alpine after htmx processed the page, so `hx-*` attributes in a row template do nothing; row actions need script | Works | Fixed in 1.0.0-preview.4 | RizzyUI integration: datatable.spec.ts (hx-get in a row template issues its request), both builds (defect); e2e: attendees S-03 (workflow) |
| SF-049 | RizzyUI | RzSidebar, RzTable | DX | Low | `SidebarInset` grows to the width of a wide table instead of letting it scroll (no `min-w-0`); `RzTable`'s `class` goes on the scroll container, not the `<table>` | Works | Fixed in 1.0.0-preview.4 | Manual (page width checked in the browser) |
| SF-050 | RizzyUI | RzDataTable | DX | Low | In row templates, `row` is RizzyUI's view object (`{ id, row, cells }`), and the row data is camelCase while column ids keep the C# names | Works | Fixed in 1.0.0-preview.4 | n/a (docs) |
| SF-051 | Summit | Attendees | Bug | Low | A hidden input named `Filter` matched the action parameter `filter`, so MVC bound `AttendeeServerFilter` with the prefix `filter.` and lost Status and Ticket | Fixed (renamed to `Search`) | n/a | e2e: attendees server filters |
| SF-052 | RizzyUI | RzInputTextArea | Bug | Medium | `RzInputTextArea` renders without the shared input styles (no border, background, padding or focus ring) | Works | Fixed in 1.0.0-preview.4 | bUnit: RzInputTextAreaTests.IsStyledLikeTheOtherInputs (defect); e2e: axe over the contact, checkout and attendee forms (workflow) |
| SF-053 | RizzyUI | RzDataTable | Bug | Medium | `DataTableSortToggle` is named "Sort ascending" / "Clear sort" with no column, hiding its visible text (WCAG 2.5.3, axe `label-content-name-mismatch`); the strings are English-only | Works | Fixed in 1.0.0-preview.4 | RizzyUI integration: datatable.spec.ts and the datatable accessibility fixtures (toggle named after its column) (defect); e2e: attendees (workflow) |
| SF-054 | RizzyUI | RzDataTable, RzTable | Bug | Medium | RizzyUI components inside a DataTable `x-for` template render a fixed server id, which Alpine copies into every row (one id 90 times on a 10-row page) | Works | Fixed in 1.0.0-preview.4 | RizzyUI integration: datatable.spec.ts (no repeated ids after rows render) (defect); docs scan (template-id entry removed); e2e: unique-id check without the template exception |
| SF-055 | RizzyUI, Tom Select | RzCombobox | Bug | Medium | Pressing Tab in a multiple `RzCombobox` sends focus to `<body>`: the `checkbox_options` plugin RizzyUI adds puts a tabbable checkbox in every option, and Tom Select hides the list on blur | Works | Fixed in 1.0.0-preview.4 | e2e: attendee tags, Tab moves on to Notes (workflow) |
| SF-056 | RizzyUI | RzDataTable | DX | Medium | A standard table (sorting, selection, search, column menu, paging, empty state) takes about 130 lines of headless markup with string expressions; there is no default rendering | Works | Fixed in 1.0.0-preview.4 | bUnit: RzDataTableTests (header and body helpers render the standard rows) (defect); RizzyUI integration: datatable.spec.ts (every example on the DataTable page runs), both builds |
| SF-057 | RizzyUI | RzCalendar, RzPopover | Bug | High | In the documented "Range Popover" pattern (provider around a popover) the calendar is teleported to `<body>`, so its events never reach `RzCalendarProvider`: the provider never sees the calendar or a click | Works | Fixed in 1.0.0-preview.4 | RizzyUI integration: calendar-popover.spec.ts (the docs Range Popover example), both builds (defect); e2e: dashboard calendar range (workflow) |
| SF-058 | RizzyUI | RzCalendarProvider | Gap | Medium | The provider is not a form participant: no `Name`, no hidden inputs, no `change` event; a range filter needs hidden inputs, bindings and script to submit | Works | Fixed in 1.0.0-preview.4 | bUnit: CalendarProviderFieldsTests (fields rendered) (defect); RizzyUI integration: calendar-popover.spec.ts (fields follow the range, change raised), both builds (defect); e2e: dashboard range (workflow) |
| SF-059 | RizzyUI | RzChart | Bug | Medium | The chart config has no top-level `type` (only per-dataset types), so Chart.js uses no chart-type defaults: a doughnut's legend shows the dataset label instead of one entry per slice | Works | Fixed in 1.0.0-preview.4 | RizzyUI integration: chart.spec.ts (doughnut legend), both builds (defect) |
| SF-060 | RizzyUI | RzNumberTicker | Bug | High | `data-value` is written with the current culture, so a decimal is `96356,2` under de-DE; the script parses it as 0 and the ticker shows €0,00 | Works | Fixed in 1.0.0-preview.4 | bUnit: InvariantMarkupTests (every component with a fractional parameter under de-DE) (defect); e2e: culture S-12 revenue with cents (workflow) |
| SF-061 | RizzyUI | RzChart | Bug | Low | The chart's base element has no height and its container has `min-h-[300px]`, so in a sized parent the canvas grows past it (484 px in a 224 px box) | Works | Fixed in 1.0.0-preview.4 | RizzyUI integration: chart.spec.ts (fixed-height parent), both builds (defect) |
| SF-062 | RizzyUI | RzChart | Bug | High | RzChart keeps the Chart.js instance in Alpine's reactive state: `update()` on a theme change throws ("Maximum call stack size exceeded"), and `destroy()` on the proxy leaves the chart registered, so replacing a chart during its animation throws "reading 'save'" | Works | Fixed in 1.0.0-preview.4 | RizzyUI integration: chart.spec.ts, both builds (defect); e2e: dashboard dark mode (workflow) |
| SF-063 | RizzyUI | RzTable | Bug | Low | RzTable's scroll container cannot take focus, so a table without focusable cells cannot be scrolled with the keyboard (axe `scrollable-region-focusable`) | Works | Fixed in 1.0.0-preview.4 | docs scan (table entry removed); e2e: axe on dashboard, check-in and settings tables |
| SF-064 | RizzyUI | RzInputOTP | DX | Low | Extra attributes go to the container, not the input, so `autofocus` (and `autocapitalize`, `enterkeyhint`) cannot be set; a desk that must refocus the badge field needs script | Works | Fixed in 1.0.0-preview.4 | bUnit: InputAttributes reach the native input (defect); e2e: check-in badge field (workflow) |
| SF-065 | RizzyUI | RzAlert | Bug | Medium | Colored alert variants set the base text to the variant's `*-foreground` (made for a solid fill) on a 10% tint: content without its own color is unreadable (1.14:1 in light mode) | Works | Fixed in 1.0.0-preview.4 | bUnit: RzAlertTests.TintedStatusAlerts_UseTheForegroundColorForContent (defect); e2e: check-in axe (workflow) |
| SF-066 | RizzyUI | RzIndicator | Bug | Low | RzIndicator puts `aria-label` (default "Indicator") on a `div` without a role (axe `aria-prohibited-attr`) | Works | Fixed in 1.0.0-preview.4 | bUnit: AccessibilityDefaultsTests (an indicator is an image with a label, decorative without) (defect); docs scan entry removed |
| SF-067 | RizzyUI | RzMenubar | Gap | Medium | Menubar checkbox and radio items change only their own `aria-checked`: no event, no value posted, no way to bind them to state | Works | Fixed in 1.0.0-preview.4 | RizzyUI integration: directives.spec.ts (checked-change on the menubar), both builds (defect); e2e: schedule builder view menu (workflow) |
| SF-068 | RizzyUI | RzDateEdit | Bug | Medium | RzDateEdit's input carries `aria-label="Select date"` (and its group `aria-label="Date picker"`), which overrides the field's `<label for>`: the input is announced as "Select date", not "Starts at" | Works | Fixed in 1.0.0-preview.4 | bUnit: DateCultureTests (no default name, AriaLabel) (defect); e2e: schedule builder finds the field by its label (workflow) |
| SF-069 | RizzyUI | RzMenubar | Bug | Medium | `MenubarItem` writes its own `x-on:click` after the caller's attributes, so a caller's `x-on:click` is silently dropped (another instance of pattern 1) | Works | Fixed in 1.0.0-preview.4 | RizzyUI integration: directives.spec.ts (caller x-on:click on a menubar item), both builds (defect); e2e: schedule builder publish all (workflow) |
| SF-070 | RizzyUI | RzSlider | DX | Low | RzSlider is not an `EditForm` input: it takes `Value` as a `double[]` and a `Name` (indexed by default), has no `For`, so no field label association, no validation state and no model binding | Works | Fixed in 1.0.0-preview.4 | bUnit: RzInputSliderTests (model path, single value, data-invalid) (defect); e2e: schedule builder length (workflow) |
| SF-071 | RizzyUI | RzClipboard | Bug | Low | RzClipboard renders a bare button the size of its content (14 px with an icon), under WCAG 2.2's 24 px target size (axe `target-size`) | Works | Fixed in 1.0.0-preview.4 | bUnit: AccessibilityDefaultsTests (minimum target size) (defect); e2e: settings API keys (axe) |
| SF-072 | RizzyUI (npm) | Packaging | DX | Low | `@jalexsocial/rizzyui/testing` is an ES module but the package has no `"type": "module"`, so every code-behind test run prints Node's MODULE_TYPELESS_PACKAGE_JSON warning and reparses the file | Works | Fixed in 1.0.0-preview.4 | node: the package's own tests run without the warning |
| SF-073 | RizzyUI | RzCalendar, RzDateEdit | Gap | Medium | Date components default to English instead of the request culture: RzCalendar's `Locale` defaults to "en", and RzDateEdit cannot show another language because flatpickr's locale files are neither shipped nor loaded (a `Locale = "de"` silently falls back to English) | Works | Fixed in 1.0.0-preview.4 | bUnit: DateCultureTests (culture mapping, locale file after flatpickr) (defect); e2e: culture S-12 (workflow) |
| SF-074 | RizzyUI | RzSheet | Bug | High | A sheet opened from its trigger leaves focus on the trigger and does not trap Tab: the focus scope activates while the panel is still hidden, and its key handler listens on the panel | Works | Fixed in 1.0.0-preview.4 | RizzyUI integration: sheet focus trap, both builds (defect); e2e: mobile S-16 (focus stays in the navigation sheet) |
| SF-075 | RizzyUI | RzSidebar | Bug | Medium | `SidebarGroup` always renders `aria-labelledby` pointing at its label's id, also when the group has no `SidebarGroupLabel`: a reference to an element that does not exist (20 groups on every docs page) | Works | Fixed in 1.0.0-preview.4 | bUnit: AccessibilityDefaultsTests (aria-labelledby only with a label) (defect); docs scan entry removed |
| SF-076 | RizzyUI | RzPopover | Bug | Low | `RzPopover`'s `AriaLabel` lands on its wrapper `div`, which has no role (axe `aria-prohibited-attr`), instead of the trigger or the content | n/a | Fixed in 1.0.0-preview.4 | bUnit: AccessibilityDefaultsTests (the popover label names its content) (defect); docs scan entry removed |
| SF-077 | RizzyUI | RzCalendar | A11y | Medium | Calendar weekend column headers and some day buttons fail WCAG AA contrast in RizzyUI's calendar styles | Works | Fixed in 1.0.0-preview.4 | docs scan (calendar pages, color-contrast entry removed) |
| SF-078 | RizzyUI | Default theme | A11y | Medium | In the docs theme, `text-primary` links, primary and outline buttons, the Steps labels, command shortcuts and event-viewer entries measure below 4.5:1 | n/a | Fixed in 1.0.0-preview.4 | bUnit: ThemeContrastTests (every token pair of the built-in theme, light and dark) (defect); docs scan (color-contrast entries removed) |
| SF-079 | RizzyUI | RzCommand | A11y | Low | An `RzCommand` list with no matching items is still a `listbox` with no `option` children (axe `aria-required-children`) | n/a | Fixed in 1.0.0-preview.4 | docs scan (command page entry removed) |
| SF-080 | RizzyUI docs | RzSidebar preview | A11y | Low | In the sidebar docs preview, menu items are not inside a list (`listitem`, `aria-required-children`) and the rail buttons are under 24 px; to triage between the example and the components | n/a | Fixed in 1.0.0-preview.4 | bUnit: AccessibilityDefaultsTests (a collapsible AsChild puts its behavior on the menu item) (defect); docs scan (sidebar entries removed) |
| SF-081 | RizzyUI docs | Docs site styling | A11y | Medium | The docs site's own styles fail contrast: parameter names in the API tables (`text-sky-600`), prose links and inline code | n/a | Fixed in 1.0.0-preview.4 | docs scan (color-contrast entry removed) |
| SF-082 | RizzyUI docs | Docs examples | A11y | Medium | Docs examples teach inaccessible markup: icon-only buttons without names, inputs, selects, an OTP and a textarea without labels, an `arialabel` typo, breadcrumb items with unknown parameters, small targets | n/a | Fixed in 1.0.0-preview.4 | docs scan (button-name, label, select-name, listitem and target-size entries removed) |
| SF-083 | RizzyUI docs | Docs examples (CSP) | Bug | Low | On the CSP build, docs examples use inline handlers and an inline script, load external images, start confetti's blob worker, and the Alpine fundamentals page uses expressions the CSP build cannot parse | n/a | Fixed in 1.0.0-preview.4 | docs scan, CSP project (csp, console and pageerror entries removed) |
| SF-084 | RizzyUI | Markdown code blocks | A11y | Low | RizzyUI's Markdig extension renders fenced code blocks as `<pre class="border-muted border">` without `tabindex`, so a block wide enough to scroll cannot be scrolled with the keyboard (axe `scrollable-region-focusable`) | n/a | Fixed in 1.0.0-preview.4 | bUnit: AccessibilityDefaultsTests (Markdown code blocks are focusable) (defect); docs scan entry removed |

## Integration code ledger

Application code that exists only because a library does not (yet) do something. Each item names the
findings it compensates for; when those are fixed, the code should be deleted. Application-specific
behavior (code a real product would write anyway) is listed separately, so the two can be compared.

### Compensating code (should disappear)

| Code | Lines | Compensates for | What a library fix replaces it with |
|---|---|---|---|
| `Infrastructure/StatusPages.cs` | ~35 C# | SF-020 | Rizzy disabling status pages for htmx redirects and partial requests |
| `vendor.json`, `scripts/fetch-vendor.mjs` (download the pinned files) | ~40 JS/JSON | SF-012 | Kept: the app chooses where the files come from; RizzyUI maps them with `LocalAssetPath` |
| `Program.cs`: absolute `ClientScriptUrl`; `AppLayout`: `"/@Assets[...]"` | 3 | SF-017 | Absolute default URLs |
| `Features/Schedule/ScheduleBoard.razor.js`: delegated toggle clicks | ~8 JS | SF-030 | `rz:toggle:change` or merged `x-on:click` |
| `ScheduleFilters`, `SpeakersPage`: hand-cascaded `EditContext` | ~6 per form | SF-028 | Inputs that work without an `EditContext` |
| `Infrastructure/HtmxResponses.cs` | ~25 C# | SF-043 | `HtmxResponse` setters that are no-ops for normal requests |
| `Components/Shared/IndexedModelStateProvider.cs` | ~60 C# | SF-044 | `RzModelStateProvider` resolving indexed keys |
| `Areas/Organizer/Features/Attendees/AttendeeTableState.razor(.ts)`: focus return after a save, selection count | ~40 TS/Razor | SF-002 | Application behavior (the row that opened the editor is rebuilt) |
| Plain read-only input in `RzInputGroup` | 1 | SF-028 | An input-group control without a model |

### Application-specific code (would exist anyway)

| Code | Lines | Purpose |
|---|---|---|
| `Features/Home/ConferenceCountdown.razor.js` | ~30 JS | Countdown from the server's clock |
| `Features/Schedule/ScheduleBoard.razor.js` (level filter, day memory) | ~45 JS | Client-side filtering of rendered cards; keeping the active tab in the filter form |
| `Features/Checkout/TicketEstimate.razor.js` | ~35 JS | Live price estimate while the ticket form changes |
| `AttendeeTableState.razor.ts`: bulk-action bar label and confirmation text; `Components/Shared/text.ts` | ~20 TS | Bulk actions on the selected attendees |
| `DashboardFilters.razor.ts`: quick ranges (`last7`, `last30`, `wholeSale`), closing the popover | ~20 TS | Preset date ranges |
| `Settings/SettingsPage.razor.js` (URL follows the open tab) | ~10 JS | Shareable settings URLs |

Running total after phase 3: about 340 lines of compensating code (C# and JavaScript), about 110
lines of application-specific client code. After the attendees page (phase 4a): about 445 lines of
compensating code, about 130 lines of application-specific client code. The attendees page alone added
about 105 compensating lines against 20 application lines: the DataTable is the component that needs the
most glue so far. After the dashboard: about 535 lines of compensating code, about 150
lines of application-specific client code. The dashboard's code-behind is 80% compensation: forwarding
calendar events, making a range part of a form, and keeping Chart.js alive across swaps and theme changes. After phase 4 (the whole organizer area): about 570 lines of
compensating code and about 160 lines of application-specific client code. The check-in desk and the
settings page needed almost none; the schedule builder about 25 lines.

## Recurring patterns

Several findings share a root cause. Fixing the pattern removes more workarounds than fixing each
finding on its own.

1. **Component-computed attributes silently override the developer's** (SF-030 `x-on:click`, SF-033
   `id`, SF-040 `data-template-id`, and in spirit SF-018 `AsChild`). Decision D-20 made computed values
   win, which protects component behavior, but nothing tells the developer their attribute was dropped.
   A consistent policy (merge event handlers and ids, warn in Development when a consumer attribute is
   replaced) would remove a whole class of silent failures.
2. **Form inputs choose their own names and require an `EditContext`** (SF-009, SF-028, SF-033). Group
   inputs use bare property names, Rizzy inputs use model paths, ids cannot be set, and GET forms need a
   hand-made `EditContext`. One naming and binding model across RizzyUI and Rizzy inputs is needed.
3. **The server cannot drive overlays consistently** (SF-002, SF-003, SF-032). Dialogs have open/close
   events (global by default), sheets have none, focus targets are fixed. Per-instance open/close events
   on every overlay, and an initial-focus option, would give one pattern for server-driven UI.
4. **Lazy loading leaks into application behavior** (SF-039, and SF-025's debounce). Events and
   keypresses that arrive before a component's chunk has loaded are lost. A readiness signal and event
   buffering in the runtime would fix it once.
5. **Accessibility defaults** (SF-022, SF-023, SF-026, SF-029, SF-031, SF-035 to SF-038). Generic default
   labels ("Avatar", "File input"), roles without required children, live regions on static content and
   low-contrast status colors, sort buttons without their column (SF-053), duplicate ids in row
   templates (SF-054), unstyled text areas (SF-052). Axe and a unique-id check over the docs pages would
   have found most of them.
6. **htmx 4 behavior the template and Rizzy do not account for** (SF-017, SF-020, SF-021, SF-024). The
   template test checks pages with curl; one browser test of boosted navigation, an expired session and
   a nested URL would have caught all four.
7. **Who owns the `<head>`** (SF-012, SF-017, SF-034). Theme styles, asset URLs and third-party scripts
   all assume things about the head that apps break by doing normal things.
8. **Server components inside client templates** (SF-048, SF-050, SF-054, SF-056). `RzDataTable` renders
   rows in the browser from `<template x-for>`, but what goes inside the template is server-rendered
   Razor. Ids are rendered once and copied, htmx never sees the rows, the data inside uses a different
   naming scheme from the column ids, and the expressions are strings checked only at run time. The
   server-rendered component model and Alpine-rendered rows meet here without a contract; a default
   rendering, per-row ids and `htmx.process` after each render would cover most of it.
9. **Teleported overlays break DOM assumptions** (SF-057, and the `htmxTeleportBridge` that already exists
   for htmx). Popover, dialog and sheet content moves to `<body>`; anything that finds its owner by
   bubbling (calendar to provider) or by `closest()` stops working inside an overlay. One mechanism
   (forwarding events from teleported content, or resolving owners through Alpine scope) would cover
   every composite component.
10. **Third-party instances in reactive state, and culture in machine-readable output** (SF-062,
    SF-060). Chart.js through an Alpine proxy, and a decimal written with the UI culture into `data-*`:
    both pass every English, single-render demo and fail in a real app. A review rule ("no third-party
    instance in Alpine data; every number in markup is invariant") would prevent the class.

## Entries

### SF-001 RzDataTable is client-side only (planning)

- **Tag:** Gap, High
- **What:** All `Items` are serialized into the page, and sorting, filtering, paging, selection and
  column visibility live only in the browser (TanStack). Nothing is posted back. A table re-rendered by
  the server starts from `InitialState`, so a filter change or a save loses the user's sort, page and
  hidden columns. Rows are rendered by Alpine from JSON, so a single-row out-of-band swap is
  impossible. `DataTable/Models/TableRequestModel.cs` exists but nothing uses it.
- **Summit workaround:** a TypeScript code-behind (`AttendeeTableState`) listens to
  `rz:datatable:state-changed` and writes the state into hidden inputs; requests include them with
  `hx-include`; the server rebuilds `InitialState` from them and replaces the whole table.
- **Library fix:** a built-in state transport, for example a `StateInputName` parameter that renders
  hidden inputs (or one JSON input) kept in sync, plus a server-side `RzDataTableState` model binder
  that maps back to `RzDataTableInitialState`. Decide what `TableRequestModel` is for, or delete it.
- **Fixed in 1.0.0-preview.4:** decision D-31: `RzDataTable` takes `StateInputName` (and opt-in `IncludeSelectionInState`) and keeps one hidden input (`{Id}-state`) with its state as versioned JSON; `RzDataTableState` binds it (MVC model binder, minimal API `TryParse`) and maps it back with `ToInitialState()`. `TableRequestModel` is obsolete. Summit's seven mirrored hidden inputs, `AttendeeTableRequest` and the TypeScript state mirror are replaced by the state input and `AttendeeTableStates` (its defaults and page-size limits).

### SF-002 RzSheet has no event-driven open or close (planning)

- **Tag:** Gap, Medium
- **What:** `rzSheet.js` registers no window listeners. `RzDialog` has `EventTriggerName` and
  `CloseEventName`; `RzSheet` has neither, so `HX-Trigger` cannot close a sheet after a successful
  save, and code cannot open one.
- **Summit workaround:** the editor sheet is swapped in with `DefaultOpen="true"` and closed by
  swapping its container empty (an out-of-band swap).
- **Library fix:** the same `EventTriggerName`/`CloseEventName` parameters as `RzDialog`.
- **Fixed in 1.0.0-preview.4:** `RzSheet` takes `EventTriggerName` and `CloseEventName` (default `rz:sheet-close`, with an optional target id, D-29) and dispatches `rz:sheet:open` and `rz:sheet:close` (also for a sheet rendered open; close fires after focus returned). Summit's attendee editor is closed by `HX-Trigger: {"rz:sheet-close": {"id": "attendee-sheet"}}` instead of being removed; content loaded on demand still renders its sheet open with `DefaultOpen`, now documented.

### SF-003 Closing one dialog from the server closes all dialogs (planning)

- **Tag:** DX, Medium
- **What:** `CloseEventName` defaults to `rz:dialog-close` and listens on `window`. A server response
  with `HX-Trigger: rz:dialog-close` closes every open dialog on the page, not the one whose form was
  submitted.
- **Summit workaround:** every dialog sets its own `CloseEventName`.
- **Library fix:** document it prominently; consider scoping the default name to the dialog id
  (`rz:dialog-close:{id}`) or accepting an id in the event detail.
- **Fixed in 1.0.0-preview.4:** decision D-29: `rz:dialog-close` with `detail.id` closes only the dialog with that id; without one it closes every dialog. Summit's named close events (`attendees:bulk-close`, `builder:publish-close`, `settings:revoke-close`, `settings:create-key-close`, `summit:close-search`) are replaced by the one event with an id.

### SF-004 Dialog docs use an event and a constant that do not exist (planning)

- **Tag:** Docs, Medium
- **What:** `DialogInfo.razor` (lines 264 and 326) says the default close event is `rz:modal-close` and
  shows `RizzyUI.Constants.Events.ModalClose`. The constant does not exist (the code would not compile)
  and the real default is `Constants.Events.DialogClose` = `rz:dialog-close`.
- **Library fix:** correct both lines.
- **Fixed in 1.0.0-preview.4:** the dialog page names `rz:dialog-close` and `Constants.Events.DialogClose` and shows a close by id; the JavaScript fallback `rz:modal-close` is gone.

### SF-005 RzChart keeps light-mode colors after switching to dark mode (planning)

- **Tag:** Bug, Medium
- **What:** `rzChart.js` resolves `var(--chart-1)` and friends once at init. Its `rz:theme-change`
  handler only calls `chart.update()`, which redraws with the colors already resolved.
- **Confirmed (phase 4a):** on the dashboard the y-axis tick color stayed `oklch(0.47 0.03 283)` after
  the dark-mode toggle; the same handler also throws (SF-062).
- **Summit workaround:** `DashboardFilters.razor.ts` destroys the charts and reloads the panels on
  `rz:theme-change`, so the colors are resolved under the new theme.
- **Library fix:** keep the unresolved config and re-resolve it in the theme-change handler before
  `update()`.
- **Fixed in 1.0.0-preview.4:** the theme-change handler rebuilds the configuration from its unresolved source and applies the re-resolved options and dataset colors (`update('none')`).

### SF-006 Server toasts are dropped outside htmx requests (planning)

- **Tag:** DX, Medium
- **What:** `RzToastMiddleware` sends queued toasts only for htmx requests and drops them on redirects
  (RZUI-052), logging at Debug level. A post-redirect-get flow, the usual MVC pattern, loses its
  "Saved" toast without any visible error.
- **Summit design:** every action that toasts answers an htmx request in place, with `HX-Push-Url`
  instead of a redirect.
- **Library fix:** log at Warning in Development; consider carrying queued toasts across a redirect
  (TempData-style) as an opt-in.
- **Fixed in 1.0.0-preview.4:** the toast middleware logs a Warning in Development when it drops queued toasts (a non-htmx request, or an htmx response that redirects, whose headers the browser never sees), naming HX-Push-Url/HX-Location as the fix; the toast page documents the pattern. Carrying toasts across a redirect stays out of scope (the page names TempData or a session store for that). Summit already answers in place.

### SF-007 RzCommandDialog cannot use a remote item source (planning)

- **Tag:** Gap, Medium
- **What:** `RzCommand` supports `ItemsUrl`, `FetchTrigger` and `ServerFiltering`, but
  `RzCommandDialog` does not pass them through, so a server-searched palette in a dialog has to be
  composed by hand from `RzDialog` and `RzCommand`. The usual Ctrl+K / Cmd+K shortcut has to be wired
  by the app.
- **Library fix:** pass the remote parameters through; add an opt-in `Shortcut` parameter.
- **Fixed in 1.0.0-preview.4:** `RzCommandDialog` passes `ItemsUrl`, `FetchTrigger` and `ServerFiltering` to its `RzCommand` and takes an opt-in `Shortcut` (Ctrl/Cmd + key). Summit's search palette is an `RzCommandDialog` with `Shortcut="k"`; quick actions use `Shortcut="j"`.

### SF-008 No upload progress (planning)

- **Tag:** Gap, Low
- **What:** `RzFileInput` has no progress display, and htmx 4 sends requests with `fetch()`, which
  reports no upload progress.
- **Summit design:** an indeterminate `RzProgress` as the request indicator.
- **Fixed in 1.0.0-preview.4:** documented on the file input page: htmx 4's `fetch()` reports no upload progress, so the pattern is an indeterminate `RzProgress` as the request indicator (what Summit does), or an application `XMLHttpRequest` for large files.

### SF-009 Components name their form fields differently (planning)

- **Tag:** DX, High
- **What:** `RzCheckboxGroup`, `RzRadioGroup`, `RzCombobox`, `RzInputOTP` and `RzFileInput` default to
  the bare property name (`Country`). Rizzy-based inputs (`RzInputText`, `RzInputNumber`, `RzSwitch`,
  `RzNativeSelect`, `RzDateEdit`) use the model path (`Model.Country`). In one `EditForm` bound with
  `[SupplyParameterFromForm]`, the first group silently does not bind.
- **Summit workaround:** `Name="Model.X"` on those components.
- **Library fix:** derive the name from the full `For` expression path, as the Rizzy inputs do.
- **Fixed in 1.0.0-preview.4:** decision D-28: `RzCheckboxGroup`, `RzRadioGroup`, `RzCombobox`, `RzFileInput` and `RzInputOTP` post the model path (`Model.Country`), computed like Blazor's own inputs (Rizzy's `ExpressionFormatter`; inside `Editor<T>`, whose prefix type is internal to ASP.NET Core, set `Name`). `Name` keeps a bare name. Summit's `Name="Model.X"` on those components is removed.

### SF-010 Sidebar collapse state flashes on page load (planning)

- **Tag:** DX, Low
- **What:** `RzSidebarProvider` writes the `sidebar_state` cookie in JS, but the server never reads
  it, so a collapsed sidebar renders open and then collapses.
- **Summit workaround:** the layout reads the cookie and passes `DefaultOpen`.
- **Library fix:** read the cookie in `RzSidebarProvider` when `PersistenceCookieName` is set.
- **Fixed in 1.0.0-preview.4:** `RzSidebarProvider` renders the state in its persistence cookie when the request has one. Summit's `SidebarState` is deleted.

### SF-011 Sidebar content is rendered twice (planning)

- **Tag:** DX, Low
- **What:** `Sidebar` renders `ChildContent` once in a mobile `RzSheet` and once in the desktop
  container, so any fixed `id` inside it is duplicated.
- **Summit workaround:** no fixed ids inside the sidebar.
- **Library fix:** document it on the sidebar page.
- **Fixed in 1.0.0-preview.4:** the sidebar page says that `Sidebar`'s `ChildContent` renders twice (mobile sheet and desktop panel) and to avoid fixed ids in it.

### SF-012 Widget libraries load from a CDN by default (planning)

- **Tag:** DX, Medium
- **What:** Chart.js, Tom Select, flatpickr, vanilla-calendar-pro (JS and CSS), Coloris, Embla and
  rough-notation default to jsDelivr URLs (with SRI). Apps that want to self-host must find the asset
  keys in `ServiceCollectionExtensions` and copy the files themselves.
- **Summit workaround:** an npm script copies the pinned versions into `wwwroot/lib`, and
  `AddRizzyUI` overrides `AssetUrls`.
- **Library fix:** ship the files as static web assets with an option such as
  `config.UseLocalAssets = true`, or document the keys, versions and an override example.
- **Fixed in 1.0.0-preview.4:** `RizzyUIConfig.LocalAssetPath` loads every default widget asset from `{path}/{package}@{version}/{file}` (jsDelivr's layout) with the same SRI hash, and `RizzyUIAssets.Vendor` lists each file (key, CDN URL, hash, local path) for a copy script; the getting-started page documents it. Summit's `SelfHostedAssets` post-configure is deleted: `Program.cs` sets `LocalAssetPath = "/lib"`, and `vendor.json` (still used by `npm run vendor` to download the files) uses the same layout.

### SF-013 RzInputOTP uses an inline style attribute (planning)

- **Tag:** Bug, Low
- **What:** the hidden input carries `style="position:absolute;…"`, which a `style-src` without
  `'unsafe-inline'` blocks.
- **Library fix:** move the styling to a class.
- **Fixed in 1.0.0-preview.4:** the hidden input is visually hidden with classes (`pointer-events-none absolute size-px opacity-0`) instead of an inline style.

### SF-014 RzDateEdit range mode cannot bind (planning)

- **Tag:** Gap, Low
- **What:** flatpickr's `Mode.Range` posts "from to" as one string into the `DateTime?` that
  `RzDateEdit` requires.
- **Summit workaround:** the dashboard range uses `RzCalendar Mode="MultipleRanged"`.
- **Fixed in 1.0.0-preview.4:** documented on the date edit page: `RzDateEdit` binds one date; a range uses `RzCalendarProvider` with `StartName`/`EndName` (or two date edits).

### SF-015 RzToggle posts nothing (planning)

- **Tag:** DX, Low
- **What:** `RzToggle` is an `aria-pressed` button with client state only; it cannot drive a server
  filter without custom code.
- **Summit design:** level filters on the schedule are client-side, through a code-behind.
- **Fixed in 1.0.0-preview.4:** `RzToggle` takes `Name` and `Value`: it posts the value while pressed (a hidden input it enables with its state), so it can drive a form or `hx-trigger="rz:toggle:change"`.

### SF-016 Command items cannot navigate

- **Tag:** Gap, Medium
- **What:** a command palette is mostly used to go somewhere, but `CommandItem` has `Value` and no
  `Href`. Choosing an item (Enter or click) dispatches `rz:command:execute`; nothing navigates unless
  the app listens. Putting an `<a>` inside an item makes a click work but not Enter, and nests an
  interactive element inside `role="option"`.
- **Summit workaround:** item values are paths, and a code-behind (`CommandNavigation`) listens for
  `rz:command:execute` on `document` and calls `htmx.ajax('GET', value, { target: 'body', push: 'true' })`.
  It must listen on `document` because the palette's dialog is teleported to `<body>`.
- **Library fix:** an `Href` on `CommandItem` (and on `ICommandItemData`) that navigates on execute,
  boosted when the page uses `hx-boost`.
- **Fixed in 1.0.0-preview.4:** `CommandItem.Href` (and `href` on data items, `ICommandItemData.Href`): choosing the item dispatches `rz:command:execute`, closes open dialogs and loads the page like a boosted link. Summit's `CommandNavigation` is deleted.

### SF-017 Asset URLs are relative

- **Tag:** DX, Medium
- **What:** `@Assets["css/app.css"]` returns `css/app.css`, and Rizzy's default `ClientScriptUrl` is
  `_content/Rizzy/js/rizzy.js`. Both only work on top-level URLs unless the page has
  `<base href="/">`. On `/account/sign-in` the stylesheet resolved to `/account/css/app.css` and the
  page rendered unstyled. The starter template uses `<base href="/">`, but a base URL turns every
  in-page link (`href="#content"`, the skip link) into a link to the home page. The docs app works
  around it with `"/@Assets[...]"` and an absolute `ClientScriptUrl`.
- **Summit workaround:** the same as the docs app.
- **Library fix:** make Rizzy's default `ClientScriptUrl` absolute (respecting `PathBase`); document the
  `"/@Assets[...]"` pattern in the RizzyUI getting-started guide; reconsider `<base href>` in the
  starter template.
- **Fixed in Rizzy 6.0.0-preview.4:** Rizzy's `ClientScriptUrl` defaults to `/_content/Rizzy/js/rizzy.js` and `<RzScripts />` prefixes root-relative URLs with the path base (Rizzy 6.0.0-preview.4). The rizzy.docs pages show the absolute URL. Summit's absolute `ClientScriptUrl` goes with the Rizzy bump (slice 15).

### SF-018 RzButton has no AsChild

- **Tag:** Bug, High
- **What:** `RzButton` inherits `RzComponent`, not `RzAsChildComponent`. `<RzButton AsChild><a href>…</a></RzButton>`
  compiles (unknown parameters become attributes), renders `<button aschild><a href>…</a></button>`:
  invalid nesting, two tab stops, and the button swallows the link's click target. Developers expect
  `AsChild` because every trigger component has it. The starter template's
  `Features/Errors/NotFoundPage.razor` and the Popover docs page use it.
- **Summit workaround:** `<RzButton Element="a" href="…">`.
- **Library fix:** support `AsChild` on `RzButton` (merge classes into the child, as triggers do), or
  fail loudly when an unknown `AsChild` attribute is passed; fix the template and docs.
- **Fixed in 1.0.0-preview.4:** `RzButton` has an `AsChild` parameter: it renders its single child (a link) with the button's classes, `data-slot`, accessible name and attributes merged in (the child's own attributes win, classes merge). It renders through an internal `AsChildHost` (an `RzAsChildComponent`), so `RzButton` keeps its base class and its public descriptor type. The starter template's 404 page works as written; the Popover docs snippet put `AsChild` on the button instead of the trigger and is corrected. Summit keeps `Element="a"`, which is a supported way to render a link button.

### SF-019 NavigationMenuLink docs example nests links

- **Tag:** Docs, Medium
- **What:** `NavigationMenuInfo.razor`'s `ListItem` helper renders `<NavigationMenuLink><RzLink Href>`.
  `NavigationMenuLink` renders an `<a>` itself, so the output is an empty `<a>` followed by the real
  link (the HTML parser splits nested anchors). Keyboard users get an extra, empty tab stop.
- **Summit workaround:** `<NavigationMenuLink Href="…" class="…">` with the content directly inside.
- **Library fix:** correct the example (or use `AsChild`, as the "Docs" item in the same example does).
- **Fixed in 1.0.0-preview.4:** the navigation menu example's `ListItem` and `IconListItem` (and the logo card) use `NavigationMenuLink AsChild` around `RzLink`, so they render one anchor.

### SF-020 Status code pages break htmx redirects and mislabel every 4xx

- **Tag:** Bug, High (found by `Summit.Tests`)
- **What:** the starter template registers `UseStatusCodePagesWithReExecute("/not-found")`, and its
  `/not-found` action sets status 404. Two consequences:
  1. Rizzy's `CookieAuthenticationEvents.UseHtmxRedirects()` answers an htmx request from an expired
     session with 401, an empty body and `HX-Redirect`. The status-code-pages middleware sees an empty
     401 and re-executes `/not-found`, so the client gets a 404 page instead of the redirect. Since
     htmx 4 swaps 4xx responses, the "page not found" markup lands inside whatever element made the
     request.
  2. Any other empty 4xx (a 400 from a failed antiforgery check, a 405) becomes "Page not found" with
     status 404, which hides the real problem from users and from logs.
- **Summit workaround:** `Infrastructure/StatusPages.cs`: status pages only for full-page requests
  (`HX-Request-Type` is not `partial`) and never when the response carries `HX-Redirect`; the status
  code is preserved (`/status/{code}`), with a page per code.
- **Library fix:** in Rizzy, have `UseHtmxRedirects` disable `IStatusCodePagesFeature` for the response
  it writes (one line), and ship an htmx-aware status-pages helper. In the starter template, keep the
  original status code and skip partial htmx requests.
- **Starter template fixed in 1.0.0-preview.4:** the template's `UseStatusPages()` (`Features/Errors/StatusPages.cs`) re-executes `/status/{code}` only for full-page requests, never for htmx partial requests or responses with `HX-Redirect`, and keeps the status code (a 400 page says "Bad request" with status 400). The template test checks a partial 404 and a full-page 400. The Rizzy side (`UseHtmxRedirects` disabling status pages) is slice 14; Summit's `StatusPages` goes with the Rizzy bump.
- **Rizzy fixed in 6.0.0-preview.4:** `UseHtmxRedirects` disables `IStatusCodePagesFeature` for its empty 401/403, so status code pages no longer replace an htmx redirect (Rizzy test with status pages on).

### SF-021 The starter template's body-level hx-boost does nothing

- **Tag:** Bug, High (found by the Summit browser tests)
- **What:** htmx 4 no longer inherits attributes from ancestors unless they are written with the
  `:inherited` suffix or `htmx.config.implicitInheritance` is on. The starter template's `AppLayout`
  has `<body hx-boost="true">` and a comment saying links and forms become htmx requests; in fact
  every link is a full page load and every plain form a normal post. Nothing fails, so nobody notices:
  the template test checks pages with curl, and the docs app boosts each link individually.
- **Summit fix:** `<body hx-boost:inherited="true">`; the shell spec asserts that a boosted navigation
  keeps the `window` object (no reload).
- **Library fix:** change the starter template; consider a `HtmxConfig.ImplicitInheritance` default or
  an `Hx.Boost(inherited: true)` helper in Rizzy; add a browser check of boosted navigation to the
  template test (it already starts the app).
- **Fixed in 1.0.0-preview.4:** the starter template's `<body>` uses `hx-boost:inherited="true"`; `eng/template-test.sh` checks the markup and, with the docs app's Playwright, that a boosted navigation keeps the `window` object (`playwright.template.config.ts`, `tests/template/starter.spec.ts`).

### SF-022 RzAlert is always a live region

- **Tag:** A11y, Medium
- **What:** `RzAlert` renders `role="alert"` by default and `role="status"` with
  `LiveRegionMode.Status`; there is no mode without a live region. Most alerts on a page are static
  callouts ("This is a demo: no payment is taken", the demo account hint on the sign-in page). As
  `role="alert"` they are announced assertively on page load and after every swap that re-renders them,
  and tests that look for "the alert" find several.
- **Summit workaround:** static callouts use `LiveRegionMode.Status`; only errors that appear in
  response to an action use the default.
- **Library fix:** add `RzAlertLiveRegionMode.None` (no role) and consider making it the default,
  as shadcn's Alert does; keep `Alert`/`Status` for messages that appear after an action.
- **Fixed in 1.0.0-preview.4:** `RzAlertLiveRegionMode.None` renders a static callout without a role or `aria-live`; the default stays `Alert` for messages that appear after an action. Summit's static callouts (payment notice, demo account, ticket sales date) use `None`.

### SF-023 Material Design icons produce duplicate ids

- **Tag:** Bug, Medium (found by Summit's unique-id check)
- **What:** Blazicons' Material Design icon SVGs carry a fixed `id` (`<svg id="mdi-chevron-down" …>`).
  Fourteen RizzyUI components render MDI icons internally: `NavigationMenuTrigger`,
  `BreadcrumbSeparator`, `PaginationPrevious`/`Next`/`Ellipsis`, `CheckboxGroupItemIndicator`,
  `InputOTPSeparator`, `RzSearchButton`, `CommandInput`, `CommandEmpty`, `DropdownMenuSubTrigger`,
  `MenubarCheckboxItem`, `MenubarRadioItem` and `MenubarSubTrigger`. Two of any of them on a page give
  duplicate ids: the public header alone has two navigation menu triggers. Duplicate ids are invalid
  HTML and can make `getElementById`, `aria-*` references and `hx-target="#…"` pick the wrong element.
- **Summit workaround:** none possible from the outside; the browser tests' unique-id check skips
  `svg[id^="mdi-"]`.
- **Library fix:** render those icons without the id (Blazicons attribute override, or switch the
  internal icons to Lucide, which RizzyUI already uses elsewhere and which has no ids), and add a
  unique-id assertion to the accessibility fixtures.
- **Fixed in 1.0.0-preview.4:** RizzyUI's built-in icons are Lucide icons, which carry no ids, instead of Material Design icons (`id="mdi-..."`). The exceptions in Summit's and the docs scan's unique-id checks are removed.
- **Docs site (1.0.0-preview.4):** the docs site's own pages and examples still use Material Design icons; their repeated `mdi-` ids remain a docs-scan known entry, now attributed to the docs site.

### SF-024 Boosted navigation does not update the html element

- **Tag:** DX, Low
- **What:** with `hx-boost`, htmx swaps the `<body>`; attributes on `<html>` (`lang`, `dir`, a theme
  class) stay as they were. Switching the language through a boosted link left `lang="en"` on a German
  page, which makes screen readers use the wrong voice.
- **Summit workaround:** the language links have `hx-boost="false"` (a full page load); the theme
  switch answers with `HX-Refresh`.
- **Library fix:** document it next to hx-boost in the Rizzy guide; a Rizzy extension could copy
  `lang`/`dir` from the response's `<html>` on boosted swaps.
- **Fixed in docs:** documented in rizzy.docs (htmx attributes: boosting a whole page, and `<html>` attributes such as `lang` after boosted navigation: `hx-boost="false"` on links that change them, or `HX-Refresh`). Summit's approach is the documented one.

### SF-025 Enter in a command palette can run the wrong item

- **Tag:** Bug, Medium (found by the Summit browser tests)
- **What:** `CommandInput` binds the search with `x-model.debounce.50ms`. Typing "check-in" and pressing
  Enter within 50 ms executes the item that was highlighted before filtering (the first item,
  "Dashboard"), because the list has not been filtered yet. Fast typists and barcode-style input hit
  this; Playwright's keyboard does every time.
- **Summit workaround:** the test waits for the matching option to be selected before Enter.
- **Library fix:** on Enter, flush the pending search (filter synchronously) before choosing the
  selected item; or drop the debounce for local (non-`ItemsUrl`) filtering, which is cheap.
- **Fixed in 1.0.0-preview.4:** Enter applies the typed search before choosing (local filtering), so it runs the match. The wait in Summit's quick-actions test is removed.

### SF-026 FieldError always renders an empty alert

- **Tag:** A11y, Low
- **What:** every `FieldError` renders `<div role="alert">` even when there is no message, so a form has
  one empty alert region per field. Tests that look for "the alert" in a form find all of them.
- **Library fix:** render the element (or the role) only when there are errors, or use a single
  polite summary region for the form.
- **Fixed in 1.0.0-preview.4:** `FieldError` has `role="alert"` only when it renders its `Errors` itself; around child content (a validation message, usually empty, tied to its input by `aria-describedby`) it has no role, so a form no longer carries one empty alert per field.

### SF-027 Components without documentation

- **Tag:** Docs, Medium
- **What:** `AGENTS.md` requires a docs page for every component, but `RzEmbeddedPreview`,
  `RzFormSection`, `RzSearchButton`, `RzDarkModeToggle` and `RzIdScope` have no page and no example on
  any page. Summit had to read their source to use them. (`RzIdScope` in particular solves a real htmx
  problem, stable ids in re-rendered fragments, and nobody will find it.)
- **Library fix:** add the pages, or at least an example on a related page.
- **Fixed in 1.0.0-preview.4:** docs pages with a live example and parameters for `RzIdScope`, `RzFormSection`, `RzSearchButton`, `RzDarkModeToggle` and `RzEmbeddedPreview`, in the component list and the navigation.

### SF-028 Inputs require an EditContext, even in GET forms

- **Tag:** DX, Medium
- **What:** every RizzyUI input (`InputBase`) throws without a cascading `EditContext`, and so do
  `RzCheckboxGroup` and `RzSwitch`. A search or filter form should be a GET form, but `EditForm` renders
  a POST form with an antiforgery token and a `_handler` field, which end up in the query string and the
  pushed URL. The workaround is a plain `<form method="get">` with `<CascadingValue Value="new EditContext(model)">`,
  which nobody would guess.
- **Summit workaround:** exactly that (`Features/Schedule/ScheduleFilters.razor`).
- **Library fix:** let inputs work without an `EditContext` when given `Name` and `Value`, or ship an
  `RzFilterForm`/`RzGetForm` that provides one without the POST-only parts.
- **Fixed in 1.0.0-preview.4:** new `RzGetForm`: a `<form method="get">` that provides the `EditContext` for its `Model`, without the antiforgery token and `_handler` field of `EditForm`. Summit's hand-cascaded `EditContext`s are replaced.

### SF-029 RzCheckboxGroup is a nameless group by default

- **Tag:** A11y, Medium
- **What:** `RzCheckboxGroup` renders `<fieldset role="group" aria-labelledby="…-legend">` with a
  visually hidden `<legend>` filled from `DisplayName` only. Without `DisplayName` the legend is empty, so
  the group has no accessible name, and it does not fall back to the model's `[Display(Name)]` the way
  `FieldLabel` does. Putting the group inside an `RzFieldSet` with a `FieldLegend` (the natural markup)
  nests two fieldsets. The legend is always visually hidden, so a visible label must be added
  separately and hidden from assistive technology.
- **Summit workaround:** `DisplayName` plus an `aria-hidden` visible label.
- **Library fix:** fall back to `[Display(Name)]`/the property name; offer a visible legend option.
- **Fixed in 1.0.0-preview.4:** `RzCheckboxGroup`'s legend falls back to the property's `[Display(Name)]`, `[DisplayName]` or name, and `LegendVisible` shows it.

### SF-030 Your x-on:click is silently dropped

- **Tag:** DX, Medium
- **What:** `<RzToggle x-on:click="applyLevels()">` renders `x-on:click="toggle"`: the component's
  computed attribute wins over the consumer's (decision D-20 in the audit) and nothing warns. The
  handler simply never runs. `RzToggle` also dispatches no event when its state changes, so there is no
  supported way to react to a toggle.
- **Summit workaround:** a delegated `click` listener on an ancestor (code-behind) that reads
  `aria-pressed` on the next tick.
- **Library fix:** dispatch `rz:toggle:change` with `{ pressed }` from `rzToggle`; for event attributes,
  merge rather than replace (Alpine allows several `x-on:click` handlers through different modifiers,
  or the component can call a consumer-supplied handler), or at least log a development-time warning
  when a consumer attribute is overwritten.
- **Handlers fixed in 1.0.0-preview.4 (D-24):** a caller's `x-on:click` on `RzToggle` runs alongside the toggle's own (directives.spec.ts, both builds); Summit's level toggles use `x-on:click="applyLevels()"` and its delegated click listener is deleted. The change event (`rz:toggle:change`) is slice 18.
- **Fixed in 1.0.0-preview.4:** with slice 16 a caller's `x-on:click` runs alongside the toggle's (D-24), and `RzToggle` dispatches `rz:toggle:change` ({ pressed, value }) when its state changes. Summit's schedule board listens for that event.

### SF-031 Every avatar is announced as "Avatar"

- **Tag:** A11y, Medium
- **What:** `RzAvatar` renders `role="img" aria-label="Avatar"` (a localized default) on the wrapper.
  Children of `role="img"` are presentational, so `AvatarImage`'s `AlternateText` ("Amara Okafor") is
  never read: a list of speakers is announced as "Avatar, Avatar, Avatar". There is also no way to make
  an avatar decorative when the name is printed next to it, which is the common case.
- **Summit workaround:** `AriaLabel="@speaker.Name"` on every avatar.
- **Library fix:** derive the label from `AvatarImage.AlternateText` (or the fallback initials' title);
  add a `Decorative` option that renders `aria-hidden="true"` and no role.
- **Fixed in 1.0.0-preview.4:** without `AriaLabel`, `RzAvatar` has no role or generic "Avatar" label, so the image's alt text or the fallback text names it; with `AriaLabel` it is an image with that name; `Decorative` hides it. Summit keeps `AriaLabel` with the speaker's name, so the initials fallback is named too.

### SF-032 A sheet with long content opens scrolled to the bottom

- **Tag:** A11y, Low
- **What:** `RzSheet` moves focus to its first focusable element when it opens. In a details sheet whose
  only controls are footer buttons, that is the last element, so the panel scrolls to the bottom and the
  title and first paragraphs are out of view for sighted keyboard and mouse users alike.
- **Summit workaround:** put a control at the top of the content.
- **Library fix:** focus the panel itself (with `tabindex="-1"`) or the title when there is no focusable
  element before the footer, or add an `InitialFocus` selector parameter as Radix (`onOpenAutoFocus`) does.
- **Fixed in 1.0.0-preview.4:** `RzDialog` and `RzSheet` take `InitialFocus`, a selector for the element that takes focus when they open. Summit's session details sheet focuses its session page link with it instead of relying on element order.

### SF-033 You cannot choose an input's id

- **Tag:** DX, Low
- **What:** `InputGroupInput id="speaker-query"` renders `id="QvogGwJLp2DI"`: the id reserved for the
  field (`GetOrReserveFieldId`) replaces the consumer's. A hand-written `<label for="speaker-query">`
  (needed when the label is not a `FieldLabel`, such as a visually hidden search label) then labels
  nothing. Oddly, a consumer `name` is kept, so the two attributes behave differently.
- **Summit workaround:** `aria-label` on the input.
- **Library fix:** let a consumer `id` win (and register it as the field's id so `FieldLabel` still
  matches), consistent with how `name` behaves.
- **Fixed in 1.0.0-preview.4:** decision D-26: `InputGroupInput` and `InputGroupTextarea` pass a caller's `id` to their inner input, which registers it as the field's id, so a hand-written `<label for>` and a `FieldLabel` both point at it (RizzyUI inputs already did). Radio items derive their input id from the item's. Summit's speaker search has a real label instead of `aria-label`.

### SF-034 Any other HeadContent removes the theme

- **Tag:** Bug, High (found by axe: every page suddenly had RizzyUI's default blue instead of Summit's theme)
- **What:** `RzThemeProvider` writes its `<style>` with the theme's CSS variables (and the dark-mode
  script) through Blazor's `<HeadContent>`. Blazor shows the content of only one `HeadContent` (the last
  one rendered): when Summit added a second `HeadContent` for per-track colors, the theme variables
  vanished from every page and the app fell back to the default palette from the CSS plugin. No error,
  no warning; it looks like a styling bug. Pages that add their own meta tags or styles with
  `HeadContent`, which is the standard Blazor way, hit this immediately.
- **Summit workaround:** the track styles render a `<style>` directly in the layout's `<head>`.
- **Library fix:** render the theme `<style>` from a component placed in `<head>` (for example inside
  `RzHeadOutlet`, or a dedicated `<RzThemeStyles />`) instead of through `HeadContent`; document the
  conflict until then.
- **Fixed in 1.0.0-preview.4:** `RzThemeProvider` no longer uses `HeadContent`. A new `<RzThemeHeadOutlet />` (a Blazor section of its own) goes in `<head>` next to `<RzHeadOutlet />`; the provider renders the theme there when the outlet is on the page, and at the start of its own output otherwise (so a provider placed in `<head>`, as the docs show, keeps working unchanged). The docs app and the starter template add the outlet. Summit's `TrackStyles` uses `HeadContent` again.

### SF-035 RzAuroraText's AriaLabel is prohibited ARIA

- **Tag:** A11y, Low (found by axe)
- **What:** with `AriaLabel` set, `RzAuroraText` renders `<span aria-label="…">`. `aria-label` is
  prohibited on a `span` without a role, so assistive technology may ignore it and axe reports a serious
  violation. Without `AriaLabel` the component already renders visually hidden text, which works. Its
  gradient colors also come from an inline `style` attribute, which a strict `style-src` blocks.
- **Summit workaround:** no `AriaLabel`.
- **Library fix:** render the label as visually hidden text (or `role="img"` with `aria-label`); move the
  colors to CSS custom properties set from a class or a nonced style.
- **Fixed in 1.0.0-preview.4:** `AriaLabel` renders as visually hidden text instead of a prohibited `aria-label`; the default gradient and speed come from a CSS class, so the default needs no inline style. Custom `Colors` or `Speed` still use an inline style (documented); Summit's home page uses custom colors and reports it under its report-only `style-src`.

### SF-036 Status colors fail contrast; the theme keys that fix them are undocumented

- **Tag:** A11y, Medium (found by axe)
- **What:** soft `RzBadge` (`Soft` with `Success`, `Information`, `Warning`) and `RzAlert`
  (`Information`) draw text in `var(--success)`/`--info`/`--warning` on a tint of the same color. With
  the defaults (green-600, sky-600, amber-500) the contrast is 2.9:1, 3.5:1 and 1.9:1; WCAG AA needs
  4.5:1 for that text size. (D-16 fixed the same problem for toasts by using the foreground color.)
  `RzThemeProvider` writes these variables into the page from the theme, so overriding them in the
  app's CSS does not work (the inline theme style comes later and wins). The theme JSON does accept
  `success`, `info`, `warning` and their `-foreground` keys (`RzThemeConverter`), but nothing
  documents them and the shadcn theme format they are based on has no such keys, so a developer finds
  them only by reading the converter. Summit first concluded that themes could not set them at all.
- **Summit workaround:** AA-safe `success`, `info` and `warning` values in `Themes/summit.json`.
- **Library fix:** AA-safe defaults (or the foreground color for soft text, as toasts do); document the
  extra theme keys on the theming page.
- **Fixed in 1.0.0-preview.4:** AA-safe status defaults in the Arctic theme and the theme JSON converter (light green-800, blue-700, amber-800 with white text; dark green-400, blue-400, amber-400 with black text); the theming page documents the `success`, `info`, `warning` and `-foreground` keys. Summit keeps its own values in `summit.json`, now the documented way.

### SF-037 The file dropzone's name does not match its text

- **Tag:** A11y, Medium (found by axe: label-content-name-mismatch)
- **What:** `RzFileInput Variant="Dropzone"` renders `<div role="button" aria-label="File input">` with
  the visible text "Drag and drop files here or click to upload". Speech-input users say what they see
  and nothing matches; screen reader users hear a generic "File input" with no hint of the field it
  belongs to (the `FieldLabel` points at the hidden native input, not the dropzone).
- **Summit workaround:** `AriaLabel="Drag and drop files here or click to upload an attachment"`.
- **Library fix:** name the dropzone from its visible text plus the field label
  (`aria-labelledby="label-id trigger-content-id"`).
- **Fixed in 1.0.0-preview.4:** the file input's trigger is named by its visible text unless the caller sets `AriaLabel`; the native input keeps the label. Summit's `AriaLabel` on the contact dropzone is removed.

### SF-038 RzItemGroup is a list without list items

- **Tag:** A11y, Medium (found by axe: aria-required-children, critical)
- **What:** `RzItemGroup` renders `role="list"`; `RzItem` renders a plain `div` with no role, so the list
  "contains" generic elements and whatever they contain (here an avatar's `role="img"`). Screen readers
  report an empty or broken list.
- **Summit workaround:** `role="listitem"` on each `RzItem` inside a group.
- **Library fix:** `RzItem` renders `role="listitem"` when it is inside an `RzItemGroup` (a cascading
  value), or `RzItemGroup` drops the list role.
- **Fixed in 1.0.0-preview.4:** `RzItem` inside an `RzItemGroup` renders `role="listitem"` (unless the caller sets a role). Summit's `role="listitem"` is removed.

### SF-039 Events sent before a component loads are lost

- **Tag:** DX, Low (found by the Summit browser tests)
- **What:** RizzyUI loads component behavior asynchronously (`x-load`, a chunk per runtime). An
  `RzDialog` listens for its `EventTriggerName` only once its chunk has loaded and `init()` has run. A
  window event dispatched before that (pressing Ctrl+K as soon as the page appears, an `HX-Trigger`
  arriving with the first response) does nothing, and nothing reports it. Browser tests that press keys
  right after `page.goto` fail intermittently for the same reason.
- **Summit workaround:** the test helper waits until every eager `x-data` element has initialized.
- **Library fix:** register `EventTriggerName` listeners from a tiny eager shim that opens the dialog
  once the chunk is ready (or queues the event), and expose a "components ready" promise or event
  (`rz:ready`) that tests and apps can wait for.
- **Fixed in 1.0.0-preview.4:** RizzyUI keeps the last event for each `EventTriggerName` that no started component handled, and dialogs and sheets replay it when they start; `Rizzy.componentsReady()` resolves once the page's eager components have started, and the document gets `rz:ready`. Summit's test helper awaits `componentsReady()` instead of checking every element itself.

### SF-040 RzCommand's data-driven items never render

- **Tag:** Bug, High (found by the Summit browser tests)
- **What:** `CommandItemTemplate` sets `ParentCommand.DataItemTemplateId` in its `OnInitialized`, but
  `RzCommand` has already built its root element (including `data-template-id="@DataItemTemplateId"`)
  by then, and nothing re-renders it during static SSR. The attribute is therefore always missing.
  `rzCommand.js` reads it at init, finds nothing, and with `ItemsUrl` shows "Failed to load items.
  Configuration error: No data template found." (and logs a console error); with `Items` the same check
  applies. A consumer `data-template-id` attribute does not help: the component's own null value is
  applied after the splatted attributes and removes it. No browser test in the repository covers
  `Items`/`ItemsUrl` with a template.
- **Summit workaround:** a code-behind sets the attribute on the command inside the dialog's teleport
  template before it initializes (the template id is predictable: `{command id}-data-item-template`).
- **Library fix:** compute the template id from the command's id in `RzCommand` itself (it is
  deterministic), instead of waiting for the child to report it; add an integration test for
  `ItemsUrl` and `Items`.
- **Fixed in 1.0.0-preview.4:** `RzCommand` derives the template id from its own id (`{id}-data-item-template`) and always renders it; `CommandItemTemplate` takes the same id, and the client treats the id as absent when no template element exists. Summit's `SearchPalette.razor.js` is deleted (the palette keeps its RzDialog + RzCommand composition for SF-007).

### SF-041 Every app needs the same server-error listener

- **Tag:** Gap, Low (owner: Rizzy and RizzyUI)
- **What:** Rizzy's `UseHtmxErrorHandling` stops a 5xx from being swapped and raises `rz:server-error`
  instead. That is the right default, but the user then sees nothing at all: the click did nothing. Both
  libraries have the pieces (the event, `Rizzy.toast`), yet each application must write a code-behind
  that listens for `rz:server-error` (and htmx 4's `htmx:error` for network failures) and shows a toast.
- **Summit workaround:** `Components/Shared/AppNotifications.razor(.js)`, about 20 lines.
- **Library fix:** an opt-in `<RzServerErrorToasts />` (or a `RzToastProvider` option) that shows a
  localized error toast for `rz:server-error` and network errors, with the messages configurable.
- **Fixed in 1.0.0-preview.4:** `RzToastProvider` has `ServerErrorToasts` (off by default): an eager runtime listener shows an error toast for `rz:server-error` and `htmx:error`, with messages localized in RizzyUI's resources (en, de, es, fr, pt) or set with `ServerErrorTitle`, `ServerErrorText` and `NetworkErrorText`. Summit's `AppNotifications` is deleted.

### SF-042 TypeScript code-behind breaks a clean build with the template's npm hook

- **Tag:** DX, Medium (found by CI: the first Summit CI run failed; locally `node_modules` already existed)
- **What:** `RizzyUI.targets` bundles code-behind modules with esbuild before
  `ResolveJSModuleStaticWebAssets`, inside `CoreBuild`, and fails with RZUI1003 when
  `node_modules/esbuild` is missing. The starter template installs npm packages in a target with
  `BeforeTargets="Build"`, which MSBuild runs only after `CoreBuild`. So a project created from the
  template that turns on TypeScript code-behind (`dotnet new rizzyui-codebehind --typescript` tells you
  to) fails its first build on every clean clone and CI runner, and succeeds on the second build, because
  the failed build ran `npm install` after the error.
- **Summit workaround:** the npm and Tailwind targets run `BeforeTargets="BeforeBuild"`.
- **Library fix:** use `BeforeBuild` in the starter template; have RZUI1003's message say where the npm
  step must run; or let `RizzyUI.targets` run `npm ci` itself when `RizzyUICodeBehindBuild=esbuild`.
- **Fixed in 1.0.0-preview.4:** the starter template's `NpmInstall` and `TailwindBuild` targets run `BeforeTargets="BeforeBuild"`, before `CoreBuild` where TypeScript code-behind bundling needs `node_modules`.

### SF-043 Setting an htmx header on a normal request throws

- **Tag:** DX, Medium (owner: Rizzy; found by opening `/tickets/checkout?ticket=…` directly)
- **What:** `HtmxResponse.PushUrl`, `Location`, `Retarget`, `ValidationFailed` and the other setters
  call `AssertIsHtmxRequest()`, which throws `InvalidOperationException: The active request is not an
  htmx request`. The same action is commonly reached both ways: a link opened in a new tab or a bookmark
  (normal request) and boosted navigation (htmx). Each header then needs an `if (Request.IsHtmx())`, and
  forgetting one turns a working page into a 500 for the normal case only, which development rarely
  exercises. It also means a form that works without JavaScript cannot use `ValidationFailed()` for its
  422. Response headers that the client will ignore are harmless, so throwing protects nothing.
- **Summit workaround:** `Infrastructure/HtmxResponses.cs`: `Response.HtmxIfRequested(...)` and
  `ValidationFailedForAnyRequest()`.
- **Library fix:** make the setters no-ops for non-htmx requests (`ValidationFailed` should still set
  422), optionally logging at Debug; or offer `Response.HtmxIfRequested(...)` in Rizzy.
- **Rizzy fixed in 6.0.0-preview.4 (decision D-30):** every `HtmxResponse` setter skips its header with a Debug log outside htmx requests; `ValidationFailed()` sets 422 on any request. Summit deletes `HtmxResponses.cs` with the Rizzy bump (slice 15).

### SF-044 Errors for list items never reach their fields

- **Tag:** Bug, High (owner: Rizzy; found while building the checkout's attendee step)
- **What:** `RzModelStateProvider.ResolveField` returns `editContext.Field(key)` for any key containing
  `[`, i.e. a field named `Model.Attendees[0].Name` on the root model. The inputs for that field are
  identified by the attendee object and `Name`, so nothing matches: the 422 comes back with every input
  marked valid and every message empty. The user sees the form "do nothing". Any form that edits a list
  (attendees, line items, addresses) is affected, and MVC model binding of such lists works fine, so the
  failure is only visible in the UI.
- **Summit workaround:** `Components/Shared/IndexedModelStateProvider.cs` (about 60 lines) walks the
  indexed path from the form model and adds the messages; it sits next to `RzModelStateProvider` in the
  attendees form.
- **Library fix:** resolve indexers in `ResolveField` (walk `List[2]` through `IList`), with a test for
  a nested collection.
- **Rizzy fixed in 6.0.0-preview.4:** `RzModelStateProvider.ResolveField` walks list, array and dictionary indexers. Summit deletes `IndexedModelStateProvider` with the Rizzy bump (slice 15).

### SF-045 No focus management after a server validation error

- **Tag:** Gap, Medium (owner: RizzyUI)
- **What:** after a 422 swap, focus stays where it was (or on whatever element htmx restores by id). A
  keyboard or screen reader user who pressed "Continue" hears nothing and has to search for the error.
  The server knows which fields are invalid, and RizzyUI's inputs render `aria-invalid="true"`, but no
  component acts on it. Controls that hide their native element (Tom Select comboboxes, visually hidden
  checkboxes and switches) make a generic script harder to write correctly.
- **Summit workaround:** `Components/Shared/FocusFirstError.razor(.js)` (about 25 lines), placed in every
  form.
- **Library fix:** an opt-in behavior on the form level (for example an `RzForm` wrapper or a
  `FocusFirstInvalid` component) that focuses the first invalid control after a swap, aware of RizzyUI's
  composite controls.
- **Fixed in 1.0.0-preview.4:** new `RzFocusFirstInvalid`: placed in a form, it focuses the first `aria-invalid="true"` control when the form renders with errors, or the visible control of the same field for comboboxes and visually hidden checkboxes. Summit's `FocusFirstError` (11 forms) is replaced by it.

### SF-046 A fast Enter in a combobox picks the wrong option

- **Tag:** Bug, Medium (owner: RizzyUI, through its Tom Select integration; found by the checkout test)
- **What:** in `RzCombobox` (Tom Select), typing "France" and pressing Enter right away selected
  "Afghanistan": the first option, highlighted when the dropdown opened. Tom Select 2.3 and later
  throttle refreshing the option list (`refreshThrottle`, 300 ms by default), so for that long the list
  and the active option still reflect the previous query. Users who type quickly, paste and press Enter,
  or use barcode scanners hit it; Playwright's keyboard always does. Waiting until the active option
  matches the query before Enter made the test pass, which confirms the cause. `ComboboxOptions` exposes
  only `Create`, `Delimiter`, `MaxItems`, `OpenOnFocus`, `Persist` and `Placeholder`, so the setting
  cannot be changed from Razor. This is the same class of problem as SF-025 (`RzCommand`'s debounce).
- **Summit workaround:** none in the application; the browser test waits for the match (documented in
  the test).
- **Library fix:** set `refreshThrottle: 0` for local items (the list is in memory, there is nothing to
  throttle), or expose the option; consider flushing the pending refresh on Enter, as for SF-025.
- **CI (phase 4b):** the test still failed once on a GitHub runner: the typed country never reached
  the search input, and the visible-dropdown locator matched another combobox's list. The test now
  fills the input and waits for the active option in that combobox's own list (`aria-controls`);
  23 repeated runs passed locally. Not a retry or a delay.
- **Fixed in 1.0.0-preview.4:** `RzCombobox` sets Tom Select's `refreshThrottle` to 0 for local options (a `ComboboxOptions` value still wins), so Enter right after typing picks the match. The wait in Summit's checkout test is removed.

### SF-047 Radio inputs render an empty id

- **Tag:** Bug, Low (owner: Rizzy and RizzyUI; found by Summit's unique-id check)
- **What:** `RzInputRadioBase.Id` defaults to `string.Empty` and `OnParametersSet` adds `id` to the
  attributes unconditionally, so the input renders `id=""`. `RadioGroupItem` does not pass an id. Every
  radio group therefore has several elements with an empty id, which is invalid HTML; it also means no
  radio can be the target of a `<label for>` or an `aria-*` reference. (The item's `<label>` wraps the
  input, so the radio is still labelled.)
- **Summit workaround:** none possible; the browser tests report empty ids as an annotation instead of
  failing.
- **Library fix:** in Rizzy, only add `id` when it is not empty; in RizzyUI, give each item's input an
  id derived from the group's.
- **Rizzy fixed in 6.0.0-preview.4:** `RzInputRadioBase` renders no `id=""`. The RizzyUI side (ids derived from the group for each item) is slice 20.
- **RizzyUI side fixed in 1.0.0-preview.4:** each radio item's input gets an id derived from the item's (`{item}-input`).

### SF-048 htmx attributes in DataTable rows are never processed

- **Tag:** Gap, Medium (owner: RizzyUI)
- **What:** `RzDataTable` renders rows with `x-for` from JSON after the page has loaded. htmx processes
  elements when they are swapped in; elements Alpine adds later are not processed. RizzyUI's
  `htmxTeleportBridge` covers content teleported to `<body>`, but nothing covers rows. An `hx-get` on a
  row button is inert, so the most natural way to write a row action in an htmx app does not work, and
  nothing warns about it.
- **Root cause:** `rzDataTable.js` never calls `htmx.process` on rendered rows (confirmed by reading it;
  `rzCommandList.js` does this for its own remote items, so the pattern exists in the library).
- **Summit workaround:** the Edit button calls `edit(row.id)` in the `AttendeeTableState` code-behind,
  which calls `htmx.ajax('GET', …, { target: '#attendee-editor' })`. About 6 lines.
- **Library fix:** after each render, call `htmx.process` on the table body (or on rows added since the
  last render), the way `rzCommandList` does; document that `hx-*` works in row templates.
- **Regression test (library):** a DataTable whose row template has a button with `hx-get`; clicking it
  issues the request.
- **Fixed in 1.0.0-preview.4:** `RzDataTable` processes the rows Alpine renders with `htmx.process`, so `hx-*` in a row template works. Summit's Edit button uses `x-bind:hx-get` (the row carries its editor URL); `edit()` only remembers the row for focus return.

### SF-049 A wide table widens the whole organizer page

- **Tag:** DX, Low (owner: RizzyUI; shadcn/ui has the same default)
- **What:** `SidebarInset` is `flex w-full flex-1 flex-col` inside a flex row. Without `min-w-0` a flex
  item cannot shrink below its content, so the attendee table (about 1,180 px of natural width) made the
  inset, and the page, wider than the window: a horizontal page scroll and a cut-off header. Separately,
  `class` on `RzTable` lands on its `table-container` div (which scrolls), not on the `<table>` as in
  shadcn's `Table`; `class="min-w-[56rem]"` therefore widened the container instead of the table.
- **Summit workaround:** `SidebarInset class="min-w-0"` in `OrganizerLayout`, and no width class on
  `RzTable` (its own container scrolls).
- **Library fix:** add `min-w-0` to `SidebarInset`'s base classes; document which element `RzTable`'s
  `class` styles.
- **Fixed in 1.0.0-preview.4:** `SidebarInset` has `min-w-0`, so a wide table scrolls inside it. `RzTable`'s `class` stays on the scroll container, now documented on the table page. Summit's `class="min-w-0"` is removed.

### SF-050 Two naming schemes in one DataTable template

- **Tag:** DX, Low (owner: RizzyUI)
- **What:** In `x-for="row in rows"`, `row` is a view model (`{ id, row, cells }`); the TanStack row is
  `row.row`. Its `original` is serialized with camelCase names (`name`, `email`), while column ids and
  `cell.column.id` keep the C# property names (`Name`, `Email`). The first version of the Edit button
  used `row.original.Id` (both levels wrong); it produced Alpine expression errors and an empty
  `data-edit-id`, found only in the browser.
- **Summit workaround:** `row.id` (the `RowIdSelector` value) and `row.row.original.name`.
- **Library fix:** document the row view object and the serialization casing in the DataTable docs (what
  `row`, `row.row`, `cell` and `header` are), or serialize with the same naming as the column ids.
- **Fixed in 1.0.0-preview.4:** the DataTable page documents the row objects in templates: `row` (`{ id, row, cells }`), `row.row` (the TanStack row), `row.row.original` (the item, camelCase), `cell` and `header`, and that column ids keep their C# names.

### SF-051 A form field named like an action parameter changes model binding

- **Tag:** Bug, Low (owner: Summit; ASP.NET Core behavior)
- **What:** The table-state inputs included `Filter` (the search text) and the action had a parameter
  `AttendeeServerFilter filter`. When a value key matches a complex parameter's name, MVC binds that
  parameter with the name as a prefix, so it looked for `filter.Status` and the status filter was
  silently ignored. Found in the browser: the request carried `Status=Registered`, the pushed URL did not.
- **Fix:** the field is now `Search`. Not a library defect, but relevant if a built-in state transport
  (SF-001) is added: its field names should be prefixed.
- **Library guidance (1.0.0-preview.4):** not a library defect. The built-in state transport (D-31) is one input named by the application, and the DataTable page warns against a name that matches a complex action parameter.

### SF-052 Text areas are unstyled

- **Tag:** Bug, Medium (owner: RizzyUI)
- **What:** Every `RzInputTextArea` renders `class="flex field-sizing-content min-h-16 resize-none"` and
  nothing else: no border, no background (white in dark mode), no padding, no focus ring. In light mode
  it is a white box without a border on a white card, easy to miss; the contact form shipped in phase 3
  with it. Found when the attendee editor's Notes field showed a white block in dark mode.
- **Root cause:** `RzInputTextArea.DefaultDescriptor` is `new(extends: FormInputStyles.DefaultDescriptor,
  @base: "...")`. `RzInputText`, which works, extends the same descriptor without a `base` of its own.
  The textarea's slot is also named `textarea` where the form-input slot is `input`. Either the own
  `base` replaces the extended one or the slot names keep them apart; the rendered HTML shows the shared
  classes are lost. The merge was not traced inside TailwindVariants.NET.
- **Summit workaround:** `Components/Shared/SummitClasses.cs` holds the shared input classes; the three
  text areas pass `class="@SummitClasses.TextArea"`.
- **Library fix:** repeat the form-input classes in the textarea's base (minus `h-9`), or fix the merge.
- **Regression test (library):** bUnit: `RzInputTextArea` output contains `border-input`.
- **Fixed in 1.0.0-preview.4:** the textarea's classes are spelled out (the form-input classes with `py-2`, `min-h-16` and `field-sizing-content`, no fixed height) instead of extending `FormInputStyles` with a base of its own, which replaced the shared classes. Summit's `SummitClasses.TextArea` is deleted.

### SF-053 Sort buttons do not say which column they sort

- **Tag:** Bug, Medium (owner: RizzyUI; accessibility)
- **What:** `DataTableSortToggle` binds `aria-label` to `sort.nextLabel(header)`, which returns "Sort
  ascending", "Sort descending" or "Clear sort". Every sortable header button gets the same name, the
  visible column text is not part of it (axe reports `label-content-name-mismatch`, WCAG 2.5.3), and a
  screen reader user hears "Sort ascending, button" six times. The strings are hard-coded English in
  `rzDataTable.js`, so they are not localized like the rest of RizzyUI.
- **Summit workaround:** `x-bind:aria-labelledby` on the toggle, pointing at the label span passed as its
  `ChildContent`, so the button is named after its column; the header's `aria-sort` gives the direction.
  Three lines in `AttendeeTable.razor`.
- **Library fix:** name the button after its column and put the action in a description, or build the
  label as "{column}, sort ascending" from localized resources.
- **Regression test (library):** axe over the DataTable docs page (it would have failed).
- **Fixed in 1.0.0-preview.4:** `DataTableSortToggle` no longer binds `aria-label` to `sort.nextLabel(header)`: a toggle is named by its visible label, the column, and the header's `aria-sort` carries the direction. An icon-only toggle (no label rendered) is named by the new `sort.columnName(header)`. `sort.nextLabel` stays as English text for a tooltip. Summit's `aria-labelledby` is deleted.

### SF-054 Components in row templates duplicate their ids

- **Tag:** Bug, Medium (owner: RizzyUI)
- **What:** `RzComponent.Id` always renders a generated id. Inside `<template x-for>` the server renders
  each component once and Alpine clones it per row, so `TableRow`, `TableCell`,
  `DataTableRowSelectCheckbox`, `DataTableSortToggle`, `RzButton` and others repeat the same id in every
  row (on the attendees page one id appears 90 times, several 10 or 17 times). No `aria-*` or `for`
  references them, so nothing is announced wrongly today, but the HTML is invalid and any future
  reference would point at the first row.
- **Summit workaround:** none that keeps the library components. Summit's unique-id check reports
  duplicates of ids that appear inside a `<template>` as an annotation and still fails on any other
  duplicate.
- **Library fix:** components meant for row templates (the DataTable helpers, `TableRow`, `TableCell`)
  should not render an id unless one is given, or should bind one per row (`x-bind:id`). A general
  option: an id scope that suppresses generated ids inside templates.
- **Regression test (library):** the DataTable docs page has no duplicate ids after rendering.
- **Fixed in 1.0.0-preview.4:** the row-template helpers (`TableRow`, `TableCell`, `TableHeaderCell`, the DataTable sort, selection and checkbox helpers, pagination items and links, `CommandShortcut`) render an id only when one is given, and `RzDataTable` drops ids copied from its `x-for` templates (a component's generated id) when Alpine renders rows. Summit's unique-id check fails on any duplicate again.

### SF-055 Tab out of a multiple combobox loses focus

- **Tag:** Bug, Medium (owner: RizzyUI; Tom Select's plugin)
- **What:** In the attendee editor, Tags is `RzCombobox Multiple` with `Create = true`. With focus in its
  input and the list open, Tab ends on `<body>`, although the Notes text area follows in tab order. A
  keyboard user is thrown out of the form.
- **Root cause (established in phase 5):** for `Multiple`, `RzCombobox` adds Tom Select's
  `remove_button` and `checkbox_options` plugins (`RzCombobox.razor.cs`, `AddPlugin`). The
  `checkbox_options` plugin renders `<input type="checkbox" class="tomselect-checkbox">` in every option,
  with no `tabindex="-1"`, inside a `listbox` that is meant to be operated with `aria-activedescendant`.
  Tab therefore moves focus to the first option's checkbox (the `focusout` event's `relatedTarget` is
  `input.tomselect-checkbox`); Tom Select treats that as a blur and closes the dropdown, which hides
  the element that just received focus, and the browser drops focus to `<body>`. With the list closed,
  Tab stays on the input. Not caused by the sheet's focus trap (the same happens with it deactivated).
- **Summit workaround:** none in the app; the browser test closes the list with a click elsewhere.
- **Library fix:** give the option checkboxes `tabindex="-1"` and `aria-hidden="true"` (they are visual
  only; the option carries `aria-selected`), in a `render.option` hook or a plugin option; or make
  `checkbox_options` opt-in.
- **Regression test (library):** a multiple combobox followed by a text input; open the list, press Tab,
  and assert the text input has focus.
- **Fixed in 1.0.0-preview.4:** the option checkboxes of a multiple `RzCombobox` get `tabindex="-1"` and `aria-hidden`, so Tab leaves the control for the next field. Summit's test tabs to Notes instead of clicking elsewhere.

### SF-056 A DataTable needs a lot of headless markup

- **Tag:** DX, Medium (owner: RizzyUI)
- **What:** `RzDataTable` renders no table. `AttendeeTable.razor` is about 130 lines of `x-for`, `x-if` and
  string expressions (`sort.can(header)`, `_flex.cell(cell)`, `header.isPlaceholder`) for a standard
  table: sortable headers, a selection column, search, a column menu, rows per page, paging and an empty
  state. Mistakes in the expressions (SF-050) show up only in the browser, the CSP build limits what the
  expressions may contain, and components inside the templates bring their own problems (SF-048,
  SF-053, SF-054).
- **Summit:** writes the markup by hand, following the docs example.
- **Library suggestion:** owner decision D-22 (2026-11-18) keeps RzDataTable headless, with the developer
  authoring the structure, so the answer is not a default rendering but composable helpers (a header row
  and a cell helper that handle sorting, selection and flex rendering) and copyable recipes in the docs.
- **Fixed in 1.0.0-preview.4:** within decision D-22 (headless): `DataTableHeaderRows` (flex-rendered headers, a sort toggle named by its label, `aria-sort` on sortable columns, `data-column-id`, optional select-all) and `DataTableBodyRows` (flex-rendered cells, optional selection) write the standard rows; the docs show them as a recipe that mixes with custom markup. Summit keeps its hand-written attendee table (a selection column defined in the config and custom cells), which the docs describe as the full-control path.

### SF-057 A calendar in a popover is disconnected from its provider

- **Tag:** Bug, High (owner: RizzyUI; the docs example is affected)
- **What:** `CalendarMoreExamplesInfo.razor` shows `RzCalendarProvider` wrapping an `RzPopover` whose
  content holds the `RzCalendar`. `PopoverContent` teleports its content to `<body>`. `rzCalendar.js`
  announces itself and every click with `$dispatch('rz:calendar:…')`, which bubbles from the teleported
  element to `<body>`; `rzCalendarProvider.js` listens on its own element. The provider never receives
  `rz:calendar:init` (its `calendarApi` stays null, so the calendar opens on today's month instead of
  the selected range) nor `rz:calendar:click-day` (picking days changes nothing: no `range-complete`, no
  label update). Found on the dashboard: picking two days did nothing.
- **Root cause:** DOM events do not follow Alpine's `x-teleport`; the calendar finds its provider by
  bubbling. Confirmed in the browser (`calendarApi` false; events seen on `<body>` only).
- **Summit workaround:** `DashboardFilters.razor.ts` listens for the three calendar events on
  `document` and re-dispatches those from its calendar on the provider (about 10 lines).
- **Library fix:** let the calendar find its provider through Alpine scope (`closest` data stack) or
  an id (`ProviderId`), or have the popover forward events from its teleported content; add the range
  popover example to the docs tests.
- **Regression test (library):** a browser test of the docs "Range Popover" example: pick two days, the
  label changes and `rz:calendar:range-complete` fires on the provider.
- **Fixed in 1.0.0-preview.4:** the provider exposes its element through Alpine's scope (`rzCalendarProviderElement()`), which a teleported calendar keeps; the calendar also dispatches its events on that element when the provider is not its ancestor, and the provider dispatches `rz:calendar:range-complete` on a teleported calendar as well, so markup around it (the popover content in the docs example) can react. Summit's event forwarding is deleted.

### SF-058 A calendar range cannot be part of a form without script

- **Tag:** Gap, Medium (owner: RizzyUI)
- **What:** `RzCalendarProvider` keeps its dates in Alpine state and dispatches `rz:calendar:range-complete`.
  Nothing posts them: no `Name`/`StartName`/`EndName`, no hidden inputs, no `change` event on a form
  control. In an htmx app every filter is a form, so a date range filter needs two hidden inputs with
  `x-bind:value`, a listener and a manual submit. The bindings also lag: the provider normalizes dates
  over more than one tick, so a submit on the next tick still sent the old range (found when the quick
  range buttons sent stale dates); Summit writes the inputs itself.
- **Plan reference:** F-14 (`RzDateEdit` range mode cannot bind) is the same gap from the other side.
- **Summit workaround:** hidden `From`/`To` inputs in the provider and `send(from, to)` in the
  code-behind, which writes them and triggers the form's `change`.
- **Library fix:** `StartName`/`EndName` (or `Name` with a separator) rendering hidden inputs kept in
  sync, and a bubbling `change` event on them when a range completes.
- **Fixed in 1.0.0-preview.4:** decision D-32: `RzCalendarProvider` takes `Name` (single and multiple; multiple posts one value per date) and `StartName`/`EndName` (ranges), renders hidden inputs kept in step with its dates, and raises a bubbling `change` when the value is complete. Summit's hidden inputs and `send()` are removed: the form's `hx-trigger="change"` sends the range.

### SF-059 RzChart never sets the chart type

- **Tag:** Bug, Medium (owner: RizzyUI)
- **What:** `ChartBuilder` serializes `{ data, options }`; the type is set only on each dataset
  (`DoughnutPieDataset { Type = "doughnut" }`). Chart.js applies chart-type defaults and overrides (the
  doughnut legend's `generateLabels`, its tooltip and interaction defaults) from the config's `type`, so a
  doughnut renders with a line chart's legend: one entry labelled "Tickets" instead of one per ticket
  type. There is no builder method to set the type.
- **Summit workaround:** the Chart.js legend is hidden and the card renders its own legend (a list
  with `bg-chart-N` swatches and counts), which is also easier to read and to translate.
- **Library fix:** set `type` from the first dataset (or add `ChartBuilder.Type(...)`); add a doughnut
  example with its legend to the docs tests.
- **Fixed in 1.0.0-preview.4:** RzChart sets the config's `type` from the first dataset (C# and JS), and `ChartBuilder.Type(...)` sets it explicitly. Summit keeps its HTML legend as a design choice.

### SF-060 Decimal tickers show zero in German

- **Tag:** Bug, High for non-English apps (owner: RizzyUI)
- **What:** `RzNumberTicker.razor` renders `data-value="@Value"` (and `data-start-value`) with the
  current culture. Under de-DE the revenue renders `data-value="96356,2"`, `parseNumber` in
  `rzNumberTicker.js` gets 0 (or NaN), and the dashboard showed "€0,00" for revenue and average order.
  The `Culture` parameter only affects the display format. Integers are unaffected, which is why the
  home page stats never showed it.
- **Summit workaround:** money tickers use whole euros (`Math.Round`, `DecimalPlaces = 0`).
- **Library fix:** format the data attributes with `CultureInfo.InvariantCulture`; audit other components
  that write numbers into `data-*` or JSON by string interpolation.
- **Regression test (library):** bUnit under de-DE: `data-value` of `Value = 1.5m` is `1.5`.
- **Fixed in 1.0.0-preview.4:** the audit rendered each component that takes a fractional number under de-DE and found 13 culture-formatted attributes: `RzNumberTicker` (`data-value`, `data-start-value`, `data-delay`), `RzShineBorder` (`data-border-width`, `data-duration`) and `RzSlider` (`data-min`, `data-max`, `data-step`, `data-min-steps-between-thumbs`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`). All are written with the invariant culture; the test keeps every component in the list honest. Summit's money tickers show cents again.

### SF-061 Charts overflow a fixed-height parent

- **Tag:** Bug, Low (owner: RizzyUI)
- **What:** `RzChart`'s base slot is `w-full` and its container `relative h-full min-h-[300px] w-full`.
  `h-full` of a base without a height is auto, so with `maintainAspectRatio: false` the canvas sizes the
  container and the container the canvas: in a `h-56` card the bar chart rendered 484 px tall and
  covered the card below. The docs examples set a height on a wrapper but not on the chart.
- **Summit workaround:** `class="h-full"` on each `RzChart`, inside wrappers of 256 or 320 px.
- **Library fix:** `h-full` on the base slot, and drop the fixed `min-h` (or document it).
- **Fixed in 1.0.0-preview.4:** the base slot is `h-full w-full` and the container `relative aspect-[2/1] h-full w-full`: a chart fills a parent with a height and is 2:1 without one. Summit's `class="h-full"` on charts is deleted.

### SF-062 Charts throw on a theme change and when replaced

- **Tag:** Bug, High (owner: RizzyUI)
- **What:** `rzChart.js` declares `chartInstance: null` in its Alpine data and assigns the Chart.js
  instance to it, so every later access (`this.chartInstance.update()`, `.destroy()`) goes through a
  reactive proxy. Chart.js does not work through a proxy: toggling dark mode on the dashboard threw
  "Maximum call stack size exceeded" and "Cannot set properties of undefined (setting 'fullSize')"
  from the theme handler, and swapping the charts region while a chart was animating threw "Cannot read
  properties of null (reading 'save')" from Chart.js's animator, which still held the real chart because
  `destroy()` unregistered the proxy. Any htmx app that replaces charts or toggles the theme hits it.
- **Root cause:** reactive wrapping of a third-party instance (the known Alpine and Chart.js pitfall);
  the fix is `Alpine.raw()` or keeping the instance outside the reactive data.
- **Summit workaround:** `DashboardFilters.razor.ts` destroys the raw instances (`Alpine.raw`) and removes
  their theme listeners before the charts region is swapped (`htmx:before:swap`) and on a theme change,
  then reloads the panels. About 35 lines with SF-005.
- **Library fix:** keep the instance in a non-reactive field (a closure or a `WeakMap`), or call
  `Alpine.raw(this.chartInstance)` everywhere. Re-resolve colors on theme change at the same time (SF-005).
- **Regression test (library):** a docs-page browser test that toggles the theme and replaces a chart
  with no page errors.
- **Fixed in 1.0.0-preview.4:** RzChart keeps the Chart.js instance in a closure, outside Alpine's reactive data. The replacement case also needed a runtime fix: Alpine cleans up only removed elements it marked, so components inside a removed plain wrapper (an htmx-swapped region, or RzChart's own root) were never destroyed; `alpineOrphanCleanup.js` runs `Alpine.destroyTree` on those. Summit's `destroyCharts` and its swap and theme listeners are deleted.

### SF-063 A scrolling table is not keyboard accessible

- **Tag:** Bug, Low (owner: RizzyUI; accessibility)
- **What:** `RzTable` wraps the table in `overflow-x-auto`. When a table is wider than its card and has
  no links or buttons (the dashboard's recent orders), keyboard users cannot scroll it; axe reports
  `scrollable-region-focusable` (WCAG 2.1.1).
- **Summit workaround:** `RzTable tabindex="0" role="region" aria-label="Recent orders table"` (the
  attributes land on the container).
- **Library fix:** give the container `tabindex="0"`, a role and a name (from the caption) when it can
  scroll, or always.
- **Fixed in 1.0.0-preview.4:** `RzTable`'s scroll container is focusable (`tabindex="0"`), and `AriaLabel` names it as a region. Summit's three tables use `AriaLabel` instead of hand-written `tabindex`, `role` and `aria-label`.

### SF-064 RzInputOTP's input cannot take autofocus

- **Tag:** DX, Low (owner: RizzyUI)
- **What:** `RzInputOTP` splats `AdditionalAttributes` on its container `div`; the real `<input>` (hidden
  behind the slots) only gets the parameters the component defines. `autofocus`, which htmx 4 honors
  after a swap and would put the cursor back in the badge field after each check-in, ends up on the
  `div`. The same applies to `autocapitalize` and `enterkeyhint`, which matter on phones.
- **Summit workaround:** `CheckInForm.razor.js` focuses `[data-otp-input]` when the form initializes
  (4 lines).
- **Library fix:** an `InputAttributes` dictionary (or `AutoFocus`) for the input, as other inputs take
  their attributes on the input element.
- **Observed working:** `rz:inputotp:onchange` fires once the code is complete, after the hidden input
  holds the value, so `hx-trigger="submit, rz:inputotp:onchange"` on the form posts the full code with
  no script (open question from the plan, answered).
- **Fixed in 1.0.0-preview.4:** `RzInputOTP` takes `InputAttributes` for the real input (`autofocus`, `autocapitalize`, `enterkeyhint`). Summit's `CheckInForm.razor.js` is replaced by `InputAttributes` with `autofocus`.

### SF-065 Content inside a colored alert is unreadable

- **Tag:** Bug, Medium (owner: RizzyUI; accessibility)
- **What:** `RzAlert`'s Success variant is `border-success bg-success/10 text-success-foreground`
  (Warning, Info and Destructive follow the same pattern). `success-foreground` is the text color for a
  solid `bg-success` (white in light mode, dark in dark mode); on a 10% tint it is near-white on
  near-white. `AlertTitle` and `AlertDescription` set their own colors, which hides the problem until
  an alert contains anything else: the check-in result's `RzItem` title measured 1.14:1 (axe
  `color-contrast`) and was invisible in dark mode.
- **Summit workaround:** `class="text-foreground"` on the item inside the alert.
- **Library fix:** use `text-foreground` (or `text-card-foreground`) as the alert's base color for
  tinted variants; keep `*-foreground` only for solid fills.
- **Regression test (library):** axe over an alert of every variant containing plain text.
- **Fixed in 1.0.0-preview.4:** the tinted Information, Success and Warning alerts use `text-foreground` for their content; the status color stays on the border, the tint and the icon. Summit's `text-foreground` on the check-in item is deleted.

### SF-066 RzIndicator labels a div without a role

- **Tag:** Bug, Low (owner: RizzyUI; accessibility)
- **What:** `RzIndicator.razor` renders `<div aria-label="@EffectiveAriaLabel">` with no role, and the
  default label is the localized "Indicator". ARIA prohibits `aria-label` on a generic element, so the
  label is ignored or reported (axe `aria-prohibited-attr`), and "Indicator" says nothing anyway.
- **Summit workaround:** `role="img" AriaLabel="Live"` on the live dots (dashboard, check-in counter).
- **Library fix:** `role="img"` when a label is given, `aria-hidden="true"` (decorative) when not; no
  generic default label.
- **Fixed in 1.0.0-preview.4:** `RzIndicator` is `role="img"` with its `AriaLabel`, and `aria-hidden` (decorative) without one; there is no generic default label. Summit's `role="img"` on the live dots is removed.

### SF-067 Menubar checkbox and radio items cannot be observed

- **Tag:** Gap, Medium (owner: RizzyUI)
- **What:** `rzMenubar.js` toggles `data-state` and `aria-checked` on `MenubarCheckboxItem` and
  `MenubarRadioItem` in its click handlers and does nothing else: no `rz:menubar:checked-change`
  event, no hidden input, no `Name`/`Value` posted (the radio group's `Name` only groups the items).
  A "View" menu that changes the page (Summit: drafts only, density) needs code that listens for
  clicks on the teleported menu content and reads `aria-checked` after the component's handler.
- **Summit workaround:** `ScheduleBuilderPage.razor.js` (about 15 lines): a document click listener,
  a microtask, and data attributes on the page root that CSS reads.
- **Library fix:** dispatch a bubbling change event with the item's value and state (and forward it
  from the teleported content); optionally a `Name` that renders hidden inputs, so a menu can drive
  an htmx form.
- **Observed working:** radio items stay exclusive; checkbox and radio items keep the menu open, and
  arrow keys, Enter and Escape follow the APG menubar pattern.
- **Fixed in 1.0.0-preview.4:** checkbox and radio items dispatch `rz:menubar:checked-change` ({ type, value, checked, group }) on the item and on the menubar element (the content is teleported); `MenubarCheckboxItem` takes `Value`. Summit's document click listener and microtask are replaced by an event listener on the page root.

### SF-068 RzDateEdit hides its field label

- **Tag:** Bug, Medium (owner: RizzyUI; accessibility; noted in the component's own docs)
- **What:** The input rendered by `RzDateEdit` has a hard-coded `aria-label="Select date"`, and the
  wrapper is a group labelled "Date picker". `aria-label` wins over the `<label for>` that
  `FieldLabel` renders, so a screen reader announces every date field in the app as "Select date" and
  `getByLabel('Starts at')` finds nothing (the Summit test had to locate the input by its name).
  The text is English-only.
- **Summit workaround:** none without script; the attribute is written after the caller's attributes.
- **Library fix:** no `aria-label` when the input has a label (or `aria-labelledby` pointing at the
  field label); an `AriaLabel` parameter for the rare unlabeled case; localize the defaults.
- **Fixed in 1.0.0-preview.4:** the input has no default `aria-label` (its `FieldLabel` names it) and a new `AriaLabel` parameter names an unlabeled input; the wrapper no longer renders `role="group" aria-label="Date picker"`. The unused English resource strings are removed. Summit's test finds the date input with `getByLabel('Starts at')`.

### SF-069 A menubar item's click handler replaces the caller's

- **Tag:** Bug, Medium (owner: RizzyUI)
- **What:** `MenubarItem.razor` renders `@attributes="@AdditionalAttributes"` followed by
  `x-on:click="handleItemClick"`. A caller's `x-on:click` (Summit's "Publish all drafts…" opens a
  confirmation dialog) is overwritten without warning: the menu closes and nothing else happens. The
  same shape as SF-030 (RzToggle) and recurring pattern 1.
- **Summit workaround:** `x-on:click.capture="…"`, which Alpine treats as a different attribute, so both
  handlers run. Subtle enough that it needs a comment where it is used.
- **Library fix:** merge handlers (call the caller's expression from `handleItemClick`, or use a
  different attribute for the component's own handler such as `x-on:click.self`), and document which
  attributes each component reserves.
- **Fixed in 1.0.0-preview.4:** decision D-24: a caller's `x-on:*` on any RizzyUI component is rendered as Alpine's `@event` form, so it runs alongside the component's own `x-on:event` instead of being replaced. Summit's `x-on:click.capture` is now a plain `x-on:click`.

### SF-070 RzSlider does not bind to a model

- **Tag:** DX, Low (owner: RizzyUI)
- **What:** Every other form control in the session editor takes `For`; the slider takes
  `Value="@([Model.LengthMinutes])"`, `Name="Model.LengthMinutes"` and `UseIndexedNames="false"` (the
  default posts `Model.LengthMinutes[0]`, which does not bind to an `int`). It cannot be targeted by
  `FieldLabel For`, gets no `aria-invalid`, and `FocusFirstError` cannot move focus to it. The posted
  value binds correctly once named by hand.
- **Summit workaround:** the three parameters above and `AriaLabelledBy` pointing at a plain label.
- **Library fix:** an `RzInputSlider` (or `For`/`Value` overloads for a single `double`/`int`) built on
  `InputBase`, like the other inputs.
- **Fixed in 1.0.0-preview.4:** new `RzInputSlider<TValue>`: a single-value slider bound with `For` to any numeric property; it posts the model path with one value and marks `data-invalid` while the field has errors. Summit's `Name`/`UseIndexedNames`/`Value` array is replaced.

### SF-071 The copy button is too small to hit

- **Tag:** Bug, Low (owner: RizzyUI; accessibility)
- **What:** With only an icon inside (the usual case next to an input), `RzClipboard`'s button measured
  14 × 14 px in the API-key dialog; axe reports `target-size` (WCAG 2.5.8, AA in 2.2). shadcn's input
  group uses `InputGroupButton` (at least 24 px) for this.
- **Summit workaround:** `class="size-8 rounded-md hover:bg-accent"` on the clipboard button.
- **Library fix:** a minimum size in RzClipboard's base slot, or an `InputGroupButton`-based variant for
  use inside input groups.
- **Observed working (settings page):** lazy tab panels with `hx-trigger="intersect once"` (one request
  per panel, none for hidden tabs); vertical tabs with arrow keys; `HX-Refresh` after the theme cookie;
  a dialog whose teleported body is replaced by a form post (422, then the secret); per-row alert
  dialogs closed by a named event; `RzCollapsible` with `RzCodeViewer`; `HX-Trigger` with a JSON detail
  logged by `RzEventViewer` (which also shows a "listening" system entry); `RzEmbeddedPreview` with a
  component; `RzRadioGroup`, `RzCheckboxGroup`, `RzSwitch` and `RzFormSection` in htmx forms. The
  read-only secret could not use `InputGroupInput`, which wraps `RzInputText` and needs a model
  property (SF-028).
- **Fixed in 1.0.0-preview.4:** `RzClipboard`'s base has `min-h-6 min-w-6` (24 x 24 px). Summit's `size-8` is removed.

### SF-072 The testing entry point triggers a Node module-type warning

- **Tag:** DX, Low (owner: RizzyUI npm package)
- **What:** `packages/rizzyui/package.json` exports `./testing` as `./testing/index.js`, which uses
  `import`/`export`, but the package does not declare `"type": "module"` (and the file is not `.mjs`).
  Node first tries CommonJS, fails, reparses as ESM, and prints a multi-line warning on every run of
  Summit's code-behind tests (`MODULE_TYPELESS_PACKAGE_JSON`). Harmless, but it is the first thing a
  developer sees when they adopt the testing helper.
- **Summit workaround:** none needed.
- **Library fix:** rename the file to `index.mjs` (and the export), or add `"type": "module"` after
  checking the package's other CommonJS files.
- **Observed working:** `mountCodeBehind` tests a TypeScript module bundled by esbuild, its window and
  bubbling events, and a module whose markup lives outside the component (teleported menu items).
  Summit's first three code-behind tests (`tests/codebehind/organizer.test.mjs`) run in CI.
- **Fixed in 1.0.0-preview.4:** `src/js` and `testing` carry a `package.json` with `"type": "module"` (published with the package), so Node no longer warns MODULE_TYPELESS_PACKAGE_JSON or reparses the files.

### SF-073 Date pickers ignore the request culture

- **Tag:** Gap, Medium (owner: RizzyUI)
- **What:** On German pages the dashboard calendar showed "May 2027 / June 2027" and "SunMon…", and the
  schedule builder's date picker English months, although everything else (formats, RizzyUI's own
  strings such as "Benachrichtigungen") followed de-DE. `VanillaCalendarOptions.Locale` defaults to
  `"en"` rather than `CultureInfo.CurrentUICulture`. `FlatpickrOptions.Locale = "de"` is accepted but
  flatpickr only knows `en` unless its `l10n/de.js` is loaded, which RizzyUI does not ship, pin or load;
  there is no warning.
- **Summit workaround:** the calendar gets `Locale = CultureInfo.CurrentCulture.Name`; `vendor.json`
  adds `FlatpickrDe` (flatpickr's `dist/l10n/de.js`, self-hosted), and the session editor passes
  `ComponentAssetKeys = ["FlatpickrCore", "FlatpickrDe"]` on German pages. `ComponentAssetKeys` made
  this possible without script, which is a good extension point.
- **Library fix:** default both components to the current UI culture; add flatpickr locale files to
  the default assets (keyed by language) and load the one the culture needs.
- **Observed working:** with the locale loaded, German dates post as `yyyy-MM-dd HH:mm` and bind on a
  de-DE request; capacity (an `int`) binds; the culture cookie survives navigation; RizzyUI's own
  German strings are used.
- **Fixed in 1.0.0-preview.4:** `RzCalendar` and `RzCalendarProvider` default to `CultureInfo.CurrentCulture`, and `RzDateEdit` sets flatpickr's `locale` from it and loads the matching locale file. flatpickr 4.6.13's 65 locale files are default assets (`FlatpickrLocale.{file}`, pinned with SRI hashes), so an application can self-host them under the same key. Summit's `FlatpickrDe` key, `ComponentAssetKeys` and explicit calendar `Locale` are deleted; `vendor.json` self-hosts `FlatpickrLocale.de`.

### SF-074 Sheets opened from a trigger do not take focus

- **Tag:** Bug, High (owner: RizzyUI; accessibility, WCAG 2.4.3)
- **What:** Opening the public site's navigation sheet on a phone left focus on the menu button; Tab
  then walked the page behind the modal overlay (the test's trail never entered the panel). In
  `rzSheet.js`, the `open` watcher calls `createFocusScope(panel).activate()` synchronously, before
  `x-show` has displayed the panel, so no element inside is focusable and focusing the fallback panel
  fails. The scope's Tab handler is a `keydown` listener on the panel, so with focus outside it never
  runs. Sheets opened with `DefaultOpen` (the attendee editor, session details) work, because they
  activate in `$nextTick` after the panel is visible.
- **Summit workaround:** `Components/Shared/SheetFocus.razor(.js)` in the app layout: a
  `MutationObserver` on panels' `aria-hidden` that focuses the first visible control on the next frame
  (about 25 lines); the focus scope then keeps focus inside, and Escape returns it to the trigger.
- **Library fix:** activate the focus scope after the panel is shown (`$nextTick`, or after the
  transition), as the `DefaultOpen` path does; consider listening for Tab on the document while a
  modal scope is active.
- **Regression test (library):** open a sheet with its trigger and assert that focus is inside the
  panel and that Tab cannot leave it.
- **Fixed in 1.0.0-preview.4:** `rzSheet.js` activates the focus scope in `$nextTick`, after x-show has
  displayed the panel. The sheet test in `real-components.a11y.ts` now checks focus and the Tab trap on
  both builds; Summit's `SheetFocus` is deleted.

### SF-075 Sidebar groups reference a label that may not exist

- **Tag:** Bug, Medium (owner: RizzyUI; accessibility; found by the docs scan, M0)
- **What:** `SidebarGroup.razor` renders `role="group" aria-labelledby="@LabelId"` unconditionally;
  `SidebarGroupLabel` renders the element with that id. A group without a label (the docs sidebar has
  twenty) points at nothing, so the group is unnamed and the reference dangles on every docs page.
  Summit's sidebar groups all have labels, which is why Summit never saw it.
- **Library fix:** render `aria-labelledby` only when a `SidebarGroupLabel` registered itself (the label
  already receives the id from its parent group), or accept an `AriaLabel` for unlabeled groups.
- **Regression test (library):** the docs scan, once its known-defect entry is removed.
- **Fixed in 1.0.0-preview.4:** `SidebarGroup` references its label only when a `SidebarGroupLabel` registered an id that renders (with `AsChild`, a child that computes its own id, such as a collapsible trigger, cannot be referenced), and takes `AriaLabel` for a group without one.

### SF-076 A popover's label goes on a role-less wrapper

- **Tag:** Bug, Low (owner: RizzyUI; accessibility; found by the docs scan, M0)
- **What:** `RzPopover.razor` renders `aria-label="@EffectiveAriaLabel"` on its root `div`, which has no
  role, so the label is ignored and axe reports `aria-prohibited-attr` (five docs pages). The same shape
  as SF-066 (RzIndicator) and SF-035 (RzAuroraText).
- **Library fix:** put the label on `PopoverContent` (the dialog) and let the trigger keep its own name.
- **Fixed in 1.0.0-preview.4:** `RzPopover`'s `AriaLabel` names `PopoverContent` (the dialog) when the content has no label of its own; the role-less wrapper no longer carries it.

### SF-077 Calendar weekend headers and muted days lack contrast

- **Tag:** A11y, Medium (owner: RizzyUI; found by the docs scan, M0)
- **What:** On the calendar pages axe reports `color-contrast` for the weekend column headers
  (`b.vc-week__day[data-vc-week-day-off]`) and for day buttons outside the current month. The colors come
  from the class map RizzyUI applies to vanilla-calendar-pro. Summit's dashboard calendar opens in a
  popover, where axe did not scan it.
- **Library fix:** use `text-muted-foreground` only where it meets 4.5:1 on the calendar surface, and a
  stronger color for weekends; check both themes in dark mode.
- **Fixed in 1.0.0-preview.4:** weekend headers use `--muted-foreground` over vanilla-calendar-pro's own weekend color (a rule in RizzyUI's CSS), and days outside the month drop the extra `opacity-50` (the muted color alone meets 4.5:1).

### SF-078 Primary and muted text colors fail contrast in the default theme

- **Tag:** A11y, Medium (owner: RizzyUI; found by the docs scan, M0)
- **What:** Across 30 docs pages axe reports `color-contrast` on RizzyUI components that color text with
  the theme: `RzLink` and breadcrumb links (`text-primary`), primary buttons (white on `--primary`),
  outline and ghost triggers (dialog, sheet, popover, dropdown, tooltip), the Steps labels, command
  shortcuts and event-viewer entries (`text-muted-foreground`). Summit uses its own theme with checked
  contrast (and SF-036 for the status colors), so it did not see this. The root cause is the token
  values, not the components: W8 measures each foreground/background pair of the built-in themes.
- **Library fix:** adjust `--primary`, `--primary-foreground` and `--muted-foreground` in the built-in
  themes until every documented pairing meets 4.5:1 (3:1 for large text), and add a theme-contrast unit
  test over the token pairs.
- **Fixed in 1.0.0-preview.4:** the Arctic theme's `--primary` (light L 0.52; dark L 0.68 with a dark `--primary-foreground`), `--destructive` (light L 0.51; dark L 0.70 with a dark foreground) and `--muted-foreground` (light L 0.52, dark L 0.76) meet 4.5:1 in every documented pairing, also as soft badge and alert text on their own tint; a unit test measures the token pairs. The event viewer's timestamps drop their extra transparency.

### SF-079 An empty command list is an empty listbox

- **Tag:** A11y, Low (owner: RizzyUI; found by the docs scan, M0)
- **What:** When nothing matches (or the items load later), `CommandList` keeps `role="listbox"` with no
  options; axe reports `aria-required-children` on the command docs page.
- **Library fix:** drop the role (or set `aria-busy`) while the list is empty, and let `CommandEmpty`
  carry the message.
- **Fixed in 1.0.0-preview.4:** `CommandList` is a `listbox` only while it shows items; empty, it has no role and `CommandEmpty` carries the message. `CommandSeparator` is decorative (`aria-hidden`), since a listbox may not contain a separator. The sheet also waits until its panel is shown before moving focus (found while testing `InitialFocus`).

### SF-080 The sidebar docs preview fails list semantics and target size

- **Tag:** A11y, Low (owner: RizzyUI docs or RizzyUI, to triage in W8; found by the docs scan, M0)
- **What:** Inside the `/components/sidebar` preview, axe reports `SidebarMenuItem` elements outside a
  list, a `SidebarMenu` without list items, and 16 px targets. Summit's organizer sidebar, built from the
  same components, passes axe, so the example markup is the first suspect.
- **Fix:** triage; then fix the example, or the components if the example is a supported pattern.
- **Fixed in 1.0.0-preview.4:** triaged as both: the components gained `AsChild` on `RzCollapsible` (the examples already used `<RzCollapsible AsChild><SidebarMenuItem>`, shadcn's pattern, which rendered a `div` between the list and its items), and `SidebarMenuAction`/`SidebarGroupAction` are 24 px (`w-6`) instead of 20 px; the dropdown example now puts each dropdown in a `SidebarMenuItem`.

### SF-081 The docs site's own text colors fail contrast

- **Tag:** A11y, Medium (owner: RizzyUI docs; found by the docs scan, M0)
- **What:** About a thousand `color-contrast` results on 44 pages come from the docs site, not the
  components: the API tables' parameter names (`font-mono text-sky-600`), prose links in the chart and
  getting-started pages, and inline `code`.
- **Fix (W11):** darker colors in the docs stylesheet for those three elements; the scan then drops the
  entry.
- **Fixed in 1.0.0-preview.4:** the API tables' parameter names use `text-sky-700` (5.9:1 on white) instead of `text-sky-600` (4.0:1); with the slice 25 theme values, prose links and inline code meet contrast too. The docs scan reports no color-contrast result.

### SF-082 Docs examples contain accessibility mistakes

- **Tag:** A11y, Medium (owner: RizzyUI docs; found by the docs scan, M0)
- **What:** Developers copy examples. The scan found, in the examples themselves: icon-only buttons with
  no accessible name (button group, item, sidebar, input group, calendar popovers, home page),
  form controls without labels (input OTP, native select, a textarea on the state page), `arialabel`
  instead of `AriaLabel` on a button, `BreadcrumbItem` given `href`/`label` attributes it does not have,
  and small targets on the home page.
- **Fix (W11):** correct each example; examples should pass the same scan as components.
- **Fixed in 1.0.0-preview.4:** the examples name their icon-only buttons (`AssistiveLabel` on `RzButton`, which the docs had written as `AriaLabel`, rendered as a meaningless `arialabel` attribute; `aria-label` on `InputGroupButton`), label the input OTPs, native selects and the state page's textarea, use `BreadcrumbList`/`BreadcrumbLink`/`BreadcrumbPage` on the command demo, and put the sidebar popover's button in `PopoverTrigger AsChild`. The home page's small-target result was a library issue: `InputGroupButton` could shrink in a narrow row (an icon button at 14 px); it is `shrink-0` now.

### SF-083 Docs examples break under the strict CSP

- **Tag:** Bug, Low (owner: RizzyUI docs; found by the docs scan, M0)
- **What:** Running every page under the docs site's CSP mode shows examples that only work without a
  policy: inline `onclick` handlers (confetti, sidebar, lazy-loading examples), an inline `<script>` on the
  line chart page, avatars and logos from github.com and simpleicons.org (empty, item, marquee),
  `RzConfetti UseWorker` creating a `blob:` worker, and the Alpine fundamentals page's examples
  (object-literal `x-bind:class`, undefined variables) that the CSP build cannot evaluate.
- **Fix (W11):** rewrite the examples in the CSP-safe subset, self-host the images, and document that
  `UseWorker` needs `worker-src blob:` (or turn it off) under a strict policy.
- **Fixed in 1.0.0-preview.4:** the examples work under the docs site's Content Security Policy: `$dispatch` in an Alpine scope instead of inline `onclick`, the line chart's segment styles in `site.js` instead of an inline script, local avatar images and icons instead of github.com and simpleicons.org, and the Alpine fundamentals examples use data registered with `Alpine.data` under the CSP build. A library bug surfaced: `RzConfetti` in global mode used canvas-confetti's default instance, which always starts a `blob:` worker; it now creates its own instance that honors `UseWorker` (off by default), and `UseWorker` documents `worker-src blob:`.

### SF-084 Scrolling Markdown code blocks are not keyboard accessible

- **Tag:** A11y, Low (owner: RizzyUI; WCAG 2.1.1; found by the docs scan, M0, on CI)
- **What:** `Extensions/MarkdigExtensions.cs` writes every fenced code block as
  `<pre class="border-muted border"><code ...>`. When a line is wider than the block, the `pre` scrolls
  sideways but has no `tabindex`, so keyboard users cannot reach the hidden part. Which blocks overflow
  depends on the fonts: one chart page on Windows, four on the Linux CI runner (which is how the first
  CI run of the scan found it). Same family as SF-063 (RzTable's scroll container).
- **Library fix:** render `tabindex="0"` on the `pre` (a focusable, readable region; `role="region"` and
  a name are optional for a code block), or wrap long lines.
- **Regression test (library):** a Markdown rendering test that the `pre` has `tabindex="0"`, and the
  docs scan once its entry is removed.
- **Fixed in 1.0.0-preview.4:** Markdown code blocks render `<pre tabindex="0">`, so a block that scrolls sideways can be scrolled with the keyboard.


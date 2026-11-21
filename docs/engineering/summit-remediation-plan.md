# Fixing the Summit findings: remediation plan

Summit ([summit-findings.md](summit-findings.md), [summit-assessment.md](summit-assessment.md)) left 74
findings, all open in the libraries, with a workaround in the app for most of them; the docs scan (W0)
added ten more (SF-075 to SF-084). This plan turns
them into library fixes: which repository each lands in, in what order, with which test, and what
Summit code each fix deletes.

## 1. Rules for every fix

1. **Test first.** Each fix starts with a library test that fails today: the "Regression test
   (library)" line of its finding, or the closest equivalent. bUnit for markup, the RizzyUI JS tests
   for runtime logic, the RizzyUI browser fixtures (`src/RizzyUI.Docs` Playwright) for focus, overlays,
   theme changes and anything teleported.
2. **Delete the Summit workaround in the same pull request** when the fix is in this repository
   (Summit builds against `src/RizzyUI` in Project mode). Summit's browser suite then proves the fix in a
   real application; a fix that does not let the workaround go is not finished. Rizzy fixes reach Summit
   after a Rizzy release and a package bump (section 5).
3. **Update the finding** in the same pull request: Library status `Fixed in <version>`, Application
   status `Works`, Regression test filled in, and the ledger line removed or shortened.
4. **One workstream per pull request where possible**, small enough to review in one sitting. A
   decision in section 3 that a workstream depends on is settled before its pull request opens.
5. **Breaking changes are allowed before 1.0** but each one gets a line in `CHANGELOG.md` under
   "Breaking" with the migration, and the docs page of the component changes in the same pull request.

## 2. Workstreams

Severity counts are High / Medium / Low. Size: S (a day or less), M (two to four days), L (a week).
"Removes" names the Summit code the workstream deletes. The full finding-to-workstream table is in the
appendix; every finding has exactly one workstream.

### W0. Test infrastructure first (RizzyUI, S)

No finding of its own, but it catches the accessibility pattern (15 findings) and keeps it fixed.

- Axe (WCAG 2.2 A/AA) and Summit's unique-id and dangling-ARIA checks over every docs page, in the
  existing docs browser fixtures. Known defects are listed with their finding id and removed from the
  list as their workstream lands (the same annotation approach Summit uses, never a blanket exclusion).
- A small "behaviors" fixture page per scenario the docs do not cover today: open an overlay from its
  trigger, toggle the theme with a chart on the page, swap a component with htmx, switch to de-DE.
- Copy Summit's console-error, Alpine-error and CSP collectors into the docs fixtures.

Outcome: a baseline report. Everything after W0 shrinks that list.

**Status (M0 done):** `src/RizzyUI.Docs/tests/integration/docs-scan.ts` scans every page found in the
docs' `@page` directives (118 pages) on the standard build (axe, ids, ARIA references, errors) and the
CSP build (errors, CSP violations). The first run recorded 4,501 problems; each one is classified in
`docs-scan-known.ts` against a finding, and nothing unclassified passes. Nine of the clusters were new
(SF-075 to SF-083, and SF-084 from its first CI run): six library defects for W8 (a dangling `aria-labelledby` on every sidebar group,
popover labels, calendar and theme contrast, an empty command listbox), one to triage, and three
docs-site findings for W11. The consolidated known-defect list is the W8 and W11 work queue.

### W1. Overlays and focus (RizzyUI, 1/3/4, M)

SF-002, SF-003, SF-004, SF-010, SF-011, SF-032, SF-049, SF-074.

- **RzSheet:** activate the focus scope after the panel is visible, as the `DefaultOpen` path already
  does (SF-074, High); add `EventTriggerName` and `CloseEventName` like RzDialog (SF-002); an
  `InitialFocus` selector for sheets and dialogs (SF-032).
- **Dialog close events:** scope the default close event to the instance (decision R-3) (SF-003); fix
  the docs' event and constant names (SF-004).
- **RzSidebar:** read the collapse cookie on the server (SF-010); `min-w-0` on `SidebarInset` (SF-049);
  document that `ChildContent` renders twice (SF-011).
- Removes: `SheetFocus.razor(.js)`, the open-by-swap pattern in the attendee editor and session details
  (once events exist), `SidebarState`, the `min-w-0` class.

### W2. Charts (RizzyUI, 1/2/1, S)

SF-005, SF-059, SF-061, SF-062.

- Keep the Chart.js instance outside Alpine's reactive state (`Alpine.raw` or a closure) (SF-062, High).
- Keep the unresolved config and re-resolve CSS-variable colors on `rz:theme-change` (SF-005).
- Set the chart `type` from the first dataset, or add `ChartBuilder.Type` (SF-059).
- `h-full` on the base slot; drop or document `min-h-[300px]` (SF-061).
- Removes: `destroyCharts`, the before-swap and theme listeners in `DashboardFilters.razor.ts`, the HTML
  doughnut legend (optional: it may stay as a design choice), `class="h-full"` on charts.

### W3. Dates and calendars (RizzyUI, 1/3/1, M)

SF-014, SF-057, SF-058, SF-068, SF-073.

- **RzCalendar finds its provider through Alpine scope or a `ProviderId`, not DOM bubbling** (SF-057,
  High; the docs' "Range Popover" example is broken today).
- **Provider as a form participant:** `StartName`/`EndName` (or `Name`) rendering synced hidden inputs,
  and a bubbling `change` when a range completes (SF-058). Decision R-6 settles the names.
- **Culture:** both date components default to the request culture; flatpickr locale files join the
  default assets, keyed by language, and load on demand (SF-073).
- **RzDateEdit label:** no hard-coded `aria-label` when the input has a label; an `AriaLabel`
  parameter; localized defaults (SF-068).
- Document the range-binding limitation of `RzDateEdit` and point to the provider (SF-014).
- Removes: the event forwarding and `send()` in `DashboardFilters.razor.ts`, the `FlatpickrDe` asset
  key and `ComponentAssetKeys`, the calendar `Locale` option, the locator workaround in the tests.

### W4. Forms (RizzyUI, with Rizzy for SF-044 and SF-047 in W10; 1/3/4, L)

SF-009, SF-013, SF-028, SF-033, SF-045, SF-052, SF-064, SF-070.

- **One naming rule:** every input posts the model path (`Model.Country`), group inputs included
  (SF-009, High). Decision R-2.
- **Inputs without an `EditContext`:** a GET filter form works without cascading one by hand (SF-028).
- **Consumer ids are adopted** (decision D-26): inputs use a supplied `id` and derive `{id}-input` and
  ARIA references from it, so a hand-written `<label for>` works (SF-033).
- **Focus the first invalid field after a 422** as a form-level behavior (an attribute on `EditForm` or
  a component), so every app stops writing `FocusFirstError` (SF-045).
- **RzInputTextArea styles** (SF-052), **RzInputOTP**: `InputAttributes` for the real input (SF-064) and
  its inline style moved to a class (SF-013), **RzSlider**: a model-bound single-value variant (SF-070).
- Removes: explicit `Name=` on group inputs, hand-cascaded `EditContext`s, `FocusFirstError`,
  `SummitClasses.TextArea`, `CheckInForm.razor.js`, the slider's `Name`/`UseIndexedNames` parameters.

### W5. Attributes and events on behavior components (RizzyUI, 1/3/1, M)

SF-015, SF-018, SF-030, SF-067, SF-069.

- **The directive policy (decision R-1, decided as D-24):** `x-data` is reserved on every public
  component and throws when passed as an attribute (one check in `RzComponent`); internal handlers
  move from markup to the modules' `init()`, so caller `x-on:*` runs alongside them (SF-030, SF-069);
  each stateful component dispatches documented `rz:<component>:<event>` events; the other protected
  directives follow the rules in `summit-decisions.md` (R-1, point 6, to confirm); `x-syncprop` is
  forwarded to the element carrying the component's `x-data` (27 components need it) and learns to skip
  RizzyUI ancestors (both accepted). **`AsChild` (D-25):** provenance for attributes `CloneFragment`
  forwards (so the `x-data` check does not throw on `<RzClipboard AsChild><RzButton>`), `CloneFragment`
  throwing on `x-data` in the child, trigger and closer handlers attached by the parent components'
  modules through a marker (16 components), and component-computed bindings winning on the child with a
  Development warning. **Consumer ids (D-26):** adopted on components and `AsChild` children, with
  internal references derived from them (W4 does the inputs, W5 the `AsChild` triggers).
- **`AsChild` on RzButton** (SF-018, High; also fixes the starter template's 404 page in W10).
- **Value-holding components emit semantic change events** (part of D-24) and can post: RzToggle
  (SF-015), menubar checkbox and radio items (SF-067).
- Removes: delegated click handling in `ScheduleBoard.razor.js`, `ScheduleBuilderPage.razor.js`,
  `x-on:click.capture` on the menubar item, `Element="a"` on buttons (optional).

### W6. Command and combobox (RizzyUI, with Tom Select; 1/5/0, M)

SF-007, SF-016, SF-025, SF-040, SF-046, SF-055.

- **RzCommand:** a stable template id so data-driven items render (SF-040, High); `CommandItem.Href`
  (SF-016); `RzCommandDialog` passes `ItemsUrl`/`ServerFiltering` through and offers an opt-in
  shortcut (SF-007); Enter waits for a pending search (SF-025).
- **RzCombobox:** option checkboxes get `tabindex="-1"` and `aria-hidden` (SF-055); Enter after typing
  selects the match, by refreshing before handling Enter or exposing Tom Select's refresh throttle
  (SF-046).
- Removes: `SearchPalette.razor.js`, `CommandNavigation.razor(.js)`, the waits in two browser tests.

### W7. Data table (RizzyUI, 1/4/2, L)

SF-001, SF-048, SF-050, SF-053, SF-054, SF-056, SF-063.

- **State transport** (SF-001, High): a `StateInputName` that renders one JSON input kept in sync, and
  a model binder to `RzDataTableInitialState`. Decision R-5.
- **htmx in rows:** `htmx.process` after each render (SF-048). **Ids in rows:** no generated ids in
  row templates, or per-row ids (SF-054).
- **Sort buttons named after their column**, localized (SF-053). **RzTable's scroll container** is
  focusable with a name (SF-063).
- **Less markup without giving up the headless model** (SF-056): owner decision D-22 keeps RzDataTable
  headless, with the developer authoring the structure, so the answer is not a default rendering but
  composable helpers (a header row and a cell helper that cover sorting, selection and flex rendering)
  and copyable recipes in the docs; document the row objects and casing (SF-050).
- Removes: most of `AttendeeTableState` (about 85 lines), `aria-labelledby` on sort toggles, the
  `tabindex` on tables, the x-for annotation in `expectUniqueIds`, and most of `AttendeeTable.razor`.

### W8. Accessibility defaults (RizzyUI, 0/11/8, M)

SF-022, SF-023, SF-026, SF-029, SF-031, SF-035, SF-036, SF-037, SF-038, SF-065, SF-066, SF-071, and from
the docs scan SF-075, SF-076, SF-077, SF-078, SF-079, SF-080, SF-084.

Mostly one-line default changes, each proven by W0's axe run turning green for that component:
alert live regions only when asked (SF-022), icons without fixed ids (SF-023, with Blazicons),
`FieldError` without empty alerts (SF-026), group legends from `[Display]` (SF-029), avatar names from
the image (SF-031), AuroraText role and inline style (SF-035), the status palette's contrast (SF-036),
the dropzone's name (SF-037), `listitem` on items (SF-038), alert text colors (SF-065), RzIndicator's
role (SF-066), a minimum target size for RzClipboard (SF-071); from the docs scan, sidebar groups that
reference a missing label (SF-075, on every docs page), popover labels on a role-less wrapper (SF-076),
calendar contrast (SF-077), the built-in themes' primary and muted text contrast (SF-078, with a unit
test over the token pairs), an empty command listbox (SF-079), the sidebar preview to triage (SF-080), and Markdown code blocks that
scroll but cannot take focus (SF-084).

- Removes: the per-use `AriaLabel`, `role` and class fixes in Summit, the status colors in
  `summit.json`, the mdi and empty-id annotations in `expectUniqueIds`.

### W9. Head, assets, culture and runtime (RizzyUI, 2/1/2, M)

SF-012, SF-034, SF-039, SF-060, SF-072.

- **RzThemeProvider without `HeadContent`** (SF-034, High).
- **Invariant culture for every number written into markup** (SF-060, High): fix RzNumberTicker, then
  audit `data-*` and JSON output across components, and add a de-DE rendering test per component that
  writes numbers.
- **A local-asset option** for the widget libraries (SF-012), so apps need neither Summit's
  `SelfHostedAssets` nor a CDN.
- **Event buffering for lazily loaded components** (SF-039).
- **npm package module type** (SF-072).
- Removes: `TrackStyles` placement in `<head>`, whole-euro tickers, `SelfHostedAssets` (possibly).

### W10. Rizzy and the starter template (Rizzy and RizzyUI/templates; 3/3/3, M)

SF-017, SF-020, SF-021, SF-024, SF-041, SF-042, SF-043, SF-044, SF-047.

Rizzy repository (`../Rizzy`):

- `RzModelStateProvider` resolves indexed keys such as `Model.Items[0].Name` (SF-044, High; today
  `Components/Form/RzModelStateProvider.cs` returns early on `[`).
- `RzInputRadioBase` renders no `id=""` (SF-047; `Components/Form/RzInputRadioBase.cs` defaults `Id` to
  empty and always adds it).
- `HtmxResponse` setters become no-ops outside htmx requests (decision R-4) (SF-043).
- An absolute default `ClientScriptUrl` (SF-017; `Configuration/RizzyConfig.cs`).
- A built-in server-error toast for `rz:server-error`, shared with RizzyUI (SF-041).
- Docs: `lang` and other `<html>` attributes after boosted navigation (SF-024).

Starter template (`templates/content/RizzyUI.Starter`, this repository):

- `hx-boost:inherited="true"` on `<body>` (SF-021, High).
- Status code pages that leave htmx redirects and empty 4xx responses alone (SF-020, High), or Rizzy's
  fix for it.
- npm and Tailwind targets `BeforeTargets="BeforeBuild"` (SF-042).
- The 404 page's `RzButton AsChild` once W5 adds it, or `Element="a"` until then.
- `eng/template-test.sh` gains browser checks for boosted navigation, an expired session on an htmx
  request and a nested URL.

Removes from Summit: `IndexedModelStateProvider`, `HtmxResponses`, `StatusPages`, the absolute script
URL, `AppNotifications` (after SF-041), the empty-id annotation.

### W11. Documentation and closed-by-design items (RizzyUI docs, 0/5/3, M)

SF-006, SF-008, SF-019, SF-027, SF-051, and from the docs scan SF-081, SF-082, SF-083.

- Document that server toasts need an htmx request (SF-006) and that htmx 4 reports no upload progress
  (SF-008), with the patterns Summit used.
- Fix the navigation menu example's nested anchors (SF-019); add pages for RzEmbeddedPreview,
  RzFormSection, RzSearchButton, RzDarkModeToggle and RzIdScope (SF-027).
- D-24: a new Interactivity page, "Parent property synchronization" (state on an ancestor, `x-syncprop`
  on a RizzyUI component, the nested case, semantic events as the notification-only alternative), and
  on every component page its events and protected directives. Written together with W5.
- SF-051 was Summit's own bug, already fixed: mark it closed.
- From the docs scan: the docs stylesheet's contrast (SF-081), example markup that teaches inaccessible
  patterns (SF-082), and examples that only work without a CSP (SF-083). Each fix removes entries from
  `docs-scan-known.ts`.

## 3. Decisions needed before the dependent work starts

The full analysis of each decision (current behavior, options, implications, benefits, risks) is in
[summit-decisions.md](summit-decisions.md).

| Id | Question | Recommendation | Blocks |
|---|---|---|---|
| R-1 | Attribute policy: replace (today), merge, or merge plus a Development warning? | **Decided 2026-11-21 (D-24, D-25, D-26):** `x-data` reserved and enforced, handlers in code, semantic events, `x-syncprop` for parent state, `AsChild` rules, consumer ids adopted. Open: the rules for the other protected directives (proposed in `summit-decisions.md`, R-1 point 6). | W5, part of W4 |
| R-2 | Input names: always the model path (`Model.Country`), breaking the bare names group inputs post today? | Yes, before 1.0, with a CHANGELOG migration note. | W4 |
| R-3 | Default dialog close event: keep the global `rz:dialog-close`, or scope it to the instance (`rz:dialog-close:{id}`)? | Scope it; keep the global event as an explicit "close all" that apps opt into. | W1 |
| R-4 | `HtmxResponse` outside htmx requests: throw (today) or no-op? | No-op, with a Debug log. Throwing protects against a mistake that the no-op makes harmless. | W10 (Rizzy) |
| R-5 | DataTable state transport: one JSON input or one input per field? | One JSON input plus a model binder: one name to include, no prefix collisions (SF-051). | W7 |
| R-6 | Calendar provider form names: `Name` with a separator, or `StartName`/`EndName`? | `StartName`/`EndName`: they bind to two typed properties without parsing. | W3 |
| R-7 | Release vehicle: fix the High findings in preview.4, or cut a dedicated preview? | preview.4 carries W0 and the High findings (section 4, M1); later milestones ship as they finish. | Section 4 |

## 4. Milestones

| Milestone | Contents | Exit criteria |
|---|---|---|
| **M0** | W0 | Axe and id checks run over the docs in CI with the known-defect list |
| **M1, ships broken today** (preview.4) | SF-074 (W1), W2, SF-057 and SF-073 (W3), SF-060 and SF-034 (W9), SF-040 (W6), SF-018 (W5), SF-052, SF-053, SF-065, SF-068; the template part of W10 | Every High finding in RizzyUI fixed; Summit's ledger loses about 250 lines; Summit green in Package mode |
| **M1-Rizzy** (Rizzy preview.4) | The Rizzy part of W10 | Rizzy released; RizzyUI bumps the package; Summit drops `IndexedModelStateProvider`, `HtmxResponses`, `StatusPages` |
| **M2, consistency** (1.0) | The rest of W1, W3, W4, W5, W6, W8, W9 | Decisions R-1 to R-6 implemented; W0's known-defect list empty |
| **M3, data table** (1.0 or 1.1) | W7 | Summit's attendee page without `AttendeeTableState` state glue |
| **M4, docs** | W11 | Every component has a docs page and its findings link to it |

Dependencies: W0 first, since it is how M1 and M2 prove their accessibility fixes. W5's attribute
policy (R-1) before W4's consumer-id work. W10's Rizzy part can run in parallel with everything in
RizzyUI.

## 5. Working across the two repositories

- Rizzy fixes land in `../Rizzy` with their own tests and release. RizzyUI then bumps its Rizzy package
  reference (and the template's) in one pull request that also deletes the Summit workarounds those
  fixes cover, with Summit's suite as the proof.
- Where a RizzyUI fix needs a Rizzy change (SF-047's radio id, SF-041's toast), the Rizzy change ships
  first and the RizzyUI side follows the bump.

## 6. Measuring progress

- The findings index: count of `Open` per severity, after every merged pull request.
- The integration-code ledger: compensating lines, from about 570 today toward 0 (some application
  code, such as the HTML chart legend, may stay by choice and move to the application-specific table).
- W0's known-defect list for the docs, toward empty.
- Summit's browser suite stays green in Package mode on every pull request; the release gate holds.

## 7. Risks

| Risk | Mitigation |
|---|---|
| The attribute policy (R-1) changes behavior apps rely on | Ship it with the Development warning first and a CHANGELOG entry; Summit and the docs fixtures cover the common cases |
| Renaming inputs (R-2) breaks posted forms in existing apps | One release with a migration note; a Development warning when a bare name is posted |
| Tom Select and flatpickr fixes depend on third-party behavior | Fix in RizzyUI's integration code (render hooks, options), not by patching the libraries; pin versions |
| Removing a workaround hides a partial fix | The workaround goes only when Summit's suite passes without it, in both builds and on the phone project |
| Scope creep in W7 | Ship the state transport, row processing and ids first; the helpers for SF-056 are their own pull request, within D-22's headless model |

## Appendix: every finding and its workstream

| Finding | Severity | Component | Owner | Workstream |
|---|---|---|---|---|
| SF-001 | High | RzDataTable | RizzyUI | W7 |
| SF-002 | Medium | RzSheet | RizzyUI | W1 |
| SF-003 | Medium | RzDialog | RizzyUI | W1 |
| SF-004 | Medium | RzDialog docs | RizzyUI docs | W1 |
| SF-005 | Medium | RzChart | RizzyUI | W2 |
| SF-006 | Medium | RzToast | RizzyUI | W11 |
| SF-007 | Medium | RzCommandDialog | RizzyUI | W6 |
| SF-008 | Low | RzFileInput | RizzyUI, htmx | W11 |
| SF-009 | High | Forms | RizzyUI, Rizzy | W4 |
| SF-010 | Low | RzSidebar | RizzyUI | W1 |
| SF-011 | Low | RzSidebar | RizzyUI | W1 |
| SF-012 | Medium | Asset URLs | RizzyUI, Rizzy | W9 |
| SF-013 | Low | RzInputOTP | RizzyUI | W4 |
| SF-014 | Low | RzDateEdit | RizzyUI | W3 |
| SF-015 | Low | RzToggle | RizzyUI | W5 |
| SF-016 | Medium | RzCommand | RizzyUI | W6 |
| SF-017 | Medium | Asset URLs | Rizzy, template | W10 |
| SF-018 | High | RzButton | RizzyUI, template | W5 |
| SF-019 | Medium | RzNavigationMenu docs | RizzyUI docs | W11 |
| SF-020 | High | Rizzy + starter | Rizzy, template | W10 |
| SF-021 | High | Starter template | Template | W10 |
| SF-022 | Medium | RzAlert | RizzyUI | W8 |
| SF-023 | Medium | Icons | RizzyUI, Blazicons | W8 |
| SF-024 | Low | htmx boost | htmx, Rizzy docs | W10 |
| SF-025 | Medium | RzCommand | RizzyUI | W6 |
| SF-026 | Low | FieldError | RizzyUI | W8 |
| SF-027 | Medium | Docs | RizzyUI docs | W11 |
| SF-028 | Medium | Forms | RizzyUI, Rizzy | W4 |
| SF-029 | Medium | RzCheckboxGroup | RizzyUI | W8 |
| SF-030 | Medium | Alpine attributes | RizzyUI | W5 |
| SF-031 | Medium | RzAvatar | RizzyUI | W8 |
| SF-032 | Low | RzSheet | RizzyUI | W1 |
| SF-033 | Low | Inputs | RizzyUI, Rizzy | W4 |
| SF-034 | High | RzThemeProvider | RizzyUI | W9 |
| SF-035 | Low | RzAuroraText | RizzyUI | W8 |
| SF-036 | Medium | Status colors | RizzyUI | W8 |
| SF-037 | Medium | RzFileInput | RizzyUI | W8 |
| SF-038 | Medium | RzItemGroup | RizzyUI | W8 |
| SF-039 | Low | Lazy components | RizzyUI | W9 |
| SF-040 | High | RzCommand | RizzyUI | W6 |
| SF-041 | Low | Error feedback | Rizzy, RizzyUI | W10 |
| SF-042 | Medium | Build | RizzyUI, template | W10 |
| SF-043 | Medium | HtmxResponse | Rizzy | W10 |
| SF-044 | High | RzModelStateProvider | Rizzy | W10 |
| SF-045 | Medium | Forms | RizzyUI | W4 |
| SF-046 | Medium | RzCombobox | RizzyUI, Tom Select | W6 |
| SF-047 | Low | RzRadioGroup | Rizzy, RizzyUI | W10 |
| SF-048 | Medium | RzDataTable | RizzyUI | W7 |
| SF-049 | Low | RzSidebar, RzTable | RizzyUI | W1 |
| SF-050 | Low | RzDataTable | RizzyUI | W7 |
| SF-051 | Low | Attendees | Summit | W11 |
| SF-052 | Medium | RzInputTextArea | RizzyUI | W4 |
| SF-053 | Medium | RzDataTable | RizzyUI | W7 |
| SF-054 | Medium | RzDataTable, RzTable | RizzyUI | W7 |
| SF-055 | Medium | RzCombobox | RizzyUI, Tom Select | W6 |
| SF-056 | Medium | RzDataTable | RizzyUI | W7 |
| SF-057 | High | RzCalendar, RzPopover | RizzyUI | W3 |
| SF-058 | Medium | RzCalendarProvider | RizzyUI | W3 |
| SF-059 | Medium | RzChart | RizzyUI | W2 |
| SF-060 | High | RzNumberTicker | RizzyUI | W9 |
| SF-061 | Low | RzChart | RizzyUI | W2 |
| SF-062 | High | RzChart | RizzyUI | W2 |
| SF-063 | Low | RzTable | RizzyUI | W7 |
| SF-064 | Low | RzInputOTP | RizzyUI | W4 |
| SF-065 | Medium | RzAlert | RizzyUI | W8 |
| SF-066 | Low | RzIndicator | RizzyUI | W8 |
| SF-067 | Medium | RzMenubar | RizzyUI | W5 |
| SF-068 | Medium | RzDateEdit | RizzyUI | W3 |
| SF-069 | Medium | RzMenubar | RizzyUI | W5 |
| SF-070 | Low | RzSlider | RizzyUI | W4 |
| SF-071 | Low | RzClipboard | RizzyUI | W8 |
| SF-072 | Low | Packaging | RizzyUI (npm) | W9 |
| SF-073 | Medium | RzCalendar, RzDateEdit | RizzyUI | W3 |
| SF-074 | High | RzSheet | RizzyUI | W1 |
| SF-075 | Medium | RzSidebar | RizzyUI | W8 |
| SF-076 | Low | RzPopover | RizzyUI | W8 |
| SF-077 | Medium | RzCalendar | RizzyUI | W8 |
| SF-078 | Medium | Default theme | RizzyUI | W8 |
| SF-079 | Low | RzCommand | RizzyUI | W8 |
| SF-080 | Low | RzSidebar preview | RizzyUI docs | W8 |
| SF-081 | Medium | Docs site styling | RizzyUI docs | W11 |
| SF-082 | Medium | Docs examples | RizzyUI docs | W11 |
| SF-083 | Low | Docs examples (CSP) | RizzyUI docs | W11 |
| SF-084 | Low | Markdown code blocks | RizzyUI | W8 |

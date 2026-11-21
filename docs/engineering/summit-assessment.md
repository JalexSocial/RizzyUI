# Summit: final engineering assessment

Summit is a fictional developer conference built as a real application on Rizzy 6, htmx 4 and RizzyUI
1.0.0-preview.4: a public site (home, schedule, speakers, session pages, tickets, help), a four-step
checkout, and an organizer area (dashboard, attendees, check-in desk, schedule builder, settings).
It was built to show the libraries off and, mainly, to test them under real use. This document closes
that work. The detail lives in three companion files:

- [summit-demo-plan.md](summit-demo-plan.md): the plan, decisions D-1 to D-12, scenarios S-01 to S-16;
- [summit-findings.md](summit-findings.md): 74 findings (SF-001 to SF-074) with owner, status,
  workaround, library fix and regression test, the integration-code ledger and the recurring patterns;
- [summit-coverage.md](summit-coverage.md): how deeply each of 82 components is exercised.

## 1. Verdict

**RizzyUI is ready for adoption by teams building server-rendered htmx applications who accept a
preview library, budget for a thin layer of compensating code, and test in a browser. It is not yet
ready to be recommended without those caveats.**

- The core model works and holds up under a real application: server-rendered components, htmx swaps
  (including out-of-band and lazy fragments), Alpine behavior, code-behind modules in JavaScript and
  TypeScript, the strict-CSP build, a custom theme loaded from JSON, German formats and strings, phone
  layouts, and packaging (Summit passes its whole browser suite against the packed NuGet and npm
  packages, published in `Production`).
- Every workflow Summit needed could be built. None was dropped and no RizzyUI component was replaced
  by a custom one to make a test pass.
- The cost is about **570 lines of compensating code** (C#, JavaScript, TypeScript and attributes)
  against about **160 lines of application-specific client code**: for every line of behavior the
  product wanted, Summit wrote three to work around the library. Most of it clusters in a few
  components (DataTable, charts, calendar, command, forms), so a handful of fixes removes most of it.
- Twelve findings are rated High. All twelve have working workarounds in Summit; none blocks adoption,
  but several (SF-057, SF-062, SF-074, SF-060) would ship broken behavior in an application that did not
  test in a browser, in dark mode, in a second language and with a keyboard.

## 2. What was built and how it is tested

| Area | Pages and flows | Notable integrations |
|---|---|---|
| Public site | Home (lazy stats, countdown), schedule (tabs, server filters, client filters, agenda switches on 95 forms), speakers (htmx search and paging), session pages, tickets, help (upload form) | Boosted navigation, out-of-band header count, `intersect once` fragments, search palette (RzCommand with a JSON endpoint) |
| Checkout | Tickets, attendees (a list-bound form with comboboxes), payment, confirmation | 422 round trips with focus on the first error, OTP discount code, out-of-band summary and step indicator, pushed URLs |
| Dashboard | Charts, key figures, capacity, recent orders, date range and filters | One request fills five regions; RzCalendar range in a popover; theme changes |
| Attendees | 600-row RzDataTable, server filters, editor sheet, bulk actions | Table state carried through server rebuilds; teleported sheet with a 422 inside |
| Check-in desk | Badge entry, result, live counter, latest check-ins | `rz:inputotp:onchange` as an `hx-trigger`, polling with `hx-sync`, prepended rows |
| Schedule builder | Menubar, session list, editor, delete, publish all | RzDateEdit, RzSlider, RzInputColor, RzSwitch; out-of-band list; menubar checkbox and radio items |
| Settings | Five lazy tabs: general, appearance, API keys, audit log, developer | `HX-Refresh` theme switch, a dialog whose body is replaced by a post, `HX-Trigger` payloads in RzEventViewer |

Tests:

- **Browser (Playwright):** 82 tests per desktop project in 12 spec files, run against the standard
  and the strict-CSP build, plus the phone project (Pixel 7) for tests tagged `@mobile`: 175 executed per
  run. Every test fails on page errors, console errors, Alpine expression errors, unexpected HTTP errors,
  enforced CSP violations and any request to another host. Axe (WCAG 2.2 A/AA), a unique-id check and a
  dangling-ARIA check run on every page and inside the main workflows. No retries.
- **HTTP (xUnit, WebApplicationFactory):** 22 tests for seeding, status codes, htmx headers, CSP and
  sign-in; every controller route must be in the browser suite's axe list.
- **Code-behind units:** 3 tests with `@jalexsocial/rizzyui/testing` under happy-dom (a TypeScript
  module included).
- **Modes:** CI runs the HTTP tests against the repository projects and the browser suite against the
  packed packages (`eng/summit-test.sh`); the release workflow is gated on the same script; a nightly
  run uses RizzyUI's CDN asset defaults instead of Summit's self-hosted copies.
- **Runtime:** the CI job (pack, HTTP tests, publish, two servers, 175 browser tests) takes about 7.5
  minutes on a GitHub runner, inside the 10-minute budget in the plan; no sharding was needed.

## 3. Coverage

| Level | Components | Meaning |
|---|---:|---|
| 4 Integration-tested | 50 | A browser test fails if the behavior breaks in a real workflow, on both builds |
| 3 In combination | 6 | Used together with other components or htmx, checked by hand |
| 2 Functionally exercised | 2 | Its behavior is used, checked by hand |
| 1 Rendered only | 22 | On a page and scanned by axe; little or no behavior to drive |
| 0 Not exercised | 2 | `RzColorPickerProvider`, `RzIdScope` |

Most level-1 components are presentational (badge, separator, card, heading, link, text animations,
aspect ratio) and have nothing further to exercise. The gaps worth closing are the desktop navigation
menu, tooltips (hover), copy buttons (clipboard permission in Playwright) and the accordion.

## 4. Findings by severity, kind and owner

| | High | Medium | Low | Total |
|---|---:|---:|---:|---:|
| Findings | 12 | 38 | 24 | 74 |

| Kind | Count | | Owner | Count |
|---|---:|---|---|---:|
| Bug | 29 | | RizzyUI (alone) | 51 |
| DX | 21 | | RizzyUI with Rizzy, Tom Select, Blazicons or htmx | 12 |
| Gap | 12 | | RizzyUI docs | 3 |
| Accessibility | 9 | | Rizzy, the starter template | 6 |
| Docs | 3 | | Summit (its own bug) | 1 |

Application status: 60 work through a workaround or a design choice, 9 still affect users (none
High), 1 was fixed in Summit, 2 are documentation-only, 1 is reported but not enforced (style-src).
Library status: all open; nothing was fixed in the libraries during this work, as the owner guidance
asked.

### The twelve High findings

| Id | Component | Defect | Workaround in Summit |
|---|---|---|---|
| SF-001 | RzDataTable | Client-side only; no way to carry table state into a request | `AttendeeTableState` mirrors state into hidden inputs |
| SF-009 | Forms | Field names differ between components (`Country` vs `Model.Country`) | Explicit `Name` on group inputs |
| SF-018 | RzButton | No `AsChild`; the template and docs nest a link in a button | `Element="a"` |
| SF-020 | Rizzy, template | Status code pages swallow `HX-Redirect` and turn 400s into 404s | `StatusPages.cs` |
| SF-021 | Template | `<body hx-boost>` boosts nothing in htmx 4 | `hx-boost:inherited` |
| SF-034 | RzThemeProvider | Any other `HeadContent` removes the theme | Theme styles placed in `<head>` directly |
| SF-040 | RzCommand | Data-driven items never render (empty template id) | A code-behind sets the id |
| SF-044 | RzModelStateProvider | Errors on list items are never shown | `IndexedModelStateProvider` |
| SF-057 | RzCalendar, RzPopover | The documented range-popover pattern is disconnected: events never reach the provider | Event forwarding in the code-behind |
| SF-060 | RzNumberTicker | Decimals render as 0 under de-DE | Whole numbers |
| SF-062 | RzChart | Throws on theme change; leaks Chart.js instances on swap | Raw-instance teardown and reload |
| SF-074 | RzSheet | Trigger-opened sheets do not take or trap focus | `SheetFocus` moves focus in |

### Root causes (from the recurring patterns in the findings report)

1. **Computed attributes silently override the developer's** (SF-018, SF-030, SF-033, SF-040, SF-069).
   Five findings and the subtlest workarounds (`x-on:click.capture`). One policy fixes them all.
2. **Forms: naming, `EditContext` and validation plumbing** (SF-009, SF-028, SF-033, SF-044, SF-045,
   SF-070). Inputs choose their own names, need an `EditContext`, lose list-item errors, and do not
   move focus to errors.
3. **The server cannot drive overlays consistently** (SF-002, SF-003, SF-032, SF-074). Sheets have no
   events; dialog close events are global; focus handling differs by how an overlay opened.
4. **Lazy loading leaks into behavior** (SF-025, SF-039, and the CI flake in SF-046).
5. **Accessibility defaults** (15 findings: SF-022, 023, 026, 029, 031, 035 to 038, 052, 053, 063, 065,
   066, 071). Generic default names, live regions on static content, contrast, target size. Axe over the
   docs site would catch most.
6. **htmx 4 behavior the template and Rizzy do not account for** (SF-017, SF-020, SF-021, SF-024).
7. **Who owns the `<head>`** (SF-012, SF-017, SF-034).
8. **Server components inside client templates** (SF-048, SF-050, SF-054, SF-056): the DataTable.
9. **Teleported overlays break DOM assumptions** (SF-057; RizzyUI already has `htmxTeleportBridge`
   for htmx, but not for its own events).
10. **Third-party instances in reactive state, and culture in machine-readable output** (SF-060,
    SF-062, SF-073).

## 5. Outstanding defects versus workarounds

Every High and most Medium findings work in Summit through code that a fix would delete. What still
affects users of Summit (no workaround possible or reasonable):

| Id | Severity | Effect |
|---|---|---|
| SF-023 | Medium | Material Design icons repeat fixed ids on most pages (invalid HTML) |
| SF-025, SF-046 | Medium | Fast typing then Enter picks the previously highlighted item (command palette, combobox) |
| SF-054 | Medium | Components in DataTable row templates repeat their ids in every row |
| SF-055 | Medium | Tab out of a multiple combobox drops focus to `<body>` |
| SF-068 | Medium | Date inputs are announced as "Select date", not their label |
| SF-026, SF-039, SF-047 | Low | Empty alert regions per field; very early keypresses lost; `id=""` on radios |

The workarounds themselves are isolated (each in a named file or a commented attribute that cites its
finding) and listed in the ledger, so removing them after a library fix is mechanical.

## 6. Recommended corrections, in priority order

**Now (before 1.0): correctness and accessibility that ship broken by default**

1. RzSheet: activate the focus scope after the panel is visible (SF-074); add open/close events (SF-002).
2. RzChart: keep the Chart.js instance out of reactive state; re-resolve colors on theme change; set the
   chart `type` (SF-062, SF-005, SF-059); size the base element (SF-061).
3. RzCalendar/provider: find the provider through Alpine scope, not bubbling (SF-057); default to the
   request culture and ship flatpickr locales (SF-073); add form names to the provider (SF-058).
4. Invariant culture for every number written into `data-*` or JSON (SF-060), with a review rule.
5. RzModelStateProvider: indexed keys (SF-044); RzCommand: template id and item links (SF-040, SF-016).
6. RzThemeProvider without `HeadContent` (SF-034); RzButton `AsChild` and the template fixes (SF-018,
   SF-020, SF-021, SF-042).
7. The accessibility defaults (pattern 5), starting with RzDateEdit's label (SF-068), sort-button names
   (SF-053), alert colors (SF-065) and the RzTextArea styles (SF-052).

**Next (1.x): developer experience**

8. One attribute policy: merge event handlers and ids, warn in Development when a consumer attribute is
   replaced (pattern 1).
9. One form model: consistent names, inputs without a required `EditContext`, focus to the first error
   after a 422, a model-bound slider (pattern 2).
10. DataTable: a state transport (SF-001), `htmx.process` after rendering rows (SF-048), per-row ids
    (SF-054), a default rendering (SF-056), documented row objects (SF-050).
11. Menubar events (SF-067), RzInputOTP input attributes (SF-064), a built-in server-error toast (SF-041).

**Later**

12. Event buffering for lazily loaded components (SF-039), docs pages for the undocumented components
    (SF-027), a CDN-free default asset option (SF-012).

## 7. API simplifications

- **`AsChild` everywhere a link may be the element** (RzButton today), instead of `Element="a"`.
- **Per-instance overlay events**: `RzSheet` and `RzDialog` both with `EventTriggerName`/`CloseEventName`,
  scoped by default to the instance id, plus an `InitialFocus` selector.
- **`Name` (or `StartName`/`EndName`) on non-input components that hold a value**: calendar provider,
  menubar radio groups, toggles, slider. Hidden inputs kept in sync make them htmx form participants
  without script.
- **`RzDataTable` state as a form**: `StateInputName` rendering one JSON input, and a model binder that
  maps back to `RzDataTableInitialState`.
- **Default culture from the request** for every component with a `Locale` or `Culture` parameter.
- **`InputAttributes` on composite inputs** (OTP, date edit, combobox) for attributes meant for the
  real input (`autofocus`, `autocapitalize`, `enterkeyhint`, `aria-*`).
- **A `HtmxResponse` that is a no-op outside htmx requests** (SF-043), so actions serving both direct
  loads and htmx do not need guards.

## 8. Regression tests for the library repositories

Each is a test that would have failed before the corresponding fix; most are a few lines in the
existing RizzyUI browser fixtures or bUnit tests.

| Test | Catches |
|---|---|
| Axe (WCAG 2.2 AA) and a unique-id check over every docs page | Pattern 5, SF-023, SF-053, SF-054 |
| Open a sheet with its trigger; focus is inside and Tab cannot leave | SF-074 |
| Docs "Range Popover": pick two days, the label changes, `range-complete` fires on the provider | SF-057 |
| Toggle the theme on a page with a chart, then replace the chart: no page errors, new colors | SF-062, SF-005 |
| A doughnut chart's legend has one entry per label | SF-059 |
| bUnit under de-DE: `RzNumberTicker Value=1.5` renders `data-value="1.5"` | SF-060 |
| `RzModelStateProvider` shows an error for `Model.Items[0].Name` | SF-044 |
| `RzCommand` with `Items` and `CommandItemTemplate` renders the items | SF-040 |
| A page with two `HeadContent` blocks keeps the theme variables | SF-034 |
| A DataTable row with `hx-get` issues the request | SF-048 |
| A consumer `x-on:click` on `MenubarItem`/`RzToggle` still runs | SF-030, SF-069 |
| `RzInputTextArea` output contains the shared input classes | SF-052 |
| Starter template: boosted navigation, an expired session on an htmx request, a nested URL, all in a browser | SF-017, SF-020, SF-021 |
| A clean `dotnet build` of the template with esbuild code-behind | SF-042 |

Summit itself is the broadest regression test: it now gates releases, so a library change that breaks
any of its 175 browser tests stops the release.

## 9. Prioritized roadmap

| Horizon | Work | Removes from Summit |
|---|---|---|
| Before 1.0 | Section 6, items 1 to 7; the regression tests above; axe over the docs | About 250 lines of compensating code (`DashboardFilters` almost entirely, `SheetFocus`, `IndexedModelStateProvider`, `SummitClasses`, theme placement, status pages) |
| 1.1 | Attribute policy, form model, overlay events | About 150 lines (`FocusFirstError`, explicit names, `HtmxResponses`, capture handlers) |
| 1.2 | DataTable state transport, row processing, default rendering | About 100 lines (`AttendeeTableState` mostly) and 100 lines of table markup |
| Ongoing | Keep Summit current with each release; add a scenario for every new component | n/a |

## 10. Adoption readiness by area

| Area | Readiness | Notes |
|---|---|---|
| Rendering, layout, theming | Ready | Custom JSON theme, three themes switchable at runtime, dark mode. Mind SF-034 and SF-036. |
| htmx integration (swaps, OOB, lazy, history) | Ready | Worked everywhere, including teleported content. Rizzy's response helpers are good; SF-043 is friction. |
| Strict CSP | Ready | The whole suite passes on the CSP build with nonces and `strict-dynamic`; `style-src` stays report-only (SF-013, SF-035). |
| Forms and validation | Usable with care | Names, `EditContext`, list errors and focus need app code (pattern 2). |
| Overlays (dialog, sheet, popover, menus) | Usable with care | Rich and accessible once open; opening and closing from the server and focus need attention (pattern 3, SF-074). |
| Data table | Usable with care | Powerful client-side; heavy markup and no server state (pattern 8). |
| Charts | Not ready without workarounds | Theme changes and swaps break them (SF-062). |
| Date and calendar | Usable with care | Range in a popover and other languages need the workarounds (SF-057, SF-073). |
| Accessibility | Usable with care | Many defaults need correcting by hand; the components themselves are keyboard-operable. |
| Internationalization | Usable with care | RizzyUI's own strings are translated; numbers in markup and date pickers are not (SF-060, SF-073). |
| Code-behind (JS and TS) | Ready | Fingerprinted, bundled, testable with the testing helper; lifecycle reliable. |
| Packaging and publishing | Ready | NuGet and npm packages publish and run in `Production`; SF-072 is cosmetic. |

## 11. What this exercise showed about testing the libraries

Most findings share one property: they pass a single-render, English, mouse-driven, light-mode
demo, and fail as soon as an application swaps content, changes theme or language, uses the keyboard,
or composes two components. The docs site is that kind of demo. The most valuable addition to the
library's own test strategy is therefore not more unit tests but a few browser scenarios that do those
things, plus axe and an id check over every docs page. Summit provides them today and gates releases on
them; the library would benefit from owning smaller versions of the same checks next to each component.

# Summit findings: what building a real app on RizzyUI turned up

Summit (`samples/Summit`, plan in [summit-demo-plan.md](summit-demo-plan.md)) is built partly to
battle-test Rizzy and RizzyUI. This log records everything that got in the way while building it:
bugs, missing features, rough developer experience, documentation gaps and accessibility issues. It
is written as things happen, not reconstructed at the end.

Each entry says what happened, how Summit worked around it, and what would fix it in the library.
Entries from the planning pass (before any code) are marked **(planning)**.

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
| SF-001 | RizzyUI | RzDataTable | Gap | High | Client-side only: no way to carry table state into a request, no row update | Not reached yet (attendees page) | Open | None yet |
| SF-002 | RizzyUI | RzSheet | Gap | Medium | No open/close event names (RzDialog has both); the server cannot close a sheet | Works (workaround) | Open | e2e: schedule details sheet (workflow) |
| SF-003 | RizzyUI | RzDialog | DX | Medium | The default close event is global: closing one dialog from the server closes all of them | Not reached yet | Open | None yet |
| SF-004 | RizzyUI docs | RzDialog docs | Docs | Medium | Docs name `rz:modal-close` and `Constants.Events.ModalClose`, which do not exist | n/a | Open | n/a |
| SF-005 | RizzyUI | RzChart | Bug | Medium | Colors from CSS variables are not re-read on theme change | Not reached yet (dashboard) | Open | None yet |
| SF-006 | RizzyUI | RzToast | DX | Medium | Server toasts are silently dropped on non-htmx requests and redirects | Works (designed around) | Open | e2e: agenda toast (workflow) |
| SF-007 | RizzyUI | RzCommandDialog | Gap | Medium | Does not pass `ItemsUrl`/`ServerFiltering` through; no Ctrl+K shortcut | Works (workaround) | Open | e2e: search palette (workflow) |
| SF-008 | RizzyUI, htmx | RzFileInput | Gap | Low | No upload progress (and htmx 4's `fetch` reports none) | Works (designed around) | Open | e2e: contact form (workflow) |
| SF-009 | RizzyUI, Rizzy | Forms | DX | High | Field names differ between components (`Country` vs `Model.Country`) | Works (workaround) | Open | e2e: contact upload, schedule filters (workflow) |
| SF-010 | RizzyUI | RzSidebar | DX | Low | Persisted collapse state is not read on the server: the sidebar flashes open | Works (workaround) | Open | None |
| SF-011 | RizzyUI | RzSidebar | DX | Low | `ChildContent` is rendered twice (mobile and desktop), so fixed ids inside it collide | Works (designed around) | Open | e2e: unique-id check (defect) |
| SF-012 | RizzyUI, Rizzy | Asset URLs | DX | Medium | Widget libraries default to jsDelivr: CI depends on a CDN, strict `style-src` blocks the calendar CSS | Works (workaround) | Open | e2e: external-request guard (defect) |
| SF-013 | RizzyUI | RzInputOTP | Bug | Low | Inline `style` attribute breaks a strict `style-src` | Reported, not enforced | Open | CSP report-only annotations |
| SF-014 | RizzyUI | RzDateEdit | Gap | Low | `Mode.Range` cannot bind to the single `DateTime?` it requires | Not reached yet (dashboard) | Open | None yet |
| SF-015 | RizzyUI | RzToggle | DX | Low | Posts nothing; filters built from toggles need custom code | Works (workaround) | Open | e2e: level toggles (workflow) |
| SF-016 | RizzyUI | RzCommand | Gap | Medium | Command items have no link or href: Enter on an item does nothing unless the app handles `rz:command:execute` | Works (workaround) | Open | e2e: quick actions, search palette (workflow) |
| SF-017 | Rizzy, template | Asset URLs | DX | Medium | `Assets[...]` and Rizzy's default `ClientScriptUrl` are relative; without `<base href="/">` styles and scripts 404 on nested URLs, and with it in-page links break | Works (workaround) | Open | Summit.Tests: absolute asset URLs (defect) |
| SF-018 | RizzyUI, template | RzButton | Bug | High | No `AsChild`: `<RzButton AsChild><a>` renders a link inside a button (invalid, two tab stops). The starter template's 404 page and the docs do this | Works (workaround) | Open | axe nested-interactive (defect) |
| SF-019 | RizzyUI docs | RzNavigationMenu docs | Docs | Medium | The docs' `ListItem` example puts `RzLink` inside `NavigationMenuLink`, which already renders an `<a>`: nested anchors | Works (workaround) | Open | e2e: unique-id check (defect) |
| SF-020 | Rizzy, template | Rizzy + starter | Bug | High | `UseStatusCodePagesWithReExecute` (starter template) swallows `UseHtmxRedirects`' 401 + `HX-Redirect`, and turns every empty 4xx (antiforgery 400, 401, 405) into "Page not found" with status 404 | Works (workaround) | Open | Summit.Tests: htmx redirect, antiforgery 400 (defect) |
| SF-021 | Template | Starter template | Bug | High | `<body hx-boost="true">` boosts nothing in htmx 4 (no implicit inheritance): every link is a full page load | Works (fixed in Summit) | Open | e2e: boosted navigation keeps window (defect) |
| SF-022 | RizzyUI | RzAlert | A11y | Medium | Always a live region (`role="alert"` by default): a static callout on page load is announced as an alert | Works (workaround) | Open | None |
| SF-023 | RizzyUI, Blazicons | Icons | Bug | Medium | Material Design icons render `id="mdi-…"`: 14 components (breadcrumb separator, nav menu trigger, pagination, checkbox indicator, …) emit duplicate ids | Affected (no workaround) | Open | None (id check skips mdi-*) |
| SF-024 | htmx, Rizzy docs | htmx boost | DX | Low | Boosted navigation swaps only `<body>`: `<html lang>` (and anything else on `<html>`) keeps the old value after a language switch | Works (workaround) | Open | e2e: language switch (workflow) |
| SF-025 | RizzyUI | RzCommand | Bug | Medium | Typing then pressing Enter quickly runs the item highlighted before the 50 ms search debounce, not the match | Affected (users who type fast) | Open | None (test waits for the match) |
| SF-026 | RizzyUI | FieldError | A11y | Low | Renders an empty `role="alert"` for every field, even without errors | Affected (accepted) | Open | None |
| SF-027 | RizzyUI docs | Docs | Docs | Medium | No docs page or example for `RzEmbeddedPreview`, `RzFormSection`, `RzSearchButton`, `RzDarkModeToggle`, `RzIdScope` | n/a | Open | n/a |
| SF-028 | RizzyUI, Rizzy | Forms | DX | Medium | Every RizzyUI input needs an `EditContext`; a GET filter form must cascade one by hand (an `EditForm` adds a token and `_handler` to the query string) | Works (workaround) | Open | e2e: schedule filters, speaker search (workflow) |
| SF-029 | RizzyUI | RzCheckboxGroup | A11y | Medium | Renders a fieldset with an empty legend (a nameless group) unless `DisplayName` is set; ignores `[Display(Name)]` | Works (workaround) | Open | e2e: getByRole group name (defect) |
| SF-030 | RizzyUI | Alpine attributes | DX | Medium | A consumer's `x-on:click` on `RzToggle` (and other components that bind the same event) is silently replaced by the component's own; `RzToggle` dispatches no change event | Works (workaround) | Open | e2e: level toggles (workflow) |
| SF-031 | RizzyUI | RzAvatar | A11y | Medium | Defaults to `role="img" aria-label="Avatar"`, which overrides `AvatarImage`'s alt text: every avatar is announced as "Avatar" | Works (workaround) | Open | None |
| SF-032 | RizzyUI | RzSheet | A11y | Low | Initial focus goes to the first focusable element; when that is in the footer, a long sheet opens scrolled to the bottom. No initial-focus option | Works (workaround) | Open | e2e: sheet focus (workflow) |
| SF-033 | RizzyUI, Rizzy | Inputs | DX | Low | A consumer `id` on `RzInputText`/`InputGroupInput` is replaced by a generated id, so a `<label for>` written by hand points at nothing (a consumer `name` is kept) | Works (workaround) | Open | axe label checks (defect) |
| SF-034 | RizzyUI | RzThemeProvider | Bug | High | The theme's CSS variables are injected with `<HeadContent>`; Blazor renders only one `HeadContent`, so any other `HeadContent` on the page silently removes the whole theme | Works (workaround) | Open | axe color-contrast on every page (defect) |
| SF-035 | RizzyUI | RzAuroraText | A11y | Low | `AriaLabel` puts `aria-label` on a role-less `span` (axe: aria-prohibited-attr); colors come from an inline `style` attribute (blocked by a strict `style-src`) | Works (workaround) | Open | axe aria-prohibited-attr (defect) |
| SF-036 | RizzyUI | Status colors | A11y | Medium | Soft badges and Information/Success/Warning alerts fail WCAG AA contrast (1.9 to 3.6:1) with the default status palette; themes can override it only through undocumented JSON keys | Works (workaround) | Open | axe color-contrast (defect) |
| SF-037 | RizzyUI | RzFileInput | A11y | Medium | The dropzone is a `role="button"` named "File input" while it shows "Drag and drop files here or click to upload" (WCAG 2.5.3), and the name says nothing about which file | Works (workaround) | Open | axe label-content-name-mismatch (defect) |
| SF-038 | RizzyUI | RzItemGroup | A11y | Medium | `RzItemGroup` is `role="list"` but `RzItem` has no `listitem` role (axe: aria-required-children, critical) | Works (workaround) | Open | axe aria-required-children (defect) |
| SF-039 | RizzyUI | Lazy components | DX | Low | Window events sent before a lazily loaded component has initialized are lost (a dialog's `EventTriggerName`, Ctrl+K right after load) | Affected (early keypresses) | Open | None (tests wait for components) |
| SF-040 | RizzyUI | RzCommand | Bug | High | Data-driven items (`Items` or `ItemsUrl` with `CommandItemTemplate`) never render: `data-template-id` is always empty, so the client reports "No data template found" | Works (workaround) | Open | e2e: search palette (workflow) |
| SF-041 | Rizzy, RizzyUI | Error feedback | Gap | Low | `UseHtmxErrorHandling` raises `rz:server-error`, but nothing shows it: every app writes the same listener to turn it (and htmx network errors) into a toast | Works (workaround) | Open | None yet |
| SF-042 | RizzyUI, template | Build | DX | Medium | With `RizzyUICodeBehindBuild=esbuild`, a clean build fails (RZUI1003) when npm runs `BeforeTargets="Build"`, the starter template's pattern: the esbuild step runs earlier, in CoreBuild | Works (workaround) | Open | CI: summit job builds from a clean checkout (defect) |

## Integration code ledger

Application code that exists only because a library does not (yet) do something. Each item names the
findings it compensates for; when those are fixed, the code should be deleted. Application-specific
behavior (code a real product would write anyway) is listed separately, so the two can be compared.

### Compensating code (should disappear)

| Code | Lines | Compensates for | What a library fix replaces it with |
|---|---|---|---|
| `Infrastructure/StatusPages.cs` | ~35 C# | SF-020 | Rizzy disabling status pages for htmx redirects and partial requests |
| `Infrastructure/SelfHostedAssets.cs`, `vendor.json`, `scripts/fetch-vendor.mjs` | ~90 C#/JS/JSON | SF-012 | A RizzyUI option to serve its widget libraries locally |
| `Program.cs`: absolute `ClientScriptUrl`; `AppLayout`: `"/@Assets[...]"` | 3 | SF-017 | Absolute default URLs |
| `Infrastructure/Theming.cs`: `SidebarState` + `OrganizerLayout` `DefaultOpen` | ~10 C# | SF-010 | `RzSidebarProvider` reading its own cookie |
| `Components/Shared/CommandNavigation.razor(.js)` | ~30 JS | SF-016 | `CommandItem.Href` |
| `Components/Shared/SearchPalette.razor.js` | ~20 JS | SF-040 (and composition for SF-007) | A fixed `RzCommand` template id; `RzCommandDialog` with remote items |
| `Components/Shared/AppNotifications.razor(.js)` | ~25 JS | SF-041 | A built-in server-error toast |
| `Features/Schedule/ScheduleBoard.razor.js`: delegated toggle clicks | ~8 JS | SF-030 | `rz:toggle:change` or merged `x-on:click` |
| `ScheduleFilters`, `SpeakersPage`: hand-cascaded `EditContext` | ~6 per form | SF-028 | Inputs that work without an `EditContext` |
| Explicit `Name="Model.X"` on group inputs, `aria-label` instead of `<label for>` | 1 per field | SF-009, SF-033 | Consistent field naming and consumer ids |
| `Components/Shared/TrackStyles.razor` placed in `<head>` (not `HeadContent`) | ~20 Razor | SF-034 | A theme style component that does not use `HeadContent` |
| `SessionDetails` sheet opened by swap with `DefaultOpen` | pattern | SF-002 | Sheet open/close events |
| a11y attribute fixes (`AriaLabel` on avatars, dropzone, `role="listitem"`, status colors in the theme) | 1 per use | SF-031, SF-036, SF-037, SF-038 | Correct defaults |

### Application-specific code (would exist anyway)

| Code | Lines | Purpose |
|---|---|---|
| `Features/Home/ConferenceCountdown.razor.js` | ~30 JS | Countdown from the server's clock |
| `Features/Schedule/ScheduleBoard.razor.js` (level filter, day memory) | ~45 JS | Client-side filtering of rendered cards; keeping the active tab in the filter form |

Running total so far: about 230 lines of compensating code, about 75 lines of application-specific
client code.

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
   low-contrast status colors. Axe and a unique-id check over the docs pages would have found most of them.
6. **htmx 4 behavior the template and Rizzy do not account for** (SF-017, SF-020, SF-021, SF-024). The
   template test checks pages with curl; one browser test of boosted navigation, an expired session and
   a nested URL would have caught all four.
7. **Who owns the `<head>`** (SF-012, SF-017, SF-034). Theme styles, asset URLs and third-party scripts
   all assume things about the head that apps break by doing normal things.

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

### SF-002 RzSheet has no event-driven open or close (planning)

- **Tag:** Gap, Medium
- **What:** `rzSheet.js` registers no window listeners. `RzDialog` has `EventTriggerName` and
  `CloseEventName`; `RzSheet` has neither, so `HX-Trigger` cannot close a sheet after a successful
  save, and code cannot open one.
- **Summit workaround:** the editor sheet is swapped in with `DefaultOpen="true"` and closed by
  swapping its container empty (an out-of-band swap).
- **Library fix:** the same `EventTriggerName`/`CloseEventName` parameters as `RzDialog`.

### SF-003 Closing one dialog from the server closes all dialogs (planning)

- **Tag:** DX, Medium
- **What:** `CloseEventName` defaults to `rz:dialog-close` and listens on `window`. A server response
  with `HX-Trigger: rz:dialog-close` closes every open dialog on the page, not the one whose form was
  submitted.
- **Summit workaround:** every dialog sets its own `CloseEventName`.
- **Library fix:** document it prominently; consider scoping the default name to the dialog id
  (`rz:dialog-close:{id}`) or accepting an id in the event detail.

### SF-004 Dialog docs use an event and a constant that do not exist (planning)

- **Tag:** Docs, Medium
- **What:** `DialogInfo.razor` (lines 264 and 326) says the default close event is `rz:modal-close` and
  shows `RizzyUI.Constants.Events.ModalClose`. The constant does not exist (the code would not compile)
  and the real default is `Constants.Events.DialogClose` = `rz:dialog-close`.
- **Library fix:** correct both lines.

### SF-005 RzChart keeps light-mode colors after switching to dark mode (planning)

- **Tag:** Bug, Medium
- **What:** `rzChart.js` resolves `var(--chart-1)` and friends once at init. Its `rz:theme-change`
  handler only calls `chart.update()`, which redraws with the colors already resolved.
- **Library fix:** keep the unresolved config and re-resolve it in the theme-change handler before
  `update()`.

### SF-006 Server toasts are dropped outside htmx requests (planning)

- **Tag:** DX, Medium
- **What:** `RzToastMiddleware` sends queued toasts only for htmx requests and drops them on redirects
  (RZUI-052), logging at Debug level. A post-redirect-get flow, the usual MVC pattern, loses its
  "Saved" toast without any visible error.
- **Summit design:** every action that toasts answers an htmx request in place, with `HX-Push-Url`
  instead of a redirect.
- **Library fix:** log at Warning in Development; consider carrying queued toasts across a redirect
  (TempData-style) as an opt-in.

### SF-007 RzCommandDialog cannot use a remote item source (planning)

- **Tag:** Gap, Medium
- **What:** `RzCommand` supports `ItemsUrl`, `FetchTrigger` and `ServerFiltering`, but
  `RzCommandDialog` does not pass them through, so a server-searched palette in a dialog has to be
  composed by hand from `RzDialog` and `RzCommand`. The usual Ctrl+K / Cmd+K shortcut has to be wired
  by the app.
- **Library fix:** pass the remote parameters through; add an opt-in `Shortcut` parameter.

### SF-008 No upload progress (planning)

- **Tag:** Gap, Low
- **What:** `RzFileInput` has no progress display, and htmx 4 sends requests with `fetch()`, which
  reports no upload progress.
- **Summit design:** an indeterminate `RzProgress` as the request indicator.

### SF-009 Components name their form fields differently (planning)

- **Tag:** DX, High
- **What:** `RzCheckboxGroup`, `RzRadioGroup`, `RzCombobox`, `RzInputOTP` and `RzFileInput` default to
  the bare property name (`Country`). Rizzy-based inputs (`RzInputText`, `RzInputNumber`, `RzSwitch`,
  `RzNativeSelect`, `RzDateEdit`) use the model path (`Model.Country`). In one `EditForm` bound with
  `[SupplyParameterFromForm]`, the first group silently does not bind.
- **Summit workaround:** `Name="Model.X"` on those components.
- **Library fix:** derive the name from the full `For` expression path, as the Rizzy inputs do.

### SF-010 Sidebar collapse state flashes on page load (planning)

- **Tag:** DX, Low
- **What:** `RzSidebarProvider` writes the `sidebar_state` cookie in JS, but the server never reads
  it, so a collapsed sidebar renders open and then collapses.
- **Summit workaround:** the layout reads the cookie and passes `DefaultOpen`.
- **Library fix:** read the cookie in `RzSidebarProvider` when `PersistenceCookieName` is set.

### SF-011 Sidebar content is rendered twice (planning)

- **Tag:** DX, Low
- **What:** `Sidebar` renders `ChildContent` once in a mobile `RzSheet` and once in the desktop
  container, so any fixed `id` inside it is duplicated.
- **Summit workaround:** no fixed ids inside the sidebar.
- **Library fix:** document it on the sidebar page.

### SF-012 Widget libraries load from a CDN by default (planning)

- **Tag:** DX, Medium
- **What:** Chart.js, Tom Select, flatpickr, vanilla-calendar-pro (JS and CSS), Coloris, Embla and
  rough-notation default to jsDelivr URLs (with SRI). Apps that want to self-host must find the asset
  keys in `ServiceCollectionExtensions` and copy the files themselves.
- **Summit workaround:** an npm script copies the pinned versions into `wwwroot/lib`, and
  `AddRizzyUI` overrides `AssetUrls`.
- **Library fix:** ship the files as static web assets with an option such as
  `config.UseLocalAssets = true`, or document the keys, versions and an override example.

### SF-013 RzInputOTP uses an inline style attribute (planning)

- **Tag:** Bug, Low
- **What:** the hidden input carries `style="position:absolute;…"`, which a `style-src` without
  `'unsafe-inline'` blocks.
- **Library fix:** move the styling to a class.

### SF-014 RzDateEdit range mode cannot bind (planning)

- **Tag:** Gap, Low
- **What:** flatpickr's `Mode.Range` posts "from to" as one string into the `DateTime?` that
  `RzDateEdit` requires.
- **Summit workaround:** the dashboard range uses `RzCalendar Mode="MultipleRanged"`.

### SF-015 RzToggle posts nothing (planning)

- **Tag:** DX, Low
- **What:** `RzToggle` is an `aria-pressed` button with client state only; it cannot drive a server
  filter without custom code.
- **Summit design:** level filters on the schedule are client-side, through a code-behind.

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

### SF-019 NavigationMenuLink docs example nests links

- **Tag:** Docs, Medium
- **What:** `NavigationMenuInfo.razor`'s `ListItem` helper renders `<NavigationMenuLink><RzLink Href>`.
  `NavigationMenuLink` renders an `<a>` itself, so the output is an empty `<a>` followed by the real
  link (the HTML parser splits nested anchors). Keyboard users get an extra, empty tab stop.
- **Summit workaround:** `<NavigationMenuLink Href="…" class="…">` with the content directly inside.
- **Library fix:** correct the example (or use `AsChild`, as the "Docs" item in the same example does).

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

### SF-024 Boosted navigation does not update the html element

- **Tag:** DX, Low
- **What:** with `hx-boost`, htmx swaps the `<body>`; attributes on `<html>` (`lang`, `dir`, a theme
  class) stay as they were. Switching the language through a boosted link left `lang="en"` on a German
  page, which makes screen readers use the wrong voice.
- **Summit workaround:** the language links have `hx-boost="false"` (a full page load); the theme
  switch answers with `HX-Refresh`.
- **Library fix:** document it next to hx-boost in the Rizzy guide; a Rizzy extension could copy
  `lang`/`dir` from the response's `<html>` on boosted swaps.

### SF-025 Enter in a command palette can run the wrong item

- **Tag:** Bug, Medium (found by the Summit browser tests)
- **What:** `CommandInput` binds the search with `x-model.debounce.50ms`. Typing "check-in" and pressing
  Enter within 50 ms executes the item that was highlighted before filtering (the first item,
  "Dashboard"), because the list has not been filtered yet. Fast typists and barcode-style input hit
  this; Playwright's keyboard does every time.
- **Summit workaround:** the test waits for the matching option to be selected before Enter.
- **Library fix:** on Enter, flush the pending search (filter synchronously) before choosing the
  selected item; or drop the debounce for local (non-`ItemsUrl`) filtering, which is cheap.

### SF-026 FieldError always renders an empty alert

- **Tag:** A11y, Low
- **What:** every `FieldError` renders `<div role="alert">` even when there is no message, so a form has
  one empty alert region per field. Tests that look for "the alert" in a form find all of them.
- **Library fix:** render the element (or the role) only when there are errors, or use a single
  polite summary region for the form.

### SF-027 Components without documentation

- **Tag:** Docs, Medium
- **What:** `AGENTS.md` requires a docs page for every component, but `RzEmbeddedPreview`,
  `RzFormSection`, `RzSearchButton`, `RzDarkModeToggle` and `RzIdScope` have no page and no example on
  any page. Summit had to read their source to use them. (`RzIdScope` in particular solves a real htmx
  problem, stable ids in re-rendered fragments, and nobody will find it.)
- **Library fix:** add the pages, or at least an example on a related page.

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

### SF-031 Every avatar is announced as "Avatar"

- **Tag:** A11y, Medium
- **What:** `RzAvatar` renders `role="img" aria-label="Avatar"` (a localized default) on the wrapper.
  Children of `role="img"` are presentational, so `AvatarImage`'s `AlternateText` ("Amara Okafor") is
  never read: a list of speakers is announced as "Avatar, Avatar, Avatar". There is also no way to make
  an avatar decorative when the name is printed next to it, which is the common case.
- **Summit workaround:** `AriaLabel="@speaker.Name"` on every avatar.
- **Library fix:** derive the label from `AvatarImage.AlternateText` (or the fallback initials' title);
  add a `Decorative` option that renders `aria-hidden="true"` and no role.

### SF-032 A sheet with long content opens scrolled to the bottom

- **Tag:** A11y, Low
- **What:** `RzSheet` moves focus to its first focusable element when it opens. In a details sheet whose
  only controls are footer buttons, that is the last element, so the panel scrolls to the bottom and the
  title and first paragraphs are out of view for sighted keyboard and mouse users alike.
- **Summit workaround:** put a control at the top of the content.
- **Library fix:** focus the panel itself (with `tabindex="-1"`) or the title when there is no focusable
  element before the footer, or add an `InitialFocus` selector parameter as Radix (`onOpenAutoFocus`) does.

### SF-033 You cannot choose an input's id

- **Tag:** DX, Low
- **What:** `InputGroupInput id="speaker-query"` renders `id="QvogGwJLp2DI"`: the id reserved for the
  field (`GetOrReserveFieldId`) replaces the consumer's. A hand-written `<label for="speaker-query">`
  (needed when the label is not a `FieldLabel`, such as a visually hidden search label) then labels
  nothing. Oddly, a consumer `name` is kept, so the two attributes behave differently.
- **Summit workaround:** `aria-label` on the input.
- **Library fix:** let a consumer `id` win (and register it as the field's id so `FieldLabel` still
  matches), consistent with how `name` behaves.

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

### SF-035 RzAuroraText's AriaLabel is prohibited ARIA

- **Tag:** A11y, Low (found by axe)
- **What:** with `AriaLabel` set, `RzAuroraText` renders `<span aria-label="…">`. `aria-label` is
  prohibited on a `span` without a role, so assistive technology may ignore it and axe reports a serious
  violation. Without `AriaLabel` the component already renders visually hidden text, which works. Its
  gradient colors also come from an inline `style` attribute, which a strict `style-src` blocks.
- **Summit workaround:** no `AriaLabel`.
- **Library fix:** render the label as visually hidden text (or `role="img"` with `aria-label`); move the
  colors to CSS custom properties set from a class or a nonced style.

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

### SF-037 The file dropzone's name does not match its text

- **Tag:** A11y, Medium (found by axe: label-content-name-mismatch)
- **What:** `RzFileInput Variant="Dropzone"` renders `<div role="button" aria-label="File input">` with
  the visible text "Drag and drop files here or click to upload". Speech-input users say what they see
  and nothing matches; screen reader users hear a generic "File input" with no hint of the field it
  belongs to (the `FieldLabel` points at the hidden native input, not the dropzone).
- **Summit workaround:** `AriaLabel="Drag and drop files here or click to upload an attachment"`.
- **Library fix:** name the dropzone from its visible text plus the field label
  (`aria-labelledby="label-id trigger-content-id"`).

### SF-038 RzItemGroup is a list without list items

- **Tag:** A11y, Medium (found by axe: aria-required-children, critical)
- **What:** `RzItemGroup` renders `role="list"`; `RzItem` renders a plain `div` with no role, so the list
  "contains" generic elements and whatever they contain (here an avatar's `role="img"`). Screen readers
  report an empty or broken list.
- **Summit workaround:** `role="listitem"` on each `RzItem` inside a group.
- **Library fix:** `RzItem` renders `role="listitem"` when it is inside an `RzItemGroup` (a cascading
  value), or `RzItemGroup` drops the list role.

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

### SF-041 Every app needs the same server-error listener

- **Tag:** Gap, Low (owner: Rizzy and RizzyUI)
- **What:** Rizzy's `UseHtmxErrorHandling` stops a 5xx from being swapped and raises `rz:server-error`
  instead. That is the right default, but the user then sees nothing at all: the click did nothing. Both
  libraries have the pieces (the event, `Rizzy.toast`), yet each application must write a code-behind
  that listens for `rz:server-error` (and htmx 4's `htmx:error` for network failures) and shows a toast.
- **Summit workaround:** `Components/Shared/AppNotifications.razor(.js)`, about 20 lines.
- **Library fix:** an opt-in `<RzServerErrorToasts />` (or a `RzToastProvider` option) that shows a
  localized error toast for `rz:server-error` and network errors, with the messages configurable.

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

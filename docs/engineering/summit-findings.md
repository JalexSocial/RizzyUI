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

## Index

| Id | Area | Tag | Severity | Summary | Status |
|---|---|---|---|---|---|
| SF-001 | RzDataTable | Gap | High | Client-side only: no way to carry table state into a request, no row update | Worked around in Summit |
| SF-002 | RzSheet | Gap | Medium | No open/close event names (RzDialog has both); the server cannot close a sheet | Worked around in Summit |
| SF-003 | RzDialog | DX | Medium | The default close event is global: closing one dialog from the server closes all of them | Worked around in Summit |
| SF-004 | RzDialog docs | Docs | Medium | Docs name `rz:modal-close` and `Constants.Events.ModalClose`, which do not exist | Open |
| SF-005 | RzChart | Bug | Medium | Colors from CSS variables are not re-read on theme change | Open |
| SF-006 | RzToast | DX | Medium | Server toasts are silently dropped on non-htmx requests and redirects | Designed around in Summit |
| SF-007 | RzCommandDialog | Gap | Medium | Does not pass `ItemsUrl`/`ServerFiltering` through; no Ctrl+K shortcut | Worked around in Summit |
| SF-008 | RzFileInput | Gap | Low | No upload progress (and htmx 4's `fetch` reports none) | Accepted |
| SF-009 | Forms | DX | High | Field names differ between components (`Country` vs `Model.Country`) | Worked around in Summit |
| SF-010 | RzSidebar | DX | Low | Persisted collapse state is not read on the server: the sidebar flashes open | Worked around in Summit |
| SF-011 | RzSidebar | DX | Low | `ChildContent` is rendered twice (mobile and desktop), so fixed ids inside it collide | Worked around in Summit |
| SF-012 | Asset URLs | DX | Medium | Widget libraries default to jsDelivr: CI depends on a CDN, strict `style-src` blocks the calendar CSS | Worked around in Summit |
| SF-013 | RzInputOTP | Bug | Low | Inline `style` attribute breaks a strict `style-src` | Open |
| SF-014 | RzDateEdit | Gap | Low | `Mode.Range` cannot bind to the single `DateTime?` it requires | Worked around in Summit |
| SF-015 | RzToggle | DX | Low | Posts nothing; filters built from toggles need custom code | Designed around in Summit |
| SF-016 | RzCommand | Gap | Medium | Command items have no link or href: Enter on an item does nothing unless the app handles `rz:command:execute` | Worked around in Summit |
| SF-017 | Asset URLs | DX | Medium | `Assets[...]` and Rizzy's default `ClientScriptUrl` are relative; without `<base href="/">` styles and scripts 404 on nested URLs, and with it in-page links break | Worked around in Summit |
| SF-018 | RzButton | Bug | High | No `AsChild`: `<RzButton AsChild><a>` renders a link inside a button (invalid, two tab stops). The starter template's 404 page and the docs do this | Open |
| SF-020 | Rizzy + starter | Bug | High | `UseStatusCodePagesWithReExecute` (starter template) swallows `UseHtmxRedirects`' 401 + `HX-Redirect`, and turns every empty 4xx (antiforgery 400, 401, 405) into "Page not found" with status 404 | Worked around in Summit |
| SF-021 | Starter template | Bug | High | `<body hx-boost="true">` boosts nothing in htmx 4 (no implicit inheritance): every link is a full page load | Worked around in Summit |
| SF-022 | RzAlert | A11y | Medium | Always a live region (`role="alert"` by default): a static callout on page load is announced as an alert | Worked around in Summit |
| SF-023 | Icons | Bug | Medium | Material Design icons render `id="mdi-…"`: 14 components (breadcrumb separator, nav menu trigger, pagination, checkbox indicator, …) emit duplicate ids | Open (Summit's id check skips `mdi-*`) |
| SF-024 | htmx boost | DX | Low | Boosted navigation swaps only `<body>`: `<html lang>` (and anything else on `<html>`) keeps the old value after a language switch | Worked around in Summit |
| SF-025 | RzCommand | Bug | Medium | Typing then pressing Enter quickly runs the item highlighted before the 50 ms search debounce, not the match | Open |
| SF-026 | FieldError | A11y | Low | Renders an empty `role="alert"` for every field, even without errors | Open |
| SF-019 | RzNavigationMenu docs | Docs | Medium | The docs' `ListItem` example puts `RzLink` inside `NavigationMenuLink`, which already renders an `<a>`: nested anchors | Open |

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
- **What:** the hidden input carries `style="position:absolute;â€¦"`, which a `style-src` without
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

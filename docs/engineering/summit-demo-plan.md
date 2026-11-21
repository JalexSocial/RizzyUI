# Summit: plan for an end-to-end RizzyUI demo application

| Field | Value |
|---|---|
| Status | Plan for review. No code, projects or tests exist yet. |
| Written | 2026-11-20, against `main` at 1.0.0-preview.4-dev (RizzyUI 1.0.0-preview.3 released; Rizzy 6.0.0-preview.3; htmx 4.0.1; .NET 10) |
| Proposed location | `samples/Summit` |
| Decisions needed | [Section 10](#10-decisions-needed) |

Summit is a fictional developer-conference platform: a public site for attendees and an organizer
dashboard behind a sign-in. It is a real ASP.NET Core MVC application on Rizzy 6 and htmx 4 that
uses nearly every RizzyUI component, with several components working together on each page. CI
tests it on every pull request, in a browser, under the standard and the CSP build, against the
packed NuGet package.

This plan was written after reading the component sources, the starter template, the docs app's
integration harness, the consumer smoke test, the template test and `ci.yml`. Section 2 lists what
that reading found, because several findings change the original concept.

---

## 1. Goals

### 1.1 What Summit is for

1. **End-to-end proof on a real application shape.** Pages are MVC controllers in Areas, data comes
   from EF Core, sign-in uses cookies, and forms post through htmx and come back as 422 or as
   out-of-band updates. The library is tested the way consumers build with it.
2. **Orchestration.** Components on the same page react to the same request: a filter refreshes a
   chart, number tickers and a table in one response; a sheet saves and updates a data table and
   shows a toast. Tests that render one component at a time cannot find these bugs.
3. **A demo people want to look at.** It should look like a real product. It also serves as the
   reference for "how do I build X with RizzyUI", so its code must be idiomatic and readable.
4. **A canary for the release.** It runs against the packed package, published, under a strict CSP,
   in a non-English culture and at phone width. A change that breaks any of these fails the pull
   request.

### 1.2 What the existing checks cover, and what only Summit can cover

| Concern | Docs integration (`src/RizzyUI.Docs`, `/_tests/*`) | Consumer smoke (`eng/consumer-smoke-test.sh`) | Template test (`eng/template-test.sh`) | Summit |
|---|---|---|---|---|
| Hosting model | Razor components endpoint (`MapRazorComponents`) | Razor components endpoint, `UseStaticFiles` only | MVC controllers, `MapStaticAssets`, minimal-API fragments | MVC controllers **in Areas**, three layouts, minimal-API fragments, `MapStaticAssets` |
| How RizzyUI is referenced | Project reference | Packed NuGet package | Packed NuGet and npm packages | Project reference locally; packed NuGet and npm packages in CI |
| Browser checks | Yes: one component family per harness page | Yes: two components | **No**: HTTP checks with curl | Yes: full user flows |
| Orchestration across components | Small: toast region, overlay region, OOB fragment | No | No | **Primary purpose** |
| Real data, auth, EF Core | No | No | No (in-memory store) | Yes |
| 422 validation | One harness form (minimal API) | No | One form, checked with curl | Multi-step checkout, sheet editor, upload, OTP |
| CSP | Meta-tag policy (`'self'` plus nonce), docs-site exceptions | Header, `'strict-dynamic'` | No | Header, `'strict-dynamic'`, the **whole app** |
| Published build | No (Debug build; Release generates the static site) | Yes | Yes | Yes, with browser tests against it |
| Non-English culture | Resources exist (de, es, fr, pt); not tested in a browser | No | No | de-DE end to end |
| Mobile viewport | Docs layout only | No | No | Yes |
| Code-behind | Harness components, TS via esbuild | One JS component | One JS component, fingerprint and cache header | Several realistic ones, one in TypeScript, unit-tested with `@jalexsocial/rizzyui/testing` |

**Recommendation:** Summit **adds to** the consumer smoke test and does not replace it (decision D-8).
The smoke test covers a different consumer shape: a Razor components endpoint, `UseStaticFiles`
without `MapStaticAssets`, htmx served by the app and checked against Rizzy's SRI hashes, no
Tailwind or npm build, and npm-package resolution checks. It takes about a minute. Summit should
not take on those variations. Once Summit has run for a few weeks, the smoke test's browser checks
that Summit duplicates can be trimmed.

### 1.3 Non-goals

- Not a product: no real payments, email or webhooks. Payment is simulated, and no card fields are
  collected.
- Not a component catalog: the docs site documents parameters. Summit uses each component where a
  real product would.
- No Blazor interactivity, `EventCallback` or `@onclick`. SSR plus Alpine plus htmx only, the same
  rules as the library (`AGENTS.md`).
- No real people, companies or brands. Speakers, sponsors and logos are generated, and sponsor logos
  are wordmarks drawn as local SVGs.

---

## 2. Findings from the source that shape this plan

Each finding either changes the concept or is a library gap that Summit should work around now and
report. "Library follow-up" items are candidates for separate RizzyUI pull requests (decision D-7).

| ID | Finding (source) | Effect on Summit | Library follow-up |
|---|---|---|---|
| F-1 | **`RzDataTable` is client-side only.** All `Items` are serialized into the page. Sorting, filtering, paging, selection and visibility run in TanStack. Nothing is posted back, and a re-rendered table starts from `InitialState` (`rzdatatable-architecture.md`, docs Known Limitations). `DataTable/Models/TableRequestModel.cs` has no consumers. | A single-row out-of-band update is impossible: rows are rendered by Alpine from JSON. Summit replaces the **whole** table and carries its state with the request. A TypeScript code-behind mirrors `rz:datatable:state-changed` into hidden inputs, and the server rebuilds `InitialState` from them (S-03). The attendee DTO excludes sensitive fields (RZUI-033). | Consider a built-in way to serialize table state into a form or request, and remove or use `TableRequestModel`. |
| F-2 | **`RzSheet` has no open or close event.** `rzSheet.js` registers no window listeners. `RzDialog` has `EventTriggerName` and `CloseEventName`. | The server cannot close the attendee editor with `HX-Trigger`. Summit swaps in an `RzSheet DefaultOpen="true"` to open it and removes it with an out-of-band swap to close it. Focus return to the row's button must be checked (S-03). | Give `RzSheet` the same `EventTriggerName`/`CloseEventName` as `RzDialog`. |
| F-3 | **Dialog close is global.** `CloseEventName` defaults to `rz:dialog-close` and listens on `window`, so a bare `HX-Trigger: rz:dialog-close` closes every open dialog. | Every Summit dialog sets its own `CloseEventName`. | Document the global behavior. |
| F-4 | **Dialog docs name the wrong event.** `DialogInfo.razor:264,326` says `rz:modal-close` and uses `Constants.Events.ModalClose`, which does not exist. The real default is `Constants.Events.DialogClose = "rz:dialog-close"`. | None. | Docs fix. |
| F-5 | **`RzChart` does not re-resolve colors on theme change.** It resolves `var(--…)` once at init and on `rz:theme-change` only calls `chart.update()` (`rzChart.js:60-66`). | The dashboard charts keep light-mode colors after the dark-mode toggle until the panel is swapped. S-11 tests this, so it fails until the library is fixed or the test is marked `fixme`. | Re-resolve the raw config on `rz:theme-change`. |
| F-6 | **Server toasts are sent only for htmx requests.** `RzToastMiddleware` returns early when `!Request.IsHtmx()` and drops the queue on redirects (RZUI-052). | Every action that shows a toast must be an htmx request answered in place (no post-redirect-get). Checkout success renders the confirmation with `HX-Push-Url` instead of redirecting. | None (by design). |
| F-7 | **`RzCommandDialog` does not pass through `ItemsUrl`, `FetchTrigger` or `ServerFiltering`, and Ctrl+K is not built in.** `RzCommand` fetches **JSON** with `fetch()`, not htmx. | The public search palette is composed from `RzDialog` and `RzCommand ItemsUrl ServerFiltering`, served by a JSON endpoint, and opened by a window keydown wrapper as in `CommandInfo.razor`. "Searching with htmx" in the concept becomes "searching a JSON endpoint". The organizer area uses `RzCommandDialog` with static items, so both are covered. | Pass the remote parameters through `RzCommandDialog`; consider an opt-in shortcut. |
| F-8 | **`RzFileInput` has no upload progress**, and htmx 4 sends requests with `fetch()`, which reports no upload progress (to confirm in phase 2). | The help form shows an indeterminate `RzProgress` as the `hx-indicator`. A percentage would need an XHR code-behind that bypasses htmx (decision D-6). | None. |
| F-9 | **Form field names are inconsistent.** `RzCheckboxGroup`, `RzRadioGroup`, `RzCombobox`, `RzInputOTP` and `RzFileInput` default to the bare property name (`Country`). Rizzy-based inputs (`RzInputText`, `RzInputNumber`, `RzSwitch`, `RzNativeSelect`, `RzDateEdit`) use the model path (`Model.Country`). | In one `EditForm` bound with `[SupplyParameterFromForm]`, the first group does not bind. Summit sets `Name="Model.X"` explicitly on those components, and a test asserts the posted names. | Consider defaulting to the full path. |
| F-10 | **The sidebar's persisted state is not read on the server.** JS writes the `sidebar_state` cookie; SSR uses `DefaultOpen`. | `OrganizerLayout` reads the cookie and passes `DefaultOpen`, so a collapsed sidebar does not flash open. | Consider reading the cookie in `RzSidebarProvider`. |
| F-11 | **`RzSidebar` renders `ChildContent` twice** (mobile sheet and desktop). | Nothing inside the sidebar gets a fixed `id`. | Document. |
| F-12 | **Third-party widget scripts default to jsDelivr URLs with SRI**: Chart.js, Tom Select, flatpickr, vanilla-calendar-pro (JS **and CSS**), Coloris, Embla and plugins, rough-notation (`ServiceCollectionExtensions.cs`, `DefaultCdnAssets`). highlight.js is local. | A CI run depends on a CDN, and a strict `style-src` blocks the calendar CSS. Summit can self-host them by overriding `AssetUrls` (decision D-5). | Consider shipping self-hosted copies as an option. |
| F-13 | **Inline `style` attributes**: `RzInputOTP` renders `style="position:absolute;…"` on its hidden input. | A `style-src` without `'unsafe-inline'` blocks it. Summit reports style violations without failing on them (decision D-4). | Move it to a class. |
| F-14 | **`RzDateEdit` range mode cannot bind**: `Mode.Range` posts a range string into a single `DateTime?`. | The dashboard date range uses `RzCalendar Mode="MultipleRanged"` in a popover instead. | Document, or add a range-bound variant. |
| F-15 | **Theme switching happens only on the server.** There are two built-in themes (`ArcticTheme`, `VercelTheme`) and `ThemeLoader` for more. Dark mode is client-side (`Rizzy.theme`, `localStorage.darkMode`). | The theme picker is a settings form that sets a cookie and re-renders. Summit adds a third, "Summit" theme from JSON through `ThemeLoader`, which tests that API. | None. |
| F-16 | **`RzToggle` submits nothing** (an `aria-pressed` button). | Level filters on the schedule are client-side, through a code-behind. Server filters use inputs that post. | None. |
| F-17 | **Checked: `RzInputColor`'s `x-model="colorPicker.value"` works under the CSP build.** The RZUI-032 CSP test covers it. | None. | None. |

---

## 3. Architecture

### 3.1 Project layout

```
samples/Summit/
  README.md                      How to run it, the demo account, the configuration switches
  Summit.slnx                    Summit.Web + Summit.Tests (decision D-1: not in src/RizzyUI.sln)
  Directory.Build.props          RizzyUI source switch (3.2), shared versions
  src/Summit.Web/
    Summit.Web.csproj
    Program.cs                   Composition root, pipeline order in 3.3
    appsettings.json, appsettings.Development.json, appsettings.Testing.json
    package.json                 Tailwind 4, @tailwindcss/forms, esbuild, @jalexsocial/rizzyui, vendor copy script
    tsconfig.json                For the .razor.ts code-behind (types from obj/rizzyui/rizzyui.d.ts)
    Styles/app.css               @import tailwindcss + @jalexsocial/rizzyui/dist/css/rizzyui-plugin.css
    Infrastructure/
      Csp/                       Nonce-based CSP header middleware, report-only style policy (3.8)
      Localization/              Cultures, cookie provider, culture switch endpoint (3.9)
      Auth/                      Cookie auth, organizer policy, password check (3.7)
      Theming/                   Theme cookie, ThemeLoader for the Summit theme, sidebar cookie (F-10)
      Clock/                     TimeProvider, fixed in Testing (3.6)
      TestHooks/                 /_test/reset and similar; mapped only with Summit:EnableTestHooks
    Data/
      SummitDbContext.cs, Entities/, Seeding/   EF Core SQLite, Bogus seeding (3.6)
    Components/
      Layout/                    AppLayout (html shell), PublicLayout, CheckoutLayout, OrganizerLayout
      Shared/                    SearchPalette, SiteHeader, CultureSwitch, ToastHost, EmptyState…
    Features/                    Public site: one folder per feature (controller + pages + fragments)
      Home/ Schedule/ Sessions/ Speakers/ Tickets/ Help/ Account/ Search/ Agenda/ Errors/
    Areas/Organizer/
      _Imports.razor             @layout HtmxLayout<OrganizerLayout>
      Features/ Dashboard/ Attendees/ CheckIn/ ScheduleBuilder/ Settings/
    Resources/                   SharedResource.resx, SharedResource.de.resx (3.9)
    Themes/summit.json           Custom theme loaded with ThemeLoader (F-15)
    wwwroot/                     favicon, generated sponsor SVGs, lib/ (vendored widget assets, generated; F-12)
  tests/
    Summit.Tests/                xUnit + WebApplicationFactory: HTTP-level contracts (7.2)
    e2e/                         Playwright + axe: package.json, playwright.config.ts, specs/, scenarios/, support/
eng/summit-test.sh               Pack-mode CI runner: isolated NuGet cache, publish, run, Playwright (7.6)
```

It follows the starter's feature-folder convention (`Features/Customers/CustomersController.cs`
next to `CustomersPage.razor`), so Summit reads as a grown-up version of `dotnet new rizzyui`.

### 3.2 How Summit references RizzyUI

One MSBuild property, `SummitRizzyUISource`, set in `samples/Summit/Directory.Build.props`:

| Mode | When | NuGet | npm (`Styles/app.css`, types, testing helper) |
|---|---|---|---|
| `Project` (default) | Local development, F5, `dotnet watch` | `ProjectReference` to `src/RizzyUI/RizzyUI.csproj`, plus a conditional `<Import>` of `src/RizzyUI/build/RizzyUI.targets` (a project reference does not import a package's `build/` targets; `RizzyUI.Docs.csproj` does the same) and `RizzyUI.Tasks` as a `PrivateAssets="all"` package | `"@jalexsocial/rizzyui": "file:../../../../packages/rizzyui"` |
| `Package` | CI (`eng/summit-test.sh`) | `PackageReference Include="RizzyUI" Version="$(RizzyUIVersion)"`, restored from the artifacts folder through an isolated `nuget.config` and `NUGET_PACKAGES`, as the smoke test does | The script runs `npm pkg set` to point at the packed `.tgz`, as `template-test.sh` does |

Sketch of the switch (illustrative; written in phase 1):

```xml
<ItemGroup Condition="'$(SummitRizzyUISource)' == 'Project'">
  <ProjectReference Include="$(RepoRoot)src/RizzyUI/RizzyUI.csproj" />
  <PackageReference Include="RizzyUI.Tasks" Version="$(RizzyUITasksVersion)" PrivateAssets="all" />
</ItemGroup>
<Import Project="$(RepoRoot)src/RizzyUI/build/RizzyUI.targets" Condition="'$(SummitRizzyUISource)' == 'Project'" />
<ItemGroup Condition="'$(SummitRizzyUISource)' == 'Package'">
  <PackageReference Include="RizzyUI" Version="$(RizzyUIVersion)" />
</ItemGroup>
```

`RizzyUITasksVersion` comes from `src/Directory.Build.props`. Summit's props file imports that one
instead of copying the value. In `Project` mode, restore needs
`-p:RestoreAdditionalProjectSources=<artifacts>` only when the Tasks version is not on nuget.org yet,
the same rule CI already follows for the library.

Summit references `Rizzy` only through RizzyUI, so it always gets the Rizzy version the library was
built against.

### 3.3 Hosting pipeline (`Program.cs`, in this order)

1. `AddRizzy(c => { c.RootComponent = typeof(HtmxApp<AppLayout>); c.DefaultLayout = typeof(HtmxLayout<PublicLayout>); })`
2. `AddRizzyUI(c => { c.DefaultTheme = SummitTheme; c.AvailableThemes.Add(...); c.AssetUrls[...] = self-hosted URLs (D-5) })`
3. `AddControllersWithViews()`, `AddLocalization()`, `AddDbContext<SummitDbContext>(UseSqlite)`, `AddSingleton(TimeProvider)`
4. `AddAuthentication(Cookie)` with `Events.UseHtmxRedirects()` (Rizzy), `AddAuthorization(policy "Organizer")`
5. `app.UseHtmxErrorHandling(o => o.ErrorEvent = "rz:server-error")`, registered **before** `UseExceptionHandler`, as the starter does
6. `UseExceptionHandler("/error")`, `UseStatusCodePagesWithReExecute("/not-found")`
7. CSP middleware (only with `Summit:Csp:Enabled`) sets the header using `IRizzyNonceProvider`
8. `UseRequestLocalization`
9. `UseRouting`, `UseAuthentication`, `UseAuthorization`, `UseAntiforgery`, `UseRizzy`, `UseRzToast`
10. `MapStaticAssets()`, `MapControllers().WithStaticAssets()`, `MapAreaControllerRoute` only if conventional routes are needed (attribute routes are planned), fragment groups (`/fragments/*`), JSON endpoints (`/api/search`), test hooks

### 3.4 Controllers versus minimal-API fragments

The rule is enforced in code review and keeps both styles realistic:

- **Controllers (`RzController`)** serve pages and anything that **writes**: form posts that need
  `ModelState`, `[ValidateAntiForgeryToken]`, `[Authorize]`, Areas, `View<T>`/`PartialView<T>`.
- **Minimal APIs (`IRizzyService`)** serve **read-only fragments and JSON** that need no
  `ModelState`: lazy panels, polling, sheet bodies, search JSON.
- At least one component is rendered by **both** a controller action and a minimal API: the session
  card, from `ScheduleController` and `/fragments/sessions/{id}/card`. This proves the two render
  paths produce the same markup, including fingerprinted code-behind URLs (the resolver's fallback to
  `EndpointDataSource`, see `alpine-code-behind.md`).

Route map (attribute routes; organizer routes under `[Area("Organizer")]` with `/organizer` prefix):

| Route | Kind | Notes |
|---|---|---|
| `GET /` | Controller page | Home |
| `GET /schedule`, `GET /schedule/{day}` | Controller page | Query: `track`, `minLength`, `maxLength` |
| `GET /schedule/grid` | Controller partial | The filtered session grid (htmx target) |
| `POST /agenda/{sessionId}` | Controller (antiforgery) | Toggles "my agenda"; out-of-band header count; toast |
| `GET /sessions/{slug}` | Controller page | Session page |
| `GET /speakers` | Controller page and partial | `q`, `page`; partial when `IsPartial` |
| `GET /tickets`, `GET/POST /tickets/checkout/{step}` | Controller (antiforgery) | `CheckoutLayout`; draft stored server-side |
| `POST /tickets/checkout/discount` | Controller | OTP discount code; 422 or out-of-band summary |
| `GET /tickets/confirmation/{orderId}` | Controller page | Direct load of the confirmation |
| `GET /help`, `POST /help/contact` | Controller | Multipart upload |
| `GET /account/sign-in`, `POST /account/sign-in`, `POST /account/sign-out` | Controller | |
| `POST /culture`, `POST /preferences/theme` | Controller | Cookies; `HX-Refresh` |
| `GET /fragments/home/stats`, `/fragments/sessions/{id}/details`, `/fragments/sessions/{id}/card` | Minimal API | Lazy and sheet content |
| `GET /api/search?q=` | Minimal API, JSON | `RzCommand ItemsUrl` |
| `GET /organizer` | Area controller | Dashboard |
| `GET /organizer/dashboard/panels` | Area controller partial | Filtered panels; out-of-band tickers and table |
| `GET /organizer/attendees`, `GET /organizer/attendees/{id}/edit`, `POST /organizer/attendees/{id}`, `POST /organizer/attendees/bulk` | Area controller | |
| `GET /organizer/check-in`, `POST /organizer/check-in` | Area controller | |
| `GET /organizer/check-in/counter` | Minimal API, authorized | Polled |
| `GET /organizer/schedule-builder`, `GET/POST /organizer/schedule-builder/sessions/{id}` | Area controller | |
| `GET /organizer/settings/{section}`, `POST …` | Area controller | API keys, audit log, preferences |
| `POST /_test/reset`, `POST /_test/fail-next` | Test hooks | Only with `Summit:EnableTestHooks` |

### 3.5 Layouts

| Layout | Used by | Contents |
|---|---|---|
| `AppLayout` (root, `HtmxApp<AppLayout>`) | Everything | `<html lang>` from the current culture, `RzHeadOutlet`, `RzScripts`, the RizzyUI module (`rizzyui.min.js` or `rizzyui-csp.min.js` through `@Assets[...]`, with nonce), `app.css` through `@Assets`, `RzThemeProvider` with the theme from the cookie, one `RzToastProvider`, the search palette host, and `<body hx-boost="true">` |
| `PublicLayout` (default) | Public pages | Skip link, header (`RzNavigationMenu` mega menu, `RzSearchButton` plus `RzKbd` Ctrl K, my-agenda count, `RzDarkModeToggle`, culture `RzDropdownMenu`, mobile `RzSheet` navigation), `<main id="content">`, footer (`RzLink`, `RzSeparator`), `RzBackToTop` |
| `CheckoutLayout` | Checkout steps | A focused layout: logo, `RzSteps`, the order summary aside, no main navigation |
| `OrganizerLayout` | `Areas/Organizer` (via `_Imports.razor`) | `RzSidebarProvider` (`DefaultOpen` from the cookie), `Sidebar` with groups, badges and tooltips, `SidebarInset` header with `SidebarTrigger`, `RzBreadcrumb`, `RzCommandDialog` quick actions, a user `RzDropdownMenu` with sign-out |

Moving between layouts through boosted navigation (public, then sign-in, then organizer, then back)
is scenario S-01.

### 3.6 Data model and seeding

EF Core with SQLite. The schema is created with `EnsureCreated`; there are no migrations, because
it is a demo database rebuilt from the seed (decision D-10).

| Entity | Key fields | Notes |
|---|---|---|
| `Conference` | Name, City, StartsOn, EndsOn, TimeZone, Currency (EUR) | One row: "Summit 2027". The city is fictional. |
| `Day`, `Track`, `Room` | Track: Name, Color (hex, edited with `RzInputColor`) | 3 days, 5 tracks, 6 rooms |
| `Session` | Slug, Title, AbstractMarkdown, CodeSample, CodeLanguage, Level, Format (Talk, Workshop, Keynote, Lightning), TrackId, RoomId, StartsAt, Length, Capacity, Status (Draft, Published) | 96 sessions. One abstract deliberately contains `<script>` and `javascript:` links, to prove `RzMarkdown`'s safe default (D-4 of the audit). |
| `Speaker`, `SessionSpeaker` | Slug, Name, Company, Country, BioMarkdown, AvatarSeed | 64 speakers. No photos: generated SVG avatars or `AvatarFallback` initials. |
| `Sponsor` | Name, Tier, LogoSvgPath | 14 sponsors, generated wordmark SVGs |
| `TicketType` | Name, Price, Capacity, Perks, SalesStart, SalesEnd | 5 types, one sold out, one not on sale yet |
| `Workshop` | Session reference, Seats | Checkout add-ons |
| `DiscountCode` | Code (6 alphanumeric), Percent, MaxUses, Uses, ExpiresAt | Fixed known codes for tests: one valid, one expired, one used up |
| `Order`, `Attendee` | Attendee: Name, Email, Company, Country, TicketTypeId, TShirt, Dietary, BadgeCode (6 alphanumeric), CheckedInAt, Status, Tags | ~600 attendees across ~380 orders. That is enough for real paging, and it measures the client-side DataTable payload (F-1). |
| `CheckoutDraft` | VisitorId, Step, payload JSON, ExpiresAt | Server-side multi-step state |
| `AgendaItem` | VisitorId, SessionId | "My agenda" for anonymous visitors (`summit_visitor` cookie) |
| `SupportRequest` | Name, Email, Topic, Message, AttachmentName, AttachmentSize | Files are discarded after validation; only metadata is stored. |
| `FaqEntry` | Category, Question, AnswerMarkdown | 24 entries in 4 categories |
| `ApiKey` | Name, Prefix, Hash, Scopes, CreatedAt, LastUsedAt, RevokedAt | The secret is shown once and only its hash is stored. |
| `AuditEvent` | At, Actor, Action, EntityType, EntityId, DataJson | ~250 seeded events; every organizer write adds one. |
| `OrganizerAccount` | Email, PasswordHash | One account (3.7) |

**Seeding:** Bogus with a fixed seed (`Randomizer.Seed = new Random(2027)`) and a fixed reference
time. Generated dates are relative to `Conference.StartsOn`, and `TimeProvider` supplies "now". In
the `Testing` environment the clock is fixed (`Summit:Clock:FixedNow`), so "sales close in 12 days",
the countdown and the dashboard ranges are stable. The Bogus version is pinned, and a
`Summit.Tests` snapshot (counts plus a hash of key rows) fails when seeding drifts.

**Database lifecycle:** at startup, with `Summit:Database:ResetOnStart` (on in Development and
Testing), the app seeds a template file once and copies it to the working database. `POST /_test/reset`
copies the template again, which takes milliseconds. The standard and CSP servers use separate
database files.

### 3.7 Authentication

- Cookie authentication with no ASP.NET Core Identity UI: one `OrganizerAccount`, its password
  hashed with `PasswordHasher<T>`. The account's email and password come from configuration
  (`Summit:DemoOrganizer:*`, set in `appsettings.Development.json` and `appsettings.Testing.json` as
  test values and documented in the README), not from the seed code.
- `[Area("Organizer")]` controllers carry `[Authorize(Policy = "Organizer")]`. The sign-in page is
  public.
- `CookieAuthenticationEvents.UseHtmxRedirects()`: when a session expires and an htmx request hits
  the organizer area, the response is an htmx redirect to sign-in with a return URL, not the sign-in
  page swapped into a fragment (S-10).
- Antiforgery on every post: `[ValidateAntiForgeryToken]` on controllers; Rizzy attaches the token
  from the `htmx-config` meta tag.
- Sign-in validation errors return 422 with the form. A fixed delay is not added, and rate limiting
  is out of scope (it is a demo).

### 3.8 Static assets, CSP and third-party assets

- `MapStaticAssets()` plus `WithStaticAssets()` on controllers: `app.css`, the RizzyUI module and
  every code-behind module are referenced through fingerprinted URLs and served with
  `Cache-Control: max-age=31536000, immutable` in the published build.
- Tailwind 4 builds `wwwroot/css/app.css` before build, as in the starter (`SkipTailwind` supported).
- **CSP switch:** `Summit:Csp:Enabled`. When on:
  - the layout loads `rizzyui-csp.min.js` instead of `rizzyui.min.js`;
  - the response header is
    `script-src 'nonce-{n}' 'strict-dynamic'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`,
    the policy `client-runtime-and-htmx.md` documents and the smoke test uses;
  - a second header, `Content-Security-Policy-Report-Only: style-src 'self' 'nonce-{n}'`, makes inline
    styles visible without failing (F-13, decision D-4).
- **All Summit markup uses the CSP-safe Alpine subset in both modes**: method calls and property
  reads only, no assignments (`x-on:input="filter.setGlobalFilter($event.target.value)"`, not
  `x-model="filter.globalFilter"`). Anything more goes into a code-behind module. Writing it once
  keeps the two builds identical.
- **Third-party widget assets (F-12):** by default Summit serves them itself. An npm script copies
  the pinned versions into `wwwroot/lib/`, and `AddRizzyUI` overrides `AssetUrls`. This keeps CI off
  the CDN and lets a strict style policy pass. `Summit:Assets:UseCdnDefaults=true` switches back to
  RizzyUI's CDN defaults for a nightly or manual run (decision D-5).

### 3.9 Localization

- Cultures: `en-US` (default) and `de-DE`. RizzyUI ships `de` resources (`RizzyLocalization.de.resx`).
  The culture is chosen by a `.AspNetCore.Culture` cookie set from a culture `RzDropdownMenu` (the
  `POST /culture` action, then `HX-Refresh`), and `?culture=de-DE` for tests.
- Formatting follows the culture: prices (`1.234,50 €`), dates and times, `RzNumberTicker Culture`,
  `RzDateEdit` (`FlatpickrOptions.Locale = "de"`), `RzCalendarProvider Locale = "de-DE"`, and
  `<html lang>`.
- **Model binding under de-DE is tested.** `<input type="number">` and `RzSlider` post invariant
  numbers (`12.5`), while MVC binds form values with the current culture. That is a classic bug,
  and the checkout and schedule-builder forms check it.
- Translation scope (decision D-3): the recommendation is to translate Summit's chrome (navigation,
  buttons, form labels, validation messages, toasts) and leave seeded content in English, as real
  conference sites do.

### 3.10 Configuration switches

| Key | Default | Used by |
|---|---|---|
| `Summit:Csp:Enabled` | false | CSP project and published CSP run |
| `Summit:EnableTestHooks` | false (true in Testing) | `/_test/*` endpoints |
| `Summit:Database:Path`, `Summit:Database:ResetOnStart` | `App_Data/summit.db`, true outside Production | Separate files per server |
| `Summit:Clock:FixedNow` | unset (true clock) | Testing |
| `Summit:CheckIn:PollSeconds` | 5 (1 in Testing) | Check-in counter `hx-trigger="every Ns"` |
| `Summit:Assets:UseCdnDefaults` | false | F-12 |
| `Summit:DemoOrganizer:Email`, `:Password` | development values | 3.7 |

### 3.11 Code-behind components

Each one exists because a real product would need it, not to tick a box. Each has a unit test with
`mountCodeBehind` from `@jalexsocial/rizzyui/testing` under happy-dom (7.3).

| Component | Module | Where | Why it needs code | Exercises |
|---|---|---|---|---|
| `SearchPalette` | `.razor.js` | `AppLayout` | Ctrl+K / Cmd+K opens the palette; `rz:command:execute` navigates with `htmx.ajax` into `body` with a pushed URL, then closes the dialog | Window listeners released in `destroy()`, survives boosted navigation without duplicate handlers |
| `AttendeeTableState` | **`.razor.ts`** (esbuild) | Attendees | Mirrors `rz:datatable:state-changed` and `selection-changed` into hidden inputs (sort, page, page size, global filter, visibility, selected ids) for `hx-include`; updates the bulk-action count | TypeScript, a bundled import from `Features/Shared/state.ts`, `$props`, `ready()` |
| `CheckoutSummary` | `.razor.js` | Checkout | Live subtotal while quantities and add-ons change, formatted with `Intl.NumberFormat($props.Culture, {currency})`; the server remains the source of truth | `$props`, culture-aware output |
| `ScheduleFilter` | `.razor.js` | Schedule | Level `RzToggle`s hide and show the rendered cards and announce "14 sessions shown" (F-16) | Reacting to swapped children (`htmx:after:swap`), live region |
| `ConferenceCountdown` | `.razor.js` | Home | Days, hours and minutes to the opening keynote from `$props.StartsAt` and `$props.Now` (the server clock, so the fixed test clock works) | `x-load="visible"` lazy strategy, timer cleanup |

---

## 4. Page-by-page specification

Conventions for the htmx tables: **Target** is the `hx-target`; **OOB** lists out-of-band swaps
rendered through Rizzy's `IHtmxSwapService`/`HtmxSwappable`; **Headers** are response headers set
with `Response.Htmx()`. Every fragment that re-renders itself is wrapped in `RzIdScope` with a
page-unique prefix, so ids stay stable across swaps (D-21 of the audit).

Accessibility expectations that apply to every page and are not repeated below:

- one `h1`; headings in order; landmarks (`header`, `nav` with a label, `main#content`, `footer`);
  a skip link;
- axe WCAG 2.2 A/AA clean (the tags `real-components.a11y.ts` uses) in light mode, and on a subset in
  dark mode;
- no dangling `aria-*` id references (the RZUI-048 check);
- after a boosted navigation, focus goes to `main` and the document title changes (to verify with
  htmx 4 head handling in phase 1);
- results that appear without navigation are announced through a polite live region; errors through
  the form's own semantics (`aria-invalid`, `aria-describedby` to the message);
- after a 422, focus moves to the first invalid field. The server renders `autofocus` on it; htmx 4's
  handling of `autofocus` after a swap is verified in phase 3, and a small shared code-behind is the
  fallback.

### Public site

#### P1. Home (`/`)

- **Purpose:** the landing page; sells tickets and shows the event's scale.
- **Components:**
  - hero: `RzAuroraText` ("Summit 2027"), `RzTypingAnimation` (topics), `RzAnimatedGradientText`
    badge ("Early bird ends in 12 days");
  - `ConferenceCountdown` (code-behind);
  - a stats strip of `RzNumberTicker`s (speakers, sessions, attendees, countries), lazily loaded
    with `RzSkeleton` placeholders;
  - `RzCarousel` of featured speakers (`RzCard`, `RzAvatar`, `RzBadge`, Autoplay plugin; stops under
    reduced motion);
  - `RzMarquee` of sponsor logos (`PauseOnHover`);
  - a ticket card wrapped in `RzShineBorder`, with `RzButton` linking to `/tickets`;
  - `RzSearchButton` with `RzKbd` hint;
  - `RzHighlighter` on one phrase of the pitch.
- **htmx:**

  | Trigger | Request | Response | Target / swap | OOB | Headers |
  |---|---|---|---|---|---|
  | `intersect once` on the stats strip | `GET /fragments/home/stats` | Four `RzNumberTicker`s | `this`, outerHTML | none | none |

- **Errors:** if the stats fragment fails, `UseHtmxErrorHandling` keeps the skeletons and a toast
  says the numbers are unavailable (S-10).
- **Accessibility:**
  - the typing animation exposes its full text to assistive technology and does not announce each
    letter;
  - the carousel is a labelled region with named previous and next buttons, and autoplay pauses on
    focus;
  - the marquee is decorative, with sponsors also listed in the footer;
  - the aurora text has an `AriaLabel`.

#### P2. Schedule (`/schedule/{day}`)

- **Purpose:** find sessions and build a personal agenda.
- **Components:**
  - `RzTabs` per day; the tab strip sits in a horizontal `RzScrollArea` on phones;
  - track legend: `RzColorSwatch` plus `RzBadge`;
  - filter bar:
    - track chips: `RzCheckboxGroup` (`Name="track"`, F-9);
    - length range: `RzSlider` with two thumbs (`Name="length"`);
    - level `RzToggle`s through `ScheduleFilter`;
  - session cards: `RzCard`, `RzBadge`, `RzAvatar` group, `RzTooltip` on the room icon, `RzPopover`
    with room details;
  - per card, an "Add to my agenda" `RzSwitch`, each in its own small `EditForm` with a unique
    `FormName`;
  - details: an `RzSheet` with `SheetContent` whose body loads on open, an `RzSkeleton` while
    loading;
  - `RzEmpty` when filters match nothing;
  - `RzBackToTop`.
- **htmx:**

  | Trigger | Request | Response | Target / swap | OOB | Headers |
  |---|---|---|---|---|---|
  | `change` on the filter form (checkbox group, slider) | `GET /schedule/grid?day&track&length[0]&length[1]` | The grid for the active day, or `RzEmpty` | `#schedule-grid`, outerHTML | none | `HX-Push-Url` with the filter query |
  | Agenda switch `change` | `POST /agenda/{id}` (antiforgery) | The switch form | `closest form`, outerHTML | Header agenda count (`#agenda-count`, `RzBadge`) | `HX-Trigger` toast ("Added to your agenda") |
  | Sheet trigger click (also `SheetTrigger`) | `GET /fragments/sessions/{id}/details` | Details: markdown excerpt, speakers, add-to-calendar link | `#session-sheet-body` (teleported), innerHTML | none | none |

- **Errors:** an unknown session id returns 404 into the sheet body, which shows an `RzAlert`
  (through `hx-status:404`, Rizzy's `HtmxStatus.Attribute(404)`).
- **Accessibility:**
  - tabs follow the APG tabs pattern;
  - the slider has labelled thumbs (`AriaLabels`);
  - toggles report `aria-pressed`;
  - the count of shown sessions is announced politely after any filter change;
  - the sheet has a name, traps focus, closes on Escape and returns focus to its trigger.

#### P3. Session (`/sessions/{slug}`)

- **Purpose:** everything about one talk.
- **Components:**
  - `RzBreadcrumb` (Schedule › Day 2 › title);
  - `RzArticle` with `SideContent` = `RzQuickReferenceContainer`/`RzQuickReference`, and
    `RzHeading QuickReferenceTitle` for "Abstract", "Code", "Live demo", "Speakers";
  - `RzMarkdown` abstract (safe default; the seeded `<script>` must not execute or render);
  - `RzCodeViewer` with the talk's sample (C#, PowerShell or Razor; the built-in copy button);
  - "Live demo": `RzBrowser` with a `Layout`, so the demo widget renders in an `RzEmbeddedPreview`
    iframe and switches between desktop, tablet and phone widths;
  - video placeholder in `RzAspectRatio` (16/9);
  - speakers: `RzItem` list with `RzAvatar`;
  - share link: `RzClipboard` with `ClipboardFeedback`;
  - an agenda `RzSwitch` (the same component as on P2);
  - `RzBackToTop`.
- **htmx:** only the agenda switch (as in P2).
- **Errors:** an unknown slug or a draft session returns 404, the `NotFound` page inside
  `PublicLayout`.
- **Accessibility:**
  - the quick reference is a `nav` with a label and marks the current section;
  - the code viewer's copy button has a name, and copy success is announced;
  - the iframe has a `title`.

#### P4. Speakers (`/speakers`)

- **Purpose:** search 64 speakers.
- **Components:**
  - search: `RzInputGroup` with `InputGroupAddon` icon, `InputGroupInput` (`Role` Search), and a
    clear `InputGroupButton`;
  - results: `RzCard` grid with `RzAvatar`, the matched part of the name wrapped in
    `RzHighlighter Action="Highlight"`, `RzBadge` for country;
  - `RzPagination` (links carry `hx-get`/`hx-push-url`);
  - `RzSpinner` as `hx-indicator`;
  - `RzEmpty` with a "Clear search" action.
- **htmx:**

  | Trigger | Request | Response | Target / swap | OOB | Headers |
  |---|---|---|---|---|---|
  | `input changed delay:300ms, search` | `GET /speakers?q&page=1` (partial) | Results and pager | `#speaker-results`, outerHTML | none | `HX-Push-Url` |
  | Pager link click | `GET /speakers?q&page=n` | Results and pager | `#speaker-results` | none | `HX-Push-Url` |

- **History:** Back restores the previous query and page, and the input shows the restored query
  (htmx 4 re-requests history entries; `Request.Htmx().IsHistoryRestore` renders the full page).
- **Accessibility:**
  - "12 speakers match 'ann'" is announced politely;
  - the highlighter is decorative, and the match text stays plain text in the name;
  - pagination is a labelled `nav` with `aria-current="page"`.

#### P5. Tickets and checkout (`/tickets`, `/tickets/checkout/{step}`)

- **Purpose:** buy tickets: four steps, server-validated, culture-aware prices.
- **Layout:** `CheckoutLayout`, with `RzSteps` across the top (Tickets › Attendees › Payment ›
  Done) and an order summary aside (`RzCard`, `RzTable`, `CheckoutSummary`).
- **Steps and components:**
  1. **Tickets:**
     - ticket type: `RzRadioGroup` (cards with indicators; the sold-out type is `Disabled`;
       `Name="Model.TicketTypeId"`, F-9);
     - quantity: `RzInputNumber`;
     - workshops: `RzCheckboxGroup` add-ons;
     - perks per ticket type: `RzAccordion`.
  2. **Attendees** (one `RzFieldSet` per ticket):
     - name and email: `RzInputText`;
     - company: `RzCombobox` (`Create` allowed);
     - country: `RzCombobox` with ~250 items and `ComboboxVirtualScrollPlugin`;
     - T-shirt: `RzNativeSelect`;
     - accessibility needs: `RzInputTextArea`;
     - layout: `RzFormSection`.
  3. **Payment:**
     - discount code: `RzInputOTP` (6, alphanumeric, uppercase, `Name="Model.DiscountCode"`) with
       an Apply button;
     - simulated payment method: `RzRadioGroup` (Invoice, Demo payment; no card fields);
     - code of conduct: `RzInputCheckbox` (required);
     - newsletter: `RzSwitch`;
     - "This is a demo; no payment is taken": `RzAlert`.
  4. **Done:**
     - `RzConfetti` (`Trigger="CustomEvent"`, fired by `HX-Trigger: rz:confetti`);
     - a ticket card in `RzShineBorder`;
     - badge codes with `RzClipboard`;
     - a toast.
- **htmx:**

  | Trigger | Request | Response | Target / swap | OOB | Headers |
  |---|---|---|---|---|---|
  | Step form submit | `POST /tickets/checkout/{step}` | 200: next step's form | `#checkout-step`, outerHTML | `#checkout-steps` (`RzSteps` re-rendered), `#order-summary` | `HX-Push-Url: /tickets/checkout/{next}` |
  | Step form submit, invalid | same | **422**, same step with errors and posted values | `#checkout-step` | none | none |
  | Apply discount | `POST /tickets/checkout/discount` | 200: OTP field in its applied state | `#discount-field`, outerHTML | `#order-summary` | toast |
  | Apply discount, invalid | same | **422** with `FieldError` ("expired", "used up", "unknown") | `#discount-field` | none | none |
  | Final submit | `POST /tickets/checkout/payment` | 200: confirmation | `#checkout` | `#checkout-steps` (all completed) | `HX-Push-Url: /tickets/confirmation/{id}`, `HX-Trigger: rz:confetti` and the toast batch (F-6) |
  | Final submit, sold out meanwhile | same | **422** with a form-level `RzAlert` | `#checkout-step` | `#order-summary` | none |

- **State:** a `CheckoutDraft` keyed by the visitor cookie. A direct GET of a later step redirects
  to the first incomplete step. Back and Forward move between steps and show the saved values.
- **Validation:**
  - Data Annotations plus server rules (capacity, workshop seats, email unique per order);
  - `RzModelStateProvider` in each form;
  - `RzValidationMessageBase` inside `FieldError`;
  - decimal and number binding checked under de-DE (3.9).
- **Accessibility:**
  - `RzSteps` exposes the current step (`aria-current="step"`);
  - the radio group uses one tab stop with arrow keys;
  - the combobox follows the combobox pattern;
  - OTP slots form one named input;
  - errors are linked to their fields, and focus moves to the first error after a 422;
  - confetti is skipped under reduced motion (`DisableForReducedMotion`), and the success message
    does not depend on it.

#### P6. Help (`/help`)

- **Purpose:** answers and a contact form.
- **Components:**
  - FAQ: `RzAccordion` (`Single`), grouped by category, answers in `RzMarkdown`, with
    `RzQuickReference` over the categories;
  - "Still stuck?": `RzCollapsible`;
  - contact form:
    - fields: `RzInputText`, `RzNativeSelect` topic, `RzInputTextArea`;
    - attachment: `RzFileInput` (`Variant="Dropzone"`, `Accept=".png,.jpg,.pdf"`,
      `Name="Model.Attachment"`);
    - progress: `RzProgress` (indeterminate) as the `hx-indicator` (F-8);
    - success: `RzAlert`.
- **htmx:**

  | Trigger | Request | Response | Target / swap | OOB | Headers |
  |---|---|---|---|---|---|
  | Submit (`hx-encoding="multipart/form-data"`) | `POST /help/contact` | 200: the form, reset, with a success alert | `#contact-form`, outerHTML | none | toast |
  | Submit, invalid (missing fields, file larger than 2 MB, wrong type) | same | **422**, errors, text values kept (the file must be chosen again: expected browser behavior, and the error says so) | `#contact-form` | none | none |

- **Accessibility:**
  - accordion buttons report `aria-expanded`;
  - the file control is reachable by keyboard and named;
  - the progress bar is named while visible.

#### P7. Sign-in, errors

- **Sign-in** (`/account/sign-in`): an `RzCard` with `RzInputText` (Email and Password roles) and
  `RzButton`. A 422 shows one form-level error. In Development and Testing an `RzAlert` shows the
  demo account, read from configuration. Success sets `HX-Location` (or `HX-Redirect` for a
  non-boosted post) to the return URL.
- **404 and 500:** rendered inside `PublicLayout` (as in the starter), with `RzEmpty` and links home.
  `POST /_test/fail-next` makes the next fragment request throw, which tests the
  `rz:server-error` path without a real bug.

### Organizer area (`/organizer`, signed in)

#### O1. Dashboard (`/organizer`)

- **Purpose:** sales and attendance at a glance, filtered by date range and track.
- **Components:**
  - filter form `#dashboard-filters`:
    - date range: `RzCalendar Mode="MultipleRanged"` inside `RzCalendarProvider` (`Locale` from
      the culture) in an `RzPopover` (F-14), with hidden `from`/`to` inputs bound to the provider
      state;
    - quick ranges: `RzButtonGroup` (7 days, 30 days, all), each with `hx-vals`;
    - track: `RzNativeSelect`;
  - stats: `RzNumberTicker` in `RzCard`s (revenue, tickets, checked in, conversion);
  - charts: `RzChart` line (registrations per day), doughnut (tickets by type), bar (sessions per
    track);
  - capacity: `RzProgress` per ticket type;
  - recent orders: `RzTable` with `TablePagination` and `RzPagination`;
  - live check-in: an `RzIndicator` dot linking to the check-in desk;
  - placeholders: `RzSkeleton`s on first load;
  - `RzEmpty` when a range has no data.
- **htmx:**

  | Trigger | Request | Response | Target / swap | OOB | Headers |
  |---|---|---|---|---|---|
  | `load` (first render) | `GET /organizer/dashboard/panels` with `hx-include="#dashboard-filters"` | Charts region | `#dashboard-charts`, outerHTML | `#stat-revenue`, `#stat-tickets`, `#stat-checkedin`, `#stat-conversion`, `#recent-orders`, `#capacity` | none |
  | `change` on the filter form; a quick-range button | same | same, or `RzEmpty` in each region | same | same | `HX-Push-Url` with the filter query |
  | Orders pager link | `GET /organizer/dashboard/orders?page&from&to&track` | Orders table | `#recent-orders` | none | none |

- **Expected:** one request per filter change; every region reflects the same filter. `hx-sync`
  drops a stale request when filters change quickly. Each `RzChart` is replaced, so the old Chart.js
  instance is destroyed (no leaked canvases).
- **Accessibility:**
  - each chart has an `AriaLabel` and a visually hidden data table summary;
  - the stats region is a polite live region that announces once per filter change, not once per
    ticker frame.

#### O2. Attendees (`/organizer/attendees`)

- **Purpose:** find and manage 600 attendees.
- **Components:**
  - `RzDataTable<AttendeeRow>` (a DTO without email verification tokens or internal fields), in
    `RzTable` markup:
    - grouped headers ("Contact": email, company);
    - `DataTableSortToggle`/`DataTableSortIcon`;
    - `DataTableSelectionHeaderCell` and `DataTableSelectionCell`;
    - a global filter input (`x-on:input="filter.setGlobalFilter($event.target.value)"`);
    - column visibility in an `RzDropdownMenu` (`toggleColumnVisibility('company')`);
    - page size: `RzNativeSelect`;
    - pager controls bound to the `pagination` API;
  - server filters: status and ticket type `RzNativeSelect`s, which re-render the table;
  - per row: an `RzDropdownMenu` (teleported) with Edit, Resend ticket, Check in;
  - `RzBadge` for status;
  - `AttendeeTableState` (TypeScript);
  - bulk bar: selected count, then actions confirmed with `RzAlertDialog`;
  - editor: an `RzSheet` swapped in open (F-2), containing an `EditForm` with `RzInputText`,
    `RzNativeSelect` ticket type, `RzCombobox` tags (`Multiple`, `Create`), `RzInputTextArea`
    notes.
- **htmx:**

  | Trigger | Request | Response | Target / swap | OOB | Headers |
  |---|---|---|---|---|---|
  | Server filter `change` | `GET /organizer/attendees/table` with `hx-include` of filters and `#attendee-table-state` | A new `RzDataTable` whose `InitialState` comes from the state inputs | `#attendee-table`, outerHTML | none | `HX-Push-Url` |
  | Row menu "Edit" | `GET /organizer/attendees/{id}/edit` | `RzSheet DefaultOpen` with the form | `#attendee-editor`, innerHTML | none | none |
  | Editor save, invalid | `POST /organizer/attendees/{id}` | **422**, form with errors | `#attendee-edit-form`, outerHTML | none | none |
  | Editor save, valid | same, `hx-include="#attendee-table-state"` | Empty body | none (`hx-swap="none"`) | `#attendee-table` (new table, same state), `#attendee-editor` emptied (closes the sheet) | toast |
  | Bulk action confirm | `POST /organizer/attendees/bulk` with `ids` from `AttendeeTableState` | Empty body | none | `#attendee-table` | toast ("12 attendees checked in"), and `HX-Trigger` with the alert dialog's own `CloseEventName` (F-3) |

- **Accessibility:**
  - the table has a caption, sortable headers report `aria-sort`, and sorting, filtering and
    paging are announced (built in);
  - row checkboxes are named by attendee;
  - focus returns to the row's menu button after the sheet closes (to verify, F-2);
  - the alert dialog does not close on Escape (`CloseOnEscape` false by default) and Cancel returns
    focus.

#### O3. Check-in desk (`/organizer/check-in`), designed for phones first

- **Purpose:** door staff scan or type a badge code.
- **Components:**
  - `RzInputOTP` (6, alphanumeric, uppercase) in a form with `RzButton` and an `RzSpinner`
    indicator;
  - result: `RzItem` with `RzAvatar`, `RzBadge` ticket type, and an `RzAlert` (success, warning
    "already checked in at 09:12", destructive "unknown code");
  - live counter: `RzNumberTicker`, `RzProgress` against capacity, and an `RzIndicator` "live" dot;
  - recent check-ins: `RzTable`.
- **htmx:**

  | Trigger | Request | Response | Target / swap | OOB | Headers |
  |---|---|---|---|---|---|
  | Submit, or `rz:inputotp:onchange` when complete (verify the event fires on completion; otherwise submit only) | `POST /organizer/check-in` | 200: result card, form reset | `#checkin-form`, outerHTML | `#checkin-counter`; a new row **prepended** to `#recent-checkins tbody` (`SwapStyle.afterbegin`) | toast |
  | Already checked in | same | 200 with a warning alert | same | none | none |
  | Unknown code | same | **422** with `FieldError` | same | none | none |
  | `every {PollSeconds}s` | `GET /organizer/check-in/counter` | Counter | `#checkin-counter`, outerHTML | none | none |

- **Expected:** a check-in made from a second device appears in the first device's counter within
  one poll (S-05). Polling does not pile up requests (`hx-sync`).
- **Accessibility:**
  - the OTP field is named "Badge code";
  - the result is announced (status for success, alert for errors);
  - counter updates are not announced on every poll.

#### O4. Schedule builder (`/organizer/schedule-builder`)

- **Purpose:** edit sessions, times and track colors.
- **Components:**
  - `RzMenubar`: File (New session `hx-get`, Duplicate, Publish all with `RzAlertDialog`), View
    (show tracks as `MenubarCheckboxItem`s, density as a `MenubarRadioGroup`), Help (shortcuts with
    `RzKbd`);
  - session list: `RzScrollArea` of `RzItem`s with `RzBadge` and `RzColorSwatch`;
  - editor `EditForm`:
    - title: `RzInputText`;
    - start: `RzDateEdit` with `EnableTime`, locale from the culture;
    - length in minutes: `RzSlider`, single thumb;
    - capacity: `RzInputNumber`;
    - room: `RzNativeSelect`;
    - track color: `RzInputColor`;
    - published: `RzSwitch`;
    - delete: `RzAlertDialog`;
  - toolbar: `RzButtonGroup`.
- **htmx:**

  | Trigger | Request | Response | Target / swap | OOB | Headers |
  |---|---|---|---|---|---|
  | List item click | `GET /organizer/schedule-builder/sessions/{id}` | Editor | `#session-editor`, outerHTML | none | `HX-Push-Url` |
  | Save, invalid (room clash, outside conference days, capacity above room size) | `POST …/sessions/{id}` | **422** | `#session-editor` | none | none |
  | Save, valid | same | Editor | `#session-editor` | The list item `#session-item-{id}` (new time, color) | toast |
  | Delete confirm | `POST …/sessions/{id}/delete` | Empty editor (`RzEmpty`) | `#session-editor` | List item removed (`SwapStyle.delete` or an empty replacement) | toast |

- **Accessibility:**
  - the menubar follows the APG menubar pattern with arrow keys;
  - checkbox and radio items report their state;
  - the color input has a text alternative (the hex value);
  - the date input's built-in `aria-label` overriding the field label is a known RzDateEdit issue
    (from its docs), which Summit should surface.

#### O5. Settings (`/organizer/settings/{section}`)

- **Purpose:** event preferences, appearance, API keys, audit log, developer tools.
- **Components:**
  - `RzTabs` (vertical on desktop), with each tab's panel content loaded lazily through `hx-get`
    with `hx-trigger="intersect once"`, plus `RzSkeleton`.
  - **General** (`RzFormSection`s):
    - event name: `RzInputText`;
    - registration open and check-in open: `RzSwitch`es;
    - time zone: `RzNativeSelect`;
    - language: the culture switch.
  - **Appearance:**
    - theme: `RzRadioGroup` (Summit, Arctic, Vercel; F-15) saved with `HX-Refresh`;
    - `RzDarkModeToggle`;
    - a preview of the ticket confirmation email in `RzEmbeddedPreview` (direct use).
  - **API keys:**
    - an `RzTable` of keys;
    - "Create key": an `RzDialog` with a form (name, scopes as `RzCheckboxGroup`). Its success
      view shows the secret once in an `RzInputGroup` with `RzClipboard`, and a curl example in
      `RzCodeViewer`;
    - revoke: `RzAlertDialog`;
    - scope help: `RzPopover`;
    - icon buttons: `RzTooltip`.
  - **Audit log:**
    - an `RzTable` with `RzPagination`;
    - each entry's JSON in `RzCollapsible` with `RzCodeViewer`.
  - **Developer:**
    - a "webhook console": `RzEventViewer` listening to `summit:webhook` on `window`;
    - "Send test event" returns `HX-Trigger` with a detail payload, which the viewer logs;
    - keyboard shortcuts listed with `RzKbdGroup`.
- **htmx:**

  | Trigger | Request | Response | Target / swap | OOB | Headers |
  |---|---|---|---|---|---|
  | Save general | `POST /organizer/settings/general` | Form, or 422 | `#settings-general`, outerHTML | none | toast |
  | Save theme | `POST /preferences/theme` | Empty | none | none | `HX-Refresh: true` |
  | Create API key | `POST /organizer/settings/api-keys` | Dialog body: the secret, once; or 422 | `#create-key-body` (teleported) | `#api-keys-table` | toast |
  | Revoke key | `POST /organizer/settings/api-keys/{id}/revoke` | Empty | none | `#api-keys-table` | per-dialog close event, toast |
  | Send test event | `POST /organizer/settings/developer/ping` | Empty | none | none | `HX-Trigger: {"summit:webhook": {...}}` |

- **Accessibility:**
  - vertical tabs use Up and Down arrows;
  - the secret is in a read-only input with a named copy button, and copy success is announced;
  - the event viewer's pause, clear and copy buttons are named.

### Global

- **Search palette (public):**
  - `RzDialog` + `RzCommand ItemsUrl="/api/search" ServerFiltering="true"`;
  - `CommandItemTemplate` renders sessions, speakers and pages in groups;
  - `SearchPalette` handles the keyboard shortcut and navigation (F-7).
- **Quick actions (organizer):** `RzCommandDialog` with static `CommandItem`s (go to pages,
  "Check in attendee", "New session"), opened by its `EventTriggerName`.
- **Toasts:**
  - one `RzToastProvider` in `AppLayout`;
  - server toasts through `IRzToastService`;
  - client toasts through `Rizzy.toast` (in code-behind only).

---

## 5. Component coverage matrix

Every root component folder under `src/RizzyUI/Components`. "Pages" use the ids from section 4.
**Depth** marks what Summit exercises beyond rendering: **I** interaction, **H** htmx swap or
re-render, **F** form posting and validation, **C** CSP-relevant behavior.

| Folder | Component (subcomponents) | Where Summit uses it | Depth | Not covered, and why |
|---|---|---|---|---|
| DataTable | `RzDataTable` (sort toggle and icon, selection cells, select-all, row select) | O2 | I H C | Server paging (F-1) |
| DataTable | `RzTable` (header, body, footer, row, header cell, cell, caption, `TablePagination`) | O1, O3, O5, P5 summary | H | |
| Display | `RzAvatar` (image, fallback, badge, group, group count) | P1, P2, P3, P4, O2, O3, organizer user menu | | |
| Display | `RzBadge` | Throughout | | |
| Display | `RzChart` | O1: line, doughnut, bar | H C | Radar, bubble, polar area and scatter: the docs cover them, and a product dashboard has no use for them |
| Display | `RzConfetti` | P5 Done (`CustomEvent` through `HX-Trigger`) | H | Click, hover and visible triggers |
| Display | `RzIndicator` | O1, O3 | | |
| Display | `RzMarquee` | P1 | | Vertical orientation |
| Display | `RzProgress` (indicator, label) | O1, O3, P6 indeterminate | H | |
| Display | `RzSeparator` | Layouts | | |
| Document | `RzArticle` | P3 | | |
| Document | `RzBrowser` | P3 (with `Layout`) | I C | |
| Document | `RzCodeViewer` | P3, O5 | I | |
| Document | `RzEmbeddedPreview` | P3 through `RzBrowser`; O5 direct | C | |
| Document | `RzEventViewer` | O5 webhook console | I H | |
| Document | `RzMarkdown` | P3, P4 bios, P6 FAQ | | Safe default tested; `AllowUnsafeHtml` is deliberately not used |
| Document | `RzQuickReference` (container) | P3, P6 | I | |
| Feedback | `RzAlert` | P5, P6, P7, O3 | H | |
| Feedback | `RzAlertDialog` | O2 bulk, O4 delete and publish, O5 revoke | I H | |
| Feedback | `RzDialog` | Search palette, O5 create key | I H C | |
| Feedback | `RzEmpty` | P2, P4, O1, O4, errors | H | |
| Feedback | `RzPopover` | P2 room, O1 date range, O5 scope help | I | |
| Feedback | `RzSheet` | P2 details, O2 editor, public mobile nav, sidebar on phones (internal) | I H | Server-driven close (F-2) |
| Feedback | `RzSkeleton` | P1, P2, O1, O5 | H | |
| Feedback | `RzSpinner` | P4, O3 | H | |
| Feedback | `RzToast` (`RzToastProvider`, `IRzToastService`) | Global | H | |
| Feedback | `RzTooltip` | P2, O5, organizer sidebar collapsed (`SidebarMenuButton Tooltip`) | I | |
| Form | `Field` family (`Field`, `FieldLabel`, `FieldError`, `FieldDescription`, `FieldContent`, `FieldLegend`, `FieldSeparator`, `FieldTitle`, `RzFieldGroup`, `RzFieldSet`) | Every form | F | |
| Form | `Label` | Not used | | The folder is empty; `FieldLabel` replaces it |
| Form | `InputGroup` (addon, button, input, textarea, text) | P4, O5 | I | `InputGroupTextarea` |
| Form | `RzButton` | Throughout | | |
| Form | `RzButtonGroup` (separator, text) | O1, O4 | | |
| Form | `RzCalendar`, `RzCalendarProvider` | O1 range | I F C | Month and year calendar types |
| Form | `RzCheckboxGroup` (item, indicator) | P2, P5, O5 | F | |
| Form | `RzInputCheckbox` | P5 | F | |
| Form | `RzColorPickerProvider` (`RzColorPickerTrigger`) | O4 through `RzInputColor` | I C | Direct use |
| Form | `RzColorSwatch` | P2 legend, O4 | | |
| Form | `RzCombobox` | P5 country (virtual scroll), company (create); O2 tags (multiple) | I F C | Remote items (not supported) |
| Form | `RzDateEdit` | O4 | I F C | Range mode (F-14) |
| Form | `RzFileInput` | P6 dropzone | I F | |
| Form | `RzFormSection` | P5, O5 | | |
| Form | `RzInputColor` | O4 | I F C | |
| Form | `RzInputNumber` | P5, O4 | F | |
| Form | `RzInputOTP` (group, slot, separator) | P5 discount, O3 badge | I F C | |
| Form | `RzInputText` | Every form | F | |
| Form | `RzInputTextArea` | P5, P6, O2 | F | |
| Form | `RzNativeSelect` (option, optgroup) | P5, P6, O1, O2, O4, O5 | F | |
| Form | `RzRadioGroup` (item, indicator) | P5, O5 theme | I F | |
| Form | `RzSlider` | P2 range, O4 single | I F | |
| Form | `RzSwitch` | P2/P3 agenda, P5, O4, O5 | I F | |
| Form | `RzToggle` | P2 levels | I | |
| Interactivity | `RzAlpineComponent` | 5 code-behind components (3.11) | I H C | |
| Internal | `RzModalPrimitive` | Through dialogs and sheets | | Internal |
| Layout | `RzAccordion` | P5 perks, P6 FAQ | I | `Multiple` type |
| Layout | `RzAspectRatio` | P3 | | |
| Layout | `RzCard` | Throughout | | |
| Layout | `RzCarousel` | P1 (Autoplay) | I H | Vertical axis; other plugins |
| Layout | `RzCollapsible` | P6, O5 | I | |
| Layout | `RzItem` (group, separator, media, content, title, description, actions, header, footer) | P3, O3, O4 | | |
| Layout | `RzSearchButton` | Public header, P1 | | |
| Layout | `RzSteps`/`RzStep` | P5 (out-of-band re-render) | H | Vertical orientation |
| Navigation | `RzBreadcrumb` | P3, organizer header | | |
| Navigation | `RzCommand` (input, list, empty, group, item, template, separator, shortcut), `RzCommandDialog` | Global search (remote), organizer quick actions (static) | I C | |
| Navigation | `RzDropdownMenu` (all parts, including sub-menus) | O2 row actions and columns, culture switch (sub-menu), user menu | I H | |
| Navigation | `RzLink` | Footer, content | | |
| Navigation | `RzMenubar` (all parts) | O4 | I | |
| Navigation | `RzNavigationMenu` | Public header mega menu | I | |
| Navigation | `RzPagination` | P4, O1, O5 | H | |
| Navigation | `RzScrollArea` | P2 tab strip, O4 list | | |
| Navigation | `RzSidebar` (all parts) | `OrganizerLayout` | I C | Right side, floating and inset variants |
| Navigation | `RzTabs` | P2 days, O5 sections (vertical) | I H | |
| SpecialEffects | `RzShineBorder` | P1, P5 | C | |
| Text | `RzAnimatedGradientText` | P1 | | |
| Text | `RzAuroraText` | P1 | | |
| Text | `RzHighlighter` | P1, P4 | H | |
| TextAnimations | `RzNumberTicker` | P1, O1, O3 | H | |
| TextAnimations | `RzTypingAnimation` | P1 | | |
| Theme | `RzDarkModeToggle` | Both layouts, O5 | I | |
| Theme | `RzThemeProvider` (`RzTheme`, `ThemeLoader`) | `AppLayout`, O5 | | |
| Typography | `RzHeading`, `RzParagraph` | Throughout (`QuickReferenceTitle` on P3) | | |
| Typography | `RzKbd`, `RzKbdGroup` | Header hint, O4, O5 | | |
| Utility | `RzBackToTop` | P2, P3, P4 | I | |
| Utility | `RzClipboard` (trigger, feedback) | P3, P5, O5 | I | |
| Utility | `RzIdScope` | Every self-re-rendering fragment | H | |

**Summary:** every public root component is used, except the empty `Label` folder and the internal
`RzModalPrimitive`. The variant-level gaps in the right-hand column are intentional: they are
catalog breadth, which the docs site's examples cover.

---

## 6. Orchestration scenarios

Each scenario becomes one Playwright spec in `tests/e2e/scenarios/`, named by id. All of them run in
the standard and CSP projects. **M** marks scenarios that also run on the mobile project. Every
scenario asserts, in addition to its own expectations:

- no page errors;
- no console errors and no `Alpine Expression Error` warnings;
- no unexpected HTTP status of 400 or above;
- no CSP `script-src` violations.

The helpers come from the docs suite's `collectPageErrors` and `collectCspViolations`.

| Id | Scenario | Steps | Expected behavior |
|---|---|---|---|
| S-01 **M** | Layouts and history | Home → Schedule (boosted) → Sign in → Dashboard → Back ×3 → Forward | Each page renders in its own layout (public, organizer, checkout). The title changes and focus lands in `main`. Alpine components in the new content start once. Back and Forward restore pages that work: tabs switch, the sheet opens. No duplicate window listeners (`countGlobalListeners` stays flat). |
| S-02 | Dashboard filters | Pick a 7-day range in the calendar popover, change track, press "All" | One request per change. Charts, tickers, capacity and the orders table all show the same filter. The URL holds the filters; Back restores the previous filter. A range with no sales shows `RzEmpty` in every region. No Chart.js instance leaks (the count of `Chart.instances` equals the number of charts). |
| S-03 | Attendee edit loop | Sort by company, go to page 3, hide "Country", filter "acme"; open a row menu → Edit; save with an invalid email; fix it; save | The menu content is teleported and its `hx-get` works. The sheet opens with focus inside. The 422 keeps the sheet open with the error and focus on the field. A valid save closes the sheet, replaces the table with **the same sort, page, hidden column and filter**, shows the new value, toasts, and returns focus to a sensible element (see F-2). |
| S-04 | Bulk action | Select 3 rows on page 1 and 2 on page 2; Bulk → Check in; Cancel; again → Confirm | The bulk bar shows "5 selected". Cancel keeps the selection and returns focus to the Bulk button. Confirm posts 5 ids, the table refreshes with the new statuses, the toast says 5, and the selection is cleared. |
| S-05 **M** | Check-in with two devices | Device A on check-in; device B checks in code X; A types X; A types an unknown code | A's counter rises within one poll after B's check-in. A sees "already checked in" for X. An unknown code shows 422 with the field error. A new row is prepended to the recent list. The polling interval does not stack requests. |
| S-06 **M** | Checkout end to end | Choose 2 tickets plus a workshop; submit attendee 2 incomplete; complete; apply an expired code, then a valid code; Back to Attendees; Forward; pay | Step and summary update out of band. The 422s keep the posted values (including combobox and checkbox group values, F-9). The discount updates the summary. Back and Forward show saved values. Payment pushes `/tickets/confirmation/{id}`, fires `rz:confetti` and the toast; copy-badge works. |
| S-07 **M** | Schedule composition | Day 2 tab; toggle "Advanced"; choose 2 tracks; narrow length; add a session to my agenda; open its details | The toggle filters on the client and announces the count. Server filters swap the grid and push the URL. After the swap the level toggle still applies (`ScheduleFilter` reacts to `htmx:after:swap`). The agenda switch updates the header count out of band and toasts. The sheet body loads once and shows the skeleton first. |
| S-08 | Search palette | Ctrl+K on Home; type "htmx"; arrow down; Enter. Then Ctrl+K on the session page; Escape | The palette opens with focus in the input; results come from `/api/search?q=htmx` and are grouped. Enter navigates through htmx with a pushed URL and closes the palette. After the navigation, Ctrl+K opens it exactly once (no duplicate listeners). Escape closes it and returns focus. |
| S-09 | Overlays inside swapped content | On Attendees, open a row menu, then change a server filter (the table, including the open menu's owner, is replaced); repeat 10 times; on O1, open the date popover and change the range | No teleported panels are left in `body`, global listener count stays flat, and the `body` scroll lock is released (the RZUI-028 assertions on a real page). |
| S-10 | Failure paths | `/_test/fail-next`, then load the dashboard panels; expire the auth cookie, then filter attendees; open a session with an unknown id | A 500 is not swapped and `rz:server-error` produces an error toast while the skeletons stay. An expired session on an htmx request goes to sign-in with a return URL and then back. An unknown id gives 404 inside the layout. |
| S-11 | Theme and dark mode | Toggle dark on the dashboard; change theme to Vercel; navigate; reload | The dark class applies without a flash on reload. Chart colors follow (**fails until F-5 is fixed**). The theme survives boosted navigation and a full reload. |
| S-12 | Culture | Switch to de-DE; check prices, dates and tickers; edit a session start and capacity in the schedule builder; buy a ticket | German formatting everywhere, German RizzyUI strings (for example the close-button names), `lang="de"`. Number and decimal values bind correctly on the server. The date editor and calendar use German month names. |
| S-13 | Code-behind lifecycle | Load pages with each code-behind; swap their regions; in the published run, request a page rendered before a redeploy | Each module URL is fingerprinted and served immutable. Each element gets its data once. The TypeScript module runs and its bundled import works. `ready()` runs after a child dialog started. The fallback URL is used when the fingerprint is stale. |
| S-14 | Lazy loading | Scroll Home to the stats; open Settings › Audit log; return to the tab | Fragments load once on intersection (one request each). Skeletons show first. Tickers animate (or show final values under reduced motion). |
| S-15 | Upload | Submit with a 3 MB file, a `.exe`, then a valid PDF | The 422s name the problem and keep the text fields. The indicator is visible during the request. Success resets the form with an alert and a toast. |
| S-16 **M** | Phone layouts | At 390×844: public nav sheet, organizer sidebar sheet, table, checkout | No horizontal page scroll (`scrollWidth <= innerWidth`). Navigation sheets open, trap focus and close. Wide tables scroll inside their wrapper. Tap targets are at least 24×24 px (WCAG 2.5.8). |

---

## 7. Test strategy

### 7.1 Layers

| Layer | Tool | Runs | Covers |
|---|---|---|---|
| HTTP contracts | xUnit + `WebApplicationFactory` (`tests/Summit.Tests`) | `dotnet test`, seconds | Seeding snapshot (3.6); status codes (200, 404, 422) and posted-value echo; HX headers (`HX-Trigger` JSON, `HX-Push-Url`, `HX-Refresh`); out-of-band markup present for each OOB row in section 4; auth redirects (normal and htmx); CSP header shape and nonce on every script; antiforgery rejection; field names (F-9) |
| Code-behind units | `node --test` + happy-dom + `mountCodeBehind` from `@jalexsocial/rizzyui/testing` | `npm test` in `src/Summit.Web` | `SearchPalette`, `AttendeeTableState` (TypeScript, compiled by esbuild first), `CheckoutSummary`, `ScheduleFilter`, `ConferenceCountdown` |
| Browser flows | Playwright (`tests/e2e`) | Locally against the dev servers; in CI against the published app | Page specs (section 4), scenarios (section 6), axe |

### 7.2 Playwright projects

One `playwright.config.ts` in `tests/e2e`. Unlike the docs suite, specs are not split into `*.csp.spec.ts`
files: **every spec runs in both the `standard` and `csp` projects**, and the project only changes
`baseURL`. That keeps the two builds from drifting.

| Project | Server | Device | Specs |
|---|---|---|---|
| `standard` | `:5260` (`Summit:Csp:Enabled=false`) | Desktop Chrome | all |
| `csp` | `:5261` (`Summit:Csp:Enabled=true`) | Desktop Chrome | all, plus `cspViolations` must be empty after each test |
| `mobile` | `:5261` (CSP, since phones are where real deployments are strictest) | Pixel 7 (Chromium) | specs tagged `@mobile` |

- **Local servers:** `webServer` runs `dotnet run --no-build` for Summit.Web twice, with separate
  database paths, `ASPNETCORE_ENVIRONMENT=Testing`, and `reuseExistingServer` outside CI.
- **External servers:** when `SUMMIT_BASE_URL` and `SUMMIT_CSP_BASE_URL` are set, `webServer` is
  skipped and the suite runs against already-running servers. CI's published run uses this, the way
  the smoke test uses `SMOKE_BASE_URL`.
- **Authentication:** a setup project signs in once per server and saves `storageState`. Organizer
  specs reuse it; S-10 deletes it on purpose.

### 7.3 Accessibility

- `specs/axe.spec.ts` iterates over a **route list** that covers every page in section 4 (public,
  checkout steps reached by a helper, organizer). Each route gets an axe scan with the WCAG tags from
  `real-components.a11y.ts`, plus the dangling-aria-reference check.
- Some states are scanned again: open sheet, open dialog, open command palette, a 422 form, an empty
  state, and dark mode on 5 key pages.
- The route list is checked against the controllers' routes in `Summit.Tests`: a new page without an
  axe entry fails.
- Scenario specs check focus and announcements (the live region text) where section 4 states them.

### 7.4 Flakiness controls

The docs suite's policy stays: **`retries: 0`**, `workers: 1`, `trace: 'retain-on-failure'`. The
controls that make that sustainable:

- **Deterministic data and time:**
  - a fixed Bogus seed and a fixed clock (`Summit:Clock:FixedNow`);
  - `POST /_test/reset` in `beforeAll` of each spec file;
  - specs never depend on other specs' writes.
- **No sleeping:**
  - no `waitForTimeout`;
  - wait for the specific response (`page.waitForResponse`) or `expect.poll`/web-first assertions;
  - polling is 1 s in Testing, and S-05 waits on the counter response, not on time.
- **Motion off:**
  - `reducedMotion: 'reduce'` in the config;
  - tests assert the final ticker values, the typing text and confetti's event (not canvas pixels);
  - effects that ignore reduced motion are reported as findings, not hidden.
- **Hermetic assets:** widget libraries served by Summit (F-12), fonts local, and no outbound
  requests. A route guard fails the test on any request to a host other than the app.
- **Isolation between projects:** separate database files and ports per server.
- **Quarantine instead of retries:** a flaky test gets `test.fixme` with an issue link within a
  day. `grep-invert @quarantine` is not used, so quarantined tests stay visible in the report.

### 7.5 Runtime budget

Estimates to verify in phase 1:

| Part | Budget |
|---|---|
| Build and publish Summit (Package mode), including npm ci, Tailwind, esbuild | ~2 min |
| `Summit.Tests` | < 30 s |
| Playwright: ~30 page and scenario specs × 2 projects + mobile subset + axe route list | 4–6 min |
| **Summit CI job total** | **≤ 10 min**, in parallel with the existing jobs |

If the Playwright part passes 6 minutes, shard by project across two runners before cutting tests.

### 7.6 CI integration (`.github/workflows/ci.yml`)

A new job, `summit`, parallel to `client`, `dotnet` and `browser` (decision D-2):

1. Check out; set up .NET (`global.json`) and Node 22 with npm caching for `packages/rizzyui`,
   `samples/Summit/src/Summit.Web` and `samples/Summit/tests/e2e`.
2. `npm ci` in `packages/rizzyui`; pack RizzyUI.Tasks (`eng/pack-tasks.sh`); pack RizzyUI and the
   npm package with the same `-ci.{run_number}.{run_attempt}` version scheme as the `dotnet` job.
3. `bash eng/summit-test.sh ./artifacts/nupkgs <version> ./artifacts/npm/*.tgz`, which:
   - builds `Summit.Tests` in `Project` mode and runs them (fast failure before publishing);
   - runs `npm ci` and `npm test` in `Summit.Web` (code-behind units against the packed npm tarball);
   - creates an isolated `nuget.config` and `NUGET_PACKAGES`, then publishes Summit.Web with
     `-p:SummitRizzyUISource=Package -c Release`;
   - checks the publish output: fingerprinted code-behind modules, `.br`/`.gz` compressed assets,
     `rizzyui.min.js` and `rizzyui-csp.min.js` present, no `package.json`;
   - starts two published servers (`Production` environment plus `Summit:EnableTestHooks=true`,
     `Summit:Clock:FixedNow`, database paths), one with CSP;
   - runs Playwright with `SUMMIT_BASE_URL`/`SUMMIT_CSP_BASE_URL`; prints server logs on failure.
4. Upload the Playwright report and traces on failure.
5. A "working tree clean" check, as the `browser` job does, so building Summit never rewrites
   tracked files (lockfiles, generated CSS).

The pack in step 2 duplicates ~1 minute of the `dotnet` job's work. The alternative is
`needs: dotnet` plus downloading its artifacts, which tests the exact same package but makes Summit
wait for the smoke and template tests, adding about 5–8 minutes of wall-clock time to every pull
request (decision D-2).

**Release workflow:** `release.yml` should run the same script before pushing packages, so a release
cannot ship a package that breaks Summit. This is phase 6.

**Nightly (optional, decision D-5):** a scheduled workflow runs the suite with
`Summit:Assets:UseCdnDefaults=true` (checks the CDN URLs and SRI hashes RizzyUI ships), dark mode
for all axe routes, and de-DE for all scenarios.

### 7.7 Developer commands (PowerShell 5.1)

Planned; they work once phase 1 lands. Run each from the repository root.

```powershell
dotnet build samples/Summit/Summit.slnx
```

```powershell
dotnet run --project samples/Summit/src/Summit.Web
```

```powershell
npm --prefix samples/Summit/tests/e2e test
```

```powershell
npm --prefix samples/Summit/tests/e2e test -- --project=csp
```

---

## 8. Phases

Sizes: **S** ≤ 1 day, **M** 2–3 days, **L** 4–6 days of focused work. Each phase is one pull request.
The order differs from the original proposal in two places, explained after the table.

| # | Phase | Scope | Definition of done | Size |
|---|---|---|---|---|
| 1 | Skeleton, layouts, data, CSP switch, test harness | Folder layout (3.1); `SummitRizzyUISource` switch; `Program.cs` pipeline; the four layouts with real navigation (empty pages); EF Core model, Bogus seeding, template database and reset; cookie auth with the demo account; `TimeProvider`; CSP switch and nonce; self-hosted widget assets; `Summit.Tests` with the seeding snapshot and the auth and CSP header tests; the Playwright config with three projects, error and CSP collectors, the axe route list; a minimal `summit` CI job in **Project** mode | `dotnet build` works in both modes locally. All layouts render, sign-in works. Axe passes on the empty pages in both projects. The CI job is green on the pull request. README explains how to run it. | L |
| 2 | Public site | P1–P4, P6, P7; search palette; `ConferenceCountdown`, `ScheduleFilter`, `SearchPalette`; agenda; lazy stats | Section 4 for those pages; scenarios S-01, S-07, S-08, S-14, S-15; code-behind unit tests; axe on every public route; F-8 decision applied | L |
| 3 | Checkout | P5 with `CheckoutDraft`, discount codes, `CheckoutSummary`, confetti, confirmation | S-06; 422 contracts in `Summit.Tests`; F-9 names checked; focus-after-422 behavior settled | M |
| 4 | Organizer area | O1–O5; `AttendeeTableState` in TypeScript; organizer quick actions | S-02, S-03, S-04, S-05, S-09, S-10, S-11 (with F-5 either fixed in the library or `fixme`d); axe on organizer routes | L (consider 4a: O1 and O2; 4b: O3–O5) |
| 5 | Publish, localization, mobile | `eng/summit-test.sh` in **Package** mode with the published servers; de-DE resources and culture switch; mobile project and `@mobile` tags; layout fixes found at phone width | S-12, S-13, S-16; publish-output checks; the CI job switched to Package mode and published servers | M |
| 6 | CI hardening and release gate | Runtime measured and tuned (sharding if needed); `release.yml` runs Summit; optional nightly; quarantine process written down in the README; library follow-ups from section 2 filed | The job is within budget over 10 consecutive green runs with no retries; the release workflow is gated | S–M |

**Two changes from the proposed order:**

- **The CSP switch moves to phase 1.** Writing every Alpine expression in the CSP-safe subset from
  the first page is cheap. Converting 15 pages of markup later is not, and some fixes need
  code-behind modules, which changes the design.
- **CI starts in phase 1**, in Project mode, so phases 2–4 are tested on every pull request as they
  land. Phase 5 moves it to the packed, published package, and phase 6 hardens it. Waiting until
  the end would let four phases of untested work pile up (decision D-9).

**Total:** about 4–6 weeks of focused work for one person. Phase 4 has the most uncertainty
(F-1, F-2).

---

## 9. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| The suite becomes slow or flaky and people stop trusting it | Medium | High | 7.4 controls; the budget in 7.5; sharding before cutting; quarantine with an issue, not retries |
| Summit fails because of library gaps (F-1, F-2, F-5) rather than regressions | High (expected) | Medium | Workarounds where reasonable; `fixme` with an issue where not; decide per gap (D-7). A failing canary that finds a real gap is the point. |
| Maintenance cost: every breaking change in RizzyUI also needs a Summit change | Medium | Medium | That is intended and documents the migration. Keep Summit idiomatic and small per page; no clever abstractions. |
| Project and Package modes diverge (e.g., `RizzyUI.targets` import, Tasks version, static web asset paths) | Medium | Medium | CI runs Package mode; `Summit.Tests` runs in Project mode in the same job, so both modes are compiled on every pull request. |
| htmx 4 behavior assumed in this plan differs (history restore, `autofocus` after swap, upload progress, head and title handling on boosted navigation) | Medium | Medium | Each is marked "verify" in section 4 and is checked in the phase that needs it; the plan is updated when it differs. |
| Alpine-rendered DataTable rows: `hx-*` inside `x-for` templates are not processed by htmx | Medium | Medium | Row actions use the teleported dropdown (processed by the teleport bridge) or code-behind calls to `htmx.ajax`; verify in phase 4. |
| Many small `EditForm`s on one page (agenda switches) collide on ids, form names or antiforgery tokens | Medium | Low | Unique `FormName` per card; `RzIdScope`; a `Summit.Tests` check for duplicate ids on the schedule page. |
| A 600-row client-side table is slow on phones | Low | Medium | Measure in phase 4; it is the real cost of F-1 and worth reporting. Reduce the seed only if it hurts tests. |
| Demo content looks like real people or companies | Low | High | Generated names, fictional city and sponsors, no photos, no logos of real companies; review in each phase. |
| Bogus or EF Core upgrades change seeded data | Medium | Low | Pinned versions; seeding snapshot test. |

---

## 10. Decisions needed

Each decision has a recommendation; the plan above assumes the recommendation.

| Id | Decision | Recommendation | Alternative |
|---|---|---|---|
| D-1 | Solution placement | Own `samples/Summit/Summit.slnx`, built by the `summit` job | Add to `src/RizzyUI.sln`: every library build compiles Summit, but the `dotnet` job then needs npm, Tailwind and esbuild for Summit too |
| D-2 | CI job shape | Parallel `summit` job that packs RizzyUI itself (~1 min duplicated) | `needs: dotnet` and reuse its artifacts: the identical package, but ~5–8 min more wall-clock per pull request |
| D-3 | Localization scope | de-DE formatting everywhere, RizzyUI's German strings, Summit chrome translated; seeded content stays English | Formatting only (cheaper, misses resource lookups); or translate everything including seed content |
| D-4 | CSP strictness | Enforce strict `script-src`; report `style-src` (report-only) without failing, list violations in the job summary | Enforce `style-src` too: fails today on `RzInputOTP` (F-13), and possibly others |
| D-5 | Third-party widget assets | Self-host in Summit (hermetic CI), plus an optional nightly with RizzyUI's CDN defaults | Use the CDN defaults in PR CI: tests exactly what consumers get, but adds a network dependency |
| D-6 | Upload progress | Indeterminate progress (honest with htmx 4's fetch) | An XHR code-behind with percentages, outside htmx |
| D-7 | Library gaps found while planning (section 2) | Fix the small ones as separate RizzyUI pull requests before phase 4: F-2 sheet events, F-4 dialog docs, F-5 chart colors, F-7 command dialog pass-through. Keep F-1 (DataTable server mode) as a Summit workaround and a design discussion. | Keep workarounds only, and file issues |
| D-8 | Consumer smoke test | Keep it; revisit overlap after Summit runs for a few weeks | Replace it with Summit (loses the Razor-components-endpoint and `UseStaticFiles`-only consumer shapes) |
| D-9 | Phase order | CSP switch and a minimal CI job in phase 1 (section 8) | The original order, with CSP in phase 5 and CI in phase 6 |
| D-10 | Database | `EnsureCreated` plus a seeded template file; no migrations | EF migrations (more realistic; more upkeep for a demo) |
| D-11 | Custom theme | Add a "Summit" theme loaded with `ThemeLoader` from JSON as the default | Arctic as the default; no custom theme |
| D-12 | Public hosting | Not in scope now | Deploy Summit next to the docs site later as a live demo; it would need a production-safe configuration (no test hooks, no demo password in the page) |

### Open questions to settle during implementation

- Does `rz:inputotp:onchange` fire only when the code is complete? If so, the check-in desk
  submits automatically (O3).
- Does htmx 4 honor `autofocus` in swapped content? It decides between a server-only approach and a
  small shared code-behind for focus after a 422.
- How does htmx 4 handle `<title>` and `<head>` on boosted navigation between layouts (S-01)?
- Does `rzDataTable` call `htmx.process()` on rows it renders? It decides how row actions are
  wired (section 9).
- Does the docs suite's Playwright version line up with Summit's, so CI installs Chromium once?
  Pin both to the same version.

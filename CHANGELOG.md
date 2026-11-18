# Changelog

All notable changes to the `RizzyUI` and `RizzyUI.Templates` NuGet packages and the
`@jalexsocial/rizzyui` npm package are recorded here. The packages are released together, with one
version number, from a `vX.Y.Z`
git tag (see [docs/contributing/releasing.md](docs/contributing/releasing.md)).

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and RizzyUI uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html). Breaking changes are listed under
"Breaking" with a migration note. Pre-release versions may change between previews.

RizzyUI's version is independent of Rizzy's. The first Rizzy 6 release is `1.0.0-preview.1`;
0.9.x is the last Rizzy 5 / htmx 2 line. Between releases the project version is the next release
with a `-dev` suffix (now `1.0.0-preview.2-dev`), and CI packages append `-ci.<run>.<attempt>`.

Finding IDs (RZUI-0xx) refer to the
[2026-11-15 initial audit](docs/audits/2026-11-15-rizzyui-initial-audit/00-executive-summary.md).

## [Unreleased]

### Breaking

- **`RzCombobox` sends only `value` and `text` to the browser by default.** It used to write every
  public property of each item into the page (`data-item`), including fields the page never shows.
  If your `OptionTemplate` or `ItemTemplate` reads other fields, choose them with the new
  `ItemDataSelector` parameter, for example
  `ItemDataSelector="@(u => new { u.Name, u.Email, u.Photo })"` (property names become camelCase,
  as before). (RZUI-033)

### Fixed

- Toasts appear after an htmx swap replaces the region that holds `RzToastProvider`. The runtime
  kept the removed provider and sent later toasts to its detached stacks. (RZUI-027)
- A lazy component bundle or asset that fails to load (for example during a network blip) is
  retried the next time it is needed, instead of failing from a cached error until the page
  reloads. The console error names the bundle and component. (RZUI-031)
- Components that load assets work on plain HTTP. `Rizzy.require` hashed bundle ids with
  `crypto.subtle`, which browsers only provide on HTTPS and localhost. (RZUI-026)
- `RzSlider` no longer loads `rizzyui.js` a second time as a classic script (which failed with a
  console error). Its default `ComponentAssetKeys` is now empty and the `SliderScript` asset key is
  gone. (RZUI-030)
- Apps hosted under a path base (`app.UsePathBase("/app")`) load RizzyUI's own assets and Alpine
  code-behind modules from under that base. Root-relative asset URLs get the request's `PathBase`
  when rendered; absolute URLs are unchanged. (RZUI-038)
- Alpine code-behind modules registered by `RzAlpineComponent` work when the library was built on
  Windows and runs on Linux, and component names with quotes or non-ASCII characters register
  correctly. (RZUI-054)
- `RzInputColor` works with the CSP build (`rizzyui-csp.js`). Its `x-model` bindings compiled to
  property assignments, which the Alpine CSP build rejects, so every change logged an error and the
  swatch never updated. An `x-model` passed to `RzColorSwatch` is now applied one way. (RZUI-032)
- Popover positioning, color swatches and `RzShineBorder` set their styles through the CSSOM
  instead of a `style` attribute, so they work under a Content Security Policy that does not allow
  inline styles.
- Components show English text instead of resource keys (for example an `aria-label` of
  `RzSheet.CloseButtonAriaLabel`) in apps that do not call `AddLocalization()`, including apps made
  from the `dotnet new rizzyui` template. RizzyUI uses its embedded resources when ASP.NET Core
  localization is not configured.
- Localization overrides (`LocalizationResourceType`, `LocalizationResourceLocation`) apply whether
  `AddLocalization()` is called before or after `AddRizzyUI()`. Calling it afterwards used to
  disable RizzyUI's localization. (RZUI-037)
- Calling `AddRizzyUI()` more than once registers RizzyUI's services once (each call's configure
  action still applies), and the Vercel theme is listed once in `AvailableThemes`. (RZUI-036)
- The `RzSpinner` status is announced: `role="status"` and its label are on the wrapper instead of
  an `aria-hidden` SVG. (RZUI-047)
- `RzToggle` renders its initial `aria-pressed` state on the server.
- `AsChild` with an element child no longer throws when the component passes `Id` or `Href`, and
  merges classes with TwMerge like the markup path. On both paths the child's own classes now win
  Tailwind conflicts (for example `<button class="px-6">` keeps `px-6` over a component's `px-2`);
  the markup path used to let the component's classes win. (RZUI-039)
- `RzDialog`, `RzAlertDialog` and `RzCommandDialog` render attributes you pass (for example
  `data-testid` or `aria-describedby`) on their root element; they were dropped. They cannot
  replace the component's own attributes. (RZUI-053)
- `RzCarousel` escapes `<`, `>` and `&` in its configuration script, so a `</script>` in an option
  string cannot end the script element. (RZUI-034)
- `RzMarkdown`, `RzCodeViewer` and `RzHeading` (its quick-reference title) render child content
  that comes from a Razor expression, for example `<RzMarkdown>@model.Text</RzMarkdown>`; it was
  dropped. (RZUI-050)
- `ConfigureClasses` no longer modifies the `Classes` instance you pass, so a shared instance does
  not accumulate changes across components or renders. (RZUI-055)
- Toasts queued with `IRzToastService` during a non-htmx request are logged at Debug level when
  discarded (toasts travel in htmx response headers). (RZUI-052)
- `RzNumberTicker`, `RzProgress` and `RzEmbeddedPreview` release their observers and timers when
  an htmx swap removes them. `RzEmbeddedPreview` also no longer starts a new, never-cleared interval
  on each resize attempt while its iframe is loading. (RZUI-029)
- Tooltips are announced correctly: the tooltip element was labelled by its trigger, so the
  trigger's description repeated the trigger's own text (a "Save" button was described as "Save")
  instead of the tooltip text.
- Popovers and dropdown menus keep a valid `aria-labelledby` when the trigger child has its own
  `id` (common with `AsChild`); it pointed at an element that did not exist. (RZUI-048)
- Opening a dropdown menu with Enter, Space or the arrow keys moves focus to the first (or last)
  item; focus stayed on the trigger.
- The destructive color meets WCAG AA contrast with white text (4.8:1, was 3.8:1) in the Arctic
  theme and the Vercel light theme. It is now `oklch(0.577 0.245 27.325)`.

### Removed

- `RizzyUI` no longer depends on `Scrutor`, and it no longer decorates the application's
  `IStringLocalizerFactory`; it registers its own `IStringLocalizer<RizzyLocalization>`.
- `@jalexsocial/rizzyui` no longer depends on `shadcn-prose` (deprecated) or `tailwindcss-inset`.
  Neither was imported by the package's CSS or JavaScript. If your own stylesheet imports one of
  them, add it to your `package.json`.

### Security

- Removed unused build tooling (`repomix`, `webpack`, `babel`, `eslint` 8 and others) and updated
  `vite`, `esbuild` and `postcss`, which clears the npm audit findings, including every critical one,
  in the repository's lockfiles. None of these packages ship to users. The one remaining finding,
  a ReDoS in `picomatch` (GHSA-fc5q-39xc-vjpf), has no patched release; the build passes it only
  patterns from its own configuration.
- The test project uses bUnit 2.15.2, which brings AngleSharp 1.10.1 (fixes GHSA-pgww-w46g-26qg).

## [1.0.0-preview.1] - 2026-11-17

RizzyUI now targets **Rizzy 6** (`6.0.0-preview.3`) and **htmx 4**. See the
[migration guide](docs/migration/rizzy5-to-rizzy6.md).

### Breaking

- **Rizzy 6 and htmx 4 are required.** The `RizzyUI` package depends on `Rizzy` 6.0.0-preview.3,
  which targets htmx 4.0.1 or later. Follow Rizzy's
  [htmx 2 to htmx 4 guide](https://github.com/JalexSocial/Rizzy/blob/main/docs/migration/htmx2-to-htmx4.md)
  for your own markup, then RizzyUI's [migration guide](docs/migration/rizzy5-to-rizzy6.md).
- **htmx is no longer an npm dependency of `@jalexsocial/rizzyui`.** It is an optional peer
  dependency (`htmx.org` `^4.0.1`). The RizzyUI bundle never imported htmx; load it with Rizzy's
  `<RzScripts />` or install `htmx.org` yourself. (RZUI-003)
- **`antiforgerySnippet.js` is deprecated and does nothing.** It relied on htmx 2 events that htmx 4
  does not raise. Rizzy 6 attaches the antiforgery token itself; remove the script tag. The file and
  its package export remain for now and log a warning. (RZUI-007)
- **`RzButton` no longer renders a default `aria-label`.** Buttons were labelled "Action Button" for
  assistive technology whatever their visible text, and an `aria-label` passed as an attribute was
  overwritten. The visible text now names the button. Set `AssistiveLabel` (or `aria-label`) on
  icon-only buttons. (RZUI-013)
- **Dialog triggers use `x-on:click` instead of an inline `onclick`.** `DialogTrigger` and
  `AlertDialogTrigger` still raise the dialog's `EventTriggerName` window event, so code listening
  for it keeps working, but markup tests that looked for the `onclick` attribute must be updated.
  (RZUI-012)

- **`RzMarkdown` no longer renders raw HTML or Markdig generic attributes by default.** HTML in the
  Markdown is escaped and shown as text, and `{onclick=...}` attribute blocks are not parsed, so
  user-supplied Markdown cannot inject scripts or live Alpine/htmx attributes. Set the new
  `AllowUnsafeHtml="true"` parameter for trusted content that needs HTML. A custom `Pipeline` is
  used as-is. In every mode, Markdown links, images and autolinks with a `javascript:`,
  `vbscript:` or `data:` URL (except raster images) are reduced to their text. The default
  pipelines are now built once and shared. (RZUI-017)

### Added

- **`dotnet new rizzyui`.** The new `RizzyUI.Templates` NuGet package (released with RizzyUI, same
  version) creates an ASP.NET Core app with a collapsible sidebar layout, light and dark mode, a
  dashboard, a searchable and paged table, a validated form posted with htmx, 404 and error
  pages, `RzController` pages and minimal API fragment endpoints, and Tailwind CSS v4 built with
  npm. Options: `--framework net10.0|net11.0`, `--theme Arctic|Vercel`. The template pins the
  `RizzyUI` and `@jalexsocial/rizzyui` versions it was released with. CI and the release workflow
  generate, build, publish and run the app (`eng/template-test.sh`).

### Fixed

- Form inputs render the value of the field named by `For` when `Value` is not passed. Before,
  `<RzInputText For="@(() => Model.Email)" />` rendered an empty control unless `Value` was also
  set, so a form re-rendered after a failed post (422) lost what the user entered. This applies to
  every input built on `InputBase` (`RzInputText`, `RzInputTextArea`, `RzInputNumber`,
  `RzInputCheckbox`, `RzSwitch`, `RzNativeSelect`, `RzInputColor`, `RzCombobox`, `SidebarInput`).
  A `Value` you pass, including `null`, still wins. `RzCombobox` keeps using
  `SelectListItem.Selected` when the field is null, an empty string or an empty collection.
- `@jalexsocial/rizzyui` lists `tw-animate-css` as a dependency. `rizzyui-theme.css` imports it,
  so compiling `rizzyui-plugin.css` with Tailwind in an app failed with an unresolved import unless
  the app installed it itself. The package check now fails when the package's CSS imports a
  package it does not depend on.
- `FieldLabel` with `For` points at its input whether it comes before or after it. RizzyUI inputs
  rendered their own id on the control while Rizzy registered a different, generated one for the
  field, so the label's `for` never matched, and a label before its input found no id at all. Text,
  number, text area, native select, switch, checkbox, sidebar and input-group inputs and
  `RzDateEdit` now use the id registered or reserved for the field (an explicit `Id` is kept and
  registered). Requires Rizzy 6.0.0-preview.3 (`GetOrReserveFieldId`). A label for a field no
  RizzyUI input renders (a checkbox or radio group) should use `ForId` or omit `For`.
- The carousel wheel-gestures plugin loads. Its default URL pointed at
  `embla-carousel-wheel-gestures@8.1.7`, a version that does not exist (that package has its own
  version line); it now uses 8.1.0 from `dist/`. Canvas confetti loads the published
  `dist/confetti.browser.js` rather than a file jsDelivr minifies on request. (RZUI-018)
- Dialogs, alert dialogs and sheets close on Escape, trap focus with their focus scope and return
  focus to the trigger. The panels are teleported to `<body>`, and the runtime looked for them
  inside the component, so this behavior never activated. (RZUI-010, RZUI-011)
- htmx attributes inside dialog, sheet, popover and dropdown content now work. That content is
  teleported to `<body>` after htmx has processed the page, so a form with `hx-post` in a dialog
  submitted as a normal page post. (RZUI-009)
- `window.Rizzy` is shared with Rizzy's client instead of being replaced by a copy, and
  `window.Rizzy.validation` is no longer always `undefined`. (RZUI-008)
- Components no longer render raw resource keys (for example
  `aria-label="RzSheet.CloseButtonAriaLabel"`). Missing English strings were added, and partial
  translations (de, es, fr, pt) fall back to English. (RZUI-014)
- Attribute values passed to `AsChild` components with plain markup children are escaped, so a quote
  cannot end the attribute. (RZUI-015)
- The Markdown code-fence language is HTML-encoded in the generated `class` attribute. (RZUI-016)
- Sheets and dropdown menus release their dismissable layer and focus listeners when removed (for
  example by an htmx swap) while open. (RZUI-028)
- The npm package's `main`, `module` and `exports` point at files that exist;
  `@jalexsocial/rizzyui/dist/*` (CSS) can be imported. (RZUI-002)
- The npm package no longer declares a `file:` dependency on the documentation project, which left
  a dangling link in consumers' `node_modules`. (RZUI-001)
- Neither package ships unit tests, and the NuGet package no longer adds RizzyUI's own
  `package.json`, `package-lock.json` and tool configuration files to consuming projects.
  (RZUI-021, RZUI-022)
- `RzDateEdit` passes its `Options` to Flatpickr. They were silently dropped, so format, locale and
  min/max dates had no effect. The picker is destroyed when the field is removed (for example by an
  htmx swap), so calendars and their document listeners no longer pile up, and missing or invalid
  data attributes no longer throw. (RZUI-025)
- `RzDateEdit` renders its value in the configured `DateFormat` (it rendered `Y-0-20` for
  `Y-m-d`), sends dates to the browser so a custom `DateFormat` cannot misread them, includes the
  time in the default date, and no longer writes `DefaultDate` into a shared `Options` instance.
- `RzDateEdit` values are submitted with their form. The input had no `name` attribute; it now has
  the name Blazor's own inputs use (for example `Model.StartDate`), is registered for labels and
  validation messages, and gets validation attributes such as `[Required]`.
- Packing `RizzyUI.Tasks` from a clean checkout produced a package without the task assembly
  (`tasks/<tfm>/` was collected before the build ran). The files are now collected after the build.
- `RizzyUI.Tasks` targets `netstandard2.0` again, as the published 1.3.5 does, so the task also loads
  in .NET Framework MSBuild (Visual Studio). The source had moved to `net10.0` without a version
  bump; the package checker now requires `tasks/netstandard2.0/`.

### Changed

- Default CDN assets are pinned to exact versions and load with Subresource Integrity
  (`integrity` plus `crossorigin="anonymous"`). The previously unpinned defaults are pinned at the
  versions they resolved to: flatpickr 4.6.13, Chart.js 4.6.1, Coloris 0.25.1, rough-notation
  0.5.1 and vanilla-calendar-pro 3.4.0. New `RizzyUIConfig.AssetIntegrity` maps a URL to its hash;
  an overridden `AssetUrls` entry does not inherit the default hash. The client loader accepts
  `{ src, integrity }` entries as well as URL strings. (RZUI-018)
- Documentation app and examples use `<RzHeadOutlet />` and `<RzScripts />` (Rizzy 6) and htmx 4
  syntax (`show:top showTarget:window`). (RZUI-005, RZUI-006)
- CI runs on every pull request and never publishes. Releases are published by a separate,
  tag-triggered workflow that requires approval. The documentation site deploys from its own
  workflow. (RZUI-019)
- Removed the `InstallClientPackages` and `BuildClientAssets` MSBuild targets from
  `RizzyUI.csproj`. They never ran (they hooked a target that only multi-targeted projects have).
  The client bundles stay committed, and CI checks them against a fresh build. (RZUI-020)
- The project version is `1.0.0-preview.1-dev` in both `RizzyUI.csproj` and the npm manifest
  (previously `0.9.2-alpha` and `0.9.2`). (RZUI-042)
- `RizzyUI.Tasks` is released by the same tag as `RizzyUI`, pushed first and only when its version
  is not on nuget.org yet. Its version is set once, in `src/Directory.Build.props`. CI and the docs
  workflow pack it and restore from the local package, and the package checker verifies it.
  (RZUI-042)

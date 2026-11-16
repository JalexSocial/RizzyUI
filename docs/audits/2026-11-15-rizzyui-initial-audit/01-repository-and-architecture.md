# 01 — Repository and Architecture

| Field | Value |
|---|---|
| Audit | RizzyUI initial audit |
| Date | 2026-11-15 |
| Repository | https://github.com/JalexSocial/RizzyUI |
| Branch / commit | `main` @ `3fda79b20f3584f0f94f11adc64b5c26496eed54` |
| Scope | Inventory, project and package structure, dependency map, rendering, client runtime, theming, localization, assets, docs and test architecture |
| Methodology | See [00-executive-summary.md](00-executive-summary.md#methodology) |
| Limitations | See [00-executive-summary.md](00-executive-summary.md#limitations) |

## 1. Inventory

| Path | Kind | Purpose |
|---|---|---|
| `src/RizzyUI` | Razor class library → NuGet `RizzyUI` (0.9.2-alpha) | 266 `.razor` components (93 root `Rz*` components) in 15 categories, theming (`RzTheme`, TailwindVariants descriptors), localization, toast service + middleware, Alpine code-behind support. Ships `wwwroot` (JS bundles, CSS, highlight.js vendor files) as static web assets under `_content/RizzyUI`. |
| `packages/rizzyui` | npm `@jalexsocial/rizzyui` (0.9.2) | Source of the client runtime (Alpine.js + async-alpine, 52 component factories in 12 lazily loaded bundles, 54 manifest entries), a11y primitives, toast runtime, Tailwind CSS sources. Its build writes `dist/` **and** `src/RizzyUI/wwwroot/{js,css}`; both are committed. |
| `src/RizzyUI.Docs` | ASP.NET Core app (not packed) | Documentation/demo site (96 component pages), static-site generation with AspNetStatic (Release builds), Playwright accessibility tests over hand-written fixture pages. |
| `src/RizzyUI.Tests` | xUnit + bUnit + Alba | 97 C# files, 484 tests at baseline. |
| `src/RizzyUI.Tasks` | MSBuild task → NuGet `RizzyUI.Tasks` (1.3.5) | Computes the caller-file prefix that the Alpine code-behind feature needs. In the solution, but `RizzyUI.csproj` consumes the **published** 1.3.5 package, not the project. |
| `src/RizzyUI` (npm workspace) | `package.json` named `rizzyui` | Runs the accessibility-inventory checker (`tools/accessibility-inventory`) and a repomix script; not a published package. |
| `tools/accessibility-inventory` | Node script | Checks that components named in an a11y contract list have docs and test files. |
| `docs/` | Markdown + Jekyll source | Agent/authoring guides (`docs/agents`), accessibility specs, engineering notes; also the GitHub Pages source the docs app generates into. |
| `.github/workflows/dotnet.yml` | GitHub Actions | Single pipeline on push to `main`: build, test, publish NuGet + npm, deploy Pages. |

There is no `global.json`, `Directory.Build.props`, `CHANGELOG.md` or `CONTRIBUTING.md` at baseline.

## 2. Dependency map

```text
                 ┌──────────────────────────── NuGet ───────────────────────────────┐
consumer app ──▶ RizzyUI (0.9.2-alpha, net10.0)
                   ├─▶ Rizzy 5.3.0 ──▶ Rizzy.Htmx 5.3.0          (htmx 2 line)
                   ├─▶ TailwindVariants.NET 0.2.9 (+ TailwindMerge)
                   ├─▶ Blazicons (+ Lucide, Ionicons, MaterialDesignIcons)
                   ├─▶ Markdig 0.45.0, Scrutor 7.0.0
                   └─▶ RizzyUI.Tasks 1.3.5 (build-time task, flows to consumers)

browser  ◀── _content/Rizzy/js/rizzy.js           (Rizzy)       ┐ loaded by the
         ◀── htmx (app/CDN; not part of either package)         ┘ app's layout
         ◀── _content/RizzyUI/js/rizzyui[-csp].js (RizzyUI) ──▶ chunks/*.js (dynamic import)
                                                               ──▶ CDN libraries via rizzyRequire
                                                                   (Chart.js, Tom Select, flatpickr,
                                                                    Embla, Coloris, vanilla-calendar-pro…)

npm: @jalexsocial/rizzyui ─▶ alpinejs, @alpinejs/*, async-alpine, @floating-ui/dom,
                             @tanstack/table-core, aspnet-client-validation, canvas-confetti,
                             tailwind packages, htmx.org ^2.0.4 (never imported),
                             rizzyui.docs file:../../src/RizzyUI.Docs (RZUI-001)
```

Project references: `RizzyUI.Docs → RizzyUI`, `RizzyUI.Tests → RizzyUI`. Nothing references
`RizzyUI.Tasks` as a project.

## 3. Server-side architecture

- **Component base.** `RzComponent` (`src/RizzyUI/RzComponent.cs`) injects `TwMerge`, the Rizzy
  nonce provider, `IStringLocalizer<RizzyLocalization>` and `IOptions<RizzyUIConfig>`, and provides
  `Id` (Rizzy's `IdGenerator`), `Element`, `LoadStrategy` (default `eager`), `AdditionalAttributes`
  and the resolved `Theme` (cascaded → `Config.DefaultTheme` → `RzTheme.Default`).
  `RzComponent<TSlots>`/`RzAsChildComponent<TSlots>` compute `SlotClasses` from a TailwindVariants
  descriptor in `OnParametersSet`.
- **Theming.** `RzTheme` exposes about 260 descriptor properties copied from each component's
  static `DefaultDescriptor`. `RzThemeProvider` writes the theme's CSS variables and a dark-mode
  script into `<head>` (both nonced) and cascades the theme. Themes are C# classes (`ArcticTheme`)
  or JSON (`ThemeLoader`, embedded `vercel.json`).
- **asChild.** `RzAsChildComponent.CloneFragment` merges attributes into a single child: for
  component/element frames by replaying render-tree frames, for static markup by rewriting the HTML
  string (`Utility/Parser/HtmlUtils.cs`). The string path is where RZUI-015 lives.
- **DI.** `AddRizzyUI()` registers TailwindVariants/TailwindMerge, `IHttpContextAccessor`, Rizzy's
  nonce provider (`TryAdd`), the toast queue/service (scoped), default `AssetUrls` and themes
  (`PostConfigure`), and decorates `IStringLocalizerFactory` when one is already registered
  (RZUI-037). `UseRzToast()` adds middleware that emits queued toasts as one `HX-Trigger`.
- **Rizzy integration surface** at baseline is small: `IRizzyNonceProvider`, `IsHtmx()`,
  `HtmxResponse.Trigger`, and the consuming app's own `AddRizzy`/`UseRizzy`/head components.
  The library itself compiled unchanged against Rizzy 6 (see report 03).

## 4. Client runtime architecture

- `rizzyui.js` / `rizzyui-csp.js` (ES modules) import Alpine (standard or CSP build) and call
  `bootstrapRizzyUI` (`src/js/lib/bootstrap.js`): Alpine plugins, directives (`x-mobile`,
  `x-sync-prop`, `x-validate`), one `Alpine.asyncData` loader per manifest entry, stores, theme
  controller, `window.Alpine`, `window.Rizzy`, then `Alpine.start()`.
- Components declare `x-data="rzX" x-load="eager|visible|…"`; async-alpine imports the owning
  bundle (`componentBundleManifest.js` → `bundleLoaderRegistry.js`) and registers the factory.
- Content inserted later (htmx swaps) is initialized by Alpine's `MutationObserver`; nothing in the
  runtime listens to htmx events. Overlays (dialog, sheet, popover, dropdown) teleport their panels
  to `<body>` with `x-teleport`.
- Third-party libraries load through `rizzyRequire` (loadjs) with the page nonce, from URLs in
  `RizzyUIConfig.AssetUrls`, mostly jsDelivr (RZUI-018).
- **Script ownership at baseline was undefined:** the docs app loaded a vendored htmx 2 plus
  `rizzy.js` in one layout and unpkg htmx 2.0.4 plus `rizzy.js` as a module in another; the npm
  package declared htmx as a dependency it never used. Report 03 defines the target model.

## 5. Documentation, demo and test architecture

- **Docs app.** `MapRazorComponents<App>()` (Blazor SSR endpoints, not Rizzy views); sidebar
  navigation uses `hx-boost` + `hx-select="#content"`. Many demos render inside `RzBrowser`
  iframes (`srcdoc`) with `PreviewLayout`. Release builds run AspNetStatic and exit, writing the
  static site into `docs/`, which Jekyll publishes (RZUI-041).
- **Tests.** bUnit/Alba component tests (markup, attributes, slots); Node `node:test` unit tests
  for JS primitives and some components; Playwright specs against **hand-written HTML fixtures**,
  not the real components (RZUI-023). No test exercised htmx.

## 6. Assessment of responsibilities and coupling

| Area | Assessment |
|---|---|
| Library vs. framework | Clean: RizzyUI uses few Rizzy APIs, so the Rizzy 6 upgrade needed no library code changes. |
| Library vs. client package | Tightly coupled by design (one build writes both `dist/` and `wwwroot/`), but the coupling is invisible to `dotnet build`: the MSBuild targets meant to run the client build never execute (RZUI-020), so correctness depends on committing generated output by hand. |
| Library vs. docs | Leaks in both directions: the npm package depended on the docs project (RZUI-001), and the docs app's CSS build runs `npm install` against the library package (`prebuild:css`). |
| Runtime vs. htmx | Implicit: correct only because Alpine observes the DOM. Teleported overlay content was invisible to htmx (RZUI-009). Now an explicit, small bridge (report 07). |
| Component layer | Consistent base classes and descriptor pattern; growing duplication (82 copies of the default-element snippet, 27 copies of the attribute-dictionary copy) and conformance drift (RZUI-053). Worth a shared helper pass, not a rewrite. |
| Accessibility runtime | Good primitives (`runtime/a11y`: focus scope, dismissable layer, roving focus, typeahead, announcer), but wiring defects in overlays (RZUI-010, RZUI-011) went unnoticed because browser tests use fixtures. |

As the library grows, the main structural risks are (1) generated assets with no enforced link to
their sources, (2) browser behavior with no real-component tests, and (3) per-component handling of
cross-cutting concerns (teleport lookup, cleanup, CSP) instead of shared primitives.

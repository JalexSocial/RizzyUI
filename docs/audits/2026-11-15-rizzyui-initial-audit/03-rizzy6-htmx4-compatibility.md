# 03 — Rizzy 6 and htmx 4 Compatibility

| Field | Value |
|---|---|
| Audit | RizzyUI initial audit |
| Date | 2026-11-15 |
| Repository | https://github.com/JalexSocial/RizzyUI |
| Branch / commit | `main` @ `3fda79b20f3584f0f94f11adc64b5c26496eed54` |
| Scope | Compatibility of RizzyUI (library, client runtime, docs app, tests, packages) with Rizzy 6.0.0-preview.2 and htmx 4.0.1 |
| Methodology | See [00-executive-summary.md](00-executive-summary.md#methodology). Upstream behavior was checked against the Rizzy `v6.0.0-preview.2` tag and the htmx 4.0.1 `dist/htmx.js` source. |
| Limitations | See [00-executive-summary.md](00-executive-summary.md#limitations) |

## 1. Compatibility target (verified 2026-11-15)

| Artifact | Published | Notes |
|---|---|---|
| NuGet `Rizzy` | `6.0.0-preview.2` | Depends on `Rizzy.Htmx 6.0.0-preview.2` and `Sqids 3.2.0`; `net10.0` and `net11.0` groups. |
| NuGet `Rizzy.Htmx` | `6.0.0-preview.2` | Same version as `Rizzy` (Rizzy's single-version policy). |
| npm `@jalexsocial/rizzy` | `6.0.0-preview.2` (`next`); `latest` is still `5.4.0` | Peer dependency `htmx.org ^4.0.1`. |
| npm `htmx.org` | `4.0.1` (`next`); `latest` is `2.0.11` | Installing `htmx.org` without a version still gets htmx 2. |
| Rizzy repo | tag `v6.0.0-preview.2` = `3c078c6`; `main` differs only by the version bump to `6.0.0-preview.3-dev` in `Directory.Build.props` | The tag and the published packages agree; `main` is not what is published. |

RizzyUI targets `net10.0` only. That is compatible with Rizzy 6's `net10.0` assets; .NET 11
support is a separate decision (see roadmap RM-5.4).

## 2. Impact of the package upgrade

Changing `Rizzy` from `5.3.0` to `6.0.0-preview.2` in `src/RizzyUI/RizzyUI.csproj:45` and
`src/RizzyUI.Docs/RizzyUI.Docs.csproj:22`:

| Project | Result |
|---|---|
| `src/RizzyUI` | **Compiles unchanged**: no errors, no new warnings. The library uses only `IRizzyNonceProvider`, `IsHtmx()` and `HtmxResponse.Trigger`, all unchanged in Rizzy 6. |
| `src/RizzyUI.Docs` | CS1061: `HtmxConfig.GenerateStyleNonce` removed (`Program.cs:20`), RZUI-004. |
| `src/RizzyUI.Tests` | CS1061: same, in `Assets/Alba/WebAppFixture.cs:50`, RZUI-004. |

Compilation is the smallest part of the migration: every runtime incompatibility below compiled.

## 3. Compatibility matrix

| # | Area (Rizzy guide / htmx 4 change) | RizzyUI status at baseline | Finding |
|---|---|---|---|
| 1 | `GenerateStyleNonce`/`InlineStyleNonce` removed | Used by docs app and test host | RZUI-004 |
| 2 | `AddRizzy()` registers htmx + Razor components | Docs/tests call `AddHtmx` and `AddRazorComponents` redundantly (harmless; idempotent) | — |
| 3 | `<RzHeadOutlet />` replaces `<HeadOutlet />` + `<HtmxConfigHeadOutlet />`; meta tag before htmx | Docs `App.razor:22,29` used both old components; `PreviewLayout.razor:15,19` rendered **both** `HtmxConfigHeadOutlet` and `RzHeadOutlet` | RZUI-005 |
| 4 | `<RzScripts />` loads htmx 4, `rizzy.js`, extensions (SRI + nonce) | Docs loaded vendored htmx 2 (`App.razor:31`) and unpkg htmx 2.0.4 (`PreviewLayout.razor:22`); `rizzy.js` loaded as `type="module"` in `PreviewLayout.razor:24` | RZUI-005 |
| 5 | `hx-ext` removed; Rizzy extensions register themselves | `hx-ext="rizzy-nonce"` on `<body>` (`App.razor:55`, `PreviewLayout.razor:51`) | RZUI-005 |
| 6 | Event names `htmx:camelCase` → `htmx:colon:case` | Only `antiforgerySnippet.js:2,20` (`htmx:configRequest`, `htmx:afterOnLoad`); no component listens to htmx events | RZUI-007 |
| 7 | Attribute renames/removals (`hx-disable`, `hx-disabled-elt`, `hx-vars`, `hx-params`, `hx-request`) | None in library or docs (scan + official checker) | — |
| 8 | Explicit inheritance (`:inherited`) | Docs put `hx-boost`, `hx-select`, `hx-target`, `hx-swap` on each `<a>` itself, so no inheritance is needed | — |
| 9 | Trigger syntax (quoted selectors, no `queue:`) | No `hx-trigger` with selectors or `queue:` in library or docs | — |
| 10 | Swap syntax (`focus-scroll` → `focusScroll`, `show:<target>:<pos>`) | **103** `hx-swap="outerHTML show:window:top"` in `Components/Layout/MainLayout.razor` (from line 40). htmx 4 reads the position from `show` and the element from `showTarget` (`htmx.js:1221-1222`), so `show:window:top` calls `scrollIntoView(false)` on the swapped element instead of scrolling the window to the top | RZUI-006 |
| 11 | 4xx/5xx responses are swapped | Library never issues htmx requests. Docs demo targets would show error pages in place; documented in the migration guide | — |
| 12 | `hx-delete` sends no form body | Not used | — |
| 13 | No history cache; back/forward re-fetches (`HX-History-Restore-Request`) | Docs pages are full pages with `hx-select`; verified that back navigation restores a working page (report 07) | — |
| 14 | `HX-Trigger` fires once, **after** the swap, on the source element, falling back to `document` when it was detached (`htmx.js:628-629`, `1586-1596`) | Toast batches (`rz:toast:batch`) and dialog close events are listened for on `window`/`document`, so both still arrive | — |
| 15 | `HX-Trigger` details serialized with the app's `JsonOptions` | Toast transport types pin names with `[JsonPropertyName]` | — |
| 16 | Antiforgery: Rizzy 6 extension reads the token from the meta tag | RizzyUI shipped its own htmx 2 snippet (inert under htmx 4) | RZUI-007 |
| 17 | `MarkupString` required for raw-HTML Rizzy APIs | RizzyUI does not call the changed APIs | — |
| 18 | `RizzyViewResult`, partial/full-page detection, `UseHtmxErrorHandling`, `ValidationFailed` | Not used by the library; docs use Blazor endpoints (`MapRazorComponents`) | — |
| 19 | htmx processes the DOM once on `DOMContentLoaded` plus its own swaps; no `MutationObserver` | Overlay content teleported by Alpine **after** htmx initialized is never processed: `hx-post` forms in dialogs submitted natively (runtime-confirmed) | RZUI-009 |
| 20 | `window.Rizzy` is Rizzy 6's diagnostics/nonce/confirm object | RizzyUI replaced it with a copy | RZUI-008 |
| 21 | npm: `htmx.org` is the app's choice (peer of `@jalexsocial/rizzy`) | `@jalexsocial/rizzyui` depended on `htmx.org ^2.0.4` without importing it (`packages/rizzyui/package.json:81`); the docs npm manifest and `src/RizzyUI/package.json` did too | RZUI-003 |
| 22 | Dynamically built htmx syntax (C# builders, JS) | Library builds none; `rzCommandList.js:191` calls `htmx.process`, which htmx 4 keeps | — |

Official checker: `npx -p htmx.org@4 upgrade-check --ext .razor --ext .cs` over `src/RizzyUI/Components`,
`src/RizzyUI.Docs/Components` and `packages/rizzyui/src/js` reported **103 issues, all
`[swap-syntax] show:window:top`** (row 10). It crashes on Windows with `UnicodeEncodeError` unless
`PYTHONIOENCODING=utf-8` is set (the script prints `→`).

## 4. Findings

### RZUI-003 — htmx ownership undefined; npm package depends on htmx 2 it never uses
- **Category / severity:** Compatibility, packaging · **P1**
- **Subsystem:** npm package, script loading
- **Evidence:** `packages/rizzyui/package.json:81` `"htmx.org": "^2.0.4"` in `dependencies`; the
  build marks it external and never imports it (no `import ... 'htmx.org'` in `src/js`); the docs app
  vendors and loads htmx 2 by hand (row 4).
- **Impact:** Apps installing the npm package get htmx 2 in `node_modules` next to Rizzy 6's htmx 4
  peer requirement; there is no documented answer to "who loads htmx".
- **Recommendation:** Application owns htmx through `<RzScripts />`; RizzyUI declares
  `htmx.org ^4.0.1` as an **optional peer** (see §5). Owner decision D-2 confirms the model.
- **Verification:** Confirmed (static). **Confidence:** High.

### RZUI-004 — Docs app and test host use APIs removed in Rizzy 6
- **Category / severity:** Compatibility · **P1**
- **Evidence:** `src/RizzyUI.Docs/Program.cs:20`, `src/RizzyUI.Tests/Assets/Alba/WebAppFixture.cs:50`
  set `GenerateStyleNonce` (removed, RIZZY-028).
- **Impact:** The solution does not build against Rizzy 6.
- **Verification:** Reproducible incompatibility (CS1061). **Confidence:** High.

### RZUI-005 — Docs layouts use the htmx 2 / Rizzy 5 head setup
- **Category / severity:** Compatibility · **P1**
- **Evidence:** Rows 3–5 (`src/RizzyUI.Docs/Components/App.razor:22,29,31,32,55`;
  `Components/Layout/PreviewLayout.razor:15,19,22,24,51`).
- **Impact:** After the package upgrade the site would load htmx 2 with Rizzy 6's client, and
  `PreviewLayout` would render two `htmx-config` meta tags. These layouts are also the reference
  setup users copy.
- **Recommendation:** `<RzHeadOutlet />` + `<RzScripts />`, htmx served from a pinned local copy with
  SRI, and an absolute `ClientScriptUrl` (no `<base href>`).
- **Verification:** Reproducible incompatibility. **Confidence:** High.

### RZUI-006 — `show:window:top` swap modifier misread by htmx 4
- **Category / severity:** Compatibility · **P2**
- **Evidence:** Row 10; 103 occurrences in `src/RizzyUI.Docs/Components/Layout/MainLayout.razor`.
- **Impact:** After each boosted navigation the page aligns the new content's bottom edge instead of
  scrolling to the top.
- **Verification:** Reproducible incompatibility (official checker + htmx source). **Confidence:** High.

### RZUI-007 — `antiforgerySnippet.js` only works with htmx 2
- **Category / severity:** Compatibility · **P2**
- **Evidence:** `packages/rizzyui/src/js/antiforgerySnippet.js:2` (`htmx:configRequest`), `:20`
  (`htmx:afterOnLoad`), `:23` (`evt.detail.xhr`; htmx 4 uses `fetch`); exported as
  `./antiforgerySnippet` from the npm package.
- **Impact:** Under htmx 4 it silently does nothing. Apps relying on it would fail antiforgery
  validation unless Rizzy 6's `rizzy-antiforgery` extension is loaded (it is, through `<RzScripts />`).
- **Recommendation:** Deprecate (keep the path, log a warning), remove in a later major.
- **Verification:** Reproducible incompatibility. **Confidence:** High.

### RZUI-009 — htmx never processes `hx-*` markup inside teleported overlay content
- **Category / severity:** Compatibility, functional defect · **P1**
- **Subsystem:** Client runtime (dialog, sheet, popover, dropdown)
- **Evidence:** `src/RizzyUI/Components/Internal/RzModalPrimitive.razor:4` (`<template x-teleport="body">`),
  `Feedback/RzSheet/SheetContent.razor:6`. Overlay components load asynchronously (`x-load`), so
  Alpine teleports their content after htmx's `DOMContentLoaded` processing; htmx 4 has no DOM
  observer (`htmx.js:178`).
- **Reproduction (docs app, Chromium):** open the "Close via HTMX Header" dialog on
  `/components/dialog` and click *Submit & Close*: the browser performed a **full-page native form
  submission** instead of an htmx `POST`.
- **Impact:** Any `hx-get`/`hx-post` inside a dialog, sheet, popover or dropdown is inert, which is
  one of the main ways RizzyUI is meant to be combined with htmx. The same mechanism applied under
  htmx 2.
- **Recommendation:** One shared bridge that calls `htmx.process()` on elements added under
  `<body>` (where all teleports land), rather than per-component fixes.
- **Verification:** Confirmed (runtime). **Confidence:** High.

## 5. Script ownership decision

Options considered for htmx:

| Option | Pros | Cons |
|---|---|---|
| A. RizzyUI bundles htmx | One script tag | Duplicates the htmx that Rizzy's `<RzScripts />` loads; RizzyUI would have to track Rizzy's pinned version and SRI hashes; breaks apps that use `RzScripts` |
| B. RizzyUI declares a hard npm dependency | Version visible in `package.json` | Same duplication risk for bundler users; it is what 0.9.x did, with an htmx 2 range |
| **C. Application owns htmx via Rizzy (`<RzScripts />`); RizzyUI declares an optional peer** | Exactly one htmx; Rizzy's pinned version, SRI and extension order; no change for NuGet-only consumers | Bundler users install `htmx.org` themselves (as Rizzy's own npm package already requires) |

**Chosen: C** (implemented, report 07; owner decision D-2 to confirm). Resulting order:
`<RzHeadOutlet />` → `<RzScripts />` (htmx 4, `rizzy.js`, Rizzy extensions) → RizzyUI module
(`rizzyui.js` or `rizzyui-csp.js`, deferred) → chunks on demand. RizzyUI owns Alpine and its plugins.
Details: [docs/engineering/client-runtime-and-htmx.md](../../engineering/client-runtime-and-htmx.md).

## 6. Upstream observations (Rizzy; not RizzyUI findings)

These came up during the migration. They are recorded for the Rizzy maintainers, without RZUI IDs.

1. `RizzyConfig.ClientScriptUrl` defaults to the relative `_content/Rizzy/js/rizzy.js`, so
   `<RzScripts />` 404s on nested routes when the layout has no `<base href="/">` (the RizzyUI docs
   layouts have none). Consider an app-relative (`~/`) or `PathBase`-aware default, or a startup
   diagnostic.
2. `RizzyStartupDiagnostics` warns that `RootComponent` is the default `HtmxApp<EmptyLayout>` for
   apps that render only through `MapRazorComponents<App>()` and never use Rizzy views. For those apps
   the warning is a false positive.
3. The official htmx `upgrade-check` crashes on Windows consoles (cp1252) unless
   `PYTHONIOENCODING=utf-8`; worth a note in Rizzy's migration guide, which recommends the tool.

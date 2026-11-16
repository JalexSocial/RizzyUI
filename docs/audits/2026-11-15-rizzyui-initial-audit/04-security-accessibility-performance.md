# 04 — Security, Accessibility and Performance

| Field | Value |
|---|---|
| Audit | RizzyUI initial audit |
| Date | 2026-11-15 |
| Repository | https://github.com/JalexSocial/RizzyUI |
| Branch / commit | `main` @ `3fda79b20f3584f0f94f11adc64b5c26496eed54` |
| Scope | XSS and HTML/attribute injection, CSP and nonces, antiforgery, third-party script loading, data exposure, dependency advisories; accessibility of interactive components; bundle and render-time performance |
| Methodology | See [00-executive-summary.md](00-executive-summary.md#methodology). Browser reproductions used the docs app in Chromium; injection findings were reproduced with unit tests run against the original code. |
| Limitations | No penetration test or dependency-wide SCA scan beyond `dotnet`/`npm` advisories; no screen-reader testing; performance numbers are sizes, not timings. See the executive summary. |

## 1. Security

### Trust model used for severities

RizzyUI renders values supplied by the **application developer** (component parameters,
configuration, themes) and, in some components, values the developer may take from **end users**
(Markdown content, labels, titles, list items). A finding is rated as exploitable only when a
plausible use passes end-user data through the affected path. "Developer-trust" findings are
reported at lower severity.

### RZUI-015 — asChild markup merge does not escape attribute values
- **Category / severity:** Security (HTML attribute injection) · **P1**
- **Subsystem:** `RzAsChildComponent` (markup path), `Utility/Parser/HtmlUtils.cs`
- **Evidence:** `HtmlUtils.cs:296` (`EmitAttrAlwaysQuoted`) and `:310`/`:324` (`EmitAttr`) append
  caller values verbatim. This path runs whenever an `AsChild` component's child is static markup
  (`RzAsChildComponent.CloneFragment.cs:97-108`), which is how Razor compiles plain HTML children.
- **Reproduction:** `AttributeEncodingTests.AsChild_MarkupChild_CallerAttributeWithQuotes_StaysInsideItsAttribute`
  renders `<DialogTrigger AsChild title='x" onmouseover="alert(1)'><a href="/somewhere">…</a>`;
  against the original code the anchor gains an `onmouseover` attribute (test fails).
- **Impact:** Any caller value containing a quote ends the attribute; with user-controlled values
  (titles, labels, `data-*`) this is script injection. The element/component path is safe (Blazor encodes).
- **Recommendation:** Escape quote characters (minimum) for all emitted values; consider full
  attribute encoding once the parser decodes values it reads from markup.
- **Verification:** Confirmed (runtime). **Confidence:** High.

### RZUI-016 — Markdown code-fence language is written unescaped into `class`
- **Category / severity:** Security (XSS) · **P1**
- **Evidence:** `src/RizzyUI/Extensions/MarkdigExtensions.cs:81`
  `classes += $" language-{language}"`, then written raw into `class="…"`. The fence info string
  cannot contain spaces but can contain quotes.
- **Reproduction:** `AttributeEncodingTests.MarkdownCodeFence_InfoStringCannotInjectAttributes`:
  ```` ```x"onmouseover="alert(1)" ```` produces `<code … onmouseover="alert(1)">` with the original
  code (test fails).
- **Impact:** Any app rendering user Markdown with `UseRizzySyntaxHighlighting` (including custom
  pipelines that disable raw HTML) is exposed.
- **Verification:** Confirmed (runtime). **Confidence:** High.

### RZUI-017 — `RzMarkdown` renders raw HTML and generic attributes by default
- **Category / severity:** Security (XSS, conditional) · **P1**
- **Evidence:** `src/RizzyUI/Components/Document/RzMarkdown/RzMarkdown.razor.cs:92-95` builds the
  default pipeline with `UseAdvancedExtensions()` (which includes generic attributes `{onclick=…}`)
  and without `DisableHtml()`; `:139` wraps the output in `MarkupString`. The output sits inside an
  Alpine scope, so injected `x-*`/`hx-*` attributes are also live. No XML doc warns about this.
- **Impact:** Stored XSS when an application passes user content to `RzMarkdown`, a natural use for a
  Markdown component. For developer-authored content (the docs site) it is intended behavior.
- **Recommendation:** Owner decision D-4: either make the default safe (`DisableHtml()`, no generic
  attributes, an explicit `AllowUnsafeHtml` opt-in) as a breaking change, or keep the default and
  document it prominently. Fixing it is a public-behavior change, so it was **not** changed in this audit.
- **Verification:** Confirmed (static). **Confidence:** High.

### RZUI-018 — Third-party scripts loaded from CDNs without version pinning or SRI
- **Category / severity:** Security (supply chain), stability · **P1**
- **Evidence:** `src/RizzyUI/Extensions/ServiceCollectionExtensions.cs:90-99`: flatpickr (no
  version), Coloris `@latest` from `cdn.jsdelivr.net/gh/…`, Chart.js (no version), rough-notation
  (no version), vanilla-calendar-pro JS and CSS (no version); Tom Select pinned to 2.4.1 while the
  docs test suite uses 2.4.3. `rizzyRequire`/loadjs give injected scripts the page nonce but support
  no `integrity`.
- **Impact:** A new upstream release (or a compromised CDN path) changes the code running on every
  consumer's origin with the consumer's CSP nonce; major-version API changes silently break
  components; pages are not reproducible.
- **Recommendation:** Pin exact versions, add optional `integrity` support to the asset map and
  loader, and offer self-hosted copies (Rizzy's `HtmxScriptOptions` is a model).
- **Verification:** Confirmed (static). **Confidence:** High.

### RZUI-012 — Dialog triggers use inline `onclick` handlers
- **Category / severity:** Security (CSP compatibility) · **P1**
- **Evidence:** `Components/Feedback/RzDialog/DialogTrigger.razor.cs:53` and
  `Components/Feedback/RzAlertDialog/AlertDialogTrigger.razor.cs:47` render
  `onclick="window.dispatchEvent(new CustomEvent('…'))"`. (`SheetTrigger` already uses `x-on:click`.)
- **Impact:** Under a nonce-based CSP without `'unsafe-inline'`/`'unsafe-hashes'` (the policy Rizzy
  documents) dialog triggers do nothing. This contradicts AGENTS.md's CSP-safe requirement. The event
  name is server-generated, so this is not an injection vector.
- **Verification:** Confirmed (static); the fixed trigger was verified under a strict CSP by the
  consumer smoke test (report 07). **Confidence:** High.

### RZUI-033 — Full server objects serialized into HTML
- **Category / severity:** Security (data exposure), API · **P2**
- **Evidence:** `Components/Form/RzCombobox/RzCombobox.razor:102` writes
  `data-item="@SerializeItem(item)"` (every public property of `TItem`; a new
  `JsonSerializerOptions` per item at `.razor.cs:200`); `RzDataTableTransport.cs:133-136` sends the
  whole `Items` graph to the client while columns only hide fields visually.
- **Impact:** Properties the page never shows (internal IDs, emails, flags) are in the page source;
  entity graphs with cycles throw. AGENTS.md says not to emit `TItem` instances.
- **Recommendation:** Serialize value/text plus an opt-in projection; document that DataTable items
  should be DTOs or project to column accessors.
- **Verification:** Architectural concern. **Confidence:** High.

### RZUI-034 — Carousel configuration uses relaxed JSON escaping inside `<script>`
- **Category / severity:** Security · **P3** (developer-trust)
- **Evidence:** `Components/Layout/RzCarousel/RzCarousel.razor.cs:32`
  `Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping`, written with `MarkupString` into
  `<script type="application/json">` (`RzCarousel.razor:13-15`). A `</script>` in any option string
  ends the element. Other JSON islands (Toast, Chart, DataTable, Combobox, Calendar, Command) use the
  default encoder, which escapes `<`.
- **Verification:** Confirmed (static). **Confidence:** High.

### RZUI-041 — Static docs site: fixed nonce, internal docs published verbatim
- **Category / severity:** Security hygiene · **P3**
- **Evidence:** `src/RizzyUI.Docs/Program.cs:77` sets the nonce to
  `"abcdefghijklmnopqrstuvwxyz0123456789"` for Release (static generation); the CSP meta tag is off
  by default (`App.razor`, `UseContentSecurityPolicy = false`). `docs/_config.yml` had no `exclude`,
  so Jekyll copied `docs/agents`, `docs/internal`, etc. to the public site as raw files.
- **Impact:** A static nonce is equivalent to no nonce if the CSP is ever enabled; publishing the
  internal docs is probably unintended (and would publish this audit).
- **Verification:** Confirmed (static). **Confidence:** High.

### RZUI-057 — Embedded preview iframes are not sandboxed
- **Category / severity:** Security · **P3** (developer-trust; optional)
- **Evidence:** `Components/Document/RzEmbeddedPreview/RzEmbeddedPreview.razor:5-11` renders
  same-origin `srcdoc` without `sandbox`.
- **Verification:** Optional improvement. **Confidence:** High.

### Other security checks (no finding)

- **Antiforgery:** RizzyUI defines no endpoints. With Rizzy 6 the token is attached by
  `rizzy-antiforgery` from the meta tag; verified end to end (htmx `POST` with
  `RequestVerificationToken` accepted by a minimal API that validates antiforgery; report 07).
- **Nonce propagation:** components read the nonce through Rizzy's `IRizzyNonceProvider`;
  `RzThemeProvider` nonces its `<style>`/`<script>`; `rizzyRequire` copies the nonce to injected
  scripts. No RizzyUI code restores removed Rizzy nonce APIs.
- **`href`/`src` parameters** are Blazor-encoded and not scheme-validated, the same as plain Blazor
  (developer-trust).
- **Client-side `innerHTML`:** only `rzCombobox.js:68` (server-rendered template markup) and
  `directives/flexrender.js:60` (explicit `kind: 'html'`, values escaped by `rzDataTable.js:93`). No
  `x-html`, `eval` or `new Function` in runtime code.
- **Dependency advisories:** `dotnet build` reports NU1902 for `AngleSharp 1.4.0`
  (GHSA-pgww-w46g-26qg, moderate), a **test-only** transitive dependency of bUnit (RZUI-044). The
  library's own NuGet dependencies reported no advisories. The `e0e727bb` commit had already
  refreshed npm lockfiles for advisories.

## 2. Accessibility

The accessibility runtime primitives (`packages/rizzyui/src/js/runtime/a11y`: focus scope,
dismissable layer, roving focus, typeahead, active descendant, live announcer) are well factored and
unit-tested. The defects are in how components use them, and none of them could be caught because
the Playwright suite tests hand-written fixtures (RZUI-023).

### RZUI-010 — Dialog and sheet accessibility behavior never activates
- **Category / severity:** Accessibility · **P1**
- **Subsystem:** `rzModal` (RzDialog, RzAlertDialog), `rzSheet`
- **Evidence:** `packages/rizzyui/src/js/lib/components/rzModal.js:72` looks up the panel with
  `this.$el.querySelector(...)`, and `rzSheet.js:79` with `this.$root.querySelector(...)`, but both
  panels are teleported to `<body>` (`RzModalPrimitive.razor:4`, `SheetContent.razor:6`). When nothing
  is found, `_activateAccessibility`/`registerInteractions` return early.
- **Reproduction (docs app, Chromium):** open the htmx dialog on `/components/dialog` and press
  Escape: the dialog stays open. Sheets have no focus trap and do not close on Escape.
- **Impact:** Escape-to-close, the dismissable-layer stack, IDREF pruning and focus-scope handling
  documented on the Dialog and Sheet pages do not happen. Keyboard and screen-reader users cannot
  dismiss dialogs with Escape.
- **Verification:** Confirmed (runtime). **Confidence:** High.

### RZUI-011 — Focus is not returned to the dialog trigger
- **Category / severity:** Accessibility · **P1**
- **Evidence:** `rzModal.js:123` takes the invoker from `event.target`, which is `window` for the
  trigger's window event, so the trigger is never recorded. With RZUI-010 fixed, a second problem
  appears: `x-trap.inert` (`RzModalPrimitive.razor:29`) records its own return target when it
  activates, after the focus scope has moved focus to the close button, and on release returns focus
  there (instrumented in the browser: `x-trap` focused the hidden close button after RizzyUI focused
  the trigger).
- **Impact:** After closing a dialog, focus is lost to `<body>` (WCAG 2.4.3); keyboard users start
  over from the top of the page.
- **Verification:** Confirmed (runtime). **Confidence:** High.

### RZUI-013 — `RzButton` replaces its visible text with "Action Button"
- **Category / severity:** Accessibility · **P1**
- **Evidence:** `Components/Form/RzButton/RzButton.razor:9` renders
  `aria-label="@EffectiveAssistiveLabel"` after `@attributes`, and `RzButton.razor.cs:114` defaults it
  to `Localizer["RzButton.AssistiveLabelDefault"]` ("Action Button").
- **Reproduction:** Playwright `getByRole('button', { name: 'Open & Load Content via HTMX' })` finds
  nothing on the docs site; the accessible name of every `RzButton` without `AssistiveLabel` is
  "Action Button". An explicit `aria-label` attribute is overwritten.
- **Impact:** Screen-reader users hear "Action Button" for every button (WCAG 2.5.3 Label in Name,
  4.1.2); speech-control users cannot activate buttons by their visible text.
- **Verification:** Confirmed (runtime). **Confidence:** High.

### RZUI-014 — Raw resource keys rendered to assistive technology
- **Category / severity:** Accessibility, localization · **P1**
- **Evidence:** `RizzyLocalization.en.resx` has 120 keys, the de/es/fr/pt files 61. There is no
  culture-neutral `.resx` and no `NeutralResourcesLanguage`, so a missing key falls through to the
  key itself. `RzSheet.CloseButtonAriaLabel` (`SheetContent.razor:34`) and `RzSpinner.DefaultAriaLabel`
  (`RzSpinner.razor.cs:67,74`) exist in no file.
- **Reproduction:** every docs page (`curl …?culture=en`) contains
  `aria-label="RzSheet.CloseButtonAriaLabel"`; with `culture=de` also
  `aria-label="RzBackToTop.DefaultAriaLabel"`.
- **Verification:** Confirmed (runtime). **Confidence:** High.

### RZUI-032 — `RzInputColor` uses an `x-model` the CSP build rejects
- **Category / severity:** Accessibility/CSP · **P2**
- **Evidence:** `Components/Form/RzInputColor/RzInputColor.razor:24,36` `x-model="colorPicker.value"`;
  the `@alpinejs/csp` 3.15.8 parser forbids property assignment, which `x-model` compiles to.
- **Impact:** In CSP mode every input throws a console error; state still syncs through the
  provider's own `input` listener.
- **Verification:** Confirmed (static). **Confidence:** Medium-High.

### RZUI-047 — `RzSpinner` hides its own status
- **Category / severity:** Accessibility · **P2**
- **Evidence:** `Components/Feedback/RzSpinner/RzSpinner.razor:7-9` puts `aria-hidden="true"`,
  `role="status"` and `aria-label` on the same `<svg>`.
- **Impact:** The status is never announced.
- **Verification:** Confirmed (static). **Confidence:** High.

### RZUI-048 — Dialog and sheet reference IDs that may not exist
- **Category / severity:** Accessibility · **P2**
- **Evidence:** `Components/Feedback/RzDialog/DialogContent.razor:39-40` and
  `RzSheet/SheetContent.razor.cs:90-91` always emit `aria-labelledby`/`aria-describedby` pointing at
  parent-generated IDs that exist only when `DialogTitle`/`DialogDescription` are rendered. The
  runtime pruning (`rzModal.js:75-80`) was unreachable before RZUI-010 was fixed; `rzSheet` has none.
- **Recommendation:** Emit the relationships server-side only when the children are present.
- **Verification:** Confirmed (static). **Confidence:** High.

### RZUI-049 — Tabs before Alpine starts; unescaped tab values in IDs
- **Category / severity:** Accessibility · **P3**
- **Evidence:** `Components/Navigation/RzTabs/TabsTrigger.razor.cs:76` renders `tabindex="-1"` on all
  tabs and `TabsContent.razor:30-32` hides all panels until Alpine runs (no keyboard entry point if
  the runtime fails); `TabsTrigger.razor.cs:44-49` puts `Value` into IDs unescaped (spaces break
  `aria-controls`).
- **Verification:** Confirmed (static). **Confidence:** Medium-High.

### RZUI-059 — Navigation menu opens on focus and announces a menu
- **Category / severity:** Accessibility · **P2**
- **Evidence:** `Components/Navigation/RzNavigationMenu/NavigationMenuTrigger.razor:16`
  `x-on:focus="handleTriggerEnter"` opens the submenu on Tab; `aria-haspopup="true"` announces a menu
  for a disclosure-navigation pattern.
- **Verification:** Needs investigation (runtime, AT). **Confidence:** Medium.

### RZUI-060 — Toast announcements may be unreliable
- **Category / severity:** Accessibility · **P2**
- **Evidence:** each toast element is created with `role`/`aria-live` and inserted
  (`rzToastRenderer.js:174-182`); updates replace the whole node; the stack containers are not live
  regions (`RzToastProvider.razor:18-21`). `docs/accessibility/manual-testing.md` lists Toast as out of
  scope.
- **Impact:** Live regions that are created together with their content are announced inconsistently
  (notably VoiceOver).
- **Verification:** Needs investigation (AT testing). **Confidence:** Medium.

### Duplicate IDs

No duplicate-ID risk was found when a component renders twice: IDs come from
`IdGenerator.UniqueId("rz")` unless the caller passes the same explicit `Id` twice. IDs are not
deterministic (RZUI-061).

## 3. Performance and asset efficiency

Measured on the client build (`packages/rizzyui/dist/js`, minified, gzip level 9):

| Asset | Min | Gzip | Loaded |
|---|---|---|---|
| `rizzyui.min.js` (Alpine) | 45.2 KB | 16.2 KB | every page |
| `rizzyui-csp.min.js` (Alpine CSP build) | 60.1 KB | 19.9 KB | every page (CSP) |
| `chunks/bootstrap.min.js` | 61.7 KB | 20.5 KB | every page |
| `chunks/table-runtime.min.js` (TanStack table) | 64.6 KB | 17.3 KB | data tables |
| `chunks/menu-runtime.min.js` | 24.7 KB | 5.9 KB | menus |
| `chunks/advanced-input-runtime.min.js` | 24.2 KB | 6.6 KB | OTP, slider, combobox, file input |
| `chunks/validationRuntime.min.js` | 20.3 KB | 6.4 KB | `x-validate` |
| `chunks/floating-ui.dom.min.js` | 16.7 KB | 6.7 KB | popovers, tooltips, menus |
| other chunks (11) | 1–17 KB each | 0.7–5.9 KB | on demand |

Eager JavaScript per page: about **36.7 KB gzipped** (standard) or **40.4 KB** (CSP), plus htmx and
`rizzy.js`. No dependency is duplicated across chunks.

### RZUI-056 — Payload composition and asset choices
- **Category / severity:** Performance · **P3**
- **Evidence:**
  - The eager `bootstrap` chunk includes the whole toast system (about 43 KB of source) and
    `@alpinejs/focus` (36 KB of source; `x-trap` is used by three components) and
    `@alpinejs/intersect`, which the library does not use.
  - `canvas-confetti` is bundled (`effects-runtime`) **and** loaded from a CDN by default
    (`ServiceCollectionExtensions.cs:94`).
  - The README and the docs app reference the **unminified** `rizzyui.js` (94 KB, about 2× the bytes
    of `rizzyui.min.js`, which imports the minified chunk set).
  - `dist/js/lib` (0.58 MB of raw component sources that nothing loads, plus tests until RZUI-022)
    ships in both packages.
- **Recommendation:** Measure, then lazy-load the toast runtime and the focus plugin, drop
  `intersect` if unused, remove the confetti CDN key, recommend `rizzyui.min.js`/`rizzyui-csp.min.js`,
  and stop copying `lib/` sources.
- **Verification:** Optional improvement (sizes measured; load-time impact not measured). **Confidence:** Medium.

### RZUI-062 — NuGet package size dominated by highlight.js
- **Category / severity:** Packaging/performance · **P3**
- **Evidence:** `RizzyUI.0.9.2-alpha.nupkg` is 6.4 MB with 1,444 entries; 1,279 are
  `staticwebassets/vendor/highlightjs/**` (13 MB unpacked: every language and theme, in both ESM and
  classic builds).
- **Impact:** Slower restore and publish; every consuming app publishes all of them.
- **Recommendation:** Ship the core plus common languages and one or two themes; document how to add more.
- **Verification:** Confirmed (runtime, package inspection). **Confidence:** High.

Render-time costs (theme allocation per component, RZUI-035; per-render `JsonSerializerOptions`,
`Expression.Compile()` and Markdown pipelines, listed under RZUI-053/RZUI-033) are optimization
hypotheses: no benchmark exists yet (roadmap RM-4.4).

# 02 — Code Quality and APIs

| Field | Value |
|---|---|
| Audit | RizzyUI initial audit |
| Date | 2026-11-15 |
| Repository | https://github.com/JalexSocial/RizzyUI |
| Branch / commit | `main` @ `3fda79b20f3584f0f94f11adc64b5c26496eed54` |
| Scope | C#, Razor and JavaScript defects; lifecycle and cleanup; DI and configuration; public API and component-convention consistency; agent/authoring guidance |
| Methodology | See [00-executive-summary.md](00-executive-summary.md#methodology). Paths and lines refer to the reviewed commit. |
| Limitations | See [00-executive-summary.md](00-executive-summary.md#limitations) |

Findings in this report are about correctness and maintainability. Security, accessibility and
performance findings are in report 04; packaging, CI and tests in report 05; htmx/Rizzy
compatibility in report 03. Resolution status is tracked in
[07-implementation-and-verification.md](07-implementation-and-verification.md), not here.

## Summary

The component layer is consistent where it matters most: every component derives from
`RzComponent<TSlots>`/`RzAsChildComponent<TSlots>`, styling goes through TailwindVariants
descriptors, and every `x-data` root renders `x-load`. The defects cluster in three places:

1. **Client lifecycle**: resources outside the component element are not always released
   (RZUI-025, RZUI-028, RZUI-029), and failure paths are silent (RZUI-026, RZUI-031).
2. **Configuration and DI**: `AddRizzyUI` is not idempotent and is order-sensitive (RZUI-036,
   RZUI-037), and generated URLs ignore `PathBase` (RZUI-038).
3. **Hand-written HTML/JS string building** (asChild markup merge, inline module registration,
   Markdown renderer): see RZUI-015/016 in report 04 and RZUI-039, RZUI-054 here.

## Findings

### RZUI-008 — RizzyUI replaces `window.Rizzy` with a copy
- **Category / severity:** Correctness, integration · **P2**
- **Subsystem:** Client runtime bootstrap
- **Evidence:** `packages/rizzyui/src/js/lib/bootstrap.js:77`:
  `window.Rizzy = { ...(window.Rizzy || {}), ...cachedRizzyUI };`. The API object defines
  `get validation()` (`:68`).
- **Impact:** Rizzy 6's `rizzy.js` creates `window.Rizzy` and keeps a reference to it
  (`const root = window.Rizzy = window.Rizzy || {}`, holding `diagnostics`, `nonce`, `confirm`).
  The spread creates a different object, so anything Rizzy adds to its object later is not visible
  through `window.Rizzy`, and the spread evaluates the `validation` getter once, so
  `window.Rizzy.validation` is always `undefined`. No key names collide today, so nothing broke
  visibly.
- **Recommendation:** Copy property descriptors onto the existing object.
- **Verification:** Confirmed (static); key list confirmed in the browser. **Confidence:** High.

### RZUI-025 — `rzDateEdit` ignores its options and leaks flatpickr instances
- **Category / severity:** Correctness, lifecycle · **P1**
- **Subsystem:** `RzDateEdit` runtime
- **Evidence:** `packages/rizzyui/src/js/lib/components/rzDateEdit.js:35-37`: the `success`
  callback is a `function` that reads `this.options`; `rizzyRequire` calls it as
  `callbackObject.success()` (`runtime/rizzyRequire.js:45`), so `this` is the callback object. The
  component has no `destroy()`. `JSON.parse(this.$el.dataset.assets)` (`:31`) throws when the
  attribute is absent.
- **Impact:** Server-provided options (format, locale, min/max) are silently dropped; every htmx
  swap of a date field leaves a flatpickr calendar element and its document/window listeners behind.
- **Recommendation:** Arrow function, keep the instance, `instance.destroy()` in `destroy()`; add a
  unit test with a fake `require`.
- **Verification:** Confirmed (static). **Confidence:** High.

### RZUI-026 — `rizzyRequire` depends on `crypto.subtle`
- **Category / severity:** Robustness · **P2**
- **Subsystem:** Asset loader
- **Evidence:** `packages/rizzyui/src/js/runtime/rizzyRequire.js:8` hashes the path list with
  `crypto.subtle.digest`; `:31` has no fallback or catch for the callback style.
- **Impact:** `crypto.subtle` exists only in secure contexts. On plain-HTTP origins other than
  localhost (intranet hosts, LAN testing), every component that loads a third-party library (Chart,
  Combobox, DateEdit, Calendar, ColorPicker, CodeViewer, Markdown, Highlighter, Confetti, Carousel)
  never initializes and nothing is logged.
- **Recommendation:** Use the sorted, joined path list as the bundle id; a hash is not needed.
- **Verification:** Confirmed (static). **Confidence:** High.

### RZUI-027 — Toast manager may keep a detached provider after a swap
- **Category / severity:** htmx lifecycle · **P2**
- **Subsystem:** Toast runtime
- **Evidence:** `packages/rizzyui/src/js/lib/notify/rzToastManager.js:266-268` returns early once a
  provider has been found and never checks `isConnected`; the provider is not an Alpine component.
- **Impact:** If an htmx swap replaces the element that contains `<RzToastProvider>` (for example a
  boosted swap of `body`), later toasts render into the detached stack and are invisible.
- **Recommendation:** Re-resolve when `!this.provider.isConnected`; add an integration test that
  swaps the provider.
- **Verification:** Needs investigation (runtime). The docs app swaps `#content`, which does not
  contain the provider, so it does not reproduce there. **Confidence:** Medium.

### RZUI-028 — Sheet and dropdown menus never release their dismissable layer when removed
- **Category / severity:** Lifecycle · **P2**
- **Subsystem:** `rzSheet`, `rzDropdownMenu`, `rzDropdownSubmenu`
- **Evidence:** `rzSheet.js:41,52` register a dismissable layer and focus scope; `rzDropdownMenu.js:127`
  registers a layer. None defines `destroy()`. `runtime/a11y/dismissableLayer.js` removes its
  document listeners only when the layer stack is empty.
- **Impact:** A swap that removes an open sheet or menu leaves a dead layer on top of the stack; the
  next Escape or outside click goes to it first, and the detached DOM stays referenced.
- **Recommendation:** `destroy()` that tears down layer, focus scope and roving focus.
- **Verification:** Confirmed (static). **Confidence:** High.

### RZUI-029 — Observers and loops not cleaned up in three components
- **Category / severity:** Lifecycle · **P3**
- **Evidence:** `rzNumberTicker.js:179` defines `cleanup()`, which Alpine never calls (Alpine calls
  `destroy()`); `rzProgress.js:33` never disconnects its `ResizeObserver`;
  `rzEmbeddedPreview.js:25,49` (docs-oriented) keeps a `ResizeObserver` and a self-rescheduling
  `setInterval`.
- **Recommendation:** Rename/add `destroy()`.
- **Verification:** Confirmed (static). **Confidence:** Medium.

### RZUI-030 — `RzSlider`'s default asset loads the whole runtime as a classic script
- **Category / severity:** Correctness · **P2**
- **Evidence:** `src/RizzyUI/Extensions/ServiceCollectionExtensions.cs:95` maps `SliderScript` to
  `_content/RizzyUI/js/rizzyui.js`; `RzSlider.razor.cs:165` defaults `ComponentAssetKeys` to
  `["SliderScript"]`; `rzSlider.js:41-42` passes it to `rizzyRequire`, which injects a non-module
  `<script>`.
- **Impact:** `rizzyui.js` is an ES module, so as a classic script it fails to parse (or, if it
  parsed, would start a second runtime); pages using the CSP build download the non-CSP runtime.
  Slider behavior itself comes from the already-loaded bundle, so the visible effect is likely a
  console error and a wasted request.
- **Recommendation:** Default `ComponentAssetKeys` to `[]` and drop the `SliderScript` key.
- **Verification:** Needs investigation (runtime). **Confidence:** Medium.

### RZUI-031 — A failed lazy bundle load is cached forever
- **Category / severity:** Resilience · **P2**
- **Evidence:** `packages/rizzyui/src/js/runtime/asyncBundleRegistrar.js:18` caches `loader()`
  including a rejected promise; async-alpine leaves the element `x-ignore`d. By contrast
  `asyncComponentRegistrar.js:9-14` evicts failures. `preloadBundlesForDocument` is exported and
  never used.
- **Impact:** One network error, or a 404 for a stale hashed chunk after a deployment, disables
  every component of that bundle until a full reload, with only an unhandled rejection to show for it.
- **Recommendation:** Evict on rejection and log component and bundle names.
- **Verification:** Confirmed (static). **Confidence:** High.

### RZUI-035 — Every component instance builds a full theme object
- **Category / severity:** Performance · **P2**
- **Evidence:** `src/RizzyUI/RzComponent.cs:107`
  `protected RzTheme Theme { get; private set; } = RzTheme.Default;` and `RzTheme.Default`
  returns `new ArcticTheme()` (`RzTheme.cs:454-459`), which assigns about 260 descriptor references
  and builds two color variants. The value is replaced in `OnInitialized`.
- **Impact:** Hundreds of discarded theme objects per page render; avoidable GC pressure on every
  request. Not measured in this audit (see report 04, performance).
- **Recommendation:** Cache the default theme in a `static readonly` (themes are mutable: freeze
  them or document that the default instance must not be modified), and drop the initializer.
- **Verification:** Confirmed (static). **Confidence:** High.

### RZUI-036 — `AddRizzyUI` is not idempotent; the Vercel theme is duplicated and re-parsed
- **Category / severity:** Correctness · **P2**
- **Evidence:** `src/RizzyUI/Extensions/ServiceCollectionExtensions.cs:77` adds
  `RzTheme.VercelTheme` in `PostConfigure` unconditionally (the guard at `:71` covers only the
  default theme). Calling `AddRizzyUI` twice adds it twice and decorates the localizer factory twice.
  `RzTheme.cs:464`: `VercelTheme` parses the embedded JSON synchronously over an async API on every
  access.
- **Recommendation:** Guard by `ThemeCode`, make registration idempotent with a marker service, and
  cache the parsed theme (`Lazy<RzTheme>`).
- **Verification:** Confirmed (static). **Confidence:** High.

### RZUI-037 — Localization overrides depend on DI registration order
- **Category / severity:** Correctness, developer experience · **P2**
- **Evidence:** `ServiceCollectionExtensions.cs:104-125` checks whether an `IStringLocalizerFactory`
  is registered *when `AddRizzyUI` runs*. If the app calls `AddLocalization()` afterwards, the
  `DummyRizzyStringLocalizer` singleton registered for `IStringLocalizer<RizzyLocalization>` wins
  and application resource overrides (`LocalizationResourceType`/`Location`) are ignored.
- **Recommendation:** Decide at resolve time (register RizzyUI's localizer unconditionally and let
  it look for a factory), or log a warning.
- **Verification:** Confirmed (static). **Confidence:** High.

### RZUI-038 — Generated asset and module URLs ignore `PathBase`
- **Category / severity:** Correctness · **P2**
- **Evidence:** `src/RizzyUI/Constants.cs:24-27` returns `"/_content/RizzyUI/" + path`;
  `Components/Interactivity/RzAlpineComponent.razor.cs:162-166` builds `"/" + …`.
- **Impact:** Apps hosted under a virtual directory get 404s for highlight.js, code-behind modules
  and other built-in asset URLs.
- **Recommendation:** Resolve against `HttpRequest.PathBase`/`NavigationManager.BaseUri` at render time.
- **Verification:** Confirmed (static). **Confidence:** High.

### RZUI-039 — asChild element path: attribute remap throws, class merge bypasses TwMerge
- **Category / severity:** Correctness · **P2**
- **Evidence:** `src/RizzyUI/RzAsChildComponent.CloneFragment.cs:126-129` calls
  `baseAttrs.Add(key.ToLowerInvariant(), …)` for `Id`/`Href` on a dictionary created with
  `StringComparer.OrdinalIgnoreCase`, where the key already exists, which throws
  `ArgumentException`. `:204-206` has `TwMerge.Merge` commented out in favor of string
  concatenation, while the XML docs (`:37-39`, `:184-185`) and the markup path
  (`Utility/Parser/HtmlUtils.cs:203`) use TwMerge.
- **Impact:** A child that receives `Id`/`Href` with that casing fails to render; conflicting
  Tailwind utilities both survive on the element path, and the result differs between the two paths.
- **Recommendation:** Replace with remove-then-set; use TwMerge consistently; add tests for both paths.
- **Verification:** Confirmed (static); the throw path was not executed. **Confidence:** Medium-High.

### RZUI-040 — Agent/authoring guidance contradicts the code and AGENTS.md
- **Category / severity:** Documentation · **P3**
- **Evidence and proposed corrections:**
  - `docs/agents/alpine.md` §10.4–10.5 (around lines 139 and 211–240) tell authors to register
    components in `packages/rizzyui/src/js/lib/components.js` via `registerComponents(Alpine)` and to
    write `export default function(Alpine, require) { Alpine.data(...) }`. That file does not exist;
    AGENTS.md (final checklist) mandates factories exported from one bundle, an entry in
    `componentBundleManifest.js`, and no eager registration. **Correction:** replace §10.4–10.5 with
    the manifest/bundle/`x-load` flow, and import `require` from `runtime/rizzyRequire.js`.
  - The child-container example in `alpine.md` (§10.2) omits `x-load`, which AGENTS.md requires.
    **Correction:** add `x-load="@LoadStrategy"`.
  - AGENTS.md ("Documentation is Mandatory", and the final checklist) points to
    `src/RizzyUI.Docs/Components/Layout/ComponentList.razor`; the file is
    `src/RizzyUI.Docs/Components/ComponentList.razor`. **Correction:** fix both paths.
  - AGENTS.md's accessibility contract requires component tests for every interactive component,
    while the final checklist and `docs/agents/testing.md` say "include unit tests only when
    specifically requested". **Correction:** state that accessibility/regression tests are always
    required for behavior changes, and that the "on request" rule applies to generated scaffolding only.
  - `docs/agents/testing.md` ("Interaction Tests") tells authors to assert that `EventCallback`
    handlers were invoked, which the SSR-only rules forbid. **Correction:** remove that bullet.
  - `docs/agents/alpine.md` §10.1 describes the CSP build as accepting "keys only"; Alpine 3.15's CSP
    parser accepts calls and comparisons but forbids property assignment (see RZUI-032).
- Per AGENTS.md's precedence rule, AGENTS.md wins where these conflict; the corrections above were
  not applied in this audit (owner-maintained specification).
- **Verification:** Confirmed (static). **Confidence:** High.

### RZUI-050 — `AsMarkupString` drops dynamic content
- **Category / severity:** Correctness · **P2**
- **Evidence:** Rizzy's `RenderFragmentExtensions.AsMarkupString` collects markup frames only; used
  by `RzMarkdown.razor.cs:130`, `RzCodeViewer.razor.cs:111`, `RzHeading.razor.cs:123`.
- **Impact:** `<RzMarkdown>@model.Text</RzMarkdown>` would render empty; headings with dynamic
  text get empty quick-reference titles.
- **Verification:** Needs investigation (runtime). **Confidence:** Medium.

### RZUI-051 — Thread-unsafe shared `Random`
- **Category / severity:** Correctness · **P3**
- **Evidence:** `Components/Navigation/RzSidebar/SidebarMenuSkeleton.razor.cs:13,39` and
  `Extensions/StringExtensions.cs:12,98` use a `static readonly Random` across requests.
- **Recommendation:** `Random.Shared`. **Verification:** Confirmed (static). **Confidence:** High.

### RZUI-052 — Queued toasts are dropped silently
- **Category / severity:** Developer experience · **P3**
- **Evidence:** `Services/RzToast/Middleware/RzToastMiddleware.cs:37-41` skips non-htmx requests;
  `:47` skips responses that already started (streaming).
- **Recommendation:** Log at Debug when commands are discarded; document the htmx-only contract.
- **Verification:** Confirmed (static). **Confidence:** High.

### RZUI-053 — Component convention drift and duplication
- **Category / severity:** Maintainability, API consistency · **P2**
- **Evidence (static scan):**
  - No `data-slot` on 18 components, including `RzCarousel` (+4 children), `RzLink`, `RzSwitch`,
    `RzSpinner`, `RzDateEdit`, `RzSteps`, `RzFormSection`, `RzSearchButton`, `RzDarkModeToggle`,
    `AlertDialogContent`, `RzEmbeddedPreview`, `RzQuickReferenceContainer`.
  - `AdditionalAttributes` are not splatted in `RzDialog.razor`, `RzAlertDialog.razor` and
    `RzCommandDialog.razor` (only `x-ref` is honored), so caller attributes are silently dropped.
  - `RzSeparator.razor.cs:86` overwrites `Element` unconditionally.
  - Attribute precedence varies (`RzToastProvider.razor:4-11` lets callers override `role`/`aria-label`;
    most components do not). `RzButton` emitted `aria-label` after `@attributes` (RZUI-013).
  - 82 copies of `if (string.IsNullOrEmpty(Element)) Element = "x";`, 27 copies of the
    case-insensitive attribute-dictionary copy (which throws on keys differing only by case), about
    15 copies of the asset-key → URL → JSON block, and `AriaLabel ??= Localizer[...]` mutating
    `[Parameter]` properties in both `OnInitialized` and `OnParametersSet`.
- **Recommendation:** Shared helpers (`DefaultElement` virtual, attribute-merge utility, asset
  resolver), applied incrementally with characterization tests. Do not rename public APIs.
- **Verification:** Confirmed (static). **Confidence:** High.

### RZUI-054 — `RzAlpineComponent` module path and inline script encoding
- **Category / severity:** Correctness · **P2**
- **Evidence:** `Components/Interactivity/RzAlpineComponent.razor.cs:157` normalizes only
  `Path.DirectorySeparatorChar` of a compile-time `[CallerFilePath]`, so a library built on Windows
  and run on Linux keeps backslashes; `RzAlpineComponent.razor:28` writes `'@Name'` and
  `'@_modulePath'` into a script body through the HTML encoder (no XSS, but `'` and non-ASCII become
  entities and break the string).
- **Recommendation:** Normalize both separators; move the values to `data-` attributes (also better
  for CSP).
- **Verification:** Needs investigation (cross-OS runtime). **Confidence:** Medium.

### RZUI-055 — `ConfigureClasses` mutates the caller's `Classes`
- **Category / severity:** Correctness · **P3**
- **Evidence:** `RzComponentOfT.cs` (`_effectiveClasses = Classes ?? new TSlots(); ConfigureClasses?.Invoke(_effectiveClasses);`).
- **Impact:** A shared `Classes` instance accumulates configuration across renders.
- **Verification:** Confirmed (static). **Confidence:** Medium.

### RZUI-058 — RizzyUI takes over `window.Alpine` unconditionally
- **Category / severity:** Architecture · **P3**
- **Evidence:** `packages/rizzyui/src/js/lib/bootstrap.js:76` sets `window.Alpine` and starts Alpine
  without checking for an existing instance.
- **Impact:** An application that also loads Alpine gets two instances processing the same DOM.
- **Recommendation:** Document that RizzyUI owns Alpine (done in the migration guide); optionally
  warn when `window.Alpine` already exists.
- **Verification:** Architectural concern. **Confidence:** High.

### RZUI-061 — Component IDs are unique per process but not deterministic
- **Category / severity:** Architecture · **P3**
- **Evidence:** `RzComponent.cs:84-85` `Id = IdGenerator.UniqueId("rz")` (Rizzy: interlocked
  counter seeded from ticks, Sqids alphabet shuffled per process). An ID is allocated even when the
  caller supplies one.
- **Impact:** No duplicates within a process, but IDs change on every re-render and differ across
  servers, which hampers snapshot tests and any future morph-based swaps that match by id.
- **Verification:** Architectural concern. **Confidence:** High.

## Checked and not defects

- The toast pipeline's `HX-Trigger` payload uses `[JsonPropertyName]` on every transport type, so
  Rizzy 6's switch to the app's `JsonOptions` cannot change its shape.
- Toast DOM is built with `textContent`, not `innerHTML`; `RzCodeViewer` output is HTML-encoded.
- `RizzyStringLocalizerFactory` lifetimes and `Lazy` usage are correct.
- The `Name1`/`Color1`/`Bitmap1` entries in `RizzyLocalization.en.resx` that a reviewer flagged as
  template junk are inside the standard ResX schema comment; they are not resources.

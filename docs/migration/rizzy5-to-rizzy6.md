# Upgrading RizzyUI to Rizzy 6 and htmx 4

This guide covers what changes for an application that uses RizzyUI when it moves from a RizzyUI
release built on **Rizzy 5.x (htmx 2)** to the current release built on **Rizzy 6 (htmx 4)**.

RizzyUI's own changes are small. Most of the work is Rizzy's and htmx's, so read Rizzy's guide
first: [Upgrading to Rizzy 6 and htmx 4](https://github.com/JalexSocial/Rizzy/blob/main/docs/migration/htmx2-to-htmx4.md).
Finding IDs (RZUI-0xx) refer to the
[2026-11-15 audit](../audits/2026-11-15-rizzyui-initial-audit/00-executive-summary.md).

1. [Compatibility](#compatibility)
2. [Upgrade steps](#upgrade-steps)
3. [Who loads which script](#who-loads-which-script)
4. [Breaking changes in RizzyUI](#breaking-changes-in-rizzyui)
5. [Behavior fixes you may notice](#behavior-fixes-you-may-notice)
6. [Changes in 1.0.0-preview.2](#changes-in-100-preview2)
7. [Worked example](#worked-example)
8. [Troubleshooting](#troubleshooting)

## Compatibility

| RizzyUI | Rizzy | htmx | .NET |
|---|---|---|---|
| 1.0.0-preview.2 (this guide) | 6.0.0-preview.3 | 4.0.1+ (4.x) | 10 |
| 1.0.0-preview.1 | 6.0.0-preview.3 | 4.0.1+ (4.x) | 10 |
| 0.9.2-alpha and earlier | 5.3.x | 2.x | 10 |

The `RizzyUI` NuGet package depends on `Rizzy`, which brings the matching `Rizzy.Htmx`. You do not
need to reference `Rizzy` yourself unless you want to pin it.

## Upgrade steps

1. **Update the packages.**
   ```bash
   dotnet add package RizzyUI --prerelease
   ```
   If you build your CSS with the npm package, update `@jalexsocial/rizzyui` as well. `htmx.org` is
   no longer one of its dependencies (RZUI-003). If you bundle htmx yourself instead of using
   `<RzScripts />`, install `htmx.org@^4.0.1` explicitly.

2. **Register Rizzy and RizzyUI.** `AddRizzy()` now also registers htmx support and Razor
   components. Remove `GenerateStyleNonce`/`InlineStyleNonce` from `AddHtmx(...)`; Rizzy 6 removed
   them. Call `AddHtmx(...)` only if you configure `HtmxConfig`.
   ```csharp
   builder.Services.AddRizzy();
   builder.Services.AddRizzyUI(config => config.DefaultTheme = RzTheme.ArcticTheme);
   ```

3. **Replace the head setup in your root layout.** Use `<RzHeadOutlet />` instead of `<HeadOutlet />`
   and `<HtmxConfigHeadOutlet />`. Replace your htmx and `rizzy.js` script tags with `<RzScripts />`.
   Keep (or add) the RizzyUI module script after them, and remove any `hx-ext="rizzy-nonce"`
   attribute; htmx 4 has no `hx-ext`, and Rizzy registers its extensions itself.
   ```razor
   <RzHeadOutlet />
   <RzScripts />
   <script type="module" nonce="@Nonce" src="_content/RizzyUI/js/rizzyui.min.js"></script>
   ```
   Use `_content/RizzyUI/js/rizzyui-csp.min.js` if the page has a Content Security Policy.

4. **No `<base href="/">` in your layout?** `<RzScripts />` loads Rizzy's client from a relative URL
   (`_content/Rizzy/js/rizzy.js`), which breaks on nested routes without a base element. Either add
   `<base href="/" />` or set an absolute URL:
   ```csharp
   builder.Services.AddRizzy(o => o.ClientScriptUrl = "/_content/Rizzy/js/rizzy.js");
   ```

5. **Remove `antiforgerySnippet.js`** if you included it. It is deprecated, does nothing with htmx 4
   and logs a warning. Rizzy 6 attaches the token for unsafe htmx requests (RZUI-007).

6. **Update your own htmx markup** with the official checker, and click through the app with the
   browser console open:
   ```bash
   npx -p htmx.org@4 upgrade-check --ext .razor --ext .cshtml ./
   ```
   On Windows, set `PYTHONIOENCODING=utf-8` first; the checker prints non-ASCII arrows and crashes
   on the default console code page. RizzyUI's own components use no htmx syntax that changed. The
   change most often missed in RizzyUI apps is the swap modifier `show:window:top`, which htmx 4
   reads differently. Write `show:top showTarget:window`.

7. **Rename htmx event listeners** in your own JavaScript (`htmx:afterSwap` → `htmx:after:swap`,
   and so on). RizzyUI's runtime does not listen to htmx events, so it needs no change.

## Who loads which script

| Script | Loaded by | Notes |
|---|---|---|
| htmx 4 | `<RzScripts />` (Rizzy) | Pinned version with SRI from jsDelivr by default; `HtmxConfig.Scripts` serves your own copy. RizzyUI never loads or bundles htmx. |
| `rizzy.js` + Rizzy's htmx extensions | `<RzScripts />` | `rizzy-nonce`, `rizzy-streaming`, `rizzy-antiforgery`, `rizzy-confirm`. |
| Alpine.js and its plugins | RizzyUI (`rizzyui.js` / `rizzyui-csp.js`) | Bundled; do not load Alpine separately. RizzyUI starts Alpine. |
| RizzyUI component code | RizzyUI, on demand | Chunks under `_content/RizzyUI/js/chunks/`, imported when a component with `x-load` appears. |
| Third-party libraries (Chart.js, Tom Select, flatpickr, …) | RizzyUI components, on demand | URLs come from `RizzyUIConfig.AssetUrls`; override them to self-host. Defaults are pinned jsDelivr versions loaded with SRI; add `RizzyUIConfig.AssetIntegrity[url]` for your own cross-origin URLs. |

The order in `<head>` is: `<RzHeadOutlet />`, then `<RzScripts />`, then the RizzyUI module.
htmx reads the `htmx-config` meta tag once, when it loads, so `<RzHeadOutlet />` must come first.
The RizzyUI module is deferred, so it runs after htmx and `rizzy.js`, and it adds its API to the
same `window.Rizzy` object that Rizzy's client created (RZUI-008).

Content that htmx swaps in is initialized by Alpine's own DOM observer. Dialog, sheet, popover and
dropdown content that Alpine teleports to `<body>` is now passed to `htmx.process()` by RizzyUI,
so `hx-*` attributes inside it work (RZUI-009).

## Breaking changes in RizzyUI

| Before | Now | Finding |
|---|---|---|
| `@jalexsocial/rizzyui` depended on `htmx.org` 2.x | `htmx.org` `^4.0.1` is an optional peer dependency | RZUI-003 |
| `antiforgerySnippet.js` attached the antiforgery token (htmx 2 events) | Deprecated no-op that logs a warning; Rizzy 6 handles antiforgery | RZUI-007 |
| `RzButton` rendered `aria-label="Action Button"` (localized) unless `AssistiveLabel` was set, and overwrote an `aria-label` attribute | No default `aria-label`: the visible text names the button. `AssistiveLabel`, or an `aria-label` attribute, is rendered when set | RZUI-013 |
| `DialogTrigger`/`AlertDialogTrigger` rendered `onclick="window.dispatchEvent(...)"` | Render `x-on:click="openFromTrigger"`, which raises the same `EventTriggerName` window event | RZUI-012 |
| npm `module`/`exports` pointed at `*.es.js` files that were never built | Point at `dist/js/rizzyui.js` / `rizzyui-csp.js`; `./dist/*` is exported | RZUI-002 |
| `RzMarkdown` rendered raw HTML and Markdig generic attributes (`{onclick=...}`) | Raw HTML is escaped and generic attributes are not parsed; set `AllowUnsafeHtml="true"` for trusted content, or pass your own `Pipeline` | RZUI-017 |

**Icon-only buttons.** Before, an icon-only `RzButton` was announced as "Action Button". It now has
no accessible name unless you give it one, which accessibility checkers will report. Add
`AssistiveLabel="Close"` (or similar) to icon-only buttons.

**Markdown with HTML.** If your own Markdown (not user input) contains HTML tags such as `<kbd>` or
`<details>`, they are now shown as text. Add `AllowUnsafeHtml="true"` to those `RzMarkdown`
instances. Keep the default for anything users can write: enabling it allows script injection.

## Behavior fixes you may notice

- **Dialogs and sheets close on Escape** and return focus to the element that opened them (RZUI-010,
  RZUI-011). If your app relied on Escape *not* closing a dialog, set `CloseOnEscape="false"`.
- **Forms and `hx-*` buttons inside dialogs use htmx** instead of submitting natively (RZUI-009).
- **No raw resource keys:** labels that rendered as keys such as `RzSheet.CloseButtonAriaLabel` now
  have text, and partial translations fall back to English (RZUI-014).
- **htmx 4 swaps error responses.** A 4xx or 5xx response to an `hx-get` that targets a dialog body
  is now swapped in, as htmx 4 does by default. See Rizzy's guide for `ValidationFailed()`,
  `UseHtmxErrorHandling()` and `HtmxConfig.NoSwap`.
- **Server toasts** (`IRzToastService` + `UseRzToast()`) are unchanged. They are sent with
  `HX-Trigger`, which htmx 4 raises after the swap; when the element that made the request was
  replaced, htmx raises the event on `document`, where RizzyUI listens.

## Changes in 1.0.0-preview.2

If you already moved to 1.0.0-preview.1, these are the changes in 1.0.0-preview.2 that may need
code changes. The full list is in [CHANGELOG.md](../../CHANGELOG.md) under "1.0.0-preview.2".

| Before | Now | What to do |
|---|---|---|
| `RzCombobox` wrote every public property of each item into the page (`data-item`) | Only `value` and `text` are sent (RZUI-033) | If an `OptionTemplate`/`ItemTemplate` reads other fields, list them: `ItemDataSelector="@(u => new { u.Name, u.Email })"` |
| `RzSwitch` and `RzInputOTP` rendered a default `aria-label` ("Toggle", "One-time password") that replaced the name from a label | No default `aria-label` | Label them with `FieldLabel For` or `<label for>`; pass `aria-label` when there is no visible label |
| `AsChild` with plain markup kept the component's classes on a Tailwind conflict | The child's own classes win on both paths, as documented (RZUI-039) | Check `AsChild` children whose classes conflict with the component's (for example two padding classes) |
| Without `AddLocalization()`, components rendered resource keys; RizzyUI decorated your `IStringLocalizerFactory` | English text is the fallback, and RizzyUI registers only `IStringLocalizer<RizzyLocalization>` (RZUI-036, RZUI-037) | Nothing, unless you resolved RizzyUI strings through your own factory; `Scrutor` is no longer brought in, so add it yourself if your app used it |
| `RzSlider` loaded an extra `SliderScript` asset | No default assets; the key is gone (RZUI-030) | Remove references to the `SliderScript` asset key |
| `Rizzy.toast` calls returned the manager's results immediately | The toast runtime loads on first use; calls before that are queued and return a handle with the toast's id; `dismiss()`/`clear()` return `undefined` and `configure()` returns `Rizzy.toast` while loading (RZUI-056) | `await Rizzy.toast.ready()` before code that needs a return value or the manager |
| `RzConfetti` loaded canvas-confetti from a CDN (`CanvasConfetti` asset key) | Bundled with the component; the key is gone (RZUI-056) | Remove `CanvasConfetti` from any `ComponentAssetKeys` |
| The packages shipped component sources under `dist/js/lib` / `_content/RizzyUI/js/lib` | Only the stylesheets `rizzyui-theme.css` imports and the Razor highlight grammar remain (RZUI-056) | Import from the package entry points |
| `HighlightJsCore` loaded every highlight.js language | Common languages plus PowerShell, Dockerfile, F#, HTTP, nginx and properties (RZUI-062) | For another language, register `vendor/highlightjs/languages/<name>.min.js` as an asset and list its key after `HighlightJsCore` |
| 55 components ignored `Element` | `Element` is honored everywhere (RZUI-053) | Remove `Element` where you passed it without effect |
| Some components took `class`, `aria-label`, `aria-live` or `x-data` from attributes | `role`, `data-slot` and `type` can be overridden with attributes; everything else a component computes comes from its parameters (RZUI-053) | Use the component's parameter (for example `AriaLabel`) instead of the attribute |
| Components wrote localized defaults into their parameters | Parameters keep the value you passed (RZUI-053) | Code reading, for example, `component.AriaLabel` after render sees `null` when you passed none |
| Generated sub-ids (dialog titles, legends, ...) were random | They are `{Id}-title`, `{Id}-legend`, ...; `RzIdScope` gives deterministic ids (RZUI-061) | Nothing, unless CSS or scripts matched the old generated ids |

## Changes since 1.0.0-preview.2

Not released yet. Alpine code-behind (`RzAlpineComponent`) changed; most components need no change.

| Before | Now | What to do |
|---|---|---|
| `RzAlpineComponent` rendered an inline script that registered the module, and a JSON props script (`data-props-id`) | The root has `x-load-src` and `data-rz-props`; no scripts | Nothing, unless code read the props script directly: use `this.$props` or `Rizzy.props(el)` |
| `Name` was required | Optional; a unique name is generated (`rzcb_Counter_1a2b3c4d`) | Remove `Name` unless other markup refers to the component by name |
| `Rizzy.props(this.$el)` in `init()` | `this.$props` in any method, `$props` in markup (`Rizzy.props` still works) | Optional: switch to `this.$props` |
| A `For` component without `[RzAlpineCodeBehind]` rendered a component that never loaded | It throws, naming the attribute and the expected `.razor.js` file | Add `@attribute [RzAlpineCodeBehind]` to the component |
| `AsChild` with plain markup joined conflicting attribute values (`id="rzX1 mine"`) | The child's own value wins, as with element children | Check `AsChild` children with an `id` or other attributes the component also sets |
| Module URLs were plain paths with `Cache-Control: no-cache` | Fingerprinted when the app calls `MapStaticAssets()` | Add `app.MapStaticAssets()` (and `.WithStaticAssets()` on controllers or Razor Pages) to get long-lived caching |
| `<RzProgress CurrentValue="40" MinValue="0" MaxValue="100" />` | `<RzProgress Value="40" Min="0" Max="100" />`; `Value` is `double?` and `null` is indeterminate | Rename the parameters |
| `Label="{percent}% done"`, `LabelPosition` | A visible label in markup referenced with `aria-labelledby`; `ProgressLabel` for text on the bar; `ValueText` for `aria-valuetext` | Replace `Label`/`LabelPosition`; `{percent}` has no replacement in C# (`ProgressLabel` without content shows the percentage) |
| `AriaLabel` defaulted to "Progress Bar" | No default | Give each bar a name: `aria-labelledby` or `AriaLabel` |
| Theme slots `OuterBar`, `InnerBar`, `InsideLabel*`, `OutsideLabel*` on `RzProgress` | `RzProgress` (track), `ProgressIndicator`, `ProgressLabel` descriptors | Move theme overrides to the new descriptors, or style instances with `class` |

## Worked example

Before (Rizzy 5, htmx 2):

```csharp
builder.Services.AddRizzy();
builder.Services.AddHtmx(config => { config.GenerateStyleNonce = true; });
builder.Services.AddRizzyUI();
builder.Services.AddRazorComponents();
```

```razor
<head>
    <HtmxConfigHeadOutlet />
    <link rel="stylesheet" href="css/app.css" />
    <HeadOutlet />
    <script nonce="@Nonce" defer src="vendor/htmx/htmx.min.js"></script>
    <script nonce="@Nonce" defer src="_content/Rizzy/js/rizzy.js"></script>
    <script nonce="@Nonce" type="module" src="_content/RizzyUI/js/rizzyui.min.js"></script>
</head>
<body hx-ext="rizzy-nonce">
    <a href="/orders" hx-boost="true" hx-select="#content" hx-target="#content"
       hx-swap="outerHTML show:window:top">Orders</a>
</body>
```

After (Rizzy 6, htmx 4):

```csharp
builder.Services.AddRizzy(o => o.ClientScriptUrl = "/_content/Rizzy/js/rizzy.js"); // no <base href>
builder.Services.AddRizzyUI();
// Optional: serve htmx from your own copy (same version as Rizzy pins, so SRI still applies)
builder.Services.AddHtmx(o => o.Scripts = new HtmxScriptOptions { BaseUrl = "/vendor/htmx/", Integrity = true });
```

```razor
<head>
    <link rel="stylesheet" href="css/app.css" />
    <RzHeadOutlet />
    <RzScripts />
    <script nonce="@Nonce" type="module" src="/_content/RizzyUI/js/rizzyui.min.js"></script>
</head>
<body>
    <a href="/orders" hx-boost="true" hx-select="#content" hx-target="#content"
       hx-swap="outerHTML show:top showTarget:window">Orders</a>
</body>
```

The RizzyUI documentation app made exactly these changes; see `src/RizzyUI.Docs/Program.cs`,
`Components/App.razor` and `Components/Layout/PreviewLayout.razor`. A minimal working consumer,
with a strict nonce-based CSP, is in `eng/consumer-smoke/app`.

## Troubleshooting

| Symptom | Cause and fix |
|---|---|
| Console warning from rizzy.js that the page has no `<meta name="htmx-config">` | The root layout does not render `<RzHeadOutlet />`. |
| 404 for `.../components/_content/Rizzy/js/rizzy.js` | No `<base href="/">`: set `RizzyConfig.ClientScriptUrl` to an absolute URL. |
| Startup warning: *RootComponent is the default HtmxApp&lt;EmptyLayout&gt;* | Expected if you only render through `MapRazorComponents<App>()` and never return Rizzy views. Set `RootComponent = typeof(HtmxApp<YourLayout>)` if you do use Rizzy views (`IRizzyService`, `RzController`). |
| Unsafe htmx requests fail with 400 | The antiforgery token is read from the htmx-config meta tag: render `<RzHeadOutlet />` before `<RzScripts />` and call `app.UseAntiforgery()`. |
| Page scrolls to the bottom of the swapped content after navigation | Old swap syntax: replace `show:window:top` with `show:top showTarget:window`. |
| Icon-only buttons flagged by accessibility checkers | Set `AssistiveLabel` (see Breaking changes). |
| Alpine loaded twice / components initialized twice | Remove your own Alpine script; the RizzyUI runtime includes and starts Alpine. |

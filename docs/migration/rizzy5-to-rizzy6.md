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
6. [Worked example](#worked-example)
7. [Troubleshooting](#troubleshooting)

## Compatibility

| RizzyUI | Rizzy | htmx | .NET |
|---|---|---|---|
| Unreleased (this guide) | 6.0.0-preview.2 | 4.0.1+ (4.x) | 10 |
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
   <script type="module" nonce="@Nonce" src="_content/RizzyUI/js/rizzyui.js"></script>
   ```
   Use `_content/RizzyUI/js/rizzyui-csp.js` if the page has a Content Security Policy.

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
| Third-party libraries (Chart.js, Tom Select, flatpickr, …) | RizzyUI components, on demand | URLs come from `RizzyUIConfig.AssetUrls`; override them to self-host. |

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

**Icon-only buttons.** Before, an icon-only `RzButton` was announced as "Action Button". It now has
no accessible name unless you give it one, which accessibility checkers will report. Add
`AssistiveLabel="Close"` (or similar) to icon-only buttons.

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
    <script nonce="@Nonce" type="module" src="_content/RizzyUI/js/rizzyui.js"></script>
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
    <script nonce="@Nonce" type="module" src="/_content/RizzyUI/js/rizzyui.js"></script>
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

# Client runtime, script ownership and htmx integration

How RizzyUI's browser code is loaded, what it owns, and how it cooperates with Rizzy 6 and htmx 4.
This is the engineering reference; the consumer-facing version is in
[docs/migration/rizzy5-to-rizzy6.md](../migration/rizzy5-to-rizzy6.md#who-loads-which-script).

## Ownership

| Concern | Owner | Why |
|---|---|---|
| htmx | The application, through Rizzy's `<RzScripts />` | Rizzy pins and tests one htmx version (SRI hashes in `Rizzy.Htmx.HtmxAssets`) and loads its extensions after it. RizzyUI does not import htmx; bundling it would load htmx twice. `htmx.org` is an **optional peer dependency** of `@jalexsocial/rizzyui` to state the supported range. |
| `rizzy.js` and Rizzy's htmx extensions | Rizzy (`<RzScripts />`) | Antiforgery, nonce, streaming and confirm handling belong to the framework. |
| Alpine.js and plugins (collapse, focus, intersect, async-alpine) | RizzyUI (`rizzyui.js` / `rizzyui-csp.js`) | Components depend on specific Alpine plugins and the CSP build. RizzyUI sets `window.Alpine` and starts Alpine. |
| Component behaviors | RizzyUI chunks, loaded on demand | `x-load` + `componentBundleManifest.js` + `bundleLoaderRegistry.js`. |
| Third-party widget libraries | RizzyUI components, through `rizzyRequire` | Resolved from `RizzyUIConfig.AssetUrls`. |

## Order of execution

1. `<RzHeadOutlet />` renders `HeadOutlet` and the `htmx-config` meta tag (htmx settings, antiforgery token).
2. `<RzScripts />` renders classic scripts, all with the request nonce: htmx (htmx reads the meta tag here), `rizzy.js` (creates `window.Rizzy`, diagnostics, nonce and confirm), then the enabled extensions.
3. The RizzyUI module (`type="module"`, therefore deferred) runs `bootstrapRizzyUI`:
   - registers the Alpine plugins, directives and one `Alpine.asyncData` loader per manifest component;
   - **merges** its API into the existing `window.Rizzy` (property descriptors are copied, so getters stay live and Rizzy's reference stays valid; `runtime/rizzyGlobal.js`);
   - installs the **htmx teleport bridge** (`runtime/htmxTeleportBridge.js`);
   - starts Alpine in a microtask.
4. htmx processes the document on `DOMContentLoaded`.

## Content inserted after load

| Inserted by | Who initializes it |
|---|---|
| htmx swap (including boosted navigation and out-of-band swaps) | htmx processes the new content itself. Alpine's `MutationObserver` initializes `x-data` roots; async components load their chunk first (`x-load`). Removed roots get `destroy()`. |
| Alpine `x-teleport="body"` (dialog, sheet, popover, dropdown content) | Alpine initializes it. htmx has no DOM observer, so the teleport bridge calls `htmx.process()` on every element added directly under `<body>`. `htmx.process` skips elements it already initialized. |
| `rzCommandList` dynamic items | The component calls `htmx.process(container)` itself. |

Rules for component authors:

- Components must release everything outside their own element in `destroy()`: window/document
  listeners, observers, dismissable layers, focus scopes and third-party instances. An htmx swap can
  remove a component while it is open.
- Teleported panels are not DOM descendants of the component. Find them through `x-ref` / `$refs`,
  and do not read `$refs` during `init()` (Alpine caches the `$refs` proxy on first access, before
  the teleported `x-ref` exists); defer with `$nextTick`.
- Do not use inline event handler attributes (`onclick=...`); a nonce-based CSP blocks them. Use
  `x-on:` with a method name, which the CSP build accepts.
- Do not listen for htmx 2 event names. If a component must react to htmx, use htmx 4 names
  (`htmx:after:swap`, `htmx:before:request`, ...).

## Content Security Policy

- Every script tag carries the request nonce: `<RzScripts />` does this; put `nonce` on the RizzyUI
  module tag yourself.
- Use `rizzyui-csp.js` (Alpine CSP build, no `eval`). A policy such as
  `script-src 'nonce-…' 'strict-dynamic'; object-src 'none'; base-uri 'self'` lets the runtime import
  its chunks and inject third-party scripts through `rizzyRequire` (which copies the nonce).
- Do not set `HtmxConfig.GenerateScriptNonce`/`InlineScriptNonce`; see Rizzy's guide.
- `eng/consumer-smoke-test.sh` runs a packaged consumer under exactly this policy and fails on any
  `securitypolicyviolation`.

## Verification

- JS unit tests: `cd packages/rizzyui && npm test` (`runtime/__tests__/rizzyGlobal.test.mjs`,
  `htmxTeleportBridge.test.mjs`, `lib/components/__tests__/rzModal.test.mjs`).
- Real app, real browser: `cd src/RizzyUI.Docs && npm run test:integration`
  (`tests/integration/rizzy6-htmx4.spec.ts`).
- Packaged consumer under CSP: `bash eng/consumer-smoke-test.sh <nupkg-dir> <version> [<npm-tgz>]`.

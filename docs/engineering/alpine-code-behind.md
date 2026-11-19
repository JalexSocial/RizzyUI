# Alpine code-behind: architecture

How a component's `Component.razor.js` module gets from the project to a running Alpine component,
and what must stay stable. User documentation: "Your First Code-Behind" and "Building and Deploying
Code-Behind" on the docs site.

## The pieces

| Piece | Where | Job |
|---|---|---|
| `[RzAlpineCodeBehind]` | `src/RizzyUI/Attributes` | Captures the component's source file path (`[CallerFilePath]`). |
| `[assembly: AssemblyRzAlpineCodeBehind]` | emitted by `build/RizzyUI.targets` | The project directory prefix (after source path mapping) and the static web asset base path, to turn the source path into a web path. |
| `RzAlpineModuleResolver` | `Components/Interactivity` | Asset key for a type (`Features/Counter.razor.js`), the URL to load (fingerprinted when known), and the generated data name. |
| `RzAlpineComponent` | `Components/Interactivity` | Renders the root: `x-data`, `x-load`, `x-load-src`, `data-rz-props`, optional `data-rz-module-fallback`, and a `modulepreload` link. |
| async-alpine | npm dependency | Reads `x-load` / `x-load-src`, downloads on the strategy, registers `Alpine.data`, starts the element. |
| `codeBehindLoader.js` | `packages/rizzyui/src/js/runtime` | Replaces `Alpine.asyncUrl`: one loader per name, fallback URL, one error report, `rz:module-error`. |
| `alpineProps.js` | `packages/rizzyui/src/js/lib` | `Rizzy.props(el)` and the `$props` magic. |
| `RizzyUI.targets` | `src/RizzyUI/build` | The `RZUI1001` check, the type declarations copy, the optional esbuild pipeline. |

## Rendered contract

```html
<link rel="modulepreload" href="/Features/Counter.ezjsubrzj2.razor.js" nonce="…">  <!-- eager only, once per request -->
<div id="rzX" data-alpine-root="rzX"
     x-data="rzcb_Counter_1a2b3c4d" x-load="eager"
     x-load-src="/Features/Counter.ezjsubrzj2.razor.js"
     data-rz-module-fallback="/Features/Counter.razor.js"
     data-rz-props='{"initialCount":10}'>
```

- **No inline scripts.** The first implementation rendered a script per instance that called
  `window.Rizzy.registerAsyncComponent`. Rizzy 6 defines `window.Rizzy` before RizzyUI's module runs,
  so the call failed in the initial page; it also needed a nonce per instance. Everything is in
  attributes now.
- **The data name is derived from the URL.** `rzcb_{Type}_{FNV-1a of the URL}`. The fingerprint is
  part of the URL, so a deployment that changes the module changes the name. async-alpine caches
  modules by name (first registration wins), so without this a long-lived htmx page would run the
  old module against new markup. An explicit `Name` opts out.
- **Fingerprints come from `ResourceAssetCollection`.** The page's `Assets` when rendered by a Razor
  components endpoint (or controllers/pages with `WithStaticAssets()`); otherwise the collection on
  any endpoint in `EndpointDataSource`, so fragments rendered by minimal APIs get the same URL as the
  page. Without `MapStaticAssets()` the plain path is used.
- **Props are camelCase JSON** (`JsonSerializerDefaults.Web`) in an attribute. `$props` resolves the
  nearest element with `x-load-src`, `data-rz-props` or `data-props-id`, so a nested code-behind
  component without props does not see its parent's.

## Build and deployment

- `.razor.js` files are static web assets (SDK JS module collocation): published byte for byte,
  fingerprinted and compressed by the SDK.
- With `RizzyUICodeBehindBuild=esbuild`, `_RizzyUI_BuildCodeBehindModules` runs before
  `ResolveJSModuleStaticWebAssets`: it bundles every `*.razor.ts` / `*.razor.js` into
  `obj/rizzyui-codebehind/`, removes the source `.razor.js` items from `Content`/`None`, and adds the
  outputs as `Content` with `Link` set to the source's relative path. The SDK then treats them as
  the modules at the same paths. Output stays ESM; only whitespace/syntax minification (never
  properties: markup refers to them by name).
- Static export (the docs site): copy every route ending in `.razor.js` from
  `{App}.staticwebassets.endpoints.json`, unchanged (see `StaticResourcesInfoProviderExtensions`).

## Tests

- .NET: `RzAlpineComponentTests`, `AsChildMergeTests`, `PathBaseTests`.
- JS: `codeBehindLoader.test.mjs`, `alpineProps.test.mjs`, `tests/types.test.mjs` (declarations
  type-check a module), `tests/testing.test.mjs` (the test helper under happy-dom).
- Browser: `tests/integration/codebehind.ts` on `/_tests/codebehind`, standard and CSP builds
  (initial page, nested, htmx swaps, TypeScript via esbuild, fallback URL, missing module, the docs
  example).
- Package: the consumer smoke test (packed NuGet package, strict `'strict-dynamic'` CSP,
  `UseStaticFiles` only) and the template test (`rizzyui-codebehind`, fingerprinted URL with an
  immutable cache header, type declarations in `obj/rizzyui/`).

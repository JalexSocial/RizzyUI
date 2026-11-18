# highlight.js for RizzyUI

[highlight.js](https://highlightjs.org/) 11.10.0 (BSD-3-Clause, see `LICENSE`), used by
`RzCodeViewer` and `RzMarkdown`.

| File | Contents |
|---|---|
| `highlight.min.js` | Core plus the languages below. Asset key `HighlightJsCore`. Built by `npm run build:highlightjs` in `packages/rizzyui` (`build/build-highlightjs.mjs`); not part of the regular build. |
| `languages/*.min.js` | Every other highlight.js language, one file each, from `@highlightjs/cdn-assets` 11.10.0. Each registers itself on `window.hljs`, so it must load after `highlight.min.js`. |

Built-in languages: bash, c, cpp, csharp, css, diff, dockerfile, fsharp, go, graphql, http, ini,
java, javascript, json, kotlin, less, lua, makefile, markdown, nginx, objectivec, perl, php,
php-template, plaintext, powershell, properties, python, python-repl, r, ruby, rust, scss, shell,
sql, swift, typescript, vbnet, wasm, xml (also HTML), yaml. Razor (`cshtml-razor`) comes from the
`HighlightJsRazor` asset.

## Adding a language

Register the language file as an asset and list its key after `HighlightJsCore`; assets load in
order:

```csharp
builder.Services.AddRizzyUI(config =>
{
    config.AssetUrls["HighlightJsElixir"] = Constants.ContentUrl("vendor/highlightjs/languages/elixir.min.js");
});
```

```razor
<RzCodeViewer Language="elixir" Source="@code"
              ComponentAssetKeys="@(new[] { "HighlightJsCore", "HighlightJsRazor", "HighlightJsElixir" })" />
```

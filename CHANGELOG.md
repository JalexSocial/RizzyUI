# Changelog

All notable changes to the `RizzyUI` NuGet package and the `@jalexsocial/rizzyui` npm package are
recorded here. The two packages are released together, with one version number, from a `vX.Y.Z`
git tag (see [docs/contributing/releasing.md](docs/contributing/releasing.md)).

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and RizzyUI uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html). Breaking changes are listed under
"Breaking" with a migration note. Pre-release versions may change between previews.

Finding IDs (RZUI-0xx) refer to the
[2026-11-15 initial audit](docs/audits/2026-11-15-rizzyui-initial-audit/00-executive-summary.md).

## [Unreleased]

RizzyUI now targets **Rizzy 6** (`6.0.0-preview.2`) and **htmx 4**. See the
[migration guide](docs/migration/rizzy5-to-rizzy6.md).

### Breaking

- **Rizzy 6 and htmx 4 are required.** The `RizzyUI` package depends on `Rizzy` 6.0.0-preview.2,
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

### Fixed

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

### Changed

- Documentation app and examples use `<RzHeadOutlet />` and `<RzScripts />` (Rizzy 6) and htmx 4
  syntax (`show:top showTarget:window`). (RZUI-005, RZUI-006)
- CI runs on every pull request and never publishes. Releases are published by a separate,
  tag-triggered workflow that requires approval. The documentation site deploys from its own
  workflow. (RZUI-019)

# 05 — Testing, Packaging and Release

| Field | Value |
|---|---|
| Audit | RizzyUI initial audit |
| Date | 2026-11-15 |
| Repository | https://github.com/JalexSocial/RizzyUI |
| Branch / commit | `main` @ `3fda79b20f3584f0f94f11adc64b5c26496eed54` |
| Scope | Build and test baseline, test inventory and gaps, NuGet and npm packaging, versioning, CI/CD and release process, dependency hygiene |
| Methodology | See [00-executive-summary.md](00-executive-summary.md#methodology). Published packages were downloaded from nuget.org/npm and inspected. |
| Limitations | GitHub Actions workflows were linted and their steps run locally, but not executed on GitHub; registry trusted-publishing setup cannot be verified from the repository. |

## 1. Baseline (original commit, Rizzy 5.3.0)

Environment: Windows 11, .NET SDK 10.0.115 (11.0.100 also installed), Node.js 26.13.1 / npm 9.7.1
(CI uses Node 22), Chrome for Playwright.

| Check | Command | Result |
|---|---|---|
| .NET build | `dotnet build src/RizzyUI.sln -c Release` | **PASS**, 0 errors, 3 warnings: CS0628 (`WebAppFixture.SetCulture`), NU1902 ×2 (`AngleSharp 1.4.0`, test-only); 1 min 10 s |
| Committed client assets | rebuilt as part of the docs build | `packages/rizzyui/dist` and `src/RizzyUI/wwwroot` reproduced exactly; only `src/RizzyUI.Docs/wwwroot/css/app.css` changed (Tailwind output of the docs app) |
| .NET tests | `dotnet test src/RizzyUI.sln -c Release --no-build` | **PASS**, 484/484 |
| JS unit tests | `cd packages/rizzyui && npm test` | **PASS**, 75/75 |
| JS tests outside the glob | `node --test "tests/**/*.test.mjs"` | **FAIL**, 22/26: 4 `rzTooltip` tests fail on Windows checkouts (RZUI-024) |
| Accessibility inventory | `cd src/RizzyUI && npm test && npm run check-accessibility-inventory` | **PASS**, 4/4; the check exits 0 (see RZUI-043) |
| Playwright accessibility | `cd src/RizzyUI.Docs && npm run test:a11y` | **PASS**, 63 passed, 2 skipped; the run rewrote tracked vendor files (RZUI-045) |

## 2. Test inventory

| Suite | Size | Covers | Does not cover |
|---|---|---|---|
| bUnit + Alba (`src/RizzyUI.Tests`) | 97 files, 484 tests | Rendered markup, classes, slots, ARIA attributes, data attributes, toast middleware `HX-Trigger` | Anything that runs in a browser; the Alba host has no middleware pipeline and shares one `HttpContext` across tests (RZUI-044) |
| Node `node:test` (`packages/rizzyui`) | 75 run + 26 orphaned | a11y primitives, toast runtime, DataTable state, NavigationMenu, Clipboard, Alert, manifest | bootstrap, async bundle loading, `rizzyRequire`, `destroy()` cleanup (except tooltip/sidebar/tabs), htmx interaction |
| Playwright (`src/RizzyUI.Docs/tests/accessibility`) | 14 fixture pages, 65 tests | Keyboard/focus/axe contracts **of hand-written re-implementations** | Real component markup and runtime, htmx, CSP (RZUI-023) |
| Accessibility inventory (`tools/accessibility-inventory`) | 1 script | Presence of docs/test files by name | Whether the tests test anything (RZUI-043) |
| Package / consumer tests | none | — | Everything consumers receive (RZUI-001, -002, -021, -022 shipped undetected) |

## 3. Findings

### RZUI-001 — Published npm package depends on the docs project
- **Category / severity:** Packaging · **P1**
- **Evidence:** `packages/rizzyui/package.json:82` `"rizzyui.docs": "file:../../src/RizzyUI.Docs"`, also
  in the published `@jalexsocial/rizzyui@0.9.2-alpha`. Root cause:
  `src/RizzyUI.Docs/package.json:12` `"prebuild:css": "npm install --prefix ../../packages/rizzyui"`
  re-adds it on every docs CSS build (reproduced: the entry reappeared after removing it and building).
- **Reproduction:** installing `@jalexsocial/rizzyui@0.9.2-alpha` into an empty project succeeds but
  leaves `node_modules/rizzyui.docs` as a dangling symlink to `node_modules/src/RizzyUI.Docs`.
- **Impact:** Broken links in every consumer's `node_modules`; a `file:` path in a published manifest
  can resolve to unexpected content.
- **Verification:** Confirmed (runtime). **Confidence:** High.

### RZUI-002 — npm entry points reference files that are never built
- **Category / severity:** Packaging · **P1**
- **Evidence:** `packages/rizzyui/package.json:6` `"module": "dist/js/rizzyui.es.js"`, `:9` and the
  `./csp`/`./antiforgerySnippet` `import` conditions point at `*.es.js` files the build has not
  produced (`build/paths.mjs` still lists them); `require` conditions point at ES modules; no `"type"`.
- **Reproduction:** `eng/check-package-contents.py` against the published tarball reports four
  missing targets.
- **Impact:** `import '@jalexsocial/rizzyui'` (bundlers, `import.meta.resolve`) fails; CSS under
  `dist/css` cannot be imported through the package name because `exports` does not expose it.
- **Verification:** Confirmed (runtime). **Confidence:** High.

### RZUI-019 — CI publishes from every push to `main`, and publish failures are ignored
- **Category / severity:** Release engineering · **P1**
- **Evidence:** `.github/workflows/dotnet.yml:11` (only `push` to `main`, no `pull_request`), `:125`
  `continue-on-error: true` on the publish job, `:143` `brandedoutcast/publish-nuget@v2.5.2`
  (an archived third-party action) with a long-lived `NUGET_API_KEY`, `:185` `npm publish` with a
  long-lived `NPM_TOKEN`; the npm version is copied from the csproj at publish time; `actions/cache@v3`.
- **Impact:** Pull requests are never validated; any merge publishes whatever version the csproj
  says (or silently fails, because the publish job cannot fail the run); package publishing,
  documentation deployment and validation are one pipeline; publishing relies on stored secrets and
  an unmaintained action.
- **Recommendation:** Split into CI (PRs and pushes, never publishes), a tag-triggered release
  workflow gated by an approval environment with trusted publishing, and a docs deployment workflow,
  as Rizzy does.
- **Verification:** Confirmed (static). **Confidence:** High.

### RZUI-020 — The MSBuild targets that build client assets never run
- **Category / severity:** Build reproducibility · **P2**
- **Evidence:** `src/RizzyUI/RizzyUI.csproj:63,69` hook `InstallClientPackages`/`BuildClientAssets`
  to `BeforeTargets="DispatchToInnerBuilds"`, a target that only exists for multi-targeted projects;
  `RizzyUI` has a single `TargetFramework`. Across five `dotnet build` runs the targets' messages
  never appeared.
- **Impact:** `dotnet build`/`dotnet pack` package whatever is committed in `src/RizzyUI/wwwroot`;
  nothing checks that it matches `packages/rizzyui/src`. (At baseline it did match.) Contributors
  editing JS can believe the build picked up their change.
- **Recommendation:** Keep committed assets plus a CI drift check (implemented), and either delete
  the dead targets or hook them to a target that runs (owner decision D-6: building with Node on
  every `dotnet build` slows builds and requires Node for .NET-only contributors).
- **Verification:** Confirmed (runtime). **Confidence:** High.

### RZUI-021 — The NuGet package adds repository tooling files to consuming projects
- **Category / severity:** Packaging · **P2**
- **Evidence:** `RizzyUI.0.9.2-alpha.nupkg` contains `content/` and `contentFiles/any/net10.0/` copies
  of `package.json`, `package-lock.json`, `DefaultDocumentation.json` and
  `tailwind.extension.json` (`buildAction="Content"`): files of the `src/RizzyUI` npm workspace.
- **Impact:** These files appear as `Content` in every consuming project and can be published with it.
- **Verification:** Confirmed (runtime, package inspection). **Confidence:** High.

### RZUI-022 — Unit tests ship in both packages
- **Category / severity:** Packaging · **P3**
- **Evidence:** `packages/rizzyui/build/build-assets.mjs:7` copies all of `src/js/lib` (including
  `__tests__`) into `dist/js/lib`, and `copy-dist` copies that into `wwwroot`. The published npm
  tarball contains five `*.test.mjs` files; the NuGet package serves them as static web assets.
- **Verification:** Confirmed (runtime). **Confidence:** High.

### RZUI-023 — Browser tests do not test RizzyUI components
- **Category / severity:** Testing (architecture) · **P1**
- **Evidence:** the 14 `src/RizzyUI.Docs/wwwroot/accessibility-*.html` pages are hand-written HTML
  with inline scripts that re-implement each widget (`accessibility-dialog.html:30-96`,
  `accessibility-tabs.html:33-95`); none loads RizzyUI's runtime, Alpine or htmx. The `-csp` variants
  are byte-identical to the non-CSP pages and the static server sends no CSP header. Only
  `navigation-menu.a11y.spec.ts` evaluates real component JS, on hand-written markup.
  `homepage-regression.spec.ts` skips itself when `docs/index.html` is absent, which it always is in
  CI at that step.
- **Impact:** A green suite says nothing about shipped components: RZUI-010, RZUI-011, RZUI-012,
  RZUI-013 and RZUI-009 all passed it. Component docs cite these specs as evidence.
- **Recommendation:** Run the contracts against the real docs app (an integration suite now exists,
  report 07); migrate fixture specs component by component; send a real CSP for CSP variants.
- **Verification:** Confirmed (static). **Confidence:** High.

### RZUI-024 — JavaScript unit tests are not run in CI, and part of the suite is orphaned
- **Category / severity:** Testing · **P2**
- **Evidence:** `dotnet.yml:61-63` runs `npm test` only in `src/RizzyUI` (the inventory checker);
  `packages/rizzyui` gets `npm ci` only. `packages/rizzyui/package.json` `test` globs
  `src/js/**/*.test.mjs`, so `packages/rizzyui/tests/*.test.mjs` (accordion, sidebar, tabs, tooltip,
  focusable) never run; 4 tooltip tests fail on Windows because the loader's import-stripping regex
  (`tests/rzTooltip.test.mjs:7`) expects `\n` and the checkout has CRLF.
- **Verification:** Confirmed (runtime). **Confidence:** High.

### RZUI-042 — Package versions are not aligned or controlled
- **Category / severity:** Release engineering · **P2**
- **Evidence:** `src/RizzyUI/RizzyUI.csproj:33` `0.9.2-alpha`, `packages/rizzyui/package.json` `0.9.2`;
  the workflow overwrote the npm version from the csproj at publish time. The csproj holds the
  **already-published** version, so every CI build produces packages that claim to be 0.9.2-alpha.
  `RizzyUI.Tasks` (1.3.5) is versioned and published separately but consumed from nuget.org rather
  than from the solution. No CHANGELOG exists.
- **Recommendation:** One version for NuGet and npm, set in one place, with a `-dev` suffix between
  releases; tag-driven releases that verify the tag matches; a CHANGELOG. Owner decisions D-3 (scheme
  and next version) and D-5 (`RizzyUI.Tasks`).
- **Verification:** Confirmed (static). **Confidence:** High.

### RZUI-043 — The accessibility inventory checker proves little and is a no-op on Windows
- **Category / severity:** Testing · **P2**
- **Evidence:** `tools/accessibility-inventory/check-accessibility-inventory.mjs:166-191` checks that
  files with matching names exist; the contract list (`:5-24`) omits Toast, AlertDialog, Carousel,
  Slider, Calendar, DateEdit, InputOTP, Collapsible, Toggle and ColorPicker; the main guard (`:274`,
  `` `file://${argv[1]}` ``) never matches a Windows path, so locally the script exits 0 without checking.
- **Verification:** Confirmed (static). **Confidence:** High.

### RZUI-044 — Test host hygiene
- **Category / severity:** Testing · **P3**
- **Evidence:** `src/RizzyUI.Tests/Assets/Alba/AlpineAssemblyAttributes.cs:3` hard-codes
  `/workspace/RizzyUI/src/RizzyUI.Tests/`; `WebAppFixture.cs:23-26` shares one `DefaultHttpContext`
  through a mocked accessor; CS0628 warning; `AngleSharp 1.4.0` advisory (NU1902, via bUnit).
- **Verification:** Confirmed (static). **Confidence:** High.

### RZUI-045 — Running the accessibility suite modifies tracked files
- **Category / severity:** Developer experience · **P3**
- **Evidence:** `pretest:a11y` (`copy-tom-select-assets.mjs`) rewrote
  `src/RizzyUI.Docs/wwwroot/vendor/tom-select/*` (tracked) and the run left an untracked
  `test-results/` folder.
- **Verification:** Confirmed (runtime). **Confidence:** High.

### RZUI-046 — The docs project runs `npm install` on every build
- **Category / severity:** Build reproducibility · **P3**
- **Evidence:** `src/RizzyUI.Docs/RizzyUI.Docs.csproj` target `EnsureNodeModules`
  (`BeforeTargets="Build"`) runs `npm install`, which can rewrite `package-lock.json`; the Tailwind
  target then runs `npm run build:css` and its `prebuild:css` installs into `packages/rizzyui`.
- **Impact:** Builds mutate lockfiles and need network access; CI should use `npm ci`.
- **Verification:** Confirmed (static). **Confidence:** High.

## 4. Packaging review

| Aspect | NuGet `RizzyUI` | npm `@jalexsocial/rizzyui` |
|---|---|---|
| Version | 0.9.2-alpha (csproj) | 0.9.2 (manifest), published as 0.9.2-alpha |
| Dependencies | Rizzy 5.3.0 (now 6.0.0-preview.2), TailwindVariants.NET, Blazicons ×4, Markdig, Scrutor, RizzyUI.Tasks (build-time, flows to consumers on purpose for code-behind) | Alpine + plugins, async-alpine, floating-ui, TanStack table, aspnet-client-validation, canvas-confetti; **Tailwind packages as runtime dependencies** (only needed by the CSS build; could be peers/dev), htmx 2 (RZUI-003), docs `file:` link (RZUI-001) |
| Entry points | `lib/net10.0/RizzyUI.dll` + XML docs; static web assets `_content/RizzyUI/{js,css,vendor}` | `main`/`module`/`exports` (RZUI-002) |
| Extra content | repository tooling files (RZUI-021), tests (RZUI-022), 1,279 highlight.js files (RZUI-062) | tests (RZUI-022), raw `lib/` sources (RZUI-056) |
| Source link / determinism | `Deterministic`, embedded PDB, `EmbedUntrackedSources`, `PublishRepositoryUrl`; package validation on | committed `dist/`; the build is deterministic (two consecutive builds were byte-identical) |
| Validation before release | none | none |

## 5. CI/CD comparison with Rizzy

| Practice | Rizzy | RizzyUI baseline |
|---|---|---|
| PR validation | `ci.yml` on every PR | none |
| Publishing | `release.yml`, `v*` tags, `release` environment approval, NuGet + npm trusted publishing (OIDC), provenance, fails on duplicates | every push to `main`, `continue-on-error`, stored keys, archived action, duplicate-skipping |
| Version source | `Directory.Build.props`, `-dev` between releases, CHANGELOG section required | csproj holds the released version; npm version overwritten at publish |
| Generated client bundle | committed + CI drift check | committed, no check |
| Package checks | `check-package-contents.py` + consumer smoke test | none |
| Browser tests | Playwright against the real demo app | Playwright against fixtures |
| API compatibility | `PublicApiBaselineTests` (public API text baselines) | `EnablePackageValidation` with `GenerateCompatibilitySuppressionFile` only, and no baseline version, so validation compares nothing |

### Public API baselines for RizzyUI

Recommended (roadmap RM-2.5). RizzyUI's public surface is mostly component types and their
`[Parameter]` properties, plus `RzTheme`, `RizzyUIConfig`, services and extension methods. A
reflection-based text baseline (one line per public type/member, with `[Parameter]` and
`[CascadingParameter]` marked), checked by a test and regenerated with an environment variable, would
catch accidental parameter renames and removals, which are the breaking changes most likely in a
component library. Setting `PackageValidationBaselineVersion` to the last released version gives a
second, binary-level check.

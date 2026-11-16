# 07 — Implementation and Verification

| Field | Value |
|---|---|
| Audit | RizzyUI initial audit |
| Date | 2026-11-15 |
| Repository | https://github.com/JalexSocial/RizzyUI |
| Branch / commit | Baseline `main` @ `3fda79b20f3584f0f94f11adc64b5c26496eed54`; changes on `chore/rizzy6-preview-migration-audit` (uncommitted at the time of writing) |
| Scope | Changes made during the audit run, how each was verified, and the resolution status of every finding |
| Methodology | Each defect fixed here was first reproduced (browser, test against the original code, or package inspection) where practical; fixes were verified by automated tests that run in CI |
| Limitations | GitHub Actions not executed on GitHub; static docs-site generation not run locally; no assistive-technology testing; see §4 |

Reports 00–06 describe the baseline commit and are not updated to reflect these changes.

## 1. What changed

### Rizzy 6 / htmx 4 migration
| Change | Files |
|---|---|
| `Rizzy` 5.3.0 → **6.0.0-preview.2** | `src/RizzyUI/RizzyUI.csproj`, `src/RizzyUI.Docs/RizzyUI.Docs.csproj` |
| Removed `GenerateStyleNonce` and redundant `AddRazorComponents`/`AddHtmx` | `src/RizzyUI.Docs/Program.cs`, `src/RizzyUI.Tests/Assets/Alba/WebAppFixture.cs` |
| Docs host: `HtmxConfig.Scripts` → local `/vendor/htmx/` with SRI; absolute `ClientScriptUrl` | `src/RizzyUI.Docs/Program.cs` |
| `<RzHeadOutlet />` + `<RzScripts />`; removed vendored/unpkg htmx 2, module-loaded `rizzy.js`, `hx-ext` | `src/RizzyUI.Docs/Components/App.razor`, `Components/Layout/PreviewLayout.razor` |
| `show:window:top` → `show:top showTarget:window` (103×) | `src/RizzyUI.Docs/Components/Layout/MainLayout.razor` |
| htmx: npm optional peer `^4.0.1`; docs pins `htmx.org` 4.0.1 (vendored copy regenerated); removed from the `src/RizzyUI` workspace | `packages/rizzyui/package.json`, `src/RizzyUI.Docs/package.json`, `src/RizzyUI/package.json`, lockfiles, `src/RizzyUI.Docs/wwwroot/vendor/htmx/htmx.min.js` |
| `antiforgerySnippet.js` → deprecated warning shim | `packages/rizzyui/src/js/antiforgerySnippet.js` |
| `window.Rizzy` merged by property descriptors | `packages/rizzyui/src/js/runtime/rizzyGlobal.js` (new), `lib/bootstrap.js` |
| htmx teleport bridge (`htmx.process` for elements added under `<body>`) | `packages/rizzyui/src/js/runtime/htmxTeleportBridge.js` (new), `lib/bootstrap.js` |

### Component defects
| Change | Files |
|---|---|
| Teleport-safe panel lookup (`x-ref` + `$refs`), init lookup deferred | `src/RizzyUI/Components/Internal/RzModalPrimitive.razor`, `Feedback/RzSheet/SheetContent.razor`, `packages/rizzyui/src/js/lib/components/rzModal.js`, `rzSheet.js` |
| Focus return: invoker passed in the event detail; return target inside the closing panel replaced by the trigger; `x-trap.inert.noreturn` | `rzModal.js`, `RzModalPrimitive.razor` |
| CSP-safe triggers: `x-on:click="openFromTrigger"` (still raises the `EventTriggerName` window event) | `Feedback/RzDialog/DialogTrigger.razor.cs`, `Feedback/RzAlertDialog/AlertDialogTrigger.razor.cs`, `rzModal.js` |
| `destroy()` for sheet, dropdown menu and submenu | `rzSheet.js`, `rzDropdownMenu.js` |
| `RzButton`: no default `aria-label`; caller `aria-label` respected | `Form/RzButton/RzButton.razor.cs` |
| Missing English keys; `NeutralResourcesLanguage("en", Satellite)` | `Resources/RizzyLocalization.en.resx`, `RizzyLocalization.cs` |
| Quote escaping in asChild markup merge | `Utility/Parser/HtmlUtils.cs` |
| HTML-encoded code-fence language | `Extensions/MarkdigExtensions.cs` |

### Packaging, build and CI
| Change | Files |
|---|---|
| npm `main`/`module`/`exports` fixed; `./dist/*` exported; `rizzyui.docs` dependency removed; `test` glob includes `tests/` | `packages/rizzyui/package.json`, `package-lock.json` |
| Root cause of the `file:` dependency: `npm ci --prefix` instead of `npm install --prefix` | `src/RizzyUI.Docs/package.json` (`prebuild:css`) |
| Unit tests excluded from `dist/` and `wwwroot/` | `packages/rizzyui/build/utils.mjs` |
| Repository tooling files excluded from the NuGet package | `src/RizzyUI/RizzyUI.csproj` |
| Regenerated client assets (content-hashed chunks; tests removed) | `packages/rizzyui/dist/**`, `src/RizzyUI/wwwroot/{js,css}/**` (generated) |
| Workflows: `ci.yml` (PR + push, never publishes), `release.yml` (tag + approval + trusted publishing), `docs.yml` (Pages); `dotnet.yml` removed | `.github/workflows/` |
| SDK pin | `global.json` |
| Package checker, consumer smoke test, changelog helper | `eng/check-package-contents.py`, `eng/consumer-smoke-test.sh`, `eng/consumer-smoke/app/**`, `eng/changelog-section.sh` |
| Jekyll excludes for internal docs; ignore Playwright output | `docs/_config.yml`, `.gitignore` |
| Regenerated docs Tailwind CSS (build output) | `src/RizzyUI.Docs/wwwroot/css/app.css` |

### Tests added or changed
| Suite | Tests |
|---|---|
| JS unit | `runtime/__tests__/rizzyGlobal.test.mjs` (5), `runtime/__tests__/htmxTeleportBridge.test.mjs` (5), `lib/components/__tests__/rzModal.test.mjs` (6); `tests/rzTooltip.test.mjs` made CRLF-tolerant; `tests/**` now part of `npm test` (+26) |
| bUnit | `RzDialogTests` (+2, 1 updated), `RzAlertDialogTests` (+1), `RzSheetTests` (+1), `RzButtonTests` (+4), `Localization/LocalizationKeyCoverageTests` (+2), `Security/AttributeEncodingTests` (+3) |
| Browser (real app) | `src/RizzyUI.Docs/tests/integration/rizzy6-htmx4.spec.ts` (5) + `playwright.integration.config.ts` |
| Packaged consumer | `src/RizzyUI.Docs/tests/consumer-smoke/consumer-smoke.spec.ts` (1) + `playwright.consumer-smoke.config.ts`, driven by `eng/consumer-smoke-test.sh` |

### Documentation
`CHANGELOG.md`, `CONTRIBUTING.md`, `README.md` (setup), `docs/migration/rizzy5-to-rizzy6.md`,
`docs/engineering/client-runtime-and-htmx.md`, `docs/contributing/development.md`,
`docs/contributing/releasing.md`, the docs app's Theme page (setup snippet), and this audit.
The `rizzy.docs` repository needed no change: it mentions RizzyUI only generically, and its RizzyUI
release page should be added when a release is cut (RM-5.1).

## 2. Verification

All commands were run on Windows 11 with .NET SDK 10.0.115 (selected by `global.json`), Node.js
26.13.1 and Chrome, from the repository root unless noted.

### Reproductions before fixing

| Finding | Reproduction |
|---|---|
| RZUI-001 | Fresh `npm install @jalexsocial/rizzyui@0.9.2-alpha` → dangling `node_modules/rizzyui.docs` link; removing the entry and running the docs CSS build re-added it |
| RZUI-002, RZUI-022 | `python eng/check-package-contents.py artifacts/nupkgs jalexsocial-rizzyui-0.9.2-alpha.tgz` (published tarball) → 8 failures (tests shipped, `file:` dep, htmx dependency, 4 missing export targets, `module`) |
| RZUI-004 | `dotnet build` after the package bump → CS1061 ×2 |
| RZUI-006 | Official `upgrade-check` → 103 `[swap-syntax]` issues |
| RZUI-009 | Docs app: *Submit & Close* inside a dialog → full-page native navigation |
| RZUI-010 | Docs app: Escape on an open dialog → dialog stays open; Sheet: Escape → stays open (`$refs` empty, layer not registered) |
| RZUI-011 | Focus logged moving trigger → close button (x-trap) → `<body>` after close |
| RZUI-013 | Accessible name of the htmx dialog trigger = "Action Button" (Playwright role query failed) |
| RZUI-014 | `curl /components/sheet?culture=de` → `aria-label="RzSheet.CloseButtonAriaLabel"`, `aria-label="RzBackToTop.DefaultAriaLabel"` |
| RZUI-015, RZUI-016 | `Security/AttributeEncodingTests` run against the original `HtmlUtils.cs` and `MarkdigExtensions.cs`: 2 of 3 fail (attribute injected) |
| RZUI-020 | 5 builds: the client-asset targets never logged their messages |
| RZUI-021 | `RizzyUI.0.9.2-alpha.nupkg` contains `content/` and `contentFiles/` copies of `package.json` etc. |
| RZUI-024 | `node --test "tests/**/*.test.mjs"` → 22/26 at baseline |

### Final verification matrix

| Verification area | Status | Evidence |
|---|---|---|
| .NET compilation | **PASS** | `dotnet build src/RizzyUI.sln -c Release` → 0 errors; warnings: CS0628 (test fixture) and NU1902 ×2 (AngleSharp, test-only), both pre-existing (RZUI-044) |
| .NET unit tests | **PASS** | `dotnet test src/RizzyUI.sln -c Release --no-build` → 497/497 (baseline 484; +13 new) |
| JavaScript tests | **PASS** | `cd packages/rizzyui && npm test` → 117/117 (baseline 75 run; +16 new, +26 previously orphaned); `cd src/RizzyUI && npm test` → 4/4 |
| Client build determinism | **PASS** | `npm run build` twice → identical SHA-256 over `dist/` and `wwwroot/{js,css}` |
| htmx 4 compatibility | **PASS** (static + runtime) | Official checker: 0 issues in 948 files (`--ext .razor --ext .cs` over library, docs and runtime); integration suite below; htmx 4.0.1 loaded once with SRI |
| Alpine initialization | **PASS** | Integration: swapped-in `rzAlert` gets `_x_dataStack` (3 repeated swaps); all `x-data` roots in boosted `#content` initialized; consumer smoke under CSP build |
| Browser integration | **PASS** | `cd src/RizzyUI.Docs && npm run test:integration` → 5/5 (runtime contract, dialog htmx swap ×3 with Escape and focus return, antiforgery POST from teleported form, boosted navigation + back, sheet Escape in preview iframe) |
| Accessibility tests | **PASS** (fixture scope) | `npm run test:a11y` → 63 passed, 2 skipped (unchanged; fixture-based, RZUI-023). Escape/focus/accessible-name behavior verified on real components by the integration and smoke suites. No assistive-technology testing |
| CSP and antiforgery | **PASS** | Consumer smoke: `script-src 'nonce-…' 'strict-dynamic'`, `rizzyui-csp.js`, 0 `securitypolicyviolation` events, dialog trigger works without inline handlers; htmx `POST` with `RequestVerificationToken` accepted by an antiforgery-validating minimal API (docs integration test checks the header too) |
| Documentation build | **PASS** (partial) | Docs app builds in Debug and Release (Tailwind CSS built); pages served and exercised by the integration suite. Static-site generation (`docs.yml`) **NOT RUN** locally: it writes hundreds of untracked files into `docs/` |
| NuGet package validation | **PASS** | `dotnet pack` → `eng/check-package-contents.py`: 1,436 entries, no `content/`, no tests, depends on Rizzy 6.0.0-preview.2 |
| npm package validation | **PASS** | `npm pack` → checker: no `file:` deps, htmx optional peer `^4.0.1`, every `exports`/`main`/`module` target present; in the smoke test `import.meta.resolve` succeeds for `.`, `./csp`, `./dist/css/rizzyui-plugin.css`, `./package.json`, with no dangling links |
| Consumer smoke test | **PASS** | `bash eng/consumer-smoke-test.sh artifacts/nupkgs 0.0.0-verify.1 artifacts/npm/*.tgz` → isolated NuGet cache restored the local package; `dotnet publish` (Production) serves `_content/RizzyUI`; Playwright 1/1 |
| CI configuration | **NOT RUN** on GitHub | Workflows parse (YAML lint); every step was run locally in equivalent form; trusted publishing and the `release` environment need owner setup (RM-0.2) |

## 3. Finding resolution status

| Finding | Severity | Status after this run |
|---|---|---|
| RZUI-001 | P1 | **Resolved** (manifest + root cause; checker guards it) |
| RZUI-002 | P1 | **Resolved** (checker guards it; `"type": "module"` not added, see RM-3.6) |
| RZUI-003 | P1 | **Resolved** (optional peer; ownership documented; D-2 to confirm) |
| RZUI-004, RZUI-005 | P1 | **Resolved** |
| RZUI-006 | P2 | **Resolved** |
| RZUI-007 | P2 | **Resolved** (deprecated; removal scheduled for a later major) |
| RZUI-008 | P2 | **Resolved** |
| RZUI-009 | P1 | **Resolved** |
| RZUI-010, RZUI-011 | P1 | **Resolved** |
| RZUI-012 | P1 | **Resolved** |
| RZUI-013 | P1 | **Resolved** (breaking for icon-only buttons; D-8) |
| RZUI-014 | P1 | **Resolved** (guarded by key-coverage test) |
| RZUI-015 | P1 | **Mitigated** (quotes escaped; full encoding of caller values remains a follow-up) |
| RZUI-016 | P1 | **Resolved** |
| RZUI-017 | P1 | Open (owner decision D-4) |
| RZUI-018 | P1 | Open (RM-0.4) |
| RZUI-019 | P1 | **Resolved in the repository**; registry/environment setup pending (RM-0.2) |
| RZUI-020 | P2 | **Mitigated** (CI drift check); dead targets remain (D-6) |
| RZUI-021, RZUI-022 | P2/P3 | **Resolved** |
| RZUI-023 | P1 | **Partially resolved** (integration + smoke suites; fixture suite unchanged) |
| RZUI-024 | P2 | **Resolved** |
| RZUI-028 | P2 | **Resolved** |
| RZUI-041 | P3 | **Partially resolved** (Jekyll excludes; static nonce unchanged) |
| RZUI-045 | P3 | **Partially resolved** (output ignored; pretest still rewrites vendor files) |
| All other findings | — | Open; see the roadmap |

## 4. Limitations of this verification

- GitHub Actions workflows were not run on GitHub. Linux-specific differences (case-sensitive paths,
  `--with-deps` browser install, `cygpath` absence) are handled in the scripts but unexercised.
- Static documentation generation and the Jekyll build were not run (see the matrix).
- No screen-reader or other assistive-technology testing; accessibility verification is automated
  (Playwright, axe on fixtures) plus code review.
- The Linux CI npm version (bundled with Node 22) differs from the local npm 9.7.1; lockfiles were
  produced with npm 9.7.1 (lockfile v3, compatible).
- `RZUI-030`, `RZUI-050`, `RZUI-054`, `RZUI-059` and `RZUI-060` remain "Needs investigation".
- The consumer smoke test was not run against the baseline packages (they target Rizzy 5); the
  defects it guards against were reproduced individually (§2).

## 5. Post-audit implementation of owner decisions

Added 2026-11-15, after [DECISIONS.md](DECISIONS.md). Sections 1–4 above are the baseline and were
not changed. Four decisions were implemented on `chore/rizzy6-preview-migration-audit`, one commit
each (nothing pushed, tagged or published):

| Decision | Roadmap | Commit | What changed |
|---|---|---|---|
| D-6 | RM-2.1 | `build: remove dead client-asset targets` | Deleted `InstallClientPackages`/`BuildClientAssets` and their properties from `src/RizzyUI/RizzyUI.csproj`. Committed bundles and the CI drift check are unchanged. |
| D-3 | RM-0.1 | `chore: set version 1.0.0-preview.1-dev` | `<Version>` and the npm manifest (and lockfile) are `1.0.0-preview.1-dev`; migration guide compatibility row is `1.0.0-preview.1`; version scheme stated in the CHANGELOG intro. No release cut. |
| D-4 | RM-0.3 | `feat(markdown)!: safe-by-default RzMarkdown with AllowUnsafeHtml` | Default pipeline: advanced extensions without `GenericAttributesExtension`, plus `DisableHtml()`. New `AllowUnsafeHtml` (default `false`) restores the previous pipeline; a caller `Pipeline` is used as-is. Both default pipelines are `static readonly`. 7 new tests; docs page (security section, parameters), CHANGELOG "Breaking", migration guide row. |
| D-5 | RM-2.6 | `ci: release RizzyUI.Tasks with RizzyUI` | `RizzyUITasksVersion` in `src/Directory.Build.props` is the single Tasks version. `eng/pack-tasks.sh` packs Tasks; release/CI/docs workflows pack it first and restore with `-p:RestoreAdditionalProjectSources`. `release.yml` pushes Tasks before RizzyUI only when nuget.org lacks that version (flat-container check with retries). Package checker verifies the Tasks package and the RizzyUI → Tasks version; smoke test may restore Tasks locally. `releasing.md`/`development.md` updated. |

### Findings during implementation

- **`RizzyUI.Tasks` packed empty from a clean checkout.** `<None Include="$(OutputPath)\*">` was
  evaluated before the build, so `dotnet pack` on a fresh clone produced a package with no
  `tasks/` folder (reproduced: 0 task files; after the fix: 21). Fixed in the D-5 commit with a
  `TargetsForTfmSpecificContentInPackage` target.
- **Source/package drift for `RizzyUI.Tasks` 1.3.5.** The published 1.3.5 ships
  `tasks/netstandard2.0`; the source targets `net10.0` and its `.targets` probes `tasks/net10.0`.
  The release workflow correctly skips 1.3.5 (already published), but the next Tasks bump would
  publish a `net10.0`-only task, which .NET Framework MSBuild (Visual Studio) may not load.
  **Owner decision: `RizzyUI.Tasks` must target `netstandard2.0`.** Retargeted (project and
  `.targets` probe path); the package checker requires `tasks/netstandard2.0/RizzyUI.Tasks.dll` and
  rejects packed MSBuild assemblies. Verified with an unpublished `1.3.6-local.2`: RizzyUI's build
  and the consumer smoke test loaded the task from `tasks/netstandard2.0` and passed.
- **`dotnet restore <sln> --source <dir> --source <url>`** resolved the nuget.org URL as a local
  folder (`src\https:\api.nuget.org\...`, NU1301) in both Git Bash and PowerShell. The workflows use
  `-p:RestoreAdditionalProjectSources=<absolute dir>` instead, which keeps the configured sources.
- **`RzMarkdown` safe mode did not filter URLs.** `[x](javascript:alert(1))` still rendered a
  `javascript:` link. **Owner follow-up: strip them.** Links, images and autolinks with a
  `javascript:`, `vbscript:` or (non-raster-image) `data:` URL are now reduced to their text in every
  mode, ignoring case, whitespace and control characters; entity-encoded and reference-style
  variants are covered by tests. URLs inside raw HTML (`AllowUnsafeHtml`) are not filtered.
- **Docs pages and `AllowUnsafeHtml`.** All 32 pages using `<RzMarkdown>` were rendered before and
  after the change and the Markdown output compared. Only `/themes` differed: `L<number>` had been
  swallowed as an unknown HTML tag and now renders as text. No page needs the opt-in.

### Verification

Run locally on Windows (Git Bash), .NET 10 SDK, Node 22.

| Check | Command | Result |
|---|---|---|
| JS tests, build, drift | `cd packages/rizzyui && npm ci && npm test && npm run build`, then `git status -- packages/rizzyui/dist src/RizzyUI/wwwroot` | 117 passed; no drift |
| .NET build and tests | `dotnet build src/RizzyUI.sln -c Release && dotnet test src/RizzyUI.sln -c Release --no-build` | 0 errors; 497 → 504 passed (7 new `RzMarkdown` tests) |
| Accessibility inventory | `cd src/RizzyUI && npm test && npm run check-accessibility-inventory` | 4 passed; exit 0 |
| Browser suites | `dotnet build src/RizzyUI.Docs -c Debug && cd src/RizzyUI.Docs && npm run test:a11y && npm run test:integration` | 63 passed / 2 skipped; 5 passed |
| Markdown pages | before/after snapshot of the `data-slot="markdown"` output of all 32 pages, plus manual check in a browser (`/themes`, `/markdown-demo`, `/components/markdown`, `/components/chart-bar`) | only the `/themes` fix above; no console errors |
| Packages (CI version) | `bash eng/pack-tasks.sh ./artifacts/nupkgs`; restore with `-p:RestoreAdditionalProjectSources`; `dotnet pack … -p:Version=1.0.0-preview.1-dev-ci.12.1`; `npm pack`; `python eng/check-package-contents.py …` | passed; RizzyUI depends on Rizzy 6.0.0-preview.2 and RizzyUI.Tasks 1.3.5 |
| Consumer smoke test | `bash eng/consumer-smoke-test.sh ./artifacts/nupkgs 1.0.0-preview.1-dev-ci.12.1 ./artifacts/npm/*.tgz` | passed |
| Release dry run, bumped Tasks | the steps of `release.yml` without changelog check, push, publish and GitHub release, with `RizzyUITasksVersion` temporarily `1.3.6-local.1` and an isolated `NUGET_PACKAGES` | Tasks `publish=true`; restore used the local Tasks; 504 passed; checker and smoke test passed |
| Release dry run, unchanged Tasks | the same with 1.3.5 | Tasks found on nuget.org (`publish=false`) |
| Checker mismatch | RizzyUI depending on Tasks 1.3.5 next to only a Tasks 1.3.6-local.1 package | checker fails as intended |
| SemVer of CI versions | `1.0.0-preview.1-dev-ci.12.1` against the `release.yml` regex, and as a NuGet/npm version | valid |

Not verified: the workflows on GitHub (still RM-0.6), the real `dotnet nuget push` / trusted
publishing path (D-7, owner-only), the Release docs generation (`docs.yml`), and `jq` in the
Tasks check (not installed locally; an equivalent Python check was used in the dry run).

### Finding status changes

| Finding | Before | Now |
|---|---|---|
| RZUI-017 | Open (D-4) | **Resolved** (safe default; unsafe Markdown link URLs stripped) |
| RZUI-020 | Mitigated | **Resolved** (dead targets removed) |
| RZUI-042 | Open | **Resolved in the repository** (version scheme set; Tasks released with RizzyUI); the `[1.0.0-preview.1]` CHANGELOG section is added at release |

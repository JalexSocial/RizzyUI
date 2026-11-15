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

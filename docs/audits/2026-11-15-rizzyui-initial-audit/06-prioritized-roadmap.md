# 06 — Prioritized Roadmap

| Field | Value |
|---|---|
| Audit | RizzyUI initial audit |
| Date | 2026-11-15 |
| Repository | https://github.com/JalexSocial/RizzyUI |
| Branch / commit | `main` @ `3fda79b20f3584f0f94f11adc64b5c26496eed54` |
| Scope | Ordered work plan for the findings in reports 02–05 |
| Methodology | Tasks derived from findings; effort assumes one developer familiar with the codebase. S ≈ ≤ 4 h, M ≈ 1–2 days, L ≈ 3–5 days. |
| Limitations | Estimates exclude review time and owner decisions. |

Task IDs are `RM-<phase>.<n>`. Section A lists work already **implemented and verified during this
audit run** (details in [07](07-implementation-and-verification.md)). Section B is the remaining work.

## A. Implemented during this run

| Task | Findings | Description |
|---|---|---|
| RM-A.1 | RZUI-004, RZUI-005, RZUI-006 | Rizzy 6.0.0-preview.2; docs/test hosts on Rizzy 6 APIs; `<RzHeadOutlet />` + `<RzScripts />`; htmx 4.0.1 served locally with SRI; htmx 4 swap syntax |
| RM-A.2 | RZUI-003, RZUI-007 | htmx ownership model (optional peer); antiforgery snippet deprecated |
| RM-A.3 | RZUI-008, RZUI-009 | Shared `window.Rizzy`; htmx teleport bridge |
| RM-A.4 | RZUI-010, RZUI-011, RZUI-012, RZUI-028 | Dialog/AlertDialog/Sheet Escape, focus scope and focus return; CSP-safe triggers; `destroy()` for sheet and dropdown menus |
| RM-A.5 | RZUI-013, RZUI-014 | `RzButton` accessible name; missing resource keys and English fallback |
| RM-A.6 | RZUI-015, RZUI-016 | Attribute injection fixes (asChild markup, code fence) |
| RM-A.7 | RZUI-001, RZUI-002, RZUI-021, RZUI-022 | npm manifest/exports, no `file:` dependency, no tests or tooling files in packages |
| RM-A.8 | RZUI-019, RZUI-020 (partial), RZUI-024, RZUI-045 (partial) | `ci.yml` / `release.yml` / `docs.yml`, drift check, JS tests in CI, `global.json`, CHANGELOG, contributing docs |
| RM-A.9 | RZUI-023 (partial) | Integration suite against the real docs app; packaged-consumer smoke test under strict CSP; package-content checker |
| RM-A.10 | RZUI-041 (partial) | Jekyll excludes internal docs folders |

## B. Remaining work

### Phase 0 — Release blockers (before the first Rizzy 6-based release)

| Task | Findings | Description | Sev. | Depends on | Effort | Acceptance criteria |
|---|---|---|---|---|---|---|
| RM-0.1 | RZUI-042 | Decide the version scheme (D-3); set `<Version>` to the next version with `-dev` between releases; add a `## [X.Y.Z]` CHANGELOG section at release | P1 | D-3 | S | CI packs a version never published; release workflow verifies tag = csproj |
| RM-0.2 | RZUI-019 | Configure the `release` environment and NuGet/npm trusted publishing; delete `NUGET_API_KEY`/`NPM_TOKEN` (owner-only) | P1 | D-7 | S | A dry-run tag on a fork (or a pre-release) publishes through OIDC; no publish secrets remain |
| RM-0.3 | RZUI-017 | Decide and implement the `RzMarkdown` default (D-4) | P1 | D-4 | S–M | Raw HTML and generic attributes are disabled by default (or the risk is documented on the component page and in XML docs); tests for both modes |
| RM-0.4 | RZUI-018 | Pin exact versions for all default CDN assets; add optional `integrity` to `AssetUrls` and `rizzyRequire` | P1 | — | M | No unversioned or `@latest` URL; SRI hashes for defaults; consumer smoke test still passes under CSP |
| RM-0.5 | RZUI-025 | Fix `rzDateEdit` options binding and add `destroy()` | P1 | — | S | Unit test proves options reach flatpickr and `destroy()` is called; integration test swaps a date field 3× without leftover calendars |
| RM-0.6 | — | Run CI on GitHub once (first PR) and fix environment differences (Linux paths, Playwright deps) | P1 | — | S | All three `ci.yml` jobs green on a PR |

### Phase 1 — Compatibility stabilization

| Task | Findings | Description | Sev. | Depends on | Effort | Acceptance criteria |
|---|---|---|---|---|---|---|
| RM-1.1 | RZUI-027 | Toast provider re-resolution after swaps | P2 | — | S | Integration test swaps the provider and shows a server toast |
| RM-1.2 | RZUI-030 | Remove the `SliderScript` default asset | P2 | — | S | Slider page loads no extra `rizzyui.js`; no console errors |
| RM-1.3 | RZUI-031 | Evict failed bundle loads; log component/bundle names | P2 | — | S | Unit test: a rejected loader is retried on the next use |
| RM-1.4 | RZUI-032 | CSP-safe `RzInputColor` binding | P2 | — | S | No console errors in CSP mode (integration test with `rizzyui-csp.js`) |
| RM-1.5 | RZUI-026 | Remove the `crypto.subtle` dependency in `rizzyRequire` | P2 | — | S | Unit test runs without `crypto.subtle`; components load on plain HTTP |
| RM-1.6 | RZUI-023 | Extend the integration suite: popover/dropdown with htmx content, out-of-band swap, validation error (422) swap, repeated insert/remove with listener counts | P2 | — | M | New scenarios pass in CI; each fails against a deliberately broken build |
| RM-1.7 | RZUI-038 | `PathBase`-aware asset/module URLs | P2 | — | S | Consumer smoke test variant under a path base passes |

### Phase 2 — Engineering reliability

| Task | Findings | Description | Sev. | Depends on | Effort | Acceptance criteria |
|---|---|---|---|---|---|---|
| RM-2.1 | RZUI-020 | Remove (or fix) the dead client-asset MSBuild targets per D-6 | P2 | D-6 | S | `dotnet build` behavior matches the docs; no dead targets |
| RM-2.2 | RZUI-046, RZUI-045 | Docs project: `npm ci` only when needed; a11y pretest must not touch tracked files | P3 | — | S | Building and testing leave `git status` clean |
| RM-2.3 | RZUI-043 | Inventory checker: fix the Windows guard; require tagged a11y tests; extend the contract list | P2 | — | M | Checker fails locally on a missing test; list covers all interactive roots |
| RM-2.4 | RZUI-044 | Test host: remove hard-coded path, per-test `HttpContext`, resolve CS0628, update bUnit/AngleSharp | P3 | — | S | Build has 0 warnings |
| RM-2.5 | — | Public API baseline test for components (`[Parameter]`s) and services; `PackageValidationBaselineVersion` | P2 | RM-0.1 | M | Removing or renaming a parameter fails a test until the baseline is regenerated |
| RM-2.6 | RZUI-042 | Decide `RizzyUI.Tasks` versioning/packaging (D-5) | P3 | D-5 | S | Documented and automated in the release workflow if kept |

### Phase 3 — Architecture and code quality

| Task | Findings | Description | Sev. | Depends on | Effort | Acceptance criteria |
|---|---|---|---|---|---|---|
| RM-3.1 | RZUI-036, RZUI-037 | Idempotent, order-independent `AddRizzyUI`; cached Vercel theme | P2 | — | S | Tests: double registration; `AddLocalization` after `AddRizzyUI` uses app overrides |
| RM-3.2 | RZUI-039 | asChild element path: remap without `Add`, consistent TwMerge | P2 | — | S | Tests for `Id`/`Href` and class conflicts on both paths |
| RM-3.3 | RZUI-053 | Shared helpers (default element, attribute merge, asset resolver); restore `AdditionalAttributes` in dialog roots; missing `data-slot`s | P2 | — | M–L | No behavior change in existing tests; conformance scan clean |
| RM-3.4 | RZUI-033, RZUI-034 | Combobox/DataTable serialization projections; default JSON encoder for Carousel | P2 | — | M | Page source contains only rendered fields; `</script>` in options is escaped |
| RM-3.5 | RZUI-040 | Apply the documented corrections to `docs/agents/*` and AGENTS.md | P3 | owner review | S | No contradictory instructions remain |
| RM-3.6 | RZUI-050, RZUI-054, RZUI-055, RZUI-051, RZUI-052, RZUI-061 | Smaller correctness items | P3 | — | M | Each has a regression test |
| RM-3.7 | RZUI-029 | `destroy()` for NumberTicker, Progress, EmbeddedPreview | P3 | — | S | Unit tests |

### Phase 4 — Accessibility and performance

| Task | Findings | Description | Sev. | Depends on | Effort | Acceptance criteria |
|---|---|---|---|---|---|---|
| RM-4.1 | RZUI-023 | Port each fixture spec to the real component in the docs app; real CSP for CSP variants | P1 | RM-1.6 | L | Every interactive root in the inventory has a real-component Playwright spec |
| RM-4.2 | RZUI-047, RZUI-048, RZUI-049 | Spinner status, conditional ARIA relationships, tabs SSR state and ID escaping | P2 | — | M | axe clean on real pages; tests |
| RM-4.3 | RZUI-059, RZUI-060 | Navigation-menu activation semantics; persistent toast live regions; manual AT pass (NVDA, VoiceOver) | P2 | — | M | Documented AT results in `docs/accessibility/manual-testing.md` |
| RM-4.4 | RZUI-035, RZUI-056, RZUI-062 | Benchmark render cost (theme allocation, serializers); trim eager bundle; recommend minified bundles; trim highlight.js payload | P3 | — | M | BenchmarkDotNet baseline committed; eager JS reduced with measurements |

### Phase 5 — Product readiness

| Task | Findings | Description | Sev. | Depends on | Effort | Acceptance criteria |
|---|---|---|---|---|---|---|
| RM-5.1 | — | Publish the migration guide on the docs site and add a RizzyUI release page in `rizzy.docs` when the release is cut | P2 | RM-0.1 | S | Links from README and release notes |
| RM-5.2 | RZUI-058 | Document "RizzyUI owns Alpine" in installation docs; warn on a pre-existing `window.Alpine` | P3 | — | S | Docs + console warning |
| RM-5.3 | — | Stable-release criteria: zero open P0/P1, real-component a11y coverage, API baseline, two previews without breaking changes | — | Phases 0–4 | — | Checklist in `docs/contributing/releasing.md` |
| RM-5.4 | — | Decide .NET 11 multi-targeting (Rizzy 6 ships `net11.0`) | P3 | — | S | Decision recorded |

## C. Current status (reconciled 2026-11-17)

Sections A and B are the audit's original plan and stay as written. This section records where each
task stands on `main` after 1.0.0-preview.1. Evidence for work done after this reconciliation is in
[08-roadmap-execution.md](08-roadmap-execution.md); that file and this table are updated together.

Status values: **Complete** (implemented and its acceptance criteria verified), **Partial**,
**Outstanding**, **Blocked** (needs an owner or external action), **Deferred** (after 1.0, with a
reason in the [deferral list](08-roadmap-execution.md#deferred-after-10)).

Rizzy: RizzyUI depends on `Rizzy` 6.0.0-preview.3, the newest published Rizzy (checked on nuget.org
2026-11-17). No Rizzy defect blocks this roadmap.

| Task | Status | Evidence / what is left |
|---|---|---|
| RM-0.1 | Complete | Version scheme in place (#73); `release.yml` refuses a tag that differs from `<Version>`; 1.0.0-preview.1 released (#76); `main` at `1.0.0-preview.2-dev` (#78) |
| RM-0.2 | Partial | NuGet and npm published 1.0.0-preview.1 through OIDC (release runs 44169982160, 44185955659); no publish secrets remain. **Owner:** the `release` environment has no required reviewers, so a tag publishes without approval |
| RM-0.3 | Complete | Safe-by-default `RzMarkdown` with `AllowUnsafeHtml` (#73), tests for both modes |
| RM-0.4 | Complete | Pinned CDN assets with SRI (#73); consumer smoke test under CSP passes in CI |
| RM-0.5 | Complete | `rzDateEdit` options and `destroy()` (#73); integration test swaps the field 3× |
| RM-0.6 | Complete | All `ci.yml` jobs green on PRs #73–#80 |
| RM-1.1 | Complete | Provider re-resolved when detached (`14d66fa6`); unit tests; integration: server toast after the provider is swapped (harness) |
| RM-1.2 | Complete | No default slider asset; `SliderScript` key removed (`c1b7a747`); test against the real registration |
| RM-1.3 | Complete | Failed bundle imports and `rizzyRequire` loads are evicted and retried (`b5b37c66`); unit tests |
| RM-1.4 | Complete | CSP-safe `RzInputColor`/`RzColorSwatch` bindings and style objects (`28968b34`); integration test under `rizzyui-csp.js` with no RizzyUI CSP violations |
| RM-1.5 | Complete | Bundle ids no longer use `crypto.subtle` (`b5b37c66`); unit test runs with `crypto` undefined |
| RM-1.6 | Complete | Integration harness (`3530b145`): popover/dropdown htmx content, OOB swap, 422 swap, 5× replacement with listener and panel counts, server toasts; CSP project (`7e431ce3`). Each defect fixed in this phase has a unit test that fails without the fix; the browser scenarios were not mutation-tested |
| RM-1.7 | Complete | `RequestPathBase` applied to asset and code-behind URLs (`36649cd6`); unit tests plus an in-process host under `UsePathBase("/app")` through `RazorComponentResult` and `IRizzyService` |
| RM-2.1 | Complete | Dead MSBuild targets removed (#73, D-6) |
| RM-2.2 | Complete | `npm ci` only when needed (MSBuild Inputs/Outputs, `ensure-npm-deps.mjs`); generated docs assets `-text`; CI fails when building or testing changes tracked files (`1a238b78`, green in CI) |
| RM-2.3 | Complete | Windows entry guard fixed; matching tests must assert accessibility; contract list extended; integration specs count (`099121fc`). It found five components without accessibility tests; fixed in `eae79a3b` |
| RM-2.4 | Complete | 0 build warnings (#79); per-test `HttpContext` (`555bf0fb`) |
| RM-2.5 | Complete | Package validation against 1.0.0-preview.1 with suppression generation off; `PublicContractTests` baseline of parameters, enums, config and services; both shown to fail on a rename / removed `[Parameter]` (`4937adb3`) |
| RM-2.6 | Complete | `RizzyUI.Tasks` released from the same tag when its version is new (#73, D-5) |
| RM-3.1 | Complete | Idempotent registration, Vercel listed once and parsed once, localization decided at resolve time with an English fallback (`15434ec2`) |
| RM-3.2 | Complete | Element path remap fixed; TwMerge with child precedence on both paths (`be994ef1`) |
| RM-3.3 | Complete | Caller attributes on dialog roots (`7ad6d30b`). Done before 1.0 at the owner's request (2026-11-18): `DefaultElement` instead of assigning `Element` (`71aa7c42`), `CopyAdditionalAttributes` (`75e189f7`), `SerializeAssetUrls` and read-only localized defaults (`9dc51b36`), one attribute-precedence rule and `data-slot` on every root (`59d7cfcf`) |
| RM-3.4 | Complete | Combobox `{ value, text }` default + `ItemDataSelector` (breaking, D-9); DataTable DTO guidance; carousel default encoder (`e0f800a7`) |
| RM-3.5 | Complete | Agent guidance aligned with the code (`041eeaa2`, `837b49ed`) |
| RM-3.6 | Complete | RZUI-050, 051, 052, 055 (`f2c37935`), RZUI-054 (`36649cd6`); RZUI-061: `RzIdScope` and ids derived from the component id (`d2fa123c`, D-21) |
| RM-3.7 | Complete | `destroy()` for NumberTicker, Progress, EmbeddedPreview; stacking intervals fixed (`f88294f5`) |
| RM-4.1 | Complete | Real-component specs under the standard and CSP runtimes for 29 families: dialog, alert dialog, sheet, popover, dropdown menu, tabs, tooltip, accordion, navigation menu, menubar, command, collapsible, slider, radio group, carousel, calendar, date edit, color input, combobox, data table, toast, file input, input OTP, switch, checkbox group, native select, alert, back-to-top, sidebar (`acc0a943`, `7c0686ee`, `925b7625`, `8d666eba`, `0884441c`, `0006b251`); 72 integration tests. Data table is standard-runtime only: its templates are inline Alpine expressions, which the CSP build does not run (documented) |
| RM-4.2 | Complete | RZUI-047 (`eae79a3b`), RZUI-048 and RZUI-049 (`925b7625`), plus defects found by the new specs: tooltip naming, trigger references, dropdown keyboard focus, destructive contrast (`ceb3de38`); switch and OTP labels, combobox and OTP not labelled by `FieldLabel`, the combobox's duplicate unnamed `<select>`, subtle toast contrast (`8d666eba`, `0884441c`) |
| RM-4.3 | Partial | RZUI-059 fixed (`07f4878b`). RZUI-060 (toast announcements) and the manual NVDA/VoiceOver pass need assistive-technology testing that this environment cannot perform: release gate in `docs/accessibility/manual-testing.md` |
| RM-4.4 | Complete | RZUI-035: theme resolved lazily (`33390ec7`; the allocation was removed, so no benchmark, D-17). RZUI-056: toast runtime on demand, `lib/` trimmed to loaded files, minified bundles recommended, confetti CDN key removed (`530cefb5`): eager JS 33.0 / 36.7 KB gz (was 37.0 / 40.6). RZUI-062: highlight.js common build (`63850d75`): nupkg 2.9 MB / 246 files (was 6.1 MB / 1,444) |
| RM-5.1 | Partial (rest at the next release) | Migration guide covers changes after 1.0.0-preview.1 (`24a6f3ad`) and is linked from the README; RizzyUI release page in `rizzy.docs` (rizzy.docs#6). Left: link the guide and the new preview from `rizzy.docs` when the preview is published |
| RM-5.2 | Complete | README "RizzyUI owns Alpine" and a console warning for a second Alpine instance (`d6cb5a99`); Getting Started troubleshooting (`0ad698c8`) |
| RM-5.3 | Complete | Stable-release criteria in `docs/contributing/releasing.md` (`0ad698c8`); assessed in [08](08-roadmap-execution.md#release-readiness-assessment-2026-11-18) |
| RM-5.4 | Complete (decision) | D-14: RizzyUI targets `net10.0` only; `net11.0` apps are verified by the template test in CI and release |

Work done since the audit that is not a roadmap task: the `dotnet new rizzyui` template (#75), inputs
rendering the `For` value (#75), `FieldLabel` registration (#74), npm audit and warning cleanup (#79),
GitHub Actions on Node 24 (#80).

## Recommended execution order

RM-0.6 → RM-0.1 → RM-0.2 → RM-0.5 → RM-0.4 → RM-0.3 (after D-4) → first preview release →
RM-1.6 → RM-1.1 to RM-1.5 → RM-4.1 (incrementally, highest-traffic components first) → Phase 2 →
Phase 3 → RM-4.2 to RM-4.4 → Phase 5.

**Next development slice (recommended):** RM-0.6 + RM-0.5 + RM-0.4. Get CI green on GitHub, fix the
remaining P1 runtime defect (`rzDateEdit`) and pin the CDN assets. Together with the owner-only
release setup (RM-0.1/0.2), that is everything between this branch and a first Rizzy 6 preview.

*(Superseded 2026-11-18: that slice and Phases 1–5 are done on `roadmap/1.0-readiness`. What is
left before 1.0 is in [08, Release readiness assessment](08-roadmap-execution.md#release-readiness-assessment-2026-11-18).)*

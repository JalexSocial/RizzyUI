# 08 — Roadmap Execution Toward 1.0

| Field | Value |
|---|---|
| Audit | RizzyUI initial audit |
| Started | 2026-11-17 |
| Branch | `roadmap/1.0-readiness` (from `main` @ `7fdf7a3f`) |
| Scope | Phases 1–5 of [06-prioritized-roadmap.md](06-prioritized-roadmap.md), continuing after 1.0.0-preview.1 |
| Relationship | Continues [07](07-implementation-and-verification.md), which stays as the record of the audit run. Task status lives in [06, section C](06-prioritized-roadmap.md#c-current-status-reconciled-2026-11-17); this file holds the evidence and decisions behind it. |

## Reconciliation summary (2026-11-17)

1. **Confirmed complete:** RM-0.1, RM-0.3, RM-0.4, RM-0.5, RM-0.6, RM-2.1, RM-2.6.
2. **Outstanding:** RM-1.1 to RM-1.5, RM-1.7, RM-2.2, RM-2.3, RM-2.5, all of Phase 3, RM-4.2 to RM-4.4,
   RM-5.2 to RM-5.4.
3. **Partial:** RM-0.2 (required reviewers on the `release` environment), RM-1.6 (integration
   scenarios), RM-2.4 (shared `HttpContext` in the test host), RM-4.1 (only dialog, sheet and
   date edit run against real components), RM-5.1 (migration guide not on the docs site).
4. **Critical dependencies:** RM-4.1 builds on the RM-1.6 integration harness. RM-2.5 needs a
   released baseline (1.0.0-preview.1 exists). The "two previews without breaking changes" gate
   needs at least two more preview releases, which only the owner can publish.
5. **Owner decisions:** none block implementation. The owner delegated decisions for this run
   (2026-11-17); decisions taken under that delegation are recorded in [DECISIONS.md](DECISIONS.md).
   Owner-only actions are collected in [Owner actions](#owner-actions).
6. **Eligible for deferral:** see [Deferred after 1.0](#deferred-after-10).
7. **Sequence:** Phase 1 runtime fixes (RM-1.1 → 1.5, 1.7) with unit tests → RM-1.6 integration
   scenarios → Phase 2 (RM-2.5 API baseline, RM-2.2/2.3/2.4) → Phase 3 required items → Phase 4
   (RM-4.1 real-component specs, RM-4.2/4.3 fixes, RM-4.4 measurements) → Phase 5.

## Phase 3 classification

A task blocks 1.0 only when leaving it presents a material risk to functionality, security,
accessibility, compatibility, packaging or the public API.

| Task | Findings | Class | Rationale |
|---|---|---|---|
| RM-3.1 | RZUI-036, RZUI-037 | **A: before 1.0** | Double registration duplicates the Vercel theme; `AddLocalization()` after `AddRizzyUI()` silently ignores app resources. Consumer-visible misbehavior. |
| RM-3.2 | RZUI-039 | **A: before 1.0** | The asChild element path throws for `Id`/`Href` and merges classes differently from the markup path. |
| RM-3.3 | RZUI-053 | **Split.** Restoring `AdditionalAttributes` on `RzDialog`, `RzAlertDialog` and `RzCommandDialog` roots is **A** (caller attributes are dropped). Shared helpers, `data-slot` coverage and the other convention clean-up are **B**. | Helpers are internal refactoring with no consumer-facing defect; `data-slot` additions are additive. |
| RM-3.4 | RZUI-033, RZUI-034 | **A: before 1.0** | Full `TItem` graphs in page source are a data-exposure risk, and changing what is serialized after 1.0 would be breaking. `</script>` in carousel options breaks out of the JSON island. |
| RM-3.5 | RZUI-040 | **A (small)** | Contradictory contributor instructions; documentation only. |
| RM-3.6 | RZUI-050, RZUI-051, RZUI-052, RZUI-054, RZUI-055 | **A** | Each is a small correctness fix (dropped dynamic content, thread-unsafe `Random`, silent toast drops, Windows-built paths on Linux, mutated caller state). |
| RM-3.6 | RZUI-061 | **B** | Deterministic IDs are an architectural change with no current defect; IDs are unique per process. |
| RM-3.7 | RZUI-029 | **A (small)** | Leaked observers and intervals after htmx swaps; same class of defect as RZUI-028. |

## Deferred after 1.0

| Task / finding | Risk if deferred | Target |
|---|---|---|
| RM-3.3 / RZUI-053 helpers, `data-slot` coverage, attribute-precedence unification | Maintenance cost only; no behavior change intended. The consumer-facing part (dialog roots dropping attributes) is fixed. `data-slot` additions are additive, so they can ship in any minor release | 1.1 |
| RM-3.6 / RZUI-061 deterministic IDs | Snapshot tests and future morph swaps; no current defect | 1.x |
| RM-4.4 / RZUI-035 theme allocation per component | Unmeasured CPU cost; no reported problem | 1.1 (benchmark first) |
| RM-4.4 / RZUI-056 eager payload (toast system, focus plugin, unused intersect plugin) and minified bundle recommendation | ~37 KB gz eager today; optimization, not a defect | 1.1 |
| RM-4.4 / RZUI-062 highlight.js share of the NuGet package (6.1 MB) | Package size and restore time only | 1.1 |
| RZUI-015 follow-up: fully encode caller attribute values on the `AsChild` markup path | None for security: both quote characters are escaped and values are left unquoted only when safe, so a value cannot leave its attribute. A caller value that contains an entity (`&amp;`) is decoded by the browser, a fidelity issue only | 1.x |

Not deferrable: the manual screen-reader pass and RZUI-060 (toast announcements) are 1.0 gates
(see [Release readiness](#release-readiness-assessment-2026-11-18)).

## Owner actions

Only the owner can do these; nothing in the repository can substitute for them.

| # | Action | Why | Blocks |
|---|---|---|---|
| 1 | Review and merge PR #81 (`roadmap/1.0-readiness`), or ask for changes to any delegated decision (D-9 to D-16) | Everything below builds on it | All |
| 2 | Add a required reviewer to the `release` GitHub environment (Settings → Environments → release) | A pushed tag publishes to NuGet and npm without approval today (RM-0.2, RZUI-019) | 1.0 |
| 3 | Publish 1.0.0-preview.2 from `main` (`docs/contributing/releasing.md`); then link it and the migration guide from `rizzy.docs` | preview.2 contains breaking changes (D-9, D-15, D-11), so the two-preview clock starts after it | 1.0 |
| 4 | Run the manual NVDA + Chrome and VoiceOver + Safari pass, including the 1.0 focus scenarios and RZUI-060, and record it in `docs/accessibility/manual-testing.md` | Screen-reader behavior cannot be automated here | 1.0 |
| 5 | Publish two more previews (or release candidates) with no "Breaking" changelog entries, no new `CompatibilitySuppressions.xml` entries and no removed `public-contract.txt` lines | Stable-release criterion 4 | 1.0 |
| 6 | Tag 1.0.0 when the checklist in `releasing.md` → "Stable release (1.0.0) criteria" holds; update README and `rizzy.docs` to drop `--prerelease` / `@next` | | 1.0 |

## Evidence log

Each slice records the problem, change, tests and result.

### Phase 1 — Compatibility stabilization (2026-11-17)

| Task | Finding | Reproduced before the fix | Change | Verification |
|---|---|---|---|---|
| RM-1.1 | RZUI-027 | New unit tests failed: after the provider was removed, `show()` used the detached provider | `ensureProvider()` drops a disconnected provider and its stacks, then resolves again | 21/21 toast unit tests; harness: server toast before and after the provider is swapped |
| RM-1.2 | RZUI-030 | Test against the real `AddRizzyUI` registration failed (`SliderScript` → `js/rizzyui.js`) | Default `ComponentAssetKeys = []`; key removed | Slider tests 4/4 |
| RM-1.3 | RZUI-031 | Static: rejected promise cached in `loadedBundles`; loadjs keeps a failed bundle id | `createComponentFactoryLoader` evicts failed imports and logs bundle + component; `loadjs.forget` after a failed `require` | Registrar tests 4/4; `require` retry test |
| RM-1.4 | RZUI-032 | Integration (CSP mode): "Property assignments are prohibited in the CSP build"; swatch never updated; three `style-src-attr` violations from string style bindings | One-way, CSP-safe bindings (`x-bind:value` + `x-on:input`, swatch `x-effect`); style objects in four components | `components.csp.spec.ts` passes with no RizzyUI CSP violations (DocSearch's `eval` on the docs site is excluded) |
| RM-1.5 | RZUI-026 | All `rizzyRequire` unit tests failed with `crypto` undefined | Bundle id = sorted URL list | 7/7 `rizzyRequire` tests |
| RM-1.6 | RZUI-023 | — | Gated harness `/_tests/harness` (`Docs:EnableTestPages`), CSP Playwright project, shared helpers | 14/14 integration tests (7 existing, 5 harness, 2 CSP) |
| RM-1.7 | RZUI-038, RZUI-054 | Static (no prefix); Windows separator normalization only | `RzComponent.RequestPathBase`; `RizzyUIConfig.ApplyPathBase`; JSON-encoded code-behind registration | `PathBaseTests` (12), `PathBaseHostTests` (2), `RzAlpineComponentTests` (5) |

Totals after Phase 1: 592 .NET tests, 137 JS tests, 14 integration tests passing locally (Windows);
CI green on the pushed commits.

Also found: the docs app's CSP mode was a hard-coded `false`, so no test had exercised
`rizzyui-csp.js` on real components; it is now configuration. RZUI-054 (an RM-3.6 item) was fixed
with RM-1.7 because both change the same lines.

**Phase 1 checkpoint.** Done: RM-1.1 to RM-1.7. Remaining risk: other components may still bind
string styles or use expressions the CSP build rejects; only the color input and the components
found while fixing it were checked under CSP. RM-4.1 extends CSP coverage. Next: Phase 2.

### Phase 2 — Engineering reliability (2026-11-17)

| Task | Finding | Change | Verification |
|---|---|---|---|
| RM-2.5 | — | `PackageValidationBaselineVersion` 1.0.0-preview.1; `GenerateCompatibilitySuppressionFile` removed (it turned every break into a suppression); `ApiBaseline/public-contract.txt` + `PublicContractTests`; `docs/contributing/api-compatibility.md` | Renaming `RzSlider.TabIndex` fails `dotnet pack` with CP0002; removing its `[Parameter]` fails `PublicContractTests`; both reverted |
| RM-2.2 | RZUI-045, RZUI-046 | Conditional `npm ci` in the docs csproj and `prebuild:css`; `-text` for generated docs CSS and vendored Tom Select; regenerated stale `app.css`; CI clean-tree check | Second CSS build leaves no diff; a11y tests leave no diff; CI run on `1a238b78` green including the new check (Linux output equals the committed file) |
| RM-2.3 | RZUI-043 | `pathToFileURL` entry guard; content check for accessibility assertions; 13 more contract directories; integration specs and family docs pages count | 6/6 checker tests (2 new); the checker ran on Windows for the first time and reported 10 gaps, now 0 |
| RM-2.4 | RZUI-044 | Per-test `HttpContext` and accessor | 601/601 .NET tests |
| — | RZUI-047 (RM-4.2) | Found by RM-2.3: spinner status semantics moved to the wrapper; toggle `aria-pressed` server-rendered; new tests for input checkbox and a real-component calendar spec | Tests listed in `eae79a3b` |

Package correctness was already covered by the CI checks from #73/#75: `eng/check-package-contents.py`
(NuGet, Tasks, template, npm), the consumer smoke test of the packed packages under a strict CSP,
and the template test (net10.0 and net11.0, packed packages, published app over HTTP). Known
difference: the published `RizzyUI.Tasks` 1.3.5 contains 7 more DLLs than a local pack of the same
version. CI builds against its own pack, so CI does not exercise the published Tasks package; the
published packages were exercised by the clean-cache template check after the 1.0.0-preview.1
release (app built, ran and passed its page checks). Bump `RizzyUITasksVersion` before changing
`src/RizzyUI.Tasks`, so the published package is replaced rather than diverging further.

**Phase 2 checkpoint.** Done: RM-2.2 to RM-2.5 (RM-2.1, RM-2.6 were already complete). Next: Phase 3.

### Phase 3 — Architecture and code quality (2026-11-17)

| Task | Finding | Change | Verification |
|---|---|---|---|
| RM-3.1 | RZUI-036, RZUI-037 | Registration marker; Vercel guard and `Lazy`; `RizzyLocalizerProvider` at resolve time; Scrutor and the dummy localizer removed | `RegistrationTests` (5): double registration, Vercel once, English without `AddLocalization`, overrides before and after `AddLocalization` |
| RM-3.2 | RZUI-039 | Remove-then-set remap; TwMerge on the element path; child classes win on both paths (D-11) | `AsChildMergeTests` (element and markup child give identical results) |
| RM-3.3 (part) | RZUI-053 | Caller attributes on `RzDialog`, `RzAlertDialog`, `RzCommandDialog` roots, before the component's own | `DialogRootAttributesTests` (3) |
| RM-3.4 | RZUI-033, RZUI-034 | `ItemDataSelector`, `{ value, text }` default (D-9); DataTable DTO note (XML docs + page); carousel default encoder | `RzComboboxItemDataTests` (2), carousel escaping test |
| RM-3.5 | RZUI-040 | `alpine.md` 10.1/10.2/10.4/10.5, `output.md`, `testing.md`, `checklists.md`, `documentation.md`, `repository-structure.md`, AGENTS.md | No remaining reference to `components.js`, `registerComponents`, `Layout/ComponentList.razor` or "keys only" |
| RM-3.6 | RZUI-050, 051, 052, 055 | `RenderFragmentSource.GetSourceText`; `Random.Shared`; Debug log for discarded toasts; `ConfigureClasses` on a copy | `DynamicChildContentTests` (3), `Phase3CorrectnessTests` (2) |
| RM-3.7 | RZUI-029 | `destroy()` in three components; single retry instead of stacking intervals in `rzEmbeddedPreview` | `lifecycleCleanup.test.mjs` (3) |

Found while doing RM-3.1: apps that do not call `AddLocalization()`, including apps made from the
`dotnet new rizzyui` template, rendered resource keys as accessible names. Fixed by the English
fallback in the same change.

The public contract test (RM-2.5) reported the two intentional contract changes in this phase (the
localizer registration and `ItemDataSelector`), and the baseline was regenerated with them.

Totals after Phase 3: 619 .NET tests, 140 JS tests.

**Phase 3 checkpoint.** Required items done; RM-3.3's helper refactoring and RZUI-061 deferred with
reasons (see Deferred after 1.0). Next: Phase 4.

### Phase 4 — Accessibility and performance (2026-11-17)

**Real-component coverage (RM-4.1).** `/_tests/a11y/{family}` renders real components on a bare
layout; `real-components.a11y.ts` runs each family's contract (roles, names, descriptions, states,
keyboard operation, focus trap/return, no dangling ARIA ID references, axe WCAG 2.x A/AA in the
open and closed state) under the standard runtime and the CSP build. 49 integration tests pass.
axe is limited to WCAG tags: the best-practice `region` rule fires for every overlay because
overlays are teleported to `<body>`, outside the page landmarks, by design.

**Defects the new specs found (RM-4.2/4.3), all fixed with tests:**

| Component | Defect | Commit |
|---|---|---|
| `RzTooltip` | Tooltip labelled by its trigger, so the trigger's description repeated its own label | `ceb3de38` |
| `RzPopover`, `RzDropdownMenu` | `aria-labelledby` dangled when the `AsChild` trigger kept its own id | `ceb3de38` |
| `RzDropdownMenu` | Keyboard open left focus on the trigger (race between two `$nextTick`s) | `ceb3de38` |
| Arctic / Vercel themes | Destructive white text 3.76:1 (WCAG AA fail) | `ceb3de38` |
| `RzNavigationMenu` | Opened on focus; announced a menu (RZUI-059) | `07f4878b` |
| `RzMenubar` | Arrow keys did nothing (`$el` vs `$root`); no focus on open; focus lost on Escape/activation | `07f4878b` |
| `RzCommand` | `aria-activedescendant` referenced a hidden source element | `07f4878b` |
| `RzDialog`, `RzSheet` | Dangling title/description references, also while closed (RZUI-048) | `925b7625` |
| `RzTabs` | Values with spaces broke ID references (RZUI-049) | `925b7625` |

**Manual assistive-technology testing (RM-4.3).** Not performed: this environment has no screen
reader. `docs/accessibility/manual-testing.md` now states the release gate, adds Toast, dialogs,
menus and command to its scope (it had called Toast a nonexistent component), and lists 1.0 focus
scenarios, including RZUI-060 (toast announcements), which needs NVDA and VoiceOver results.

**Performance (RM-4.4), measured on this branch** (`packages/rizzyui/dist/js`, gzip level 9):

| Asset | Min | Gzip | Audit gzip |
|---|---|---|---|
| `rizzyui.min.js` | 45.2 KB | 16.3 KB | 16.2 KB |
| `rizzyui-csp.min.js` | 60.1 KB | 19.9 KB | 19.9 KB |
| `chunks/bootstrap` | 62.7 KB | 20.7 KB | 20.5 KB |
| Eager total, standard / CSP | | **37.0 / 40.6 KB** | 36.7 / 40.4 KB |
| `RizzyUI` nupkg | 6.1 MB | | 6.4 MB (0.9.2) |

The +0.3 KB comes from the runtime fixes in this run (toast provider re-resolution, retries). No
optimization was made, so no before/after claim is needed; the deferrals are listed above.

**Phase 4 checkpoint.** Remaining risk: the manual AT pass and RZUI-060 are open gates; nine
interactive components still lack real-component specs (deferred, listed). Next: Phase 5.

### Phase 4 completion (2026-11-18)

**Remaining real-component specs (RM-4.1).** Combobox, data table, toast, file input, input OTP,
switch, checkbox group, native select, alert, back-to-top (`8d666eba`, `0884441c`) and sidebar,
desktop and mobile (`0006b251`). 72 integration tests: 71 pass and 1 is skipped by design (data
table under the CSP build). `npm run check-accessibility-inventory` passes.

**Defects these specs found, all fixed with tests:**

| Component | Defect | Commit |
|---|---|---|
| `RzSwitch`, `RzInputOTP` | A default `aria-label` replaced the name from the field's `<label>` (D-15, breaking) | `8d666eba` |
| `RzCombobox`, `RzInputOTP` | Ids no `<label for>` could target, so `FieldLabel For` did not name them | `8d666eba`, `0884441c` |
| `RzCombobox` | Declared a second `[CascadingParameter] HttpContext`, which Blazor rejects ("more than one parameter matching the name 'httpcontext'"); every combobox render threw. Caught by CI on PR #81 | `0884441c` |
| `RzCombobox` | The hidden native `<select>` showed as a second, unnamed combobox once Tom Select moved its label | `0884441c` |
| Toasts | Subtle status title/text 2.9:1 (D-16) | `0884441c` |
| Docs | `CheckboxInfo` example used `Name=` where `Value=` was meant | `8d666eba` |

`8d666eba` was pushed with failing .NET and browser tests (the HttpContext clash); CI on PR #81
caught it and `0884441c` fixed it. Every commit after it was run against the full .NET, JS and
integration suites before pushing.

### Phase 5 — Product readiness (2026-11-18)

| Task | Result |
|---|---|
| RM-5.1 | Migration guide section for changes after preview.1 (`24a6f3ad`); README links it. Publishing it on `rizzy.docs` waits for the preview it describes (owner action 3) |
| RM-5.2 | README section and console warning for a second Alpine instance (`d6cb5a99`); Getting Started troubleshooting (`0ad698c8`) |
| RM-5.3 | Stable-release criteria in `releasing.md` (`0ad698c8`) |
| RM-5.4 | D-14: `net10.0` only |

**P0/P1 review.** Every P0 and P1 finding in the audit is resolved in the repository: RZUI-017
(RM-0.3), RZUI-018 (RM-0.4), RZUI-023 (RM-1.6, RM-4.1) and RZUI-025 (RM-0.5) since report 07, and
RZUI-015 is reclassified from "mitigated" to resolved for security (the deferral list has the
fidelity follow-up). RZUI-019's remaining part is owner action 2. GitHub has one open issue
(#72, a support question, answered); no open bug is P0/P1.

## Release readiness assessment (2026-11-18)

**Verdict: not ready for 1.0.0. Ready for 1.0.0-preview.2** once PR #81 is merged.

| Stable criterion (`releasing.md`) | Status | Evidence / what is left |
|---|---|---|
| 1. No open P0/P1 defects | **Met in the repository**; one owner step | P0/P1 review above; `release` environment reviewer (owner action 2) |
| 2. Real-component accessibility coverage | **Automated part met; manual part open** | 29 families on real components, both runtimes; inventory check passes. NVDA/VoiceOver pass and RZUI-060 not performed (owner action 4) |
| 3. Public API baseline | **Met** | Package validation against 1.0.0-preview.1 and `PublicContractTests` in CI (RM-2.5) |
| 4. Two previews without breaking changes | **Not met** | preview.2 will contain breaking changes (D-9, D-11, D-15); needs preview.2, then two clean previews (owner actions 3, 5) |

**Verification on the final branch state** (local, Windows, .NET 10, Node 24, Chromium):
`dotnet test` 623 passed; `npm test` (packages/rizzyui) 144 passed; integration suite 71 passed, 1
skipped by design; accessibility inventory passes; client bundles rebuilt and committed. CI on PR
#81 is the authority for Linux, pack, consumer smoke and template tests.

**Risk carried into the previews:** screen-reader behavior is unverified (toast live regions in
particular, RZUI-060); eight delegated decisions (D-9 to D-16) await owner review; the payload and
theme-allocation optimizations are deferred to 1.1.

**Recommended next action:** the owner reviews PR #81 (the delegated decisions first), merges it,
adds the `release` environment reviewer, and publishes 1.0.0-preview.2. Run the manual
screen-reader pass against preview.2 so any fix lands in the first clean preview.

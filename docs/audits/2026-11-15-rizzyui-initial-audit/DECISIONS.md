# Owner decisions: RizzyUI initial audit

| Field | Value |
|---|---|
| Audit | RizzyUI initial audit |
| Decided | 2026-11-15 |
| Branch / commit | `chore/rizzy6-preview-migration-audit` @ `0a3dc506` |
| Scope | Answers to the "Owner Decisions Required" in [00-executive-summary.md](00-executive-summary.md#owner-decisions-required) |

This file records what the owner decided. It does not change the baseline findings. Roadmap task
IDs refer to [06-prioritized-roadmap.md](06-prioritized-roadmap.md).

| ID | Decision | Consequence / follow-up |
|---|---|---|
| D-1 | **Rizzy 6 only, released as a preview.** 0.9.x remains the last Rizzy 5 / htmx 2 line. | No Rizzy 5 maintenance branch. |
| D-2 | **The application provides htmx through Rizzy's `<RzScripts />`.** `htmx.org` stays an **optional** peer (`^4.0.1`) of `@jalexsocial/rizzyui`; RizzyUI never bundles htmx. | Already implemented. Documented in `docs/engineering/client-runtime-and-htmx.md` and the migration guide. Closes RZUI-003. |
| D-3 | **One SemVer for NuGet and npm, independent of Rizzy: next release `1.0.0-preview.1`.** Between releases the project version is `1.0.0-preview.1-dev` (or the next `-dev`). | RM-0.1: set `<Version>` in `src/RizzyUI/RizzyUI.csproj` and the npm manifest; add the `## [1.0.0-preview.1]` CHANGELOG section at release. |
| D-4 | **`RzMarkdown` is safe by default:** raw HTML and generic attributes are disabled, and an explicit `AllowUnsafeHtml` opt-in restores them. Breaking; ships in 1.0.0-preview.1. | RM-0.3: implement with tests for both modes; docs pages that rely on HTML set the opt-in; CHANGELOG "Breaking" + migration guide entry. Resolves RZUI-017 when done. |
| D-5 | **`RizzyUI.Tasks` is released with RizzyUI** from the same tag when its version changes. | RM-2.6: release workflow packs/pushes `RizzyUI.Tasks` (skipped when that version already exists); add it to the nuget.org trusted-publishing policy. |
| D-6 | **Committed client bundles plus the CI drift check;** delete the dead `InstallClientPackages`/`BuildClientAssets` MSBuild targets. | RM-2.1: remove the targets from `src/RizzyUI/RizzyUI.csproj`. Resolves RZUI-020 when done. |
| D-7 | **The owner sets up release infrastructure before the first tag:** `release` environment with reviewers, NuGet and npm trusted publishing for `release.yml`, then delete `NUGET_API_KEY` and `NPM_TOKEN`. | RM-0.2 (owner-only), per `docs/contributing/releasing.md` → One-time setup. |
| D-8 | **All three accessibility-driven breaking changes are accepted:** no default `RzButton` `aria-label`, dialogs close on Escape, and dialog triggers use `x-on:click`. | No action; already in CHANGELOG ("Breaking") and the migration guide. |

## Work these decisions unblock

1. RM-0.1: version `1.0.0-preview.1-dev` (D-3).
2. RM-0.3: safe `RzMarkdown` default with `AllowUnsafeHtml` (D-4).
3. RM-2.1: remove the dead MSBuild targets (D-6).
4. RM-2.6: publish `RizzyUI.Tasks` from `release.yml` (D-5).
5. RM-0.2: owner-only registry and environment setup (D-7).

## Decisions taken under delegation (2026-11-17)

The owner delegated decisions for the Phase 1–5 run ("you have control to make decisions on my
behalf that are in the best interest and spirit of the project"). These are recorded here so they
can be reviewed and reversed before 1.0.

| ID | Decision | Reason / consequence |
|---|---|---|
| D-9 | **`RzCombobox` is safe by default:** `data-item` carries `{ value, text }` unless `ItemDataSelector` chooses fields. Breaking for templates that read other fields. | Same reasoning as D-4 (`RzMarkdown`): full entity graphs in page source are a data-exposure risk, and changing the default after 1.0 would be breaking. `RzDataTable` keeps sending its rows (cell templates need them) and documents DTOs instead. |
| D-10 | **Phase 3 classification** in [08](08-roadmap-execution.md#phase-3-classification): RM-3.3's shared helpers and RZUI-061 (deterministic IDs) are deferred to after 1.0. | Internal refactoring with no consumer-facing defect. |
| D-11 | **`AsChild` class precedence: the child's own classes win** Tailwind conflicts on both the element and markup paths. | The element path documented this; the markup path did the opposite. It matches Radix's `asChild`. Recorded in CHANGELOG. |
| D-12 | **No `AddLocalization()` means RizzyUI's English resources, not resource keys**, and RizzyUI no longer decorates the application's `IStringLocalizerFactory`. | The template and consumer apps rendered keys as accessible names. Removes the Scrutor dependency. |
| D-13 | **The docs app hosts the integration harness** at `/_tests/harness`, mapped only with `Docs:EnableTestPages=true`, outside `Components/Pages` so the static site never contains it; CSP mode is configuration (`Docs:UseContentSecurityPolicy`). | Real-component scenarios (swaps, OOB, 422, toasts, CSP build) without a second test application. |

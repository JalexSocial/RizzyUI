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
| D-14 | **RizzyUI targets `net10.0` only for 1.0** (RM-5.4). | A `net10.0` library runs in `net11.0` apps; the template test builds and runs a `net11.0` app against the packed library in CI and in `release.yml`. A second target doubles build and test time and adds nothing until RizzyUI needs a .NET 11-only API. Revisit when Rizzy or RizzyUI needs one. |
| D-15 | **`RzSwitch` and `RzInputOTP` no longer render a default `aria-label`.** Breaking. | Same reasoning as D-8 (`RzButton`): an `aria-label` overrides the `<label>`, so every labelled switch and OTP was announced as "Toggle" / "One-time password". `FieldLabel For` now reaches both controls. In CHANGELOG ("Breaking") and the migration guide. |
| D-16 | **Subtle status toasts use the foreground color for title and text**; the status color stays on the icon. | The status-colored text was 2.9:1 on the tinted background (WCAG AA needs 4.5:1). Darkening each theme's status colors would change every theme; the foreground color passes in all of them. |
| D-17 | **RZUI-035: remove the per-component theme allocation instead of benchmarking it.** | The audit's acceptance criterion was a BenchmarkDotNet baseline. The cost came from a field initializer whose value was always replaced, so it was removed outright (`Theme` resolves once, lazily); a benchmark would only have measured code that no longer exists. |
| D-18 | **RZUI-056: load the toast runtime on demand behind a synchronous facade; keep `@alpinejs/focus` and `@alpinejs/intersect` eager.** | Toasts are the largest optional piece (6.3 KB gz) and their API could stay the same: queued calls return handles with the final id; `Rizzy.toast.ready()` gives the manager. `x-trap`/`$focus` and `x-intersect` are documented directives used in application markup, and a directive must be registered before Alpine initializes an element that uses it; lazy registration would need DOM scanning on every swap, for 5.3 KB (focus) and 0.5 KB (intersect). |
| D-19 | **RZUI-062: ship highlight.js common languages plus PowerShell, Dockerfile, F#, HTTP, nginx and properties; every other language as a local per-language file.** | Covers the languages .NET and web documentation uses; the rest stay available without a CDN (works under CSP and offline) by adding an asset key. The ESM build, unminified files and 500 themes were unused (RizzyUI has its own highlight theme). |
| D-20 | **RZUI-053 attribute precedence: `role`, `data-slot` and `type` are caller-overridable; everything else a component computes wins over attributes.** (Amended for Alpine directives by D-24 and D-25, and for `id` by D-26.) | Matches what about 230 of 263 roots already did and fixes the rest. `role` stays overridable for decorative use (`RzSpinner` inside a button), `data-slot` for composition (a wrapper naming the component it renders), `type` for submit buttons. Values that must stay consistent with behavior (`class` merging, `x-*`, ARIA state, `aria-label`, configuration `data-*`) change through parameters. Documented in `docs/agents/component-authoring.md`. |
| D-21 | **RZUI-061: deterministic ids are opt-in per `RzIdScope`, not a per-request counter.** | A counter per request would restart in each htmx request, so a fragment would reuse ids already on the page. A scope with a page-unique prefix renders the same ids for the same markup, which is what re-rendered fragments, morph swaps and snapshot tests need; outside a scope ids stay process-unique. Derived ids (titles, legends, sections) follow the component id. |

## Owner decisions (2026-11-18)

Stated by the owner for the RzDataTable work; not delegated decisions.

| ID | Decision | Consequence |
|---|---|---|
| D-22 | **RzDataTable is a headless, composable data-table component.** It manages table state, data operations and reactive behavior (TanStack Table through Alpine) while the developer authors the rendered structure in `ChildContent`; it complements `RzTable` and is not an opinionated data grid or an ARIA grid. | No automatic row/column/cell generation as the rendering model, no replacement component, TanStack stays, native table semantics stay. Recorded in `docs/engineering/rzdatatable-architecture.md` and on the DataTable page. |
| D-23 | **The application owns client data for RzDataTable.** `Items` is serialized for the browser; the developer passes DTOs or projections and filters by authorization first. RizzyUI does not infer sensitive fields, filter by column visibility or require a projection API. | Accepted boundary for RZUI-033 as it applies to RzDataTable (the finding stays in the audit record). `RzCombobox` keeps its safe default (D-9). |

## Owner decisions (2026-11-21)

Stated by the owner as decision R-1 of the Summit remediation plan
(`docs/engineering/summit-decisions.md`); not delegated decisions.

| ID | Decision | Consequence |
|---|---|---|
| D-24 | **RizzyUI reserves `x-data` on every public component.** Supplying `x-data` through unmatched attributes is an invalid configuration and throws a descriptive exception; application state belongs on an ancestor element. **Internal event handlers are attached programmatically wherever practical**, so consumers can use `x-on:*` without collisions. Components expose **documented semantic events** for meaningful state changes, and the other protected directives have clear, enforced rules. To sync a component's internal state to a parent `x-data`, developers use RizzyUI's `x-syncprop` directive; the docs get a page on parent property synchronization inside a RizzyUI component. | Amends D-20 for Alpine directives: `x-data` is reserved and enforced (it was silently overridden); `x-on:*` from callers now runs alongside the component's handlers instead of being dropped (SF-030, SF-069). Each component documents its events and protected directives. `x-syncprop` must reach the element that carries the component's `x-data`. Implemented in workstream W5 of `docs/engineering/summit-remediation-plan.md`. |
| D-25 | **`AsChild` follows D-24.** (1) Attributes that `CloneFragment` forwards from a RizzyUI component carry provenance, so the reserved-`x-data` check never throws on library-owned state (`<RzClipboard AsChild><RzButton>` is valid). (2) `CloneFragment` throws a descriptive exception when the consumer's child (element, component or markup) declares `x-data`: state belongs on an ancestor. (3) Triggers and closers render a marker and the parent component's module attaches their listeners, so a child's own `x-on:*` runs alongside them. (4) For attributes a component computes (`aria-expanded`, `data-state`, `tabindex`, `disabled` and the like), the component's value wins on the child, with a Development warning naming the dropped binding; everything else the child sets still wins. | Fixes the silent failures where an `AsChild` child's attributes replaced the component's behavior. 27 components support `AsChild`; 19 put Alpine directives on the child. Implemented in W5; each rule tested on element, component and markup children. |
| D-26 | **Consumer ids are adopted.** When a consumer supplies an `id`, on a component or on an `AsChild` child, the component uses it as its id and derives every internal reference from it (`aria-labelledby`, `aria-controls`, `{id}-content`, `{id}-input`). | Settles SF-033 and the `AsChild` id case: a hand-written `<label for>` reaches RizzyUI inputs, and a child's id no longer leaves `aria-labelledby="{popover}-trigger"` dangling. Amends D-20 for `id`. Components resolve their id before rendering references; the docs scan guards dangling references. Implemented in W4 (inputs) and W5 (`AsChild`). |

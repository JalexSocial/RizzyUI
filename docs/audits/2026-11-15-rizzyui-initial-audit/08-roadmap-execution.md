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
| RM-3.3 / RZUI-053 helpers, `data-slot` coverage, attribute-precedence unification | Maintenance cost only; no behavior change intended | 1.1 |
| RM-3.6 / RZUI-061 deterministic IDs | Snapshot tests and future morph swaps; no current defect | 1.x |

(Updated as work proceeds.)

## Owner actions

(Collected as work proceeds; see the final assessment.)

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

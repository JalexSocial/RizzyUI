# 00 — Executive Summary

| Field | Value |
|---|---|
| Audit | RizzyUI initial audit |
| Date | 2026-11-15 |
| Repository | https://github.com/JalexSocial/RizzyUI (reviewed from the `tanczosm/RizzyUI` fork checkout) |
| Branch / commit | `main` @ `3fda79b20f3584f0f94f11adc64b5c26496eed54` (JalexSocial `main` `24ae52d0` plus `e0e727bb` "fix: resolve security issues", lockfile updates only, and a merge commit) |
| Scope | Whole repository: library, client package, docs app, tests, tools, workflows, packaging; migration to Rizzy 6.0.0-preview.2 / htmx 4.0.1 |
| Methodology | See [Methodology](#methodology) |
| Limitations | See [Limitations](#limitations) |

## Overall health

RizzyUI has a **solid component foundation and a fragile delivery path**.

- **Strengths:** a consistent component model (`RzComponent<TSlots>`, TailwindVariants descriptors,
  slot classes), SSR-only discipline, CSP-aware Alpine usage (`x-load`, CSP build, nonces), a
  well-factored accessibility runtime (focus scope, dismissable layer, roving focus), lazy-loaded
  component bundles with no duplicated dependencies, and a large bUnit suite (484 passing tests at
  baseline). The library compiled against Rizzy 6 **without a single code change**.
- **Weaknesses:** what reaches users was not verified at any point.
  - The published npm package has a broken dependency and entry points (RZUI-001, RZUI-002).
  - Both packages ship tests or repository files (RZUI-021, RZUI-022).
  - CI publishes on every push to `main` and ignores publish failures (RZUI-019).
  - The browser tests exercise hand-written copies of components rather than the components
    (RZUI-023). Several real defects passed every suite as a result: dialogs ignore Escape and lose
    focus (RZUI-010, RZUI-011), dialog triggers break under a nonce CSP (RZUI-012), every button is
    announced as "Action Button" (RZUI-013), resource keys are read aloud (RZUI-014), and `hx-*`
    inside dialogs is dead (RZUI-009).

The project is **not production-ready**; it is a credible preview once the Phase 0 items in the
roadmap are done.

## Rizzy 6 migration status: **complete for the preview, verified**

- RizzyUI builds against the published `Rizzy`/`Rizzy.Htmx` **6.0.0-preview.2**.
- The docs app runs htmx **4.0.1** loaded once through `<RzScripts />` (local copy, SRI, nonce).
- No removed Rizzy API is used, and the official htmx checker reports 0 issues.
- Behavior was verified in a real browser on the real components: initial load, repeated htmx
  swaps, boosted navigation, history restore, antiforgery and Escape/focus.
- A packaged consumer app was verified under a strict nonce CSP.
- Remaining before a release: owner decisions (below), registry setup for the new release workflow,
  a first CI run on GitHub, and the Phase 0 items in [06](06-prioritized-roadmap.md).

## Highest-priority risks (open)

| ID | Sev. | Risk |
|---|---|---|
| RZUI-017 | P1 | `RzMarkdown` renders raw HTML and generic attributes: stored XSS when apps pass user content (owner decision D-4) |
| RZUI-018 | P1 | Third-party scripts loaded from CDNs unpinned (`@latest`) and without SRI, with the page nonce |
| RZUI-025 | P1 | `rzDateEdit` drops its server options and leaks a flatpickr instance per htmx swap |
| RZUI-023 | P1 | Accessibility contracts still mostly verified on fixtures, not components (partially addressed) |
| RZUI-019 | P1 | The new release workflow is inert until the `release` environment and trusted publishing are configured; old secrets still exist |
| RZUI-015 | P1 | asChild attribute injection mitigated (quotes escaped), not fully encoded |

No P0 issue was found. The injection findings require untrusted data in specific parameters, and
the packaging defects degrade installs rather than prevent them.

## Owner decisions required

> Decided on 2026-11-15. All eight follow the recommendations below; see [DECISIONS.md](DECISIONS.md).

**D-1 — Does the next RizzyUI release support Rizzy 6 only?**
- **Context:** Rizzy 6 requires htmx 4, and Rizzy 5.4.0 is broken upstream (RIZZY-001). The
  migration branch drops Rizzy 5 support.
- **Options:**
  - (a) Rizzy 6 only, released as a preview.
  - (b) Maintain a Rizzy 5 branch in parallel.
- **Trade-offs:** (a) means one code path, and Rizzy 6 is itself still in preview. (b) doubles test
  and release work for an htmx 2 line that upstream has left.
- **Recommendation:** (a), as a pre-release, with 0.9.x as the last Rizzy 5 line.
- **If deferred:** the branch cannot be released without implicitly deciding this.

**D-2 — Who provides htmx?**
- **Context:** htmx was an unused npm dependency, and the docs loaded htmx 2 by hand (RZUI-003).
- **Options:**
  - (a) RizzyUI bundles htmx.
  - (b) A hard npm dependency.
  - (c) The application provides htmx through Rizzy's `<RzScripts />`, with `htmx.org` as an
    optional peer of the npm package (implemented).
- **Trade-offs:** (a) and (b) risk loading htmx twice and duplicate Rizzy's version pinning. (c)
  matches Rizzy, but bundler users install htmx themselves.
- **Recommendation:** (c); confirm.
- **If deferred:** the implemented model stands, undocumented as policy.

**D-3 — Versioning scheme and the next version number.**
- **Context:** NuGet `0.9.2-alpha` and npm `0.9.2` disagree; the csproj holds a published version;
  RizzyUI and Rizzy are separate products (RZUI-042).
- **Options:**
  - (a) One SemVer for both packages, independent of Rizzy, e.g. `0.10.0-preview.1` or
    `1.0.0-preview.1`, with `-dev` between releases.
  - (b) Mirror Rizzy's major version (`6.0.0-preview.N`).
- **Trade-offs:** (a) is honest about RizzyUI's maturity and decouples the release cadence. (b)
  signals compatibility but implies a maturity and API stability that do not exist yet.
- **Recommendation:** (a) with `1.0.0-preview.1`. The Rizzy 6 move is breaking (RZUI-013, the
  htmx requirement), so it deserves a new major.
- **If deferred:** the release workflow cannot run (it requires the tag to equal the csproj version),
  and CI packages carry an already-published version number.

**D-4 — `RzMarkdown` raw HTML default (RZUI-017).**
- **Options:**
  - (a) Safe by default: disable HTML and generic attributes, with an `AllowUnsafeHtml` opt-in.
    This is a breaking change.
  - (b) Keep the behavior and document it.
- **Trade-offs:** (a) protects apps that render user content but changes docs-site content that uses
  HTML. (b) keeps the current behavior and leaves the risk with consumers.
- **Recommendation:** (a), in the same breaking release as D-3.
- **If deferred:** the XSS risk ships with the preview.

**D-5 — `RizzyUI.Tasks` packaging.**
- **Context:** it is built in the solution but consumed as the published 1.3.5 package.
- **Options:**
  - (a) Keep it a separately versioned package with its own release steps.
  - (b) Reference the project and publish both from `release.yml`.
- **Recommendation:** (b) if the task changes with the library; (a) if it is effectively frozen.
- **If deferred:** changes to the task cannot ship without a manual publish.

**D-6 — Client asset build ownership (RZUI-020).**
- **Options:**
  - (a) Keep committed `dist/`/`wwwroot` plus the CI drift check (implemented), and delete the
    dead MSBuild targets.
  - (b) Make `dotnet build` run the npm build.
- **Trade-offs:** (a) builds fast and needs no Node for .NET-only work. (b) is always fresh, but
  slower, needs network access, and makes the build non-deterministic across machines.
- **Recommendation:** (a).
- **If deferred:** the dead targets keep misleading contributors.

**D-7 — Release infrastructure (owner-only actions).**
- Create the `release` environment with reviewers, add NuGet and npm trusted-publishing policies,
  and delete `NUGET_API_KEY`/`NPM_TOKEN`. See
  [docs/contributing/releasing.md](../../contributing/releasing.md).
- **Recommendation:** do this before tagging.
- **If deferred:** nothing can be published, which is safe but blocks releases.

**D-8 — Accept the accessibility-driven breaking changes.**
- **Context:**
  - `RzButton` no longer emits a default `aria-label` (RZUI-013), so icon-only buttons need
    `AssistiveLabel`.
  - Dialogs now close on Escape (RZUI-010), which was documented but never worked.
  - Dialog triggers render `x-on:click` instead of `onclick` (RZUI-012).
- **Recommendation:** accept; the old behavior was non-compliant. These changes are in the CHANGELOG
  and the migration guide.
- **If deferred:** they ship in the preview anyway unless reverted.

## Methodology

1. **Baseline.**
   - Recorded the branch, SHA and status, and read AGENTS.md and all of `docs/agents/`.
   - Ran every existing build and test suite on the original commit (report 05 §1).
   - Downloaded the published NuGet and npm packages and inspected them.
2. **Upstream.**
   - Read Rizzy's CHANGELOG, migration guide, audit conventions, CONTRIBUTING, releasing guide and
     workflows at tag `v6.0.0-preview.2`.
   - Verified published artifact versions and dependencies on nuget.org and npm.
   - Read htmx 4.0.1's `dist/htmx.js` for the behaviors that matter (trigger header, `process`,
     swap modifiers).
3. **Static review.**
   - Repository-wide reading by the lead auditor, plus three parallel read-only reviews: the C#
     library, the JS runtime, and accessibility/test coverage. Their findings were spot-checked
     against source before inclusion; one claim, the ResX "junk" entries, was rejected.
   - The official htmx `upgrade-check`.
4. **Runtime reproduction.**
   - The docs app was driven in Chromium for every behavioral claim marked "Confirmed (runtime)".
   - Injection findings were reproduced by tests run against the original code.
   - Packaging findings were reproduced by package inspection and installation.
5. **Implementation and verification.** Fixes were tested with unit, bUnit, real-app Playwright and
   packaged-consumer tests (report 07).

## Limitations

- GitHub Actions were not executed on GitHub, and registry configuration cannot be seen from the
  repository.
- No assistive-technology (screen reader) testing; no load or performance timing (sizes only).
- Static docs-site generation and the Jekyll build were not run locally.
- The audit reviewed every project, but not every one of the 266 components line by line. The
  component-level findings come from a systematic sample of more than 15 components across all
  categories plus repository-wide scans.
- Findings marked "Needs investigation" lack runtime evidence.

## Documents

| Report | Content |
|---|---|
| [01-repository-and-architecture.md](01-repository-and-architecture.md) | Inventory, dependency map, architecture, coupling |
| [02-code-quality-and-apis.md](02-code-quality-and-apis.md) | Correctness, lifecycle, DI, API consistency, guidance conflicts |
| [03-rizzy6-htmx4-compatibility.md](03-rizzy6-htmx4-compatibility.md) | Compatibility matrix, script ownership, upstream notes |
| [04-security-accessibility-performance.md](04-security-accessibility-performance.md) | Security, accessibility, bundle sizes |
| [05-testing-packaging-and-release.md](05-testing-packaging-and-release.md) | Baseline, tests, packaging, CI/CD |
| [06-prioritized-roadmap.md](06-prioritized-roadmap.md) | Phased plan |
| [07-implementation-and-verification.md](07-implementation-and-verification.md) | Changes made, verification matrix, finding status |

Related: [migration guide](../../migration/rizzy5-to-rizzy6.md),
[client runtime reference](../../engineering/client-runtime-and-htmx.md),
[CHANGELOG](../../../CHANGELOG.md).

## Finding index

| ID | Sev. | Title | Report |
|---|---|---|---|
| RZUI-001 | P1 | npm package depends on the docs project (`file:`) | 05 |
| RZUI-002 | P1 | npm entry points reference unbuilt files | 05 |
| RZUI-003 | P1 | htmx ownership undefined; unused htmx 2 dependency | 03 |
| RZUI-004 | P1 | Docs/test hosts use APIs removed in Rizzy 6 | 03 |
| RZUI-005 | P1 | Docs layouts use the htmx 2 / Rizzy 5 head setup | 03 |
| RZUI-006 | P2 | `show:window:top` misread by htmx 4 | 03 |
| RZUI-007 | P2 | `antiforgerySnippet.js` only works with htmx 2 | 03 |
| RZUI-008 | P2 | `window.Rizzy` replaced by a copy | 02 |
| RZUI-009 | P1 | htmx never processes teleported overlay content | 03 |
| RZUI-010 | P1 | Dialog/sheet accessibility behavior never activates | 04 |
| RZUI-011 | P1 | Focus not returned to the dialog trigger | 04 |
| RZUI-012 | P1 | Dialog triggers use inline `onclick` (CSP) | 04 |
| RZUI-013 | P1 | `RzButton` announced as "Action Button" | 04 |
| RZUI-014 | P1 | Raw resource keys rendered | 04 |
| RZUI-015 | P1 | asChild markup attribute injection | 04 |
| RZUI-016 | P1 | Code-fence language injection | 04 |
| RZUI-017 | P1 | `RzMarkdown` raw HTML by default | 04 |
| RZUI-018 | P1 | Unpinned CDN scripts without SRI | 04 |
| RZUI-019 | P1 | CI publishes on every push; failures ignored | 05 |
| RZUI-020 | P2 | Client-asset MSBuild targets never run | 05 |
| RZUI-021 | P2 | NuGet adds repository files to consumers | 05 |
| RZUI-022 | P3 | Tests shipped in packages | 05 |
| RZUI-023 | P1 | Browser tests do not test components | 05 |
| RZUI-024 | P2 | JS tests not in CI; orphaned tests | 05 |
| RZUI-025 | P1 | `rzDateEdit` options lost, instances leaked | 02 |
| RZUI-026 | P2 | `rizzyRequire` needs `crypto.subtle` | 02 |
| RZUI-027 | P2 | Toast provider detached after swaps | 02 |
| RZUI-028 | P2 | Sheet/dropdown layers leak on removal | 02 |
| RZUI-029 | P3 | Observers not cleaned up (3 components) | 02 |
| RZUI-030 | P2 | Slider default asset loads the runtime again | 02 |
| RZUI-031 | P2 | Failed bundle loads cached forever | 02 |
| RZUI-032 | P2 | `RzInputColor` `x-model` breaks CSP build | 04 |
| RZUI-033 | P2 | Full item graphs serialized into HTML | 04 |
| RZUI-034 | P3 | Carousel relaxed JSON escaping in `<script>` | 04 |
| RZUI-035 | P2 | Theme allocated per component instance | 02 |
| RZUI-036 | P2 | `AddRizzyUI` not idempotent; Vercel theme | 02 |
| RZUI-037 | P2 | Localization depends on DI order | 02 |
| RZUI-038 | P2 | URLs ignore `PathBase` | 02 |
| RZUI-039 | P2 | asChild element path remap throws; no TwMerge | 02 |
| RZUI-040 | P3 | Agent guidance contradicts code/AGENTS.md | 02 |
| RZUI-041 | P3 | Static docs: fixed nonce; internal docs published | 04 |
| RZUI-042 | P2 | Versions unaligned and uncontrolled | 05 |
| RZUI-043 | P2 | Inventory checker weak; Windows no-op | 05 |
| RZUI-044 | P3 | Test host hygiene; AngleSharp advisory | 05 |
| RZUI-045 | P3 | a11y run modifies tracked files | 05 |
| RZUI-046 | P3 | Docs build runs `npm install` | 05 |
| RZUI-047 | P2 | `RzSpinner` hides its status | 04 |
| RZUI-048 | P2 | Dangling ARIA IDREFs in dialog/sheet | 04 |
| RZUI-049 | P3 | Tabs pre-Alpine state; unescaped IDs | 04 |
| RZUI-050 | P2 | `AsMarkupString` drops dynamic content | 02 |
| RZUI-051 | P3 | Thread-unsafe shared `Random` | 02 |
| RZUI-052 | P3 | Toasts dropped silently | 02 |
| RZUI-053 | P2 | Convention drift and duplication | 02 |
| RZUI-054 | P2 | `RzAlpineComponent` path and script encoding | 02 |
| RZUI-055 | P3 | `ConfigureClasses` mutates caller state | 02 |
| RZUI-056 | P3 | Payload composition; unminified bundle in docs | 04 |
| RZUI-057 | P3 | Unsandboxed preview iframe | 04 |
| RZUI-058 | P3 | RizzyUI takes over `window.Alpine` | 02 |
| RZUI-059 | P2 | Navigation menu opens on focus | 04 |
| RZUI-060 | P2 | Toast announcements may be unreliable | 04 |
| RZUI-061 | P3 | IDs not deterministic | 02 |
| RZUI-062 | P3 | NuGet size dominated by highlight.js | 04 |

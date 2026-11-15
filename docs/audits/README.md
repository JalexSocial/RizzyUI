# RizzyUI Technical Audits

This directory holds dated, point-in-time technical audits of the RizzyUI repository. An audit
records an evidence-based baseline (architecture, code quality, security, accessibility,
performance, compatibility with Rizzy and htmx, testing, packaging and release engineering) and a
prioritized roadmap. The conventions follow the
[Rizzy audit conventions](https://github.com/JalexSocial/Rizzy/tree/main/docs/audits) so the two
projects' audits read the same way.

These documents are for maintainers. `docs/audits/` is excluded from the published documentation
site (`docs/_config.yml`).

## Completed audits

| Date | Audit | Reviewed commit | Summary |
|------|-------|-----------------|---------|
| 2026-11-15 | [RizzyUI initial audit](2026-11-15-rizzyui-initial-audit/00-executive-summary.md) | `3fda79b2` (main) | First comprehensive baseline; Rizzy 6.0.0-preview.2 / htmx 4 migration and its verification |

## Directory and naming conventions

- Each audit lives in its own directory: `docs/audits/YYYY-MM-DD-descriptive-audit-name/`.
  - The date is the day the audit was performed, not the day it was merged.
  - Use lowercase kebab-case for the name, e.g. `2027-03-01-rizzyui-accessibility-audit`.
- A full audit uses these files:

  | File | Purpose |
  |------|---------|
  | `00-executive-summary.md` | Health assessment, top risks, owner decisions, methodology and limitations |
  | `01-repository-and-architecture.md` | Inventory, structure, dependency map, architecture |
  | `02-code-quality-and-apis.md` | Defects, maintainability, public API, component conventions |
  | `03-rizzy6-htmx4-compatibility.md` | Compatibility with the targeted Rizzy and htmx versions (or the relevant upstream topic) |
  | `04-security-accessibility-performance.md` | Security, accessibility and performance findings and evidence |
  | `05-testing-packaging-and-release.md` | Build/test baseline, CI/CD, packaging, dependencies |
  | `06-prioritized-roadmap.md` | Actionable tasks grouped into phases |
  | `07-implementation-and-verification.md` | What was changed during the audit, how it was verified, and which findings it resolved |

  A focused audit may omit reports that don't apply; its executive summary must say which and why.
  `07` exists only when the audit run also implemented changes (as the initial audit did); the
  baseline findings in `00`–`06` describe the reviewed commit, not the repository after the fixes.

## Required report metadata

Every report starts with:

```markdown
| Field | Value |
|---|---|
| Audit | <name> |
| Date | YYYY-MM-DD |
| Repository | <url> |
| Branch / commit | <branch> @ <full SHA> |
| Scope | <what this report covers> |
| Methodology | <how evidence was gathered>, or a cross-reference to the summary |
| Limitations | <what could not be verified> |
```

## Finding IDs

- Each substantive finding gets a unique ID: `RZUI-NNN` (zero-padded, e.g. `RZUI-007`).
- `RIZZY-NNN` IDs belong to the upstream Rizzy framework's audits; never use them for RizzyUI
  findings. Refer to an upstream finding by its `RIZZY-` ID when it matters.
- IDs are **never reused**. A later audit that re-confirms a finding references the original ID,
  e.g. "RZUI-018 (from 2026-11-15) still open". New findings continue from the highest ID used in
  any previous audit or errata file (currently **RZUI-062**).
- Use the same ID everywhere: reports, roadmap tasks, CHANGELOG entries, commits, PRs and issues.
- Roadmap tasks use their own IDs, `RM-<phase>.<n>` (e.g. `RM-1.3`), scoped to the audit that
  created them. Prefix them with the audit date when referenced from elsewhere.

Each finding records: title, category, severity, affected subsystem, evidence (repo-relative path
and line), impact, recommendation, verification status, confidence, and dependencies/blockers.

## Severity definitions

| Severity | Meaning |
|----------|---------|
| **P0 – Critical** | Exploitable vulnerability, data-loss risk, or fundamental failure preventing viable use. |
| **P1 – High** | Significant functional defect, incompatibility, or substantial architectural problem. |
| **P2 – Medium** | Important maintainability, testing, performance, or developer-experience issue. |
| **P3 – Low** | Minor correction, optional cleanup, or documentation improvement. |

## Verification status vocabulary

| Status | Meaning |
|--------|---------|
| **Confirmed (runtime)** | Reproduced by executing code (test, script, browser, or package inspection). |
| **Confirmed (static)** | Proven by reading source or binaries, with a deterministic code path. Not executed end-to-end. |
| **Reproducible incompatibility** | Shown against the official documentation or source of a dependency (Rizzy, htmx). |
| **Architectural concern** | A design issue with credible impact, not a single defect. |
| **Needs investigation** | Plausible risk that needs more evidence before acting. |
| **Optional improvement** | Beneficial but not required. |

Confidence is **High**, **Medium**, or **Low**.

## Preserving historical reports

- Don't edit a completed audit's findings after it is merged. Corrections go in an `ERRATA.md`
  inside that audit's directory, or in the next audit.
- Fixing a finding does not change the baseline reports. Record resolution in the audit's `07`
  report (for changes made during the audit) or in issues/PRs and the next audit's status table.
- Don't delete or move audit directories; links from issues and PRs depend on stable paths.

## Recommended follow-up audits

1. **Release audit** before the first Rizzy 6-based release: verify published packages match the
   repository (RZUI-001, RZUI-002, RZUI-021, RZUI-022) and the release workflow ran as designed.
2. **Accessibility runtime audit**: move the Playwright contracts from fixtures to real components
   (RZUI-023) and re-check RZUI-047 to RZUI-049, RZUI-059 and RZUI-060.
3. **Security review** of content rendering (RZUI-017, RZUI-018, RZUI-033, RZUI-034).
4. **Recurring light audit** per minor release or every 6 months: dependency advisories, docs
   accuracy, bundle size and coverage trends.

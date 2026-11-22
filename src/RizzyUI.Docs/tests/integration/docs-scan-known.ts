// Known defects the docs scan reports as annotations instead of failures. Each entry names its
// finding in docs/engineering/summit-findings.md; library defects are fixed in the workstream named
// there (docs/engineering/summit-remediation-plan.md), docs-site defects in W11. Remove an entry in
// the pull request that fixes its finding: the scan then fails if the defect comes back. Never add
// an entry without a finding, and keep `pages` as narrow as the defect.

export type KnownDefect = {
  finding: string;
  kind: 'error' | 'axe' | 'duplicate-id' | 'dangling-aria';
  rule: string;
  /** Matched against the problem's target (selector and HTML excerpt, or the error text). */
  target?: RegExp;
  /** Limit to these routes. Omit only for defects in the docs layout, which is on every page. */
  pages?: string[];
};


export const knownDefects: KnownDefect[] = [
  // Library defects (RizzyUI).
  { finding: 'SF-047', kind: 'duplicate-id', rule: 'empty-id', pages: ['/'] },

  // Docs-site defects (styling and example content), fixed in W11.
  // The docs site's own pages and examples still use Material Design icons, whose fixed ids repeat
  // (the library's built-in icons no longer do: SF-023).
  { finding: 'SF-023', kind: 'duplicate-id', rule: 'mdi-icon-id' },
  { finding: 'SF-023', kind: 'duplicate-id', rule: 'template-id', target: /^svg#mdi-/ },

];

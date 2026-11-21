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

const calendarPages = ['/components/calendar', '/components/calendar-more', '/components/calendar-provider'];

export const knownDefects: KnownDefect[] = [
  // Library defects (RizzyUI).
  { finding: 'SF-075', kind: 'dangling-aria', rule: 'aria-labelledby', target: /data-slot=sidebar-group/ },
  { finding: 'SF-023', kind: 'duplicate-id', rule: 'mdi-icon-id' },
  { finding: 'SF-023', kind: 'duplicate-id', rule: 'template-id', target: /^svg#mdi-/ },
  {
    finding: 'SF-054', kind: 'duplicate-id', rule: 'template-id',
    target: /\[(table-head|table-row|table-cell|pagination-item|pagination-link|data-table-sort-toggle|data-table-sort-icon|data-table-row-select-checkbox|data-table-selection-cell|command-shortcut)\]$/,
    pages: ['/components/datatable', '/components/command', '/command-demo'],
  },
  { finding: 'SF-047', kind: 'duplicate-id', rule: 'empty-id', pages: ['/'] },
  { finding: 'SF-066', kind: 'axe', rule: 'aria-prohibited-attr', target: /data-slot="indicator"/, pages: ['/components/avatar'] },
  {
    finding: 'SF-076', kind: 'axe', rule: 'aria-prohibited-attr', target: /data-slot="popover"/,
    pages: ['/', '/components/button-group', '/components/sidebar', '/components/calendar-more', '/components/calendar-provider'],
  },
  { finding: 'SF-063', kind: 'axe', rule: 'scrollable-region-focusable', target: /data-slot="table-container"/, pages: ['/components/table'] },
  { finding: 'SF-013', kind: 'error', rule: 'csp', target: /^style-src-attr inline at \/components\/input-otp:/, pages: ['/components/input-otp'] },
  { finding: 'SF-035', kind: 'error', rule: 'csp', target: /^style-src-attr inline at \/:/, pages: ['/'] },
  {
    finding: 'SF-036', kind: 'axe', rule: 'color-contrast', target: /data-slot="(alert-title|badge-inner-span)"|text-(success|warning|info)|data-rz-toast-demo/,
  },
  { finding: 'SF-077', kind: 'axe', rule: 'color-contrast', target: /vc-week__day|data-vc-date-btn/, pages: calendarPages },
  {
    finding: 'SF-078', kind: 'axe', rule: 'color-contrast',
    target: /data-slot="(link|breadcrumb-link|command-shortcut|entry|field-label|dialog-trigger|sheet-trigger|popover-trigger|button|input-group-button)"|text-primary|text-muted-foreground|-trigger <button x-ref="trigger"/,
  },
  { finding: 'SF-079', kind: 'axe', rule: 'aria-required-children', target: /data-slot="command-list"/, pages: ['/components/command'] },
  { finding: 'SF-080', kind: 'axe', rule: 'aria-required-children', target: /data-slot="sidebar-menu"/, pages: ['/components/sidebar'] },
  { finding: 'SF-080', kind: 'axe', rule: 'listitem', target: /data-slot="sidebar-menu-item"/, pages: ['/components/sidebar'] },
  { finding: 'SF-080', kind: 'axe', rule: 'target-size', target: /text-sidebar-foreground|text-sidebar-foregro/, pages: ['/components/sidebar'] },

  // Docs-site defects (styling and example content), fixed in W11.
  { finding: 'SF-081', kind: 'axe', rule: 'color-contrast', target: /text-sky-600|<a href="|<code>|<span x-show=|<span class="inline-flex w-28/ },
  { finding: 'SF-082', kind: 'axe', rule: 'button-name' },
  { finding: 'SF-082', kind: 'axe', rule: 'label', pages: ['/components/input-otp', '/docs/interactivity/state-reactivity'] },
  { finding: 'SF-082', kind: 'axe', rule: 'select-name', pages: ['/components/button-group', '/components/native-select'] },
  { finding: 'SF-082', kind: 'axe', rule: 'listitem', target: /data-slot="breadcrumb-item"/, pages: ['/command-demo'] },
  { finding: 'SF-082', kind: 'axe', rule: 'scrollable-region-focusable', target: /<pre /, pages: ['/components/chart-line'] },
  { finding: 'SF-082', kind: 'axe', rule: 'target-size', pages: ['/'] },
  {
    finding: 'SF-083', kind: 'error', rule: 'console.error', target: /violates the following Content Security Policy/,
    pages: ['/components/confetti', '/components/sidebar', '/docs/interactivity/lazy-loading', '/components/empty', '/components/item', '/components/marquee', '/components/chart-line'],
  },
  {
    finding: 'SF-083', kind: 'error', rule: 'csp', target: /^(script-src-elem|script-src-attr|worker-src) /,
    pages: ['/components/chart-line', '/components/confetti'],
  },
  { finding: 'SF-083', kind: 'error', rule: 'console.warn', target: /Alpine Expression Error/, pages: ['/docs/interactivity/alpine-fundamentals'] },
  { finding: 'SF-083', kind: 'error', rule: 'pageerror', pages: ['/docs/interactivity/alpine-fundamentals'] },
];

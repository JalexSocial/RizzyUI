import AxeBuilder from '@axe-core/playwright';
import { expect, test as base, type Page, type TestInfo } from '@playwright/test';

// Shared fixtures and checks for every Summit spec.
//
// `summit` (auto) collects problems while a test runs and fails the test at the end if any appeared:
// page errors, console errors, Alpine expression errors, unexpected HTTP errors, enforced CSP
// violations, and requests to any host other than the app (the suite must not depend on a CDN).
// Report-only CSP violations (Summit reports style-src without enforcing it) are attached to the
// test as annotations instead.

export type SummitHelpers = {
  /** Responses with these statuses (for example 422 in a validation test) are expected. */
  allowStatus(...statuses: number[]): void;
  /** Ignore console errors matching this pattern (with a reason in the test). */
  allowConsole(pattern: RegExp): void;
  /** True for the CSP projects. */
  csp: boolean;
};

type Fixtures = { summit: SummitHelpers; organizerPage: Page };

export const test = base.extend<Fixtures>({
  summit: [async ({ page, baseURL }, use, testInfo) => {
    const problems: string[] = [];
    const allowedStatuses = new Set<number>();
    const allowedConsole: RegExp[] = [];
    const origin = new URL(baseURL!).origin;

    await page.addInitScript(() => {
      (window as any).__csp = [];
      document.addEventListener('securitypolicyviolation', event => {
        (window as any).__csp.push({
          disposition: event.disposition,
          text: `${event.violatedDirective} ${event.blockedURI || ''} ${event.sourceFile ? `at ${event.sourceFile.replace(location.origin, '')}:${event.lineNumber}` : ''} ${event.sample ? `"${event.sample}"` : ''}`.trim(),
        });
      });
    });

    page.on('pageerror', error => problems.push(`pageerror: ${error.message}`));
    page.on('console', message => {
      const text = message.text();
      if (allowedConsole.some(pattern => pattern.test(text))) return;
      if (message.type() === 'error' && !text.startsWith('Failed to load resource')) problems.push(`console.error: ${text}`);
      if (message.type() === 'warning' && text.startsWith('Alpine Expression Error')) problems.push(`console.warn: ${text}`);
    });
    page.on('response', response => {
      const url = new URL(response.url());
      if (url.origin !== origin) return;
      if (response.status() >= 400 && !allowedStatuses.has(response.status())) problems.push(`HTTP ${response.status()}: ${url.pathname}${url.search}`);
    });
    page.on('request', request => {
      const url = new URL(request.url());
      if (!['http:', 'https:'].includes(url.protocol)) return;
      // The nightly CDN run is the one place a CDN is expected (decision D-5).
      if (process.env.SUMMIT_CDN && url.hostname === 'cdn.jsdelivr.net') return;
      if (url.origin !== origin) problems.push(`external request: ${url.href}`);
    });

    await use({
      allowStatus: (...statuses) => statuses.forEach(status => allowedStatuses.add(status)),
      allowConsole: pattern => allowedConsole.push(pattern),
      csp: Boolean(testInfo.project.metadata?.csp),
    });

    const violations: { disposition: string; text: string }[] = page.isClosed()
      ? []
      : await page.evaluate(() => (window as any).__csp ?? []).catch(() => []);
    for (const violation of violations.filter(v => v.disposition === 'report'))
      testInfo.annotations.push({ type: 'csp-report-only', description: violation.text });
    for (const violation of violations.filter(v => v.disposition !== 'report'))
      problems.push(`CSP violation: ${violation.text}`);

    expect(problems, problems.join('\n')).toEqual([]);
  }, { auto: true }],

  // A page signed in as the demo organizer (storage state written by auth.setup.ts).
  organizerPage: async ({ browser }, use, testInfo) => {
    const context = await browser.newContext({ ...testInfo.project.use, storageState: storageFor(testInfo) });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect };

export function storageFor(testInfo: TestInfo): string {
  return testInfo.project.metadata?.storage ?? '.auth/standard.json';
}

/** Restores the seeded database (POST /_test/reset). Call in beforeAll of specs that change data. */
export async function resetDatabase(baseURL: string) {
  const response = await fetch(new URL('/_test/reset', baseURL), { method: 'POST' });
  if (!response.ok) throw new Error(`Database reset failed: HTTP ${response.status}`);
}

/**
 * Waits until RizzyUI's runtime has started (Alpine and the Rizzy client) and every eagerly loaded
 * component on the page has initialized. RizzyUI loads component chunks asynchronously (x-load), so
 * a component's listeners (for example a dialog's open event) exist only after its chunk has loaded.
 */
export async function waitForRuntime(page: Page) {
  // RizzyUI resolves componentsReady() once the page's eager components have started (SF-039).
  await expect.poll(() => page.evaluate(() => typeof (window as any).Rizzy?.componentsReady === 'function'),
    { message: 'RizzyUI runtime loaded' }).toBe(true);
  expect(await page.evaluate(() => (window as any).Rizzy.componentsReady()), 'RizzyUI components initialized').toBe(true);
}

// The release gate is WCAG 2.x A/AA, the tags the RizzyUI docs suite uses. Best-practice rules are
// left out: "region" fires for overlays RizzyUI teleports to <body> by design.
const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

export async function expectNoAxeViolations(page: Page, options: { exclude?: string[] } = {}) {
  let builder = new AxeBuilder({ page }).withTags(wcagTags);
  for (const selector of options.exclude ?? []) builder = builder.exclude(selector);
  const results = await builder.analyze();
  const violations = results.violations.map(v => ({
    id: v.id,
    impact: v.impact,
    nodes: v.nodes.slice(0, 5).map(n => `${n.target.join(' ')}: ${n.failureSummary?.split('\n').slice(1).join(' ').trim()}`),
  }));
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
}

/** Every id an aria-* relationship points at must exist (RZUI-048). */
export async function expectNoDanglingAriaReferences(page: Page) {
  const dangling = await page.evaluate(() => {
    const problems: string[] = [];
    for (const attribute of ['aria-labelledby', 'aria-describedby', 'aria-controls', 'aria-activedescendant', 'aria-owns']) {
      for (const element of document.querySelectorAll(`[${attribute}]`)) {
        for (const id of (element.getAttribute(attribute) ?? '').split(/\s+/).filter(Boolean)) {
          if (!document.getElementById(id)) problems.push(`${element.tagName.toLowerCase()}[${attribute}="${id}"]`);
        }
      }
    }
    return problems;
  });
  expect(dangling).toEqual([]);
}

/** No duplicate or empty ids on the page (invalid HTML, and it breaks aria references and htmx targets). */
export async function expectUniqueIds(page: Page) {
  const problems = await page.evaluate(() => {
    const seen = new Map<string, number>();
    let emptyIds = 0;
    for (const element of document.querySelectorAll('[id]')) {
      if (element.id === '') { emptyIds++; continue; }
      seen.set(element.id, (seen.get(element.id) ?? 0) + 1);
    }
    const duplicates = [...seen].filter(([, count]) => count > 1).map(([id, count]) => `${id} ×${count}`);
    return emptyIds > 0 ? [...duplicates, `${emptyIds} elements with id=""`] : duplicates;
  });
  expect(problems).toEqual([]);
}

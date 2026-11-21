import { appendFileSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { collectCspViolations, collectPageErrors } from './helpers';
import { docsPages } from './docs-pages';
import { knownDefects, type KnownDefect } from './docs-scan-known';

// Scans every docs page (docs-pages.ts) for what a reader would hit: page and console errors,
// Alpine expression errors and failed requests (both builds), CSP violations (CSP build), and WCAG
// 2.2 A/AA violations (axe), duplicate ids and aria-* references to ids that do not exist (standard
// build; the markup is the same on both).
//
// Known library defects are listed in docs-scan-known.ts with their Summit finding id
// (docs/engineering/summit-findings.md). A problem that matches one is reported as an annotation,
// not a failure; anything else fails the page. When a defect is fixed, its entry is removed and the
// scan proves it stays fixed. Set DOCS_SCAN_BASELINE=<file> to write every problem to a JSONL file
// instead of failing (used to build the known-defect list).

const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const baselineFile = process.env.DOCS_SCAN_BASELINE;

type Problem = { kind: 'error' | 'axe' | 'duplicate-id' | 'dangling-aria'; rule: string; target: string };

async function waitForRuntime(page: Page) {
  await expect.poll(() => page.evaluate(() => {
    const w = window as any;
    if (typeof w.Alpine?.version !== 'string' || typeof w.Rizzy?.toast !== 'object') return 'runtime';
    const pending = [...document.querySelectorAll('[x-data]')].filter(el =>
      !el.closest('template') && (el.getAttribute('x-load') ?? 'eager') === 'eager' && !(el as any)._x_dataStack);
    return pending.length === 0 ? 'ready' : `${pending.length} components`;
  }), { message: 'RizzyUI components initialized', timeout: 15_000 }).toBe('ready');
}

async function idProblems(page: Page): Promise<Problem[]> {
  return page.evaluate(() => {
    const problems: { kind: 'duplicate-id' | 'dangling-aria'; rule: string; target: string }[] = [];
    const counts = new Map<string, Element[]>();
    for (const element of document.querySelectorAll('[id]')) {
      if (!counts.has(element.id)) counts.set(element.id, []);
      counts.get(element.id)!.push(element);
    }
    for (const [id, elements] of counts) {
      if (elements.length < 2) continue;
      const first = elements[0];
      const inTemplate = [...document.querySelectorAll('template')].some(t => t.content.querySelector(`[id="${CSS.escape(id)}"]`));
      problems.push({
        kind: 'duplicate-id',
        rule: id === '' ? 'empty-id' : inTemplate ? 'template-id' : id.startsWith('mdi-') ? 'mdi-icon-id' : 'duplicate-id',
        target: `${first.tagName.toLowerCase()}#${id} ×${elements.length} [${first.getAttribute('data-slot') ?? ''}]`,
      });
    }
    for (const attribute of ['aria-labelledby', 'aria-describedby', 'aria-controls', 'aria-activedescendant', 'aria-owns']) {
      for (const element of document.querySelectorAll(`[${attribute}]`)) {
        for (const id of (element.getAttribute(attribute) ?? '').split(/\s+/).filter(Boolean)) {
          if (!document.getElementById(id)) {
            problems.push({ kind: 'dangling-aria', rule: attribute, target: `${element.tagName.toLowerCase()}[data-slot=${element.getAttribute('data-slot') ?? ''}]` });
          }
        }
      }
    }
    return problems;
  });
}

async function axeProblems(page: Page): Promise<Problem[]> {
  const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze();
  return results.violations.flatMap(v => v.nodes.map(n => ({
    kind: 'axe' as const,
    rule: v.id,
    target: `${n.target.join(' ')} ${n.html.slice(0, 160)}`,
  })));
}

function matches(defect: KnownDefect, route: string, problem: Problem): boolean {
  if (defect.kind !== problem.kind || defect.rule !== problem.rule) return false;
  if (defect.pages && !defect.pages.some(p => p === route)) return false;
  return defect.target ? defect.target.test(problem.target) : true;
}

export function defineDocsScan(project: 'standard' | 'csp') {
  for (const route of docsPages) {
    test(`${route} has no errors, axe violations or id problems`, async ({ page }, testInfo) => {
      const errors = collectPageErrors(page);
      const readCsp = project === 'csp' ? await collectCspViolations(page) : null;
      await page.goto(route);
      await waitForRuntime(page);

      const problems: Problem[] = [
        ...errors.map(text => ({ kind: 'error' as const, rule: text.split(':')[0], target: text })),
        ...(readCsp ? (await readCsp()).map(text => ({ kind: 'error' as const, rule: 'csp', target: text })) : []),
        // Markup, and so axe and id results, are the same on both builds: check them once.
        ...(project === 'standard' ? await axeProblems(page) : []),
        ...(project === 'standard' ? await idProblems(page) : []),
      ];

      if (baselineFile) {
        for (const problem of problems) appendFileSync(baselineFile, JSON.stringify({ project, route, ...problem }) + '\n');
        return;
      }

      const unexpected: string[] = [];
      for (const problem of problems) {
        const defect = knownDefects.find(d => matches(d, route, problem));
        if (defect) testInfo.annotations.push({ type: 'known-defect', description: `${defect.finding}: ${problem.rule} ${problem.target}` });
        else unexpected.push(`${problem.kind} ${problem.rule}: ${problem.target}`);
      }
      expect(unexpected, unexpected.join('\n')).toEqual([]);
    });
  }
}

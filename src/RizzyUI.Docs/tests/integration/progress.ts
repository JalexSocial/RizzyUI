import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { collectCspViolations, collectPageErrors } from './helpers';

// RzProgress on a real page (/_tests/progress, Components/IntegrationTests/ProgressHarness.razor),
// under the standard runtime and under rizzyui-csp.js with a Content Security Policy.

const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

/** How much of the track the indicator covers (0–1), from the rendered boxes. */
async function filled(page: Page, id: string): Promise<number> {
  return page.evaluate(trackId => {
    const track = document.getElementById(trackId)!;
    const bar = track.querySelector('[data-slot="progress-indicator"]')!;
    const t = track.getBoundingClientRect();
    const b = bar.getBoundingClientRect();
    return Math.min(Math.max((b.right - t.left) / t.width, 0), 1);
  }, id);
}

async function api(page: Page, id: string, call: string) {
  await page.evaluate(([trackId, code]) => {
    const progress = (window as any).Rizzy.$data(trackId);
    new Function('progress', code)(progress);
  }, [id, call] as const);
}

async function openHarness(page: Page) {
  await page.goto('/_tests/progress');
  await expect.poll(() => page.evaluate(() => Boolean((document.getElementById('p-basic') as any)?._x_dataStack))).toBe(true);
}

export function defineProgressSpecs(runtime: string) {
  test.describe(`RzProgress (${runtime})`, () => {
    test('one named progressbar per bar, with its values, and no axe violations', async ({ page }) => {
      const errors = collectPageErrors(page);
      const violations = await collectCspViolations(page);
      await openHarness(page);

      await expect(page.getByRole('progressbar')).toHaveCount(3);
      const basic = page.getByRole('progressbar', { name: 'Uploading report.pdf' });
      await expect(basic).toHaveAttribute('aria-valuenow', '33');
      await expect(basic).toHaveAttribute('aria-valuemin', '0');
      await expect(basic).toHaveAttribute('aria-valuemax', '100');
      await expect(basic).not.toHaveAttribute('aria-valuetext', /.*/);

      const range = page.getByRole('progressbar', { name: 'Downloading' });
      await expect(range).toHaveAttribute('aria-valuenow', '2.5');
      await expect(range).toHaveAttribute('aria-valuetext', '2.5 of 4 GB');

      const indeterminate = page.getByRole('progressbar', { name: 'Connecting' });
      await expect(indeterminate).not.toHaveAttribute('aria-valuenow', /.*/);
      await expect(indeterminate).toHaveAttribute('data-state', 'indeterminate');

      const results = await new AxeBuilder({ page }).include('main').withTags(wcagTags).analyze();
      expect(results.violations.map(v => `${v.id}: ${v.nodes.map(n => n.target.join(' ')).join(', ')}`)).toEqual([]);
      expect(errors).toEqual([]);
      expect(await violations()).toEqual([]);
    });

    test('the indicator shows the value, without measuring or inline style attributes', async ({ page }) => {
      await openHarness(page);
      await expect.poll(() => filled(page, 'p-basic')).toBeCloseTo(0.33, 1);
      await expect.poll(() => filled(page, 'p-range')).toBeCloseTo(0.5, 1);
      // The server renders no style attribute (a strict CSP would block it); Alpine sets translate.
      const html = await page.evaluate(() => document.getElementById('p-basic')!.outerHTML);
      expect(html).toContain('x-bind:style="indicatorStyle"');
    });

    test('the client API updates the bar, its ARIA values, state and label', async ({ page }) => {
      const errors = collectPageErrors(page);
      await openHarness(page);
      const basic = page.locator('#p-basic');

      await api(page, 'p-basic', "progress.setProgress(80, 'Eighty percent')");
      await expect(basic).toHaveAttribute('aria-valuenow', '80');
      await expect(basic).toHaveAttribute('aria-valuetext', 'Eighty percent');
      await expect.poll(() => filled(page, 'p-basic')).toBeCloseTo(0.8, 1);

      await api(page, 'p-basic', 'progress.increment(50)');
      await expect(basic).toHaveAttribute('aria-valuenow', '100');
      await expect(basic).not.toHaveAttribute('aria-valuetext', /.*/);
      await expect(basic).toHaveAttribute('data-state', 'complete');

      await api(page, 'p-basic', 'progress.setIndeterminate()');
      await expect(basic).not.toHaveAttribute('aria-valuenow', /.*/);
      await expect(basic).toHaveAttribute('data-state', 'indeterminate');
      await expect.poll(() => basic.locator('[data-slot="progress-indicator"]').evaluate(el => getComputedStyle(el).animationName)).toBe('progress-indeterminate');

      await api(page, 'p-basic', 'progress.setProgress(10)');
      await expect(basic).toHaveAttribute('aria-valuenow', '10');
      await expect(basic).toHaveAttribute('data-state', 'loading');
      await expect.poll(() => basic.locator('[data-slot="progress-indicator"]').evaluate(el => getComputedStyle(el).animationName)).toBe('none');

      // The inside label follows the value.
      const label = page.locator('#p-range [data-slot="progress-label"]');
      await expect(label).toHaveText('50%');
      await api(page, 'p-range', 'progress.setProgress(3.25)');
      await expect(label).toHaveText('75%');
      await expect(label).toHaveAttribute('aria-hidden', 'true');
      expect(errors).toEqual([]);
    });

    test('indeterminate bars animate, and stay still with reduced motion', async ({ page }) => {
      await openHarness(page);
      const bar = page.locator('#p-indeterminate [data-slot="progress-indicator"]');
      await expect.poll(() => bar.evaluate(el => getComputedStyle(el).animationName)).toBe('progress-indeterminate');

      await page.emulateMedia({ reducedMotion: 'reduce' });
      await expect.poll(() => bar.evaluate(el => getComputedStyle(el).animationName)).toBe('none');
      await expect.poll(() => filled(page, 'p-indeterminate')).toBeCloseTo(1, 1);
    });
  });
}

import { expect, test, type Page } from '@playwright/test';
import { collectCspViolations, collectPageErrors } from './helpers';

// RzChart on a real page (/_tests/chart, Components/IntegrationTests/ChartHarness.razor), under the
// standard runtime and under rizzyui-csp.js with a Content Security Policy. Summit SF-005, SF-059,
// SF-061 and SF-062.

/** The Chart.js instance behind an RzChart, by the chart's id. */
function chartState(page: Page, id: string) {
  return page.evaluate(chartId => {
    const root = document.getElementById(chartId)!.querySelector('[data-slot="chart-container"]')!;
    const chart = (window as any).Chart?.getChart(root.querySelector('canvas'));
    if (!chart) return null;
    const dataset = chart.data.datasets[0];
    return {
      type: chart.config.type as string,
      legendItems: chart.legend?.legendItems?.length ?? 0,
      background: Array.isArray(dataset.backgroundColor) ? dataset.backgroundColor[0] : dataset.backgroundColor,
      chart1: getComputedStyle(document.documentElement).getPropertyValue('--chart-1').trim(),
    };
  }, id);
}

async function openHarness(page: Page) {
  await page.goto('/_tests/chart');
  for (const id of ['chart-bar', 'chart-doughnut', 'chart-replaced']) {
    await expect.poll(() => chartState(page, id), { message: `${id} renders` }).not.toBeNull();
  }
}

export function defineChartSpecs(runtime: string) {
  test.describe(`RzChart (${runtime})`, () => {
    test('re-resolves theme colors on a theme change without errors (SF-005, SF-062)', async ({ page }) => {
      const errors = collectPageErrors(page);
      const violations = await collectCspViolations(page);
      await openHarness(page);

      const before = (await chartState(page, 'chart-bar'))!;
      expect(before.background).toBe(before.chart1);

      await page.evaluate(() => (window as any).Rizzy.theme.toggle());
      await expect.poll(async () => {
        const after = (await chartState(page, 'chart-bar'))!;
        return after.background === after.chart1 && after.chart1 !== before.chart1;
      }, { message: 'the bar color follows --chart-1 after the theme change' }).toBe(true);

      // And back: the handler keeps working (it threw through Alpine's proxy before).
      await page.evaluate(() => (window as any).Rizzy.theme.toggle());
      await expect.poll(async () => (await chartState(page, 'chart-bar'))!.background).toBe(before.chart1);

      expect(errors).toEqual([]);
      expect(await violations()).toEqual([]);
    });

    test('a chart replaced while it animates leaves no errors and no listeners (SF-062)', async ({ page }) => {
      const errors = collectPageErrors(page);
      await openHarness(page);

      // Replace the region twice in quick succession, then toggle the theme: the removed charts must
      // be destroyed (Chart.js forgets them) and their theme listeners gone.
      for (let i = 0; i < 2; i++) {
        await page.evaluate(() => {
          const region = document.getElementById('replace-region')!;
          region.innerHTML = region.innerHTML;
        });
        await expect.poll(() => chartState(page, 'chart-replaced')).not.toBeNull();
      }
      await page.evaluate(() => (window as any).Rizzy.theme.toggle());
      await page.waitForTimeout(1200);

      const charts = await page.evaluate(() => Object.keys((window as any).Chart.instances).length);
      expect(charts).toBe(3);
      expect(errors).toEqual([]);
    });

    test('a doughnut chart gets its type, so its legend lists each slice (SF-059)', async ({ page }) => {
      await openHarness(page);
      const doughnut = (await chartState(page, 'chart-doughnut'))!;
      expect(doughnut.type).toBe('doughnut');
      expect(doughnut.legendItems).toBe(3);
      expect((await chartState(page, 'chart-bar'))!.type).toBe('bar');
    });

    test('a chart fills a fixed-height parent without overflowing it (SF-061)', async ({ page }) => {
      await openHarness(page);
      const boxes = await page.evaluate(() => {
        const parent = document.getElementById('fixed-parent')!.getBoundingClientRect();
        const chart = document.querySelector('#chart-bar canvas')!.getBoundingClientRect();
        const auto = document.querySelector('#chart-doughnut canvas')!.getBoundingClientRect();
        return { parent: parent.height, chart: chart.height, auto: auto.height, autoWidth: auto.width };
      });
      expect(boxes.chart).toBeLessThanOrEqual(boxes.parent);
      expect(boxes.chart).toBeGreaterThan(boxes.parent - 10);
      // Without a sized parent the chart keeps a usable default height.
      expect(boxes.auto).toBeGreaterThan(150);
    });
  });
}

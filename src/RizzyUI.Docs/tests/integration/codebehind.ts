import { expect, test, type Locator, type Page } from '@playwright/test';
import { collectCspViolations, collectPageErrors } from './helpers';

// Alpine code-behind (RzAlpineComponent + Component.razor.js) on real pages, under the standard
// runtime and under rizzyui-csp.js with a Content Security Policy. The harness is
// /_tests/codebehind (Components/IntegrationTests/CodeBehindHarness.razor).

async function expectCounter(counter: Locator, label: string, start: number, step: number) {
  await expect(counter.getByTestId('label')).toHaveText(label);
  await expect(counter.getByTestId('count')).toHaveText(String(start));
  await counter.getByTestId('increment').click();
  await expect(counter.getByTestId('count')).toHaveText(String(start + step));
  await counter.getByTestId('decrement').click();
  await counter.getByTestId('decrement').click();
  await expect(counter.getByTestId('count')).toHaveText(String(start - step));
}

async function openHarness(page: Page) {
  await page.goto('/_tests/codebehind');
  await expect(page.locator('#initial-a [data-testid="count"]')).not.toHaveText('');
}

export function defineCodeBehindSpecs(runtime: string) {
  test.describe(`Alpine code-behind (${runtime})`, () => {
    test('components in the initial page start, with props and without inline scripts', async ({ page }) => {
      const errors = collectPageErrors(page);
      const violations = await collectCspViolations(page);
      await openHarness(page);

      await expectCounter(page.locator('#initial-a [data-testid="counter"]'), 'First', 10, 2);
      await expectCounter(page.locator('#initial-b [data-testid="counter"]'), 'Second', 1, 1);

      // The module loads once for both instances, from the fingerprinted URL, and is preloaded.
      const markup = await page.evaluate(() => {
        const roots = [...document.querySelectorAll('#initial-a [x-load-src], #initial-b [x-load-src]')];
        return {
          names: roots.map(root => root.getAttribute('x-data')),
          sources: roots.map(root => root.getAttribute('x-load-src')),
          inlineScripts: [...document.querySelectorAll('main script:not([src])')].length,
          preloads: [...document.querySelectorAll('link[rel="modulepreload"]')].map(link => link.getAttribute('href')),
        };
      });
      expect(markup.names[0]).toMatch(/^rzcb_HarnessCounter_[0-9a-f]{8}$/);
      expect(markup.names[1]).toBe(markup.names[0]);
      expect(markup.sources[0]).toMatch(/\/HarnessCounter\.[a-z0-9]+\.razor\.js$/);
      expect(markup.inlineScripts).toBe(0);
      expect(markup.preloads.filter(href => href === markup.sources[0])).toHaveLength(1);

      expect(errors).toEqual([]);
      expect(await violations()).toEqual([]);
    });

    test('a TypeScript module built by the esbuild pipeline works and bundles its imports', async ({ page }) => {
      const errors = collectPageErrors(page);
      const helperRequests: string[] = [];
      page.on('request', request => { if (request.url().includes('harnessFormat')) helperRequests.push(request.url()); });
      await openHarness(page);

      const counter = page.locator('#typed [data-testid="typed-counter"]');
      await expect(counter.getByTestId('label')).toHaveText('Typed (typed)');
      await expect(counter.getByTestId('count')).toHaveText('3');
      await counter.getByTestId('increment').click();
      await expect(counter.getByTestId('count')).toHaveText('4');

      // The .razor.ts module is served as .razor.js (fingerprinted), with its helper bundled in.
      const src = await page.locator('#typed [x-load-src]').getAttribute('x-load-src');
      expect(src).toMatch(/\/HarnessTypedCounter\.[a-z0-9]+\.razor\.js$/);
      const module = await (await page.request.get(src!)).text();
      expect(module).toContain('(typed)');
      expect(module).not.toMatch(/import\s.*harnessFormat/);
      expect(helperRequests).toEqual([]);
      expect(errors).toEqual([]);
    });

    test('nested components each get their own data and props', async ({ page }) => {
      const errors = collectPageErrors(page);
      await openHarness(page);

      const panel = page.locator('#nested [data-testid="panel"]');
      await expect(panel).toHaveAttribute('x-data', 'harnessPanel');
      await expect(panel.getByTestId('panel-title')).toHaveText('Outer panel');
      await panel.getByTestId('panel-toggle').click();
      await expect(panel.getByTestId('panel-opened')).toHaveText('yes');

      // The inner counter reads its own props, not the panel's.
      await expectCounter(panel.locator('[data-testid="counter"]'), 'Inner', 5, 5);
      expect(errors).toEqual([]);
    });

    test('components arriving in htmx swaps start, every time', async ({ page }) => {
      const errors = collectPageErrors(page);
      const violations = await collectCspViolations(page);
      await openHarness(page);

      for (const round of [1, 2]) {
        const response = page.waitForResponse(r => r.url().endsWith('/_tests/codebehind/fragment'));
        await page.locator('#load-fragment').click();
        expect((await response).status()).toBe(200);
        await expect(page.locator('#swapped')).toHaveCount(1);

        await expectCounter(page.locator('#swapped [data-testid="counter"]'), 'Swapped', 100, 10);
        const panel = page.locator('#swapped [data-testid="panel"]');
        await expect(panel.getByTestId('panel-title')).toHaveText('Swapped panel');
        await panel.getByTestId('panel-toggle').click();
        await expect(panel.getByTestId('panel-opened')).toHaveText('yes', { timeout: 3000 });
        expect(round).toBeGreaterThan(0);
      }

      // The fragment is rendered by a minimal API endpoint: it must use the same fingerprinted URL
      // and data name as the page, so the module is shared.
      const names = await page.evaluate(() => ({
        page: document.querySelector('#initial-a [x-load-src]')?.getAttribute('x-data'),
        fragment: document.querySelector('#swapped [x-load-src][data-rz-props*="Swapped"]')?.getAttribute('x-data'),
        src: document.querySelector('#swapped [x-load-src][data-rz-props*="Swapped"]')?.getAttribute('x-load-src'),
      }));
      expect(names.fragment).toBe(names.page);
      expect(names.src).toMatch(/\/HarnessCounter\.[a-z0-9]+\.razor\.js$/);

      expect(errors).toEqual([]);
      expect(await violations()).toEqual([]);
    });

    test('a page older than the deployment falls back to the plain module URL', async ({ page }) => {
      const warnings: string[] = [];
      page.on('console', message => { if (message.type() === 'warning') warnings.push(message.text()); });
      await openHarness(page);

      // Simulate markup that references a fingerprinted file a newer deployment removed.
      await page.evaluate(() => {
        const plain = document.querySelector('#initial-a [x-load-src]')!.getAttribute('data-rz-module-fallback')!;
        const host = document.createElement('div');
        host.id = 'stale';
        host.innerHTML = `<div x-data="rzcb_HarnessCounter_stale" x-load="eager"
            x-load-src="${plain.replace('.razor.js', '.removed0000.razor.js')}"
            data-rz-module-fallback="${plain}" data-rz-props='{"label":"Stale","initialCount":7,"step":1}'>
          <span data-testid="label" x-text="$props.label"></span>
          <span data-testid="count" x-text="count"></span>
          <button type="button" data-testid="increment" x-on:click="increment">+</button>
          <button type="button" data-testid="decrement" x-on:click="decrement">-</button>
        </div>`;
        document.querySelector('main')!.append(host);
      });

      await expectCounter(page.locator('#stale'), 'Stale', 7, 1);
      expect(warnings.some(w => w.includes("Loaded 'rzcb_HarnessCounter_stale' from"))).toBe(true);
    });

    test('a missing module is reported once with its name and raises rz:module-error', async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
      await openHarness(page);

      const detail = await page.evaluate(() => new Promise<any>(resolve => {
        document.addEventListener('rz:module-error', event => resolve({ ...(event as CustomEvent).detail, error: undefined }), { once: true });
        const host = document.createElement('div');
        host.innerHTML = '<div x-data="rzcb_Missing_00000000" x-load="eager" x-load-src="/_tests/missing/Missing.razor.js"></div>';
        document.querySelector('main')!.append(host);
      }));

      expect(detail.name).toBe('rzcb_Missing_00000000');
      expect(detail.url).toBe('/_tests/missing/Missing.razor.js');
      expect(consoleErrors.filter(e => e.includes('Could not load the code-behind module'))).toHaveLength(1);
    });

    test('the docs example (inside a preview iframe) works', async ({ page }) => {
      await page.goto('/docs/interactivity/alpine-code-behind');
      const counter = page.frameLocator('iframe').first().locator('[x-load-src]');
      await expect(counter.locator('span')).toHaveText('10');
      await counter.getByRole('button', { name: '+' }).click();
      await expect(counter.locator('span')).toHaveText('12');
    });
  });
}

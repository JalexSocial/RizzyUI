import { expect, test, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { expectActiveElement, pressKey } from './helpers/accessibility-helpers';

const repoRoot = path.resolve(process.cwd(), '../..');
const navigationMenuSourcePath = path.join(repoRoot, 'packages/rizzyui/src/js/lib/components/rzNavigationMenu.js');
const focusableSourcePath = path.join(repoRoot, 'packages/rizzyui/src/js/runtime/a11y/focusable.js');

async function loadNavigationMenuFixture(page: Page): Promise<void> {
  const navigationMenuSource = await readFile(navigationMenuSourcePath, 'utf8');
  const focusableSource = await readFile(focusableSourcePath, 'utf8');

  await page.setContent(`<!doctype html>
<html lang="en">
<head><meta charset="utf-8" /><title>NavigationMenu Accessibility Fixture</title></head>
<body>
<main>
  <h1>NavigationMenu Accessibility Fixture</h1>
  <nav id="fixture-navigation" aria-label="Fixture navigation" x-data="rzNavigationMenu" data-alpine-root="fixture-navigation" data-slot="navigation-menu">
    <div class="relative" x-on:mouseleave="scheduleClose">
      <ul id="fixture-navigation-list" x-ref="list" data-slot="navigation-menu-list">
        <li data-slot="navigation-menu-item">
          <button id="products-trigger" type="button" x-ref="trigger_products" aria-haspopup="true" aria-expanded="false" aria-controls="products-content" data-state="closed" data-slot="navigation-menu-trigger">Products</button>
          <div id="products-content" data-item-id="products" data-floating data-popover data-slot="navigation-menu-content">
            <a id="products-overview-link" href="/products/overview" data-slot="navigation-menu-link">Products overview</a>
            <a id="products-internal-link" href="/products/internal" data-slot="navigation-menu-link">Internal product link</a>
          </div>
        </li>
        <li data-slot="navigation-menu-item">
          <button id="guides-trigger" type="button" x-ref="trigger_guides" aria-haspopup="true" aria-expanded="false" aria-controls="guides-content" data-state="closed" data-slot="navigation-menu-trigger">Guides</button>
          <div id="guides-content" data-item-id="guides" data-floating data-popover data-slot="navigation-menu-content">
            <a id="guides-overview-link" href="/guides/overview" data-slot="navigation-menu-link">Guides overview</a>
          </div>
        </li>
        <li data-slot="navigation-menu-item">
          <button id="static-trigger" type="button" x-ref="trigger_static" aria-haspopup="true" aria-expanded="false" aria-controls="static-content" data-state="closed" data-slot="navigation-menu-trigger">Static</button>
          <div id="static-content" data-item-id="static" data-floating data-popover data-slot="navigation-menu-content">
            <p>Informational content only.</p>
          </div>
        </li>
        <li data-slot="navigation-menu-item">
          <a id="docs-link" href="/docs" data-slot="navigation-menu-link">Docs</a>
        </li>
      </ul>
    </div>
  </nav>
</main>
</body>
</html>`);

  await page.evaluate(
    ({ navigationMenuSource, focusableSource }) => {
      const computePosition = () => Promise.resolve({ x: 0, y: 0 });
      const offset = () => null;
      const flip = () => null;
      const shift = () => null;

      const focusableModule = new Function(`${focusableSource.replaceAll('export ', '')}; return { focusFirst };`)() as { focusFirst: (root: Element) => Element | null };
      const runtimeFactory = new Function(
        'computePosition',
        'offset',
        'flip',
        'shift',
        'focusFirst',
        `${navigationMenuSource
          .replace(/import[^;]+;\s*/g, '')
          .replace('export default function rzNavigationMenu()', 'function rzNavigationMenu()')}; return rzNavigationMenu;`
      )(computePosition, offset, flip, shift, focusableModule.focusFirst) as () => Record<string, unknown>;

      const root = document.getElementById('fixture-navigation')!;
      const runtime = runtimeFactory() as Record<string, any>;
      runtime.$el = root;
      runtime.$refs = {
        list: document.getElementById('fixture-navigation-list'),
        trigger_products: document.getElementById('products-trigger'),
        trigger_guides: document.getElementById('guides-trigger'),
        trigger_static: document.getElementById('static-trigger')
      };
      runtime.$nextTick = (callback: () => void) => queueMicrotask(callback);

      Object.defineProperty(root, '__rzNavigationMenuRuntime', { value: runtime, configurable: true });
      runtime.init();

      root.addEventListener('keydown', (event) => runtime.handleKeydown(event));
      window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') runtime.closeMenu(event);
      });
    },
    { navigationMenuSource, focusableSource }
  );
}

async function expectActiveElementId(page: Page, id: string): Promise<void> {
  await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe(id);
}

test.describe('RzNavigationMenu browser accessibility contract', () => {
  test.beforeEach(async ({ page }) => {
    await loadNavigationMenuFixture(page);
  });

  test('initial top-level triggers and links receive focus and runtime is initialized', async ({ page }) => {
    await expect(page.locator('#fixture-navigation')).toHaveAttribute('x-data', 'rzNavigationMenu');
    await expect.poll(() => page.locator('#fixture-navigation').evaluate((node) => !!node['__rzNavigationMenuRuntime'])).toBe(true);

    await page.locator('#products-trigger').focus();
    await expectActiveElement(page, page.locator('#products-trigger'));

    await page.locator('#guides-trigger').focus();
    await expectActiveElement(page, page.locator('#guides-trigger'));

    await page.locator('#docs-link').focus();
    await expectActiveElement(page, page.locator('#docs-link'));
  });

  test('ArrowLeft traverses only top-level controls and wraps from first to last', async ({ page }) => {
    await page.locator('#products-trigger').focus();
    await pressKey(page, 'ArrowLeft');
    await expectActiveElementId(page, 'docs-link');

    await pressKey(page, 'ArrowLeft');
    await expectActiveElementId(page, 'static-trigger');

    await pressKey(page, 'ArrowLeft');
    await expectActiveElementId(page, 'guides-trigger');

    await expect(page.locator('#products-overview-link')).not.toBeFocused();
    await expect(page.locator('#products-internal-link')).not.toBeFocused();
  });

  test('ArrowRight traverses only top-level controls and wraps from last to first', async ({ page }) => {
    await page.locator('#products-trigger').focus();
    await pressKey(page, 'ArrowRight');
    await expectActiveElementId(page, 'guides-trigger');

    await page.locator('#docs-link').focus();
    await pressKey(page, 'ArrowRight');
    await expectActiveElementId(page, 'products-trigger');

    await expect(page.locator('#products-overview-link')).not.toBeFocused();
    await expect(page.locator('#products-internal-link')).not.toBeFocused();
  });

  test('ArrowDown opens associated content and focuses the first descendant in the correct panel', async ({ page }) => {
    await page.locator('#products-trigger').focus();
    await pressKey(page, 'ArrowDown');

    await expect(page.locator('#products-trigger')).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#products-content')).toBeVisible();
    await expectActiveElementId(page, 'products-overview-link');
    await expect(page.locator('#guides-overview-link')).not.toBeFocused();
  });

  test('ArrowDown focuses content container fallback when content has no focusable descendants', async ({ page }) => {
    await page.locator('#static-trigger').focus();
    await pressKey(page, 'ArrowDown');

    await expect(page.locator('#static-trigger')).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#static-content')).toBeVisible();
    await expect(page.locator('#static-content')).toHaveAttribute('tabindex', '-1');
    await expectActiveElementId(page, 'static-content');
    await expect(page.locator('body')).not.toBeFocused();
  });

  test('ArrowDown on a top-level link without content leaves focus and panels unchanged', async ({ page }) => {
    await page.locator('#docs-link').focus();
    await pressKey(page, 'ArrowDown');

    await expectActiveElementId(page, 'docs-link');
    await expect(page.locator('#products-trigger')).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#guides-trigger')).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#static-trigger')).toHaveAttribute('aria-expanded', 'false');
  });

  test('Escape closes open content and restores focus to the controlling trigger', async ({ page }) => {
    await page.locator('#products-trigger').focus();
    await pressKey(page, 'ArrowDown');
    await expectActiveElementId(page, 'products-overview-link');

    await pressKey(page, 'Escape');

    await expect(page.locator('#products-trigger')).toHaveAttribute('aria-expanded', 'false');
    await expectActiveElementId(page, 'products-trigger');
    await expect(page.locator('#guides-trigger')).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#static-trigger')).toHaveAttribute('aria-expanded', 'false');
  });
});

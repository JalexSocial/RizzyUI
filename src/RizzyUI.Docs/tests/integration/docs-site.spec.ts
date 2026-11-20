import { expect, test, type Page } from '@playwright/test';
import { collectPageErrors } from './helpers';

// Behavior of the documentation site itself (not a RizzyUI component).

const currentLinks = (page: Page) => page.evaluate(() =>
  [...new Set([...document.querySelectorAll('[data-sidebar="menu-button"][aria-current="page"]')]
    .map(link => link.getAttribute('href')))]);

test('the sidebar marks only the current page, also after boosted navigation and back', async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto('/components/progress');
  expect(await currentLinks(page)).toEqual(['/components/progress']);

  // Boosted navigation swaps #content only; the sidebar's current link must follow.
  await page.locator('[data-sidebar="menu-button"][href="/components/datatable"]').first().click();
  await page.waitForURL('**/components/datatable');
  await expect.poll(() => currentLinks(page)).toEqual(['/components/datatable']);

  await page.goBack();
  await expect.poll(() => currentLinks(page)).toEqual(['/components/progress']);
  expect(errors).toEqual([]);
});

test('layout assets use fingerprinted URLs', async ({ page }) => {
  await page.goto('/components/progress');
  const urls = await page.evaluate(() => [
    document.querySelector('link[rel="stylesheet"][href*="/css/app"]')?.getAttribute('href'),
    document.querySelector('script[src*="/js/site"]')?.getAttribute('src'),
    document.querySelector('script[type="module"][src*="/_content/RizzyUI/js/rizzyui"]')?.getAttribute('src'),
  ]);
  for (const url of urls) {
    expect(url).toMatch(/\.[a-z0-9]{10}\.(css|js)$/);
    // In Development, MapStaticAssets serves everything with no-cache (for hot reload); in
    // production the fingerprinted URL is served with an immutable, year-long cache.
    expect((await page.request.get(url!)).status()).toBe(200);
  }
});

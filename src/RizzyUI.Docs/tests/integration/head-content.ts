import { expect, test } from '@playwright/test';
import { collectPageErrors } from './helpers';

// Summit SF-034: RzThemeProvider rendered its theme through HeadContent, and Blazor shows only the
// last HeadContent, so a page with its own HeadContent lost every theme variable. The page here
// (/_tests/head-content) has its own HeadContent; the docs app has <RzThemeHeadOutlet /> in <head>.

export function defineHeadContentSpecs(runtime: string) {
  test.describe(`RzThemeProvider and HeadContent (${runtime})`, () => {
    test('a page with its own HeadContent keeps the theme in <head> (SF-034)', async ({ page }) => {
      const errors = collectPageErrors(page);
      await page.goto('/_tests/head-content');

      // The page's own HeadContent is there...
      await expect(page.locator('head meta[name="harness-head-content"]')).toHaveCount(1);
      // ...and so is the theme, once, in <head>.
      const themeStyles = await page.evaluate(() =>
        [...document.querySelectorAll('style')].filter(s => s.textContent?.includes('--primary:')).map(s => s.parentElement?.tagName));
      expect(themeStyles).toEqual(['HEAD']);
      const primary = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--primary').trim());
      expect(primary).not.toBe('');
      expect(errors).toEqual([]);
    });

    test('a preview document rendered in the same request keeps its own theme', async ({ page }) => {
      // RzBrowser renders a whole document (PreviewLayout, with RzThemeProvider in its <head>) inside
      // the page's request. Only the page's provider uses the page's RzThemeHeadOutlet.
      await page.goto('/components/card');
      const iframe = page.locator('iframe').first();
      await expect(iframe).toBeAttached();
      await expect.poll(() => iframe.evaluate(frame => {
        const head = (frame as HTMLIFrameElement).contentDocument?.head;
        return head ? [...head.querySelectorAll('style')].some(s => s.textContent?.includes('--primary:')) : null;
      })).toBe(true);
    });
  });
}

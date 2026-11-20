import { expect, test } from '@playwright/test';
import { collectCspViolations, collectPageErrors } from './helpers';

// Real components under the Alpine CSP build (rizzyui-csp.js) and a Content Security Policy without
// 'unsafe-eval'. Runs in the chromium-csp project against the docs app in CSP mode.

test('the docs app runs the CSP build in CSP mode', async ({ page }) => {
  await page.goto('/');
  const scripts = await page.evaluate(() => [...document.querySelectorAll('script[src]')].map(s => s.getAttribute('src') ?? ''));
  // The layout loads it from its fingerprinted URL (rizzyui-csp.min.<hash>.js) via Assets[...].
  expect(scripts.some(src => /\/_content\/RizzyUI\/js\/rizzyui-csp\.min(\.[a-z0-9]+)?\.js(\?|$)/.test(src))).toBe(true);
  expect(scripts.some(src => /\/rizzyui(\.min)?(\.[a-z0-9]+)?\.js(\?|$)/.test(src))).toBe(false);
});

test.describe('RzInputColor', () => {
  test('typing a color updates the swatch without CSP-build errors (RZUI-032)', async ({ page }) => {
    const errors = collectPageErrors(page);
    const cspViolations = await collectCspViolations(page);
    await page.goto('/components/input-color');

    const input = page.locator('[data-slot="input-color"] input').first();
    const swatch = page.locator('[data-slot="input-color"] [x-data="rzColorSwatch"]').first();
    await expect.poll(() => swatch.evaluate(el => Boolean((el as any)._x_dataStack))).toBe(true);

    await input.fill('#ff0000');
    await expect.poll(() => swatch.evaluate(el => (el as any)._x_dataStack[0].value)).toBe('#ff0000');

    expect(await cspViolations()).toEqual([]);
    expect(errors).toEqual([]);
  });
});

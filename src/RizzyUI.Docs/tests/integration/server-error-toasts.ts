import { expect, test } from '@playwright/test';
import { collectPageErrors } from './helpers';

// RzToastProvider ServerErrorToasts (Summit SF-041) on /_tests/a11y/toast-server-errors; the plain
// provider on /_tests/a11y/toast shows nothing for the same events.

export function defineServerErrorToastSpecs(runtime: string) {
  test.describe(`Server error toasts (${runtime})`, () => {
    test('rz:server-error and htmx:error show localized error toasts when enabled (SF-041)', async ({ page }) => {
      const errors = collectPageErrors(page);
      await page.goto('/_tests/a11y/toast-server-errors');
      await expect.poll(() => page.evaluate(() => typeof (window as any).Rizzy?.toast)).not.toBe('undefined');

      await page.evaluate(() => document.body.dispatchEvent(new CustomEvent('rz:server-error', { bubbles: true, detail: { status: 500 } })));
      const toasts = page.locator('[data-rz-toast-item]');
      await expect(toasts.filter({ hasText: 'The server could not complete that request.' })).toHaveCount(1);
      await expect(toasts.first()).toContainText('Something went wrong');

      await page.evaluate(() => document.body.dispatchEvent(new CustomEvent('htmx:error', { bubbles: true })));
      await expect(toasts.filter({ hasText: 'Could not reach the server.' })).toHaveCount(1);
      expect(errors).toEqual([]);
    });

    test('without ServerErrorToasts the same events show nothing', async ({ page }) => {
      await page.goto('/_tests/a11y/toast');
      await expect.poll(() => page.evaluate(() => typeof (window as any).Rizzy?.toast)).not.toBe('undefined');
      await page.evaluate(() => document.body.dispatchEvent(new CustomEvent('rz:server-error', { bubbles: true })));
      await page.waitForTimeout(500);
      await expect(page.locator('[data-rz-toast-item]')).toHaveCount(0);
    });
  });
}

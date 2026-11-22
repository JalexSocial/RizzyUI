import { expect, test } from '@playwright/test';

// Browser checks for the app `dotnet new rizzyui` generates (run by eng/template-test.sh).

test('links are boosted: navigation swaps the page without a reload (SF-021)', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-slot="sidebar"]').first()).toBeVisible();
  await page.evaluate(() => ((window as any).__templateMarker = 42));

  await page.locator('[data-slot="sidebar"] a[href="/customers"]').first().click();
  await expect(page).toHaveURL(/\/customers$/);
  await expect(page.locator('#customer-table')).toBeVisible();
  // A full page load would have reset the window object.
  expect(await page.evaluate(() => (window as any).__templateMarker)).toBe(42);
});

test('the 404 page links back with a link styled as a button (SF-018)', async ({ page }) => {
  const response = await page.goto('/does-not-exist');
  expect(response?.status()).toBe(404);
  const back = page.getByRole('link', { name: 'Back to the dashboard' });
  await expect(back).toBeVisible();
  await expect(back).toHaveAttribute('data-slot', 'button');
  await expect(page.locator('button a, a button')).toHaveCount(0);
});

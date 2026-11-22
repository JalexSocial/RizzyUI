import { expect, resetDatabase, storageFor, test, waitForRuntime } from '../support/summit';

// Scenario S-12: German. ?culture=de-DE sets the culture cookie; Summit's chrome is translated
// (SharedResource.de.resx), formats follow de-DE, RizzyUI's own strings come from its German
// resources, and values posted from German pages bind on the server.

test.beforeEach(async ({ baseURL }) => resetDatabase(baseURL!));

test('the public site in German: lang, chrome, prices and RizzyUI strings @mobile', async ({ page }) => {
  await page.goto('/tickets?culture=de-DE');
  await waitForRuntime(page);
  await expect(page.locator('html')).toHaveAttribute('lang', /^de/);
  await expect(page.locator('footer')).toContainText('Summit ist eine erfundene Konferenz');
  await expect(page.locator('footer').getByRole('link', { name: 'Hilfe & FAQ' })).toBeVisible();
  // Prices: German grouping and the euro sign after the amount.
  await expect(page.locator('main')).toContainText(/\d+ €/);
  // RizzyUI's own strings in German (the toast region's name).
  await expect(page.locator('[data-slot=toast-provider]')).toHaveAttribute('aria-label', 'Benachrichtigungen');

  // The culture is remembered: a link without ?culture= stays German.
  await page.goto('/help');
  await expect(page.locator('html')).toHaveAttribute('lang', /^de/);
});

test.describe('organizer pages in German', () => {
  test.use({ storageState: async ({}, use, testInfo) => use(storageFor(testInfo)) });

  test('dashboard tickers and the calendar use German formats', async ({ page }) => {
    await page.goto('/organizer?culture=de-DE');
    await waitForRuntime(page);
    await expect(page.locator('#dashboard-charts canvas')).toHaveCount(3);
    await expect(page.getByRole('navigation', { name: 'Brotkrumen' })).toContainText('Dashboard');
    await expect(page.locator('aside, [data-slot=sidebar]').first()).toContainText('Teilnehmende');

    // Revenue with cents in German format, after the ticker's animation: the ticker reads its value
    // invariantly (SF-060 showed €0,00).
    await expect(page.locator('[data-stat="Revenue"]')).toHaveText(/^€\d{1,3}(\.\d{3})+,\d{2}$/);
    await expect(page.locator('[data-stat="Average order"]')).toHaveText(/^€\d{1,3}(\.\d{3})*,\d{2}$/);
    await expect(page.locator('[data-stat="Revenue"]')).not.toHaveText('€0,00');
    // German month names in the range button and the calendar.
    await expect(page.getByRole('button', { name: /^Date range/ })).toContainText('Mai');
    await page.getByRole('button', { name: /^Date range/ }).click();
    await expect(page.locator('#dashboard-calendar')).toContainText('Juni');
  });

  test('a session edited on a German page binds its date and number', async ({ page }) => {
    await page.goto('/organizer/schedule-builder/sessions/2?culture=de-DE');
    await waitForRuntime(page);
    const editor = page.locator('#session-editor');
    const start = editor.locator('[data-slot=date-edit] input[name="Model.StartsAt"]');
    // The picker speaks German: RzDateEdit loads flatpickr's locale for the request culture.
    await start.click();
    await expect(page.locator('.flatpickr-calendar.open')).toContainText('Juni');
    await expect(page.locator('.flatpickr-calendar.open')).toContainText('Mo');
    await start.fill('2027-06-16 19:00');
    await start.press('Enter');
    await editor.getByLabel('Capacity').fill('120');
    await editor.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.locator('#session-item-2')).toContainText('19:00');

    await page.reload();
    await waitForRuntime(page);
    await expect(page.locator('#session-editor [data-slot=date-edit] input[name="Model.StartsAt"]')).toHaveValue('2027-06-16 19:00');
    await expect(page.locator('#session-editor').getByLabel('Capacity')).toHaveValue('120');
  });
});

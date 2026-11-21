import { expect, expectNoAxeViolations, expectUniqueIds, resetDatabase, storageFor, test, waitForRuntime } from '../support/summit';
import type { Page } from '@playwright/test';

// Organizer › Settings: vertical tabs whose panels load when first shown, the general form (422 and
// save), the theme (cookie and HX-Refresh), API keys (create in a dialog, secret shown once, revoke
// after a confirmation), the audit log (pages, collapsible JSON) and the webhook console
// (HX-Trigger with a payload logged by RzEventViewer).

test.use({ storageState: async ({}, use, testInfo) => use(storageFor(testInfo)) });
test.beforeEach(async ({ baseURL }) => resetDatabase(baseURL!));

const tab = (page: Page, name: string) => page.getByRole('tab', { name });
const toasts = (page: Page) => page.locator('[data-slot=toast-provider]');

async function openSettings(page: Page, section = 'general') {
  await page.goto(`/organizer/settings/${section}`);
  await waitForRuntime(page);
}

test('panels load once, when their tab is first shown, and the URL follows the tab', async ({ page }) => {
  const panelRequests: string[] = [];
  page.on('request', request => { if (request.url().includes('/panel')) panelRequests.push(new URL(request.url()).pathname); });
  await openSettings(page);
  await expect(page.locator('#settings-general form')).toBeVisible();
  expect(panelRequests).toEqual(['/organizer/settings/general/panel']);

  // Vertical tabs: Down arrow moves to the next section.
  await tab(page, 'General').focus();
  await page.keyboard.press('ArrowDown');
  await expect(tab(page, 'Appearance')).toHaveAttribute('aria-selected', 'true');
  await expect(page).toHaveURL(/\/organizer\/settings\/appearance$/);
  await expect(page.locator('#settings-appearance')).toBeVisible();
  await tab(page, 'General').click();
  await tab(page, 'Appearance').click();
  expect(panelRequests).toEqual(['/organizer/settings/general/panel', '/organizer/settings/appearance/panel']);

  await expectNoAxeViolations(page);
  await expectUniqueIds(page);
});

test('general settings: a 422 on a bad address, then a save', async ({ page, summit }) => {
  summit.allowStatus(422);
  await openSettings(page);
  const form = page.locator('#settings-general');
  const email = form.getByLabel('Support email');

  await email.fill('not an address');
  await form.getByRole('button', { name: 'Save settings' }).click();
  await expect(form).toContainText('Enter a valid email address.');
  await expect(email).toBeFocused();

  await email.fill('hello@summit.test');
  await form.getByText('Show remaining tickets').click();
  await form.getByRole('button', { name: 'Save settings' }).click();
  await expect(toasts(page)).toContainText('The general settings were saved.');

  await page.reload();
  await waitForRuntime(page);
  await expect(page.locator('#settings-general').getByLabel('Support email')).toHaveValue('hello@summit.test');
  await expect(page.locator('#settings-general').getByRole('switch', { name: 'Show remaining tickets' })).not.toBeChecked();
});

test('a theme is applied to the whole site with a refresh', async ({ page }) => {
  await openSettings(page, 'appearance');
  const radius = () => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--radius').trim());
  const before = await radius();

  await page.locator('#settings-appearance').getByText('Vercel', { exact: true }).click();
  await page.getByRole('button', { name: 'Apply theme' }).click();
  await page.waitForEvent('load');
  await waitForRuntime(page);
  await expect(page).toHaveURL(/\/organizer\/settings\/appearance$/);
  await expect.poll(radius).not.toBe(before);
  await expect(page.locator('#settings-appearance').getByRole('radio', { name: 'Vercel' })).toBeChecked();

  // The email preview renders inside an iframe.
  const preview = page.frameLocator('iframe[title="Preview of the ticket confirmation email"]');
  await expect(preview.getByRole('heading', { name: 'Your tickets are ready, Robin' })).toBeVisible();
});

test('API keys: create one, see the secret once, revoke another', async ({ page, summit }) => {
  summit.allowStatus(422);
  await openSettings(page, 'api-keys');
  const panel = page.locator('#settings-api-keys');
  await expect(panel.locator('#api-keys-table tbody tr')).toHaveCount(3);
  await expectNoAxeViolations(page);
  await expectUniqueIds(page);

  await panel.getByRole('button', { name: 'Create key' }).click();
  const dialog = page.getByRole('dialog', { name: 'Create an API key' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Create key' }).click();
  await expect(dialog).toContainText('Name the key after what uses it.');
  await expect(dialog).toContainText('Choose at least one scope.');

  await dialog.getByLabel('Key name').fill('Mobile app');
  await dialog.getByText('sessions:read', { exact: true }).click();
  await dialog.getByRole('button', { name: 'Create key' }).click();
  const secret = dialog.getByLabel('New API key secret');
  await expect(secret).toHaveValue(/^smt_live_[0-9a-f]{32}$/);
  await expect(dialog.getByRole('button', { name: 'Copy the API key secret' })).toBeVisible();
  await expect(dialog).toContainText('Authorization: Bearer smt_live_');
  await expectNoAxeViolations(page);
  await expect(panel.locator('#api-keys-table tbody tr')).toHaveCount(4);
  await expect(panel.locator('#api-keys-table')).toContainText('Mobile app');
  await dialog.getByRole('button', { name: 'Done' }).click();
  await expect(dialog).toBeHidden();

  // Revoke the badge printer key, after a confirmation that can be declined.
  const row = panel.locator('#api-keys-table tbody tr').filter({ hasText: 'Badge printer' });
  await row.getByRole('button', { name: 'Revoke Badge printer' }).click();
  const confirm = page.getByRole('alertdialog', { name: /Revoke .Badge printer./ });
  await confirm.getByRole('button', { name: 'Keep the key' }).click();
  await expect(confirm).toBeHidden();
  await row.getByRole('button', { name: 'Revoke Badge printer' }).click();
  await confirm.getByRole('button', { name: 'Revoke' }).click();
  await expect(confirm).toBeHidden();
  await expect(toasts(page)).toContainText('was revoked');
  await expect(panel.locator('#api-keys-table tbody tr').filter({ hasText: 'Badge printer' })).toContainText('Revoked');
});

test('the audit log pages and shows event data on request', async ({ page }) => {
  await openSettings(page, 'audit-log');
  const log = page.locator('#settings-audit-log');
  await expect(log).toContainText('Page 1 of');
  const first = await log.locator('li[data-audit-id]').first().getAttribute('data-audit-id');

  const details = log.getByRole('button', { name: 'Details' }).first();
  await details.click();
  const json = log.locator('pre').first();
  await expect(json).toBeVisible();
  await expect(json).toContainText('"source"');
  await expectNoAxeViolations(page);
  await expectUniqueIds(page);

  await log.getByRole('link', { name: /next/i }).click();
  await expect(page.locator('#settings-audit-log')).toContainText('Page 2 of');
  await expect(page.locator('#settings-audit-log li[data-audit-id]').first()).not.toHaveAttribute('data-audit-id', first!);
});

test('a test webhook reaches the event viewer through HX-Trigger', async ({ page }) => {
  await openSettings(page, 'developer');
  const panel = page.locator('#settings-developer');
  await panel.getByRole('button', { name: 'Send test event' }).click();
  await expect(panel.locator('[data-slot=event-viewer]')).toContainText('summit.ping');
  await panel.getByRole('button', { name: 'Send test event' }).click();
  await expect(panel.locator('[data-slot=entry]').filter({ hasText: 'summit.ping' })).toHaveCount(2);
  await expectNoAxeViolations(page);
});

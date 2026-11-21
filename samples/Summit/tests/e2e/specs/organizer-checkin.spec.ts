import { expect, expectNoAxeViolations, expectUniqueIds, resetDatabase, storageFor, test, waitForRuntime } from '../support/summit';
import type { Page } from '@playwright/test';

// Organizer › Check-in desk (scenario S-05). A badge code typed into RzInputOTP is posted as soon as it
// is complete; the result card, the counter (out of band) and a prepended row in the latest check-ins
// follow. Unknown codes are a 422; a second desk sees the count through polling (1 s in Testing).
// Badge codes come from SeedFixtures: HTMX4U (registered), ALPN3S (already checked in).

test.use({ storageState: async ({}, use, testInfo) => use(storageFor(testInfo)) });
test.beforeEach(async ({ baseURL }) => resetDatabase(baseURL!));

const badge = (page: Page) => page.locator('#checkin-form [data-otp-input]');
const checkedIn = async (page: Page) => Number(await page.locator('#checkin-counter [data-checked-in]').getAttribute('data-checked-in'));

async function openDesk(page: Page) {
  await page.goto('/organizer/check-in');
  await waitForRuntime(page);
  await expect(badge(page)).toBeFocused();
}

test('S-05: a badge is checked in as soon as it is typed @mobile', async ({ page }) => {
  await openDesk(page);
  const before = await checkedIn(page);

  await page.keyboard.type('htmx4u');
  const result = page.locator('[data-checkin-result]');
  await expect(result).toHaveAttribute('data-checkin-result', 'CheckedIn');
  await expect(result).toHaveAttribute('role', 'status');
  await expect(result).toContainText('Avery Quinn');
  await expect(page.locator('[data-slot=toast-provider]')).toContainText('Avery Quinn is checked in.');

  // Counter and the latest check-ins change out of band; the form is empty and ready for the next badge.
  await expect.poll(() => checkedIn(page)).toBe(before + 1);
  await expect(page.locator('#recent-checkins-body tr').first()).toContainText('HTMX4U');
  await expect(badge(page)).toHaveValue('');
  await expect(badge(page)).toBeFocused();

  await expectNoAxeViolations(page);
  await expectUniqueIds(page);

  // The same badge again: a warning alert, nothing counted twice.
  await page.keyboard.type('HTMX4U');
  await expect(result).toHaveAttribute('data-checkin-result', 'AlreadyCheckedIn');
  await expect(result).toHaveAttribute('role', 'alert');
  await expect(result).toContainText('Already checked in at');
  expect(await checkedIn(page)).toBe(before + 1);
  await expect(page.locator('#recent-checkins-body tr').filter({ hasText: 'HTMX4U' })).toHaveCount(1);
});

test('an unknown or malformed code is a validation error on the field', async ({ page, summit }) => {
  summit.allowStatus(422);
  await openDesk(page);

  await page.keyboard.type('ZZZZZZ');
  await expect(page.locator('#checkin-form')).toContainText('No attendee has the badge code ZZZZZZ.');
  await expect(badge(page)).toHaveAttribute('aria-invalid', 'true');
  await expect(badge(page)).toBeFocused();
  await expect(page.locator('[data-checkin-result]')).toHaveCount(0);

  // Submitting an incomplete code with the button.
  await badge(page).fill('');
  await page.keyboard.type('AB');
  await page.getByRole('button', { name: 'Check in' }).click();
  await expect(page.locator('#checkin-form')).toContainText('A badge code has six letters and digits.');
});

test('S-05: a second desk sees the check-in within one poll', async ({ page, browser }, testInfo) => {
  await openDesk(page);
  const before = await checkedIn(page);

  const other = await browser.newContext({ ...testInfo.project.use, storageState: storageFor(testInfo) });
  const deskB = await other.newPage();
  await openDesk(deskB);
  await deskB.keyboard.type('HTMX4U');
  await expect(deskB.locator('[data-checkin-result]')).toHaveAttribute('data-checkin-result', 'CheckedIn');
  await other.close();

  // Desk A polls every second; within a few polls its counter shows the new total.
  await expect.poll(() => checkedIn(page), { timeout: 5000 }).toBe(before + 1);

  // Polling replaces the counter without piling up requests.
  const counterRequests: number[] = [];
  page.on('request', request => { if (request.url().endsWith('/organizer/check-in/counter')) counterRequests.push(Date.now()); });
  await expect.poll(() => counterRequests.length, { timeout: 5000 }).toBeGreaterThanOrEqual(3);
  const gaps = counterRequests.slice(1).map((time, i) => time - counterRequests[i]);
  expect(Math.min(...gaps)).toBeGreaterThan(500);
});

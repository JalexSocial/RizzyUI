import { expect, expectNoAxeViolations, expectUniqueIds, resetDatabase, storageFor, test, waitForRuntime } from '../support/summit';
import type { Page } from '@playwright/test';

// Organizer › Dashboard: one request fills every panel (charts in band, stats, capacity and orders
// out of band); the filters (a calendar range in a popover, quick ranges, a ticket type) repeat it and
// push the URL; orders page on their own. The clock is fixed at 2027-06-14 (appsettings.Testing.json),
// so the default range is 2027-05-16 to 2027-06-14.

test.use({ storageState: async ({}, use, testInfo) => use(storageFor(testInfo)) });
test.beforeEach(async ({ baseURL }) => resetDatabase(baseURL!));

const stat = (page: Page, label: string) => page.locator(`[data-stat="${label}"]`);
const rangeButton = (page: Page) => page.getByRole('button', { name: /^Date range/ });

async function openDashboard(page: Page, query = '') {
  await page.goto(`/organizer${query}`);
  await waitForRuntime(page);
  await expect(page.locator('#dashboard-charts canvas')).toHaveCount(3);
  await waitForRuntime(page);
}

/** The ticket count the charts panel states (server-rendered text, unlike the animated ticker). */
async function ticketsInRange(page: Page) {
  const text = await page.locator('#dashboard-charts [data-slot=card-description]').first().textContent();
  return Number(/([\d,]+) tickets in the range/.exec(text ?? '')![1].replace(/,/g, ''));
}

/** Clicks a day in the visible month of the open calendar. */
async function pickDay(page: Page, iso: string) {
  await page.locator(`[data-vc-date="${iso}"]:not([data-vc-date-month="prev"]):not([data-vc-date-month="next"]) button`).click();
}

test('the panels load in one request and agree with each other', async ({ page }) => {
  const panelRequests: string[] = [];
  page.on('request', request => { if (request.url().includes('/organizer/dashboard/panels')) panelRequests.push(request.url()); });

  await openDashboard(page);
  expect(panelRequests).toHaveLength(1);
  expect(panelRequests[0]).toContain('From=2027-05-16&To=2027-06-14');
  await expect(page).toHaveURL(/\/organizer$/); // the first load adds no history entry

  await expect(rangeButton(page)).toHaveAccessibleName('Date range May 16, 2027 - Jun 14, 2027');
  const tickets = await ticketsInRange(page);
  expect(tickets).toBeGreaterThan(0);
  await expect(stat(page, 'Tickets sold')).toHaveText(String(tickets)); // after the ticker's animation
  await expect(page.locator('#dashboard-stats [role=status]')).toContainText(`${tickets} tickets sold`);
  await expect(page.locator('#recent-orders tbody tr')).toHaveCount(8);
  await expect(page.locator('#dashboard-capacity [role=progressbar]')).toHaveCount(5);
  await expect(page.locator('#dashboard-charts [aria-busy], #dashboard-stats[aria-busy]')).toHaveCount(0);

  await expectNoAxeViolations(page);
  await expectUniqueIds(page);
});

test('a calendar range in the popover filters every panel and is a real URL', async ({ page }) => {
  await openDashboard(page);
  const before = await ticketsInRange(page);

  await rangeButton(page).click();
  const calendar = page.locator('#dashboard-calendar');
  await expect(calendar).toBeVisible();
  await pickDay(page, '2027-06-01');
  await pickDay(page, '2027-06-10');

  // The range closes the popover, sends one request and pushes the URL.
  await expect(calendar).toBeHidden();
  await expect(page).toHaveURL(/\/organizer\?from=2027-06-01&to=2027-06-10$/);
  await expect(rangeButton(page)).toHaveAccessibleName('Date range Jun 1, 2027 - Jun 10, 2027');
  await expect.poll(() => ticketsInRange(page)).not.toBe(before);
  const tickets = await ticketsInRange(page);
  await expect(stat(page, 'Tickets sold')).toHaveText(String(tickets));

  // The pushed URL renders the same dashboard.
  await page.reload();
  await waitForRuntime(page);
  await expect(rangeButton(page)).toHaveAccessibleName('Date range Jun 1, 2027 - Jun 10, 2027');
  await expect(stat(page, 'Tickets sold')).toHaveText(String(tickets));
});

test('quick ranges and the ticket filter, down to an empty range', async ({ page }) => {
  await openDashboard(page);

  await page.getByRole('group', { name: 'Quick ranges' }).getByRole('button', { name: 'Last 7 days' }).click();
  await expect(page).toHaveURL(/from=2027-06-08&to=2027-06-14$/);
  await expect(rangeButton(page)).toHaveAccessibleName('Date range Jun 8, 2027 - Jun 14, 2027');

  await page.getByRole('group', { name: 'Quick ranges' }).getByRole('button', { name: 'Whole sale' }).click();
  await expect(page).toHaveURL(/from=2027-02-15&to=2027-06-14$/);
  const all = await ticketsInRange(page);

  await page.locator('#dashboard-filters').getByLabel('Ticket').selectOption('virtual');
  await expect(page).toHaveURL(/&ticket=virtual$/);
  await expect.poll(() => ticketsInRange(page)).toBeLessThan(all);
  await expect(page.locator('#dashboard-charts')).toContainText('Tickets by type');

  // Supporter tickets are not on sale yet: nothing sold, so every panel shows its empty state.
  await page.locator('#dashboard-filters').getByLabel('Ticket').selectOption('supporter');
  await expect(page.locator('#dashboard-charts')).toContainText('No sales in this range');
  await expect(page.locator('#dashboard-charts canvas')).toHaveCount(0);
  await expect(page.locator('#recent-orders')).toContainText('No orders');
  await expect(stat(page, 'Tickets sold')).toHaveText('0');
});

test('recent orders page on their own', async ({ page }) => {
  await openDashboard(page);
  const orders = page.locator('#recent-orders');
  const first = await orders.locator('tbody tr').first().getAttribute('data-order');
  await expect(orders).toContainText('Page 1 of');

  await orders.getByRole('link', { name: /next/i }).click();
  await expect(orders).toContainText('Page 2 of');
  await expect(orders.locator('tbody tr').first()).not.toHaveAttribute('data-order', first!);
  await expect(page).toHaveURL(/\/organizer$/); // paging does not change the dashboard URL
});

test('a failed panels request keeps the placeholders and shows an error toast', async ({ page, baseURL, summit }) => {
  summit.allowStatus(500);
  summit.allowConsole(/500 \(Internal Server Error\)/);
  await fetch(new URL('/_test/fail-next', baseURL!), { method: 'POST' });
  await page.goto('/organizer');
  await waitForRuntime(page);
  await expect(page.locator('[data-slot=toast-provider]')).toContainText('The server could not complete that request.');
  await expect(page.locator('#dashboard-charts[aria-busy="true"] [data-slot=skeleton]')).toHaveCount(3);
});

// RzChart neither re-reads its colors on a theme change (SF-005) nor survives one (SF-062: update() on a
// reactive proxy throws). DashboardFilters reloads the charts instead; this checks the result and that
// no page error is thrown.
test('charts follow the dark mode toggle', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await openDashboard(page);
  const tickColor = () => page.evaluate(() => {
    const element = document.querySelector('#chart-daily [x-data="rzChart"]');
    const Alpine = (window as any).Rizzy.Alpine;
    const chart = element ? Alpine.raw(Alpine.$data(element).chartInstance) : null;
    return chart ? String(chart.options.scales.y.ticks.color) : null;
  });
  await expect.poll(tickColor).not.toBeNull();
  const light = await tickColor();
  await page.getByRole('button', { name: 'Toggle dark mode' }).first().click();
  await expect(page.locator('html')).toHaveClass(/\bdark\b/);
  await expect.poll(tickColor).not.toBe(light);
  await expect.poll(tickColor).not.toBeNull();
  await expect(page.locator('#dashboard-charts canvas')).toHaveCount(3);
});

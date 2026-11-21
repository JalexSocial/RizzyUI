import { expect, storageFor, test, waitForRuntime } from '../support/summit';
import type { Page } from '@playwright/test';
import { organizerRoutes, publicRoutes } from './routes';

// Scenario S-16: phone layouts (Pixel 7, 412 px wide). Runs in the mobile project only. No page may
// scroll sideways; wide tables scroll inside their own container; the public navigation and the
// organizer sidebar open as sheets that trap focus and close with Escape.

test.skip(({ isMobile }) => !isMobile, 'phone layouts are checked in the mobile project');

async function expectNoSidewaysScroll(page: Page) {
  const overflow = await page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const wide = [...document.querySelectorAll('body *')]
      .filter(el => {
        const box = el.getBoundingClientRect();
        if (box.width === 0 || box.right <= width + 1) return false;
        // Content inside a scrolling container (a table wrapper, a scroll area) is fine.
        for (let parent = el.parentElement; parent; parent = parent.parentElement) {
          const style = getComputedStyle(parent);
          if (['auto', 'scroll', 'hidden', 'clip'].includes(style.overflowX)) return false;
        }
        return true;
      })
      .slice(0, 3)
      .map(el => `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}.${String(el.className).split(' ').slice(0, 3).join('.')}`);
    return { scroll: document.documentElement.scrollWidth - width, wide };
  });
  expect(overflow, JSON.stringify(overflow)).toEqual({ scroll: 0, wide: [] });
}

for (const route of publicRoutes.filter(r => !r.path.includes('?'))) {
  test(`${route.path} fits a phone @mobile`, async ({ page, summit }) => {
    summit.allowStatus(404); // the not-found page is in the list on purpose
    await page.goto(route.path);
    await waitForRuntime(page);
    await expectNoSidewaysScroll(page);
  });
}

test('the public navigation sheet opens, traps focus and closes @mobile', async ({ page }) => {
  await page.goto('/');
  await waitForRuntime(page);
  const open = page.getByRole('button', { name: 'Open navigation' });
  await open.click();
  const sheet = page.getByRole('dialog');
  await expect(sheet).toBeVisible();
  await expect(sheet.getByRole('link', { name: 'Schedule' })).toBeVisible();
  // Tabbing many times keeps focus inside the sheet.
  for (let i = 0; i < 12; i++) await page.keyboard.press('Tab');
  expect(await sheet.evaluate(el => el.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(sheet).toBeHidden();
  await expect(open).toBeFocused();
});

test.describe('organizer', () => {
  test.use({ storageState: async ({}, use, testInfo) => use(storageFor(testInfo)) });

  for (const route of organizerRoutes) {
    test(`${route.path} fits a phone @mobile`, async ({ page }) => {
      await page.goto(route.path);
      await waitForRuntime(page);
      await expectNoSidewaysScroll(page);
    });
  }

  test('the sidebar opens as a sheet on phones and navigates @mobile', async ({ page }) => {
    await page.goto('/organizer/check-in');
    await waitForRuntime(page);
    await page.getByRole('button', { name: 'Toggle Sidebar' }).click();
    const sheet = page.getByRole('dialog');
    await expect(sheet).toBeVisible();
    await sheet.getByRole('link', { name: 'Attendees' }).click();
    await expect(page).toHaveURL(/\/organizer\/attendees$/);
    await waitForRuntime(page);
    // The attendee table scrolls inside its own container.
    const container = page.locator('#attendee-table [data-slot=table-container]');
    expect(await container.evaluate(el => el.scrollWidth > el.clientWidth)).toBe(true);
    await expectNoSidewaysScroll(page);
  });
});

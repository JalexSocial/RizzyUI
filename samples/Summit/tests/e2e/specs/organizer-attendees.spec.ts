import { expect, expectNoAxeViolations, expectUniqueIds, resetDatabase, storageFor, test, waitForRuntime } from '../support/summit';
import type { Page } from '@playwright/test';

// Organizer › Attendees: an RzDataTable whose client state (sort, page, search, hidden columns,
// selection) survives every server rebuild of the table (SF-001), an editor in a sheet opened by a
// swap and closed by rz:sheet-close (SF-002), and bulk actions confirmed in an alert dialog (SF-003).
// Scenarios S-03 and S-04 in summit-demo-plan.md. The plan's S-03 opens the editor from a row menu;
// Summit uses a row button because Alpine-rendered rows cannot carry hx-get (SF-048).

test.use({ storageState: async ({}, use, testInfo) => use(storageFor(testInfo)) });
test.beforeEach(async ({ baseURL }) => resetDatabase(baseURL!));

const table = (page: Page) => page.locator('#attendee-table');
const filters = (page: Page) => page.locator('#attendee-filters');
const rows = (page: Page) => table(page).locator('tbody tr[data-row-id]');

/** The table's state as the hidden inputs send it with every request. */
async function sentState(page: Page) {
  return page.locator('#attendee-table-state input').evaluateAll(inputs =>
    Object.fromEntries(inputs.map(input => [(input as HTMLInputElement).name, (input as HTMLInputElement).value])));
}

async function openAttendees(page: Page) {
  await page.goto('/organizer/attendees');
  await waitForRuntime(page);
  await expect(rows(page)).toHaveCount(10);
}

test('S-03: editing an attendee keeps the table where the organizer left it', async ({ page, summit }) => {
  summit.allowStatus(422);
  await openAttendees(page);

  // Sort by company, search, hide a column, go to page 2.
  await table(page).getByRole('button', { name: 'Company', exact: true }).click();
  await page.getByLabel('Search attendees').fill('example.org');
  await table(page).getByRole('button', { name: 'Columns' }).click();
  await page.locator('[data-column-toggle="Country"]').uncheck();
  await page.keyboard.press('Escape');
  await table(page).getByRole('button', { name: 'Next' }).click();
  await expect(table(page)).toContainText('Page 2 of');
  await expect(table(page).locator('th[data-column-id="Country"]')).toHaveCount(0);
  expect(await sentState(page)).toMatchObject({ Sort: 'Company', Desc: 'false', Page: '1', Search: 'example.org', Hidden: 'Country' });

  const before = await rows(page).first().getAttribute('data-row-id');
  const editButton = rows(page).first().locator('[data-edit-id]');
  const name = (await editButton.getAttribute('aria-label'))!.replace(/^Edit /, '');

  // The sheet opens with focus inside it.
  await editButton.click();
  const sheet = page.getByRole('dialog', { name: 'Edit attendee' });
  await expect(sheet).toBeVisible();
  await expect(sheet.getByLabel('Name')).toHaveValue(name);
  await expect(sheet.getByLabel('Name')).toBeFocused();
  await expectNoAxeViolations(page);
  await expectUniqueIds(page);

  // An invalid email: 422 into the sheet, the value kept, focus on the field.
  await sheet.getByLabel('Email').fill('not-an-email');
  await sheet.getByRole('button', { name: 'Save changes' }).click();
  await expect(sheet.getByText('Enter a valid email address.')).toBeVisible();
  await expect(sheet.getByLabel('Email')).toBeFocused();
  await expect(sheet.getByLabel('Email')).toHaveValue('not-an-email');

  // Fix it, rename, and add tags: the sheet goes away, the table keeps its state, focus returns.
  await sheet.getByLabel('Email').fill('renamed@example.org');
  await sheet.getByLabel('Name').fill(`${name} (renamed)`);
  // Tags: a multiple combobox; pick one suggestion and create a new tag.
  await sheet.getByRole('combobox', { name: 'Tags' }).click();
  await page.keyboard.type('Pre');
  await expect(page.locator('.ts-dropdown .option.active').filter({ visible: true })).toHaveText('Press');
  await page.keyboard.press('Enter');
  // Tom Select keeps the search text after a pick in multiple mode, so replace it.
  await sheet.getByRole('combobox', { name: 'Tags' }).fill('Workshop lead');
  await expect(page.locator('.ts-dropdown .create.active').filter({ visible: true })).toContainText('Workshop lead');
  await page.keyboard.press('Enter');
  // A multiple combobox stays open after a pick; Tab closes it and moves on to Notes (SF-055).
  await page.keyboard.press('Tab');
  await expect(sheet.getByLabel('Notes')).toBeFocused();
  await expect(page.locator('.ts-dropdown').filter({ visible: true })).toHaveCount(0);
  await sheet.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('dialog', { name: 'Edit attendee' })).toHaveCount(0);
  await expect(page.locator('[data-slot=toast-provider]')).toContainText(`${name} (renamed) was updated.`);
  await expect(table(page)).toContainText('Page 2 of');
  await expect(page.getByLabel('Search attendees')).toHaveValue('example.org');
  await expect(table(page).locator('th[data-column-id="Country"]')).toHaveCount(0);
  await expect(table(page).locator('th[data-column-id="Company"]')).toHaveAttribute('aria-sort', 'ascending');
  await expect(rows(page).first()).toHaveAttribute('data-row-id', before!);
  await expect(rows(page).first()).toContainText(`${name} (renamed)`);
  await expect(rows(page).first().locator('td[data-column-id="Tags"]')).toHaveText('Press,Workshop lead');
  await expect(rows(page).first().locator('[data-edit-id]')).toBeFocused();
});

test('server filters rebuild the table, push the URL and start on the first page', async ({ page }) => {
  await openAttendees(page);
  await table(page).getByRole('button', { name: 'Next' }).click();
  await expect(table(page)).toContainText('Page 2 of 60');

  await filters(page).getByLabel('Status').selectOption('Cancelled');
  await expect(page).toHaveURL(/\/organizer\/attendees\?status=Cancelled$/);
  await expect(table(page)).toContainText('Page 1 of');
  await expect(table(page).locator('td[data-column-id="Status"]').first()).toHaveText('Cancelled');
  expect((await sentState(page)).Page).toBe('0');

  // The pushed URL is a real page.
  await page.reload();
  await waitForRuntime(page);
  await expect(filters(page).getByLabel('Status')).toHaveValue('Cancelled');
  await expect(table(page).locator('td[data-column-id="Status"]').first()).toHaveText('Cancelled');
});

test('S-04: a bulk check-in across pages is confirmed, applied and announced', async ({ page }) => {
  await openAttendees(page);
  await filters(page).getByLabel('Status').selectOption('Registered');
  await expect(page).toHaveURL(/status=Registered/);
  await waitForRuntime(page);
  const total = Number(await table(page).locator('[data-total-rows]').textContent());

  // Three rows on page 1, two on page 2.
  for (const index of [0, 1, 2]) await rows(page).nth(index).getByRole('checkbox').check();
  await table(page).getByRole('button', { name: 'Next' }).click();
  for (const index of [0, 1]) await rows(page).nth(index).getByRole('checkbox').check();
  const bulk = page.getByRole('region', { name: 'Bulk actions' });
  await expect(bulk).toContainText('5 attendees selected');

  // Cancel keeps the selection and gives focus back.
  const checkIn = bulk.getByRole('button', { name: 'Check in' });
  await checkIn.click();
  const dialog = page.getByRole('alertdialog', { name: 'Confirm bulk action' });
  await expect(dialog).toContainText('Check in 5 attendees?');
  await dialog.getByRole('button', { name: 'Go back' }).click();
  await expect(dialog).toBeHidden();
  await expect(checkIn).toBeFocused();
  await expect(bulk).toContainText('5 attendees selected');

  // Confirm: five fewer registered attendees, a toast, and no selection.
  await checkIn.click();
  await dialog.getByRole('button', { name: 'Apply' }).click();
  await expect(dialog).toBeHidden();
  await expect(page.locator('[data-slot=toast-provider]')).toContainText('5 attendees checked in.');
  await expect(table(page).locator('[data-total-rows]')).toHaveText(String(total - 5));
  await expect(bulk).toBeHidden();
  expect((await sentState(page)).Selected).toBe('');
});

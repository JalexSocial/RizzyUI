import { expect, expectNoAxeViolations, expectUniqueIds, resetDatabase, storageFor, test, waitForRuntime } from '../support/summit';
import type { Page } from '@playwright/test';

// Organizer › Schedule builder: a menubar (File, View with checkbox and radio items, Help), the session
// list in an RzScrollArea and an editor with RzDateEdit, RzSlider, RzInputNumber, RzNativeSelect,
// RzInputColor, RzSwitch and a delete confirmation. Session 1 is the opening keynote (Main Hall, 900
// seats, 2027-06-15 09:00, 60 minutes).

test.use({ storageState: async ({}, use, testInfo) => use(storageFor(testInfo)) });
test.beforeEach(async ({ baseURL }) => resetDatabase(baseURL!));

const editor = (page: Page) => page.locator('#session-editor');
const listItem = (page: Page, id: number) => page.locator(`#session-item-${id}`);
const toasts = (page: Page) => page.locator('[data-slot=toast-provider]');

async function openSession(page: Page, id: number) {
  await page.goto('/organizer/schedule-builder');
  await waitForRuntime(page);
  await listItem(page, id).getByRole('link').click();
  await expect(page).toHaveURL(new RegExp(`/organizer/schedule-builder/sessions/${id}$`));
  await expect(listItem(page, id).getByRole('link')).toHaveAttribute('aria-current', 'page');
  await waitForRuntime(page);
}

test('editing a session: slider, switch and a new title, saved in place', async ({ page }) => {
  await openSession(page, 2);
  const title = editor(page).getByLabel('Title');
  const original = await title.inputValue();

  await title.fill(`${original} (updated)`);
  const length = editor(page).getByRole('slider');
  const before = Number(await length.getAttribute('aria-valuenow'));
  await length.focus();
  await page.keyboard.press('ArrowRight');
  await expect(length).toHaveAttribute('aria-valuenow', String(before + 15));
  // The switch's input is visually hidden; organizers click its label.
  await editor(page).getByText('Published on the public schedule').click();
  await editor(page).getByRole('button', { name: 'Save changes' }).click();

  await expect(toasts(page)).toContainText(`${original} (updated)`);
  await expect(listItem(page, 2)).toContainText(`${original} (updated)`);
  await expect(listItem(page, 2)).toContainText('Draft');
  await expect(editor(page).getByRole('slider')).toHaveAttribute('aria-valuenow', String(before + 15));

  // The pushed URL is a real page with the saved values.
  await page.reload();
  await waitForRuntime(page);
  await expect(editor(page).getByLabel('Title')).toHaveValue(`${original} (updated)`);
  await expect(editor(page).getByRole('switch')).not.toBeChecked();
  await expectNoAxeViolations(page);
  await expectUniqueIds(page);
});

test('the server refuses a room clash and a capacity above the room', async ({ page, summit }) => {
  summit.allowStatus(422);
  await openSession(page, 2);

  await editor(page).getByLabel('Room').selectOption({ label: 'Main Hall (900 seats)' });
  await editor(page).getByLabel('Capacity').fill('950');
  // Not getByLabel('Starts at'): RzDateEdit's input is named "Select date", which overrides its field
  // label (SF-068).
  const start = editor(page).locator('[data-slot=date-edit] input[name="Model.StartsAt"]');
  await start.fill('2027-06-15 09:15');
  await start.press('Enter');
  await editor(page).getByRole('button', { name: 'Save changes' }).click();

  // Both rules fail; the values stay and focus goes to the first invalid field.
  await expect(editor(page)).toContainText('Main Hall has 900 seats.');
  await expect(editor(page)).toContainText('Main Hall is taken by');
  await expect(editor(page)).toContainText('at 09:00');
  await expect(start).toHaveAttribute('aria-invalid', 'true');
  await expect(start).toBeFocused();
  await expect(editor(page).getByLabel('Capacity')).toHaveValue('950');
  await expect(start).toHaveValue('2027-06-15 09:15');
});

test('a new track color reaches every session of the track', async ({ page }) => {
  await openSession(page, 1);
  const trackItems = page.locator('#session-list li[id^="session-item-"]').filter({ hasText: 'Web & Frontend' });
  const count = await trackItems.count();
  expect(count).toBeGreaterThan(1);

  const color = editor(page).getByLabel('Track color');
  await color.fill('#ff8800');
  await color.press('Tab');
  await editor(page).getByRole('button', { name: 'Save changes' }).click();
  await expect(toasts(page)).toContainText('was saved');
  await expect(trackItems.locator('[data-slot=color-swatch]').first()).toHaveAttribute('aria-label', /#ff8800/);
  await expect(trackItems.locator('[data-slot=color-swatch][aria-label*="#ff8800"]')).toHaveCount(count);
});

test('menubar: new session, drafts only, density, publish all', async ({ page }) => {
  await page.goto('/organizer/schedule-builder');
  await waitForRuntime(page);

  // File › New session (keyboard: Enter opens the menu, arrows move, Enter activates).
  await page.getByRole('menuitem', { name: 'File' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('menuitem', { name: 'New session' })).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(editor(page)).toContainText('New session');
  await waitForRuntime(page);
  await editor(page).getByLabel('Title').fill('Summit closing panel');
  await editor(page).getByRole('button', { name: 'Create session' }).click();
  await expect(toasts(page)).toContainText('Summit closing panel');
  const created = page.locator('#session-list li').filter({ hasText: 'Summit closing panel' });
  await expect(created).toContainText('Draft');

  // View › Drafts only hides published sessions; View › Compact hides the details line.
  const published = listItem(page, 1);
  // Checkbox and radio items keep the menu open, as in the APG menubar pattern.
  await page.getByRole('menuitem', { name: 'View' }).click();
  await page.getByRole('menuitemcheckbox', { name: 'Drafts only' }).click();
  await expect(page.getByRole('menuitemcheckbox', { name: 'Drafts only' })).toHaveAttribute('aria-checked', 'true');
  await expect(published).toBeHidden();
  await expect(created).toBeVisible();
  await page.getByRole('menuitemradio', { name: 'Compact' }).click();
  await expect(page.getByRole('menuitemradio', { name: 'Compact' })).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByRole('menuitemradio', { name: 'Comfortable' })).toHaveAttribute('aria-checked', 'false');
  await expect(created.locator('[data-item-details]')).toBeHidden();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menuitemradio', { name: 'Compact' })).toBeHidden();

  // File › Publish all drafts, confirmed: the draft is published, so "drafts only" now hides it too.
  await page.getByRole('menuitem', { name: 'File' }).click();
  await page.getByRole('menuitem', { name: 'Publish all drafts…' }).click();
  const dialog = page.getByRole('alertdialog', { name: 'Publish all drafts?' });
  await dialog.getByRole('button', { name: 'Publish' }).click();
  await expect(dialog).toBeHidden();
  await expect(toasts(page)).toContainText('published.');
  await expect(created).toBeHidden();
});

test('deleting a session asks first, then empties the editor and removes the item', async ({ page }) => {
  await openSession(page, 3);
  const title = await editor(page).getByLabel('Title').inputValue();

  await editor(page).getByRole('button', { name: 'Delete session' }).click();
  const dialog = page.getByRole('alertdialog', { name: 'Delete this session?' });
  await dialog.getByRole('button', { name: 'Keep it' }).click();
  await expect(dialog).toBeHidden();
  await expect(listItem(page, 3)).toBeVisible();

  await editor(page).getByRole('button', { name: 'Delete session' }).click();
  await dialog.getByRole('button', { name: 'Delete' }).click();
  await expect(listItem(page, 3)).toHaveCount(0);
  await expect(editor(page)).toContainText('No session open');
  await expect(toasts(page)).toContainText(`${title}`);
  await expect(page).toHaveURL(/\/organizer\/schedule-builder$/);
});

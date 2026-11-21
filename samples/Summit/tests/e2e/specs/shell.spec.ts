import { expect, test, waitForRuntime } from '../support/summit';

// The application shell: layouts, boosted navigation, the organizer sign-in, theme and culture.

test('boosted navigation swaps the page and keeps the runtime @mobile', async ({ page }) => {
  await page.goto('/');
  await waitForRuntime(page);
  const marker = await page.evaluate(() => ((window as any).__summitMarker = Math.random()));

  await page.locator('footer').getByRole('link', { name: 'Speakers' }).click();
  await expect(page).toHaveURL(/\/speakers$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Speakers' })).toBeVisible();
  await expect(page).toHaveTitle(/Speakers/);

  // A boosted navigation is not a full reload: the window object survives.
  await page.locator('footer').getByRole('link', { name: 'Help & FAQ' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Help & FAQ' })).toBeVisible();
  expect(await page.evaluate(() => (window as any).__summitMarker)).toBe(marker);

  await page.goBack();
  await expect(page.getByRole('heading', { level: 1, name: 'Speakers' })).toBeVisible();
});

test('the organizer area requires sign-in and returns to the requested page', async ({ page, summit }) => {
  summit.allowStatus(422);
  await page.goto('/organizer/attendees');
  await expect(page).toHaveURL(/\/account\/sign-in\?ReturnUrl=%2Forganizer%2Fattendees/);

  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByText('Enter your email address.')).toBeVisible();

  await page.getByLabel('Email').fill('organizer@summit.test');
  await page.getByLabel('Password').fill('wrong password');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.locator('#sign-in-form').getByText("don't match an organizer account")).toBeVisible();

  await page.getByLabel('Password').fill('summit-demo-2027');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/organizer\/attendees$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Attendees' })).toBeVisible();
});

test('the dark mode toggle switches and is remembered @mobile', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await waitForRuntime(page);
  await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);

  await page.getByRole('button', { name: 'Toggle dark mode' }).first().click();
  await expect(page.locator('html')).toHaveClass(/\bdark\b/);

  await page.reload();
  await expect(page.locator('html')).toHaveClass(/\bdark\b/);
});

test('the language menu switches to German and back', async ({ page }) => {
  await page.goto('/');
  await waitForRuntime(page);
  await page.getByRole('button', { name: /^Language/ }).first().click();
  await page.getByRole('menuitem', { name: 'Deutsch' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  // A language switch is a full page load (hx-boost="false"); wait for the new page's components.
  await waitForRuntime(page);

  // The chrome is German now: the button is "Sprache, DE".
  await page.getByRole('button', { name: /^Sprache/ }).first().click();
  await page.getByRole('menuitem', { name: 'English' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('organizer quick actions open with Ctrl+J and navigate with the keyboard', async ({ organizerPage: page }) => {
  await page.goto('/organizer');
  await waitForRuntime(page);
  await page.keyboard.press('Control+j');
  const dialog = page.getByRole('dialog', { name: 'Quick actions' });
  await expect(dialog).toBeVisible();

  await page.keyboard.type('check-in');
  // RzCommand filters after a 50 ms debounce; Enter before that runs the previous item (SF-025).
  await expect(dialog.getByRole('option', { name: 'Check-in desk' })).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/organizer\/check-in/);
  await expect(page.getByRole('heading', { level: 1, name: 'Check-in desk' })).toBeVisible();
  await expect(dialog).toBeHidden();
});

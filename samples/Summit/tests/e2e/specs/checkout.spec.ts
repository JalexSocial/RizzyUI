import { expect, expectNoAxeViolations, expectUniqueIds, resetDatabase, test, waitForRuntime } from '../support/summit';
import { seed } from '../support/fixtures';

// The four-step checkout: htmx forms, 422 round trips with focus on the first error, a list-bound
// attendee form with comboboxes, an OTP discount code, out-of-band summary and step updates, pushed
// URLs, the confirmation that replaces the whole checkout, and ownership of the confirmation page.

test.beforeEach(async ({ baseURL }) => resetDatabase(baseURL!));

test('buys two workshop tickets with a discount, recovering from every validation error @mobile', async ({ page, summit, browser }, testInfo) => {
  summit.allowStatus(422);
  await page.goto('/tickets');
  await waitForRuntime(page);
  await page.getByRole('link', { name: 'Choose Conference + Workshop' }).click();
  await expect(page).toHaveURL(/\/tickets\/checkout\/tickets$/);
  await waitForRuntime(page);

  // Step 1: the live estimate follows the form before anything is submitted.
  await page.getByLabel('Number of tickets').fill('2');
  await page.getByText('Offset your travel').click();
  await expect(page.getByText('Estimated total:')).toContainText('€1,822');
  await page.getByRole('button', { name: 'Continue to attendees' }).click();

  // Step 2 arrives with the step indicator and summary updated out of band, and focus on its heading.
  await expect(page).toHaveURL(/\/tickets\/checkout\/attendees$/);
  await expect(page.getByRole('heading', { name: '2. Who is coming?' })).toBeFocused();
  await expect(page.locator('#order-summary')).toContainText('2 × Conference + Workshop');
  await expect(page.locator('#checkout-steps [aria-current="step"]')).toContainText('Attendees');
  await waitForRuntime(page);
  await expectNoAxeViolations(page);
  await expectUniqueIds(page);

  // Submitting empty: errors for list items (SF-044) and focus on the first invalid field (SF-045).
  await page.getByRole('button', { name: 'Continue to payment' }).click();
  await expect(page.getByText("Enter the attendee's name.").first()).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Full name' }).first()).toBeFocused();

  const names = page.getByRole('textbox', { name: 'Full name' });
  const emails = page.getByRole('textbox', { name: 'Email' });
  const countries = page.getByRole('combobox', { name: 'Country' });
  const workshops = page.getByRole('combobox', { name: 'Workshop' });
  for (const [i, person] of [['Robin Example', 'Germany'], ['Sam Example', 'France']].entries()) {
    await names.nth(i).fill(person[0]);
    await emails.nth(i).fill('robin@example.com');
    const country = countries.nth(i);
    await country.click();
    // fill, not keyboard.type: on a slow runner the keystrokes could arrive before the input had focus.
    await country.fill(person[1]);
    // Enter right after typing picks the match (SF-046: no refresh throttle for local options).
    await country.press('Enter');
    await workshops.nth(i).selectOption({ index: 1 });
  }
  await page.getByRole('button', { name: 'Continue to payment' }).click();

  // A server rule across list items; the comboboxes keep their values through the 422.
  await expect(page.getByText('Each ticket needs its own email address.')).toBeVisible();
  await expect(emails.nth(1)).toBeFocused();
  await expect(page.locator('select[name="Model.Attendees[1].Country"]')).toHaveValue('France');
  await emails.nth(1).fill('sam@example.com');
  await page.getByRole('button', { name: 'Continue to payment' }).click();
  await expect(page).toHaveURL(/\/tickets\/checkout\/payment$/);
  await waitForRuntime(page);
  await expectNoAxeViolations(page);

  // Step 3: discount codes typed into the OTP input.
  const code = page.getByRole('textbox', { name: 'Discount code (optional)' });
  await code.pressSequentially(seed.expiredDiscountCode.toLowerCase());
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(page.getByText(`The code ${seed.expiredDiscountCode} has expired.`)).toBeVisible();
  await page.getByRole('textbox', { name: 'Discount code (optional)' }).fill('');
  await page.getByRole('textbox', { name: 'Discount code (optional)' }).pressSequentially(seed.validDiscountCode);
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(page.locator('#discount-field')).toContainText(`${seed.validDiscountCode} applied: 20% off`);
  await expect(page.locator('#order-summary [data-order-total]')).toHaveText('€1,457.60');

  // Placing the order without the code of conduct, then with it.
  await page.getByText('Demo payment').click();
  await page.getByRole('button', { name: /^Place order/ }).click();
  await expect(page.getByText('Accept the code of conduct to continue.')).toBeVisible();
  await expect(page.getByRole('checkbox', { name: 'I accept the code of conduct' })).toBeFocused();
  await page.getByRole('checkbox', { name: 'I accept the code of conduct' }).check();
  await page.getByRole('button', { name: /^Place order/ }).click();

  // The confirmation replaces the whole checkout (HX-Retarget) and gets its own URL.
  await expect(page).toHaveURL(/\/tickets\/confirmation\/SMT-\d+$/);
  await expect(page.getByRole('heading', { name: "You're going to Summit!" })).toBeVisible();
  await expect(page.locator('[data-badge-code]')).toHaveCount(2);
  await expectNoAxeViolations(page);
  await expect(page.getByText("You're going to Summit!").last()).toBeVisible();
  const confirmationUrl = page.url();

  // The draft is gone: Back lands on a fresh first step, not on a half-filled payment form.
  await page.goBack();
  await expect(page).toHaveURL(/\/tickets\/checkout\/(tickets|payment)$/);
  await expect(page.getByRole('heading', { name: /1\. Choose your tickets/ })).toBeVisible();

  // Another visitor cannot open someone else's confirmation.
  const stranger = await browser.newContext({ ...testInfo.project.use });
  const response = await (await stranger.newPage()).goto(confirmationUrl);
  expect(response?.status()).toBe(404);
  await stranger.close();
});

test('a later step cannot be opened before the earlier ones', async ({ page }) => {
  await page.goto('/tickets/checkout/payment');
  await expect(page).toHaveURL(/\/tickets\/checkout\/tickets$/);
  await expect(page.getByRole('heading', { name: /1\. Choose your tickets/ })).toBeVisible();
});

test('sold-out and not-yet-on-sale tickets cannot be chosen', async ({ page }) => {
  await page.goto('/tickets/checkout?ticket=conference');
  await waitForRuntime(page);
  await expect(page.getByRole('radio', { name: /Student/ })).toBeDisabled();
  await expect(page.getByRole('radio', { name: /Supporter/ })).toBeDisabled();
});

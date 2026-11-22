import { expect, test, type Page } from '@playwright/test';
import { collectPageErrors, countGlobalListeners } from './helpers';

// Scenarios on the integration harness page (/_tests/harness, enabled with Docs:EnableTestPages):
// real RizzyUI components, htmx 4 fragments, out-of-band swaps, a 422 validation swap, server
// toasts and repeated replacement of interactive components.

// True when the element, or the first Alpine root inside it, has been initialized by Alpine.
const isAlpineInitialized = (page: Page, selector: string) =>
  page.locator(selector).evaluate(el => {
    const root = el.matches('[x-data]') ? el : el.querySelector('[x-data]');
    return Boolean(root && (root as any)._x_dataStack);
  });

async function openPopover(page: Page) {
  await page.locator('#popover-trigger').click();
  await expect(page.locator('[data-slot="popover-content"]')).toBeVisible();
}

async function openDropdown(page: Page) {
  await page.locator('#dropdown-trigger').click();
  await expect(page.locator('[data-slot="dropdown-menu-content"]')).toBeVisible();
}

test.describe('integration harness', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/_tests/harness');
    await expect.poll(() => page.evaluate(() => typeof (window as any).Rizzy?.toast)).not.toBe('undefined');
  });

  test('a server toast appears, also after the toast provider is replaced by a swap (RM-1.1)', async ({ page }) => {
    const errors = collectPageErrors(page);

    await page.locator('#server-toast').click();
    await expect(page.locator('#toast-region [data-rz-toast-item]', { hasText: 'Server toast' })).toHaveCount(1);

    await page.locator('#replace-toast-region').click();
    await expect(page.locator('#toast-region')).toHaveAttribute('data-round', /^[1-9]/);
    await expect(page.locator('#toast-region [data-rz-toast-item]')).toHaveCount(0);

    await page.locator('#server-toast').click();
    await expect(page.locator('#toast-region [data-rz-toast-item]', { hasText: 'Server toast' })).toHaveCount(1);

    expect(errors).toEqual([]);
  });

  test('htmx content loaded inside a popover and a dropdown menu initializes (RZUI-009)', async ({ page }) => {
    const errors = collectPageErrors(page);

    await openPopover(page);
    await page.locator('#popover-load').click();
    await expect(page.locator('#fragment-popover')).toContainText('Loaded from popover');
    await expect.poll(() => isAlpineInitialized(page, '#fragment-popover')).toBe(true);
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-slot="popover-content"]')).toBeHidden();

    await openDropdown(page);
    await page.locator('#dropdown-load').click();
    await expect(page.locator('#fragment-dropdown')).toContainText('Loaded from dropdown');
    await expect.poll(() => isAlpineInitialized(page, '#fragment-dropdown')).toBe(true);

    expect(errors).toEqual([]);
  });

  test('replacing overlays repeatedly leaks no listeners or teleported panels (RZUI-028)', async ({ page }) => {
    const errors = collectPageErrors(page);

    const cycle = async () => {
      await openPopover(page);
      await page.keyboard.press('Escape');
      await expect(page.locator('[data-slot="popover-content"]')).toBeHidden();
      await openDropdown(page);
      await page.keyboard.press('Escape');
      await expect(page.locator('[data-slot="dropdown-menu-content"]')).toBeHidden();
    };

    const replace = async () => {
      const before = await page.locator('#overlay-region').getAttribute('data-round');
      await page.locator('#replace-overlays').click();
      await expect(page.locator('#overlay-region')).not.toHaveAttribute('data-round', before ?? '');
      await expect.poll(() => isAlpineInitialized(page, '#overlay-region [x-data="rzPopover"]')).toBe(true);
    };

    // Warm up: the first open registers listeners that live for the page (dismissable layer, etc.).
    await replace();
    await cycle();
    const baseline = await countGlobalListeners(page);

    for (let round = 0; round < 5; round++) {
      await replace();
      await cycle();
    }

    expect(await page.locator('[data-slot="popover-content"]').count()).toBe(1);
    expect(await page.locator('[data-slot="dropdown-menu-content"]').count()).toBe(1);
    expect(await countGlobalListeners(page)).toBeLessThanOrEqual(baseline);
    expect(errors).toEqual([]);
  });

  test('an out-of-band swap updates its target and Alpine initializes it', async ({ page }) => {
    const errors = collectPageErrors(page);

    await page.locator('#load-oob').click();
    await expect(page.locator('#oob-main-content')).toHaveText('Main content replaced');
    await expect(page.locator('#oob-target #fragment-oob')).toContainText('Loaded from oob');
    await expect.poll(() => isAlpineInitialized(page, '#fragment-oob')).toBe(true);

    expect(errors).toEqual([]);
  });

  test('a 422 validation response is swapped with errors and the posted values, then saves', async ({ page }) => {
    const errors = collectPageErrors(page);
    const email = page.getByLabel('Email');

    await email.fill('not-an-email');
    const invalid = page.waitForResponse(response => response.url().endsWith('/_tests/form'));
    await page.locator('#harness-form-submit').click();
    expect((await invalid).status()).toBe(422);

    await expect(page.locator('#harness-form-region')).toContainText('Enter a valid email address.');
    await expect(page.getByLabel('Email')).toHaveValue('not-an-email');
    await expect(page.getByLabel('Name')).toHaveValue('Ada');
    // RzFocusFirstInvalid moves focus to the first invalid field (Summit SF-045).
    await expect(page.getByLabel('Email')).toBeFocused();

    await page.getByLabel('Email').fill('ada@example.com');
    const valid = page.waitForResponse(response => response.url().endsWith('/_tests/form'));
    await page.locator('#harness-form-submit').click();
    expect((await valid).status()).toBe(200);
    await expect(page.locator('#harness-form-saved')).toBeVisible();

    // 422 is an expected response here, not an error.
    expect(errors.filter(error => !error.startsWith('HTTP 422'))).toEqual([]);
  });
});

test('warns when the page already has another Alpine instance (RZUI-058)', async ({ page }) => {
  const warnings: string[] = [];
  page.on('console', message => { if (message.type() === 'warning') warnings.push(message.text()); });
  await page.addInitScript(() => { (window as any).Alpine = { notRizzyUI: true }; });

  await page.goto('/_tests/harness');
  await expect.poll(() => page.evaluate(() => typeof (window as any).Rizzy?.toast)).not.toBe('undefined');

  expect(warnings.some(text => text.includes('Another Alpine.js instance is already on the page'))).toBe(true);
  // RizzyUI's Alpine is the one in use.
  expect(await page.evaluate(() => typeof (window as any).Alpine?.start)).toBe('function');
});

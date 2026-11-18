import { expect, test } from '@playwright/test';
import { collectPageErrors } from './helpers';

// RzCalendar renders a container; vanilla-calendar-pro builds the date grid in the browser. These
// checks run on the real component (the first example on the docs page, inside its preview iframe).

test.describe('RzCalendar accessibility', () => {
  test('exposes a labelled date grid with one tab stop and arrow-key navigation', async ({ page }) => {
    const errors = collectPageErrors(page);
    await page.goto('/components/calendar');

    const calendar = page.frameLocator('iframe').first().locator('[data-slot="calendar"]');
    await expect(calendar.getByRole('grid')).toBeVisible();
    await expect(calendar.getByRole('button', { name: 'Previous month' })).toBeVisible();
    await expect(calendar.getByRole('button', { name: 'Next month' })).toBeVisible();
    await expect(calendar.getByRole('columnheader').first()).toBeVisible();

    // Roving tab stop: exactly one day button is in the tab order.
    const dayButtons = calendar.locator('[role="gridcell"] button');
    expect(await dayButtons.count()).toBeGreaterThan(27);
    const tabbable = await dayButtons.evaluateAll(buttons => buttons.filter(b => (b as HTMLElement).tabIndex >= 0).length);
    expect(tabbable).toBe(1);

    // Arrow keys move focus between days.
    const start = calendar.locator('[role="gridcell"] button[tabindex="0"]');
    await start.focus();
    const startLabel = await start.evaluate(el => el.getAttribute('aria-label') ?? el.textContent);
    await page.keyboard.press('ArrowRight');
    const focusedLabel = await calendar.locator('[role="gridcell"] button:focus').evaluate(el => el.getAttribute('aria-label') ?? el.textContent);
    expect(focusedLabel).not.toBe(startLabel);

    expect(errors).toEqual([]);
  });
});

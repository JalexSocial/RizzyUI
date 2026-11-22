import { expect, test } from '@playwright/test';
import { collectPageErrors } from './helpers';

// The docs "Range Popover" example (/components/calendar-more): RzCalendarProvider around an RzPopover
// whose content (teleported to <body>) holds the RzCalendar. Summit SF-057: the calendar's events
// bubbled to <body>, never to the provider, so picking days did nothing.

export function defineCalendarPopoverSpecs(runtime: string) {
  test.describe(`RzCalendar in a popover (${runtime})`, () => {
    test('picking a range in a teleported calendar updates its provider (SF-057)', async ({ page }) => {
      const errors = collectPageErrors(page);
      await page.goto('/components/calendar-more');

      const example = page.locator('div.flex.flex-col.gap-2').filter({ hasText: 'Select your stay' });
      const provider = example.locator('[x-data="rzCalendarProvider"]');
      const trigger = provider.getByRole('button').first();
      await expect(trigger).toBeVisible();
      const before = (await trigger.textContent())!.trim();
      await provider.evaluate(el => {
        (window as any).__rangeComplete = 0;
        el.addEventListener('rz:calendar:range-complete', () => (window as any).__rangeComplete++);
      });

      await trigger.click();
      const dialog = page.locator('[data-slot="popover-content"]').filter({ has: page.locator('[data-slot="calendar"]') }).filter({ visible: true });
      await expect(dialog).toBeVisible();
      const days = dialog.locator('[role="gridcell"] button');
      await days.filter({ hasText: /^10$/ }).first().click();
      await days.filter({ hasText: /^14$/ }).first().click();

      // The provider saw both clicks: it announces the range, the example closes the popover, and the
      // trigger shows the formatted range.
      await expect.poll(() => page.evaluate(() => (window as any).__rangeComplete)).toBe(1);
      await expect(dialog).toBeHidden();
      await expect(trigger).not.toHaveText(before);
      await expect(trigger).toContainText('10');
      expect(errors).toEqual([]);
    });
  });
}

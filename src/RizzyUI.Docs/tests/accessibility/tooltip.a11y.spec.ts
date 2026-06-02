import { expect, test } from '@playwright/test';
import { expectActiveElement, expectAriaRelationship, pressKey, pressTab, runAxeScan } from './helpers/accessibility-helpers';

test.describe('Tooltip accessibility contract', () => {
  test('shows on hover and hides on mouseleave without stealing focus', async ({ page }) => {
    await page.goto('/accessibility-tooltip.html');

    const trigger = page.getByRole('button', { name: 'Focusable tooltip' });
    const content = page.locator('#help-tooltip-content');

    await expect(content).toBeHidden();
    await trigger.hover();
    await expect(content).toBeVisible();
    await expect(content).toHaveAttribute('role', 'tooltip');
    await expect(content).toHaveAttribute('aria-hidden', 'false');

    const activeElementId = await page.evaluate(() => document.activeElement?.id ?? '');
    expect(activeElementId).not.toBe('help-tooltip-content');

    await page.mouse.move(5, 5);
    await expect(content).toBeHidden();
    await expect(content).toHaveAttribute('aria-hidden', 'true');
  });

  test('shows on focus, preserves description relationship, closes on blur and Escape', async ({ page }) => {
    await page.goto('/accessibility-tooltip.html');

    const trigger = page.getByRole('button', { name: 'Focusable tooltip' });
    const content = page.locator('#help-tooltip-content');

    await expectAriaRelationship(trigger, 'aria-describedby', 'help-tooltip-content');
    await expectAriaRelationship(trigger, 'aria-controls', 'help-tooltip-content');
    await expect(content).toHaveAttribute('aria-labelledby', 'help-tooltip-trigger');

    await trigger.focus();
    await expectActiveElement(page, trigger);
    await expect(content).toBeVisible();
    await expect(content).toHaveAttribute('aria-hidden', 'false');

    await pressKey(page, 'Escape');
    await expect(content).toBeHidden();
    await expect(content).toHaveAttribute('aria-hidden', 'true');
    await expectActiveElement(page, trigger);

    await page.getByRole('button', { name: 'After tooltip' }).focus();
    await trigger.focus();
    await expect(content).toBeVisible();
    await page.getByRole('button', { name: 'After tooltip' }).focus();
    await expect(content).toBeHidden();
  });

  test('does not trap focus or move focus into non-interactive content', async ({ page }) => {
    await page.goto('/accessibility-tooltip.html');

    const before = page.getByRole('button', { name: 'Before tooltip' });
    const trigger = page.getByRole('button', { name: 'Focusable tooltip' });
    const after = page.getByRole('button', { name: 'Controlled tooltip' });
    const content = page.locator('#help-tooltip-content');

    await before.focus();
    await pressTab(page);
    await expectActiveElement(page, trigger);
    await expect(content).toBeVisible();

    await pressTab(page);
    await expectActiveElement(page, after);
    await expect(content).toBeHidden();
    await expect(content).not.toHaveAttribute('tabindex', /.+/);
  });

  test('renders controlled open state without creating interactive tooltip semantics', async ({ page }) => {
    await page.goto('/accessibility-tooltip.html');

    const root = page.locator('#controlled-tooltip');
    const trigger = page.getByRole('button', { name: 'Controlled tooltip' });
    const content = page.locator('#controlled-tooltip-content');

    await expect(root).toHaveAttribute('data-open-controlled', 'true');
    await expect(root).toHaveAttribute('data-open', 'true');
    await expect(trigger).toHaveAttribute('data-state', 'open');
    await expect(content).toBeVisible();
    await expect(content).toHaveAttribute('role', 'tooltip');
    await expect(content).toHaveAttribute('aria-hidden', 'false');
    await expect(content).not.toHaveAttribute('aria-modal', /.+/);
  });

  test('has no axe violations', async ({ page }) => {
    await page.goto('/accessibility-tooltip.html');
    await runAxeScan(page);
  });
});

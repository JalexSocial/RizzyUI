import { expect, type Locator, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export async function pressTab(page: Page): Promise<void> {
  await page.keyboard.press('Tab');
}

export async function pressShiftTab(page: Page): Promise<void> {
  await page.keyboard.press('Shift+Tab');
}

export async function pressKey(page: Page, key: 'ArrowDown' | 'ArrowUp' | 'ArrowLeft' | 'ArrowRight' | 'Home' | 'End' | 'Enter' | 'Escape' | 'Space'): Promise<void> {
  await page.keyboard.press(key);
}

export async function expectActiveElement(page: Page, locator: Locator): Promise<void> {
  await expect(locator).toBeFocused();
  const isSameElement = await locator.evaluate((node) => document.activeElement === node);
  expect(isSameElement).toBe(true);
}

export async function expectRoleAndAccessibleName(page: Page, role: Parameters<Page['getByRole']>[0], name: string | RegExp): Promise<Locator> {
  const locator = page.getByRole(role, { name });
  await expect(locator).toBeVisible();
  return locator;
}

export async function expectAriaRelationship(locator: Locator, attributeName: 'aria-controls' | 'aria-labelledby' | 'aria-describedby', expectedValue: string): Promise<void> {
  await expect(locator).toHaveAttribute(attributeName, expectedValue);
}

export async function runAxeScan(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).analyze();
  const violations = results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    description: violation.description,
    nodes: violation.nodes.map((node) => node.target.join(' '))
  }));

  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
}

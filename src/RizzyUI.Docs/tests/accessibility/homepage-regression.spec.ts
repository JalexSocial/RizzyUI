import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

async function loadGeneratedHomepage(page) {
  const homepagePath = resolve(process.cwd(), '../../docs/index.html');
  test.skip(!existsSync(homepagePath), 'Generate the static docs site before running homepage regression tests.');
  const html = await readFile(homepagePath, 'utf8');
  await page.setContent(html, { waitUntil: 'domcontentloaded' });
}

const labeledControlIds = [
  'exp-month',
  'exp-year',
  'same-as-shipping',
  'price-range',
  'input-secure',
  'gpu-count',
  'checkbox-demo',
  'social-media',
  'search-engine',
  'referral',
  'other',
  'tinting',
];

const labelableTags = new Set(['BUTTON', 'INPUT', 'METER', 'OUTPUT', 'PROGRESS', 'SELECT', 'TEXTAREA']);

test('homepage has deterministic labels, valid lists, and SEO metadata', async ({ page }) => {
  await loadGeneratedHomepage(page);

  await expect(page).toHaveTitle(/RizzyUI.+SSR Razor Components/);
  const descriptions = page.locator('meta[name="description"]');
  await expect(descriptions).toHaveCount(1);
  await expect(descriptions).toHaveAttribute('content', /accessible, SSR-only Razor components/);
  await expect(page.getByRole('link', { name: /^Explore$/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Read about RizzyUI interactivity/ })).toBeVisible();

  for (const id of labeledControlIds) {
    const control = page.locator(`#${id}`);
    await expect(control, `${id} control exists`).toHaveCount(1);
    await expect(page.locator(`label[for="${id}"]`), `${id} has one label`).toHaveCount(1);
  }

  await expect(page.locator('label label')).toHaveCount(0);

  const labelFailures = await page.locator('label[for]').evaluateAll((labels) => {
    const labelableTags = new Set(['BUTTON', 'INPUT', 'METER', 'OUTPUT', 'PROGRESS', 'SELECT', 'TEXTAREA']);
    return labels.flatMap((label) => {
      const forValue = label.getAttribute('for')?.trim() ?? '';
      if (!forValue) {
        return ['empty label for'];
      }

      const targets = Array.from(document.querySelectorAll(`#${CSS.escape(forValue)}`));
      if (targets.length !== 1) {
        return [`${forValue} target count ${targets.length}`];
      }

      const target = targets[0];
      if (!labelableTags.has(target.tagName)) {
        return [`${forValue} target ${target.tagName} is not labelable`];
      }

      return [];
    });
  });
  expect(labelFailures).toEqual([]);

  const listFailures = await page.locator('ul').evaluateAll((lists) => lists.flatMap((list) => Array.from(list.children)
    .filter((child) => !['LI', 'SCRIPT', 'TEMPLATE'].includes(child.tagName))
    .map((child) => `${child.tagName} is a direct child of ul`)));
  expect(listFailures).toEqual([]);

  const axe = await new AxeBuilder({ page }).analyze();
  expect(axe.violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')).toEqual([]);
});

test('homepage avoids untouched GitHub avatar requests', async ({ page }) => {
  const requested: string[] = [];
  page.on('request', (request) => requested.push(request.url()));

  await loadGeneratedHomepage(page);
  await page.waitForLoadState('networkidle');

  expect(requested.filter((url) => url.includes('github.com') || url.includes('avatars.githubusercontent.com'))).toEqual([]);
});

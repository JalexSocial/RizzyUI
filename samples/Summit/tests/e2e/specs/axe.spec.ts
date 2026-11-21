import { expect, expectNoAxeViolations, expectNoDanglingAriaReferences, expectUniqueIds, test, waitForRuntime } from '../support/summit';
import { organizerRoutes, publicRoutes } from './routes';

// WCAG 2.2 A/AA on every page, in light mode, plus valid ids and aria references.

test.describe('public pages', () => {
  for (const route of publicRoutes) {
    test(`${route.path} has no accessibility violations @mobile`, async ({ page, summit }) => {
      if (route.path === '/does-not-exist') summit.allowStatus(404);
      await page.goto(route.path);
      await waitForRuntime(page);
      await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeVisible();
      await expectNoAxeViolations(page);
      await expectNoDanglingAriaReferences(page);
      await expectUniqueIds(page);
    });
  }
});

test.describe('organizer pages', () => {
  for (const route of organizerRoutes) {
    test(`${route.path} has no accessibility violations @mobile`, async ({ organizerPage: page }) => {
      await page.goto(route.path);
      await waitForRuntime(page);
      await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeVisible();
      await expectNoAxeViolations(page);
      await expectNoDanglingAriaReferences(page);
      await expectUniqueIds(page);
    });
  }
});

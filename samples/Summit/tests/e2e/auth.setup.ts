import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { expect, test as setup } from '@playwright/test';
import { organizer } from './support/fixtures';

// Signs in as the demo organizer once per server and saves the cookies for the organizer specs.
setup('sign in as the demo organizer', async ({ page, baseURL }, testInfo) => {
  await fetch(new URL('/_test/reset', baseURL!), { method: 'POST' });

  await page.goto('/account/sign-in');
  await page.getByLabel('Email').fill(organizer.email);
  await page.getByLabel('Password').fill(organizer.password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/organizer$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeVisible();

  const storage = testInfo.project.metadata.storage as string;
  mkdirSync(dirname(storage), { recursive: true });
  await page.context().storageState({ path: storage });
});

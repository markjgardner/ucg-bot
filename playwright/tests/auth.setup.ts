import { test as setup, expect } from '@playwright/test';

const authFile = '.auth/user.json';

setup('authenticate', async ({ page }) => {
  var username = process.env.USERNAME || '';
  var password = process.env.PASSWORD || '';
  // Perform authentication steps. Replace these actions with your own.
  await page.goto('https://account.ui.com/login');
  await page.getByLabel('Email or Username').fill(username);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL('https://account.ui.com/');
  
  // End of authentication steps.

  await page.context().storageState({ path: authFile });
});
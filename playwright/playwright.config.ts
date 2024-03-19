import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: false,
  retries: 0,
  workers: 1,
  reporter: 'null',
  use: {},

  projects: [
    {
      name: 'setup', 
      testMatch: /.*\.setup\.ts/,
      use: {
        storageState: '.auth/user.json', 
      }
    },
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: '.auth/user.json', 
      },
      dependencies: ['setup'],
    }
  ],
});

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      },
    },
    {
      name: 'firefox-desktop',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 }
      },
    },
    {
      name: 'webkit-desktop',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 }
      },
    },
    {
      name: 'tablet-ipad',
      use: {
        ...devices['iPad Pro'],
      },
    },
    {
      name: 'tablet-landscape',
      use: {
        ...devices['iPad Pro landscape'],
      },
    },
    {
      name: 'mobile-iphone',
      use: {
        ...devices['iPhone 14 Pro'],
      },
    },
    {
      name: 'mobile-pixel',
      use: {
        ...devices['Pixel 7'],
      },
    },
    {
      name: 'mobile-small',
      use: {
        ...devices['iPhone SE'],
      },
    },
  ],

  webServer: {
    command: 'python3 -m http.server 8080',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});

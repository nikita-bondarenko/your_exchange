import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: process.env.USE_REAL_TELEGRAM !== 'true', // Отключаем параллельность для Telegram Web
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI or when using real Telegram. */
  workers: process.env.CI || process.env.USE_REAL_TELEGRAM === 'true' ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'github' : 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Увеличиваем таймауты для работы с Telegram Web */
    navigationTimeout: process.env.USE_REAL_TELEGRAM === 'true' ? 120000 : 30000, // 2 минуты для Telegram Web
    actionTimeout: process.env.USE_REAL_TELEGRAM === 'true' ? 60000 : 10000, // 1 минута для действий
    testIdAttribute: 'data-testid', // Для лучшей поддержки data-testid
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Telegram Web тестирование */
    {
      name: 'telegram-web',
      use: { 
        ...devices['Desktop Chrome'],
        // Используем реальный Chrome для лучшей совместимости с Telegram Web
        channel: 'chrome',
        // Мобильный viewport для более реалистичного тестирования Mini App
        viewport: { width: 375, height: 667 },
      },
      // Запускаем только тесты, которые используют telegram-web fixture
      testMatch: /.*telegram\.spec\.ts$/,
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});


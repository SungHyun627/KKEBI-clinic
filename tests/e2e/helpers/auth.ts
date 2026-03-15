import type { BrowserContext, Page } from '@playwright/test';

export const withMockedAuthenticatedSession = async (context: BrowserContext, page: Page) => {
  await context.addInitScript(() => {
    window.localStorage.setItem(
      'kkebi-auth-session',
      JSON.stringify({
        email: 'tester@kkebi.com',
        password: 'Password123',
        userName: 'Tester',
        authenticated: true,
      }),
    );
  });

  await page.route('**/api/v1/counselor/auth/refresh', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: { accessToken: 'test-access-token' },
      }),
    });
  });

  await page.route('**/api/v1/notifications/unread/count', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: 0,
      }),
    });
  });
};

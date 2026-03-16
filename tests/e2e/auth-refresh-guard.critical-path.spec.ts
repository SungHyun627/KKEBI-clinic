import { expect, test, type BrowserContext } from '@playwright/test';
import { expectNoServerError } from './helpers/assertions';

const withAuthenticatedSession = async (context: BrowserContext) => {
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
};

test('refresh가 401이면 로그인 페이지로 이동한다', async ({ context, page }) => {
  await withAuthenticatedSession(context);

  await page.route('**/api/v1/counselor/auth/refresh', async (route) => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ success: false, message: 'Unauthorized' }),
    });
  });

  await page.goto('/ko/clients');
  await expect(page).toHaveURL(/\/ko\/login$/);
  await expectNoServerError(page);
});

test('refresh가 500이면 로그인 페이지로 이동한다', async ({ context, page }) => {
  await withAuthenticatedSession(context);

  await page.route('**/api/v1/counselor/auth/refresh', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ success: false, message: 'Server Error' }),
    });
  });

  await page.goto('/ko');
  await expect(page).toHaveURL(/\/ko\/login$/);
  await expectNoServerError(page);
});

test('비인증 상태에서 session 요약 페이지 진입 시 로그인으로 리다이렉트된다', async ({ page }) => {
  await page.goto('/ko/session/1/summary');
  await expect(page).toHaveURL(/\/ko\/login$/);
  await expectNoServerError(page);
});

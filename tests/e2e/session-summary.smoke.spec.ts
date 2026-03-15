import { expect, test } from '@playwright/test';
import { expectNoServerError } from './helpers/assertions';
import { withMockedAuthenticatedSession } from './helpers/auth';

test('세션 요약 페이지 진입 시 500 없이 렌더링된다', async ({ context, page }) => {
  await withMockedAuthenticatedSession(context, page);

  const response = await page.goto('/ko/session/1/summary');
  expect(response?.ok()).toBeTruthy();
  await expectNoServerError(page);

  await expect(page).toHaveURL(/\/ko\/session\/1\/summary$/);
  await expect(page.locator('body')).toBeVisible();
});

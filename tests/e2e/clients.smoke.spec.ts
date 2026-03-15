import { expect, test } from '@playwright/test';
import { expectNoServerError } from './helpers/assertions';
import { withMockedAuthenticatedSession } from './helpers/auth';

test('내담자 목록 페이지 진입 시 500 없이 렌더링된다', async ({ context, page }) => {
  await withMockedAuthenticatedSession(context, page);

  const response = await page.goto('/ko/clients');
  expect(response?.ok()).toBeTruthy();
  await expectNoServerError(page);

  await expect(page).toHaveURL(/\/ko\/clients$/);
  await expect(page.getByRole('link', { name: /내담자|clients/i }).first()).toBeVisible();
});

import { expect, test } from '@playwright/test';
import { expectNoServerError } from './helpers/assertions';
import { withMockedAuthenticatedSession } from './helpers/auth';

test('인증 세션이 있을 때 대시보드에 진입된다', async ({ context, page }) => {
  await withMockedAuthenticatedSession(context, page);

  const response = await page.goto('/ko');
  expect(response?.ok()).toBeTruthy();
  await expectNoServerError(page);

  await expect(page).toHaveURL(/\/ko$/);
  await expect(page.getByRole('link', { name: /대시보드|dashboard/i }).first()).toBeVisible();
});

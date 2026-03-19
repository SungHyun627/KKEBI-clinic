import { expect, test } from '@playwright/test';
import { expectNoServerError } from './helpers/assertions';
import { withMockedAuthenticatedSession } from './helpers/auth';

test('종결 내담자 페이지 진입 시 500 없이 렌더링된다', async ({ context, page }) => {
  await withMockedAuthenticatedSession(context, page);

  await page.goto('/ko/clients/closed');
  await expectNoServerError(page);

  await expect(page).toHaveURL(/\/ko\/clients\/terminated$/);
  await expect(page.getByRole('heading', { name: /종결 상담|closed/i })).toBeVisible();
});

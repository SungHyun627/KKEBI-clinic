import { expect, test } from '@playwright/test';
import { withMockedAuthenticatedSession } from './helpers/auth';
import { expectNoServerError } from './helpers/assertions';

test('인증 세션 기준 핵심 사용자 플로우가 500 없이 동작한다', async ({ context, page }) => {
  await withMockedAuthenticatedSession(context, page);

  await page.goto('/ko');
  await expectNoServerError(page);
  await expect(page).toHaveURL(/\/ko$/);

  await page
    .getByRole('link', { name: /내담자|clients/i })
    .first()
    .click();
  await expectNoServerError(page);
  await expect(page).toHaveURL(/\/ko\/clients$/);

  await page
    .getByRole('link', { name: /세션|sessions/i })
    .first()
    .click();
  await expectNoServerError(page);
  await expect(page).toHaveURL(/\/ko\/sessions$/);

  await page.goto('/ko/session/1/summary');
  await expectNoServerError(page);
  await expect(page).toHaveURL(/\/ko\/session\/1\/summary$/);
  await expect(page.locator('body')).toBeVisible();
});

import { expect, test } from '@playwright/test';
import { expectNoServerError } from './helpers/assertions';
import { withMockedAuthenticatedSession } from './helpers/auth';

test('EN 핵심 경로가 인증 세션에서 500 없이 렌더링된다', async ({ context, page }) => {
  await withMockedAuthenticatedSession(context, page);

  await page.goto('/en');
  await expectNoServerError(page);
  await expect(page).toHaveURL(/\/en$/);

  await page.goto('/en/clients');
  await expectNoServerError(page);
  await expect(page).toHaveURL(/\/en\/clients$/);

  await page.goto('/en/session/1');
  await expectNoServerError(page);
  await expect(page).toHaveURL(/\/en\/session\/1$/);

  await page.goto('/en/session/1/summary');
  await expectNoServerError(page);
  await expect(page).toHaveURL(/\/en\/session\/1\/summary$/);
});

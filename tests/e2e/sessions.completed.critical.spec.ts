import { expect, test } from '@playwright/test';
import { expectNoServerError } from './helpers/assertions';
import { withMockedAuthenticatedSession } from './helpers/auth';

test('완료 세션 탭 직접 진입 시 500 없이 렌더링된다', async ({ context, page }) => {
  await withMockedAuthenticatedSession(context, page);

  await page.goto('/ko/sessions?status=completed');
  await expectNoServerError(page);

  await expect(page).toHaveURL(/\/ko\/sessions\?status=completed$/);
  await expect(page.getByRole('tab', { name: /완료|completed/i })).toBeVisible();
});

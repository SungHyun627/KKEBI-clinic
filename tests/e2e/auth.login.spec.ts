import { expect, test } from '@playwright/test';
import { expectNoServerError } from './helpers/assertions';

test('로그인 페이지가 정상 렌더링된다', async ({ page }) => {
  await page.goto('/ko/login');
  await expectNoServerError(page);

  await expect(page.getByRole('button', { name: /로그인|login/i })).toBeVisible();
  await expect(page.getByLabel(/이메일|email/i)).toBeVisible();
  await expect(page.getByLabel(/비밀번호|password/i)).toBeVisible();
});

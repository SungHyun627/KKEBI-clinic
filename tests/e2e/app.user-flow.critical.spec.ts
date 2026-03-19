import { expect, test } from '@playwright/test';
import { withMockedAuthenticatedSession } from './helpers/auth';
import { captureServerErrorResponses, expectNoServerError } from './helpers/assertions';

test('인증 세션 기준 핵심 사용자 플로우가 500 없이 동작한다', async ({ context, page }) => {
  await withMockedAuthenticatedSession(context, page);
  const serverErrorCapture = captureServerErrorResponses(page);

  try {
    await page.goto('/ko');
    await expectNoServerError(page);
    await expect(page).toHaveURL(/\/ko$/);
    await expect(page.getByText('주간 통계')).toBeVisible();
    await expect(page.getByText('오늘의 일정')).toBeVisible();

    await page
      .getByRole('link', { name: /내담자|clients/i })
      .first()
      .click();
    await expectNoServerError(page);
    await expect(page).toHaveURL(/\/ko\/clients$/);
    await expect(page.getByPlaceholder('내담자 성함을 검색해 보세요.')).toBeVisible();
    await expect(page.getByRole('button', { name: '내담자 등록' })).toBeVisible();

    await page
      .getByRole('link', { name: /세션|sessions/i })
      .first()
      .click();
    await expectNoServerError(page);
    await expect(page).toHaveURL(/\/ko\/sessions$/);
    await expect(page.getByRole('tab', { name: '예정된 상담' })).toBeVisible();
    await expect(page.getByRole('tab', { name: '완료된 상담' })).toBeVisible();

    await page.goto('/ko/session/1');
    await expectNoServerError(page);
    await expect(page).toHaveURL(/\/ko\/session\/1$/);
    await expect(page.getByText('상담 기록')).toBeVisible();

    await page.goto('/ko/session/1/summary');
    await expectNoServerError(page);
    await expect(page).toHaveURL(/\/ko\/session\/1\/summary$/);
    await expect(page.getByText('상담이 완료되었습니다')).toBeVisible();
    await expect(page.getByRole('button', { name: '기록 저장 및 완료' })).toBeVisible();
    serverErrorCapture.assertNoServerErrorResponses();
  } finally {
    serverErrorCapture.dispose();
  }
});

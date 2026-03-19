import { expect, test } from '@playwright/test';
import { withMockedAuthenticatedSession } from './helpers/auth';
import { expectNoServerError } from './helpers/assertions';

test('요약 페이지에서 필수 항목 선택 후 제출이 완료된다', async ({ context, page }) => {
  await withMockedAuthenticatedSession(context, page);

  await page.route(/\/api\/v1\/sessions\/1\/summary$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        message: 'ok',
        data: {
          sessionId: 1,
          endedAt: '2026-03-18T10:00:00.000Z',
          clientName: '홍길동',
          sessionType: '정기',
          riskType: '주의',
          sessionData: {
            clientName: '홍길동',
            sessionType: '정기',
            counselingDate: '2026-03-18',
            riskType: '주의',
          },
          recorderState: {
            elapsedSeconds: 1800,
          },
          summarySnapshot: {
            summaryText: '요약 초안',
            transcript: [],
            bookmarks: [],
            recommendedMissions: [],
            recentEmotionHistory: ['anxious'],
            detectedDistortions: [],
            insights: {
              riskType: '주의',
              distortionType: 'none',
            },
          },
          isSubmitted: false,
        },
      }),
    });
  });

  await page.route(/\/api\/v1\/sessions\/1\/summary\/submit$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        code: 'SUCCESS',
        message: 'saved',
      }),
    });
  });

  await page.goto('/ko/session/1/summary');
  await expectNoServerError(page);
  await expect(page.getByRole('button', { name: '기록 저장 및 완료' })).toBeVisible();

  await page.getByRole('button', { name: '주의' }).click();
  await page.getByRole('button', { name: '2주 이내' }).click();
  await page.getByRole('button', { name: '기록 저장 및 완료' }).click();

  await expect(page).toHaveURL(/\/ko$/);
});

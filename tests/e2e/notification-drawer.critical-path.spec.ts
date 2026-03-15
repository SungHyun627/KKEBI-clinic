import { expect, test } from '@playwright/test';
import { expectNoServerError } from './helpers/assertions';
import { withMockedAuthenticatedSession } from './helpers/auth';

test('알림 드로어에서 미확인 알림 클릭 시 읽음 처리 후 대상 페이지로 이동한다', async ({
  context,
  page,
}) => {
  await withMockedAuthenticatedSession(context, page);

  let markReadCalled = 0;

  await page.route('**/api/v1/notifications', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: [
          {
            id: 101,
            type: 'HIGH_PHQ9',
            title: 'High risk alert',
            message: 'PHQ-9 risk score is high',
            referenceId: 999,
            isRead: false,
            createdAt: '2026-03-15T12:00:00.000Z',
          },
        ],
      }),
    });
  });

  await page.route('**/api/v1/notifications/*/read', async (route) => {
    markReadCalled += 1;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        code: 'SUCCESS',
      }),
    });
  });

  await page.goto('/ko');
  await expectNoServerError(page);

  await page.getByRole('button', { name: /알림|notifications/i }).click();
  await expect(page.getByText(/High risk alert/i)).toBeVisible();
  await expect(page.getByText(/PHQ-9 risk score is high/i)).toBeVisible();

  await page.getByRole('button', { name: /High risk alert/i }).click();
  await expect(page).toHaveURL(/\/ko\/clients\?clientId=999&openAt=\d+/);
  expect(markReadCalled).toBe(1);
});

import { expect, test } from '@playwright/test';
import { expectNoServerError } from './helpers/assertions';
import { withClientRegistrationDraft, withMockedAuthenticatedSession } from './helpers/auth';

test('등록 review 단계에서 제출 성공 시 clients로 이동하고 draft를 제거한다', async ({
  context,
  page,
}) => {
  await withMockedAuthenticatedSession(context, page);
  await withClientRegistrationDraft(context);

  let registerCalled = 0;

  await page.route('**/api/v1/clients', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.continue();
      return;
    }

    registerCalled += 1;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        code: 'SUCCESS',
        message: 'Registered',
        data: 1001,
      }),
    });
  });

  await page.goto('/ko/clients/new/review');
  await expectNoServerError(page);

  await page.getByRole('button', { name: /등록 완료|complete registration/i }).click();
  await expect(page).toHaveURL(/\/ko\/clients$/);
  await expectNoServerError(page);
  expect(registerCalled).toBe(1);

  const draftAfterSubmit = await page.evaluate(() =>
    window.sessionStorage.getItem('kkebi-client-registration-draft-v1'),
  );
  expect(draftAfterSubmit).toBeNull();
});

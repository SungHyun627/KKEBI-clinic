import { expect, test } from '@playwright/test';
import { captureServerErrorResponses, expectNoServerError } from './helpers/assertions';
import { withMockedAuthenticatedSession } from './helpers/auth';

test('EN 핵심 경로가 인증 세션에서 500 없이 렌더링된다', async ({ context, page }) => {
  await withMockedAuthenticatedSession(context, page);
  const serverErrorCapture = captureServerErrorResponses(page);

  try {
    await page.goto('/en');
    await expectNoServerError(page);
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.getByText('Weekly stats')).toBeVisible();
    await expect(page.getByText(/Today.?s schedule/)).toBeVisible();

    await page.goto('/en/clients');
    await expectNoServerError(page);
    await expect(page).toHaveURL(/\/en\/clients$/);
    await expect(page.getByPlaceholder('Search by client name.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Register client' })).toBeVisible();

    await page.goto('/en/session/1');
    await expectNoServerError(page);
    await expect(page).toHaveURL(/\/en\/session\/1$/);
    await expect(page.getByText('Session record')).toBeVisible();

    await page.goto('/en/session/1/summary');
    await expectNoServerError(page);
    await expect(page).toHaveURL(/\/en\/session\/1\/summary$/);
    await expect(page.getByText('Session completed')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save record and complete' })).toBeVisible();
    serverErrorCapture.assertNoServerErrorResponses();
  } finally {
    serverErrorCapture.dispose();
  }
});

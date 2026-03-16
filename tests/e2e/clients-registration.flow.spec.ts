import { expect, test } from '@playwright/test';
import { expectNoServerError } from './helpers/assertions';
import { withClientRegistrationDraft, withMockedAuthenticatedSession } from './helpers/auth';

test('등록 intake 단계에서 다음으로 review 단계로 이동한다', async ({ context, page }) => {
  await withMockedAuthenticatedSession(context, page);
  await withClientRegistrationDraft(context);

  await page.goto('/ko/clients/new/intake');
  await expectNoServerError(page);

  await page
    .getByRole('button', { name: /다음으로|next/i })
    .first()
    .click();
  await expect(page).toHaveURL(/\/ko\/clients\/new\/review$/);
  await expectNoServerError(page);
});

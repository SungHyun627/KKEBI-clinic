import { expect, type Page } from '@playwright/test';

export const expectNoServerError = async (page: Page) => {
  await expect(page.getByText(/internal server error/i)).toHaveCount(0);
  await expect(page.getByText(/application error/i)).toHaveCount(0);
};

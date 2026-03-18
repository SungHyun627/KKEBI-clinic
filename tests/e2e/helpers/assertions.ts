import { expect, type Page, type Response as PlaywrightResponse } from '@playwright/test';

export const expectNoServerError = async (page: Page) => {
  await expect(page.getByText(/internal server error/i)).toHaveCount(0);
  await expect(page.getByText(/application error/i)).toHaveCount(0);
};

interface ServerErrorEntry {
  method: string;
  status: number;
  url: string;
}

interface ServerErrorCapture {
  assertNoServerErrorResponses: () => void;
  dispose: () => void;
}

export const captureServerErrorResponses = (page: Page): ServerErrorCapture => {
  const serverErrors: ServerErrorEntry[] = [];
  const onResponse = (response: PlaywrightResponse) => {
    const status = response.status();
    if (status < 500) return;

    const request = response.request();
    serverErrors.push({
      method: request.method(),
      status,
      url: response.url(),
    });
  };

  page.on('response', onResponse);

  return {
    assertNoServerErrorResponses: () => {
      expect(
        serverErrors,
        `unexpected 5xx responses: ${serverErrors
          .map((entry) => `${entry.status} ${entry.method} ${entry.url}`)
          .join(', ')}`,
      ).toEqual([]);
    },
    dispose: () => {
      page.off('response', onResponse);
    },
  };
};

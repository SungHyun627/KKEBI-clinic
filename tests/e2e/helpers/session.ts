import type { BrowserContext, Page } from '@playwright/test';
import { expect } from '@playwright/test';

interface SessionInfoMockOptions {
  sessionId: string;
  clientName?: string;
}

export const withActiveRealtimeRecordingState = async (
  context: BrowserContext,
  sessionId: string,
) => {
  await context.addInitScript(
    ({ id }) => {
      window.sessionStorage.setItem(
        `kkebi:session-auto-record:${id}`,
        JSON.stringify({
          transcriptItems: [],
          bookmarkIds: [],
          bookmarkIdByTranscriptId: {},
          activeSpeaker: 'counselor',
          fastApiSessionId: `fastapi-session-${id}`,
          micPermission: 'granted',
          isRecording: true,
          isPaused: false,
          elapsedSeconds: 5,
          audioLevel: 0,
          demoIndex: 0,
        }),
      );
    },
    { id: sessionId },
  );
};

export const mockSessionInfoRoute = async (
  page: Page,
  { sessionId, clientName = '홍길동' }: SessionInfoMockOptions,
) => {
  await page.route(new RegExp(`/api/v1/sessions/${sessionId}(\\?.*)?$`), async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        code: 'SUCCESS',
        message: 'ok',
        data: {
          scheduledAt: '2026-03-18T09:00:00+09:00',
          clientName,
          sessionNumber: 1,
          sessionType: '정기',
          riskType: '주의',
          contact: '010-0000-0000',
        },
      }),
    });
  });
};

export const expectTranscriptContains = async (page: Page, text: string) => {
  await expect(
    page.locator('.session-transcript-scroll').getByText(text, {
      exact: true,
    }),
  ).toBeVisible();
};

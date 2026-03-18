import { expect, test } from '@playwright/test';
import { withMockedAuthenticatedSession } from './helpers/auth';
import { expectNoServerError } from './helpers/assertions';

test('실시간 세션 SSE 실패 후 재연결 요청이 발생한다', async ({ context, page }) => {
  await withMockedAuthenticatedSession(context, page);
  let streamRequestCount = 0;

  await context.addInitScript(() => {
    window.sessionStorage.setItem(
      'kkebi:session-auto-record:1',
      JSON.stringify({
        transcriptItems: [],
        bookmarkIds: [],
        bookmarkIdByTranscriptId: {},
        activeSpeaker: 'counselor',
        fastApiSessionId: 'fastapi-session-1',
        micPermission: 'granted',
        isRecording: true,
        isPaused: false,
        elapsedSeconds: 5,
        audioLevel: 0,
        demoIndex: 0,
      }),
    );
  });

  await page.route(/\/api\/v1\/sessions\/1(\?.*)?$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        code: 'SUCCESS',
        message: 'ok',
        data: {
          scheduledAt: '2026-03-18T09:00:00+09:00',
          clientName: '홍길동',
          sessionNumber: 1,
          sessionType: '정기',
          riskType: '주의',
          contact: '010-0000-0000',
        },
      }),
    });
  });

  await page.route(/\/api\/v1\/sessions\/1\/insights\/stream(\?.*)?$/, async (route) => {
    streamRequestCount += 1;
    if (streamRequestCount === 1) {
      await route.fulfill({
        status: 500,
        contentType: 'text/plain',
        body: 'stream failed',
      });
      return;
    }

    await route.fulfill({
      status: 200,
      headers: {
        'content-type': 'text/event-stream; charset=utf-8',
        'cache-control': 'no-cache, no-transform',
        connection: 'keep-alive',
      },
      body: [
        'event: transcript',
        'data: {"type":"transcript","transcriptId":9002,"text":"재연결 성공","speaker":"counselor"}',
        '',
        '',
      ].join('\n'),
    });
  });

  await page.goto('/ko/session/1');
  await expectNoServerError(page);
  await expect(page.getByText('상담 기록')).toBeVisible();

  await expect.poll(() => streamRequestCount).toBeGreaterThanOrEqual(2);
});

import { expect, test } from '@playwright/test';
import { withMockedAuthenticatedSession } from './helpers/auth';
import { expectNoServerError } from './helpers/assertions';
import { mockSessionInfoRoute, withActiveRealtimeRecordingState } from './helpers/session';

test('실시간 세션 SSE 실패 후 재연결 요청이 발생한다', async ({ context, page }) => {
  await withMockedAuthenticatedSession(context, page);
  let streamRequestCount = 0;
  await withActiveRealtimeRecordingState(context, '1');
  await mockSessionInfoRoute(page, { sessionId: '1' });

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

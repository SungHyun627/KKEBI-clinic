import { expect, test } from '@playwright/test';
import { withMockedAuthenticatedSession } from './helpers/auth';
import { expectNoServerError } from './helpers/assertions';
import {
  expectTranscriptContains,
  mockSessionInfoRoute,
  withActiveRealtimeRecordingState,
} from './helpers/session';

test('실시간 세션에서 SSE 수신과 Space 단축키 동작이 유지된다', async ({ context, page }) => {
  await withMockedAuthenticatedSession(context, page);
  let hasInsightsStreamRequest = false;
  await withActiveRealtimeRecordingState(context, '1');
  await mockSessionInfoRoute(page, { sessionId: '1' });

  await page.route(/\/api\/v1\/sessions\/1\/insights\/stream(\?.*)?$/, async (route) => {
    hasInsightsStreamRequest = true;
    await route.fulfill({
      status: 200,
      headers: {
        'content-type': 'text/event-stream; charset=utf-8',
        'cache-control': 'no-cache, no-transform',
        connection: 'keep-alive',
      },
      body: [
        'event: transcript',
        'data: {"type":"transcript","transcriptId":9001,"text":"SSE 수신 문장","speaker":"counselor","timestamp":"00:00:03"}',
        '',
        '',
      ].join('\n'),
    });
  });

  await page.goto('/ko/session/1');
  await expectNoServerError(page);
  await expect(page.getByText('상담 기록')).toBeVisible();
  await expect.poll(() => hasInsightsStreamRequest).toBe(true);

  await page.keyboard.press('Space');
  await expectTranscriptContains(page, '녹음된 음성이 없습니다. 발화자 전환을 다시 시도해 주세요.');
});

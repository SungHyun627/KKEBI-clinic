import { getSessionPageMock } from '@/shared/mock/session-page';
import type { SummaryPayload } from '@/features/summary/types/summary';

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function emotionLabelByLocale(
  emotion: 'anxious' | 'sad' | 'angry' | 'happy' | 'calm' | 'fearful',
  locale: string,
) {
  const map = {
    anxious: { ko: '불안', en: 'Anxious' },
    sad: { ko: '슬픔', en: 'Sad' },
    angry: { ko: '분노', en: 'Angry' },
    happy: { ko: '기쁨', en: 'Happy' },
    calm: { ko: '평온', en: 'Calm' },
    fearful: { ko: '두려움', en: 'Fearful' },
  } as const;

  return locale === 'en' ? map[emotion].en : map[emotion].ko;
}

export function getSessionSummaryMock(sessionId: string, locale: string): SummaryPayload {
  const sessionPage = getSessionPageMock(sessionId, locale);
  const seed = hashString(sessionId);
  const endedAt = new Date(Date.now() - (seed % (1000 * 60 * 60 * 48))).toISOString();

  const transcriptItems = sessionPage.autoRecord.transcripts.map((item) => ({
    id: item.id,
    speaker: item.speaker,
    text: item.text,
    timestamp: item.timestamp,
  }));

  const bookmarkIds = sessionPage.autoRecord.transcripts
    .filter((item) => Boolean(item.bookmarked))
    .map((item) => item.id);

  const elapsedSeconds = Math.max(600, transcriptItems.length * 180 + (seed % 240));

  return {
    sessionId,
    endedAt,
    sessionData: {
      clientName: sessionPage.clientName,
      sessionType: sessionPage.sessionType,
      riskType: sessionPage.riskType,
    },
    recorderState: {
      elapsedSeconds,
    },
    summarySnapshot: {
      insights: {
        riskType: sessionPage.insights.riskType,
        keyConcerns: sessionPage.insights.keyConcerns,
        distortionType: sessionPage.insights.distortionType,
      },
      recentEmotionHistory: sessionPage.insights.emotionHistory.map((item) =>
        emotionLabelByLocale(item.emotion, locale),
      ),
      distortionExampleHistory: [sessionPage.insights.distortionExample],
    },
    runtime: {
      transcriptItems,
      bookmarkIds,
    },
  };
}

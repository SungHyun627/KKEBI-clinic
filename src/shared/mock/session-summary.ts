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

function distortionLabelByLocale(distortionType: string, locale: string) {
  const map: Record<string, { ko: string; en: string }> = {
    black_and_white: { ko: '흑백논리', en: 'Black-and-white' },
    overgeneralization: { ko: '과잉일반화', en: 'Overgeneralization' },
    catastrophizing: { ko: '파국화', en: 'Catastrophizing' },
    should_statement: { ko: '당위적 사고', en: 'Should statement' },
  };

  const label = map[distortionType];
  if (!label) return locale === 'en' ? 'Not detected' : '미감지';
  return locale === 'en' ? label.en : label.ko;
}

export function getSessionSummaryMock(sessionId: string, locale: string): SummaryPayload {
  const sessionPage = getSessionPageMock(sessionId, locale);
  const seed = hashString(sessionId);
  const endedAt = new Date(Date.now() - (seed % (1000 * 60 * 60 * 48))).toISOString();

  const baseTranscriptItems = sessionPage.autoRecord.transcripts.map((item) => ({
    id: item.id,
    speaker: item.speaker,
    text: item.text,
    timestamp: item.timestamp,
  }));

  const transcriptItems = [...baseTranscriptItems];
  while (transcriptItems.length < 6) {
    const idx = transcriptItems.length % baseTranscriptItems.length;
    const source = baseTranscriptItems[idx];
    transcriptItems.push({
      id: `${sessionId}-summary-line-${transcriptItems.length + 1}`,
      speaker: source.speaker,
      text: source.text,
      timestamp: source.timestamp,
    });
  }

  const bookmarkIds = transcriptItems
    .slice(0, 5)
    .map((item) => item.id ?? '')
    .filter(Boolean);

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
      recentCognitiveDistortions: [
        distortionLabelByLocale(sessionPage.insights.distortionType, locale),
      ],
      distortionExampleHistory: [sessionPage.insights.distortionExample],
    },
    runtime: {
      transcriptItems,
      bookmarkIds,
    },
  };
}

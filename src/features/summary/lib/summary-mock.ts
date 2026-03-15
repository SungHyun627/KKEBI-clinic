import { getSessionPageMock } from '@/shared/mock/session-page';
import type { SummaryPayload } from '@/entities/summary/model/types';

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function emotionLabelByLocale(emotion: string, locale: string) {
  const map: Record<string, { ko: string; en: string }> = {
    anxious: { ko: '불안', en: 'Anxious' },
    sad: { ko: '슬픔', en: 'Sad' },
    angry: { ko: '분노', en: 'Angry' },
    happy: { ko: '기쁨', en: 'Happy' },
    calm: { ko: '평온', en: 'Calm' },
    fearful: { ko: '두려움', en: 'Fearful' },
  };

  const label = map[emotion];
  if (!label) return emotion;
  return locale === 'en' ? label.en : label.ko;
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

export function getSessionSummaryMock(sessionId: number, locale: string): SummaryPayload {
  const idText = String(sessionId);
  const sessionPage = getSessionPageMock(idText, locale);
  const seed = hashString(idText);
  const endedAt = new Date(Date.now() - (seed % (1000 * 60 * 60 * 48))).toISOString();

  const baseTranscriptItems = sessionPage.autoRecord.transcripts.map((item) => ({
    id: Number(item.id),
    speaker: item.speaker,
    text: item.text,
    timestamp: item.timestamp,
  }));

  const transcriptItems = [...baseTranscriptItems];
  while (transcriptItems.length < 6) {
    const idx = transcriptItems.length % baseTranscriptItems.length;
    const source = baseTranscriptItems[idx];
    transcriptItems.push({
      id: sessionId * 100 + transcriptItems.length + 1,
      speaker: source.speaker,
      text: source.text,
      timestamp: source.timestamp,
    });
  }

  const bookmarkIds = transcriptItems
    .slice(0, 5)
    .map((item) => Number(item.id))
    .filter((id) => Number.isFinite(id));

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
      emotionPatterns: sessionPage.insights.emotionHistory.map((item) =>
        emotionLabelByLocale(item.emotion, locale),
      ),
      detectedDistortions: [distortionLabelByLocale(sessionPage.insights.distortionType, locale)],
      transcript: transcriptItems.map((item) => ({
        id: Number(item.id),
        speaker: item.speaker,
        text: item.text,
        timestamp: item.timestamp,
      })),
      bookmarks: bookmarkIds.map((id, index) => ({
        id: Number(id),
        targetText: transcriptItems[index]?.text ?? '',
        memo: distortionLabelByLocale(sessionPage.insights.distortionType, locale),
        timeOffset: 60 * (index + 1),
      })),
      summaryText: sessionPage.autoRecord.liveSummaryBody,
    },
  };
}

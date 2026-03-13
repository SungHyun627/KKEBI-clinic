import { TODAY_SCHEDULES_MOCK } from '@/shared/mock/today-schedules';
import { getClientNameByLocale } from '@/shared/lib/clientNameByLocale';
import type {
  CognitiveDistortionType,
  SessionEmotionType,
  SessionPageViewData,
  SessionTranscriptItem,
} from '@/features/session/types/session';

const EMOTIONS: SessionEmotionType[] = ['anxious', 'sad', 'angry', 'happy', 'calm', 'fearful'];
const DISTORTIONS: CognitiveDistortionType[] = [
  'catastrophizing',
  'should_statement',
  'black_and_white',
  'overgeneralization',
];

const KO_TRANSCRIPTS: string[] = [
  '최근 업무 압박 때문에 잠들기 전에 계속 생각이 많아져요.',
  '밤에 누우면 심장이 빨리 뛰고 불안이 커지는 느낌이 듭니다.',
  '오늘은 그 불안이 10점 만점에 7점 정도였어요.',
  '이럴 때 몸이 어떻게 반응하는지 같이 기록해보면 좋겠습니다.',
];

const EN_TRANSCRIPTS: string[] = [
  'Work pressure keeps my mind racing before I sleep.',
  'When I lie down, my heart beats fast and anxiety grows.',
  'Today that anxiety felt like a 7 out of 10.',
  'Let us track how your body responds in those moments.',
];

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
};

const findScheduleSourceFromSessionId = (sessionId: string) => {
  const matchedByScheduleId = TODAY_SCHEDULES_MOCK.find((item) => {
    return (
      sessionId.includes(item.id) ||
      sessionId.includes(`scheduled-${item.id}`) ||
      sessionId.includes(`completed-${item.id}`)
    );
  });

  if (matchedByScheduleId) return matchedByScheduleId;

  const matchedByClientId = TODAY_SCHEDULES_MOCK.find((item) => sessionId.includes(item.clientId));
  if (matchedByClientId) return matchedByClientId;

  return null;
};

export const getSessionPageMock = (sessionId: string, locale: string): SessionPageViewData => {
  const resolvedSource = findScheduleSourceFromSessionId(sessionId);
  const source =
    resolvedSource ?? TODAY_SCHEDULES_MOCK[hashString(sessionId) % TODAY_SCHEDULES_MOCK.length];
  const index = TODAY_SCHEDULES_MOCK.findIndex((item) => item.id === source.id);
  const normalizedIndex = index >= 0 ? index : hashString(sessionId) % TODAY_SCHEDULES_MOCK.length;
  const clientName = getClientNameByLocale(source.clientId, source.clientName, locale);
  const emotion = EMOTIONS[normalizedIndex % EMOTIONS.length];
  const distortionType = DISTORTIONS[normalizedIndex % DISTORTIONS.length];
  const transcriptSource = locale === 'en' ? EN_TRANSCRIPTS : KO_TRANSCRIPTS;

  const transcripts: SessionTranscriptItem[] = transcriptSource.map((text, i) => ({
    id: `${sessionId}-line-${i + 1}`,
    speaker: i % 2 === 0 ? 'client' : 'counselor',
    text,
    timestamp: `00:${String(12 + i * 6).padStart(2, '0')}`,
    bookmarked: i === 1,
  }));

  return {
    sessionId,
    clientId: source.clientId,
    clientName,
    sessionType: source.sessionType,
    riskType: source.riskType,
    scheduledAt: new Date().toISOString(),
    sessionNumber: normalizedIndex + 1,
    contact: '',
    insights: {
      currentEmotion: emotion,
      confidence: 78 + (normalizedIndex % 18),
      emotionHistory: [0, 3, 7].map((minutesAgo, offset) => ({
        minutesAgo,
        emotion: EMOTIONS[(normalizedIndex + offset) % EMOTIONS.length],
      })),
      phq9Score: 12 + (normalizedIndex % 10),
      riskType: source.riskType,
      recentEmotionPattern:
        locale === 'en' ? 'Anxiety rises in late evening' : '늦은 저녁 시간대 불안 상승',
      keyConcerns:
        locale === 'en' ? ['Work stress', 'Sleep decline'] : ['업무 스트레스', '수면 저하'],
      distortionType,
      distortionExample:
        locale === 'en'
          ? 'If this fails again, everything will collapse.'
          : '이번에도 실패하면 모든 게 무너질 것 같아요.',
    },
    autoRecord: {
      transcripts,
      liveSummaryTitle:
        locale === 'en' ? 'Anxiety and sleep issue discussion' : '불안 및 수면 이슈 논의',
      liveSummaryBody:
        locale === 'en'
          ? 'Client reports recurring anxiety before sleep and reduced recovery.'
          : '내담자는 수면 전 반복되는 불안과 회복 저하를 보고함.',
      counselorMemo:
        locale === 'en'
          ? 'Track evening rumination triggers and breathing routine adherence.'
          : '저녁 반추 유발 요인과 호흡 루틴 실천 여부를 추적.',
    },
  };
};

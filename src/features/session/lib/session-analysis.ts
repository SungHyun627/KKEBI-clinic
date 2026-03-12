import type {
  SessionAutoRecordData,
  SessionEmotionType,
  SessionInsightsData,
} from '../types/session';

export type SummaryTopicKey = 'workStress' | 'sleepIssues' | 'selfCriticism' | 'safetyConcerns';

export interface LiveSummaryAnalysis {
  clientTurnCount: number;
  topicKeys: SummaryTopicKey[];
  recentFocus: string;
  currentEmotion: SessionEmotionType;
  distortionType: SessionInsightsData['distortionType'];
  riskCount: number;
}

function normalizeTranscriptText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function isLikelyNoiseUtterance(text: string): boolean {
  const normalized = normalizeTranscriptText(text);
  if (!normalized) return true;

  const lowered = normalized.toLowerCase();
  if (
    /analyzing .*speech|transcription failed|no audio captured|분석 중|다시 시도해 주세요|녹음된 음성이 없습니다/.test(
      lowered,
    )
  ) {
    return true;
  }

  const compact = normalized.replace(/\s+/g, '');
  const meaningfulCharCount = compact.match(/[가-힣a-zA-Z0-9]/g)?.length ?? 0;
  if (meaningfulCharCount < 4) return true;

  const meaningfulRatio = meaningfulCharCount / compact.length;
  return meaningfulRatio < 0.45;
}

function toAnalyzableClientTexts(transcripts: SessionAutoRecordData['transcripts']): string[] {
  return transcripts
    .filter((line) => line.speaker === 'client')
    .map((line) => normalizeTranscriptText(line.text))
    .filter((text) => !isLikelyNoiseUtterance(text));
}

export function formatTimestampToHms(value: string): string {
  const parts = value.split(':');
  if (parts.length === 3) return value;
  if (parts.length === 2) return `${value}:00`;
  return value;
}

export function formatElapsedToTimestamp(seconds: number): string {
  const hh = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

function detectEmotionFromText(text: string): SessionInsightsData['currentEmotion'] {
  const lower = text.toLowerCase();
  const rules: Array<{ emotion: SessionInsightsData['currentEmotion']; keywords: string[] }> = [
    {
      emotion: 'anxious',
      keywords: [
        '불안',
        '초조',
        '긴장',
        '걱정',
        '힘들',
        '버겁',
        'anxious',
        'anxiety',
        'nervous',
        'worried',
        'stress',
        'hard',
        'overwhelmed',
      ],
    },
    {
      emotion: 'sad',
      keywords: ['슬프', '우울', '지쳤', '무기력', 'sad', 'depressed', 'tired', 'exhausted'],
    },
    { emotion: 'angry', keywords: ['화나', '분노', '짜증', 'angry', 'furious', 'irritated'] },
    { emotion: 'fearful', keywords: ['무섭', '두렵', 'fear', 'afraid', 'scared'] },
    { emotion: 'happy', keywords: ['기뻐', '좋아', 'happy', 'glad', 'relieved'] },
  ];

  const matched = rules.find((rule) => rule.keywords.some((keyword) => lower.includes(keyword)));
  return matched?.emotion ?? 'calm';
}

function detectDistortionType(texts: string[]): SessionInsightsData['distortionType'] {
  const joined = texts.join(' ').toLowerCase();
  if (/항상|절대|완전히|전혀|always|never|completely/.test(joined)) return 'black_and_white';
  if (/매번|언제나|모든 사람|아무도|every time|everyone|no one/.test(joined))
    return 'overgeneralization';
  if (/최악|끔찍|망했|재앙|worst|disaster|ruined/.test(joined)) return 'catastrophizing';
  return 'should_statement';
}

export function analyzeLiveSummary(
  transcripts: SessionAutoRecordData['transcripts'],
): LiveSummaryAnalysis | null {
  if (transcripts.length === 0) return null;

  const clientTexts = toAnalyzableClientTexts(transcripts);
  if (clientTexts.length < 2 || transcripts.length < 4) return null;

  const fullText = clientTexts.join(' ').toLowerCase();
  const topicPool: Array<{ key: SummaryTopicKey; test: RegExp }> = [
    { key: 'workStress', test: /회사|업무|상사|보고서|work|boss|report|deadline/ },
    { key: 'sleepIssues', test: /잠|수면|sleep|insomnia/ },
    { key: 'selfCriticism', test: /실패|망했|완전히|failure|worthless|ruined/ },
    { key: 'safetyConcerns', test: /자해|자살|죽고 싶|포기|self-harm|suicide|want to die|give up/ },
  ];
  const topicKeys = topicPool.filter((item) => item.test.test(fullText)).map((item) => item.key);

  const trim = (text: string) => (text.length > 34 ? `${text.slice(0, 34)}...` : text);
  const recentFocus = clientTexts.slice(-2).map(trim).join(' / ');

  const resolvedEmotions = clientTexts.map((text, index) => {
    const detected = detectEmotionFromText(text);
    if (detected !== 'calm') return detected;
    const prev = clientTexts
      .slice(0, index)
      .map((item) => detectEmotionFromText(item))
      .reverse()
      .find((emotion) => emotion !== 'calm');
    return prev ?? 'calm';
  });
  const currentEmotion = resolvedEmotions[resolvedEmotions.length - 1] ?? 'calm';

  const distortionType = detectDistortionType(clientTexts);

  const riskCount =
    fullText.match(/자해|자살|죽고 싶|포기|self-harm|suicide|want to die|give up/g)?.length ?? 0;

  return {
    clientTurnCount: clientTexts.length,
    topicKeys,
    recentFocus,
    currentEmotion,
    distortionType,
    riskCount,
  };
}

export function buildLiveInsights(
  base: SessionInsightsData,
  transcripts: SessionAutoRecordData['transcripts'],
  locale: string,
): SessionInsightsData | null {
  if (transcripts.length === 0) return null;

  const clientLines = transcripts.filter((line) => line.speaker === 'client');
  if (clientLines.length === 0) return null;
  const sanitizedClientTexts = toAnalyzableClientTexts(transcripts);
  const texts =
    sanitizedClientTexts.length > 0 ? sanitizedClientTexts : clientLines.map((line) => line.text);
  const fullText = texts.join(' ').toLowerCase();

  const resolvedEmotions: SessionEmotionType[] = texts.map((text, index) => {
    const detected = detectEmotionFromText(text);
    if (detected !== 'calm') return detected;
    const previousDetected = texts
      .slice(0, index)
      .map((prev) => detectEmotionFromText(prev))
      .reverse()
      .find((emotion) => emotion !== 'calm');
    return previousDetected ?? 'calm';
  });
  let currentEmotion: SessionEmotionType = resolvedEmotions[resolvedEmotions.length - 1] ?? 'calm';
  const confidence = Math.max(62, Math.min(96, 68 + Math.min(texts.length, 6) * 4));

  const riskHits = (
    fullText.match(/자해|자살|죽고 싶|포기|self-harm|suicide|give up|want to die/g) ?? []
  ).length;
  if (riskHits >= 2) {
    currentEmotion = 'fearful';
  } else if (currentEmotion === 'calm' && riskHits > 0) {
    currentEmotion = 'anxious';
  }
  if (resolvedEmotions.length > 0) {
    resolvedEmotions[resolvedEmotions.length - 1] = currentEmotion;
  }
  const riskType = riskHits >= 2 ? '위험' : riskHits >= 1 ? '주의' : '안정';
  const phq9Score = riskType === '위험' ? 19 : riskType === '주의' ? 13 : 7;

  const rawEmotionHistory: SessionEmotionType[] = resolvedEmotions.slice(-3);
  const dedupedEmotionHistory = rawEmotionHistory.filter(
    (emotion, idx, arr) => idx === 0 || emotion !== arr[idx - 1],
  );
  const emotionHistory = dedupedEmotionHistory.map((emotion, idx) => ({
    emotion,
    minutesAgo: (dedupedEmotionHistory.length - 1 - idx) * 3,
  }));

  const distortionType = detectDistortionType(texts);
  const distortionPatternMap: Record<SessionInsightsData['distortionType'], RegExp> = {
    black_and_white: /항상|절대|완전히|전혀|always|never|completely/,
    overgeneralization: /매번|언제나|모든 사람|아무도|every time|everyone|no one/,
    catastrophizing: /최악|끔찍|망했|재앙|worst|disaster|ruined/,
    should_statement: /해야 해|하면 안 돼|should|must|have to/,
    none: /a^/,
  };
  const distortionPattern = distortionPatternMap[distortionType];
  const distortionExample =
    texts
      .slice()
      .reverse()
      .find((line) => distortionPattern.test(line.toLowerCase())) ?? base.distortionExample;

  const concernsPool: Array<{ key: string; ko: string; en: string; test: RegExp }> = [
    {
      key: 'work',
      ko: '업무 스트레스',
      en: 'Work stress',
      test: /회사|업무|상사|work|boss|report/,
    },
    { key: 'sleep', ko: '수면 저하', en: 'Sleep decline', test: /잠|수면|sleep|insomnia/ },
    {
      key: 'safety',
      ko: '안전 위험',
      en: 'Safety risk',
      test: /자해|자살|죽고 싶|self-harm|suicide/,
    },
    { key: 'self', ko: '자기비난', en: 'Self-criticism', test: /실패|망했|failure|worthless/ },
  ];
  const keyConcerns = concernsPool
    .filter((item) => item.test.test(fullText))
    .map((item) => (locale === 'en' ? item.en : item.ko));

  return {
    ...base,
    currentEmotion,
    confidence,
    emotionHistory: emotionHistory.length > 0 ? emotionHistory : base.emotionHistory,
    phq9Score,
    riskType,
    recentEmotionPattern:
      locale === 'en'
        ? `Latest trend: ${currentEmotion} response is dominant`
        : `최근 패턴: ${
            currentEmotion === 'anxious'
              ? '불안'
              : currentEmotion === 'sad'
                ? '슬픔'
                : currentEmotion === 'angry'
                  ? '분노'
                  : currentEmotion === 'fearful'
                    ? '두려움'
                    : currentEmotion === 'happy'
                      ? '기쁨'
                      : '평온'
          } 반응이 우세`,
    keyConcerns: keyConcerns.length > 0 ? keyConcerns : base.keyConcerns,
    distortionType,
    distortionExample,
  };
}

import type {
  SessionAutoRecordData,
  SessionEmotionType,
  SessionInsightsData,
} from '../types/session-page';

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

export function buildLiveSummary(
  transcripts: SessionAutoRecordData['transcripts'],
  locale: string,
  fallbackTitle: string,
  fallbackBody: string,
) {
  if (transcripts.length === 0) return { title: '', body: '' };

  const clientLines = transcripts.filter((line) => line.speaker === 'client');
  const clientTexts = clientLines.map((line) => line.text);
  if (clientTexts.length < 2 || transcripts.length < 4) return { title: '', body: '' };

  const fullText = clientTexts.join(' ').toLowerCase();
  const topicPool =
    locale === 'en'
      ? [
          { label: 'work stress', test: /work|boss|report|deadline/ },
          { label: 'sleep issues', test: /sleep|insomnia/ },
          { label: 'self-criticism', test: /failure|worthless|ruined/ },
          { label: 'safety concerns', test: /self-harm|suicide|want to die|give up/ },
        ]
      : [
          { label: '업무 스트레스', test: /회사|업무|상사|보고서/ },
          { label: '수면 문제', test: /잠|수면/ },
          { label: '자기비난', test: /실패|망했|완전히/ },
          { label: '안전 위험', test: /자해|자살|죽고 싶|포기/ },
        ];
  const topics = topicPool.filter((item) => item.test.test(fullText)).map((item) => item.label);
  const topicText =
    topics.length > 0
      ? topics.slice(0, 2).join(locale === 'en' ? ' and ' : ' 및 ')
      : locale === 'en'
        ? 'daily stress'
        : '일상 스트레스';

  const trim = (text: string) => (text.length > 34 ? `${text.slice(0, 34)}...` : text);
  const recentFocus = clientTexts
    .slice(-2)
    .map(trim)
    .join(locale === 'en' ? ' / ' : ' / ');

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
  const emotionLabel =
    locale === 'en'
      ? {
          anxious: 'anxious',
          sad: 'sad',
          angry: 'angry',
          happy: 'positive',
          calm: 'calm',
          fearful: 'fearful',
        }[currentEmotion]
      : {
          anxious: '불안',
          sad: '슬픔',
          angry: '분노',
          happy: '긍정',
          calm: '평온',
          fearful: '두려움',
        }[currentEmotion];

  const distortionType = detectDistortionType(clientTexts);
  const distortionLabel =
    locale === 'en'
      ? {
          black_and_white: 'black-and-white thinking',
          overgeneralization: 'overgeneralization',
          catastrophizing: 'catastrophizing',
          should_statement: 'should statements',
        }[distortionType]
      : {
          black_and_white: '흑백논리',
          overgeneralization: '과잉일반화',
          catastrophizing: '파국화',
          should_statement: '당위적 사고',
        }[distortionType];

  const riskCount =
    fullText.match(/자해|자살|죽고 싶|포기|self-harm|suicide|want to die|give up/g)?.length ?? 0;
  const riskSuffix =
    riskCount > 0
      ? locale === 'en'
        ? ` Safety-related wording appeared ${riskCount} time(s).`
        : ` 안전 관련 표현이 ${riskCount}회 확인되었습니다.`
      : '';

  return locale === 'en'
    ? {
        title: fallbackTitle || 'Session summary in progress',
        body:
          `Across ${clientTexts.length} client turns, the session centers on ${topicText}. ` +
          `Recent statements: "${recentFocus}". Current affect is estimated as ${emotionLabel}, ` +
          `with ${distortionLabel} tendencies in the narrative.` +
          riskSuffix,
      }
    : {
        title: fallbackTitle || '상담 요약 업데이트',
        body:
          `내담자 발화 ${clientTexts.length}개를 기준으로 ${topicText} 중심의 상담이 진행되고 있습니다. ` +
            `최근 진술: "${recentFocus}". 현재 정서 반응은 ${emotionLabel}로 해석되며, ` +
            `${distortionLabel} 경향이 함께 관찰됩니다.` +
            riskSuffix || fallbackBody,
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
  const sourceLines = clientLines;
  const texts = sourceLines.map((line) => line.text);
  const fullText = texts.join(' ').toLowerCase();

  const resolvedEmotions: SessionEmotionType[] = sourceLines.map((line, index) => {
    const detected = detectEmotionFromText(line.text);
    if (detected !== 'calm') return detected;
    const previousDetected = sourceLines
      .slice(0, index)
      .map((prev) => detectEmotionFromText(prev.text))
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

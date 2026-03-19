import type { SessionInsightsData, SessionInsightsSsePatch } from '../../model/types';

const parseJsonObject = (value: unknown): Record<string, unknown> | null => {
  if (typeof value === 'object' && value) return value as Record<string, unknown>;
  if (typeof value !== 'string') return null;
  try {
    const parsed = JSON.parse(value) as unknown;
    return typeof parsed === 'object' && parsed ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
};

export const mapEmotionKeyToSessionEmotion = (
  key: string,
): SessionInsightsData['currentEmotion'] | undefined => {
  const normalized = key.toLowerCase();
  if (normalized === 'happy') return 'happy';
  if (normalized === 'sad') return 'sad';
  if (normalized === 'angry') return 'angry';
  if (normalized === 'disgust') return 'disgust';
  if (normalized === 'fear' || normalized === 'feaer' || normalized === 'fearful') return 'fearful';
  if (normalized === 'neutral') return 'calm';
  if (normalized === 'surprise') return 'surprise';
  return undefined;
};

const mapDistortionToType = (value: string): SessionInsightsData['distortionType'] | undefined => {
  const normalized = value.trim().toLowerCase().replace(/\s+/g, '');
  if (normalized === 'black_and_white' || normalized === '흑백논리') return 'black_and_white';
  if (
    normalized === 'overgeneralization' ||
    normalized === '과잉일반화' ||
    normalized === '과일반화' ||
    normalized === '과도한일반화'
  ) {
    return 'overgeneralization';
  }
  if (normalized === 'catastrophizing' || normalized === '파국화') return 'catastrophizing';
  if (
    normalized === 'emotionalreasoning' ||
    normalized === '감정적추론' ||
    normalized === '정서적추론'
  ) {
    return 'catastrophizing';
  }
  if (
    normalized === 'selfdeprecation' ||
    normalized === 'self-criticism' ||
    normalized === '자기비하'
  ) {
    return 'should_statement';
  }
  if (
    normalized === 'none' ||
    normalized === '없음' ||
    normalized === '없다' ||
    normalized === '해당 없음' ||
    normalized === 'no_distortion' ||
    normalized === 'no distortion'
  ) {
    return 'none';
  }
  if (
    normalized === 'should_statement' ||
    normalized === '당위적 사고' ||
    normalized === '당위적사고'
  ) {
    return 'should_statement';
  }
  return undefined;
};

const splitDistortionValues = (value: string) =>
  value
    .split(/[,，/|;]+/g)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

const toFiniteNumber = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
};

const pickNonEmptyString = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed.length > 0) return trimmed;
    }
  }
  return undefined;
};

export const normalizeForSummary = (value: string, maxLength = 50) => {
  const collapsed = value.replace(/\s+/g, ' ').trim();
  if (collapsed.length <= maxLength) return collapsed;
  return `${collapsed.slice(0, maxLength)}...`;
};

export const extractDistortionPatch = (payload: Record<string, unknown>) => {
  const distortionPayload = parseJsonObject(payload.distortion);
  const mappedTypeCandidates = [
    payload.distortionType,
    payload.distortion_type,
    payload.cognitiveDistortionType,
    payload.cognitive_distortion_type,
    distortionPayload?.distortionType,
    distortionPayload?.distortion_type,
    distortionPayload?.type,
    distortionPayload?.distortion,
  ]
    .filter((item): item is string => typeof item === 'string')
    .flatMap((item) => splitDistortionValues(item))
    .map((item) => mapDistortionToType(item))
    .filter((item): item is SessionInsightsData['distortionType'] => Boolean(item));

  const distortionType =
    mappedTypeCandidates.find((item) => item !== 'none') ?? mappedTypeCandidates[0];
  const distortionSummary = pickNonEmptyString(
    payload.distortionSummary,
    payload.distortion_summary,
    payload.cognitiveDistortionSummary,
    payload.cognitive_distortion_summary,
    payload.distortionExample,
    payload.distortion_example,
    distortionPayload?.summary,
    distortionPayload?.distortionSummary,
    distortionPayload?.distortion_summary,
    distortionPayload?.cognitiveDistortionSummary,
    distortionPayload?.cognitive_distortion_summary,
    distortionPayload?.example,
    distortionPayload?.distortionExample,
    distortionPayload?.distortion_example,
    distortionPayload?.detail,
  );

  return {
    distortionType,
    distortionSummary,
  };
};

export const extractPhq9ScoreFromPayload = (payload: Record<string, unknown>) => {
  const directCandidates = [
    payload.phq9Score,
    payload.phq9,
    payload.phqScore,
    payload.phq,
    payload.phq_9,
    payload.phq9_score,
  ];

  for (const candidate of directCandidates) {
    const parsed = toFiniteNumber(candidate);
    if (typeof parsed === 'number') {
      const rounded = Math.round(parsed);
      if (rounded >= 0 && rounded <= 27) return rounded;
    }
  }

  const nestedPhq =
    typeof payload.phq9 === 'object' && payload.phq9
      ? (payload.phq9 as Record<string, unknown>)
      : null;
  if (nestedPhq) {
    const parsed = toFiniteNumber(nestedPhq.score ?? nestedPhq.total ?? nestedPhq.value);
    if (typeof parsed === 'number') {
      const rounded = Math.round(parsed);
      if (rounded >= 0 && rounded <= 27) return rounded;
    }
  }

  return undefined;
};

export const resolveEmotionFromChunkResult = (chunkData?: {
  topEmotion?: string;
  emotionProbs?: Record<string, number>;
}) => {
  if (!chunkData) {
    return { emotion: undefined, confidence: undefined };
  }

  const mappedFromTop = chunkData.topEmotion
    ? mapEmotionKeyToSessionEmotion(chunkData.topEmotion)
    : undefined;
  if (mappedFromTop) {
    const probs = chunkData.emotionProbs && Object.entries(chunkData.emotionProbs);
    const topProb =
      probs && probs.length > 0
        ? probs.reduce((prev, curr) => (curr[1] > prev[1] ? curr : prev))[1]
        : undefined;
    const confidence =
      typeof topProb === 'number'
        ? Math.max(0, Math.min(100, Math.round(topProb <= 1 ? topProb * 100 : topProb)))
        : undefined;
    return { emotion: mappedFromTop, confidence };
  }

  const probs = chunkData.emotionProbs ? Object.entries(chunkData.emotionProbs) : [];
  if (probs.length === 0) {
    return { emotion: undefined, confidence: undefined };
  }

  const topEntry = probs.reduce((prev, curr) => (curr[1] > prev[1] ? curr : prev));
  const mappedFromProb = mapEmotionKeyToSessionEmotion(topEntry[0]);
  if (!mappedFromProb) {
    return { emotion: undefined, confidence: undefined };
  }

  return {
    emotion: mappedFromProb,
    confidence: Math.max(
      0,
      Math.min(100, Math.round(topEntry[1] <= 1 ? topEntry[1] * 100 : topEntry[1])),
    ),
  };
};

export const unwrapStreamData = (input: unknown) => {
  if (typeof input === 'object' && input && 'data' in input) {
    return (input as { data?: unknown }).data ?? input;
  }
  return input;
};

export interface ParsedSessionStreamEvent {
  transcriptUpsert?: {
    transcriptId: number;
    text: string;
    speaker?: 'counselor' | 'client';
    timestamp?: string;
  };
  nextEmotion?: SessionInsightsData['currentEmotion'];
  analysisPatch?: SessionInsightsSsePatch;
}

export const parseSessionStreamEventData = (rawData: unknown): ParsedSessionStreamEvent | null => {
  const payload = unwrapStreamData(rawData);
  if (!payload || typeof payload !== 'object') return null;

  const obj = payload as Record<string, unknown>;
  const rawSpeaker = typeof obj.speaker === 'string' ? obj.speaker.toLowerCase() : undefined;
  const parsedSpeaker: 'counselor' | 'client' | undefined =
    rawSpeaker === 'counselor' || rawSpeaker === 'client' ? rawSpeaker : undefined;

  const transcriptUpsert =
    typeof obj.transcriptId === 'number' && typeof obj.text === 'string'
      ? {
          transcriptId: obj.transcriptId,
          text: obj.text,
          speaker: parsedSpeaker,
          timestamp: typeof obj.timestamp === 'string' ? obj.timestamp : undefined,
        }
      : undefined;

  const eventEmotion = pickNonEmptyString(
    obj.currentEmotion,
    obj.current_emotion,
    obj.emotion,
    obj.emotionType,
    obj.emotion_type,
    obj.topEmotion,
    obj.top_emotion,
  );
  const mappedEventEmotion = eventEmotion ? mapEmotionKeyToSessionEmotion(eventEmotion) : undefined;
  const nextPhq9Score = extractPhq9ScoreFromPayload(obj);
  const { distortionType, distortionSummary } = extractDistortionPatch(obj);

  const shouldEmitPatch =
    typeof mappedEventEmotion === 'string' ||
    typeof nextPhq9Score === 'number' ||
    typeof distortionType === 'string' ||
    typeof distortionSummary === 'string';
  const analysisPatch = shouldEmitPatch
    ? {
        currentEmotion: mappedEventEmotion,
        phq9Score: nextPhq9Score,
        distortionType,
        distortionExample: distortionSummary,
      }
    : undefined;

  return {
    transcriptUpsert,
    nextEmotion: mappedEventEmotion,
    analysisPatch,
  };
};

export interface KeydownShortcutEventLike {
  code?: string;
  key?: string;
  repeat?: boolean;
  isComposing?: boolean;
  target?: Pick<HTMLElement, 'tagName' | 'isContentEditable'> | null;
}

export const shouldTriggerSpeakerSwitchShortcut = (event: KeydownShortcutEventLike) => {
  if (event.isComposing) return false;
  if (event.repeat) return false;
  const tag = event.target?.tagName?.toLowerCase();
  const isEditable =
    tag === 'input' ||
    tag === 'textarea' ||
    tag === 'select' ||
    Boolean(event.target?.isContentEditable);
  if (isEditable) return false;

  return (
    event.code === 'Space' || event.key === ' ' || event.code === 'Enter' || event.key === 'Enter'
  );
};

'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { SessionAutoRecordData, SessionInsightsData } from '../../model/types';
import type { SessionInsightsSsePatch } from '../../model/types';
import { useRecordingController } from '../../hooks/useRecordingController';
import { useTranscriptRuntime } from '../../hooks/useTranscriptRuntime';
import { useSessionInsightsStream } from '../../hooks/useSessionInsightsStream';
import { useAudioChunkUploader } from '../../hooks/useAudioChunkUploader';
import { uploadFullAudioFile } from '../../api/uploadFullAudioFile';
import { setSessionAudioPreviewUrl } from '@/shared/lib/session-audio-preview-cache';
import { formatElapsedToTimestamp, formatTimestampToHms } from '../../model/analysis';
import { useSessionPersistence } from '../../hooks/useSessionPersistence';
import { getSessionAutoRecordStorageKey } from '../../model/storage';
import { renderHighlightedText } from './session-transcript-highlight';
import SessionTranscriptCard from './SessionTranscriptCard';
import SessionLiveSummaryCard from './SessionLiveSummaryCard';
import SessionCounselorMemoCard from './SessionCounselorMemoCard';
import SessionAudioControls from './SessionAudioControls';
import { toast } from '@/shared/ui/toast';
import Image from 'next/image';

type PersistedAutoRecordState = {
  transcriptItems: SessionAutoRecordData['transcripts'];
  bookmarkIds: string[];
  bookmarkIdByTranscriptId: Record<string, number>;
  activeSpeaker: 'counselor' | 'client';
  fastApiSessionId: string | null;
  micPermission: 'idle' | 'requesting' | 'granted' | 'denied';
  isRecording: boolean;
  isPaused: boolean;
  elapsedSeconds: number;
  audioLevel: number;
  demoIndex: number;
};

const formatNowAsLocalDateTime = () => {
  const now = new Date();
  const yyyy = String(now.getFullYear());
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mi = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}`;
};

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

const mapEmotionKeyToSessionEmotion = (
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

const normalizeForSummary = (value: string, maxLength = 50) => {
  const collapsed = value.replace(/\s+/g, ' ').trim();
  if (collapsed.length <= maxLength) return collapsed;
  return `${collapsed.slice(0, maxLength)}...`;
};

const extractDistortionPatch = (payload: Record<string, unknown>) => {
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

const extractPhq9ScoreFromPayload = (payload: Record<string, unknown>) => {
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

const resolveEmotionFromChunkResult = (chunkData?: {
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

interface SessionAutoRecordPanelProps {
  sessionId: string;
  autoRecord: SessionAutoRecordData;
  baseInsights: SessionInsightsData;
  onRecorderStateChange?: (state: {
    isRecording: boolean;
    isPaused: boolean;
    elapsedSeconds: number;
    visibleAudioLevel: number;
  }) => void;
  onRiskSignalDetected?: (payload: { text: string; timestamp: string }) => void;
  onAnalysisChange?: (insights: SessionInsightsSsePatch | null) => void;
  onRegisterPrepareEndSession?: (handler: () => void) => void;
  onRegisterUploadFullAudio?: (handler: () => Promise<boolean>) => void;
}

export default function SessionAutoRecordPanel({
  sessionId,
  onRecorderStateChange,
  onRiskSignalDetected,
  onAnalysisChange,
  onRegisterPrepareEndSession,
  onRegisterUploadFullAudio,
}: SessionAutoRecordPanelProps) {
  const locale = useLocale();
  const tSession = useTranslations('sessionList');
  const [liveEmotion, setLiveEmotion] = useState<SessionInsightsData['currentEmotion'] | null>(
    null,
  );
  const [activeSpeaker, setActiveSpeaker] = useState<'counselor' | 'client'>('counselor');
  const recordedAudioChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const segmentRecorderRef = useRef<MediaRecorder | null>(null);
  const segmentChunksRef = useRef<BlobPart[]>([]);
  const isSwitchingSpeakerRef = useRef(false);
  const {
    micPermission,
    fastApiSessionId,
    isStartingSession,
    isRecording,
    isPaused,
    elapsedSeconds,
    audioLevel,
    visibleAudioLevel,
    handleStartRecording,
    handlePauseResume,
    handlePrepareEndSession,
    setMicPermission,
    setFastApiSessionId,
    setIsRecording,
    setIsPaused,
    setElapsedSeconds,
    setAudioLevel,
  } = useRecordingController({
    sessionId,
  });
  const {
    transcriptItems,
    demoIndex,
    bookmarkIds,
    bookmarkIdByTranscriptId,
    pendingIds,
    addPendingTranscript,
    resolvePendingTranscript,
    toggleBookmark,
    upsertTranscriptFromSse,
    setTranscriptItems,
    setDemoIndex,
    setBookmarkIds,
    setBookmarkIdByTranscriptId,
  } = useTranscriptRuntime({
    sessionId,
    locale,
    elapsedSeconds,
    onRiskSignalDetected,
  });
  const { uploadChunk, lastErrorMessage } = useAudioChunkUploader({
    sessionId,
    fastApiSessionId,
  });

  const snapshot = useMemo<PersistedAutoRecordState>(
    () => ({
      transcriptItems,
      bookmarkIds: Array.from(bookmarkIds),
      bookmarkIdByTranscriptId,
      activeSpeaker,
      fastApiSessionId,
      micPermission,
      isRecording,
      isPaused,
      elapsedSeconds,
      audioLevel,
      demoIndex,
    }),
    [
      audioLevel,
      bookmarkIds,
      bookmarkIdByTranscriptId,
      activeSpeaker,
      demoIndex,
      elapsedSeconds,
      fastApiSessionId,
      isPaused,
      isRecording,
      micPermission,
      transcriptItems,
    ],
  );

  const hydrate = useCallback(
    (parsed: PersistedAutoRecordState) => {
      setTranscriptItems(parsed.transcriptItems ?? []);
      setBookmarkIds(new Set(parsed.bookmarkIds ?? []));
      setBookmarkIdByTranscriptId(parsed.bookmarkIdByTranscriptId ?? {});
      setActiveSpeaker(parsed.activeSpeaker ?? 'counselor');
      const restoredFastApiSessionId = parsed.fastApiSessionId ?? null;
      setFastApiSessionId(restoredFastApiSessionId);
      setMicPermission(parsed.micPermission ?? 'idle');
      setIsRecording(Boolean(parsed.isRecording) && Boolean(restoredFastApiSessionId));
      setIsPaused(Boolean(parsed.isPaused) && Boolean(restoredFastApiSessionId));
      setElapsedSeconds(parsed.elapsedSeconds ?? 0);
      setAudioLevel(parsed.audioLevel ?? 0);
      setDemoIndex(parsed.demoIndex ?? 0);
    },
    [
      setAudioLevel,
      setBookmarkIds,
      setBookmarkIdByTranscriptId,
      setDemoIndex,
      setElapsedSeconds,
      setFastApiSessionId,
      setIsPaused,
      setIsRecording,
      setMicPermission,
      setTranscriptItems,
    ],
  );

  useSessionPersistence<PersistedAutoRecordState>({
    storageKey: getSessionAutoRecordStorageKey(sessionId),
    snapshot,
    hydrate,
  });

  // Extract nested data envelope if SSE payload shape is { code, message, data }
  const unwrapStreamData = useCallback((input: unknown) => {
    if (typeof input === 'object' && input && 'data' in input) {
      return (input as { data?: unknown }).data ?? input;
    }
    return input;
  }, []);

  // Parse SSE events to transcript/summary/insights targets
  const handleStreamEvent = useCallback(
    (event: { type: string; data: unknown }) => {
      const payload = unwrapStreamData(event.data);
      if (!payload || typeof payload !== 'object') return;
      const obj = payload as Record<string, unknown>;
      const rawSpeaker = typeof obj.speaker === 'string' ? obj.speaker.toLowerCase() : undefined;

      // Transcript event: append or patch transcript row
      if (typeof obj.transcriptId === 'number' && typeof obj.text === 'string') {
        upsertTranscriptFromSse({
          transcriptId: obj.transcriptId,
          text: obj.text,
          speaker: rawSpeaker === 'counselor' || rawSpeaker === 'client' ? rawSpeaker : undefined,
          timestamp: typeof obj.timestamp === 'string' ? obj.timestamp : undefined,
        });
      }

      const eventEmotion = pickNonEmptyString(
        obj.currentEmotion,
        obj.current_emotion,
        obj.emotion,
        obj.emotionType,
        obj.emotion_type,
        obj.topEmotion,
        obj.top_emotion,
      );
      const mappedEventEmotion = eventEmotion
        ? mapEmotionKeyToSessionEmotion(eventEmotion)
        : undefined;
      if (mappedEventEmotion) {
        setLiveEmotion(mappedEventEmotion);
      }

      // Insights event: PHQ-9/인지왜곡은 SSE 기준으로 반영
      const nextPhq9Score = extractPhq9ScoreFromPayload(obj);
      const { distortionType, distortionSummary } = extractDistortionPatch(obj);

      if (
        typeof mappedEventEmotion === 'string' ||
        typeof nextPhq9Score === 'number' ||
        typeof distortionType === 'string' ||
        typeof distortionSummary === 'string'
      ) {
        onAnalysisChange?.({
          currentEmotion: mappedEventEmotion,
          phq9Score: nextPhq9Score,
          distortionType,
          distortionExample: distortionSummary,
        });
      }
    },
    [onAnalysisChange, unwrapStreamData, upsertTranscriptFromSse],
  );

  // Subscribe to SSE after recording starts
  useSessionInsightsStream({
    sessionId,
    enabled: isRecording && !isPaused,
    onEvent: handleStreamEvent,
  });

  useEffect(() => {
    if (!isRecording) {
      setLiveEmotion(null);
    }
  }, [isRecording]);

  const getSpeakerLabel = useCallback(
    (speaker: 'counselor' | 'client') =>
      speaker === 'counselor' ? tSession('speakerCounselorLower') : tSession('speakerClientLower'),
    [tSession],
  );

  const getEmotionLabel = useCallback(
    (emotion: SessionInsightsData['currentEmotion'] | null) => {
      if (!emotion) return tSession('emotionAnalyzing');
      return tSession(
        (
          {
            anxious: 'insightsEmotionAnxiousLower',
            sad: 'insightsEmotionSadLower',
            angry: 'insightsEmotionAngryLower',
            happy: 'insightsEmotionHappyLower',
            surprise: 'insightsEmotionSurpriseLower',
            calm: 'insightsEmotionCalmLower',
            fearful: 'insightsEmotionFearfulLower',
            disgust: 'insightsEmotionDisgustLower',
          } as const
        )[emotion],
      );
    },
    [tSession],
  );

  const liveSummaryTitle = useMemo(() => {
    if (!isRecording) return '';
    const emotionLabel = getEmotionLabel(liveEmotion);
    const dialogueCount = transcriptItems.filter(
      (item) => !item.isPendingTranscription && item.text.trim().length > 0,
    ).length;
    if (dialogueCount < 1) return '';

    return tSession('liveSummaryGeneratedTitle', { emotionLabel, dialogueCount });
  }, [getEmotionLabel, isRecording, liveEmotion, tSession, transcriptItems]);

  const liveSummaryBody = useMemo(() => {
    if (!isRecording) return '';
    const completed = transcriptItems.filter(
      (item) => !item.isPendingTranscription && item.text.trim().length > 0,
    );
    if (completed.length < 1) return '';

    const recent = completed.slice(-2);
    const first = recent[0];
    const second = recent[1];
    if (!first) return '';

    if (!second) {
      return tSession('liveSummaryBodySingle', {
        speaker: getSpeakerLabel(first.speaker),
        text: normalizeForSummary(first.text, 70),
      });
    }

    return tSession('liveSummaryBodyDouble', {
      firstSpeaker: getSpeakerLabel(first.speaker),
      firstText: normalizeForSummary(first.text, 70),
      secondSpeaker: getSpeakerLabel(second.speaker),
      secondText: normalizeForSummary(second.text, 70),
    });
  }, [getSpeakerLabel, isRecording, tSession, transcriptItems]);

  useEffect(() => {
    onRecorderStateChange?.({
      isRecording,
      isPaused,
      elapsedSeconds,
      visibleAudioLevel,
    });
  }, [elapsedSeconds, isPaused, isRecording, onRecorderStateChange, visibleAudioLevel]);

  useEffect(() => {
    onRegisterPrepareEndSession?.(handlePrepareEndSession);
  }, [handlePrepareEndSession, onRegisterPrepareEndSession]);

  useEffect(() => {
    if (!lastErrorMessage) return;
    toast(tSession('audioChunkUploadFailed'));
    console.error('[audio-chunk][upload-failed]', { sessionId, message: lastErrorMessage });
  }, [lastErrorMessage, sessionId, tSession]);

  const stopSegmentRecorder = useCallback(async (): Promise<Blob | null> => {
    const recorder = segmentRecorderRef.current;
    if (!recorder) return null;

    if (recorder.state === 'inactive') {
      segmentRecorderRef.current = null;
      const parts = segmentChunksRef.current;
      segmentChunksRef.current = [];
      if (parts.length === 0) return null;
      return new Blob(parts, { type: 'audio/webm' });
    }

    return new Promise<Blob | null>((resolve) => {
      recorder.onstop = () => {
        segmentRecorderRef.current = null;
        const parts = segmentChunksRef.current;
        segmentChunksRef.current = [];
        if (parts.length === 0) {
          resolve(null);
          return;
        }
        resolve(new Blob(parts, { type: 'audio/webm' }));
      };
      recorder.onerror = () => {
        segmentRecorderRef.current = null;
        segmentChunksRef.current = [];
        resolve(null);
      };
      recorder.stop();
    });
  }, []);

  const startSegmentRecorder = useCallback(() => {
    const stream = mediaStreamRef.current;
    if (!stream) return;
    if (segmentRecorderRef.current?.state && segmentRecorderRef.current.state !== 'inactive') {
      return;
    }

    const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    segmentChunksRef.current = [];
    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        segmentChunksRef.current.push(event.data);
      }
    };
    recorder.start();
    segmentRecorderRef.current = recorder;
  }, []);

  const captureCurrentSegment = useCallback(async () => {
    const segmentBlob = await stopSegmentRecorder();
    if (!segmentBlob) return null;
    recordedAudioChunksRef.current.push(segmentBlob);
    return segmentBlob;
  }, [stopSegmentRecorder]);

  const uploadCapturedSegment = useCallback(
    async (
      speaker: 'counselor' | 'client',
      segmentBlob: Blob,
      chunkTimestamp: string,
      pendingTranscriptId: string,
    ) => {
      const uploadResult = await uploadChunk({
        speaker,
        audioFile: segmentBlob,
        timestamp: chunkTimestamp,
      });

      if (
        uploadResult?.success &&
        typeof uploadResult.data?.transcriptId === 'number' &&
        typeof uploadResult.data?.text === 'string'
      ) {
        const chunkEmotion = resolveEmotionFromChunkResult(uploadResult.data);
        if (chunkEmotion.emotion) {
          setLiveEmotion(chunkEmotion.emotion);
          onAnalysisChange?.({
            currentEmotion: chunkEmotion.emotion,
            confidence: chunkEmotion.confidence,
          });
        }
        resolvePendingTranscript({
          pendingId: pendingTranscriptId,
          transcriptId: uploadResult.data.transcriptId,
          text: uploadResult.data.text,
        });
        return;
      }

      resolvePendingTranscript({
        pendingId: pendingTranscriptId,
        text: tSession('transcriptionFailedSwitchSpeaker'),
      });
    },
    [onAnalysisChange, resolvePendingTranscript, tSession, uploadChunk],
  );

  const getPendingTranscriptMessage = useCallback(
    (speaker: 'counselor' | 'client') => {
      return speaker === 'counselor'
        ? tSession('pendingCounselorSpeech')
        : tSession('pendingClientSpeech');
    },
    [tSession],
  );

  const handleSpeakerSwitch = useCallback(async () => {
    if (!isRecording || isPaused || isSwitchingSpeakerRef.current) return;

    isSwitchingSpeakerRef.current = true;
    const prevSpeaker = activeSpeaker;

    try {
      const segmentBlob = await captureCurrentSegment();
      const chunkTimestamp = formatNowAsLocalDateTime();
      const chunkDisplayTimestamp = formatElapsedToTimestamp(elapsedSeconds);
      const pendingTranscriptId = addPendingTranscript({
        speaker: prevSpeaker,
        timestamp: chunkDisplayTimestamp,
        text: getPendingTranscriptMessage(prevSpeaker),
      });

      setActiveSpeaker((prev) => (prev === 'counselor' ? 'client' : 'counselor'));
      startSegmentRecorder();
      if (segmentBlob) {
        void uploadCapturedSegment(prevSpeaker, segmentBlob, chunkTimestamp, pendingTranscriptId);
      } else {
        resolvePendingTranscript({
          pendingId: pendingTranscriptId,
          text: tSession('noAudioCapturedSwitchSpeaker'),
        });
      }
    } finally {
      isSwitchingSpeakerRef.current = false;
    }
  }, [
    activeSpeaker,
    addPendingTranscript,
    captureCurrentSegment,
    elapsedSeconds,
    getPendingTranscriptMessage,
    isPaused,
    isRecording,
    resolvePendingTranscript,
    startSegmentRecorder,
    tSession,
    uploadCapturedSegment,
  ]);

  const handleUploadFullAudio = useCallback(async () => {
    await captureCurrentSegment();

    const chunks = recordedAudioChunksRef.current;
    if (chunks.length === 0) return true;

    const fullAudio = new Blob(chunks, { type: 'audio/webm' });
    const previewUrl = URL.createObjectURL(fullAudio);
    setSessionAudioPreviewUrl(sessionId, previewUrl);

    const result = await uploadFullAudioFile({
      sessionId,
      audioFile: fullAudio,
    });
    if (!result.success) {
      console.error('[audio-file][upload-failed]', { sessionId, message: result.message });
      return false;
    }

    recordedAudioChunksRef.current = [];
    return true;
  }, [captureCurrentSegment, sessionId]);

  useEffect(() => {
    if (!isRecording) {
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      return;
    }

    let cancelled = false;

    const setupStreamAndRecorder = async () => {
      if (!mediaStreamRef.current) {
        try {
          mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch {
          console.error('[audio-chunk][record-init-failed]', { sessionId });
          return;
        }
      }

      if (cancelled || isPaused) return;
      if (!segmentRecorderRef.current) {
        startSegmentRecorder();
      }
    };

    void setupStreamAndRecorder();

    return () => {
      cancelled = true;
    };
  }, [isPaused, isRecording, sessionId, startSegmentRecorder]);

  useEffect(() => {
    const recorder = segmentRecorderRef.current;
    if (!recorder) return;

    if (isPaused && recorder.state === 'recording') {
      recorder.pause();
      return;
    }

    if (!isPaused && recorder.state === 'paused') {
      recorder.resume();
    }
  }, [isPaused]);

  useEffect(() => {
    if (isRecording) return;

    const recorder = segmentRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
    }
    segmentRecorderRef.current = null;
    segmentChunksRef.current = [];

    const stream = mediaStreamRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  }, [isRecording]);

  useEffect(() => {
    if (!isRecording) return;

    // Keyboard shortcuts:
    // - Enter / Space: upload current speaker chunk then toggle speaker
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.isComposing) return;
      if (event.repeat) return;
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isEditable =
        tag === 'input' ||
        tag === 'textarea' ||
        tag === 'select' ||
        Boolean(target?.isContentEditable);
      if (isEditable) return;

      if (
        event.code === 'Space' ||
        event.key === ' ' ||
        event.code === 'Enter' ||
        event.key === 'Enter'
      ) {
        event.preventDefault();
        void handleSpeakerSwitch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSpeakerSwitch, isRecording]);

  useEffect(() => {
    return () => {
      const recorder = segmentRecorderRef.current;
      if (recorder && recorder.state !== 'inactive') {
        recorder.stop();
      }
      const stream = mediaStreamRef.current;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    onRegisterUploadFullAudio?.(handleUploadFullAudio);
  }, [handleUploadFullAudio, onRegisterUploadFullAudio]);

  return (
    <section className="relative flex min-h-full flex-col gap-[25px] bg-neutral-99 px-8 pt-[26px] pb-[130px]">
      <div className="flex flex-col items-start gap-3">
        <div className="flex items-center gap-2">
          <div className="text-[24px] font-semibold">{tSession('recordTitle')}</div>
          <span
            className={`flex justify-center items-center border  w-[75px] rounded-[100px] px-4 py-[3px] body-14 font-semibold text-center text-label-neutral ${
              activeSpeaker === 'counselor'
                ? 'bg-white border-neutral-95'
                : 'bg-neutral-95 border-neutral-90'
            }`}
          >
            {activeSpeaker === 'counselor'
              ? tSession('speakerCounselor')
              : tSession('speakerClient')}
          </span>
        </div>
        <div className="flex items-center gap-[6px]">
          <Image src="/icons/information-circle.svg" alt="information" width={24} height={24} />
          <span className="text-label-alternative body-16">{tSession('switchSpeakerHint')}</span>
        </div>
        <span className="ml-auto hidden body-13 text-label-assistive sm:inline"></span>
        <span className="ml-auto body-13 text-label-assistive sm:hidden">
          {tSession('switchSpeakerShortHint')}
        </span>
      </div>
      <div className="flex w-full flex-col items-start gap-4">
        <SessionTranscriptCard
          locale={locale}
          transcriptItems={transcriptItems}
          pendingIds={pendingIds}
          bookmarkIds={bookmarkIds}
          onToggleBookmark={(transcriptId) => {
            void toggleBookmark(transcriptId);
          }}
          formatTimestampToHms={formatTimestampToHms}
          renderHighlightedText={renderHighlightedText}
        />
        <SessionLiveSummaryCard
          statusLabel={undefined}
          title={liveSummaryTitle}
          body={liveSummaryBody}
        />
        <SessionCounselorMemoCard defaultValue="" />
      </div>
      <div className="fixed bottom-[30px] left-[40%] right-0 z-30 flex justify-center px-8 max-[1200px]:left-0 max-[1200px]:right-0 max-[1200px]:px-6 max-[900px]:px-4">
        <SessionAudioControls
          isRecording={isRecording}
          isPaused={isPaused}
          isStartDisabled={isRecording || micPermission === 'requesting' || isStartingSession}
          isPauseDisabled={!isRecording}
          onStart={() => {
            void handleStartRecording();
          }}
          onPauseResume={handlePauseResume}
          onSwitchSpeaker={() => {
            void handleSpeakerSwitch();
          }}
        />
      </div>
    </section>
  );
}

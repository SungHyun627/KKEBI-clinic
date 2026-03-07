'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { SessionAutoRecordData, SessionInsightsData } from '../../types/session';
import { useRecordingController } from '../../hooks/useRecordingController';
import { useSessionAnalysis } from '../../hooks/useSessionAnalysis';
import { useTranscriptRuntime } from '../../hooks/useTranscriptRuntime';
import { useSessionInsightsStream } from '../../hooks/useSessionInsightsStream';
import { formatTimestampToHms } from '../../lib/session-analysis';
import { useSessionPersistence } from '../../hooks/useSessionPersistence';
import { getSessionAutoRecordStorageKey } from '../../lib/session-storage';
import { renderHighlightedText } from './session-transcript-highlight';
import SessionTranscriptCard from './SessionTranscriptCard';
import SessionLiveSummaryCard from './SessionLiveSummaryCard';
import SessionCounselorMemoCard from './SessionCounselorMemoCard';
import SessionAudioControls from './SessionAudioControls';

type PersistedAutoRecordState = {
  transcriptItems: SessionAutoRecordData['transcripts'];
  bookmarkIds: string[];
  bookmarkIdByTranscriptId: Record<string, number>;
  activeSpeaker: 'counselor' | 'client';
  micPermission: 'idle' | 'requesting' | 'granted' | 'denied';
  isRecording: boolean;
  isPaused: boolean;
  elapsedSeconds: number;
  audioLevel: number;
  demoIndex: number;
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
  onAnalysisChange?: (insights: SessionInsightsData | null) => void;
  onRegisterPrepareEndSession?: (handler: () => void) => void;
}

export default function SessionAutoRecordPanel({
  sessionId,
  autoRecord,
  baseInsights,
  onRecorderStateChange,
  onRiskSignalDetected,
  onAnalysisChange,
  onRegisterPrepareEndSession,
}: SessionAutoRecordPanelProps) {
  const locale = useLocale();
  const tSession = useTranslations('sessionList');
  const [streamSummary, setStreamSummary] = useState<{ title: string; body: string } | null>(null);
  const [activeSpeaker, setActiveSpeaker] = useState<'counselor' | 'client'>('counselor');
  const {
    micPermission,
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
    toggleBookmark,
    handleAddDemoDialogue,
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

  const snapshot = useMemo<PersistedAutoRecordState>(
    () => ({
      transcriptItems,
      bookmarkIds: Array.from(bookmarkIds),
      bookmarkIdByTranscriptId,
      activeSpeaker,
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
      setMicPermission(parsed.micPermission ?? 'idle');
      setIsRecording(Boolean(parsed.isRecording));
      setIsPaused(Boolean(parsed.isPaused));
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

  const { liveSummary } = useSessionAnalysis({
    locale,
    isRecording,
    transcriptItems,
    autoRecord,
    baseInsights,
    onAnalysisChange,
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

      // Transcript event: append or patch transcript row
      if (typeof obj.transcriptId === 'number' && typeof obj.text === 'string') {
        upsertTranscriptFromSse({
          transcriptId: obj.transcriptId,
          text: obj.text,
          speaker:
            obj.speaker === 'counselor' || obj.speaker === 'client' ? obj.speaker : undefined,
          timestamp: typeof obj.timestamp === 'string' ? obj.timestamp : undefined,
        });
      }

      // Summary event: prefer stream-provided summary over local mock analyzer output
      const body = typeof obj.summaryText === 'string' ? obj.summaryText : undefined;
      const title =
        typeof obj.summaryTitle === 'string'
          ? obj.summaryTitle
          : locale === 'en'
            ? 'AI Summary'
            : 'AI 자동 요약';
      if (body) {
        setStreamSummary({ title, body });
      }

      // Insights event: forward when full shape is available
      if (
        typeof obj.currentEmotion === 'string' &&
        typeof obj.confidence === 'number' &&
        Array.isArray(obj.emotionHistory) &&
        typeof obj.phq9Score === 'number' &&
        typeof obj.riskType === 'string' &&
        typeof obj.recentEmotionPattern === 'string' &&
        Array.isArray(obj.keyConcerns) &&
        typeof obj.distortionType === 'string' &&
        typeof obj.distortionExample === 'string'
      ) {
        onAnalysisChange?.(obj as unknown as SessionInsightsData);
      }
    },
    [locale, onAnalysisChange, unwrapStreamData, upsertTranscriptFromSse],
  );

  // Subscribe to SSE after recording starts
  useSessionInsightsStream({
    sessionId,
    enabled: isRecording,
    onEvent: handleStreamEvent,
  });
  const activeStreamSummary = isRecording ? streamSummary : null;

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
    if (!isRecording) return;

    // Toggle active speaker whenever Space or Enter is pressed.
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.isComposing) return;
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isEditable =
        tag === 'input' ||
        tag === 'textarea' ||
        tag === 'select' ||
        Boolean(target?.isContentEditable);
      if (isEditable) return;

      if (event.code !== 'Space' && event.key !== 'Enter') return;
      event.preventDefault();
      setActiveSpeaker((prev) => (prev === 'counselor' ? 'client' : 'counselor'));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRecording]);

  return (
    <section className="relative flex min-h-full flex-col gap-[25px] bg-neutral-99 px-8 pt-[26px] pb-[130px]">
      <div className="text-[24px] font-semibold">{tSession('recordTitle')}</div>
      <div className="flex w-full items-center justify-between rounded-[14px] border border-neutral-90 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="body-14 text-label-alternative">
            {locale === 'en' ? 'Current speaker' : '현재 발화자'}
          </span>
          <span
            className={`rounded-[10px] px-3 py-1 body-14 font-semibold ${
              activeSpeaker === 'counselor'
                ? 'bg-neutral-95 text-label-normal'
                : 'bg-[#FFE5E5] text-[#FF6363]'
            }`}
          >
            {activeSpeaker === 'counselor'
              ? locale === 'en'
                ? 'Counselor'
                : '상담사'
              : locale === 'en'
                ? 'Client'
                : '내담자'}
          </span>
        </div>
        <span className="body-13 text-label-assistive">
          {locale === 'en'
            ? 'Press Space or Enter to switch speaker'
            : 'Space 또는 Enter 키로 발화자 전환'}
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
          locale={locale}
          title={activeStreamSummary?.title ?? liveSummary.title}
          body={activeStreamSummary?.body ?? liveSummary.body}
        />
        <SessionCounselorMemoCard locale={locale} defaultValue="" />
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
          onAddDemoDialogue={handleAddDemoDialogue}
        />
      </div>
    </section>
  );
}

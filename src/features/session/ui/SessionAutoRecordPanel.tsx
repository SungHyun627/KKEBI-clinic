'use client';

import { useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import type { SessionAutoRecordData, SessionInsightsData } from '../types/session-page';
import { useSessionAutoRecordRuntime } from '../hooks/useSessionAutoRecordRuntime';
import {
  buildLiveInsights,
  buildLiveSummary,
  formatTimestampToHms,
  renderHighlightedText,
} from '../lib/session-analysis';
import SessionTranscriptCard from './SessionTranscriptCard';
import SessionLiveSummaryCard from './SessionLiveSummaryCard';
import SessionCounselorMemoCard from './SessionCounselorMemoCard';
import SessionAudioControls from './SessionAudioControls';

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
}

export default function SessionAutoRecordPanel({
  sessionId,
  autoRecord,
  baseInsights,
  onRecorderStateChange,
  onRiskSignalDetected,
  onAnalysisChange,
}: SessionAutoRecordPanelProps) {
  const locale = useLocale();
  const {
    transcriptItems,
    bookmarkIds,
    pendingIds,
    micPermission,
    isRecording,
    isPaused,
    elapsedSeconds,
    visibleAudioLevel,
    toggleBookmark,
    handleStartRecording,
    handlePauseResume,
    handleAddDemoDialogue,
  } = useSessionAutoRecordRuntime({
    sessionId,
    locale,
    onRiskSignalDetected,
  });

  const liveSummary = useMemo(
    () =>
      isRecording
        ? buildLiveSummary(
            transcriptItems,
            locale,
            autoRecord.liveSummaryTitle,
            autoRecord.liveSummaryBody,
          )
        : { title: '', body: '' },
    [autoRecord.liveSummaryBody, autoRecord.liveSummaryTitle, isRecording, locale, transcriptItems],
  );

  useEffect(() => {
    onRecorderStateChange?.({
      isRecording,
      isPaused,
      elapsedSeconds,
      visibleAudioLevel,
    });
  }, [elapsedSeconds, isPaused, isRecording, onRecorderStateChange, visibleAudioLevel]);

  useEffect(() => {
    if (!onAnalysisChange) return;
    onAnalysisChange(buildLiveInsights(baseInsights, transcriptItems, locale));
  }, [baseInsights, locale, onAnalysisChange, transcriptItems]);

  return (
    <section className="relative flex min-h-full flex-col gap-[25px] bg-neutral-99 px-8 pt-[26px] pb-[130px]">
      <div className="text-[24px] font-semibold">
        {locale === 'en' ? 'Session record' : '상담 기록'}
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
        <SessionLiveSummaryCard locale={locale} title={liveSummary.title} body={liveSummary.body} />
        <SessionCounselorMemoCard locale={locale} defaultValue="" />
      </div>
      <div className="fixed bottom-[30px] left-[40%] right-0 z-30 flex justify-center px-8 max-[1200px]:left-0 max-[1200px]:right-0 max-[1200px]:px-6 max-[900px]:px-4">
        <SessionAudioControls
          isRecording={isRecording}
          isPaused={isPaused}
          isStartDisabled={isRecording || micPermission === 'requesting'}
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

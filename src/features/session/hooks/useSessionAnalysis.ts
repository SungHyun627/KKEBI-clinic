'use client';

import { useEffect, useMemo } from 'react';
import type { SessionAutoRecordData, SessionInsightsData } from '../types/session-page';
import { buildLiveInsights, buildLiveSummary } from '../lib/session-analysis';

interface UseSessionAnalysisParams {
  locale: string;
  isRecording: boolean;
  transcriptItems: SessionAutoRecordData['transcripts'];
  autoRecord: SessionAutoRecordData;
  baseInsights: SessionInsightsData;
  onAnalysisChange?: (insights: SessionInsightsData | null) => void;
}

export function useSessionAnalysis({
  locale,
  isRecording,
  transcriptItems,
  autoRecord,
  baseInsights,
  onAnalysisChange,
}: UseSessionAnalysisParams) {
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

  const liveInsights = useMemo(
    () => buildLiveInsights(baseInsights, transcriptItems, locale),
    [baseInsights, locale, transcriptItems],
  );

  useEffect(() => {
    onAnalysisChange?.(liveInsights);
  }, [liveInsights, onAnalysisChange]);

  return { liveSummary, liveInsights };
}

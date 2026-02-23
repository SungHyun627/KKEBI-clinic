'use client';

import { useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import type { SessionAutoRecordData, SessionInsightsData } from '../types/session-page';
import { analyzeLiveSummary, buildLiveInsights } from '../lib/session-analysis';

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
  const tSession = useTranslations('sessionList');

  const liveSummaryAnalysis = useMemo(() => analyzeLiveSummary(transcriptItems), [transcriptItems]);

  const liveSummary = useMemo(() => {
    if (!isRecording || !liveSummaryAnalysis) return { title: '', body: '' };

    const topicLabels = liveSummaryAnalysis.topicKeys
      .slice(0, 2)
      .map((topic) => tSession(`summaryTopic.${topic}`));
    const topicText =
      topicLabels.length > 0
        ? topicLabels.join(` ${tSession('summaryJoinWord')} `)
        : tSession('summaryTopic.default');

    const emotionLabel = tSession(`summaryEmotion.${liveSummaryAnalysis.currentEmotion}`);
    const distortionLabel = tSession(`summaryDistortion.${liveSummaryAnalysis.distortionType}`);

    const body =
      tSession('summaryBodyTemplate', {
        count: liveSummaryAnalysis.clientTurnCount,
        topic: topicText,
        recentFocus: liveSummaryAnalysis.recentFocus,
        emotion: emotionLabel,
        distortion: distortionLabel,
      }) +
      (liveSummaryAnalysis.riskCount > 0
        ? ` ${tSession('summaryRiskSuffix', { count: liveSummaryAnalysis.riskCount })}`
        : '');

    return {
      title: autoRecord.liveSummaryTitle || tSession('summaryTitle'),
      body: body || autoRecord.liveSummaryBody,
    };
  }, [
    autoRecord.liveSummaryBody,
    autoRecord.liveSummaryTitle,
    isRecording,
    liveSummaryAnalysis,
    tSession,
  ]);

  const liveInsights = useMemo(
    () => buildLiveInsights(baseInsights, transcriptItems, locale),
    [baseInsights, locale, transcriptItems],
  );

  useEffect(() => {
    onAnalysisChange?.(liveInsights);
  }, [liveInsights, onAnalysisChange]);

  return { liveSummary, liveInsights };
}

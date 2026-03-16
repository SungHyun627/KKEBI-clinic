'use client';

import { useTranslations } from 'next-intl';
import RiskTypeChip from '@/shared/ui/chips/risk-type-chip';
import SessionInsightCard from './SessionInsightCard';
import type {
  CognitiveDistortionType,
  SessionEmotionType,
  SessionInsightsData,
} from '../../model/types';

interface SessionInsightsPanelProps {
  insights: SessionInsightsData;
  hasEmotionData: boolean;
  hasPhq9Data: boolean;
  hasDistortionData: boolean;
  recentEmotionHistory: SessionEmotionType[];
  keyConcernHistory: string[];
  distortionExampleHistory: string[];
}

const emotionEmoji = (emotion: SessionEmotionType) => {
  const map = {
    anxious: '😨',
    sad: '😢',
    angry: '😡',
    happy: '☺️',
    surprise: '😲',
    calm: '😐',
    fearful: '😨',
    disgust: '🤢',
  } satisfies Record<SessionEmotionType, string>;
  return map[emotion];
};

export default function SessionInsightsPanel({
  insights,
  hasEmotionData,
  hasPhq9Data,
  hasDistortionData,
  recentEmotionHistory,
  keyConcernHistory,
  distortionExampleHistory,
}: SessionInsightsPanelProps) {
  const tSession = useTranslations('sessionList');

  const emotionLabel = (emotion: SessionEmotionType) =>
    tSession(
      (
        {
          anxious: 'insightsEmotionAnxious',
          sad: 'insightsEmotionSad',
          angry: 'insightsEmotionAngry',
          happy: 'insightsEmotionHappy',
          surprise: 'insightsEmotionSurprise',
          calm: 'insightsEmotionCalm',
          fearful: 'insightsEmotionFearful',
          disgust: 'insightsEmotionDisgust',
        } as const
      )[emotion],
    );

  const distortionLabel = (type: CognitiveDistortionType) =>
    tSession(
      (
        {
          black_and_white: 'insightsDistortionBlackAndWhite',
          overgeneralization: 'insightsDistortionOvergeneralization',
          catastrophizing: 'insightsDistortionCatastrophizing',
          should_statement: 'insightsDistortionShouldStatement',
          none: 'insightsDistortionNone',
        } as const
      )[type],
    );

  const emotionWaitingMessage = tSession('insightsEmotionWaiting');
  const summaryWaitingMessage = tSession('insightsSummaryWaiting');
  const distortionWaitingMessage = tSession('insightsDistortionWaiting');
  const historyWaitingMessage = tSession('insightsHistoryWaiting');

  return (
    <section className="flex min-h-full flex-col gap-[25px] pb-10">
      <div className="text-[24px] font-semibold">{tSession('insightsTitle')}</div>
      <div className="flex w-full flex-col items-start gap-4">
        <SessionInsightCard
          title={tSession('insightsEmotionCardTitle')}
          iconSrc="/icons/analyze.svg"
          mainContent={
            hasEmotionData ? (
              <div className="flex items-center gap-[6px]">
                <span className="text-[32px] font-semibold leading-[30px] text-label-normal">
                  {emotionLabel(insights.currentEmotion)}
                </span>
                <span className="text-[28px]" aria-label="emotion emoji">
                  {emotionEmoji(insights.currentEmotion)}
                </span>
              </div>
            ) : (
              <div className="flex min-h-[34px] items-center">
                <span className="body-14 text-label-disable">{emotionWaitingMessage}</span>
              </div>
            )
          }
          subContent={
            hasEmotionData ? (
              <>
                <span className="body-16 text-label-alternative">
                  {tSession('insightsConfidence')}
                </span>
                <span className="body-16 font-medium text-label-neutral">
                  {insights.confidence}%
                </span>
              </>
            ) : (
              <span className="body-16 text-label-disable">
                {tSession('insightsConfidencePending')}
              </span>
            )
          }
        >
          <div className="flex w-full flex-col items-start gap-[18px]">
            <div className="flex w-full items-center gap-2">
              <span className="rounded-[100px] border border-neutral-95 bg-white px-3 py-[3px] body-14 text-label-alternative whitespace-nowrap">
                {tSession('insightsEmotionHistory')}
              </span>
              {hasEmotionData && recentEmotionHistory.length > 0 ? (
                <div className="flex w-full body-14">
                  {recentEmotionHistory.map((item) => emotionLabel(item)).join(', ')}
                </div>
              ) : (
                <div className="flex w-full body-14 text-label-disable">
                  {historyWaitingMessage}
                </div>
              )}
            </div>
          </div>
        </SessionInsightCard>

        <SessionInsightCard
          title={tSession('insightsDataSummaryTitle')}
          iconSrc="/icons/clipboard.svg"
          mainContent={
            hasPhq9Data ? (
              <div className="flex min-h-[34px] items-center">
                <span className="text-[32px] font-semibold leading-[30px] text-label-normal">
                  {tSession('insightsPhq9Score', { score: insights.phq9Score })}
                </span>
              </div>
            ) : (
              <div className="flex min-h-[34px] items-center">
                <span className="body-14 text-label-disable">{summaryWaitingMessage}</span>
              </div>
            )
          }
          subContent={
            <>
              <span className="body-16 text-label-alternative">{tSession('insightsRisk')}</span>
              <RiskTypeChip value={insights.riskType} />
            </>
          }
        >
          <div className="flex w-full flex-col items-start gap-[18px]">
            <div className="flex w-full items-center gap-2">
              <span className="rounded-[100px] border border-neutral-95 bg-white px-3 py-[3px] body-14 text-label-alternative whitespace-nowrap">
                {tSession('insightsRecentPattern')}
              </span>
              {recentEmotionHistory.length > 0 ? (
                <div className="w-full body-14 text-label-normal">
                  {recentEmotionHistory.map((item) => emotionLabel(item)).join(', ')}
                </div>
              ) : (
                <div className="flex w-full body-14 text-label-disable">
                  {historyWaitingMessage}
                </div>
              )}
            </div>
            <div className="flex w-full items-center gap-2">
              <span className="rounded-[100px] border border-neutral-95 bg-white px-3 py-[3px] body-14 text-label-alternative whitespace-nowrap">
                {tSession('insightsKeyConcerns')}
              </span>
              {keyConcernHistory.length > 0 ? (
                <div className="w-full body-14 text-label-normal">
                  {keyConcernHistory.join(', ')}
                </div>
              ) : (
                <div className="flex w-full body-14 text-label-disable">
                  {historyWaitingMessage}
                </div>
              )}
            </div>
          </div>
        </SessionInsightCard>

        <SessionInsightCard
          title={tSession('insightsDistortionTitle')}
          iconSrc="/icons/brain.svg"
          mainContent={
            hasDistortionData ? (
              <span className="text-[32px] font-semibold leading-[30px] text-label-normal">
                {distortionLabel(insights.distortionType)}
              </span>
            ) : (
              <div className="flex min-h-[34px] items-center">
                <span className="body-14 text-label-disable">{distortionWaitingMessage}</span>
              </div>
            )
          }
        >
          <div className="flex w-full flex-col items-start gap-[18px]">
            <div className="flex w-full items-start gap-2">
              <span className="rounded-[100px] border border-neutral-95 bg-white px-3 py-[3px] body-14 text-label-alternative whitespace-nowrap">
                {tSession('insightsExample')}
              </span>
              {distortionExampleHistory.length > 0 ? (
                <div className="flex w-full flex-col gap-1 body-14 items-start pt-[3px]">
                  {distortionExampleHistory.map((item, index) => (
                    <span key={`${item}-${index}`} className="text-label-normal">
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="flex w-full body-14 text-label-disable">
                  {historyWaitingMessage}
                </div>
              )}
            </div>
          </div>
        </SessionInsightCard>
      </div>
    </section>
  );
}

'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import RiskTypeChip from '@/shared/ui/chips/risk-type-chip';
import SessionInsightCard from './SessionInsightCard';
import type {
  CognitiveDistortionType,
  SessionEmotionType,
  SessionInsightsData,
} from '../types/session-page';

interface SessionInsightsPanelProps {
  insights: SessionInsightsData;
  isRecording: boolean;
  recentEmotionHistory: SessionEmotionType[];
  keyConcernHistory: string[];
  distortionExampleHistory: string[];
}

const emotionLabel = (emotion: SessionEmotionType, locale: string) => {
  const map = {
    anxious: { ko: '불안', en: 'Anxious' },
    sad: { ko: '슬픔', en: 'Sad' },
    angry: { ko: '분노', en: 'Angry' },
    happy: { ko: '기쁨', en: 'Happy' },
    calm: { ko: '평온', en: 'Calm' },
    fearful: { ko: '두려움', en: 'Fearful' },
  } satisfies Record<SessionEmotionType, { ko: string; en: string }>;
  return locale === 'en' ? map[emotion].en : map[emotion].ko;
};

const distortionLabel = (type: CognitiveDistortionType, locale: string) => {
  const map = {
    black_and_white: { ko: '흑백논리', en: 'Black-and-white' },
    overgeneralization: { ko: '과잉일반화', en: 'Overgeneralization' },
    catastrophizing: { ko: '파국화', en: 'Catastrophizing' },
    should_statement: { ko: '당위적 사고', en: 'Should statement' },
  } satisfies Record<CognitiveDistortionType, { ko: string; en: string }>;
  return locale === 'en' ? map[type].en : map[type].ko;
};

export default function SessionInsightsPanel({
  insights,
  isRecording,
  recentEmotionHistory,
  keyConcernHistory,
  distortionExampleHistory,
}: SessionInsightsPanelProps) {
  const locale = useLocale();

  const emotionWaitingMessage =
    locale === 'en'
      ? 'Emotion and confidence will appear during recording'
      : '녹음 중 감정과 신뢰도가 표시됩니다';
  const summaryWaitingMessage =
    locale === 'en'
      ? 'PHQ-9 and risk level will update during recording'
      : '녹음 중 PHQ-9 점수와 위험도가 업데이트됩니다';
  const distortionWaitingMessage =
    locale === 'en'
      ? 'Detected distortion type will appear during recording'
      : '녹음 중 감지된 왜곡 유형이 표시됩니다';
  const historyWaitingMessage =
    locale === 'en'
      ? 'Data will be collected during the session'
      : '상담 진행 중 데이터가 누적됩니다';

  return (
    <section className="flex min-h-full flex-col gap-[25px] pb-10">
      <div className="text-[24px] font-semibold">
        {locale === 'en' ? 'KKEBI Insights' : 'KKEBI 인사이트'}
      </div>
      <div className="flex w-full flex-col items-start gap-4">
        <SessionInsightCard
          title={locale === 'en' ? 'Real-time emotion analysis' : '실시간 감정 분석'}
          iconSrc="/icons/analyze.svg"
          mainContent={
            isRecording ? (
              <div className="flex items-center gap-[6px]">
                <span className="text-[32px] font-semibold leading-[30px] text-label-normal">
                  {emotionLabel(insights.currentEmotion, locale)}
                </span>
                <Image
                  src="/icons/kkebi-character.svg"
                  alt="KKEBI Character"
                  width={28}
                  height={28}
                />
              </div>
            ) : (
              <div className="flex min-h-[34px] items-center">
                <span className="body-14 text-label-disable">{emotionWaitingMessage}</span>
              </div>
            )
          }
          subContent={
            isRecording ? (
              <>
                <span className="body-16 text-label-alternative">
                  {locale === 'en' ? 'Confidence' : '신뢰도'}
                </span>
                <span className="body-16 font-medium text-label-neutral">
                  {insights.confidence}%
                </span>
              </>
            ) : (
              <span className="body-16 text-label-disable">
                {locale === 'en' ? 'Confidence pending' : '신뢰도 분석 대기'}
              </span>
            )
          }
        >
          <div className="flex w-full flex-col items-start gap-[18px]">
            <div className="flex w-full items-center gap-2">
              <span className="rounded-[100px] border border-neutral-95 bg-white px-3 py-[3px] body-14 text-label-alternative whitespace-nowrap">
                {locale === 'en' ? 'Emotion history' : '최근 감정'}
              </span>
              {isRecording ? (
                <div className="flex w-full body-14">
                  {insights.emotionHistory
                    .map((item) => emotionLabel(item.emotion, locale))
                    .join(', ')}
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
          title={locale === 'en' ? 'KKEBI data summary' : 'KKEBI 데이터 요약'}
          iconSrc="/icons/clipboard.svg"
          mainContent={
            isRecording ? (
              <div className="flex items-center gap-2">
                <span className="text-[32px] font-semibold leading-[30px] text-label-normal">
                  {locale === 'en' ? `${insights.phq9Score}` : `${insights.phq9Score}점`}
                </span>
              </div>
            ) : (
              <div className="flex min-h-[34px] items-center">
                <span className="body-14 text-label-disable">{summaryWaitingMessage}</span>
              </div>
            )
          }
          subContent={
            isRecording ? (
              <>
                <span className="body-16 text-label-alternative">
                  {locale === 'en' ? 'Risk' : '위험도'}
                </span>
                <RiskTypeChip value={insights.riskType} />
              </>
            ) : (
              <span className="body-16 text-label-disable">
                {locale === 'en' ? 'Risk level pending' : '위험도 분석 대기'}
              </span>
            )
          }
        >
          <div className="flex w-full flex-col items-start gap-[18px]">
            <div className="flex w-full items-center gap-2">
              <span className="rounded-[100px] border border-neutral-95 bg-white px-3 py-[3px] body-14 text-label-alternative whitespace-nowrap">
                {locale === 'en' ? 'Recent pattern' : '최근 감정'}
              </span>
              {recentEmotionHistory.length > 0 ? (
                <div className="w-full body-14 text-label-normal">
                  {recentEmotionHistory.map((item) => emotionLabel(item, locale)).join(', ')}
                </div>
              ) : (
                <div className="flex w-full body-14 text-label-disable">
                  {historyWaitingMessage}
                </div>
              )}
            </div>
            <div className="flex w-full items-center gap-2">
              <span className="rounded-[100px] border border-neutral-95 bg-white px-3 py-[3px] body-14 text-label-alternative whitespace-nowrap">
                {locale === 'en' ? 'Key concerns' : '주요 고민'}
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
          title={locale === 'en' ? 'Detected cognitive distortion' : '감지된 인지적 왜곡'}
          iconSrc="/icons/brain.svg"
          mainContent={
            isRecording ? (
              <span className="text-[32px] font-semibold leading-[30px] text-label-normal">
                {distortionLabel(insights.distortionType, locale)}
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
                {locale === 'en' ? 'Example' : '사례'}
              </span>
              {distortionExampleHistory.length > 0 ? (
                <div className="flex w-full flex-col gap-1 body-14">
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

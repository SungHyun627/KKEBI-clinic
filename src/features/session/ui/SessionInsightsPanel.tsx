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

export default function SessionInsightsPanel({ insights }: SessionInsightsPanelProps) {
  const locale = useLocale();

  return (
    <section className="flex min-h-full flex-col gap-[25px] pb-20">
      <div className="text-[24px] font-semibold">
        {locale === 'en' ? 'KKEBI Insights' : 'KKEBI 인사이트'}
      </div>
      <div className="flex w-full flex-col items-start gap-4">
        <SessionInsightCard
          title={locale === 'en' ? 'Real-time emotion analysis' : '실시간 감정 분석'}
          iconSrc="/icons/analyze.svg"
          mainContent={
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
          }
          subContent={
            <>
              <span className="body-16 text-label-alternative">
                {locale === 'en' ? 'Confidence' : '신뢰도'}
              </span>
              <span className="body-16 font-medium text-label-neutral">{insights.confidence}%</span>
            </>
          }
        >
          <div className="flex w-full flex-col items-start gap-[18px]">
            <div className="flex w-full items-center gap-2">
              <span className="rounded-[100px] border border-neutral-95 bg-white px-3 py-[3px] body-14 text-label-alternative whitespace-nowrap">
                {locale === 'en' ? 'Emotion history' : '최근 감정'}
              </span>
              <div className="flex w-full body-14">
                {insights.emotionHistory
                  .map((item) => emotionLabel(item.emotion, locale))
                  .join(', ')}
              </div>
            </div>
          </div>
        </SessionInsightCard>

        <SessionInsightCard
          title={locale === 'en' ? 'KKEBI data summary' : 'KKEBI 데이터 요약'}
          iconSrc="/icons/clipboard.svg"
          mainContent={
            <div className="flex items-center gap-2">
              <span className="text-[32px] font-semibold leading-[30px] text-label-normal">
                {locale === 'en' ? `${insights.phq9Score}` : `${insights.phq9Score}점`}
              </span>
            </div>
          }
          subContent={
            <>
              <span className="body-16 text-label-alternative">
                {locale === 'en' ? 'Risk' : '위험도'}
              </span>
              <RiskTypeChip value={insights.riskType} />
            </>
          }
        >
          <div className="flex w-full flex-col items-start gap-[18px]">
            <div className="flex w-full items-center gap-2">
              <span className="rounded-[100px] border border-neutral-95 bg-white px-3 py-[3px] body-14 text-label-alternative whitespace-nowrap">
                {locale === 'en' ? 'Recent pattern' : '최근 감정'}
              </span>
              <div className="flex w-full body-14">{insights.recentEmotionPattern}</div>
            </div>
            <div className="flex w-full items-center gap-2">
              <span className="rounded-[100px] border border-neutral-95 bg-white px-3 py-[3px] body-14 text-label-alternative whitespace-nowrap">
                {locale === 'en' ? 'Key concerns' : '주요 고민'}
              </span>
              <div className="flex w-full body-14">{insights.keyConcerns.join(', ')}</div>
            </div>
          </div>
        </SessionInsightCard>

        <SessionInsightCard
          title={locale === 'en' ? 'Detected cognitive distortion' : '감지된 인지적 왜곡'}
          iconSrc="/icons/brain.svg"
          mainContent={
            <span className="text-[32px] font-semibold leading-[30px] text-label-normal">
              {distortionLabel(insights.distortionType, locale)}
            </span>
          }
        >
          <div className="flex w-full flex-col items-start gap-[18px]">
            <div className="flex w-full items-center gap-2">
              <span className="rounded-[100px] border border-neutral-95 bg-white px-3 py-[3px] body-14 text-label-alternative whitespace-nowrap">
                {locale === 'en' ? 'Example' : '사례'}
              </span>
              <div className="flex w-full body-14">{insights.distortionExample}</div>
            </div>
          </div>
        </SessionInsightCard>
      </div>
    </section>
  );
}

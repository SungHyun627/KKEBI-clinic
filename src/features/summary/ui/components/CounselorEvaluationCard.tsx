import { useState } from 'react';
import type { FollowUpSessionTiming, RiskEvaluation } from '@/features/summary/types/summary';
import Image from 'next/image';
import { cn } from '@/shared/lib/utils';

interface CounselorEvaluationCardProps {
  locale: string;
  additionalMemo?: string;
}

export default function CounselorEvaluationCard({
  locale,
  additionalMemo,
}: CounselorEvaluationCardProps) {
  const [selectedRiskEvaluation, setSelectedRiskEvaluation] = useState<RiskEvaluation | null>(null);
  const [selectedFollowUpSessionTiming, setSelectedFollowUpSessionTiming] =
    useState<FollowUpSessionTiming | null>(null);

  return (
    <div className="flex w-full flex-col items-start gap-7">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-fill-pressed">
          <Image
            src="/icons/badge-checkmark.svg"
            alt={locale === 'en' ? 'Counselor evaluation' : '상담사 평가'}
            width={20}
            height={20}
            aria-hidden
          />
        </div>
        <div className="text-[24px] font-semibold text-label-normal">
          {locale === 'en' ? 'Counselor evaluation' : '상담사 평가'}
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-[26px]">
        <div className="flex w-full flex-col items-start gap-4">
          <span className="body-16 font-medium text-label-neutral">위험 수준 선택</span>
          <div className="flex w-full justify-between gap-10">
            {[
              { key: 'stable', label: locale === 'en' ? 'Stable' : '안정' },
              { key: 'caution', label: locale === 'en' ? 'Caution' : '주의' },
              { key: 'risk', label: locale === 'en' ? 'Risk' : '위험' },
              { key: 'urgent', label: locale === 'en' ? 'Urgent' : '긴급' },
            ].map((option, idx) => {
              const isSelected = selectedRiskEvaluation === option.key;
              return (
                <button
                  type="button"
                  key={option.key}
                  onClick={() => setSelectedRiskEvaluation(option.key as RiskEvaluation)}
                  className={cn(
                    'flex h-24 w-full flex-col items-center justify-center gap-[6px] rounded-[16px] border p-5 hover:cursor-pointer hover:bg-neutral-95',
                    isSelected ? 'border-primary bg-fill-pressed' : 'border-neutral-95',
                  )}
                >
                  <span
                    className={cn(
                      'body-14 text-center font-medium',
                      isSelected ? 'text-primary-light' : 'text-label-alternative',
                    )}
                  >
                    {idx + 1}단계
                  </span>
                  <span
                    className={cn(
                      'body-16 text-center font-semibold',
                      isSelected ? 'text-primary' : 'text-label-normal',
                    )}
                  >
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex w-full flex-col items-start gap-4">
          <span className="body-16 font-medium text-label-neutral">다음 상담 시기</span>
          <div className="flex w-full justify-between gap-10">
            {[
              { key: '1w', label: locale === 'en' ? 'Within 1 week' : '1주 이내' },
              { key: '2w', label: locale === 'en' ? 'Within 2 weeks' : '2주 이내' },
              { key: '1m', label: locale === 'en' ? 'Within 1 month' : '1개월 이내' },
              { key: 'as-needed', label: locale === 'en' ? 'As needed' : '필요시' },
            ].map((option) => {
              const isSelected = selectedFollowUpSessionTiming === option.key;
              return (
                <button
                  type="button"
                  key={option.key}
                  onClick={() =>
                    setSelectedFollowUpSessionTiming(option.key as FollowUpSessionTiming)
                  }
                  className={cn(
                    'flex h-24 w-full flex-col items-center justify-center gap-[6px] rounded-[16px] border p-5 hover:cursor-pointer hover:bg-neutral-95',
                    isSelected ? 'border-primary bg-fill-pressed' : 'border-neutral-95',
                  )}
                >
                  <span
                    className={cn(
                      'body-16 text-center font-semibold',
                      isSelected ? 'text-primary' : 'text-label-normal',
                    )}
                  >
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex w-full flex-col items-start gap-4">
          <span className="body-16 font-medium text-label-neutral">추가 메모</span>
          <div className="flex w-full rounded-[16px] border border-neutral-95 px-[26px] py-[23px]">
            {additionalMemo || (locale === 'en' ? 'No memo available.' : '추가 메모 내용')}
          </div>
        </div>
      </div>
    </div>
  );
}

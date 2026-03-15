import type { FollowUpSessionTiming, RiskEvaluation } from '@/entities/summary/model/types';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import { Textarea } from '@/shared/ui/textarea';

interface CounselorEvaluationCardProps {
  riskEvaluation: RiskEvaluation | '';
  followUpSessionTiming: FollowUpSessionTiming | '';
  additionalMemo: string;
  onRiskEvaluationChange: (value: RiskEvaluation) => void;
  onFollowUpSessionTimingChange: (value: FollowUpSessionTiming) => void;
  onAdditionalMemoChange: (value: string) => void;
}

export default function CounselorEvaluationCard({
  riskEvaluation,
  followUpSessionTiming,
  additionalMemo,
  onRiskEvaluationChange,
  onFollowUpSessionTimingChange,
  onAdditionalMemoChange,
}: CounselorEvaluationCardProps) {
  const tSummary = useTranslations('summary');
  const riskOptions: Array<{ key: RiskEvaluation; label: string }> = [
    { key: 'stable', label: tSummary('evaluationRiskStable') },
    { key: 'caution', label: tSummary('evaluationRiskCaution') },
    { key: 'risk', label: tSummary('evaluationRiskRisk') },
    { key: 'urgent', label: tSummary('evaluationRiskUrgent') },
  ];
  const followUpOptions: Array<{ key: FollowUpSessionTiming; label: string }> = [
    { key: '1w', label: tSummary('evaluationFollowUp1w') },
    { key: '2w', label: tSummary('evaluationFollowUp2w') },
    { key: '1m', label: tSummary('evaluationFollowUp1m') },
    { key: 'as-needed', label: tSummary('evaluationFollowUpAsNeeded') },
  ];

  return (
    <div className="flex w-full flex-col items-start gap-7">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-fill-pressed">
          <Image
            src="/icons/badge-checkmark.svg"
            alt={tSummary('evaluationIconAlt')}
            width={20}
            height={20}
            aria-hidden
          />
        </div>
        <div className="text-[24px] font-semibold text-label-normal">
          {tSummary('evaluationTitle')}
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-[26px]">
        <div className="flex w-full flex-col items-start gap-4">
          <span className="body-16 font-medium text-label-neutral">
            {tSummary('evaluationRiskLevelLabel')}
          </span>
          <div className="flex w-full justify-between gap-10">
            {riskOptions.map((option, idx) => {
              const isSelected = riskEvaluation === option.key;
              return (
                <button
                  type="button"
                  key={option.key}
                  onClick={() => onRiskEvaluationChange(option.key)}
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
                    {tSummary('evaluationRiskStage', { count: idx + 1 })}
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
          <span className="body-16 font-medium text-label-neutral">
            {tSummary('evaluationFollowUpLabel')}
          </span>
          <div className="flex w-full justify-between gap-10">
            {followUpOptions.map((option) => {
              const isSelected = followUpSessionTiming === option.key;
              return (
                <button
                  type="button"
                  key={option.key}
                  onClick={() => onFollowUpSessionTimingChange(option.key)}
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
          <span className="body-16 font-medium text-label-neutral">
            {tSummary('evaluationAdditionalMemoLabel')}
          </span>
          <Textarea
            className="w-full min-h-[120px] px-[26px] py-[23px]"
            value={additionalMemo}
            onChange={(event) => onAdditionalMemoChange(event.target.value)}
            placeholder={tSummary('evaluationAdditionalMemoPlaceholder')}
          />
        </div>
      </div>
    </div>
  );
}

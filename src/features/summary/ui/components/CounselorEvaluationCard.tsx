import { Textarea } from '@/shared/ui/textarea';
import type { NextSessionRecommendation, RiskEvaluation } from '@/features/summary/types/summary';

interface CounselorEvaluationCardProps {
  locale: string;
  riskEvaluation: RiskEvaluation;
  nextSessionRecommendation: NextSessionRecommendation;
  evaluationMemo: string;
  onRiskChange: (value: RiskEvaluation) => void;
  onNextSessionChange: (value: NextSessionRecommendation) => void;
  onMemoChange: (value: string) => void;
}

export default function CounselorEvaluationCard({
  locale,
  riskEvaluation,
  nextSessionRecommendation,
  evaluationMemo,
  onRiskChange,
  onNextSessionChange,
  onMemoChange,
}: CounselorEvaluationCardProps) {
  return (
    <div className="rounded-[20px] border border-neutral-95 bg-white p-6">
      <div className="body-18 font-semibold text-label-normal">
        {locale === 'en' ? 'Counselor evaluation' : '상담사 평가'}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[
          { key: 'stable', label: locale === 'en' ? 'Stable' : '안정' },
          { key: 'caution', label: locale === 'en' ? 'Caution' : '주의' },
          { key: 'risk', label: locale === 'en' ? 'Risk' : '위험' },
          { key: 'urgent', label: locale === 'en' ? 'Urgent' : '긴급' },
        ].map((option) => (
          <label key={option.key} className="flex items-center gap-2 body-14 text-label-normal">
            <input
              type="radio"
              name="risk-eval"
              checked={riskEvaluation === option.key}
              onChange={() => onRiskChange(option.key as RiskEvaluation)}
            />
            {option.label}
          </label>
        ))}
      </div>

      <p className="mt-4 body-14 font-medium text-label-normal">
        {locale === 'en' ? 'Recommended next session' : '다음 상담 권장 시기'}
      </p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {[
          { key: '1w', label: locale === 'en' ? 'Within 1 week' : '1주 이내' },
          { key: '2w', label: locale === 'en' ? 'Within 2 weeks' : '2주 이내' },
          { key: '1m', label: locale === 'en' ? 'Within 1 month' : '1개월 이내' },
          { key: 'as-needed', label: locale === 'en' ? 'As needed' : '필요시' },
        ].map((option) => (
          <label key={option.key} className="flex items-center gap-2 body-14 text-label-normal">
            <input
              type="radio"
              name="next-recommendation"
              checked={nextSessionRecommendation === option.key}
              onChange={() => onNextSessionChange(option.key as NextSessionRecommendation)}
            />
            {option.label}
          </label>
        ))}
      </div>

      <Textarea
        value={evaluationMemo}
        onChange={(e) => onMemoChange(e.target.value)}
        className="mt-4 min-h-[90px]"
        placeholder={locale === 'en' ? 'Additional notes' : '추가 메모'}
      />
    </div>
  );
}

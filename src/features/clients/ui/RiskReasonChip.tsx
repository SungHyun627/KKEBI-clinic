import { useTranslations } from 'next-intl';

interface RiskReasonChipProps {
  value: string;
}

export default function RiskReasonChip({ value }: RiskReasonChipProps) {
  const tClients = useTranslations('clients');
  const localizedValue =
    value === '자살 언급'
      ? tClients('riskReasonSuicidalIdeationMentioned')
      : value === '자해 시도'
        ? tClients('riskReasonSelfHarmAttempt')
        : value === '타해 위험'
          ? tClients('riskReasonRiskOfHarmToOthers')
          : value;

  return (
    <span className="flex items-center justify-center gap-[3px] font-semibold rounded-[100px] border border-neutral-95 bg-white px-3 py-[3px] body-14 leading-none text-label-normal">
      {localizedValue}
    </span>
  );
}

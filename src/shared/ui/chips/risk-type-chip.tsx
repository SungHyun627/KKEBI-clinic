import type { RiskType } from '@/features/dashboard/types/schedule';

interface RiskTypeChipProps {
  value: RiskType;
}

export default function RiskTypeChip({ value }: RiskTypeChipProps) {
  const styleByValue: Record<RiskType, string> = {
    안정: 'border-[rgba(66,158,0,0.50)] bg-[rgba(66,158,0,0.10)] text-[#429E00]',
    주의: 'border-[rgba(255,146,0,0.50)] bg-[rgba(255,146,0,0.10)] text-[#FF9200]',
    위험: 'border-[rgba(229,34,34,0.50)] bg-[rgba(229,34,34,0.10)] text-[#E52222]',
  };

  return (
    <span
      className={`flex items-center justify-center gap-[3px] rounded-[100px] border px-3 py-[3px] body-14 leading-none font-semibold ${styleByValue[value]}`}
    >
      {value}
    </span>
  );
}

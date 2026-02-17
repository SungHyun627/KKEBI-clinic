import type { RiskType } from '@/features/dashboard/types/schedule';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';

interface RiskTypeChipProps {
  value: RiskType;
  className?: string;
}

export default function RiskTypeChip({ value, className }: RiskTypeChipProps) {
  const tClients = useTranslations('clients');
  const styleByValue: Record<RiskType, string> = {
    안정: 'border-[rgba(66,158,0,0.50)] bg-[rgba(66,158,0,0.10)] text-[#429E00]',
    주의: 'border-[rgba(255,146,0,0.50)] bg-[rgba(255,146,0,0.10)] text-[#FF9200]',
    위험: 'border-[rgba(229,34,34,0.50)] bg-[rgba(229,34,34,0.10)] text-[#E52222]',
  };
  const labelByValue: Record<RiskType, string> = {
    안정: tClients('filterRiskStable'),
    주의: tClients('filterRiskCaution'),
    위험: tClients('filterRiskHigh'),
  };

  return (
    <span
      className={cn(
        'flex min-h-8 max-w-[80px] items-center justify-center rounded-[100px] border px-2 py-[3px] body-14 font-semibold',
        styleByValue[value],
        className,
      )}
    >
      <span className="line-clamp-2 break-words text-center leading-[120%]">
        {labelByValue[value]}
      </span>
    </span>
  );
}

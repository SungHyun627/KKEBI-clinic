import { cn } from '@/shared/lib/utils';
import type { ClosedClientItem } from '../types/client';

interface CloseReasonChipProps {
  value: ClosedClientItem['closeReason'];
  className?: string;
}

const closeReasonStyleByValue: Record<ClosedClientItem['closeReason'], string> = {
  '회기 종료': 'border-[rgba(66,158,0,0.50)] bg-[rgba(66,158,0,0.10)] text-[#429E00]',
  '중도 탈락': 'border-[rgba(229,34,34,0.50)] bg-[rgba(229,34,34,0.10)] text-[#E52222]',
  기타: 'border-[rgba(255,146,0,0.50)] bg-[rgba(255,146,0,0.10)] text-[#FF9200]',
};

const CloseReasonChip = ({ value, className }: CloseReasonChipProps) => {
  return (
    <span
      className={cn(
        'flex min-h-7 w-[75px] items-center justify-center rounded-[100px] border px-3 py-[3px] body-14 font-semibold',
        closeReasonStyleByValue[value],
        className,
      )}
    >
      <span className="whitespace-nowrap text-center leading-[120%]">{value}</span>
    </span>
  );
};

export default CloseReasonChip;

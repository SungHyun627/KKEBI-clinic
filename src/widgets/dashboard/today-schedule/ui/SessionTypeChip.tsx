import type { SessionType } from '@/features/dashboard/types/schedule';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';

interface SessionTypeChipProps {
  value: SessionType;
  className?: string;
}

export default function SessionTypeChip({ value, className }: SessionTypeChipProps) {
  const tClients = useTranslations('clients');
  const styleByValue: Record<SessionType, string> = {
    초기: 'border-neutral-95 bg-transparent text-label-normal',
    정기: 'border-neutral-95 bg-neutral-99 text-label-normal',
    위기: 'border-neutral-90 bg-neutral-95 text-label-normal',
  };
  const labelByValue: Record<SessionType, string> = {
    초기: tClients('sessionTypeIntake'),
    정기: tClients('sessionTypeRegular'),
    위기: tClients('sessionTypeCrisis'),
  };

  return (
    <span
      className={cn(
        'flex items-center justify-center gap-[3px] whitespace-nowrap rounded-[100px] border px-3 py-[3px] body-14 leading-none font-semibold',
        styleByValue[value],
        className,
      )}
    >
      {labelByValue[value]}
    </span>
  );
}

import type { SessionType } from '@/features/dashboard/types/schedule';

interface SessionTypeChipProps {
  value: SessionType;
}

export default function SessionTypeChip({ value }: SessionTypeChipProps) {
  const styleByValue: Record<SessionType, string> = {
    초기: 'border-neutral-95 bg-transparent text-label-normal',
    정기: 'border-neutral-95 bg-neutral-99 text-label-normal',
    위기: 'border-neutral-90 bg-neutral-95 text-label-normal',
  };

  return (
    <span
      className={`flex items-center justify-center gap-[3px] rounded-[100px] border px-3 py-[3px] body-14 leading-none font-semibold ${styleByValue[value]}`}
    >
      {value}
    </span>
  );
}

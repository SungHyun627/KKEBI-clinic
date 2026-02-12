import Image from 'next/image';

interface StreakChipProps {
  days: number;
}

export default function StreakChip({ days }: StreakChipProps) {
  return (
    <span className="inline-flex items-center justify-center gap-[3px] rounded-[100px] border border-neutral-95 bg-white px-3 py-1 pl-[10px]">
      <Image src="/icons/fire.svg" alt="streak" width={16} height={16} className="shrink-0" />
      <span className="body-14 translate-y-[1px] leading-none font-medium text-label-neutral">
        {days}일
      </span>
    </span>
  );
}

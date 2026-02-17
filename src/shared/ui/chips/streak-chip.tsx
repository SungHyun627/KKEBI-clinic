import Image from 'next/image';
import { useLocale } from 'next-intl';

interface StreakChipProps {
  days: number;
  responsiveCompact?: boolean;
}

export default function StreakChip({ days, responsiveCompact = false }: StreakChipProps) {
  const locale = useLocale();
  const dayLabel = locale === 'en' ? `${days} days` : `${days}일`;

  return (
    <span className="inline-flex max-w-[80px] items-center justify-center gap-[3px] rounded-[100px] border border-neutral-95 bg-white px-3 py-1 pl-[10px]">
      <Image src="/icons/fire.svg" alt="streak" width={16} height={16} className="shrink-0" />
      {responsiveCompact ? (
        <>
          <span className="body-14 translate-y-[1px] whitespace-nowrap leading-none font-medium text-label-neutral max-[1200px]:hidden">
            {dayLabel}
          </span>
          <span className="hidden body-14 translate-y-[1px] whitespace-nowrap leading-none font-medium text-label-neutral max-[1200px]:inline">
            {days}
          </span>
        </>
      ) : (
        <span className="body-14 translate-y-[1px] whitespace-nowrap leading-none font-medium text-label-neutral">
          {dayLabel}
        </span>
      )}
    </span>
  );
}

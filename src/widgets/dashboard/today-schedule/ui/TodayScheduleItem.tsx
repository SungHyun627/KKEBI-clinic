import MoodStressToken from './MoodStressToken';
import type { TodayScheduleItem as TodayScheduleItemType } from '@/features/dashboard/types/schedule';
import { cn } from '@/shared/lib/utils';
import RiskTypeChip from './RiskTypeChip';
import SessionTypeChip from './SessionTypeChip';
import StreakChip from './StreakChip';
import TodayScheduleAction from './TodayScheduleAction';
import { useLocale, useTranslations } from 'next-intl';
import { getClientNameByLocale } from '@/shared/lib/clientNameByLocale';

interface TodayScheduleItemProps {
  schedule: TodayScheduleItemType;
  className?: string;
}

export default function TodayScheduleItem({ schedule, className }: TodayScheduleItemProps) {
  const tDashboard = useTranslations('dashboard');
  const locale = useLocale();
  const streakDays = schedule.streakDays ?? 0;
  const localizedClientName = getClientNameByLocale(schedule.clientId, schedule.clientName, locale);
  const sessionTypeChipWidthClass = locale === 'en' ? 'w-[92px] max-[1200px]:w-[84px]' : 'w-[49px]';
  const riskTypeChipWidthClass = locale === 'en' ? 'w-[104px] max-[1200px]:w-[92px]' : 'w-[49px]';

  return (
    <li
      className={cn(
        'grid w-full grid-cols-[1fr_3fr_2fr_2fr_5fr_4fr] items-center gap-3 border-x border-b border-neutral-95 bg-white px-4 py-3 max-[1200px]:gap-2 max-[1000px]:grid-cols-[4fr_2fr_2fr_5fr_4fr] max-[900px]:gap-1 max-[900px]:px-3',
        className,
      )}
    >
      <span className="body-16 min-w-0 text-label-normal max-[1000px]:hidden">{schedule.time}</span>
      <span className="flex min-w-0 max-w-full items-center gap-3 overflow-hidden">
        <span className="body-16 min-w-0 flex-1 truncate text-label-normal max-[1000px]:hidden">
          {localizedClientName}
        </span>
        <span className="hidden min-w-0 flex-1 flex-col text-label-normal max-[1000px]:flex">
          <span className="body-14">{schedule.time}</span>
          <span className="body-16 truncate">{localizedClientName}</span>
        </span>
        <span className="shrink-0 max-[1100px]:hidden">
          <StreakChip days={streakDays} responsiveCompact />
        </span>
      </span>
      <span className="min-w-0 justify-self-center overflow-hidden">
        <SessionTypeChip value={schedule.sessionType} className={sessionTypeChipWidthClass} />
      </span>
      <span className="min-w-0 justify-self-center overflow-hidden">
        <RiskTypeChip value={schedule.riskType} className={riskTypeChipWidthClass} />
      </span>
      <span className="flex min-w-0 items-center justify-start gap-2 overflow-hidden pr-2 max-[1200px]:w-fit max-[1200px]:justify-self-start">
        <MoodStressToken
          label={tDashboard('todayScheduleMood')}
          score={schedule.moodScore}
          responsiveCompact
        />
        <MoodStressToken
          label={tDashboard('todayScheduleStress')}
          score={schedule.stressScore}
          responsiveCompact
        />
      </span>
      <TodayScheduleAction clientId={schedule.clientId} clientName={localizedClientName} />
    </li>
  );
}

import MoodStressToken from './MoodStressToken';
import type { TodayScheduleItem as TodayScheduleItemType } from '@/features/dashboard/types/schedule';
import { cn } from '@/shared/lib/utils';
import RiskTypeChip from './RiskTypeChip';
import SessionTypeChip from './SessionTypeChip';
import StreakChip from './StreakChip';
import TodayScheduleAction from './TodayScheduleAction';
import { useTranslations } from 'next-intl';

interface TodayScheduleItemProps {
  schedule: TodayScheduleItemType;
  className?: string;
}

export default function TodayScheduleItem({ schedule, className }: TodayScheduleItemProps) {
  const tDashboard = useTranslations('dashboard');
  const streakDays = schedule.streakDays ?? 0;

  return (
    <li
      className={cn(
        'grid w-full grid-cols-[1fr_3fr_2fr_2fr_5fr_5fr] items-center gap-3 border-x border-b border-neutral-95 bg-white px-4 py-3',
        className,
      )}
    >
      <span className="body-16 text-label-normal">{schedule.time}</span>
      <span className="flex min-w-0 items-center gap-3">
        <span className="body-16 truncate text-label-normal">{schedule.clientName}</span>
        <StreakChip days={streakDays} />
      </span>
      <span className="justify-self-center">
        <SessionTypeChip value={schedule.sessionType} />
      </span>
      <span className="justify-self-center">
        <RiskTypeChip value={schedule.riskType} />
      </span>
      <span className="flex items-center justify-start gap-2 pr-6">
        <MoodStressToken label={tDashboard('todayScheduleMood')} score={schedule.moodScore} />
        <MoodStressToken label={tDashboard('todayScheduleStress')} score={schedule.stressScore} />
      </span>
      <TodayScheduleAction clientId={schedule.clientId} clientName={schedule.clientName} />
    </li>
  );
}

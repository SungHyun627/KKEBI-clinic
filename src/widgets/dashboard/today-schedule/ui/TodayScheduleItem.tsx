import MoodStressToken from './MoodStressToken';
import type { TodayScheduleItem as TodayScheduleItemType } from '@/features/dashboard/types/schedule';
import { cn } from '@/shared/lib/utils';
import RiskTypeChip from './RiskTypeChip';
import StreakChip from './StreakChip';
import TodayScheduleAction from './TodayScheduleAction';

interface TodayScheduleItemProps {
  schedule: TodayScheduleItemType;
  className?: string;
}

export default function TodayScheduleItem({ schedule, className }: TodayScheduleItemProps) {
  const streakDays = schedule.streakDays ?? 0;

  return (
    <li
      className={cn(
        'grid w-full grid-cols-[72px_minmax(160px,220px)_96px_72px_minmax(260px,1fr)_250px] items-center gap-3 border-x border-b border-neutral-95 bg-white px-4 py-3',
        className,
      )}
    >
      <span className="body-16 justify-self-start text-left text-label-normal">
        {schedule.time}
      </span>
      <span className="flex min-w-0 items-center gap-3">
        <span className="body-14 truncate text-label-normal">{schedule.clientName}</span>
        <StreakChip days={streakDays} />
      </span>
      <span className="body-14 justify-self-center text-center text-label-normal">
        {schedule.sessionType}
      </span>
      <span className="justify-self-center">
        <RiskTypeChip value={schedule.riskType} />
      </span>
      <span className="flex items-center justify-start gap-2 pr-6">
        <MoodStressToken label="기분" score={schedule.moodScore} />
        <MoodStressToken label="스트레스" score={schedule.stressScore} />
      </span>
      <TodayScheduleAction clientName={schedule.clientName} />
    </li>
  );
}

import type { TodayScheduleItem as TodayScheduleItemType } from '@/features/dashboard/types/schedule';
import StreakChip from './StreakChip';
import TodayScheduleAction from './TodayScheduleAction';

interface TodayScheduleItemProps {
  schedule: TodayScheduleItemType;
}

export default function TodayScheduleItem({ schedule }: TodayScheduleItemProps) {
  const streakDays = schedule.streakDays ?? 0;
  const scoreText =
    schedule.moodScore === null || schedule.stressScore === null
      ? '-'
      : `${schedule.moodScore}/5 · ${schedule.stressScore}/5`;

  return (
    <li className="grid w-full grid-cols-[72px_minmax(160px,220px)_96px_96px_minmax(180px,1fr)_180px] items-center gap-3 border-x border-b border-neutral-95 bg-white px-4 py-3">
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
      <span className="body-14 justify-self-center text-center text-label-normal">
        {schedule.riskType}
      </span>
      <span className="body-14 justify-self-start pr-6 text-left text-label-normal">
        {scoreText}
      </span>
      <TodayScheduleAction clientName={schedule.clientName} />
    </li>
  );
}

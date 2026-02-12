import type { TodayScheduleItem as TodayScheduleItemType } from '@/features/dashboard/types/schedule';
import TodayScheduleAction from './TodayScheduleAction';

interface TodayScheduleItemProps {
  schedule: TodayScheduleItemType;
}

export default function TodayScheduleItem({ schedule }: TodayScheduleItemProps) {
  const scoreText =
    schedule.moodScore === null || schedule.stressScore === null
      ? '-'
      : `${schedule.moodScore}/5 · ${schedule.stressScore}/5`;

  return (
    <li className="grid w-full grid-cols-[72px_minmax(140px,1fr)_96px_96px_180px_160px] items-center gap-3 border-x border-b border-neutral-95 bg-white px-4 py-3">
      <span className="body-14 font-semibold text-label-normal">{schedule.time}</span>
      <span className="body-14 truncate text-label-normal">
        {schedule.clientName}
        {typeof schedule.streakDays === 'number' ? ` · 🔥 ${schedule.streakDays}일` : ''}
      </span>
      <span className="body-14 text-label-normal">{schedule.sessionType}</span>
      <span className="body-14 text-label-normal">{schedule.riskType}</span>
      <span className="body-14 text-label-normal">{scoreText}</span>
      <TodayScheduleAction clientName={schedule.clientName} />
    </li>
  );
}

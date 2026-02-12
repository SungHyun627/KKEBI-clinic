import type { TodayScheduleItem as TodayScheduleItemType } from '@/features/dashboard/types/schedule';

interface TodayScheduleItemProps {
  schedule: TodayScheduleItemType;
}

export default function TodayScheduleItem({ schedule }: TodayScheduleItemProps) {
  const scoreText =
    schedule.moodScore === null || schedule.stressScore === null
      ? '-'
      : `${schedule.moodScore}/5 · ${schedule.stressScore}/5`;

  return (
    <li className="flex w-full items-center gap-4 rounded-2xl border border-neutral-95 bg-white px-4 py-3">
      <span className="body-16 w-12 shrink-0 font-semibold text-label-normal">{schedule.time}</span>
      <div className="min-w-0 flex-1">
        <p className="body-14 truncate font-medium text-label-normal">
          {schedule.clientName}
          {typeof schedule.streakDays === 'number' ? ` · 🔥 ${schedule.streakDays}일` : ''}
        </p>
        <p className="body-12 mt-1 text-label-alternative">
          {schedule.sessionType} · {schedule.riskType} · 기분/스트레스 {scoreText}
        </p>
      </div>
    </li>
  );
}

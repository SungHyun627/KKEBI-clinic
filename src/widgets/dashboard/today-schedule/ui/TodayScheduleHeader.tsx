import { useTranslations } from 'next-intl';
import TodayScheduleHeaderCell from './TodayScheduleHeaderCell';

export default function TodayScheduleHeader() {
  const tToday = useTranslations('dashboard.todaySchedule');

  return (
    <div className="grid w-full grid-cols-[1fr_3fr_2fr_2fr_5fr] items-center gap-3 rounded-t-2xl border border-neutral-95 bg-neutral-99 px-4 py-3">
      <TodayScheduleHeaderCell label={tToday('time')} />
      <TodayScheduleHeaderCell label={tToday('clientName')} />
      <TodayScheduleHeaderCell label={tToday('sessionType')} align="center" />
      <TodayScheduleHeaderCell label={tToday('riskLevel')} align="center" />
      <TodayScheduleHeaderCell label={tToday('moodStressScore')} align="left" />
      <span aria-hidden />
    </div>
  );
}

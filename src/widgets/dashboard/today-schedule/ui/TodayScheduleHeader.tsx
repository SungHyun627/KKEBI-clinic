import { useTranslations } from 'next-intl';
import TodayScheduleHeaderCell from './TodayScheduleHeaderCell';

export default function TodayScheduleHeader() {
  const tDashboard = useTranslations('dashboard');
  const mergedTimeNameHeader = `${tDashboard('todayScheduleTime')} · ${tDashboard('todayScheduleClientName')}`;

  return (
    <div className="grid w-full grid-cols-[1fr_3fr_2fr_2fr_5fr_4fr] items-center gap-3 rounded-t-2xl border border-neutral-95 bg-neutral-99 px-4 py-3 max-[1200px]:gap-2 max-[1000px]:grid-cols-[3fr_3fr_3fr_5fr_4fr] max-[900px]:gap-1 max-[900px]:px-3">
      <TodayScheduleHeaderCell
        label={tDashboard('todayScheduleTime')}
        className="max-[1000px]:hidden"
      />
      <TodayScheduleHeaderCell
        label={tDashboard('todayScheduleClientName')}
        className="max-[1000px]:hidden"
      />
      <TodayScheduleHeaderCell label={mergedTimeNameHeader} className="hidden max-[1000px]:block" />
      <TodayScheduleHeaderCell label={tDashboard('todayScheduleSessionType')} align="center" />
      <TodayScheduleHeaderCell label={tDashboard('todayScheduleRiskLevel')} align="center" />
      <TodayScheduleHeaderCell
        label={tDashboard('todayScheduleMoodStressScore')}
        align="left"
        className="max-[1200px]:justify-self-start"
      />
      <span aria-hidden />
    </div>
  );
}

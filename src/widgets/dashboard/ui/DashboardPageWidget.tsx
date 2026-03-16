import TodayScheduleSection from '@/features/dashboard/today-schedule';
import WeeklyStatisticsSection from '@/features/dashboard/weekly-statistics';
export default function DashboardPageWidget() {
  return (
    <div className="flex w-full flex-col gap-[46px]">
      <WeeklyStatisticsSection />
      <TodayScheduleSection />
    </div>
  );
}

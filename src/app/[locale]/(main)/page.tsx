import WeeklyStatisticsSection from '@/widgets/dashboard/weekly-statistics';
import TodayScheduleSection from '@/widgets/dashboard/today-schedule';

export default function DashBoard() {
  return (
    <div className="flex w-full flex-col gap-[46px]">
      <WeeklyStatisticsSection />
      <TodayScheduleSection />
    </div>
  );
}

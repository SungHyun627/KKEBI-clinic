import TodayScheduleSection from '@/features/dashboard/today-schedule';
import { getTodaySchedulesServer } from '@/features/dashboard/today-schedule/api/getTodaySchedules';
import WeeklyStatisticsSection from '@/features/dashboard/weekly-statistics';
import { getRiskAlertsServer } from '@/features/dashboard/weekly-statistics/api/getRiskAlerts';
import { getWeeklyStatisticsServer } from '@/features/dashboard/weekly-statistics/api/getWeeklyStatistics';

export default async function DashBoard() {
  const [todaySchedulesResult, weeklyStatisticsResult, riskAlertsResult] = await Promise.all([
    getTodaySchedulesServer(),
    getWeeklyStatisticsServer(),
    getRiskAlertsServer(),
  ]);

  const initialSchedules =
    todaySchedulesResult.success && Array.isArray(todaySchedulesResult.data)
      ? [...todaySchedulesResult.data].sort((a, b) => a.time.localeCompare(b.time))
      : [];
  const initialTodaySchedulesLoaded = todaySchedulesResult.success;

  const initialStatistics =
    weeklyStatisticsResult.success && weeklyStatisticsResult.data
      ? weeklyStatisticsResult.data
      : null;
  const initialRiskAlerts =
    riskAlertsResult.success && Array.isArray(riskAlertsResult.data) ? riskAlertsResult.data : [];
  const initialWeeklyStatsLoaded = weeklyStatisticsResult.success;

  return (
    <div className="flex w-full flex-col gap-[46px]">
      <WeeklyStatisticsSection
        initialStatistics={initialStatistics}
        initialRiskAlerts={initialRiskAlerts}
        initialLoaded={initialWeeklyStatsLoaded}
      />
      <TodayScheduleSection
        initialSchedules={initialSchedules}
        initialLoaded={initialTodaySchedulesLoaded}
      />
    </div>
  );
}

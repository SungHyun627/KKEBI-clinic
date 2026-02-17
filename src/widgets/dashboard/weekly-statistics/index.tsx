'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Title } from '@/shared/ui/title';
import { getWeeklyStatistics } from '@/features/dashboard';
import type { WeeklyStatistics } from '@/features/dashboard';
import WeeklyStatisticsCard from './ui/WeeklyStatisticsCard';
import RiskAlert from './ui/RiskAlert';

const WeeklyStatisticsSection = () => {
  const tDashboard = useTranslations('dashboard');
  const [statistics, setStatistics] = useState<WeeklyStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadWeeklyStatistics = async () => {
      setIsLoading(true);
      const result = await getWeeklyStatistics();

      if (!result.success || !result.data) {
        setErrorMessage(result.message || tDashboard('weeklyStatsLoadFailed'));
        setStatistics(null);
        setIsLoading(false);
        return;
      }

      setStatistics(result.data);
      setErrorMessage(null);
      setIsLoading(false);
    };

    void loadWeeklyStatistics();
  }, []);

  if (isLoading) {
    return (
      <section className="body-14 text-label-alternative">
        {tDashboard('weeklyStatsLoading')}
      </section>
    );
  }

  if (errorMessage) {
    return <section className="body-14 text-status-negative">{errorMessage}</section>;
  }

  if (!statistics) return null;
  const riskAlert = statistics.riskAlerts?.[0];

  return (
    <section
      className={riskAlert ? 'grid w-full grid-cols-[3fr_2fr] items-start gap-4' : 'flex w-full'}
    >
      <div className="flex min-w-0 flex-col justify-between gap-3">
        <Title title={tDashboard('weeklyStatsTitle')} />
        <div className="flex w-full min-w-0 flex-wrap items-start gap-4">
          <div className="flex min-w-0 flex-[1.5] basis-[560px] items-stretch gap-4">
            <div className="flex min-w-0 flex-1">
              <WeeklyStatisticsCard
                label={tDashboard('weeklyStatsCompletedSessions')}
                value={statistics.completedSessions}
                icon="/icons/complete.svg"
              />
            </div>
            <div className="flex min-w-0 flex-1">
              <WeeklyStatisticsCard
                label={tDashboard('weeklyStatsAverageSessionLength')}
                value={statistics.averageSessionMinutes}
                unit={tDashboard('weeklyStatsMinuteUnit')}
                icon="/icons/headset.svg"
              />
            </div>
            <div className="flex min-w-0 flex-1">
              <WeeklyStatisticsCard
                label={tDashboard('weeklyStatsClientImprovementRate')}
                value={statistics.clientImprovementRate}
                unit="%"
                icon="/icons/person.svg"
              />
            </div>
          </div>
        </div>
      </div>

      {riskAlert ? (
        <div className="flex min-w-0 flex-col justify-between gap-3">
          <Title title={'위험알림'} />
          <div className="min-w-0">
            <RiskAlert alert={riskAlert} />
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default WeeklyStatisticsSection;

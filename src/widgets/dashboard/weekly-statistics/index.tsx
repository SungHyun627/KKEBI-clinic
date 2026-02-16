'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Title } from '@/shared/ui/title';
import { getWeeklyStatistics } from '@/features/dashboard';
import type { WeeklyStatistics } from '@/features/dashboard';
import WeeklyStatisticsCard from './ui/WeeklyStatisticsCard';
import RiskAlert from './ui/RiskAlert';

const WeeklyStatisticsSection = () => {
  const tDashboard = useTranslations('dashboard');
  const locale = useLocale();
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
    <section className="flex w-full flex-col items-start gap-3">
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
        {riskAlert ? (
          <div
            className={`min-w-0 ${locale === 'en' ? 'w-[280px] shrink-0' : 'w-[320px] shrink-0'}`}
          >
            <RiskAlert alert={riskAlert} />
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default WeeklyStatisticsSection;

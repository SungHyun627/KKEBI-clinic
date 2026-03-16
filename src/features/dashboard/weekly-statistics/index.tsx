'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Title } from '@/shared/ui/title';
import type {
  RiskAlert as RiskAlertType,
  WeeklyStatistics,
} from '@/entities/dashboard/model/types';
import { getRiskAlerts } from './api/getRiskAlerts';
import { getWeeklyStatistics } from './api/getWeeklyStatistics';
import { subscribeNotificationReceived } from '@/features/notification/lib/notification-events';
import WeeklyStatisticsCard from './ui/WeeklyStatisticsCard';
import RiskAlert from './ui/RiskAlert';

interface WeeklyStatisticsSectionProps {
  initialStatistics?: WeeklyStatistics | null;
  initialRiskAlerts?: RiskAlertType[];
  initialLoaded?: boolean;
}

const WeeklyStatisticsSection = ({
  initialStatistics = null,
  initialRiskAlerts = [],
  initialLoaded = false,
}: WeeklyStatisticsSectionProps) => {
  const tDashboard = useTranslations('dashboard');
  const [statistics, setStatistics] = useState<WeeklyStatistics | null>(initialStatistics);
  const [riskAlerts, setRiskAlerts] = useState<RiskAlertType[]>(initialRiskAlerts);
  const [isLoading, setIsLoading] = useState(!initialLoaded);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadWeeklyStatistics = useCallback(async () => {
    setIsLoading(true);
    const [statisticsResult, riskAlertsResult] = await Promise.all([
      getWeeklyStatistics(),
      getRiskAlerts(),
    ]);

    if (!statisticsResult.success || !statisticsResult.data) {
      setErrorMessage(statisticsResult.message || tDashboard('weeklyStatsLoadFailed'));
      setStatistics(null);
      setRiskAlerts([]);
      setIsLoading(false);
      return;
    }

    setStatistics(statisticsResult.data);
    setRiskAlerts(riskAlertsResult.success && riskAlertsResult.data ? riskAlertsResult.data : []);
    setErrorMessage(null);
    setIsLoading(false);
  }, [tDashboard]);

  useEffect(() => {
    if (initialLoaded) {
      return;
    }

    const timer = window.setTimeout(() => {
      void loadWeeklyStatistics();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [initialLoaded, loadWeeklyStatistics]);

  useEffect(() => {
    const unsubscribe = subscribeNotificationReceived((notification) => {
      if (notification.type !== 'HIGH_PHQ9' && notification.type !== 'APP_INACTIVE') {
        return;
      }

      void loadWeeklyStatistics();
    });

    return unsubscribe;
  }, [loadWeeklyStatistics]);

  if (isLoading) {
    return (
      <section className="body-14 text-label-alternative">
        {tDashboard('weeklyStatsLoading')}
      </section>
    );
  }

  const hasStatistics = Boolean(statistics);
  const riskAlert = riskAlerts[0];
  const completedSessionsValue = hasStatistics ? (statistics?.completedSessions ?? '-') : '-';
  const averageSessionMinutesValue = hasStatistics
    ? (statistics?.averageSessionMinutes ?? '-')
    : '-';
  const clientImprovementRateValue = hasStatistics
    ? (statistics?.clientImprovementRate ?? '-')
    : '-';

  return (
    <section
      className={
        riskAlert
          ? 'grid w-full grid-cols-[3fr_2fr] items-start gap-4 max-[1200px]:grid-cols-1'
          : 'flex w-full'
      }
    >
      <div className="flex min-w-0 flex-col justify-between gap-3">
        <Title title={tDashboard('weeklyStatsTitle')} />
        <div className="flex w-full min-w-0 flex-wrap items-start gap-4">
          <div className="flex min-w-0 flex-[1.5] basis-[560px] items-stretch gap-4">
            <div className="flex min-w-0 flex-1">
              <WeeklyStatisticsCard
                label={tDashboard('weeklyStatsCompletedSessions')}
                value={completedSessionsValue}
                icon="/icons/complete.svg"
              />
            </div>
            <div className="flex min-w-0 flex-1">
              <WeeklyStatisticsCard
                label={tDashboard('weeklyStatsAverageSessionLength')}
                value={averageSessionMinutesValue}
                unit={tDashboard('weeklyStatsMinuteUnit')}
                icon="/icons/headset.svg"
              />
            </div>
            <div className="flex min-w-0 flex-1">
              <WeeklyStatisticsCard
                label={tDashboard('weeklyStatsClientImprovementRate')}
                value={clientImprovementRateValue}
                unit="%"
                icon="/icons/person.svg"
              />
            </div>
          </div>
          {errorMessage ? <p className="body-14 text-black">{errorMessage}</p> : null}
        </div>
      </div>

      {riskAlert ? (
        <div className="flex min-w-0 flex-col justify-between gap-3">
          <Title title={tDashboard('riskAlertsTitle')} />
          <div className="min-w-0">
            <RiskAlert alert={riskAlert} />
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default WeeklyStatisticsSection;

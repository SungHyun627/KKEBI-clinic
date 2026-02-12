'use client';

import { useEffect, useState } from 'react';
import { Title } from '@/shared/ui/title';
import { getWeeklyStatistics } from '@/features/dashboard';
import type { WeeklyStatistics } from '@/features/dashboard';
import WeeklyStatisticsCard from './ui/WeeklyStatisticsCard';
import RiskAlert from './ui/RiskAlert';

const WeeklyStatisticsSection = () => {
  const [statistics, setStatistics] = useState<WeeklyStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadWeeklyStatistics = async () => {
      setIsLoading(true);
      const result = await getWeeklyStatistics();

      if (!result.success || !result.data) {
        setErrorMessage(result.message || '주간 통계를 불러오지 못했습니다.');
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
      <section className="body-14 text-label-alternative">주간 통계를 불러오는 중입니다.</section>
    );
  }

  if (errorMessage) {
    return <section className="body-14 text-status-negative">{errorMessage}</section>;
  }

  if (!statistics) return null;

  return (
    <section className="flex w-full flex-col items-start gap-3">
      <Title title="주간 통계" />
      <div className="flex w-full items-start gap-8">
        <div className="flex min-w-0 flex-[1.5] items-stretch gap-4">
          <WeeklyStatisticsCard
            label="완료 상담 수"
            value={statistics.completedSessions}
            icon="/icons/complete.svg"
          />
          <WeeklyStatisticsCard
            label="평균 상담 시간"
            value={statistics.averageSessionMinutes}
            unit="분"
            icon="/icons/headset.svg"
          />
          <WeeklyStatisticsCard
            label="내담자 개선율"
            value={statistics.clientImprovementRate}
            unit="%"
            icon="/icons/person.svg"
          />
        </div>
        <div className="min-w-0 flex-1">
          <RiskAlert alerts={statistics.riskAlerts ?? []} />
        </div>
      </div>
    </section>
  );
};

export default WeeklyStatisticsSection;

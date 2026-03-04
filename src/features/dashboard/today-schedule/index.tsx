'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Title } from '@/shared/ui/title';
import type { TodayScheduleItem } from '../types/schedule';
import { getTodaySchedules } from './api/getTodaySchedules';
import TodayScheduleHeader from './ui/TodayScheduleHeader';
import TodayScheduleListItem from './ui/TodayScheduleItem';

export default function TodayScheduleSection() {
  const tDashboard = useTranslations('dashboard');
  const [schedules, setSchedules] = useState<TodayScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadTodaySchedules = async () => {
      setIsLoading(true);
      const result = await getTodaySchedules();

      if (!result.success || !Array.isArray(result.data)) {
        setSchedules([]);
        setErrorMessage(result.message || tDashboard('todayScheduleLoadFailed'));
        setIsLoading(false);
        return;
      }

      const sorted = [...result.data].sort((a, b) => a.time.localeCompare(b.time));
      setSchedules(sorted);
      setErrorMessage(null);
      setIsLoading(false);
    };

    void loadTodaySchedules();
  }, []);

  if (isLoading) {
    return (
      <section className="body-14 text-label-alternative">
        {tDashboard('todayScheduleLoading')}
      </section>
    );
  }

  return (
    <section className="flex w-full flex-col items-start gap-4">
      <Title title={tDashboard('todayScheduleTitle')} />
      <div className="w-full mb-[21px]">
        <TodayScheduleHeader />
        {errorMessage ? (
          <div className="body-14 flex w-full h-[180px] items-center justify-center border-x border-b border-neutral-95 bg-white py-6 text-label-alternative">
            {errorMessage}
          </div>
        ) : schedules.length === 0 ? (
          <div className="body-14 flex w-full h-[180px] items-center justify-center border-x border-b border-neutral-95 bg-white py-6 text-label-alternative">
            {tDashboard('todayScheduleEmpty')}
          </div>
        ) : (
          <ul className="flex w-full flex-col">
            {schedules.map((schedule, index) => (
              <TodayScheduleListItem
                key={schedule.id}
                schedule={schedule}
                className={[
                  index === 0 ? 'pt-4' : '',
                  index === schedules.length - 1 ? 'rounded-bl-[8px] rounded-br-[8px] pb-4' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

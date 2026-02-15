'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { getTodaySchedules } from '@/features/dashboard';
import type { TodayScheduleItem } from '@/features/dashboard';
import { Title } from '@/shared/ui/title';
import TodayScheduleHeader from './ui/TodayScheduleHeader';
import TodayScheduleListItem from './ui/TodayScheduleItem';

export default function TodayScheduleSection() {
  const tToday = useTranslations('dashboard.todaySchedule');
  const [schedules, setSchedules] = useState<TodayScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadTodaySchedules = async () => {
      setIsLoading(true);
      const result = await getTodaySchedules();

      if (!result.success || !result.data) {
        setSchedules([]);
        setErrorMessage(result.message || tToday('loadFailed'));
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
    return <section className="body-14 text-label-alternative">{tToday('loading')}</section>;
  }

  if (errorMessage) {
    return <section className="body-14 text-status-negative">{errorMessage}</section>;
  }

  return (
    <section className="flex w-full flex-col items-start gap-4">
      <Title title={tToday('title')} />
      <div className="w-full mb-3">
        <TodayScheduleHeader />
        {schedules.length === 0 ? (
          <div className="body-14 flex w-full items-center justify-center border-x border-b border-neutral-95 bg-white py-6 text-label-alternative">
            {tToday('empty')}
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

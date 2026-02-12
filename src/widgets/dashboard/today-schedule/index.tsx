'use client';

import { useEffect, useState } from 'react';
import { getTodaySchedules } from '@/features/dashboard';
import type { TodayScheduleItem } from '@/features/dashboard';
import { Title } from '@/shared/ui/title';
import TodayScheduleHeader from './ui/TodayScheduleHeader';
import TodayScheduleListItem from './ui/TodayScheduleItem';

export default function TodayScheduleSection() {
  const [schedules, setSchedules] = useState<TodayScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadTodaySchedules = async () => {
      setIsLoading(true);
      const result = await getTodaySchedules();

      if (!result.success || !result.data) {
        setSchedules([]);
        setErrorMessage(result.message || '오늘의 일정을 불러오지 못했습니다.');
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
      <section className="body-14 text-label-alternative">오늘의 일정을 불러오는 중입니다.</section>
    );
  }

  if (errorMessage) {
    return <section className="body-14 text-status-negative">{errorMessage}</section>;
  }

  return (
    <section className="flex w-full flex-col items-start gap-3">
      <Title title="오늘의 일정" />
      <div className="w-full">
        <TodayScheduleHeader />
        {schedules.length === 0 ? (
          <div className="body-14 flex w-full items-center justify-center border-x border-b border-neutral-95 bg-white py-6 text-label-alternative">
            오늘 예정된 일정이 없습니다.
          </div>
        ) : (
          <ul className="counselor-inquiry-scroll flex max-h-[420px] w-full flex-col overflow-y-auto">
            {schedules.map((schedule) => (
              <TodayScheduleListItem key={schedule.id} schedule={schedule} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

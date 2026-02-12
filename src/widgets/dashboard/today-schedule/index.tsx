'use client';

import { useEffect, useState } from 'react';
import { getTodaySchedules } from '@/features/dashboard';
import type { TodayScheduleItem } from '@/features/dashboard';
import { Title } from '@/shared/ui/title';
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
      {schedules.length === 0 ? (
        <p className="body-14 text-label-alternative">오늘 예정된 일정이 없습니다.</p>
      ) : (
        <ul className="flex w-full flex-col gap-3">
          {schedules.map((schedule) => (
            <TodayScheduleListItem key={schedule.id} schedule={schedule} />
          ))}
        </ul>
      )}
    </section>
  );
}

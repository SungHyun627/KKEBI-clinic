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
    <section className="flex w-full flex-col items-start gap-4">
      <Title title="오늘의 일정" />
      <div className="w-full mb-3">
        <div className="grid w-full grid-cols-[1fr_3fr_2fr_2fr_5fr_5fr] items-center gap-3 rounded-t-2xl border border-neutral-95 bg-neutral-99 px-4 py-3">
          <span className="body-14 font-semibold text-label-neutral">시간</span>
          <span className="body-14 font-semibold text-label-neutral">상담 유형</span>
          <span className="body-14 text-center font-semibold text-label-neutral">위험 유형</span>
          <span className="body-14 font-semibold text-label-neutral">기분 및 스트레스 점수</span>
          <span className="body-14  font-semibold text-label-neutral"></span>
        </div>
        {schedules.length === 0 ? (
          <div className="body-14 flex w-full items-center justify-center border-x border-b border-neutral-95 bg-white py-6 text-label-alternative">
            오늘 예정된 일정이 없습니다.
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

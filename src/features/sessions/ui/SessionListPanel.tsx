'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Calendar } from '@/shared/ui/calendar';
import { getSessionList } from '../api/getSessionList';
import type {
  CompletedSessionGroup,
  ScheduledSessionGroup,
  SessionStatus,
} from '../types/session-list';
import type { SessionStatusTab } from './SessionStatusTabs';
import ScheduledSessionDateSection from './ScheduledSessionDateSection';
import CompletedSessionDateSection from './CompletedSessionDateSection';

const isSessionStatusTab = (value: string | null): value is SessionStatusTab =>
  value === 'scheduled' || value === 'completed';

type SessionViewFilter = 'list' | 'calendar';

const isSessionViewFilter = (value: string | null): value is SessionViewFilter =>
  value === 'list' || value === 'calendar';

interface SessionListPanelProps {
  initialStatus?: SessionStatus;
}

const formatDate = (value: string, locale: string) => {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

const SessionListPanel = ({ initialStatus = 'scheduled' }: SessionListPanelProps) => {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const tClients = useTranslations('clients');
  const tSessions = useTranslations('sessionList');

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [scheduledGroups, setScheduledGroups] = useState<ScheduledSessionGroup[]>([]);
  const [completedGroups, setCompletedGroups] = useState<CompletedSessionGroup[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const statusParam = searchParams.get('status');
  const viewParam = searchParams.get('view');
  const emptyParam = searchParams.get('empty');
  const shouldUseEmptyData = emptyParam === '1';
  const selectedStatus: SessionStatus = isSessionStatusTab(statusParam)
    ? statusParam
    : initialStatus;
  const selectedView: SessionViewFilter = isSessionViewFilter(viewParam) ? viewParam : 'list';

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const result = await getSessionList(selectedStatus, {
        empty: shouldUseEmptyData,
        locale,
      });

      if (!result.success || !result.data) {
        setErrorMessage(tSessions('loadFailed'));
        setScheduledGroups([]);
        setCompletedGroups([]);
        setIsLoading(false);
        return;
      }

      if (selectedStatus === 'scheduled') {
        setScheduledGroups(result.data as ScheduledSessionGroup[]);
        setCompletedGroups([]);
      } else {
        setCompletedGroups(result.data as CompletedSessionGroup[]);
        setScheduledGroups([]);
      }

      setErrorMessage(null);
      setIsLoading(false);
    };

    void load();
  }, [locale, selectedStatus, shouldUseEmptyData, tSessions]);

  const hasNoData = useMemo(() => {
    return selectedStatus === 'scheduled'
      ? scheduledGroups.length === 0
      : completedGroups.length === 0;
  }, [completedGroups.length, scheduledGroups.length, selectedStatus]);

  const selectedDateText = useMemo(() => {
    return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(selectedDate);
  }, [locale, selectedDate]);

  const listContent = (() => {
    if (isLoading) {
      return (
        <div className="flex min-h-[500px] w-full items-center justify-center text-label-alternative">
          {tSessions('loading')}
        </div>
      );
    }

    if (errorMessage) {
      return (
        <div className="flex min-h-[500px] w-full items-center justify-center text-label-alternative">
          {errorMessage}
        </div>
      );
    }

    if (hasNoData) {
      return (
        <div className="flex min-h-[500px] w-full items-center justify-center text-label-alternative">
          <p className="body-18 font-medium">
            {selectedStatus === 'scheduled'
              ? tSessions('emptyScheduled')
              : tSessions('emptyCompleted')}
          </p>
        </div>
      );
    }

    return (
      <div className="mb-[46px] flex w-full flex-col gap-13">
        {selectedStatus === 'scheduled'
          ? scheduledGroups.map((group) => (
              <ScheduledSessionDateSection
                key={`scheduled-${group.date}`}
                group={group}
                dateText={formatDate(group.date, locale)}
                moodLabel={tClients('checkinMood')}
                stressLabel={tClients('checkinStress')}
              />
            ))
          : completedGroups.map((group) => (
              <CompletedSessionDateSection
                key={`completed-${group.date}`}
                group={group}
                dateText={formatDate(group.date, locale)}
                minutesUnit={tSessions('minutesUnit')}
              />
            ))}
      </div>
    );
  })();

  if (selectedView === 'calendar') {
    return (
      <div className="grid w-full grid-cols-2 items-stretch max-[1200px]:grid-cols-1 border-top border-neutral-95">
        <section className="flex h-[calc(100dvh-220px)] w-full flex-col gap-3 rounded-3xl bg-white p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (!date) return;
              setSelectedDate(date);
            }}
            className="h-full w-full p-0 [--session-calendar-max-h:calc(100dvh)]"
            classNames={{
              weekdays:
                'grid w-full grid-cols-7 gap-x-[3px] [&>*:first-child]:text-[#FA8FA8] [&>*:last-child]:text-[#7CB8FF]',
              weekday:
                'body-14 flex h-[55px] w-[33.3px] items-center justify-center px-0 pt-1 pb-[3px] font-medium text-neutral-50',
              button_previous:
                'h-6 w-6 border-0 p-0 outline-none ring-0 focus-visible:outline-none focus-visible:ring-0',
              button_next:
                'h-6 w-6 border-0 p-0 outline-none ring-0 focus-visible:outline-none focus-visible:ring-0',
              day: 'w-full h-full align-top rounded-none border-0 px-0 pt-0 pb-0 text-left font-normal hover:bg-neutral-99 hover:rounded-none data-[selected=true]:rounded-none data-[selected=true]:bg-transparent',
              day_button:
                'flex h-[calc((var(--session-calendar-max-h)-150px)/6)] w-full items-start justify-start rounded-none px-2 pt-2 pb-0 text-left leading-none font-normal',
              selected:
                'bg-transparent text-white [&>button]:flex [&>button]:h-[34px] [&>button]:w-[34px] [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:bg-primary [&>button]:p-0 [&>button]:text-white',
            }}
          />
        </section>
        <section className="h-full min-w-0">{listContent}</section>
      </div>
    );
  }

  return listContent;
};

export default SessionListPanel;

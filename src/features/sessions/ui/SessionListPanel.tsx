'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
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

export default function SessionListPanel({ initialStatus = 'scheduled' }: SessionListPanelProps) {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const tClients = useTranslations('clients');
  const tSessions = useTranslations('sessionList');

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [scheduledGroups, setScheduledGroups] = useState<ScheduledSessionGroup[]>([]);
  const [completedGroups, setCompletedGroups] = useState<CompletedSessionGroup[]>([]);

  const statusParam = searchParams.get('status');
  const emptyParam = searchParams.get('empty');
  const shouldUseEmptyData = emptyParam === '1';
  const selectedStatus: SessionStatus = isSessionStatusTab(statusParam)
    ? statusParam
    : initialStatus;

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
    <div className="flex w-full flex-col gap-13 mb-[46px]">
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
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getSessionList } from '../api/getSessionList';
import type {
  CompletedSessionGroup,
  ScheduledSessionGroup,
  SessionStatus,
} from '../types/session-list';
import type { SessionStatusTab } from '../ui/SessionStatusTabs';

export type SessionViewFilter = 'list' | 'calendar';

interface UseSessionListParams {
  initialStatus: SessionStatus;
  locale: string;
  loadFailedMessage: string;
}

const isSessionStatusTab = (value: string | null): value is SessionStatusTab =>
  value === 'scheduled' || value === 'completed';

const isSessionViewFilter = (value: string | null): value is SessionViewFilter =>
  value === 'list' || value === 'calendar';

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const useSessionList = ({
  initialStatus,
  locale,
  loadFailedMessage,
}: UseSessionListParams) => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [scheduledGroups, setScheduledGroups] = useState<ScheduledSessionGroup[]>([]);
  const [completedGroups, setCompletedGroups] = useState<CompletedSessionGroup[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const statusParam = searchParams.get('status');
  const viewParam = searchParams.get('view');
  const selectedStatus: SessionStatus = isSessionStatusTab(statusParam)
    ? statusParam
    : initialStatus;
  const selectedView: SessionViewFilter = isSessionViewFilter(viewParam) ? viewParam : 'list';

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const result = await getSessionList(selectedStatus, { locale });

      if (!result.success || !result.data) {
        setErrorMessage(loadFailedMessage);
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
  }, [locale, selectedStatus, loadFailedMessage]);

  const visibleScheduledGroups = useMemo(() => {
    if (selectedView !== 'calendar') return scheduledGroups;
    const selectedDateKey = formatDateKey(selectedDate);
    return scheduledGroups.filter((group) => group.date === selectedDateKey);
  }, [scheduledGroups, selectedDate, selectedView]);

  const visibleCompletedGroups = useMemo(() => {
    if (selectedView !== 'calendar') return completedGroups;
    const selectedDateKey = formatDateKey(selectedDate);
    return completedGroups.filter((group) => group.date === selectedDateKey);
  }, [completedGroups, selectedDate, selectedView]);

  const hasNoData = useMemo(
    () =>
      selectedStatus === 'scheduled'
        ? visibleScheduledGroups.length === 0
        : visibleCompletedGroups.length === 0,
    [selectedStatus, visibleScheduledGroups.length, visibleCompletedGroups.length],
  );

  const formatDate = (value: string) => {
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return {
    isLoading,
    errorMessage,
    selectedDate,
    setSelectedDate,
    selectedStatus,
    selectedView,
    visibleScheduledGroups,
    visibleCompletedGroups,
    hasNoData,
    formatDate,
  };
};

'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getSessionList } from '../api/getSessionList';
import type {
  CompletedSessionsResponse,
  ScheduledSessionsResponse,
  SessionStatus,
} from '../types/session-list';
import type { SessionStatusTab } from '../ui/SessionStatusTabs';
import { sessionListQueryKey } from '../lib/query-keys';

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

const isScheduledSessionsResponse = (value: unknown): value is ScheduledSessionsResponse => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<ScheduledSessionsResponse>;
  return candidate.success === true && candidate.status === 'scheduled';
};

const isCompletedSessionsResponse = (value: unknown): value is CompletedSessionsResponse => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<CompletedSessionsResponse>;
  return candidate.success === true && candidate.status === 'completed';
};

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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const statusParam = searchParams.get('status');
  const viewParam = searchParams.get('view');
  const actionParam = searchParams.get('action');
  const targetSessionId =
    actionParam === 'reschedule-request' ? searchParams.get('sessionId') : null;
  const selectedStatus: SessionStatus = isSessionStatusTab(statusParam)
    ? statusParam
    : initialStatus;
  const selectedView: SessionViewFilter = isSessionViewFilter(viewParam) ? viewParam : 'list';

  const sessionListQuery = useQuery({
    queryKey: sessionListQueryKey(selectedStatus, locale),
    queryFn: () => getSessionList(selectedStatus, { locale }),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const queryResult = sessionListQuery.data;
  const isQueryInvalid = !queryResult?.success || !queryResult?.data;
  const scheduledGroups = useMemo(
    () =>
      selectedStatus === 'scheduled' && isScheduledSessionsResponse(queryResult) && queryResult.data
        ? queryResult.data
        : [],
    [queryResult, selectedStatus],
  );
  const completedGroups = useMemo(
    () =>
      selectedStatus === 'completed' && isCompletedSessionsResponse(queryResult) && queryResult.data
        ? queryResult.data
        : [],
    [queryResult, selectedStatus],
  );
  const errorMessage = sessionListQuery.isError || isQueryInvalid ? loadFailedMessage : null;
  const isLoading = sessionListQuery.isPending;

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
    targetSessionId,
    visibleCompletedGroups,
    hasNoData,
    formatDate,
  };
};

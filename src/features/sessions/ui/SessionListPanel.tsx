'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
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

const formatDate = (value: string) => {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
};

export default function SessionListPanel({ initialStatus = 'scheduled' }: SessionListPanelProps) {
  const searchParams = useSearchParams();
  const tClients = useTranslations('clients');
  const tSessions = useTranslations('sessionList');

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [scheduledGroups, setScheduledGroups] = useState<ScheduledSessionGroup[]>([]);
  const [completedGroups, setCompletedGroups] = useState<CompletedSessionGroup[]>([]);

  const statusParam = searchParams.get('status');
  const selectedStatus: SessionStatus = isSessionStatusTab(statusParam)
    ? statusParam
    : initialStatus;

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const result = await getSessionList(selectedStatus);

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
  }, [selectedStatus, tSessions]);

  const hasNoData = useMemo(() => {
    return selectedStatus === 'scheduled'
      ? scheduledGroups.length === 0
      : completedGroups.length === 0;
  }, [completedGroups.length, scheduledGroups.length, selectedStatus]);

  if (isLoading) {
    return (
      <div className="body-14 flex h-[180px] w-full items-center justify-center rounded-2xl border border-neutral-95 bg-white text-label-alternative">
        {tSessions('loading')}
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="body-14 flex h-[180px] w-full items-center justify-center rounded-2xl border border-neutral-95 bg-white text-status-negative">
        {errorMessage}
      </div>
    );
  }

  if (hasNoData) {
    return (
      <div className="body-14 flex h-[180px] w-full items-center justify-center rounded-2xl border border-neutral-95 bg-white text-label-alternative">
        {selectedStatus === 'scheduled' ? tSessions('emptyScheduled') : tSessions('emptyCompleted')}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-13">
      {selectedStatus === 'scheduled'
        ? scheduledGroups.map((group) => (
            <ScheduledSessionDateSection
              key={`scheduled-${group.date}`}
              group={group}
              dateText={formatDate(group.date)}
              moodLabel={tClients('checkinMood')}
              stressLabel={tClients('checkinStress')}
            />
          ))
        : completedGroups.map((group) => (
            <CompletedSessionDateSection
              key={`completed-${group.date}`}
              group={group}
              dateText={formatDate(group.date)}
              minutesUnit={tSessions('minutesUnit')}
              formatDate={formatDate}
            />
          ))}
    </div>
  );
}

'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Calendar } from '@/shared/ui/calendar';
import type { SessionStatus } from '../types/session-list';
import ScheduledSessionDateSection from './ScheduledSessionDateSection';
import CompletedSessionDateSection from './CompletedSessionDateSection';
import { useSessionList } from '../hooks/useSessionList';

interface SessionListPanelProps {
  initialStatus?: SessionStatus;
}

const SessionListPanel = ({ initialStatus = 'scheduled' }: SessionListPanelProps) => {
  const locale = useLocale();
  const tClients = useTranslations('clients');
  const tSessions = useTranslations('sessionList');
  const tCommon = useTranslations('common');
  const {
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
  } = useSessionList({
    initialStatus,
    locale,
    loadFailedMessage: tSessions('loadFailed'),
    sessionExpiredMessage: tCommon('errorSessionExpired'),
    temporaryUnavailableMessage: tCommon('errorTemporaryUnavailable'),
  });

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
        <div className="flex min-h-[500px] w-full items-center justify-center text-black">
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
      <div
        className={
          selectedView === 'calendar'
            ? 'flex h-full min-h-0 w-full flex-col gap-13 overflow-hidden'
            : 'mb-[46px] flex w-full flex-col gap-13'
        }
      >
        {selectedStatus === 'scheduled'
          ? visibleScheduledGroups.map((group) => (
              <ScheduledSessionDateSection
                key={`scheduled-${group.date}`}
                group={group}
                dateText={formatDate(group.date)}
                moodLabel={tClients('checkinMood')}
                stressLabel={tClients('checkinStress')}
                viewMode={selectedView}
                targetSessionId={targetSessionId}
              />
            ))
          : visibleCompletedGroups.map((group) => (
              <CompletedSessionDateSection
                key={`completed-${group.date}`}
                group={group}
                dateText={formatDate(group.date)}
                minutesUnit={tSessions('minutesUnit')}
                viewMode={selectedView}
              />
            ))}
      </div>
    );
  })();

  if (selectedView === 'calendar') {
    return (
      <div className="grid w-full grid-cols-2 items-stretch border-t border-neutral-95 max-[1200px]:grid-cols-1">
        <section className="flex h-[calc(100dvh-220px)] w-full flex-col gap-3 rounded-3xl bg-white p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (!date) return;
              setSelectedDate(date);
            }}
            pickerPanelClassName="absolute left-1/2 top-[10px] z-20 -translate-x-1/2"
            className="h-full w-full p-0 [--session-calendar-max-h:calc(100dvh-10px)]"
            classNames={{
              month: 'space-y-7',
              month_caption: 'relative flex items-center justify-center pt-1',
              month_grid: 'w-full border-collapse',
              caption_label:
                'body-14 text-netural-30 absolute left-1/2 -translate-x-1/2 font-medium text-center pt-3',
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
        <section className="flex h-[calc(100dvh-170px)] min-h-0 min-w-0 overflow-hidden bg-neutral-99">
          {listContent}
        </section>
      </div>
    );
  }

  return listContent;
};

export default SessionListPanel;

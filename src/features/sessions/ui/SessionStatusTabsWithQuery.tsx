'use client';

import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/navigation';
import SessionStatusTabs, { type SessionStatusTab } from './SessionStatusTabs';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface SessionStatusTabsWithQueryProps {
  scheduledLabel: string;
  completedLabel: string;
  initialStatus?: SessionStatusTab;
}

const isSessionStatusTab = (value: string | null): value is SessionStatusTab =>
  value === 'scheduled' || value === 'completed';
type SessionViewFilter = 'list' | 'calendar';
const isSessionViewFilter = (value: string | null): value is SessionViewFilter =>
  value === 'list' || value === 'calendar';

export default function SessionStatusTabsWithQuery({
  scheduledLabel,
  completedLabel,
  initialStatus = 'scheduled',
}: SessionStatusTabsWithQueryProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tSessions = useTranslations('sessionList');

  const statusParam = searchParams.get('status');
  const selectedTab: SessionStatusTab = isSessionStatusTab(statusParam)
    ? statusParam
    : initialStatus;
  const viewParam = searchParams.get('view');
  const selectedView: SessionViewFilter = isSessionViewFilter(viewParam) ? viewParam : 'list';

  const replaceWithParams = (updater: (params: URLSearchParams) => void) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    updater(nextParams);
    const nextQuery = nextParams.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  };

  const handleStatusChange = (nextStatus: SessionStatusTab) => {
    replaceWithParams((params) => {
      params.set('status', nextStatus);
    });
  };

  const handleViewChange = (nextView: SessionViewFilter) => {
    replaceWithParams((params) => {
      params.set('view', nextView);
    });
  };

  const isListView = selectedView === 'list';
  const nextView: SessionViewFilter = isListView ? 'calendar' : 'list';
  const viewLabel = isListView ? tSessions('viewList') : tSessions('viewCalendar');
  const viewIcon = isListView ? '/icons/menu.svg' : '/icons/calendar-2.svg';
  const isViewToggleDisabled = true;

  return (
    <div className="flex w-full items-center justify-between">
      <SessionStatusTabs
        value={selectedTab}
        scheduledLabel={scheduledLabel}
        completedLabel={completedLabel}
        onChange={handleStatusChange}
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex items-center gap-[6px] border-none hover:bg-white p-0"
          aria-label={viewLabel}
        >
          <Image src={viewIcon} alt={viewLabel} width={24} height={24} />
          <span className="body-16 text-[rgba(0,0,0,0.80)] font-medium">{viewLabel}</span>
        </button>
        <button
          type="button"
          onClick={() => handleViewChange(nextView)}
          disabled={isViewToggleDisabled}
          aria-disabled={isViewToggleDisabled}
          className="flex items-center border-none p-0 hover:bg-white enabled:hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={viewLabel}
        >
          <Image src="/icons/sort.svg" alt={viewLabel} width={28} height={28} />
        </button>
      </div>
    </div>
  );
}

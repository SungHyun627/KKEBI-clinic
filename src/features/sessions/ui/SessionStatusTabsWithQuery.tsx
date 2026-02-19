'use client';

import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/navigation';
import SessionStatusTabs, { type SessionStatusTab } from './SessionStatusTabs';

interface SessionStatusTabsWithQueryProps {
  scheduledLabel: string;
  completedLabel: string;
  initialStatus?: SessionStatusTab;
}

const isSessionStatusTab = (value: string | null): value is SessionStatusTab =>
  value === 'scheduled' || value === 'completed';

export default function SessionStatusTabsWithQuery({
  scheduledLabel,
  completedLabel,
  initialStatus = 'scheduled',
}: SessionStatusTabsWithQueryProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const statusParam = searchParams.get('status');
  const selectedTab: SessionStatusTab = isSessionStatusTab(statusParam)
    ? statusParam
    : initialStatus;

  const handleChange = (nextStatus: SessionStatusTab) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set('status', nextStatus);
    const nextQuery = nextParams.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  };

  return (
    <SessionStatusTabs
      value={selectedTab}
      scheduledLabel={scheduledLabel}
      completedLabel={completedLabel}
      onChange={handleChange}
    />
  );
}

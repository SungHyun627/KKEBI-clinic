import type { SessionStatusTab } from './SessionStatusTabs';
import SessionListPanel from './SessionListPanel';
import SessionStatusTabsWithQuery from './SessionStatusTabsWithQuery';

interface SessionsPageContentProps {
  initialStatus: SessionStatusTab;
  scheduledLabel: string;
  completedLabel: string;
}

export default function SessionsPageContent({
  initialStatus,
  scheduledLabel,
  completedLabel,
}: SessionsPageContentProps) {
  return (
    <section className="flex w-full flex-col items-start gap-7">
      <SessionStatusTabsWithQuery
        scheduledLabel={scheduledLabel}
        completedLabel={completedLabel}
        initialStatus={initialStatus}
      />
      <SessionListPanel initialStatus={initialStatus} />
    </section>
  );
}

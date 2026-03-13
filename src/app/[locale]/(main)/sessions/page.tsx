import { getTranslations } from 'next-intl/server';
import {
  SessionListPanel,
  SessionStatusTabsWithQuery,
  type SessionStatusTab,
} from '@/features/sessions/session-list';

interface SessionsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string }>;
}

export default async function SessionsPage({ params, searchParams }: SessionsPageProps) {
  await params;
  const { status } = await searchParams;
  const tSessions = await getTranslations('sessionList');
  const initialStatus: SessionStatusTab = status === 'completed' ? 'completed' : 'scheduled';

  return (
    <section className="flex w-full flex-col items-start gap-7">
      <SessionStatusTabsWithQuery
        scheduledLabel={tSessions('tabScheduled')}
        completedLabel={tSessions('tabCompleted')}
        initialStatus={initialStatus}
      />
      <SessionListPanel initialStatus={initialStatus} />
    </section>
  );
}

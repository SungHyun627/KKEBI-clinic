import { getTranslations } from 'next-intl/server';
import type { SessionStatusTab } from '@/features/sessions/ui/SessionStatusTabs';
import SessionsPageContent from '@/features/sessions/ui/SessionsPageContent';

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
    <SessionsPageContent
      initialStatus={initialStatus}
      scheduledLabel={tSessions('tabScheduled')}
      completedLabel={tSessions('tabCompleted')}
    />
  );
}

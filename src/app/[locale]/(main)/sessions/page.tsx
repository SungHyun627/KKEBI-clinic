import { getTranslations } from 'next-intl/server';
import SessionStatusTabs from '@/features/sessions/ui/SessionStatusTabs';

interface SessionsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SessionsPage({ params }: SessionsPageProps) {
  await params;
  const tSessions = await getTranslations('sessionList');

  return (
    <section className="flex w-full flex-col items-start gap-7">
      <SessionStatusTabs
        scheduledLabel={tSessions('tabScheduled')}
        completedLabel={tSessions('tabCompleted')}
      />
    </section>
  );
}

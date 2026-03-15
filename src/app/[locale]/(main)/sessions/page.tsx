import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { getTranslations } from 'next-intl/server';
import {
  SessionListPanel,
  SessionStatusTabsWithQuery,
  type SessionStatusTab,
} from '@/features/sessions/session-list';
import { getSessionListServer } from '@/features/sessions/session-list/api/getSessionList';
import { sessionListQueryKey } from '@/features/sessions/session-list/lib/query-keys';

interface SessionsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string }>;
}

export default async function SessionsPage({ params, searchParams }: SessionsPageProps) {
  const { locale } = await params;
  const { status } = await searchParams;
  const tSessions = await getTranslations('sessionList');
  const initialStatus: SessionStatusTab = status === 'completed' ? 'completed' : 'scheduled';
  const queryClient = new QueryClient();

  await Promise.all(
    (['scheduled', 'completed'] as const).map((sessionStatus) =>
      queryClient.prefetchQuery({
        queryKey: sessionListQueryKey(sessionStatus, locale),
        queryFn: () => getSessionListServer(sessionStatus, { locale }),
      }),
    ),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section className="flex w-full flex-col items-start gap-7">
        <SessionStatusTabsWithQuery
          scheduledLabel={tSessions('tabScheduled')}
          completedLabel={tSessions('tabCompleted')}
          initialStatus={initialStatus}
        />
        <SessionListPanel initialStatus={initialStatus} />
      </section>
    </HydrationBoundary>
  );
}

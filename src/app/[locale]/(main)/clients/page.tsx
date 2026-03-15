import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { clientListQueryKey, getClientListServer } from '@/features/clients';
import ClientsPageWidget from '@/widgets/clients/ui/ClientsPageWidget';

const PAGE_SIZE = 10;

interface ClientsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ClientsPage({ params }: ClientsPageProps) {
  const { locale } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: clientListQueryKey({
      locale,
      page: 0,
      pageSize: PAGE_SIZE,
      searchKeyword: '',
      riskLevel: undefined,
    }),
    queryFn: () =>
      getClientListServer({
        page: 0,
        size: PAGE_SIZE,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientsPageWidget />
    </HydrationBoundary>
  );
}

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
    queryFn: async () => {
      const result = await getClientListServer({
        page: 0,
        size: PAGE_SIZE,
      });

      if (!result.success) {
        throw new Error(result.message ?? '내담자 목록을 불러오지 못했습니다.');
      }

      return result;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientsPageWidget />
    </HydrationBoundary>
  );
}

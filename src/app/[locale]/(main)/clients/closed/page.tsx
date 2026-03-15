import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import ClosedClientsPageClient from '@/features/clients/client-closure/ui/page/ClosedClientsPageClient';
import { getClosedClientsServer } from '@/features/clients/client-closure/api/getClosedClients';
import { closedClientsQueryKey } from '@/features/clients/client-closure/lib/query-keys';

export default async function ClosedClientsPage() {
  const queryClient = new QueryClient();
  const response = await getClosedClientsServer();

  if (response.success) {
    queryClient.setQueryData(closedClientsQueryKey, response);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClosedClientsPageClient />
    </HydrationBoundary>
  );
}

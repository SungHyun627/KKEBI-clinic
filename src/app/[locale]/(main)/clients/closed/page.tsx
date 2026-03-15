import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { getClosedClientsServer } from '@/features/clients/client-closure/api/getClosedClients';
import { closedClientsQueryKey } from '@/features/clients/client-closure/lib/query-keys';
import ClosedClientsPageWidget from '@/widgets/clients/ui/ClosedClientsPageWidget';

export default async function ClosedClientsPage() {
  const queryClient = new QueryClient();
  const response = await getClosedClientsServer();

  if (response.success) {
    queryClient.setQueryData(closedClientsQueryKey, response);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClosedClientsPageWidget />
    </HydrationBoundary>
  );
}

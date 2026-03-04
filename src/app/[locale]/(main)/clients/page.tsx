'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useClientList } from '@/features/clients';
import ClientDetailDrawer from '@/features/clients/client-detail/ui/ClientDetailDrawer';
import type { ClientLookupItem } from '@/features/clients/types/common';
import ClientListFilters from '@/features/clients/client-list/ui/ClientListFilters';
import ClientListTableSection from '@/features/clients/client-list/ui/ClientListTableSection';

export default function ClientsPage() {
  const tClients = useTranslations('clients');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const targetClientId = searchParams.get('clientId');
  const targetOpenAt = searchParams.get('openAt');
  const targetQueryKey = targetClientId ? `${targetClientId}:${targetOpenAt ?? ''}` : null;
  const fallbackConcerns = useMemo(
    () => [tClients('concernsDepression'), tClients('concernsStress'), tClients('concernsSleep')],
    [tClients],
  );
  const {
    clients,
    filteredClients,
    isLoading,
    errorMessage,
    searchKeyword,
    setSearchKeyword,
    riskFilter,
    setRiskFilter,
    isRiskFilterInteracted,
    setIsRiskFilterInteracted,
    removeClient,
  } = useClientList({
    locale,
    listLoadFailedMessage: tClients('listLoadFailed'),
    fallbackConcerns,
  });
  const [selectedClient, setSelectedClient] = useState<ClientLookupItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [dismissedQueryKey, setDismissedQueryKey] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!targetClientId || clients.length === 0) return;
    const hasMatchedClient = clients.some((item) => item.clientId === targetClientId);
    if (!hasMatchedClient) {
      router.replace(pathname, { scroll: false });
    }
  }, [clients, pathname, router, targetClientId]);

  const selectedClientFromQuery = useMemo(() => {
    if (!targetClientId) return null;
    return clients.find((item) => item.clientId === targetClientId) ?? null;
  }, [clients, targetClientId]);

  const activeClient = selectedClientFromQuery ?? selectedClient;
  const isQueryDrawerOpen = Boolean(
    targetClientId && selectedClientFromQuery && targetQueryKey !== dismissedQueryKey,
  );

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredClients.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedClients = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredClients.slice(start, start + pageSize);
  }, [filteredClients, currentPage]);

  return (
    <section className="flex w-full flex-col items-start gap-7">
      <ClientListFilters
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        riskFilter={riskFilter}
        setRiskFilter={setRiskFilter}
        isRiskFilterInteracted={isRiskFilterInteracted}
        setIsRiskFilterInteracted={setIsRiskFilterInteracted}
        locale={locale}
        labels={{
          searchPlaceholder: tClients('listSearchPlaceholder'),
          riskType: tClients('listRiskType'),
          all: tClients('listAll'),
          riskStable: tClients('filterRiskStable'),
          riskCaution: tClients('filterRiskCaution'),
          riskHigh: tClients('filterRiskHigh'),
          register: tClients('listRegister'),
          closedSessions: tClients('listClosedSessions'),
        }}
        onRegisterClick={() => router.push('/clients/new')}
        onClosedClick={() => router.push('/clients/closed')}
        onFilterChanged={() => setPage(1)}
      />
      <ClientListTableSection
        filteredCount={filteredClients.length}
        pagedClients={pagedClients}
        isLoading={isLoading}
        errorMessage={errorMessage}
        currentPage={currentPage}
        totalPages={totalPages}
        onPreviousPage={() => setPage((prev) => Math.max(1, prev - 1))}
        onNextPage={() => setPage((prev) => Math.min(totalPages, prev + 1))}
        onSelectClient={(client) => {
          setSelectedClient(client);
          setIsDrawerOpen(true);
        }}
        labels={{
          totalCount: tClients('listTotalCount', { count: filteredClients.length }),
          previous10: tClients('listPrevious10'),
          next10: tClients('listNext10'),
          time: tClients('listTime'),
          clientName: tClients('listClientName'),
          riskType: tClients('listRiskType'),
          moodStressEnergy: tClients('listMoodStressEnergyScore'),
          presentingConcern: tClients('historyPresentingConcern'),
          loading: tClients('listLoading'),
          empty: tClients('listEmpty'),
          checkinMood: tClients('checkinMood'),
          checkinStress: tClients('checkinStress'),
          checkinEnergy: tClients('checkinEnergy'),
        }}
      />

      <ClientDetailDrawer
        open={isDrawerOpen || isQueryDrawerOpen}
        onOpenChange={(nextOpen) => {
          if (!nextOpen && targetQueryKey) {
            setDismissedQueryKey(targetQueryKey);
            router.replace(pathname, { scroll: false });
          }
          if (!nextOpen) {
            setSelectedClient(null);
          }
          setIsDrawerOpen(nextOpen);
        }}
        client={activeClient}
        onClientClosed={(closedClientId) => {
          removeClient(closedClientId);
          setSelectedClient((prev) => (prev?.clientId === closedClientId ? null : prev));
          setIsDrawerOpen(false);

          if (targetQueryKey) {
            setDismissedQueryKey(targetQueryKey);
            router.replace(pathname, { scroll: false });
          }
        }}
      />
    </section>
  );
}

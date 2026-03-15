'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useClientList } from '@/features/clients';
import ClientDetailDrawer from '@/features/clients/client-detail/ui/ClientDetailDrawer';
import type { ClientLookupItem } from '@/entities/client/model/types';
import ClientListFilters from '@/features/clients/client-list/ui/ClientListFilters';
import ClientListTableSection from '@/features/clients/client-list/ui/ClientListTableSection';
import type { RiskFilter } from '@/features/clients/client-list/types/client-list';

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 300;
const toRiskFilterFromQuery = (value: string | null): RiskFilter => {
  if (value === 'high') return '위험';
  if (value === 'caution') return '주의';
  if (value === 'stable') return '안정';
  return 'all';
};

export default function ClientsPage() {
  const tClients = useTranslations('clients');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const targetClientId = searchParams.get('clientId');
  const targetOpenAt = searchParams.get('openAt');
  const targetRisk = searchParams.get('risk');
  const targetQueryKey = targetClientId ? `${targetClientId}:${targetOpenAt ?? ''}` : null;
  const fallbackConcerns = useMemo(
    () => [tClients('concernsDepression'), tClients('concernsStress'), tClients('concernsSleep')],
    [tClients],
  );
  const [searchInput, setSearchInput] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskFilter>(() => toRiskFilterFromQuery(targetRisk));
  const [isRiskFilterInteracted, setIsRiskFilterInteracted] = useState(false);
  const [page, setPage] = useState(1);
  const { clients, isLoading, errorMessage, totalElements, totalPages, removeClient } =
    useClientList({
      locale,
      listLoadFailedMessage: tClients('listLoadFailed'),
      fallbackConcerns,
      page,
      pageSize: PAGE_SIZE,
      searchKeyword,
      riskFilter,
    });
  const [selectedClient, setSelectedClient] = useState<ClientLookupItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [dismissedQueryKey, setDismissedQueryKey] = useState<string | null>(null);

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

  const normalizedTotalPages = Math.max(1, totalPages || 1);
  const currentPage = Math.min(page, normalizedTotalPages);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearchKeyword(searchInput);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchInput]);

  return (
    <section className="flex w-full flex-col items-start gap-7">
      <ClientListFilters
        searchKeyword={searchInput}
        setSearchKeyword={setSearchInput}
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
        filteredCount={totalElements}
        pagedClients={clients}
        isLoading={isLoading}
        errorMessage={errorMessage}
        currentPage={currentPage}
        totalPages={normalizedTotalPages}
        onPreviousPage={() => setPage((prev) => Math.max(1, prev - 1))}
        onNextPage={() => setPage((prev) => Math.min(normalizedTotalPages, prev + 1))}
        onSelectClient={(client) => {
          setSelectedClient(client);
          setIsDrawerOpen(true);
        }}
        labels={{
          totalCount: tClients('listTotalCount', { count: totalElements }),
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

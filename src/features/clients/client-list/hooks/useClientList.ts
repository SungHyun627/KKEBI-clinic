'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ClientLookupItem } from '@/features/clients/types/client';
import { getClientList } from '@/features/clients/client-list/api/getClientList';
import { mapClientSummariesToClients } from '@/features/clients/client-list/lib/mapClientSummariesToClients';
import type { RiskFilter } from '@/features/clients/client-list/types/client-list';

interface UseClientListParams {
  locale: string;
  listLoadFailedMessage: string;
  fallbackConcerns: string[];
}

interface UseClientListResult {
  clients: ClientLookupItem[];
  filteredClients: ClientLookupItem[];
  isLoading: boolean;
  errorMessage: string | null;
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
  riskFilter: RiskFilter;
  setRiskFilter: (value: RiskFilter) => void;
  isRiskFilterInteracted: boolean;
  setIsRiskFilterInteracted: (value: boolean) => void;
  removeClient: (clientId: string) => void;
}

const DEFAULT_PAGE_SIZE = 200;

const normalizeKeyword = (value: string) => value.trim().toLowerCase();

const matchesFilter = (client: ClientLookupItem, riskFilter: RiskFilter, keyword: string) => {
  const matchesRisk = riskFilter === 'all' ? true : client.riskType === riskFilter;
  const matchesName = keyword ? client.clientName.toLowerCase().includes(keyword) : true;
  return matchesRisk && matchesName;
};

const useClientList = ({
  locale,
  listLoadFailedMessage,
  fallbackConcerns,
}: UseClientListParams): UseClientListResult => {
  const [clients, setClients] = useState<ClientLookupItem[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('all');
  const [isRiskFilterInteracted, setIsRiskFilterInteracted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadClients = async () => {
      setIsLoading(true);
      const result = await getClientList({ page: 0, size: DEFAULT_PAGE_SIZE });

      if (!result.success || !result.data) {
        setClients([]);
        setErrorMessage(listLoadFailedMessage);
        setIsLoading(false);
        return;
      }

      setClients(mapClientSummariesToClients(result.data, locale, fallbackConcerns));
      setErrorMessage(null);
      setIsLoading(false);
    };

    void loadClients();
  }, [fallbackConcerns, listLoadFailedMessage, locale]);

  const filteredClients = useMemo(() => {
    const keyword = normalizeKeyword(searchKeyword);
    return clients.filter((client) => matchesFilter(client, riskFilter, keyword));
  }, [clients, riskFilter, searchKeyword]);

  const removeClient = (clientId: string) => {
    setClients((prev) => prev.filter((client) => client.clientId !== clientId));
  };

  return {
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
  };
};

export default useClientList;

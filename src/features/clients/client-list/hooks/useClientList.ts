'use client';

import { useEffect, useState } from 'react';
import type { ClientLookupItem } from '@/entities/client/model/types';
import { getClientList } from '@/features/clients/client-list/api/getClientList';
import { mapClientSummariesToClients } from '@/features/clients/client-list/lib/mapClientSummariesToClients';
import type { RiskFilter } from '@/features/clients/client-list/types/client-list';
import type { components } from '@/shared/api/generated-types';

interface UseClientListParams {
  locale: string;
  listLoadFailedMessage: string;
  fallbackConcerns: string[];
  page: number;
  pageSize: number;
  searchKeyword: string;
  riskFilter: RiskFilter;
}

interface UseClientListResult {
  clients: ClientLookupItem[];
  isLoading: boolean;
  errorMessage: string | null;
  totalElements: number;
  totalPages: number;
  removeClient: (clientId: string) => void;
}

type RiskLevel = NonNullable<components['schemas']['ClientSummaryResponse']['riskLevel']>;

const mapRiskFilterToRiskLevel = (riskFilter: RiskFilter): RiskLevel | undefined => {
  if (riskFilter === '안정') return 'STABLE';
  if (riskFilter === '주의') return 'CAUTION';
  if (riskFilter === '위험') return 'RISK';
  return undefined;
};

const useClientList = ({
  locale,
  listLoadFailedMessage,
  fallbackConcerns,
  page,
  pageSize,
  searchKeyword,
  riskFilter,
}: UseClientListParams): UseClientListResult => {
  const [clients, setClients] = useState<ClientLookupItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const loadClients = async () => {
      setIsLoading(true);
      const result = await getClientList({
        page: Math.max(0, page - 1),
        size: pageSize,
        name: searchKeyword.trim() || undefined,
        riskLevel: mapRiskFilterToRiskLevel(riskFilter),
      });

      if (!result.success || !result.data) {
        setClients([]);
        setTotalElements(0);
        setTotalPages(0);
        setErrorMessage(listLoadFailedMessage);
        setIsLoading(false);
        return;
      }

      setClients(mapClientSummariesToClients(result.data, locale, fallbackConcerns));
      setTotalElements(result.totalElements ?? 0);
      setTotalPages(result.totalPages ?? 0);
      setErrorMessage(null);
      setIsLoading(false);
    };

    void loadClients();
  }, [fallbackConcerns, listLoadFailedMessage, locale, page, pageSize, riskFilter, searchKeyword]);

  const removeClient = (clientId: string) => {
    setClients((prev) => prev.filter((client) => client.clientId !== clientId));
    setTotalElements((prev) => Math.max(0, prev - 1));
  };

  return {
    clients,
    isLoading,
    errorMessage,
    totalElements,
    totalPages,
    removeClient,
  };
};

export default useClientList;

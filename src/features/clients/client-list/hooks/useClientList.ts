'use client';

import { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { ClientLookupItem } from '@/entities/client/model/types';
import {
  getClientList,
  type ClientListResponse,
} from '@/features/clients/client-list/api/getClientList';
import { mapClientSummariesToClients } from '@/features/clients/client-list/lib/mapClientSummariesToClients';
import { clientListQueryKey } from '@/features/clients/client-list/lib/query-keys';
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
  const queryClient = useQueryClient();
  const normalizedPage = Math.max(0, page - 1);
  const normalizedKeyword = searchKeyword.trim() || undefined;
  const normalizedRiskLevel = mapRiskFilterToRiskLevel(riskFilter);
  const queryKey = clientListQueryKey({
    locale,
    page: normalizedPage,
    pageSize,
    searchKeyword: normalizedKeyword,
    riskLevel: normalizedRiskLevel,
  });

  const clientListQuery = useQuery({
    queryKey,
    queryFn: () =>
      getClientList({
        page: normalizedPage,
        size: pageSize,
        name: normalizedKeyword,
        riskLevel: normalizedRiskLevel,
      }),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  const clients = useMemo(() => {
    const response = clientListQuery.data;
    if (!response?.success || !response.data) return [];
    return mapClientSummariesToClients(response.data, locale, fallbackConcerns);
  }, [clientListQuery.data, fallbackConcerns, locale]);

  const totalElements =
    clientListQuery.data?.success && clientListQuery.data
      ? (clientListQuery.data.totalElements ?? 0)
      : 0;
  const totalPages =
    clientListQuery.data?.success && clientListQuery.data
      ? (clientListQuery.data.totalPages ?? 0)
      : 0;
  const hasInvalidResponse = Boolean(
    clientListQuery.data && (!clientListQuery.data.success || !clientListQuery.data.data),
  );
  const isLoading = clientListQuery.isPending || (clientListQuery.isFetching && hasInvalidResponse);
  const errorMessage = hasInvalidResponse
    ? clientListQuery.data?.message || listLoadFailedMessage
    : clientListQuery.isError
      ? listLoadFailedMessage
      : null;

  const removeClient = (clientId: string) => {
    queryClient.setQueryData<ClientListResponse>(queryKey, (prev) => {
      if (!prev?.success || !prev.data) return prev;

      return {
        ...prev,
        data: prev.data.filter((client) => String(client.id) !== clientId),
        totalElements: Math.max(0, Number(prev.totalElements ?? 0) - 1),
      };
    });
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

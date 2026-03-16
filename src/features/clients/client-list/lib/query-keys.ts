import type { components } from '@/shared/api/generated-types';

type RiskLevel = NonNullable<components['schemas']['ClientSummaryResponse']['riskLevel']>;

interface ClientListQueryKeyParams {
  locale: string;
  page: number;
  pageSize: number;
  searchKeyword?: string;
  riskLevel?: RiskLevel;
}

export const clientListQueryKey = ({
  locale,
  page,
  pageSize,
  searchKeyword,
  riskLevel,
}: ClientListQueryKeyParams) =>
  [
    'clients',
    'list',
    locale,
    page,
    pageSize,
    searchKeyword?.trim() ?? '',
    riskLevel ?? 'all',
  ] as const;

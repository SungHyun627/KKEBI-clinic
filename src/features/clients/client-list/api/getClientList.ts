import { ApiError, httpClient } from '@/shared/api/http-client';
import type { components } from '@/shared/api/generated-types';

type ClientSummaryResponse = components['schemas']['ClientSummaryResponse'];
type RiskLevel = NonNullable<ClientSummaryResponse['riskLevel']>;

interface GetClientListOptions {
  page?: number;
  size?: number;
  name?: string;
  riskLevel?: RiskLevel;
}

export interface ClientListResponse {
  success: boolean;
  data?: ClientSummaryResponse[];
  totalElements?: number;
  totalPages?: number;
  message?: string;
}

const toQueryString = (options?: GetClientListOptions) => {
  const params = new URLSearchParams();
  if (typeof options?.page === 'number') params.set('page', String(options.page));
  if (typeof options?.size === 'number') params.set('size', String(options.size));
  if (options?.name) params.set('name', options.name);
  if (options?.riskLevel) params.set('riskLevel', options.riskLevel);
  return params.toString();
};

export const getClientList = async (
  options?: GetClientListOptions,
): Promise<ClientListResponse> => {
  const query = toQueryString(options);
  const path = query ? `/api/v1/clients?${query}` : '/api/v1/clients';

  try {
    const response =
      await httpClient.get<components['schemas']['ApiResponsePageClientSummaryResponse']>(path);

    return {
      success: true,
      data: response.data?.content ?? [],
      totalElements: Number(response.data?.totalElements ?? 0),
      totalPages: Number(response.data?.totalPages ?? 0),
      message: response.message,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof ApiError
          ? error.message || '내담자 목록을 불러오지 못했습니다.'
          : error instanceof Error
            ? error.message
            : 'Network error',
    };
  }
};

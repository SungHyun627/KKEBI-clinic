import { ApiError, httpClient } from '@/shared/api/http-client';
import { isApiResponse, toBaseResponse } from '@/shared/api/base-response';
import type { components } from '@/shared/api/generated-types';

type ClientSummaryResponse = components['schemas']['ClientSummaryResponse'];
type RiskLevel = NonNullable<ClientSummaryResponse['riskLevel']>;
type ClientListApiData = components['schemas']['PageClientSummaryResponse'];

const SERVER_API_BASE_URL =
  process.env.API_BASE_URL?.replace(/\/$/, '') ??
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

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

const requestClientList = async (url: string): Promise<ClientListResponse> => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    const data = await response.json().catch(() => null);
    if (isApiResponse(data)) {
      const base = toBaseResponse<ClientListApiData>(data);
      if (!base.success || !base.data) {
        return {
          success: false,
          message: base.message ?? '내담자 목록을 불러오지 못했습니다.',
        };
      }

      return {
        success: true,
        data: base.data.content ?? [],
        totalElements: Number(base.data.totalElements ?? 0),
        totalPages: Number(base.data.totalPages ?? 0),
        message: base.message,
      };
    }

    return {
      success: false,
      message: response.ok
        ? '내담자 목록 응답 형식이 올바르지 않습니다.'
        : '내담자 목록을 불러오지 못했습니다.',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
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

export const getClientListServer = (
  options?: GetClientListOptions,
): Promise<ClientListResponse> => {
  if (!SERVER_API_BASE_URL) {
    return Promise.resolve({
      success: false,
      message: 'NEXT_PUBLIC_API_BASE_URL is not configured',
    });
  }

  const query = toQueryString(options);
  const path = query ? `/api/v1/clients?${query}` : '/api/v1/clients';
  return requestClientList(`${SERVER_API_BASE_URL}${path}`);
};

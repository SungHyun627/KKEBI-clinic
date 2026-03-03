import { ApiError, httpClient } from '@/shared/api/http-client';
import type { components } from '@/shared/api/generated-types';
import type { ClientDetailResponse } from '@/features/clients/types/client';
import { mapApiClientDetailToUi } from '@/features/clients/client-detail/lib/client-detail-mapper';

const SERVER_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

const requestClientDetailByFetch = async (url: string): Promise<ClientDetailResponse> => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    const data = await response.json().catch(() => null);
    if (typeof data === 'object' && data !== null && 'success' in data) {
      return data as ClientDetailResponse;
    }

    return {
      success: response.ok,
      message: response.ok ? undefined : '내담자 상세 정보를 불러오지 못했습니다.',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
};

export const getClientDetail = async (clientId: string): Promise<ClientDetailResponse> => {
  try {
    const response = await httpClient.get<components['schemas']['ApiResponseClientDetailResponse']>(
      `/api/v1/clients/${clientId}`,
    );

    const mapped = mapApiClientDetailToUi(response.data);
    if (!mapped) {
      return {
        success: false,
        message: response.message || '내담자 상세 정보를 불러오지 못했습니다.',
      };
    }

    return {
      success: true,
      data: mapped,
      message: response.message,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof ApiError
          ? error.message || '내담자 상세 정보를 불러오지 못했습니다.'
          : error instanceof Error
            ? error.message
            : 'Network error',
    };
  }
};

export const getClientDetailServer = (clientId: string) => {
  if (!SERVER_API_BASE_URL) {
    return Promise.resolve({
      success: false,
      message: 'NEXT_PUBLIC_API_BASE_URL is not configured',
    } satisfies ClientDetailResponse);
  }

  return requestClientDetailByFetch(`${SERVER_API_BASE_URL}/api/v1/clients/${clientId}`);
};

export const getClientDetailMock = getClientDetail;

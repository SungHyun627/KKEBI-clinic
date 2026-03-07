import { ApiError, httpClient } from '@/shared/api/http-client';
import { toBaseResponse } from '@/shared/api/base-response';
import type { ClosedClientsResponse } from '@/features/clients/client-closure/types/client-closure';

const requestClosedClients = async (): Promise<ClosedClientsResponse> => {
  try {
    const response = await httpClient.get<unknown>('/api/v1/clients/closed');
    const base = toBaseResponse<unknown>(response);
    return {
      success: base.success,
      data: Array.isArray(base.data) ? base.data : undefined,
      message: base.message,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof ApiError
          ? error.message || '종결 상담자 목록을 불러오지 못했습니다.'
          : error instanceof Error
            ? error.message
            : 'Network error',
    };
  }
};

export const getClosedClients = () => requestClosedClients();
export const getClosedClientsMock = getClosedClients;

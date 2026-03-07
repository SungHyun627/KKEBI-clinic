import { ApiError, httpClient } from '@/shared/api/http-client';
import { toBaseResponse } from '@/shared/api/base-response';
import type {
  ClientClosePayload,
  ClientCloseResponse,
} from '@/features/clients/client-closure/types/client-closure';

const requestCloseClient = async (
  clientId: string,
  payload: ClientClosePayload,
): Promise<ClientCloseResponse> => {
  try {
    const response = await httpClient.post<unknown>(`/api/v1/clients/${clientId}/close`, payload);
    const base = toBaseResponse<unknown>(response);

    return {
      success: base.success,
      data:
        base.data && typeof base.data === 'object'
          ? (base.data as ClientCloseResponse['data'])
          : undefined,
      message: base.message,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof ApiError
          ? error.message || '내담자 종결 처리에 실패했습니다.'
          : error instanceof Error
            ? error.message
            : 'Network error',
    };
  }
};

export const closeClient = (clientId: string, payload: ClientClosePayload) =>
  requestCloseClient(clientId, payload);
export const closeClientMock = closeClient;

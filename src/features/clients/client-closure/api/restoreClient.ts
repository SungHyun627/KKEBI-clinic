import { ApiError, httpClient } from '@/shared/api/http-client';
import { toBaseResponse } from '@/shared/api/base-response';
import type { ClientRestoreResponse } from '@/features/clients/client-closure/types/client-closure';

const requestRestoreClient = async (clientId: string): Promise<ClientRestoreResponse> => {
  try {
    const response = await httpClient.patch<unknown>(`/api/v1/clients/${clientId}/restore`);
    const base = toBaseResponse<unknown>(response);

    return {
      success: base.success,
      data:
        base.data && typeof base.data === 'object'
          ? (base.data as ClientRestoreResponse['data'])
          : undefined,
      message: base.message,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof ApiError
          ? error.message || '내담자 복구 처리에 실패했습니다.'
          : error instanceof Error
            ? error.message
            : 'Network error',
    };
  }
};

export const restoreClient = (clientId: string) => requestRestoreClient(clientId);
export const restoreClientMock = restoreClient;

import type { ClientRestoreResponse } from '../types/client';

const requestRestoreClient = async (url: string): Promise<ClientRestoreResponse> => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json().catch(() => null);
    if (typeof data === 'object' && data !== null && 'success' in data) {
      return data as ClientRestoreResponse;
    }

    return {
      success: response.ok,
      message: response.ok ? undefined : '내담자 복구 처리에 실패했습니다.',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
};

export const restoreClient = (clientId: string) =>
  requestRestoreClient(`/api/v1/clients/${clientId}/restore`);
export const restoreClientMock = restoreClient;

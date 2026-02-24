import type { ClientClosePayload, ClientCloseResponse } from '../types/client';

const requestCloseClient = async (
  url: string,
  payload: ClientClosePayload,
): Promise<ClientCloseResponse> => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);
    if (typeof data === 'object' && data !== null && 'success' in data) {
      return data as ClientCloseResponse;
    }

    return {
      success: response.ok,
      message: response.ok ? undefined : '내담자 종결 처리에 실패했습니다.',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
};

export const closeClientMock = (clientId: string, payload: ClientClosePayload) =>
  requestCloseClient(`/api/v1/clients/${clientId}/close`, payload);

// 현재 화면은 데모 API를 기본으로 사용합니다.
export const closeClient = closeClientMock;

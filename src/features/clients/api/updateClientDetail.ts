import type { ClientDetailUpdatePayload, ClientDetailUpdateResponse } from '../types/client';

const requestUpdateClientDetail = async (
  url: string,
  payload: ClientDetailUpdatePayload,
): Promise<ClientDetailUpdateResponse> => {
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);
    if (typeof data === 'object' && data !== null && 'success' in data) {
      return data as ClientDetailUpdateResponse;
    }

    return {
      success: response.ok,
      message: response.ok ? undefined : '내담자 상세 정보 저장에 실패했습니다.',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
};

export const updateClientDetailMock = (clientId: string, payload: ClientDetailUpdatePayload) =>
  requestUpdateClientDetail(`/api/v1/clients/${clientId}`, payload);

// 현재 화면은 데모 API를 기본으로 사용합니다.
export const updateClientDetail = updateClientDetailMock;

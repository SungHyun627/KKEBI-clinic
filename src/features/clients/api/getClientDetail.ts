import type { ClientDetailResponse } from '../types/client';

const SERVER_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

const requestClientDetail = async (url: string): Promise<ClientDetailResponse> => {
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

export const getClientDetailMock = (clientId: string) =>
  requestClientDetail(`/api/v1/clients/${clientId}`);

export const getClientDetailServer = (clientId: string) => {
  if (!SERVER_API_BASE_URL) {
    return Promise.resolve({
      success: false,
      message: 'NEXT_PUBLIC_API_BASE_URL is not configured',
    } satisfies ClientDetailResponse);
  }

  return requestClientDetail(`${SERVER_API_BASE_URL}/api/v1/clients/${clientId}`);
};

// 현재 화면은 데모 API를 기본으로 사용합니다.
export const getClientDetail = getClientDetailMock;

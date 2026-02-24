import type { ClosedClientsResponse } from '../types/client';

const requestClosedClients = async (url: string): Promise<ClosedClientsResponse> => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    const data = await response.json().catch(() => null);
    if (typeof data === 'object' && data !== null && 'success' in data) {
      return data as ClosedClientsResponse;
    }

    return {
      success: response.ok,
      message: response.ok ? undefined : '종결 상담자 목록을 불러오지 못했습니다.',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
};

export const getClosedClientsMock = () => requestClosedClients('/api/v1/clients/closed');

export const getClosedClients = getClosedClientsMock;

import type { SessionListResponse, SessionStatus } from '../types/session-list';

const SERVER_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

const requestSessionList = async (url: string): Promise<SessionListResponse> => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    const data = await response.json().catch(() => null);
    if (typeof data === 'object' && data !== null && 'success' in data) {
      return data as SessionListResponse;
    }

    return {
      success: false,
      status: 'scheduled',
      message: response.ok ? undefined : '상담 세션 목록을 불러오지 못했습니다.',
    };
  } catch (error) {
    return {
      success: false,
      status: 'scheduled',
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
};

export const getSessionListMock = (status: SessionStatus = 'scheduled') =>
  requestSessionList(`/api/v1/sessions?status=${status}`);

export const getSessionListServer = (status: SessionStatus = 'scheduled') => {
  if (!SERVER_API_BASE_URL) {
    return Promise.resolve({
      success: false,
      status,
      message: 'NEXT_PUBLIC_API_BASE_URL is not configured',
    } satisfies SessionListResponse);
  }

  return requestSessionList(`${SERVER_API_BASE_URL}/api/v1/sessions?status=${status}`);
};

// 현재 화면은 데모 API를 기본으로 사용합니다.
export const getSessionList = getSessionListMock;

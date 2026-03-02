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

interface GetSessionListOptions {
  empty?: boolean;
  locale?: string;
}

const toQueryString = (status: SessionStatus, options?: GetSessionListOptions) => {
  const params = new URLSearchParams({ status });
  if (options?.empty) {
    params.set('empty', '1');
  }
  if (options?.locale) {
    params.set('locale', options.locale);
  }
  return params.toString();
};

export const getSessionList = (
  status: SessionStatus = 'scheduled',
  options?: GetSessionListOptions,
) => requestSessionList(`/api/v1/sessions?${toQueryString(status, options)}`);

export const getSessionListServer = (
  status: SessionStatus = 'scheduled',
  options?: GetSessionListOptions,
) => {
  if (!SERVER_API_BASE_URL) {
    return Promise.resolve({
      success: false,
      status,
      message: 'NEXT_PUBLIC_API_BASE_URL is not configured',
    } satisfies SessionListResponse);
  }

  return requestSessionList(
    `${SERVER_API_BASE_URL}/api/v1/sessions?${toQueryString(status, options)}`,
  );
};

export const getSessionListMock = getSessionList;

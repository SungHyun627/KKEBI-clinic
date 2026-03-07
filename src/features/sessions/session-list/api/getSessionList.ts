import { ApiError, httpClient } from '@/shared/api/http-client';
import { isApiResponse, toBaseResponse } from '@/shared/api/base-response';
import { mapBackendSessionListResponse } from '../lib/mapSessionListResponse';
import type { SessionListResponse, SessionStatus } from '../types/session-list';

const SERVER_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

const requestSessionList = async (
  url: string,
  status: SessionStatus,
): Promise<SessionListResponse> => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    const data = await response.json().catch(() => null);
    if (isApiResponse(data)) {
      const base = toBaseResponse(data);
      if (!base.success) {
        return {
          success: false,
          status,
          message: base.message ?? '상담 세션 목록을 불러오지 못했습니다.',
        };
      }
      const mapped = mapBackendSessionListResponse(data, status);
      if (mapped) {
        return mapped;
      }
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
  locale?: string;
}

const toQueryString = (status: SessionStatus, options?: GetSessionListOptions) => {
  const params = new URLSearchParams({ status });
  if (options?.locale) {
    params.set('locale', options.locale);
  }
  return params.toString();
};

export const getSessionList = (
  status: SessionStatus = 'scheduled',
  options?: GetSessionListOptions,
) =>
  (async (): Promise<SessionListResponse> => {
    try {
      const data = await httpClient.get<unknown>(
        `/api/v1/sessions?${toQueryString(status, options)}`,
      );
      if (isApiResponse(data)) {
        const base = toBaseResponse(data);
        if (!base.success) {
          return {
            success: false,
            status,
            message: base.message ?? '상담 세션 목록을 불러오지 못했습니다.',
          };
        }
        const mapped = mapBackendSessionListResponse(data, status);
        if (mapped) {
          return mapped;
        }
      }

      return {
        success: false,
        status,
        message: '상담 세션 목록을 불러오지 못했습니다.',
      };
    } catch (error) {
      return {
        success: false,
        status,
        message:
          error instanceof ApiError
            ? error.message || '상담 세션 목록을 불러오지 못했습니다.'
            : error instanceof Error
              ? error.message
              : 'Network error',
      };
    }
  })();

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
    status,
  );
};

export const getSessionListMock = getSessionList;

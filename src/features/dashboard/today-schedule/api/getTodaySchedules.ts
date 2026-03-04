import { ApiError, httpClient } from '@/shared/api/http-client';
import type { TodayScheduleResponse } from '../../types/schedule';

const SERVER_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

type BackendEnvelope<TData> = {
  code?: string;
  message?: string;
  data?: TData;
};

const normalizeTodaySchedulesResponse = (
  payload: unknown,
  fallbackMessage: string,
): TodayScheduleResponse => {
  if (typeof payload !== 'object' || payload === null) {
    return { success: false, message: fallbackMessage };
  }

  if ('success' in payload) {
    return payload as TodayScheduleResponse;
  }

  if ('data' in payload) {
    const envelope = payload as BackendEnvelope<TodayScheduleResponse['data']>;
    return {
      success: true,
      data: envelope.data,
      message: envelope.message,
    };
  }

  return { success: false, message: fallbackMessage };
};

const requestTodaySchedules = async (url: string): Promise<TodayScheduleResponse> => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    const data = await response.json().catch(() => null);
    if (response.ok) {
      return normalizeTodaySchedulesResponse(data, '오늘의 일정을 불러오지 못했습니다.');
    }

    return {
      success: false,
      message:
        (typeof data === 'object' &&
        data !== null &&
        'message' in data &&
        typeof data.message === 'string'
          ? data.message
          : undefined) || '오늘의 일정을 불러오지 못했습니다.',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
};

export const getTodaySchedules = async (): Promise<TodayScheduleResponse> => {
  try {
    const response = await httpClient.get<unknown>('/api/v1/dashboard/today-schedules');
    return normalizeTodaySchedulesResponse(response, '오늘의 일정을 불러오지 못했습니다.');
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof ApiError
          ? error.message || '오늘의 일정을 불러오지 못했습니다.'
          : error instanceof Error
            ? error.message
            : 'Network error',
    };
  }
};

export const getTodaySchedulesServer = () => {
  if (!SERVER_API_BASE_URL) {
    return Promise.resolve({
      success: false,
      message: 'NEXT_PUBLIC_API_BASE_URL is not configured',
    } satisfies TodayScheduleResponse);
  }

  return requestTodaySchedules(`${SERVER_API_BASE_URL}/api/v1/dashboard/today-schedules`);
};

export const getTodaySchedulesMock = getTodaySchedules;

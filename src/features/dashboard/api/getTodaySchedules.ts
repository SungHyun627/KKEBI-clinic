import { ApiError, httpClient } from '@/shared/api/http-client';
import type { TodayScheduleResponse } from '../types/schedule';

const SERVER_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

const requestTodaySchedules = async (url: string): Promise<TodayScheduleResponse> => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    const data = await response.json().catch(() => null);
    if (typeof data === 'object' && data !== null && 'success' in data) {
      return data as TodayScheduleResponse;
    }

    return {
      success: response.ok,
      message: response.ok ? undefined : '오늘의 일정을 불러오지 못했습니다.',
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
    return await httpClient.get<TodayScheduleResponse>('/api/v1/dashboard/today-schedules');
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

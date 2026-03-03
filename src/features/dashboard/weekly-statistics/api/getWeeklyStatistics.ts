import { ApiError, httpClient } from '@/shared/api/http-client';
import type { WeeklyStatisticsResponse } from '../../types/statistics';

const SERVER_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

const requestWeeklyStatistics = async (url: string): Promise<WeeklyStatisticsResponse> => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    const data = await response.json().catch(() => null);
    if (typeof data === 'object' && data !== null && 'success' in data) {
      return data as WeeklyStatisticsResponse;
    }

    return {
      success: response.ok,
      message: response.ok ? undefined : '주간 통계를 불러오지 못했습니다.',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
};

export const getWeeklyStatistics = async (): Promise<WeeklyStatisticsResponse> => {
  try {
    return await httpClient.get<WeeklyStatisticsResponse>('/api/v1/dashboard/weekly-statistics');
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof ApiError
          ? error.message || '주간 통계를 불러오지 못했습니다.'
          : error instanceof Error
            ? error.message
            : 'Network error',
    };
  }
};

export const getWeeklyStatisticsServer = () => {
  if (!SERVER_API_BASE_URL) {
    return Promise.resolve({
      success: false,
      message: 'NEXT_PUBLIC_API_BASE_URL is not configured',
    } satisfies WeeklyStatisticsResponse);
  }

  return requestWeeklyStatistics(`${SERVER_API_BASE_URL}/api/v1/dashboard/weekly-statistics`);
};

export const getWeeklyStatisticsMock = getWeeklyStatistics;

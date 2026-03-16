import { httpClient } from '@/shared/api/http-client';
import type { WeeklyStatisticsResponse } from '../../types/statistics';
import { normalizeWeeklyStatistics } from '../lib/mapWeeklyStatisticsResponse';

const SERVER_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
const COUNSELOR_WEEKLY_STATS_PATH = '/api/v1/counselor/dashboard/weekly-stats';

type BackendEnvelope<TData> = {
  success?: boolean;
  code?: string;
  message?: string;
  data?: TData;
};

const normalizeWeeklyStatisticsResponse = (
  payload: unknown,
  fallbackMessage: string,
): WeeklyStatisticsResponse => {
  if (typeof payload !== 'object' || payload === null) {
    return { success: false, message: fallbackMessage };
  }

  if ('success' in payload) {
    const response = payload as BackendEnvelope<unknown>;
    if (!response.success) {
      return {
        success: false,
        message: response.message || fallbackMessage,
      };
    }

    const mapped = normalizeWeeklyStatistics(response.data);
    if (!mapped) {
      return { success: false, message: fallbackMessage };
    }

    return {
      success: true,
      data: mapped,
      message: response.message,
    };
  }

  if ('data' in payload) {
    const envelope = payload as BackendEnvelope<unknown>;
    const mapped = normalizeWeeklyStatistics(envelope.data);
    if (!mapped) {
      return { success: false, message: fallbackMessage };
    }

    return {
      success: true,
      data: mapped,
      message: envelope.message,
    };
  }

  return { success: false, message: fallbackMessage };
};

const requestWeeklyStatistics = async (url: string): Promise<WeeklyStatisticsResponse> => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    const data = await response.json().catch(() => null);
    if (response.ok) {
      return normalizeWeeklyStatisticsResponse(data, '주간 통계를 불러오지 못했습니다.');
    }

    return {
      success: false,
      message:
        (typeof data === 'object' &&
        data !== null &&
        'message' in data &&
        typeof data.message === 'string'
          ? data.message
          : undefined) || '주간 통계를 불러오지 못했습니다.',
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
    const response = await httpClient.get<unknown>(COUNSELOR_WEEKLY_STATS_PATH);
    return normalizeWeeklyStatisticsResponse(response, '주간 통계를 불러오지 못했습니다.');
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
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
  return requestWeeklyStatistics(`${SERVER_API_BASE_URL}${COUNSELOR_WEEKLY_STATS_PATH}`);
};

export const getWeeklyStatisticsMock = getWeeklyStatistics;

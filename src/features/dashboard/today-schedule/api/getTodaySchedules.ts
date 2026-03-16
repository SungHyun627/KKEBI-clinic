import { httpClient } from '@/shared/api/http-client';
import type { TodayScheduleResponse } from '../../types/schedule';
import { normalizeTodaySchedules } from '../lib/mapTodaySchedulesResponse';

const SERVER_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
const COUNSELOR_TODAY_SCHEDULE_PATH = '/api/v1/counselor/dashboard/today-schedule';

type BackendEnvelope<TData> = {
  success?: boolean;
  code?: string;
  message?: string;
  data?: TData;
};

const extractSchedules = (data: unknown): TodayScheduleResponse['data'] | undefined => {
  if (Array.isArray(data)) {
    return data as TodayScheduleResponse['data'];
  }

  if (typeof data !== 'object' || data === null) {
    return undefined;
  }

  const candidates = ['schedules', 'todaySchedules', 'items', 'content', 'results'] as const;
  for (const key of candidates) {
    const value = (data as Record<string, unknown>)[key];
    if (Array.isArray(value)) {
      return value as TodayScheduleResponse['data'];
    }
  }

  return undefined;
};

const toNormalizedSchedules = (data: unknown): TodayScheduleResponse['data'] | undefined => {
  const schedules = extractSchedules(data);
  if (!schedules) {
    return undefined;
  }

  return normalizeTodaySchedules(schedules);
};

const normalizeTodaySchedulesResponse = (
  payload: unknown,
  fallbackMessage: string,
): TodayScheduleResponse => {
  if (typeof payload !== 'object' || payload === null) {
    return { success: false, message: fallbackMessage };
  }

  if ('success' in payload) {
    const response = payload as TodayScheduleResponse;
    const schedules = toNormalizedSchedules(response.data);
    if (!schedules) {
      return {
        success: false,
        message: response.message || fallbackMessage,
      };
    }
    return {
      success: true,
      data: schedules,
      message: response.message,
    };
  }

  if ('code' in payload) {
    const envelope = payload as BackendEnvelope<TodayScheduleResponse['data']>;
    const schedules = toNormalizedSchedules(envelope.data);
    if (!schedules) {
      return {
        success: false,
        message: envelope.message || fallbackMessage,
      };
    }
    return {
      success: true,
      data: schedules,
      message: envelope.message,
    };
  }

  if ('data' in payload) {
    const envelope = payload as BackendEnvelope<TodayScheduleResponse['data']>;
    const schedules = toNormalizedSchedules(envelope.data);
    if (!schedules) {
      return {
        success: false,
        message: envelope.message || fallbackMessage,
      };
    }
    return {
      success: true,
      data: schedules,
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
    const response = await httpClient.get<unknown>(COUNSELOR_TODAY_SCHEDULE_PATH);
    return normalizeTodaySchedulesResponse(response, '오늘의 일정을 불러오지 못했습니다.');
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
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
  return requestTodaySchedules(`${SERVER_API_BASE_URL}${COUNSELOR_TODAY_SCHEDULE_PATH}`);
};

export const getTodaySchedulesMock = getTodaySchedules;

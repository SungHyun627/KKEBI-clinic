import { NextResponse } from 'next/server';
import { getActiveSchedules } from '@/shared/mock/client-lifecycle-store';
import { proxyToBackend } from '@/shared/server/backend-proxy';
import {
  extractScheduleItems,
  normalizeTodaySchedules,
} from '@/features/dashboard/today-schedule/lib/mapTodaySchedulesResponse';

const getTodaySchedulesMockResponse = () =>
  NextResponse.json({
    success: true,
    data: getActiveSchedules(),
  });

export const GET = async (request: Request) => {
  const proxied = await proxyToBackend(request, {
    path: '/api/v1/counselor/dashboard/today-schedule',
    method: 'GET',
  });

  if (!proxied.ok) {
    return proxied;
  }

  const payload = await proxied
    .clone()
    .json()
    .catch(() => null);
  if (typeof payload !== 'object' || payload === null) {
    return getTodaySchedulesMockResponse();
  }

  if ('success' in payload) {
    const response = payload as { success?: boolean; data?: unknown; message?: unknown };
    if (!response.success) {
      return proxied;
    }
    const schedules = extractScheduleItems(response.data);
    if (!schedules || schedules.length === 0) {
      return getTodaySchedulesMockResponse();
    }
    return NextResponse.json({
      success: true,
      data: normalizeTodaySchedules(schedules),
      message: typeof response.message === 'string' ? response.message : undefined,
    });
  }

  if ('data' in payload) {
    const response = payload as { data?: unknown; message?: unknown };
    const schedules = extractScheduleItems(response.data);
    if (!schedules || schedules.length === 0) {
      return getTodaySchedulesMockResponse();
    }
    return NextResponse.json({
      success: true,
      data: normalizeTodaySchedules(schedules),
      message: typeof response.message === 'string' ? response.message : undefined,
    });
  }

  return getTodaySchedulesMockResponse();
};

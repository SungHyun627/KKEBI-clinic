import { NextResponse } from 'next/server';
import { getActiveSchedules } from '@/shared/mock/client-lifecycle-store';
import { proxyToBackend } from '@/shared/server/backend-proxy';

const getTodaySchedulesMockResponse = () =>
  NextResponse.json({
    success: true,
    data: getActiveSchedules(),
  });

export const GET = async (request: Request) => {
  try {
    const proxied = await proxyToBackend(request, {
      path: '/api/v1/counselor/dashboard/today-schedule',
      method: 'GET',
    });

    return getTodaySchedulesMockResponse();
  } catch {
    return getTodaySchedulesMockResponse();
  }
};

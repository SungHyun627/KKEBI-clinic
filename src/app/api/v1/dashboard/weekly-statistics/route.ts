import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/shared/server/backend-proxy';

const getWeeklyStatisticsMockResponse = () =>
  NextResponse.json({
    success: true,
    data: {
      completedSessions: 12,
      averageSessionMinutes: 47,
      clientImprovementRate: 68,
    },
  });

export const GET = async (request: Request) => {
  try {
    const proxied = await proxyToBackend(request, {
      path: '/api/v1/counselor/dashboard/weekly-stats',
      method: 'GET',
    });

    return getWeeklyStatisticsMockResponse();
  } catch {
    return getWeeklyStatisticsMockResponse();
  }
};

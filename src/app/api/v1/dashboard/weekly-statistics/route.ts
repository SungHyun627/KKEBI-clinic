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
      path: '/api/v1/dashboard/weekly-statistics',
      method: 'GET',
    });

    if (proxied.status < 500) {
      return proxied;
    }

    return getWeeklyStatisticsMockResponse();
  } catch {
    return getWeeklyStatisticsMockResponse();
  }
};

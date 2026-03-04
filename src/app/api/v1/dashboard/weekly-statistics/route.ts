import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/shared/server/backend-proxy';
import { resolveWeeklyStatisticsPayload } from '@/features/dashboard/weekly-statistics/lib/mapWeeklyStatisticsResponse';

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
  const proxied = await proxyToBackend(request, {
    path: '/api/v1/counselor/dashboard/weekly-stats',
    method: 'GET',
  });

  if (!proxied.ok) {
    return proxied;
  }

  const payload = await proxied
    .clone()
    .json()
    .catch(() => null);

  const resolved = resolveWeeklyStatisticsPayload(payload);
  if (resolved.type === 'mock') {
    return getWeeklyStatisticsMockResponse();
  }

  if (resolved.type === 'passthrough') {
    return proxied;
  }

  return NextResponse.json({
    success: true,
    data: resolved.data,
    message: resolved.message,
  });
};

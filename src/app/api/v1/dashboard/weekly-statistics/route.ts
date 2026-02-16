import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      completedSessions: 12,
      averageSessionMinutes: 47,
      clientImprovementRate: 68,
      riskAlerts: [
        {
          clientId: 'client_1001',
          clientName: '김하늘',
          reasonKey: 'riskAlertsPhqIncreased',
          detailPath: '/clients/client_1001',
        },
        {
          clientId: 'client_1007',
          clientName: '박준서',
          reasonKey: 'riskAlertsNoAppActivity7Days',
          detailPath: '/clients/client_1007',
        },
      ],
    },
  });
}

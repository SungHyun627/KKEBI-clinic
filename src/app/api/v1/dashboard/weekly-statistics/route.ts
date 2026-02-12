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
          reason: '최근 PHQ-9 점수가 21점으로 상승했습니다.',
          detailPath: '/clients/client_1001',
        },
        {
          clientId: 'client_1007',
          clientName: '박준서',
          reason: '7일 이상 앱 미사용 상태가 감지되었습니다.',
          detailPath: '/clients/client_1007',
        },
      ],
    },
  });
}

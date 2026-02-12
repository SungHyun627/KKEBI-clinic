import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: [
      {
        id: 'schedule-1',
        time: '09:30',
        clientId: 'client_1001',
        clientName: '김하늘',
        sessionType: '정기',
        riskType: '주의',
        moodScore: 3,
        stressScore: 4,
        streakDays: 5,
      },
      {
        id: 'schedule-2',
        time: '11:00',
        clientId: 'client_1007',
        clientName: '박준서',
        sessionType: '위기',
        riskType: '위험',
        moodScore: 2,
        stressScore: 5,
        streakDays: 12,
      },
      {
        id: 'schedule-3',
        time: '14:30',
        clientId: 'client_1013',
        clientName: '최민수',
        sessionType: '초기',
        riskType: '안정',
        moodScore: null,
        stressScore: null,
      },
    ],
  });
}

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      completedSessions: 12,
      averageSessionMinutes: 47,
      clientImprovementRate: 68,
    },
  });
}

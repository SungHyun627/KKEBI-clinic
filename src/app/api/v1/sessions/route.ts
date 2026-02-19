import { NextResponse } from 'next/server';
import { COMPLETED_SESSIONS_MOCK, SCHEDULED_SESSIONS_MOCK } from '@/shared/mock/sessions';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  if (status === 'completed') {
    return NextResponse.json({
      success: true,
      status: 'completed',
      data: COMPLETED_SESSIONS_MOCK,
    });
  }

  return NextResponse.json({
    success: true,
    status: 'scheduled',
    data: SCHEDULED_SESSIONS_MOCK,
  });
}

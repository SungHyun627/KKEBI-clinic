import { NextResponse } from 'next/server';
import { TODAY_SCHEDULES_MOCK } from '@/shared/mock/today-schedules';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: TODAY_SCHEDULES_MOCK,
  });
}

import { NextResponse } from 'next/server';
import { getCompletedSessionsMock, getScheduledSessionsMock } from '@/shared/mock/sessions';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const isEmpty = searchParams.get('empty') === '1';
  const locale = searchParams.get('locale') === 'en' ? 'en' : 'ko';

  if (status === 'completed') {
    return NextResponse.json({
      success: true,
      status: 'completed',
      data: isEmpty ? [] : getCompletedSessionsMock(locale),
    });
  }

  return NextResponse.json({
    success: true,
    status: 'scheduled',
    data: isEmpty ? [] : getScheduledSessionsMock(locale),
  });
}

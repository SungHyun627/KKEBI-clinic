import { NextResponse } from 'next/server';
import { getSessionSummaryMock } from '@/shared/mock/session-summary';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') === 'en' ? 'en' : 'ko';

  return NextResponse.json({
    success: true,
    data: getSessionSummaryMock(sessionId, locale),
  });
}

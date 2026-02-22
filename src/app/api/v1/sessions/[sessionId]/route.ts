import { NextResponse } from 'next/server';
import { getSessionPageMock } from '@/shared/mock/session-page';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') === 'en' ? 'en' : 'ko';

  return NextResponse.json({
    success: true,
    data: getSessionPageMock(sessionId, locale),
  });
}

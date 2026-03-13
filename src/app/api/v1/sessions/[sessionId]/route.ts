import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/shared/server/backend-proxy';

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) => {
  const { sessionId } = await params;
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') === 'en' ? 'en' : 'ko';

  try {
    const query = new URLSearchParams();
    query.set('locale', locale);
    const proxied = await proxyToBackend(request, {
      method: 'GET',
      path: `/api/v1/sessions/${encodeURIComponent(sessionId)}?${query.toString()}`,
    });
    return proxied;
  } catch {
    return NextResponse.json(
      {
        code: 'INTERNAL_SERVER_ERROR',
        message: '상담 세션 정보 조회 중 오류가 발생했습니다.',
      },
      { status: 500 },
    );
  }
};

import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/shared/server/backend-proxy';

export const POST = async (
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) => {
  const { sessionId } = await params;

  try {
    const proxied = await proxyToBackend(request, {
      method: 'POST',
      path: `/api/v1/sessions/${encodeURIComponent(sessionId)}/complete`,
    });

    return proxied;
  } catch {
    return NextResponse.json(
      {
        code: 'INTERNAL_SERVER_ERROR',
        message: '상담 세션 종료 처리 중 오류가 발생했습니다.',
      },
      { status: 500 },
    );
  }
};

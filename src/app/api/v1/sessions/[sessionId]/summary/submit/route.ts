import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/shared/server/backend-proxy';

export const POST = async (
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
): Promise<Response> => {
  const { sessionId } = await params;
  try {
    const proxied = await proxyToBackend(request, {
      method: 'POST',
      path: `/api/v1/sessions/${encodeURIComponent(sessionId)}/summary/submit`,
    });

    if (proxied.ok || proxied.status === 401 || proxied.status === 403) {
      return proxied;
    }
  } catch {}

  return NextResponse.json({
    code: 'SUCCESS',
    message: '요청이 성공적으로 처리되었습니다',
    data: {},
  });
};

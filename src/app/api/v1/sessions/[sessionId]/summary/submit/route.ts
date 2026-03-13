import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/shared/server/backend-proxy';

export const POST = async (
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
): Promise<Response> => {
  const { sessionId } = await params;
  const locale = request.headers.get('accept-language')?.toLowerCase().startsWith('en')
    ? 'en'
    : 'ko';
  try {
    return await proxyToBackend(request, {
      method: 'POST',
      path: `/api/v1/sessions/${encodeURIComponent(sessionId)}/summary/submit`,
    });
  } catch {
    return NextResponse.json(
      {
        code: 'INTERNAL_SERVER_ERROR',
        message:
          locale === 'en'
            ? 'An error occurred while submitting session summary.'
            : '상담 요약 제출 중 오류가 발생했습니다.',
      },
      { status: 500 },
    );
  }
};

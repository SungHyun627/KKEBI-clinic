import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/shared/server/backend-proxy';
import { getSessionSummaryMock } from '@/features/summary/lib/summary-mock';
import type { SummaryPayload } from '@/features/summary/types/summary';

interface BackendSummaryEnvelope {
  code?: string;
  message?: string;
  data?: SummaryPayload;
}

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) => {
  const { sessionId: sessionIdParam } = await params;
  const sessionId = Number(sessionIdParam);
  if (!Number.isFinite(sessionId)) {
    return NextResponse.json(
      { success: false, message: 'sessionId must be a number.' },
      { status: 400 },
    );
  }
  const locale = request.headers.get('accept-language')?.toLowerCase().startsWith('en')
    ? 'en'
    : 'ko';

  try {
    const proxied = await proxyToBackend(request, {
      method: 'GET',
      path: `/api/v1/sessions/${encodeURIComponent(String(sessionId))}/summary`,
    });

    if (proxied.status === 401 || proxied.status === 403) {
      return proxied;
    }

    const payload = (await proxied.json().catch(() => null)) as BackendSummaryEnvelope | null;
    const isSuccess = proxied.ok && payload?.code === 'SUCCESS' && Boolean(payload.data);

    if (isSuccess) {
      return NextResponse.json({
        success: true,
        message: payload?.message,
        data: payload?.data,
      });
    }

    console.error('[session-summary][backend-error]', {
      sessionId,
      status: proxied.status,
      code: payload?.code,
      message: payload?.message,
    });
  } catch (error) {
    console.error('[session-summary][proxy-exception]', {
      sessionId,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  return NextResponse.json({
    success: true,
    data: getSessionSummaryMock(sessionId, locale),
  });
};

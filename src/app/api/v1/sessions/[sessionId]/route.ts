import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/shared/server/backend-proxy';
import { getSessionPageMock } from '@/shared/mock/session-page';

interface BackendSessionPageData {
  scheduledAt?: string;
  clientName?: string;
  sessionNumber?: number;
  sessionType?: string;
  riskType?: string;
  contact?: string;
}

interface BackendSessionPageEnvelope {
  code?: string;
  message?: string;
  data?: BackendSessionPageData;
}

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

    if (proxied.status === 401 || proxied.status === 403) {
      return proxied;
    }

    const payload = (await proxied.json().catch(() => null)) as BackendSessionPageEnvelope | null;
    const isSuccess = proxied.ok && payload?.code === 'SUCCESS' && Boolean(payload.data);

    if (isSuccess) {
      return NextResponse.json(payload, { status: proxied.status });
    }
  } catch {}

  const mock = getSessionPageMock(sessionId, locale);
  return NextResponse.json({
    code: 'SUCCESS',
    message: '요청이 성공적으로 처리되었습니다',
    data: {
      scheduledAt: mock.scheduledAt,
      clientName: mock.clientName,
      sessionNumber: mock.sessionNumber,
      sessionType: mock.sessionType,
      riskType: mock.riskType,
      contact: mock.contact,
    },
  });
};

import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/shared/server/backend-proxy';
import type { SessionStatus } from '@/features/sessions/session-list/types/session-list';
import { buildSessionListMockEnvelope } from '@/features/sessions/session-list/lib/mock-sessions';

const getSessionListMockResponse = (status: SessionStatus, locale: 'ko' | 'en') =>
  NextResponse.json(buildSessionListMockEnvelope(status, locale));

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const status = (
    searchParams.get('status') === 'completed' ? 'completed' : 'scheduled'
  ) as SessionStatus;
  const locale = searchParams.get('locale') === 'en' ? 'en' : 'ko';
  const query = new URLSearchParams();
  query.set('status', status);
  query.set('locale', locale);

  try {
    const proxied = await proxyToBackend(request, {
      method: 'GET',
      path: `/api/v1/sessions?${query.toString()}`,
    });
    if (proxied.status === 401 || proxied.status === 403) {
      return proxied;
    }

    if (proxied.ok) {
      const payload = await proxied.json().catch(() => null);
      if (payload && typeof payload === 'object') {
        const data = (
          payload as { data?: { scheduledSessions?: unknown[]; completedSessions?: unknown[] } }
        ).data;
        if (status === 'scheduled') {
          const list = Array.isArray(data?.scheduledSessions) ? data.scheduledSessions : [];
          if (list.length === 0) return getSessionListMockResponse(status, locale);
        } else {
          const list = Array.isArray(data?.completedSessions) ? data.completedSessions : [];
          if (list.length === 0) return getSessionListMockResponse(status, locale);
        }
      }
      return NextResponse.json(payload);
    }
  } catch {}

  return getSessionListMockResponse(status, locale);
};

export const POST = async (request: Request) => {
  try {
    const proxied = await proxyToBackend(request, {
      method: 'POST',
      path: '/api/v1/sessions',
    });
    return proxied;
  } catch {
    return NextResponse.json(
      {
        code: 'INTERNAL_SERVER_ERROR',
        message: '상담 세션 생성 중 오류가 발생했습니다.',
      },
      { status: 500 },
    );
  }
};

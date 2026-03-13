import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/shared/server/backend-proxy';
import type { SessionStatus } from '@/features/sessions/session-list/types/session-list';

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
    return proxied;
  } catch {
    return NextResponse.json(
      {
        code: 'INTERNAL_SERVER_ERROR',
        message: '상담 세션 목록 조회 중 오류가 발생했습니다.',
      },
      { status: 500 },
    );
  }
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

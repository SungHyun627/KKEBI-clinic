import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/shared/server/backend-proxy';

export async function GET(request: Request) {
  const locale = request.headers.get('accept-language')?.toLowerCase().startsWith('en')
    ? 'en'
    : 'ko';
  try {
    return await proxyToBackend(request, {
      method: 'GET',
      path: '/api/v1/clients/terminated',
    });
  } catch {
    return NextResponse.json(
      {
        code: 'INTERNAL_SERVER_ERROR',
        message:
          locale === 'en'
            ? 'An error occurred while loading terminated client list.'
            : '종결 상담자 목록 조회 중 오류가 발생했습니다.',
      },
      { status: 500 },
    );
  }
}

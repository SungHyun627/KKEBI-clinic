import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/shared/server/backend-proxy';

export async function GET(request: Request) {
  try {
    return await proxyToBackend(request, {
      method: 'GET',
      path: '/api/v1/clients/closed',
    });
  } catch {
    return NextResponse.json(
      {
        code: 'INTERNAL_SERVER_ERROR',
        message: '종결 상담자 목록 조회 중 오류가 발생했습니다.',
      },
      { status: 500 },
    );
  }
}

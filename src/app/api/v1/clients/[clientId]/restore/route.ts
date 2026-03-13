import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/shared/server/backend-proxy';

export async function PATCH(request: Request, context: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await context.params;

  try {
    return await proxyToBackend(request, {
      method: 'PATCH',
      path: `/api/v1/clients/${clientId}/restore`,
    });
  } catch {
    return NextResponse.json(
      {
        code: 'INTERNAL_SERVER_ERROR',
        message: '내담자 복구 처리 중 오류가 발생했습니다.',
      },
      { status: 500 },
    );
  }
}

export const POST = PATCH;

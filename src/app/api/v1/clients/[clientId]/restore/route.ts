import { NextResponse } from 'next/server';
import { restoreClosedClient } from '@/shared/mock/client-lifecycle-store';

export async function POST(_request: Request, context: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await context.params;
  const restored = restoreClosedClient(clientId);

  if (!restored) {
    return NextResponse.json(
      {
        success: false,
        message: '내담자 정보를 찾을 수 없습니다.',
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      clientId: restored.clientId,
      restoredAt: new Date().toISOString(),
    },
  });
}

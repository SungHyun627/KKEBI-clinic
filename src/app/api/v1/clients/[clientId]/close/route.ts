import { NextResponse } from 'next/server';
import { closeActiveClient, findActiveClient } from '@/shared/mock/client-lifecycle-store';
import type { ClientClosePayload, ClientCloseReason } from '@/features/clients';

const VALID_REASONS: ClientCloseReason[] = ['session-complete', 'dropout', 'other'];

export async function POST(request: Request, context: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await context.params;
  const target = findActiveClient(clientId);

  if (!target) {
    return NextResponse.json(
      {
        success: false,
        message: '내담자 정보를 찾을 수 없습니다.',
      },
      { status: 404 },
    );
  }

  const body = (await request.json().catch(() => null)) as ClientClosePayload | null;
  if (!body || !VALID_REASONS.includes(body.reason)) {
    return NextResponse.json(
      {
        success: false,
        message: '요청 본문이 올바르지 않습니다.',
      },
      { status: 400 },
    );
  }

  const closedItem = closeActiveClient(clientId, body.reason);
  if (!closedItem) {
    return NextResponse.json(
      {
        success: false,
        message: '내담자 종결 처리에 실패했습니다.',
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      clientId,
      reason: body.reason,
      detail: body.detail,
      closedAt: new Date().toISOString(),
    },
  });
}

import { NextResponse } from 'next/server';
import { TODAY_SCHEDULES_MOCK } from '@/shared/mock/today-schedules';
import type { ClientClosePayload, ClientCloseReason } from '@/features/clients';

const VALID_REASONS: ClientCloseReason[] = ['session-complete', 'dropout', 'other'];

export async function POST(request: Request, context: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await context.params;
  const target = TODAY_SCHEDULES_MOCK.find((item) => item.clientId === clientId);

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

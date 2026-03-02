import { NextResponse } from 'next/server';
import type { components } from '@/shared/api/generated-types';

type ClientTestResultRequest = components['schemas']['ClientTestResultRequest'];

export async function POST(request: Request, context: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await context.params;
  const parsedClientId = Number(clientId);
  const body = (await request.json().catch(() => null)) as ClientTestResultRequest | null;

  if (!Number.isFinite(parsedClientId)) {
    return NextResponse.json(
      {
        success: false,
        message: '유효하지 않은 내담자 ID입니다.',
      },
      { status: 400 },
    );
  }

  if (!body?.testName?.trim() || typeof body.score !== 'number') {
    return NextResponse.json(
      {
        success: false,
        message: '검사 결과 요청 값이 올바르지 않습니다.',
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    success: true,
  });
}

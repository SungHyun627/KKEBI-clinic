import { NextResponse } from 'next/server';
import { proxyToBackend } from '@/shared/server/backend-proxy';
import type { components } from '@/shared/api/generated-types';

type RegisterClientRequest = components['schemas']['ClientRegistrationRequest'];

let mockClientIdSeed = 10000;

export async function GET(request: Request) {
  return proxyToBackend(request, { method: 'GET', path: '/api/v1/clients' });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as RegisterClientRequest | null;

  if (!body?.name?.trim()) {
    return NextResponse.json(
      {
        success: false,
        message: '내담자 이름이 필요합니다.',
      },
      { status: 400 },
    );
  }

  mockClientIdSeed += 1;

  return NextResponse.json({
    success: true,
    data: {
      clientId: mockClientIdSeed,
    },
  });
}

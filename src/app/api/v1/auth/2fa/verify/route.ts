import { NextResponse } from 'next/server';

// /api/v1/auth/2fa/verify
export async function POST(request: Request) {
  const { code } = await request.json();

  // Mock: code === '123456' 성공, 그 외 실패
  if (code === '123456') {
    return NextResponse.json({ ok: true, token: 'mock-jwt-token' });
  }
  return NextResponse.json({ ok: false, error: 'Invalid code' }, { status: 401 });
}

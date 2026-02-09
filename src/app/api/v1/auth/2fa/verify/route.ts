import { NextResponse } from 'next/server';

// /api/v1/auth/2fa/verify
async function verify2faCodeHandler(request: Request) {
  const { code } = await request.json();
  if (code === '123456') {
    return NextResponse.json({ ok: true, token: 'mock-jwt-token' });
  }
  return NextResponse.json({ ok: false, error: 'Invalid code' }, { status: 401 });
}

export { verify2faCodeHandler as POST };

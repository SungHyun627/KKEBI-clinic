import { NextResponse } from 'next/server';

// /api/v1/auth/2fa/resend
export async function POST(request: Request) {
  // Mock: 항상 성공 응답
  return NextResponse.json({ ok: true, message: '새 인증 코드가 발송되었습니다.' });
}

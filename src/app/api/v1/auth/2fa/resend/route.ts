import { NextResponse } from 'next/server';

// /api/v1/auth/2fa/resend
async function resend2faCodeHandler() {
  return NextResponse.json({ ok: true, message: '새 인증 코드가 발송되었습니다.' });
}

export async function POST() {
  return resend2faCodeHandler();
}

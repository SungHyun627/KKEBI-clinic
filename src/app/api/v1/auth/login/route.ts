import { NextResponse } from 'next/server';

type LoginPayload = {
  email?: string;
  password?: string;
};

async function loginHandler(request: Request) {
  const body = (await request.json().catch(() => ({}))) as LoginPayload;
  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? '';
  const isValid = email === 'demo@kkebi.com' && password === 'kkebi1234';
  if (!isValid) {
    return NextResponse.json({ ok: false, message: '로그인에 실패했습니다.' }, { status: 401 });
  }
  return NextResponse.json({ ok: true, message: '로그인 성공' });
}

export async function POST(request: Request) {
  return loginHandler(request);
}

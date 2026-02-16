import { NextRequest, NextResponse } from 'next/server';

// 비밀번호 재설정 링크 요청
async function requestResetPasswordHandler(request: NextRequest) {
  const { email } = await request.json();

  if (email) {
    // TODO: 이메일로 비밀번호 재설정 링크 발송
    return NextResponse.json({
      success: true,
      message: '비밀번호 재설정 링크가 이메일로 발송되었습니다.',
    });
  }

  return NextResponse.json({ success: false, message: '잘못된 요청입니다.' }, { status: 400 });
}

export async function POST(request: NextRequest) {
  return requestResetPasswordHandler(request);
}

import { NextRequest, NextResponse } from 'next/server';

// 실제 비밀번호 재설정 (reset)
async function resetPasswordHandler(request: NextRequest) {
  const { email, newPassword } = await request.json();

  if (email && newPassword) {
    // TODO: 비밀번호 변경 로직
    return NextResponse.json({ success: true, message: '비밀번호가 성공적으로 변경되었습니다.' });
  }

  return NextResponse.json({ success: false, message: '잘못된 요청입니다.' }, { status: 400 });
}

export async function POST(request: NextRequest) {
  return resetPasswordHandler(request);
}

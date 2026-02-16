import { NextResponse } from 'next/server';

async function logoutHandler() {
  return NextResponse.json({ success: true, message: '로그아웃되었습니다.' });
}

export async function POST() {
  return logoutHandler();
}

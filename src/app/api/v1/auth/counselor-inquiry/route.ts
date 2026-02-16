import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { name, email, phone, organization, licenseNumber } = body as {
    name?: string;
    email?: string;
    phone?: string;
    organization?: string;
    licenseNumber?: string;
  };

  if (!name || !email || !phone || !organization || !licenseNumber) {
    return NextResponse.json(
      { success: false, message: '필수 항목을 입력해주세요.' },
      { status: 400 },
    );
  }

  return NextResponse.json({
    success: true,
    message: '문의가 접수되었습니다.',
  });
}

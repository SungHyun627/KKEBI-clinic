import { NextResponse } from 'next/server';

interface StartSessionRequestBody {
  clientId?: string;
  scheduleId?: string;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as StartSessionRequestBody | null;

  if (!body?.clientId || typeof body.clientId !== 'string') {
    return NextResponse.json(
      {
        success: false,
        message: 'clientId is required',
      },
      { status: 400 },
    );
  }

  const sessionId = `session_${crypto.randomUUID()}`;

  return NextResponse.json({
    success: true,
    data: { sessionId },
  });
}

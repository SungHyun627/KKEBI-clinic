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

  const normalizedScheduleId =
    typeof body.scheduleId === 'string' && body.scheduleId.length > 0
      ? body.scheduleId.replace(/^scheduled-/, '').replace(/^completed-/, '')
      : null;

  const sessionRef = normalizedScheduleId ?? `client-${body.clientId}`;
  const sessionId = `session_${sessionRef}_${body.clientId}_${Date.now()}`;

  return NextResponse.json({
    success: true,
    data: { sessionId },
  });
}

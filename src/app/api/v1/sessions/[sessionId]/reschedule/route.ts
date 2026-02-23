import { NextResponse } from 'next/server';

interface RescheduleBody {
  sessionDate?: string;
  startTime?: string;
  endTime?: string;
}

const TIME_PATTERN = /^\d{2}:\d{2}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;

  let body: RescheduleBody = {};
  try {
    body = (await request.json()) as RescheduleBody;
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: '요청 본문이 올바르지 않습니다.',
      },
      { status: 400 },
    );
  }

  const { sessionDate, startTime, endTime } = body;
  if (!sessionDate || !startTime || !endTime) {
    return NextResponse.json(
      {
        success: false,
        message: '날짜와 시작/종료 시간을 모두 입력해주세요.',
      },
      { status: 400 },
    );
  }

  if (
    !DATE_PATTERN.test(sessionDate) ||
    !TIME_PATTERN.test(startTime) ||
    !TIME_PATTERN.test(endTime)
  ) {
    return NextResponse.json(
      {
        success: false,
        message: '날짜 또는 시간 형식이 올바르지 않습니다.',
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    success: true,
    message: '상담 일정이 변경되었습니다.',
    data: {
      sessionId,
      sessionDate,
      startTime,
      endTime,
    },
  });
}

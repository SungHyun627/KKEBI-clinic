import { NextResponse } from 'next/server';

interface SubmitSummaryBody {
  summaryText?: string;
  riskEvaluation?: 'stable' | 'caution' | 'risk' | 'urgent';
  followUpSessionTiming?: '1w' | '2w' | '1m' | 'as-needed';
  selectedMissionIds?: string[];
  nextSession?: {
    date?: string;
    startTime?: string;
    endTime?: string;
  } | null;
}

const VALID_RISK = new Set(['stable', 'caution', 'risk', 'urgent']);
const VALID_FOLLOW_UP = new Set(['1w', '2w', '1m', 'as-needed']);
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^\d{2}:\d{2}$/;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;

  let body: SubmitSummaryBody = {};
  try {
    body = (await request.json()) as SubmitSummaryBody;
  } catch {
    return NextResponse.json(
      { success: false, message: '요청 본문이 올바르지 않습니다.' },
      { status: 400 },
    );
  }

  if (!body.riskEvaluation || !VALID_RISK.has(body.riskEvaluation)) {
    return NextResponse.json(
      { success: false, message: '위험 수준 선택값이 올바르지 않습니다.' },
      { status: 400 },
    );
  }

  if (!body.followUpSessionTiming || !VALID_FOLLOW_UP.has(body.followUpSessionTiming)) {
    return NextResponse.json(
      { success: false, message: '다음 상담 시기 선택값이 올바르지 않습니다.' },
      { status: 400 },
    );
  }

  if (!Array.isArray(body.selectedMissionIds) || body.selectedMissionIds.length === 0) {
    return NextResponse.json(
      { success: false, message: '권장 미션을 하나 이상 선택해주세요.' },
      { status: 400 },
    );
  }

  if (body.nextSession) {
    const { date, startTime, endTime } = body.nextSession;
    if (!date || !startTime || !endTime) {
      return NextResponse.json(
        { success: false, message: '다음 상담 예약 정보가 올바르지 않습니다.' },
        { status: 400 },
      );
    }
    if (!DATE_PATTERN.test(date) || !TIME_PATTERN.test(startTime) || !TIME_PATTERN.test(endTime)) {
      return NextResponse.json(
        { success: false, message: '다음 상담 예약 날짜/시간 형식이 올바르지 않습니다.' },
        { status: 400 },
      );
    }
  }

  return NextResponse.json({
    success: true,
    message: '상담 요약 제출이 완료되었습니다.',
    data: {
      sessionId,
    },
  });
}

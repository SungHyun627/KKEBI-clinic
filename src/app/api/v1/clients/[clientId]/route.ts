import { NextResponse } from 'next/server';
import { TODAY_SCHEDULES_MOCK } from '@/shared/mock/today-schedules';
import type { ClientDetailData, RiskReason } from '@/features/clients';

const CHIEF_CONCERNS = ['우울', '스트레스', '수면'] as const;
const RISK_REASON_MAP: Record<string, RiskReason[]> = {
  위험: ['자살 언급', '자해 시도'],
  주의: ['자해 시도'],
  안정: [],
};

export async function GET(_request: Request, context: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await context.params;

  const target = TODAY_SCHEDULES_MOCK.find((item) => item.clientId === clientId);
  if (!target) {
    return NextResponse.json(
      {
        success: false,
        message: '내담자 상세 정보를 찾을 수 없습니다.',
      },
      { status: 404 },
    );
  }

  const moodScore = target.moodScore ?? 0;
  const stressScore = target.stressScore ?? 0;
  const energyScore =
    target.moodScore === null && target.stressScore === null
      ? 0
      : Math.max(0, Math.min(5, moodScore + 1 - Math.floor(stressScore / 2)));

  const concernIndex = Number(target.clientId.replace(/\D/g, '')) % CHIEF_CONCERNS.length;
  const primaryConcern = CHIEF_CONCERNS[concernIndex];
  const riskReasons = RISK_REASON_MAP[target.riskType];

  const detail: ClientDetailData = {
    time: target.time,
    clientId: target.clientId,
    clientName: target.clientName,
    streakDays: target.streakDays ?? 0,
    riskType: target.riskType,
    moodScore,
    stressScore,
    energyScore,
    chiefConcern: [...CHIEF_CONCERNS],
    age: 29 + (Number(target.clientId.replace(/\D/g, '')) % 12),
    gender: Number(target.clientId.replace(/\D/g, '')) % 2 === 0 ? '여성' : '남성',
    counselingStartDate: '2025-03-05',
    currentSession: 4,
    totalSession: 10,
    visitPurpose: primaryConcern,
    nextCounselingAt: `2026-02-20 ${target.time}`,
    recentRisks:
      riskReasons.length > 0
        ? [
            { date: '2026-02-10', reasons: riskReasons },
            { date: '2026-02-03', reasons: [riskReasons[0]] },
          ]
        : [],
    recentCheckins: [
      {
        date: '2026-02-12',
        time: '21:20',
        moodScore,
        stressScore,
        energyScore,
      },
      {
        date: '2026-02-08',
        time: '22:05',
        moodScore: Math.max(0, moodScore - 1),
        stressScore: Math.min(5, stressScore + 1),
        energyScore: Math.max(0, energyScore - 1),
      },
    ],
    counselingHistory: [
      {
        dateTime: '2026-02-11 14:00',
        chiefConcern: primaryConcern,
        taskName: '감정 기록 3회 작성',
        taskStatus: '진행중',
        paymentStatus: '완납',
      },
      {
        dateTime: '2026-02-04 14:00',
        chiefConcern: CHIEF_CONCERNS[(concernIndex + 1) % CHIEF_CONCERNS.length],
        taskName: '수면 루틴 체크',
        taskStatus: '완수',
        paymentStatus: '완납',
      },
    ],
    scaleResults: {
      phq9: target.riskType === '위험' ? 21 : target.riskType === '주의' ? 13 : 6,
      pss10: target.riskType === '위험' ? 31 : target.riskType === '주의' ? 24 : 16,
      mbi: target.riskType === '위험' ? 62 : target.riskType === '주의' ? 49 : 35,
      etc: 'GAD-7: 9점',
    },
    intakeAnswers: {
      reasonForVisit: '최근 업무 스트레스로 인해 수면과 집중 저하를 경험함',
      expectedChange: '감정 조절 능력 향상 및 수면 패턴 안정화',
      similarPastExperience: '있음',
      triedMethod: '운동과 명상 앱 사용',
      methodEffectiveness: '일시적으로만 효과가 있었음',
      biggestConcern: '아침 기상 후 무기력과 불안',
      sleepPattern: '평균 5~6시간 수면',
      sleepQuality: '중간에 1~2회 자주 깸',
      exerciseHabit: '주 2회 가벼운 유산소',
      mealsPerDay: '하루 2끼',
      mostReliablePerson: '배우자',
      reliabilityReason: '정서적으로 안정감을 주고 꾸준히 대화함',
      familyBond: '보통',
      familyBondReason: '서로 지지하지만 대화 시간이 부족함',
      selfDescription: '책임감이 높지만 쉽게 긴장하는 사람',
    },
  };

  return NextResponse.json({
    success: true,
    data: detail,
  });
}

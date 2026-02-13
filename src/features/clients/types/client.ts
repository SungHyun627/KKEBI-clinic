import type { RiskType } from '@/features/dashboard';

export interface ClientLookupItem {
  time: string;
  clientId: string;
  clientName: string;
  streakDays: number;
  riskType: RiskType;
  moodScore: number;
  stressScore: number;
  energyScore: number;
  chiefConcern: string[];
}

export type RiskReason = '자살 언급' | '자해 시도' | '타해 위험';
export type TaskStatus = '완수' | '진행중' | '미완수';
export type PaymentStatus = '완납' | '미납';

export interface ClientRiskRecord {
  date: string;
  reasons: RiskReason[];
}

export interface ClientCheckinRecord {
  date: string;
  time: string;
  moodScore: number;
  stressScore: number;
  energyScore: number;
}

export interface ClientCounselingRecord {
  dateTime: string;
  chiefConcern: string;
  taskName: string;
  taskStatus: TaskStatus;
  paymentStatus: PaymentStatus;
}

export interface ClientIntakeAnswers {
  reasonForVisit: string;
  expectedChange: string;
  similarPastExperience: string;
  triedMethod: string;
  methodEffectiveness: string;
  biggestConcern: string;
  sleepPattern: string;
  sleepQuality: string;
  exerciseHabit: string;
  mealsPerDay: string;
  mostReliablePerson: string;
  reliabilityReason: string;
  familyBond: string;
  familyBondReason: string;
  selfDescription: string;
}

export interface ClientDetailData extends ClientLookupItem {
  age: number;
  gender: '남성' | '여성';
  counselingStartDate: string;
  currentSession: number;
  totalSession: number;
  visitPurpose: string;
  nextCounselingAt: string;
  recentRisks: ClientRiskRecord[];
  recentCheckins: ClientCheckinRecord[];
  counselingHistory: ClientCounselingRecord[];
  scaleResults: {
    phq9: number;
    pss10: number;
    mbi: number;
    etc: string;
  };
  intakeAnswers: ClientIntakeAnswers;
}

export interface ClientDetailResponse {
  success: boolean;
  data?: ClientDetailData;
  message?: string;
}

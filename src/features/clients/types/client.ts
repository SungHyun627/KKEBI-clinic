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
export type PaymentStatus = '납부' | '미납';
export type CounselingChiefConcern =
  | '직장'
  | '건강'
  | '돈'
  | '가족'
  | '연애•결혼'
  | '우정'
  | '진로•취업'
  | '반려동물'
  | '학업'
  | '기타';

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
  sleepScore: number;
}

export interface ClientCounselingRecord {
  dateTime: string;
  chiefConcern: CounselingChiefConcern;
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

export interface ClientDetailUpdatePayload {
  age: number;
  gender: ClientDetailData['gender'];
  counselingStartDate: string;
  currentSession: number;
  totalSession: number;
  visitPurpose: string;
  nextCounselingAt: string;
}

export interface ClientDetailUpdateResponse {
  success: boolean;
  data?: ClientDetailData;
  message?: string;
}

export type ClientCloseReason = 'session-complete' | 'dropout' | 'other';

export interface ClientClosePayload {
  reason: ClientCloseReason;
  detail: string;
}

export interface ClientCloseResponse {
  success: boolean;
  data?: {
    clientId: string;
    reason: ClientCloseReason;
    detail: string;
    closedAt: string;
  };
  message?: string;
}

export interface ClientRestoreResponse {
  success: boolean;
  data?: {
    clientId: string;
    restoredAt: string;
  };
  message?: string;
}

export type ClosedClientReasonLabel = '회기 종료' | '중도 탈락' | '기타';

export interface ClosedClientItem {
  id: string;
  clientId: string;
  counselingPeriod: string;
  clientName: string;
  ageGender: string;
  chiefConcern: string[];
  closeReason: ClosedClientReasonLabel;
}

export interface ClosedClientsResponse {
  success: boolean;
  data?: ClosedClientItem[];
  message?: string;
}

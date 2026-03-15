import type { RiskType } from '@/entities/dashboard/model/types';

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

export type ClientCloseReason = 'session-complete' | 'dropout' | 'other';

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

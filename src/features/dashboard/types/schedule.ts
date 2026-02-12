export type SessionType = '초기' | '정기' | '위기';
export type RiskType = '안정' | '주의' | '위험';

export interface TodayScheduleItem {
  id: string;
  time: string;
  clientId: string;
  clientName: string;
  sessionType: SessionType;
  riskType: RiskType;
  moodScore: number | null;
  stressScore: number | null;
  streakDays?: number;
}

export interface TodayScheduleResponse {
  success: boolean;
  data?: TodayScheduleItem[];
  message?: string;
}

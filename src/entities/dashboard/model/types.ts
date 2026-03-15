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

export interface RiskAlert {
  clientId: string;
  clientName: string;
  reasonKey?: 'riskAlertsPhqIncreased' | 'riskAlertsNoAppActivity7Days';
  reason?: string;
  detailPath: string;
}

export interface WeeklyStatistics {
  completedSessions: number;
  averageSessionMinutes: number;
  clientImprovementRate: number;
}

export interface WeeklyStatisticsResponse {
  success: boolean;
  data?: WeeklyStatistics;
  message?: string;
}

export interface RiskAlertsResponse {
  success: boolean;
  data?: RiskAlert[];
  message?: string;
}

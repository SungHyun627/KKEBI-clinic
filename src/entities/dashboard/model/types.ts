import type { RiskType, SessionType, TodayScheduleItem } from '@/shared/model/counseling';

export type { RiskType, SessionType, TodayScheduleItem };

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

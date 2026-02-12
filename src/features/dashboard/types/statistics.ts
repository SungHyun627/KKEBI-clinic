export interface RiskAlert {
  clientId: string;
  clientName: string;
  reason: string;
  detailPath: string;
}

export interface WeeklyStatistics {
  completedSessions: number;
  averageSessionMinutes: number;
  clientImprovementRate: number;
  riskAlerts?: RiskAlert[];
}

export interface WeeklyStatisticsResponse {
  success: boolean;
  data?: WeeklyStatistics;
  message?: string;
}

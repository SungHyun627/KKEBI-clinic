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

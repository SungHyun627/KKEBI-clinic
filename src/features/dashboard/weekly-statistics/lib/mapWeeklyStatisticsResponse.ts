export type WeeklyStatisticsMapped = {
  completedSessions: number;
  averageSessionMinutes: number;
  clientImprovementRate: number;
};

export type WeeklyStatisticsPayloadResolution =
  | { type: 'passthrough' }
  | { type: 'mapped'; data: WeeklyStatisticsMapped; message?: string }
  | { type: 'mock' };

export const normalizeWeeklyStatistics = (data: unknown): WeeklyStatisticsMapped | null => {
  if (typeof data !== 'object' || data === null) {
    return null;
  }

  const value = data as {
    completedSessions?: unknown;
    averageSessionMinutes?: unknown;
    clientImprovementRate?: unknown;
    completedCount?: unknown;
    avgDurationMinutes?: unknown;
    improvementRate?: unknown;
  };

  const completedSessions =
    typeof value.completedSessions === 'number'
      ? value.completedSessions
      : typeof value.completedCount === 'number'
        ? value.completedCount
        : null;
  const averageSessionMinutes =
    typeof value.averageSessionMinutes === 'number'
      ? value.averageSessionMinutes
      : typeof value.avgDurationMinutes === 'number'
        ? value.avgDurationMinutes
        : null;
  const clientImprovementRate =
    typeof value.clientImprovementRate === 'number'
      ? value.clientImprovementRate
      : typeof value.improvementRate === 'number'
        ? value.improvementRate
        : null;

  if (
    completedSessions === null ||
    averageSessionMinutes === null ||
    clientImprovementRate === null
  ) {
    return null;
  }

  return {
    completedSessions,
    averageSessionMinutes,
    clientImprovementRate,
  };
};

export const resolveWeeklyStatisticsPayload = (
  payload: unknown,
): WeeklyStatisticsPayloadResolution => {
  if (typeof payload !== 'object' || payload === null) {
    return { type: 'mock' };
  }

  if ('success' in payload) {
    const response = payload as { success?: boolean; data?: unknown; message?: unknown };
    if (!response.success) {
      return { type: 'passthrough' };
    }

    const mapped = normalizeWeeklyStatistics(response.data);
    if (!mapped) {
      return { type: 'mock' };
    }

    return {
      type: 'mapped',
      data: mapped,
      message: typeof response.message === 'string' ? response.message : undefined,
    };
  }

  if ('data' in payload) {
    const response = payload as { data?: unknown; message?: unknown };
    const mapped = normalizeWeeklyStatistics(response.data);
    if (!mapped) {
      return { type: 'mock' };
    }

    return {
      type: 'mapped',
      data: mapped,
      message: typeof response.message === 'string' ? response.message : undefined,
    };
  }

  return { type: 'mock' };
};

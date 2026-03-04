import type { TodayScheduleItem } from '@/features/dashboard/types/schedule';

export const extractScheduleItems = (data: unknown): unknown[] | null => {
  if (Array.isArray(data)) {
    return data;
  }

  if (typeof data !== 'object' || data === null) {
    return null;
  }

  const candidates = ['schedules', 'todaySchedules', 'items', 'content', 'results'] as const;
  for (const key of candidates) {
    const value = (data as Record<string, unknown>)[key];
    if (Array.isArray(value)) {
      return value;
    }
  }

  return null;
};

const mapSessionType = (value: unknown): TodayScheduleItem['sessionType'] => {
  if (value === 'REGULAR') return '정기';
  if (value === 'CRISIS') return '위기';
  return '초기';
};

const mapRiskType = (value: unknown): TodayScheduleItem['riskType'] => {
  if (value === 'RISK') return '위험';
  if (value === 'CAUTION') return '주의';
  return '안정';
};

const mapScheduledAtToTime = (value: unknown): string => {
  if (typeof value !== 'string' || !value.includes('T')) {
    return '10:00';
  }
  const [, timePart] = value.split('T');
  return timePart?.slice(0, 5) || '10:00';
};

const mapToTodayScheduleItem = (item: unknown): TodayScheduleItem | null => {
  if (typeof item !== 'object' || item === null) {
    return null;
  }

  const row = item as Record<string, unknown>;
  const sessionId = row.sessionId;
  const id =
    typeof sessionId === 'number' || typeof sessionId === 'string'
      ? String(sessionId)
      : typeof row.id === 'string'
        ? row.id
        : null;

  if (!id) {
    return null;
  }

  const clientName = typeof row.clientName === 'string' ? row.clientName : `내담자 ${id}`;
  const clientId =
    typeof row.clientId === 'string'
      ? row.clientId
      : typeof row.clientId === 'number'
        ? String(row.clientId)
        : `client-${id}`;

  return {
    id,
    time: mapScheduledAtToTime(row.scheduledAt),
    clientId,
    clientName,
    sessionType: mapSessionType(row.sessionType),
    riskType: mapRiskType(row.riskLevel),
    moodScore: typeof row.moodScore === 'number' ? row.moodScore : null,
    stressScore: typeof row.stressScore === 'number' ? row.stressScore : null,
    streakDays: typeof row.streakDays === 'number' ? row.streakDays : 0,
  };
};

export const normalizeTodaySchedules = (schedules: unknown[]): TodayScheduleItem[] =>
  schedules.map(mapToTodayScheduleItem).filter((item): item is TodayScheduleItem => item !== null);

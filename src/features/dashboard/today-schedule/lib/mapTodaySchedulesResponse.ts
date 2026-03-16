import type { TodayScheduleItem } from '@/entities/dashboard/model/types';

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
  if (value === '정기') return '정기';
  if (value === '위기') return '위기';
  if (value === '초기') return '초기';
  if (value === 'REGULAR') return '정기';
  if (value === 'CRISIS') return '위기';
  return '초기';
};

const mapRiskType = (value: unknown): TodayScheduleItem['riskType'] => {
  if (value === '위험') return '위험';
  if (value === '주의') return '주의';
  if (value === '안정') return '안정';
  if (value === 'RISK') return '위험';
  if (value === 'CAUTION') return '주의';
  return '안정';
};

const mapScheduledAtToTime = (value: unknown): string => {
  if (typeof value !== 'string') {
    return '10:00';
  }

  if (/^\d{2}:\d{2}$/.test(value)) {
    return value;
  }

  const hasTimezone = /(?:Z|[+\-]\d{2}:\d{2})$/i.test(value);
  // scheduledAt 이 타임존 없이 내려오면 KST 로컬 시각으로 해석한다.
  const normalizedValue = hasTimezone ? value : `${value}+09:00`;
  const parsedDate = new Date(normalizedValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return '10:00';
  }

  const formatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const formatted = formatter.format(parsedDate); // sv-SE => "HH:mm"
  const [hours = '10', minutes = '00'] = formatted.split(':');
  return `${hours}:${minutes}`;
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
    time: mapScheduledAtToTime(row.scheduledAt ?? row.time),
    clientId,
    clientName,
    sessionType: mapSessionType(row.sessionType),
    riskType: mapRiskType(row.riskLevel ?? row.riskType),
    moodScore: typeof row.moodScore === 'number' ? row.moodScore : null,
    stressScore: typeof row.stressScore === 'number' ? row.stressScore : null,
    streakDays: typeof row.streakDays === 'number' ? row.streakDays : 0,
  };
};

export const normalizeTodaySchedules = (schedules: unknown[]): TodayScheduleItem[] =>
  schedules.map(mapToTodayScheduleItem).filter((item): item is TodayScheduleItem => item !== null);
